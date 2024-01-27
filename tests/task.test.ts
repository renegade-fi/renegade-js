import { describe, expect, test } from "vitest";
import { Keychain, Renegade } from "../src";
import { renegadeConfig } from "./utils";

describe("Task-Based API", () => {
  test.concurrent("Initialize an account with a task", async () => {
    // Register, initialize, and unregister an account.
    const renegade = new Renegade(renegadeConfig);
    const keychain = new Keychain();
    const accountId = renegade.registerAccount(keychain);
    const [, taskJob] = await renegade.task.initializeAccount(accountId);
    await taskJob;

    // Assert that this account has no balances, orders, or fees.
    expect(renegade.getBalances(accountId)).toEqual({});
    expect(renegade.getOrders(accountId)).toEqual({});
    expect(renegade.getFees(accountId)).toEqual({});

    // Teardown.
    await renegade.teardown();
  });
});
