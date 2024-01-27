import * as fs from 'fs';
import { expect } from "vitest";
import { AccountId, Keychain, Renegade, RenegadeConfig, Token } from "../src";

// Constants

export const DEVNET_ADMIN_ACCOUNT = '0x3f1Eae7D46d88F08fc2F8ed27FCb2AB183EB2d0E'

// Local Stylus Devnet Addresses
// export const DARKPOOL_CONTRACT = "0xadcacf6c23313cc363522a74be20b252041e509f";
// export const WETH_ADDRESS = "0x75e0e92a79880bd81a69f72983d03c75e2b33dc8";
// export const USDC_ADDRESS = "0x4af567288e68cad4aa93a272fe6139ca53859c70";

// EC2 Stylus Devnet Addresses
export const DARKPOOL_CONTRACT = "0xe1080224b632a93951a7cfa33eeea9fd81558b5e";
export const WETH_ADDRESS = "0x7e32b54800705876d3b5cfbc7d9c226a211f7c1a";
export const USDC_ADDRESS = "0x85d9a8a4bd77b9b5559c1b7fcb8ec9635922ed49";

export const RENEGADE_TEST_DIR = "./temp-test";
export const renegadeConfig: RenegadeConfig = {
    relayerHostname: "localhost",
    relayerHttpPort: 3000,
    relayerWsPort: 4000,
    useInsecureTransport: true,
    verbose: false,
    taskDelay: 2500,
};
export const globalKeychain = new Keychain({
    skRoot: Buffer.from(
        "78ee3282122d10e87ce8e3d1fdeabddda3ec8f1fcc26a32730e8b0ed2d3f6e1a",
        "hex",
    ).reverse(),
});

/**
 * Deposits a specified amount of tokens into an account.
 * @param renegade - The Renegade instance to use for the deposit.
 * @param accountId - The ID of the account to deposit into.
 * @param tokenAddress - The address of the token to deposit.
 * @param amount - The amount of tokens to deposit.
 * @param adminAccount - The admin account to use for the deposit.
 */
export async function deposit(renegade: Renegade, accountId: AccountId, tokenAddress: string, amount: bigint, adminAccount: string) {
    // Deposit some tokens.
    await renegade.deposit(accountId, new Token({ address: tokenAddress, network: "stylus" }), amount, adminAccount);
    // TODO: WebSocket wallet updates not working? Need to force a queryWallet call to get the updated balances.
    const balances = await renegade.queryWallet(accountId).then(
        () => renegade.getBalances(accountId)
    )
    const balanceIds = Object.keys(balances);

    // Expect that there is exactly one balance of 1 WETH.
    expect(balanceIds.length).toBe(1);
    // TODO: This will work after SDK/Relayer token maps are the same
    // expect(balances[balanceIds[0]].mint).toEqual(
    //     new Token({ ticker: "WETH" }),
    // );
    expect(balances[balanceIds[0]].amount).toEqual(amount);
}

/**
 * Executes a test function and cleans up the test directory before and after the test.
 * @param test - The test function to execute.
 */
export function executeTestWithCleanup(test: () => void) {
    // Clean up any previous runs.
    if (fs.existsSync(RENEGADE_TEST_DIR)) {
        fs.rmSync(RENEGADE_TEST_DIR, { recursive: true });
    }
    fs.mkdirSync(RENEGADE_TEST_DIR);
    test();
    // Clean up after the test.
    fs.rmSync(RENEGADE_TEST_DIR, { recursive: true });
}

/**
 * Sets up a specified number of accounts.
 * @param renegade - The Renegade instance to use for account setup.
 * @param n - The number of accounts to setup. Defaults to 1 if not specified.
 * @returns An array of account IDs.
 */
export async function setupAccount(renegade: Renegade, n?: number) {
    const res: Array<AccountId> = [];
    for (let i = 0; i < (n || 1); i++) {
        const keychain = new Keychain();
        const accountId = renegade.registerAccount(keychain);
        await renegade.initializeAccount(accountId);
        res.push(accountId);
    }
    return res;
}
