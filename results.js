import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const provider = new ethers.providers.Web3Provider(window.ethereum);
displayResult();

async function displayResult() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const start = await contract.getStart();
    const end = await contract.getEnd();
    let maxVotes = 0;
    let winner = 0;
    let count = await contract.getTotalCandidate();
    const num = Number(count);

    if (!start && end) {
      for (let i = 1; i <= num; i++) {
        const candidate = await contract.candidateDetails(i - 1);
        if (candidate.voteCount > maxVotes) {
          winner = candidate.header;
          maxVotes = candidate.voteCount;
        }
      }
      document.getElementById("notify").innerHTML = "Winner is ".concat(winner);
    }
    if (start && !end) {
      document.getElementById("notify").innerHTML = "Election is Going on";
    }
    if (!start && !end) {
      document.getElementById("notify").innerHTML =
        "Election has not started yet";
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask";
  }
}
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
