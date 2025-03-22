import { Finality, Commitment } from "@solana/web3.js";
import { getConnection, solToLamports, toPublicKey } from "./utils";
import { getExplorerLink } from "@solana-developers/helpers";

interface AirdropParams {
  address: string;
  amount: number;
  cluster?: "mainnet-beta" | "testnet" | "devnet" | "localnet";
  commitment?: Commitment;
}

export const airdrop = async ({
  address,
  amount,
  cluster = "devnet",
  commitment = "confirmed",
}: AirdropParams): Promise<string> => {
  try {
    console.log(`Initiating airdrop on ${cluster}...`);

    if (!address) throw new Error("Address string is required.");
    if (amount <= 0) throw new Error("Airdrop amount must be greater than 0.");
    if (cluster === "mainnet-beta") {
      throw new Error(
        "Airdrops are not available on Mainnet Beta unless using the localnet a custom RPC URL."
      );
    }
    if (cluster === "devnet" && amount > 100) {
      throw new Error("Airdrop amount exceeds typical devnet limit of 100 SOL");
    }

    const publicKey = toPublicKey(address);

    const connection = getConnection({ cluster, commitment });

    const signature = await connection.requestAirdrop(
      publicKey,
      solToLamports(amount)
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const timeoutMs = 30000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Airdrop confirmation timeout")),
        timeoutMs
      )
    );
    await Promise.race([
      connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "finalized" as Finality
      ),
      timeoutPromise,
    ]);

    const explorerLink = getExplorerLink("transaction", signature, cluster);

    console.log(`✅ Airdrop confirmed: ${explorerLink}`);
    return signature;
  } catch (error) {
    console.error("Airdrop failed:", error);
    throw error;
  }
};
