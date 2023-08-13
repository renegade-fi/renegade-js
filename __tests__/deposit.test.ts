import { Balance, BalanceId, Keychain, Renegade, Token } from "../src";
import { renegadeConfig } from "./utils";

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
    const address = new Token({ ticker }).address;
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
  test.concurrent(
    "Depositing a token should be reflected in the Account's balances",
    async () => {
      // Setup the Account.
      const renegade = new Renegade(renegadeConfig);
      const accountId = renegade.registerAccount(new Keychain());
      await renegade.initializeAccount(accountId);

      // Deposit some tokens.
      await renegade.deposit(accountId, new Token({ ticker: "WETH" }), 1000n);
      const balances = renegade.getBalances(accountId);
      const balanceIds = Object.keys(balances);

      // Expect that there is exactly one balance of 1000n WETH.
      expect(balanceIds.length).toBe(1);
      expect(balances[balanceIds[0]].mint).toEqual(
        new Token({ ticker: "WETH" }),
      );
      expect(balances[balanceIds[0]].amount).toEqual(1000n);

      // Teardown.
      await renegade.teardown();
    },
  );

  test.concurrent(
    "Depositing and withdrawing multiple tokens should work",
    async () => {
      // Setup the Account.
      const renegade = new Renegade(renegadeConfig);
      const accountId = renegade.registerAccount(new Keychain());
      await renegade.initializeAccount(accountId);

      // Deposit WETH.
      await renegade.deposit(accountId, new Token({ ticker: "WETH" }), 1000n);
      expectBalances(renegade.getBalances(accountId), { WETH: 1000n });

      // Deposit USDC.
      await renegade.deposit(accountId, new Token({ ticker: "USDC" }), 2000n);
      expectBalances(renegade.getBalances(accountId), {
        WETH: 1000n,
        USDC: 2000n,
      });

      // Withdraw WETH.
      await renegade.withdraw(accountId, new Token({ ticker: "WETH" }), 1000n);
      expectBalances(renegade.getBalances(accountId), {
        USDC: 2000n,
      });

      // Withdraw USDC.
      await renegade.withdraw(accountId, new Token({ ticker: "USDC" }), 500n);
      expectBalances(renegade.getBalances(accountId), {
        USDC: 1500n,
      });

      // Teardown.
      await renegade.teardown();
    },
  );
});
