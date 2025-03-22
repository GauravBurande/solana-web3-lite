import { airdrop } from "../src/airdrop";
import { Keypair } from "@solana/web3.js";

// TODO: EDIT THIS FILE

describe("airdrop", () => {
  it("should request an airdrop successfully", async () => {
    const keypair = Keypair.generate();
    const signature = await airdrop({
      address: keypair.publicKey.toBase58(),
      amount: 1,
    });
    expect(signature).toBeDefined();
    expect(typeof signature).toBe("string");
  });
});
