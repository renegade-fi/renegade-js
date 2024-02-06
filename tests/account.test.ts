import { sha256 } from "@noble/hashes/sha256";
import * as uuid from "uuid";
import { describe, expect, test } from 'vitest';
import { Keychain, Renegade } from "../src";
import { globalKeychain, renegadeConfig } from "./utils";
import { get_public_key } from "../dist/renegade-utils";

describe("Populating Accounts", () => {
    test.concurrent(
        "Creating two Accounts with the same Keychain should have the same AccountIds",
        async () => {
            const renegade = new Renegade(renegadeConfig);
            const keychain = new Keychain();
            const accountId1 = renegade.registerAccount(keychain);
            await renegade.unregisterAccount(accountId1);
            const accountId2 = renegade.registerAccount(keychain);
            expect(accountId1).toEqual(accountId2);
            await renegade.teardown();
        },
    );

    test.concurrent(
        "Creating and initializing a new Account should result in an Account with the correct accountId and no balances, orders, or fees",
        async () => {
            const renegade = new Renegade(renegadeConfig);
            const keychain = new Keychain();
            const accountId = renegade.registerAccount(keychain);
            await renegade.initializeAccount(accountId);

            // Assert that accountId = uuidV4(sha256(pk_root)[-16:])
            const publicKeyHash = sha256(Buffer.from(get_public_key(keychain.keyHierarchy.root.secretKeyHex), "hex"));
            expect(accountId).toEqual(uuid.v4({ random: publicKeyHash.slice(-16) }));

            // Assert that this account has no balances, orders, or fees.
            expect(renegade.getBalances(accountId)).toEqual({});
            expect(renegade.getOrders(accountId)).toEqual({});
            expect(renegade.getFees(accountId)).toEqual({});
            await renegade.teardown();
        },
    );

    test.concurrent(
        "Re-registering an Account should not require an on-chain interaction",
        async () => {
            const renegade = new Renegade(renegadeConfig);
            // Register the globalKeychain once; this will require an on-chain
            // interaction if we haven't run this test before.
            const accountId1 = renegade.registerAccount(globalKeychain);
            await renegade.initializeAccount(accountId1);
            await renegade.unregisterAccount(accountId1);
            // Register the globalKeychain again; this should not require an on-chain
            // interaction.
            const startTime = Date.now();
            const accountId2 = renegade.registerAccount(globalKeychain);
            await renegade.initializeAccount(accountId2);
            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(1000);
            await renegade.teardown();
        },
    );
});
