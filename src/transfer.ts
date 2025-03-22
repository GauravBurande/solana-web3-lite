import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  Commitment,
} from "@solana/web3.js";
import { getConnection, solToLamports, toPublicKey } from "./utils";
import { getExplorerLink } from "@solana-developers/helpers";

interface TransferParams {
  keyPair: Keypair;
  recipientAddress: string;
  amount: number;
  cluster?: "mainnet-beta" | "testnet" | "devnet" | "localnet";
  commitment?: Commitment;
}

export const transfer = async ({
  keyPair,
  recipientAddress,
  amount,
  cluster = "devnet",
  commitment = "confirmed",
}: TransferParams): Promise<string> => {
  try {
    console.log(`Processing transaction on ${cluster}...`);

    if (!keyPair) throw new Error("Keypair is required");
    if (!recipientAddress) throw new Error("Recipient address is required");
    if (amount <= 0) throw new Error("Amount must be greater than 0");

    let recipientPubKey = toPublicKey(recipientAddress);

    const senderPubKey = new PublicKey(keyPair.publicKey);

    const connection = getConnection({ cluster, commitment });

    const transaction = new Transaction();
    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: senderPubKey,
      toPubkey: recipientPubKey,
      lamports: solToLamports(amount),
    });
    transaction.add(sendSolInstruction);

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keyPair,
    ]);

    console.log(`Sent ${amount} SOL to ${recipientAddress}`);

    const explorerLink = getExplorerLink("tx", signature, cluster);
    console.log(`✅ Visit Explorer for more info: ${explorerLink}`);

    return signature;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};
