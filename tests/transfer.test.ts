import { transfer } from "../src/transfer";
import { Keypair } from "@solana/web3.js";

describe("transfer", () => {
  it("should return a transaction signature", async () => {
    const keypair = Keypair.generate();
    const recipientKeypair = Keypair.generate();

    const signature = await transfer({
      keyPair: keypair,
      recipientAddress: recipientKeypair.publicKey.toBase58(),
      amount: 1,
    });

    expect(typeof signature).toBe("string");
  });
});
