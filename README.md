# solana-web3-lite

A lightweight wrapper around `@solana/web3.js` for simplified Solana blockchain interactions.

## Installation

Install the package via npm:

```bash
npm install solana-web3-lite
```

## Features

- Simplified airdrop requests
- Easy balance checking
- Streamlined SOL transfers
- Support for different clusters (devnet, localnet)
- Configurable commitment levels

## Usage Examples

### Requesting Airdrops

```javascript
// Requesting funds on devnet
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

// Using the localnet RPC URL ("http://localhost:8899")
async function requestCustomFunds() {
  try {
    const signature = await airdrop({
      address: "YourSolanaAddressHereAsString",
      amount: 5, // 5 SOL
      cluster: "localnet",
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
      cluster: "testnet",
      commitment: "processed",
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
      cluster: "devnet",
    });
    console.log("Devnet transfer completed:", signature);
  } catch (error) {
    console.error("Devnet transfer failed:", error);
  }
}
```

### Create and transfer a token to a recipient Address

This doesn't create the token metadata, we have `craeteTokenWithMetadata` for that.

```javascript
async function createTokenAndTransferToMe() {
  const mintWallet = Keypair.generate();
  const recipientAddress = "RECIPIENT_PUBLIC_KEY_HERE";

  const { signature, mintPublicKey, transaction } =
    await createAndTransferToken({
      mintWallet,
      recipientAddress,
      amount: 1000,
      decimals: 9, // Optional: default is 9
      cluster: "devnet", // Optional: default is "devnet"
      commitment: "confirmed", // Optional: default is "confirmed"
    });

  console.log("Transaction signature:", signature);
  console.log("Mint public key:", mintPublicKey);
  console.log("Transaction details:", transaction);
}
```

## API Reference

### airdrop(options)

- `address`: String - Solana address to receive funds
- `amount`: Number - Amount of SOL to request
- `cluster`: String (optional) - "devnet" as default
- `commitment`: String (optional) - Commitment level

### showBalance(options)

- `address`: String - Solana address to check
- `cluster`: String (optional) - "mainnet-beta" | "testnet" | "devnet" | "localnet"

### transfer(options)

- `keyPair`: Keypair - Sender's keypair
- `recipientAddress`: String - Recipient's Solana address
- `amount`: Number - Amount of SOL to send
- `cluster`: String (optional) - "mainnet-beta" | "testnet" | "devnet" | "localnet"

### createAndTransferToken(options)

Creates a new token mint and transfers tokens to a recipient address.

- `mintWallet`: Keypair - The keypair used to create the token mint
- `recipientAddress`: String - Solana address to receive the tokens
- `amount`: Number - Amount of tokens to transfer
- `decimals`: Number (optional) - Number of decimal places for the token (default: 9)
- `cluster`: String (optional) - Solana network to use ("mainnet-beta", "testnet", "devnet"; default: "devnet")
- `commitment`: String (optional) - Commitment level for transaction confirmation ("processed", "confirmed", "finalized"; default: "confirmed")

#### createAndTransferToken Returns

An object containing:

- `signature`: String - The transaction signature
- `mintPublicKey`: String - The public key of the created token mint
- `transaction`: Object - The complete transaction details

## Requirements

- Node.js
- `@solana/web3.js` (peer dependency)
- `@solana-developers/helpers` (peer dependency)
- `@solana/spl-token` (peer dependency)

## License

[MIT License](LICENSE)
