import {
  createMint,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import {
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
  Commitment,
} from "@solana/web3.js";
import { getConnection, toPublicKey } from "./utils";
import { getExplorerLink } from "@solana-developers/helpers";

interface TokenParams {
  mintWallet: Keypair;
  recipientAddress: string;
  amount: number;
  decimals?: number;
  cluster?: "mainnet-beta" | "testnet" | "devnet" | "localnet";
  commitment?: Commitment;
}

const createAndTransferToken = async ({
  mintWallet,
  recipientAddress,
  amount,
  decimals = 9,
  cluster = "devnet",
  commitment = "confirmed",
}: TokenParams): Promise<{
  signature: string;
  mintPublicKey: string;
  transaction: Transaction;
}> => {
  try {
    console.log(`Processing token transaction on ${cluster}...`);

    if (!mintWallet) throw new Error("Mint wallet keypair is required");
    if (!recipientAddress) throw new Error("Recipient address is required");
    if (amount <= 0) throw new Error("Amount must be greater than 0");
    if (decimals < 0) throw new Error("Decimals must be non-negative");

    const connection = getConnection({ cluster, commitment });
    const recipientPubKey = toPublicKey(recipientAddress);
    const mintAuthority = mintWallet.publicKey;

    const mintPublicKeyObj = await createMint(
      connection,
      mintWallet,
      mintAuthority,
      null,
      decimals,
      undefined,
      { commitment }
    );
    console.log("mintPubKey", mintPublicKeyObj);
    const mintPublicKey = mintPublicKeyObj.toBase58();

    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintWallet,
      mintPublicKeyObj,
      mintAuthority,
      false,
      commitment
    );
    console.log("sourceTokenAccount: ", sourceTokenAccount);

    const mintAmount = amount * Math.pow(10, decimals);
    const mint = await mintTo(
      connection,
      mintWallet,
      mintPublicKeyObj,
      sourceTokenAccount.address,
      mintAuthority,
      mintAmount,
      [],
      { commitment }
    );
    console.log("mint: ", mint);

    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintWallet,
      mintPublicKeyObj,
      recipientPubKey,
      false,
      commitment
    );
    console.log("recipientTokenAccount: ", recipientTokenAccount);

    const transaction = new Transaction().add(
      createTransferInstruction(
        sourceTokenAccount.address,
        recipientTokenAccount.address,
        mintAuthority,
        mintAmount,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [mintWallet],
      { commitment }
    );
    console.log("signature: ", recipientTokenAccount);

    console.log(
      `Created token ${mintPublicKey} and transferred ${amount} tokens to ${recipientAddress}`
    );
    const explorerLink = getExplorerLink("tx", signature, cluster);
    console.log(`✅ Transaction details: ${explorerLink}`);

    return {
      signature,
      mintPublicKey,
      transaction,
    };
  } catch (error) {
    console.error("Token transaction failed:", error);
    throw error;
  }
};
