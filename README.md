# Decentralized Voting DApp (Frontend)

This is the **frontend client** for a decentralized voting (election) smart contract, built using **JavaScript**, **Ethers.js**, and **MetaMask**.
It allows an admin to start and end an election, while dynamically controlling UI access based on the connected wallet.

---

## Tech Stack

* **JavaScript (ES Modules)**
* **Ethers.js v5.6**
* **MetaMask**
* **Ethereum Smart Contract**
* **HTML/CSS (DOM-based UI control)**

---

## Features

* 🔐 Wallet connection via MetaMask
* 👑 Admin-only controls
* 🗳 Start election with custom details
* ⛔ End election on-chain
* 🔄 Real-time UI updates based on contract state
* ⛓ Transaction confirmation tracking

---

## How It Works

### Wallet Connection

* Connects to MetaMask using `ethers.providers.Web3Provider`
* Fetches the active Ethereum account
* Displays the connected public key

### Admin Validation

* Calls `getAdmin()` from the smart contract
* Compares admin address with connected wallet
* Hides admin-only UI elements for non-admin users

### Election State Handling

Uses smart contract flags:

* `getStart()` → whether election has started
* `getEnd()` → whether election has ended

UI updates dynamically based on these states.

---

## Contract Interaction

The frontend interacts with the deployed smart contract using:

* **Contract ABI**
* **Contract Address**
* **Signer (MetaMask wallet)**

```js
const contract = new ethers.Contract(contractAddress, abi, signer);
```

---

## Available Actions

### Start Election (Admin Only)

* Reads election title and organization from input fields
* Calls `setElectionDetails(...)` on the contract
* Waits for transaction confirmation
* Updates UI on success

```js
await contract.setElectionDetails(
  adminName,
  adminEmail,
  adminId,
  electionTitle,
  organization
);
```

---

### End Election (Admin Only)

* Calls `endElection()` on the smart contract
* Waits for block confirmation
* Finalizes election state

---

## Transaction Handling

All blockchain transactions are tracked using:

```js
provider.once(transactionResponse.hash, callback)
```

This ensures UI updates only occur **after the transaction is mined**.

---

## File Structure

```
.
├── index.js                 # Frontend logic (this file)
├── constants.js             # Contract ABI & address
├── ethers-5.6.esm.min.js    # Ethers.js library
├── index.html               # UI
├── styles.css               # Styling
```

---

## Prerequisites

* MetaMask installed in browser
* Deployed smart contract
* Contract ABI and address configured in `constants.js`
* Browser that supports ES modules

---

## How to Run

1. Deploy the smart contract
2. Update `constants.js` with:

   ```js
   export const contractAddress = "...";
   export const abi = [...];
   ```
3. Open `index.html` in a browser
4. Connect MetaMask
5. Interact with the election

---

## UI Access Rules

| User Type | Permissions                             |
| --------- | --------------------------------------- |
| Admin     | Start election, end election, manage UI |
| Non-admin | View-only access                        |

Unauthorized users automatically have admin controls hidden.

---

## Limitations

* No network switching support
* No error UI for failed transactions
* Assumes MetaMask is available
* No event listeners (polling-based state)

---

## Why This Project?

This project demonstrates:

* Smart contract integration using Ethers.js
* Wallet-based authorization
* Transaction lifecycle handling
* Real-world DApp UI logic

Ideal for:

* Web3 portfolios
* Blockchain interviews
* Ethereum frontend practice
