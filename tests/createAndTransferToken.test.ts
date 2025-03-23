import { createAndTransferToken } from "../src/createAndTransferToken";
import { Keypair, Transaction } from "@solana/web3.js";

describe("createAndTransferToken", () => {
  it("should return transaction signature, mint public key, and transaction object", async () => {
    const mintWallet = Keypair.generate();
    const recipientKeypair = Keypair.generate();

    const result = await createAndTransferToken({
      mintWallet,
      recipientAddress: recipientKeypair.publicKey.toBase58(),
      amount: 1,
      cluster: "devnet", // Explicitly set for testing
    });

    // Check return types
    expect(typeof result.signature).toBe("string");
    expect(typeof result.mintPublicKey).toBe("string");
    expect(result.transaction).toBeInstanceOf(Transaction);

    // Additional basic validation
    expect(result.signature.length).toBeGreaterThan(0);
    expect(result.mintPublicKey.length).toBeGreaterThan(0);
  }, 30000); // Increase timeout to 30s for blockchain operations
});
