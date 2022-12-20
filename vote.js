import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const addCandidati = document.getElementById("addVoter");

Vote();
const voter = document.getElementById("voteClick");
voter.onclick = clickVoter;
async function Vote() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];
    const currentVoter = await contract.voterDetails(account);
    console.log(currentVoter);
    let count = await contract.getTotalCandidate();
    const num = Number(count);
    console.log(num);
    if (currentVoter.isRegistered === false) {
      const targList = document.getElementsByClassName("voteContent");
      if (targList) {
        for (var x = 0; x < targList.length; x++) {
          targList[x].style.visibility = "hidden";
        }
      }
      document.getElementById("registration").innerHTML =
        "Please Register First";
    }
    if (currentVoter.hasVoted === true) {
      const targList = document.getElementsByClassName("voteContent");
      if (targList) {
        for (var x = 0; x < targList.length; x++) {
          targList[x].style.visibility = "hidden";
        }
      }
      document.getElementById("registration").innerHTML =
        "You have already Voted";
    }
    let candidates = [];
    for (let i = 1; i <= num; i++) {
      const candidate = await contract.candidateDetails(i - 1);
      candidates.push(candidate.header);
    }
    console.log(candidates);
    let list = document.getElementById("olList");
    candidates.forEach((item) => {
      let li = document.createElement("li");
      li.innerText = item;
      list.appendChild(li);
    });
  } else {
    withdrawButton.innerHTML = "Please install MetaMask";
  }
}
async function clickVoter() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      let id = document.getElementById("canId").value;

      const transactionResponse = await contract.vote(id - 1);
      await listenForTransactionMine(transactionResponse, provider);
      //await transactionResponse.wait(1)
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
