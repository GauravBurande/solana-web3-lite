# solana-web3-lite

A lightweight wrapper around `@solana/web3.js` for simplified Solana blockchain interactions.

## Installation

Install the package via npm:

```bash
npm install solana-web3-lite
```

## Usage Examples

### Requesting Airdrops

```javascript
// Requesting funds on devnet
async function requestDevnetFunds() {
  try {
    const signature = await airdrop({
      address: "YourSolanaAddressHereAsString",
      amount: 1, // 1 SOL
      cluster: "devnet", // Optional: default is "devnet"
    });
    console.log("Devnet airdrop completed:", signature);
  } catch (error) {
    console.error("Failed to get devnet airdrop:", error);
  }
}

// Using the localnet RPC URL ("http://localhost:8899")
async function requestCustomFunds() {
  try {
    const signature = await airdrop({
      address: "YourSolanaAddressHereAsString",
      amount: 5, // 5 SOL
      cluster: "localnet", // Optional: default is "devnet"
    });
    console.log("Custom airdrop completed:", signature);
  } catch (error) {
    console.error("Failed to get custom airdrop:", error);
  }
}

// Specifying commitment level
async function requestConfirmedFunds() {
  try {
    const signature = await airdrop({
      address: "YourSolanaAddressHereAsString",
      amount: 3, // 3 SOL
      cluster: "testnet", // Optional: default is "devnet"
      commitment: "processed", // Optional: default is "confirmed"
    });
    console.log("Processed airdrop completed:", signature);
  } catch (error) {
    console.error("Failed to get processed airdrop:", error);
  }
}
```

### Checking Balance

```javascript
async function checkBalance() {
  try {
    const balance = await showBalance({
      publicKey: "YourSolanaAddressHereAsString",
      cluster: "localnet", // Defaults to "http://localhost:8899"
    });
    console.log(`Current balance: ${balance} SOL`);
  } catch (error) {
    console.error("Balance check failed:", error);
  }
}
```

### Transferring SOL

```javascript
async function sendDevnetFunds() {
  try {
    const signature = await transfer({
      keyPair: keyPair, // Your Keypair object
      recipientAddress: "RecipientSolanaAddressAsString",
      amount: 0.5, // 0.5 SOL
      cluster: "devnet", // Optional: default is "devnet"
    });
    console.log("Devnet transfer completed:", signature);
  } catch (error) {
    console.error("Devnet transfer failed:", error);
  }
}
```

## API Reference

### airdrop(options)

- `address`: String - Solana address to receive funds
- `amount`: Number - Amount of SOL to request
- `cluster`: String (optional) - `devnet` as default
- `commitment`: String (optional) - Commitment level

### showBalance(options)

- `address`: String - Solana address to check
- `cluster`: String (optional) - `mainnet-beta` | `testnet` | `devnet` | `localnet`

### transfer(options)

- `keyPair`: Keypair - Sender's keypair
- `recipientAddress`: String - Recipient's Solana address
- `amount`: Number - Amount of SOL to send
- `cluster`: String (optional) - `mainnet-beta` | `testnet` | `devnet` | `localnet`

## Requirements

- Node.js
- `@solana/web3.js` (peer dependency)
- `@solana-developers/helpers` (peer dependency)

## License

[MIT License](LICENSE)
