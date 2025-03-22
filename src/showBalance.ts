import { Commitment } from "@solana/web3.js";
import { getConnection, lamportsToSol, toPublicKey } from "./utils";
import { getExplorerLink } from "@solana-developers/helpers";

interface ShowBalanceParams {
  address: string;
  cluster?: "mainnet-beta" | "testnet" | "devnet" | "localnet";
  commitment?: Commitment;
}

export const showBalance = async ({
  address,
  cluster = "devnet",
  commitment = "confirmed",
}: ShowBalanceParams): Promise<number> => {
  try {
    console.log(`Fetching balance on ${cluster}...`);

    if (!address) throw new Error("Public key string is required.");

    const pubKey = toPublicKey(address);

    const connection = getConnection({ cluster, commitment });

    const balanceInLamports = await connection.getBalance(pubKey);
    const balanceInSol = lamportsToSol(balanceInLamports);

    const explorerLink = getExplorerLink("address", pubKey.toBase58(), cluster);

    console.log(`✅ Visit Explorer for more info: ${explorerLink}`);
    return balanceInSol;
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    throw error;
  }
};
