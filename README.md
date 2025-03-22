# solana-web3-lite

A lightweight wrapper around `@solana/web3.js` for simplified Solana blockchain interactions.

## Installation

```bash
npm install solana-web3-lite
```

# Airdrop usage example:

```
// Using devnet
async function requestDevnetFunds() {
  try {
    const signature = await airdrop({
      address: "YourSolanaAddressHereAsString",
      amount: 1, // 1 SOL
      cluster: "devnet",
    });
    console.log("Devnet airdrop completed:", signature);
  } catch (error) {
    console.error("Failed to get devnet airdrop:", error);
  }
}

// With custom RPC URL, if optional customRpcUrl not provided uses "http:localhost:8899"
async function requestCustomFunds() {
  try {
    const signature = await airdrop({
      address: "YourSolanaAddressHereAsString",
      amount: 5, // 5 SOL
      cluster: "custom",
      customRpcUrl: "http://localhost:9988",
    });
    console.log("Custom airdrop completed:", signature);
  } catch (error) {
    console.error("Failed to get custom airdrop:", error);
  }
}

// With different commitment level
async function requestConfirmedFunds() {
  try {
    const signature = await airdrop({
      address: "YourSolanaAddressHereAsString",
      amount: 3, // 3 SOL
      cluster: "custom",
      commitment: "processed",
    });
    console.log("Processed airdrop completed:", signature);
  } catch (error) {
    console.error("Failed to get processed airdrop:", error);
  }
}
```

# Show balance usage example:

```
async function checkBalance() {
  try {
    const balance = await showBalance({
      publicKey: "YourSolanaAddressHereAsString",
      cluster: "custom", // Uses "http://localhost:8899" by default
    });
    console.log(`Current balance: ${balance} SOL`);
  } catch (error) {
    console.error("Balance check failed:", error);
  }
}
```

# Transfer SOL usage example:

```
async function sendDevnetFunds() {
  try {
    const signature = await transfer({
      keyPair: keyPair,
      recipientAddress: "RecipientSolanaAddressAsString",
      amount: 0.5, // 0.5 SOL
      cluster: "devnet",
    });
    console.log("Devnet transfer completed:", signature);
  } catch (error) {
    console.error("Devnet transfer failed:", error);
  }
}
```
