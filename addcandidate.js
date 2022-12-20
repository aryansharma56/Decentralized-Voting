import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const addCandidati = document.getElementById("addCandidateee");
addCandidati.onclick = addCandidate;
//console.log("hey");
async function addCandidate() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      let header = document.getElementById("header").value;
      let slogar = document.getElementById("slogan").value;
      const transactionResponse = await contract.addCandidate(header, slogar);
      await listenForTransactionMine(transactionResponse, provider);
      // await transactionResponse.wait(1)
    } catch (error) {
      console.log(error);
    }
    const count = await contract.getTotalCandidate();
    console.log(count);
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
