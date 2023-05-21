import * as path from "path";

import { Keychain } from "../src";
import { RENEGADE_TEST_DIR, executeTestWithCleanup } from "./utils";

/**
 * Expect that two Keychains have no common keypairs in the entire key
 * hierarchy.
 *
 * @param keychain1 The first Keychain to compare.
 * @param keychain2 The second Keychain to compare.
 */
function expectNoCommonKeypairs(keychain1: Keychain, keychain2: Keychain) {
  for (const key of ["root", "match", "settle"]) {
    const keypair1 = keychain1.keyHierarchy[key];
    const keypair2 = keychain2.keyHierarchy[key];
    expect(keypair1.secretKey).not.toEqual(keypair2.secretKey);
    expect(keypair1.publicKey).not.toEqual(keypair2.publicKey);
  }
}

describe("Keychain Creation", () => {
  test.concurrent(
    "Creating two random Keychains should be different with high probability",
    () => {
      const keychain1 = new Keychain();
      const keychain2 = new Keychain();
      expectNoCommonKeypairs(keychain1, keychain2);
    },
  );

  test.concurrent(
    "Creating two Keychains with different seeds should be different",
    () => {
      const keychain1 = new Keychain({ seed: "seed1" });
      const keychain2 = new Keychain({ seed: "seed2" });
      expectNoCommonKeypairs(keychain1, keychain2);
    },
  );

  test.concurrent(
    "Creating a Keychain from a seed should be deterministic",
    () => {
      const keychain1 = new Keychain({ seed: "seed" });
      const keychain2 = new Keychain({ seed: "seed" });
      expect(keychain1).toEqual(keychain2);
    },
  );

  test.concurrent(
    "Saving and loading a Keychain to a file should not change the Keychain",
    () => {
      executeTestWithCleanup(() => {
        const keychain = new Keychain();
        const keychainFilePath = path.join(RENEGADE_TEST_DIR, "keychain.json");
        keychain.saveToFile(keychainFilePath);
        const keychainLoad = new Keychain({ filePath: keychainFilePath });
        expect(keychain).toEqual(keychainLoad);
      });
    },
  );
});
