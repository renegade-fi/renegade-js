import { describe, expect, test } from 'vitest';
import { AccountId, Balance, BalanceId, Keychain, Renegade, Token } from "../src";
import { DEVNET_ADMIN_ACCOUNT, renegadeConfig } from './utils';

const depositAmount = 2n

/**
 * Assert that the balances are as expected.
 * @param balances The balances to check, as derived from a renegade.getBalance() call.
 * @param expectedBalances The expected balances, as a mapping from token ticker to amount.
 */
function expectBalances(
    balances: Record<BalanceId, Balance>,
    expectedBalances: Record<string, bigint>,
) {
    const expectedBalancesAddresses = {};
    for (const ticker of Object.keys(expectedBalances)) {
        const address = new Token({ ticker, network: 'stylus' }).address;
        expectedBalancesAddresses[address] = expectedBalances[ticker];
    }
    for (const balance of Object.values(balances)) {
        expect(balance.amount).toEqual(
            expectedBalancesAddresses[balance.mint.address],
        );
        delete expectedBalancesAddresses[balance.mint.address];
    }
    expect(Object.keys(expectedBalancesAddresses).length).toBe(0);
}


describe("Depositing and Withdrawing Tokens", () => {
    test(
        "Depositing a token should be reflected in the Account's balances",
        async () => {
            // Setup the Account.
            const renegade = new Renegade(renegadeConfig);
            const accountId = renegade.registerAccount(new Keychain());
            await renegade.initializeAccount(accountId);

            // Deposit some tokens.
            await renegade.deposit(accountId, new Token({ ticker: "WETH", network: "stylus" }), depositAmount, DEVNET_ADMIN_ACCOUNT);
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
            expect(balances[balanceIds[0]].amount).toEqual(depositAmount);

            // Teardown.
            await renegade.teardown();
        },
    );

    test("Depositing and withdrawing multiple tokens should work", async () => {
        // Setup the Account.
        const renegade = new Renegade(renegadeConfig);
        const accountId = renegade.registerAccount(new Keychain());
        await renegade.initializeAccount(accountId);

        // Deposit WETH.
        await renegade.deposit(accountId, new Token({ ticker: "WETH", network: "stylus" }), depositAmount, DEVNET_ADMIN_ACCOUNT);
        let balances = await renegade.queryWallet(accountId).then(() => renegade.getBalances(accountId))
        console.log("Depositing WETH");
        expectBalances(balances, { WETH: depositAmount });

        // Deposit USDC.
        await renegade.deposit(accountId, new Token({ ticker: "USDC", network: "stylus" }), 100n, DEVNET_ADMIN_ACCOUNT);
        balances = await renegade.queryWallet(accountId).then(() => renegade.getBalances(accountId))
        console.log("Depositing USDC");
        expectBalances(balances, {
            WETH: depositAmount,
            USDC: 100n,
        });

        // Withdraw WETH.
        await renegade.withdraw(accountId, new Token({ ticker: "WETH", network: "stylus" }), 1n, DEVNET_ADMIN_ACCOUNT);
        balances = await renegade.queryWallet(accountId).then(() => renegade.getBalances(accountId))
        console.log("Withdrawing WETH");
        expectBalances(balances, {
            // TODO: Definitely error with withdrawing to 0 amount
            WETH: 1n,
            USDC: 100n,
        });

        // Withdraw USDC.
        await renegade.withdraw(accountId, new Token({ ticker: "USDC", network: "stylus" }), 50n, DEVNET_ADMIN_ACCOUNT);
        balances = await renegade.queryWallet(accountId).then(() => renegade.getBalances(accountId))
        console.log("Withdrawing USDC");
        expectBalances(balances, {
            WETH: 1n,
            USDC: 50n,
        });

        // Teardown.
        await renegade.teardown();
    });

    test("Depositing and withdrawing to a zero balance should work", async () => {
        // Setup the Account.
        const renegade = new Renegade(renegadeConfig);
        const accountId = renegade.registerAccount(new Keychain());
        await renegade.initializeAccount(accountId);

        // Deposit WETH.
        await renegade.deposit(accountId, new Token({ ticker: "WETH", network: "stylus" }), 1n, DEVNET_ADMIN_ACCOUNT);
        let balances = await renegade.queryWallet(accountId).then(() => renegade.getBalances(accountId))
        expectBalances(balances, { WETH: 1n });

        // Withdraw WETH.
        await renegade.withdraw(accountId, new Token({ ticker: "WETH", network: "stylus" }), 1n, DEVNET_ADMIN_ACCOUNT);
        balances = await renegade.queryWallet(accountId).then(() => renegade.getBalances(accountId))
        expectBalances(balances, {
            WETH: 0n,
        });

    })
});