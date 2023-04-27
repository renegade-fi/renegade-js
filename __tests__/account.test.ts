import * as fs from "fs";
import keccak256 from "keccak256";
import * as path from "path";
import * as uuid from "uuid";

import { Keychain, Renegade, RenegadeConfig } from "../src";
import RenegadeError from "../src/errors";

const RENEGADE_TEST_DIR = "./temp-test";

const renegadeConfig: RenegadeConfig = {
  relayerHostname: "localhost",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport: true,
};
const globalKeychain = new Keychain({
  skRoot: Buffer.from(
    "78ee3282122d10e87ce8e3d1fdeabddda3ec8f1fcc26a32730e8b0ed2d3f6e1a",
    "hex",
  ).reverse(),
});

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
    fs.rmSync(RENEGADE_TEST_DIR, { recursive: true });
  }
  fs.mkdirSync(RENEGADE_TEST_DIR);
  test();
  // Clean up after the test.
  fs.rmSync(RENEGADE_TEST_DIR, { recursive: true });
}

describe("Relayer Ping", () => {
  test.concurrent("Ensure that the relayer is up", async () => {
    const renegade = new Renegade(renegadeConfig);
    try {
      await renegade.ping();
    } catch (e) {
      console.warn(
        `The relayer was not pingable. Ensure that a relayer is running at ${renegade.relayerHttpUrl}`,
      );
      throw e;
    }
  });
});

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

describe("Renegade Object Parameters", () => {
  test.concurrent("An invalid relayer hostname should throw an error.", () => {
    const brokenRenegadeConfig: RenegadeConfig = {
      relayerHostname: "https://not-a-valid-hostname.com",
    };
    expect(() => new Renegade(brokenRenegadeConfig)).toThrowError(
      RenegadeError,
    );
  });

  test.concurrent("An invalid relayer port should throw an error.", () => {
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
    expect(() => new Renegade(brokenRenegadeConfig1)).toThrowError(
      RenegadeError,
    );
    expect(() => new Renegade(brokenRenegadeConfig2)).toThrowError(
      RenegadeError,
    );
    expect(() => new Renegade(brokenRenegadeConfig3)).toThrowError(
      RenegadeError,
    );
  });

  test.concurrent("Can properly connect to a valid relayer URL.", async () => {
    const renegade = new Renegade(renegadeConfig);
    await renegade.ping();
  });

  test.concurrent("Cannot connect to an invalid relayer URL", async () => {
    const brokenRenegadeConfig: RenegadeConfig = {
      relayerHostname: "no-relayer-here.com",
    };
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
  test.concurrent(
    "Creating two Accounts with the same Keychain should have the same AccountIds",
    async () => {
      const renegade = new Renegade(renegadeConfig);
      const keychain = new Keychain();
      const accountId1 = await renegade.registerAccount(keychain, true);
      await renegade.unregisterAccount(accountId1);
      const accountId2 = await renegade.registerAccount(keychain, true);
      await renegade.unregisterAccount(accountId2);
      expect(accountId1).toEqual(accountId2);
    },
  );

  test.concurrent(
    "Creating and initializing a new Account should result in an Account with the correct accountId and no balances, orders, or fees",
    async () => {
      const renegade = new Renegade(renegadeConfig);
      const keychain = new Keychain();
      const accountId = await renegade.registerAccount(keychain);

      // Assert that accountId = uuidV4(keccak256(pk_view)[-16:])
      const publicKeyHash = new Uint8Array(
        keccak256(Buffer.from(keychain.keyHierarchy.view.publicKey.buffer)),
      );
      expect(accountId).toEqual(uuid.v4({ random: publicKeyHash.slice(-16) }));

      // Assert that this account has no balances, orders, or fees.
      const account = renegade.lookupAccount(accountId);
      expect(account.balances).toEqual([]);
      expect(account.orders).toEqual([]);
      expect(account.fees).toEqual([]);
      await renegade.unregisterAccount(accountId);
    },
  );

  test.concurrent(
    "Re-registering an Account should not require an on-chain interaction",
    async () => {
      const renegade = new Renegade(renegadeConfig);
      // Register the globalKeychain once; this will require an on-chain
      // interaction if we haven't run this test before.
      const accountId1 = await renegade.registerAccount(globalKeychain);
      await renegade.unregisterAccount(accountId1);
      // Register the globalKeychain again; this should not require an on-chain
      // interaction.
      const startTime = Date.now();
      const accountId2 = await renegade.registerAccount(globalKeychain);
      const endTime = Date.now();
      await renegade.unregisterAccount(accountId2);
      expect(endTime - startTime).toBeLessThan(1000);
    },
  );
});

// describe("Creating and Cancelling Orders", () => {
//   test.concurrent("Creating an order should result in the order being added to the Account's orders", async () => {
//     const renegade = new Renegade(renegadeConfig);
//     const keychain = new Keychain();
//     const accountId = await renegade.registerAccount(keychain);
//     const order = await renegade.createOrder(accountId, "BTC", "ETH", "0.1", "0.2", "0.3");
//     const account = renegade.lookupAccount(accountId);
//     expect(account.orders).toEqual([order]);
//     await renegade.unregisterAccount(accountId);
//   });
// });
