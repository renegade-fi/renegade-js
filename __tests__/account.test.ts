import { Renegade, RenegadeConfig, Keychain } from "../src";
import RenegadeError, { RenegadeErrorType } from "../src/errors";
import * as path from "path";
import * as fs from "fs";

const renegadeConfig: RenegadeConfig = {
  relayerHostname: "localhost",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport: true,
}

const RENEGADE_TEST_DIR = "./temp-test";

/**
 * Expect that two Keychains have no common keypairs in the entire key
 * hierarchy.
 * 
 * @param keychain1 The first Keychain to compare.
 * @param keychain2 The second Keychain to compare.
 */
function expectNoCommonKeypairs(keychain1: Keychain, keychain2: Keychain) {
  for (const key of ["root", "match", "settle", "view"]) {
    const keypair1 = keychain1.keyHierarchy[key];
    const keypair2 = keychain2.keyHierarchy[key];
    expect(keypair1.secretKey).not.toEqual(keypair2.secretKey);
    expect(keypair1.publicKey).not.toEqual(keypair2.publicKey);
  }
}

function executeTestWithCleanup(test: () => void) {
  // Clean up any previous runs.
  if (fs.existsSync(RENEGADE_TEST_DIR)) {
    fs.rmdirSync(RENEGADE_TEST_DIR, { recursive: true });
  }
  fs.mkdirSync(RENEGADE_TEST_DIR);
  test();
  // Clean up after the test.
  fs.rmdirSync(RENEGADE_TEST_DIR, { recursive: true });
}

describe("Keychain Creation", () => {
  test("Creating two random Keychains should be different with high probability", () => {
    const keychain1 = new Keychain();
    const keychain2 = new Keychain();
    expectNoCommonKeypairs(keychain1, keychain2);
  });

  test("Creating two Keychains with different seeds should be different", () => {
    const keychain1 = new Keychain({ seed: "seed1" });
    const keychain2 = new Keychain({ seed: "seed2" });
    expectNoCommonKeypairs(keychain1, keychain2);
  });

  test("Creating a Keychain from a seed should be deterministic", () => {
    const keychain1 = new Keychain({ seed: "seed" });
    const keychain2 = new Keychain({ seed: "seed" });
    expect(keychain1).toEqual(keychain2);
  });

  test("Saving and loading a Keychain to a file should not change the Keychain", () => {
    executeTestWithCleanup(() => {
      const keychain = new Keychain();
      const keychainFilePath = path.join(RENEGADE_TEST_DIR, "keychain.json");
      keychain.saveToFile(keychainFilePath);
      const keychainLoad = new Keychain({ filePath: keychainFilePath });
      expect(keychain).toEqual(keychainLoad);
    })
  });
});

describe("Renegade Object Parameters", () => {
  test("An invalid relayer hostname should throw an error.", () => {
    const brokenRenegadeConfig: RenegadeConfig = {
      relayerHostname: "https://not-a-valid-hostname.com",
    };
    expect(() => new Renegade(brokenRenegadeConfig)).toThrowError(RenegadeError);
  });

  test("An invalid relayer port should throw an error.", () => {
    const brokenRenegadeConfig1: RenegadeConfig = {
      relayerHostname: "localhost",
      relayerHttpPort: 0,
    };
    const brokenRenegadeConfig2: RenegadeConfig = {
      relayerHostname: "localhost",
      relayerHttpPort: 65536,
    };
    const brokenRenegadeConfig3: RenegadeConfig = {
      relayerHostname: "localhost",
      relayerHttpPort: 0.5,
    };
    expect(() => new Renegade(brokenRenegadeConfig1)).toThrowError(RenegadeError);
    expect(() => new Renegade(brokenRenegadeConfig2)).toThrowError(RenegadeError);
    expect(() => new Renegade(brokenRenegadeConfig3)).toThrowError(RenegadeError);
  });

  test("Can properly connect to a valid relayer URL.", async () => {
    const renegade = new Renegade(renegadeConfig);
    await renegade.ping();
  });

  test("Cannot connect to an invalid relayer URL", async () => {
    const brokenRenegadeConfig: RenegadeConfig = { relayerHostname: "no-relayer-here.com" };
    const renegade = new Renegade(brokenRenegadeConfig);
    try {
      await renegade.ping();
      fail("Should have thrown an error.");
    } catch (error) {
      expect(error).toBeInstanceOf(RenegadeError);
    }
  });
});

describe("Populating Accounts", () => {
  test("Creating and initializing an Account should result in an Account with all zeroes and accountId = pk_view", async () => {
    // const renegade = new Renegade(renegadeConfig);
    // const keychain = new Keychain();
    // const accountId = await renegade.registerAccount(keychain);
    // expect(accountId).toEqual(keychain.keyHierarchy.view.publicKey.toString("hex"));
    // const account = renegade.lookupAccount(accountId);
    // TODO: Check that the account is initialized and has all zeroes.
  });
});

