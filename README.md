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

### Create and transfer a token to a recipient Address

This doesn't create the token metadata.

```javascript
async function createTokenAndTransferToMe() {
  const mintWallet = Keypair.generate();
  const recipientAddress = "RECIPIENT_PUBLIC_KEY_HERE";

  // make sure mintWallet has some SOL in the account first
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

### Create and Manage an SPL Token with Metadata

This function creates a new SPL token with metadata, mints a specified amount, and transfers a portion to a recipient.
This uses the `@solana/spl-token`, `@metaplex-foundation/umi`, `@metaplex-foundation/umi-bundle-defaults` and `@metaplex-foundation/mpl-token-metadata` libraries.

```javascript
import { Keypair } from "@solana/web3.js";
import { createAndManageSPLToken } from "solana-web3-lite";

async function createAndTransferToken() {
  const mintWallet = Keypair.generate(); // Replace with your Keypair
  const recipientAddress = "RECIPIENT_PUBLIC_KEY_HERE";

  // make sure mintWallet has some SOL in the account first
  const result = await createAndManageSPLToken({
    wallet: mintWallet,
    metadata: {
      name: "My Token",
      symbol: "MTK",
      uri: "https://example.com/token-metadata.json",
    },
    recipientAddress,
    amountToMint: 1000,
    amountToTransfer: 100,
    decimals: 9, // Optional: default is 2
    cluster: "devnet", // Optional: default is "devnet"
    commitment: "confirmed", // Optional: default is "confirmed"
  });

  console.log("Mint Public Key:", result.mintPublicKey);
  console.log("Source Account:", result.sourceAccount);
  console.log("Destination Account:", result.destinationAccount);
  console.log("Mint Transaction:", result.explorerLinks.mintTx);
  console.log("Metadata Transaction:", result.explorerLinks.metadataTx);
  console.log("Transfer Transaction:", result.explorerLinks.transferTx);
}

createAndTransferToken().catch(console.error);
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

### createAndTransferToken(options)

Creates a new token mint and transfers tokens to a recipient address.
This uses the `@solana/spl-token` library under the hood for this task.

- `mintWallet`: Keypair - The keypair used to create the token mint
- `recipientAddress`: String - Solana address to receive the tokens
- `amount`: Number - Amount of tokens to transfer
- `decimals`: Number (optional) - Number of decimal places for the token (default: 9)
- `cluster`: String (optional) - Solana network to use (`mainnet-beta`, `testnet`, `devnet`; default: `devnet`)
- `commitment`: String (optional) - Commitment level for transaction confirmation (`processed`, `confirmed`, `finalized`; default: `confirmed`)

#### createAndTransferToken Returns

An object containing:

- `signature`: String - The transaction signature
- `mintPublicKey`: String - The public key of the created token mint
- `transaction`: Object - The complete transaction details

### createAndManageSPLToken(options)

Creates a new SPL token mint, mints tokens, and transfers them to a recipient address.
This uses the `@solana/spl-token`, `@metaplex-foundation/umi`, `@metaplex-foundation/umi-bundle-defaults` and `@metaplex-foundation/mpl-token-metadata` libraries.

Parameters

- `wallet`: Keypair - The keypair used to create the token mint
- `metadata`: Object - Token metadata
- `name`: String - Name of the token
- `symbol`: String - Symbol of the token
- `uri`: String - Metadata URI
- `recipientAddress`: String (optional) - Solana address to receive the tokens (default: wallet's address)
- `amountToMint`: Number (optional) - Amount of tokens to mint (default: 10)
- `amountToTransfer`: Number (optional) - Amount of tokens to transfer (default: 1)
- `decimals`: Number (optional) - Number of decimal places for the token (default: 2)
- `cluster`: String (optional) - Solana network to use (`mainnet-beta`, `testnet`, `devnet`; default: `devnet`)
- `commitment`: String (optional) - Commitment level for transaction confirmation (`processed`, `confirmed`, `finalized`; default: `confirmed`)

#### Returns

An object containing:

- `mintPublicKey`: String - The public key of the created token mint
- `sourceAccount`: String - The associated token account of the minting wallet
- `destinationAccount`: String - The associated token account of the recipient
- `mintSignature`: String - The signature for the minting transaction
- `transferSignature`: String - The signature for the transfer transaction
- `metadataSignature`: String - The signature for the metadata creation transaction
- `explorerLinks`: Object
  - `mint`: String - Explorer link for the mint address
  - `sourceAccount`: String - Explorer link for the source account
  - `destinationAccount`: String - Explorer link for the destination account
  - `metadataTx`: String - Explorer link for the metadata transaction
  - `mintTx`: String - Explorer link for the mint transaction
  - `transferTx`: String - Explorer link for the transfer transaction

## Requirements

- Node.js
- `@solana/web3.js` (peer dependency)
- `@solana-developers/helpers` (peer dependency)
- `@solana/spl-token` (peer dependency)
- `metaplex-foundation/umi` (peer dependency)
- `@metaplex-foundation/mpl-token-metadata` (peer dependency)
- `@metaplex-foundation/umi-bundle-defaults` (peer dependency)

## License

[MIT License](LICENSE)
