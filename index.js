import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const startButton = document.getElementById("startElection");
const endButton = document.getElementById("endElection");
startButton.onclick = election;
endButton.onclick = endElection;
connect();

async function connect() {
  let accounts = await provider.send("eth_requestAccounts", []);
  let account = accounts[0];
  console.log(account);
  const name = document.getElementById("nameAccount");
  name.innerHTML = "Your public key is ".concat(account);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const admin = await contract.getAdmin();
  console.log(typeof admin);
  const startEl = await contract.getStart();
  const endEl = await contract.getEnd();
  console.log(startEl);
  if (admin.toString() !== account.toString()) {
    document.getElementById("admin").style.visibility = "hidden";
    document.getElementById("addCandidate").style.visibility = "hidden";
    document.getElementById("electionForm").style.visibility = "hidden";
    document.getElementById("endElection").style.visibility = "hidden";
    //document.getElementById("electionStart").style.visibility = "visible";
  } else {
    if (startEl === false) {
      document.getElementById("endElection").style.visibility = "hidden";
    }
    if (startEl === true) {
      // document.getElementById("admin").style.visibility = "hidden";
      // document.getElementById("addCandidate").style.visibility = "hidden";
      document.getElementById("electionForm").style.visibility = "hidden";
      document.getElementById("electionStart").style.visibility = "visible";
      document.getElementById("endElection").style.visibility = "visible";
    }
    if (startEl == false && endEl == true) {
      // document.getElementById("admin").style.visibility = "hidden";
      // document.getElementById("addCandidate").style.visibility = "hidden";
      document.getElementById("electionForm").style.visibility = "hidden";
      document.getElementById("electionStart").innerHTML =
        "Please Redeploy the contract";
      document.getElementById("electionStart").style.visibility = "visible";
    }
  }
}
async function election() {
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const electionTitle = document.getElementById("electionTitle").value;
  const organization = document.getElementById("organization").value;
  try {
    const transactionResponse = await contract.setElectionDetails(
      "Aryan",
      "aryansharma",
      "aryan",
      electionTitle,
      organization
    );

    await listenForTransactionMine(transactionResponse, provider);
    document.getElementById("electionForm").style.visibility = "hidden";
    document.getElementById("electionStart").style.visibility = "visible";
  } catch (error) {
    console.log(error);
  }
  const name = await contract.getAdminName();
  //await listenForTransactionMine(transactionResponse, provider);
  console.log(name);
}
async function endElection() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.endElection();
      await listenForTransactionMine(transactionResponse, provider);
      // await transactionResponse.wait(1)
    } catch (error) {
      console.log(error);
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
