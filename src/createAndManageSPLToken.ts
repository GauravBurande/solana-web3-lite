import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Commitment,
} from "@solana/web3.js";
import { getExplorerLink } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createAndMint,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { getConnection, toPublicKey } from "./utils";

interface TokenParams {
  wallet: Keypair;
  metadata: {
    name: string;
    symbol: string;
    uri: string;
  };
  recipientAddress?: string;
  amountToMint?: number;
  amountToTransfer?: number;
  decimals?: number;
  cluster?: "mainnet-beta" | "testnet" | "devnet";
  commitment?: Commitment;
}

interface TokenResult {
  mintPublicKey: string;
  sourceAccount: string;
  destinationAccount: string;
  mintSignature: string;
  transferSignature: string;
  metadataSignature: string;
  explorerLinks: {
    mint: string;
    sourceAccount: string;
    destinationAccount: string;
    metadataTx: string;
    mintTx: string;
    transferTx: string;
  };
}

export const createAndManageSPLToken = async ({
  wallet,
  metadata,
  recipientAddress = wallet.publicKey.toBase58(),
  amountToMint = 10,
  amountToTransfer = 1,
  decimals = 2,
  cluster = "devnet",
  commitment = "confirmed",
}: TokenParams): Promise<TokenResult> => {
  try {
    console.log(`Processing SPL token on ${cluster}...`);

    if (!wallet) throw new Error("Wallet keypair is required");
    if (amountToMint <= 0 || amountToTransfer <= 0)
      throw new Error("Amounts must be greater than 0");
    if (decimals < 0) throw new Error("Decimals must be non-negative");

    const connection = getConnection({ cluster, commitment });
    const recipientPubKey = toPublicKey(recipientAddress);
    const mintAuthority = wallet.publicKey;
    const minorUnits = BigInt(Math.pow(10, decimals));

    const umi = createUmi(connection);
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(wallet.secretKey);
    const userWalletSigner = createSignerFromKeypair(umi, umiKeypair);
    umi.use(signerIdentity(userWalletSigner));
    umi.use(mplTokenMetadata());

    // Create mint with metadata using UMI
    const mint = generateSigner(umi);
    const metadataSignature = await createAndMint(umi, {
      mint,
      authority: umi.identity,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      sellerFeeBasisPoints: percentAmount(0),
      decimals,
      amount: 0,
      tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi);

    const mintPublicKeyObj = new PublicKey(mint.publicKey);
    const mintPublicKey = mintPublicKeyObj.toBase58();

    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mintPublicKeyObj,
      mintAuthority,
      false,
      commitment
    );

    const mintAmount = BigInt(Math.floor(amountToMint * Number(minorUnits)));
    const mintSignature = await mintTo(
      connection,
      wallet,
      mintPublicKeyObj,
      sourceTokenAccount.address,
      mintAuthority,
      mintAmount,
      [],
      { commitment }
    );

    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mintPublicKeyObj,
      recipientPubKey,
      false,
      commitment
    );

    const transferTx = new Transaction().add(
      createTransferInstruction(
        sourceTokenAccount.address,
        destinationTokenAccount.address,
        mintAuthority,
        BigInt(Math.floor(amountToTransfer * Number(minorUnits))),
        [],
        TOKEN_PROGRAM_ID
      )
    );

    const transferSignature = await sendAndConfirmTransaction(
      connection,
      transferTx,
      [wallet],
      { commitment }
    );

    const explorerLinks = {
      mint: getExplorerLink("address", mintPublicKey, cluster),
      sourceAccount: getExplorerLink(
        "address",
        sourceTokenAccount.address.toBase58(),
        cluster
      ),
      destinationAccount: getExplorerLink(
        "address",
        destinationTokenAccount.address.toBase58(),
        cluster
      ),
      metadataTx: getExplorerLink(
        "tx",
        metadataSignature.signature.toString(),
        cluster
      ),
      mintTx: getExplorerLink("tx", mintSignature, cluster),
      transferTx: getExplorerLink("tx", transferSignature, cluster),
    };

    console.log(
      `✅ Created and managed SPL token, visit explorer: ${explorerLinks.mint}`
    );

    return {
      mintPublicKey,
      sourceAccount: sourceTokenAccount.address.toBase58(),
      destinationAccount: destinationTokenAccount.address.toBase58(),
      mintSignature,
      transferSignature,
      metadataSignature: metadataSignature.signature.toString(),
      explorerLinks,
    };
  } catch (error) {
    console.error("SPL token management failed:", error);
    throw error;
  }
};
