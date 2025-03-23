import {
  Connection,
  Commitment,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

interface ConnectionParams {
  cluster: "mainnet-beta" | "testnet" | "devnet" | "localnet";
  commitment: Commitment;
}

/**
 * Creates a Solana connection based on cluster or localnet RPC URL
 * @param params Connection parameters
 * @returns Connection object
 */

export const getConnection = ({
  cluster,
  commitment,
}: ConnectionParams): Connection => {
  const rpcUrl =
    cluster === "localnet" ? "http://localhost:8899" : clusterApiUrl(cluster);
  return new Connection(rpcUrl, commitment);
};

/**
 * Validates and converts a string address to PublicKey
 * @param address String address to validate
 * @returns PublicKey object
 * @throws Error if address is invalid
 */

export const toPublicKey = (address: string): PublicKey => {
  try {
    return new PublicKey(address);
  } catch (error) {
    throw new Error("Invalid public key address provided");
  }
};

export const solToLamports = (sol: number): number => sol * LAMPORTS_PER_SOL;
export const lamportsToSol = (lamports: number): number =>
  lamports / LAMPORTS_PER_SOL;
