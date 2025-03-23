import { showBalance } from "../src/showBalance";
import { Keypair } from "@solana/web3.js";

describe("showBalance", () => {
  it("should return the balance of a wallet", async () => {
    const keypair = Keypair.generate();
    const balance = await showBalance({
      address: keypair.publicKey.toBase58(),
    });
    expect(typeof balance).toBe("number");
  });
});
