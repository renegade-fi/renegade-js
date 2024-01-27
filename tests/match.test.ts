import * as uuid from "uuid";
import { describe, expect, test } from 'vitest';
import { AccountId, Order, OrderId, Renegade, Token } from "../src";
import { DEVNET_ADMIN_ACCOUNT, USDC_ADDRESS, WETH_ADDRESS, deposit, renegadeConfig, setupAccount } from './utils';

const baseToken = WETH_ADDRESS
const quoteToken = USDC_ADDRESS
const baseTokenAmount = 2n
const quoteTokenAmount = 3000n

/**
 * Blocks until an update is received for a specified account.
 */
export async function blockUntilUpdate(
    renegade: Renegade,
    accountId: AccountId,
): Promise<void> {
    return new Promise((resolve) => {
        console.log("registering callback");
        renegade.registerAccountCallback(() => {
            console.log(`received update for ${accountId}`);
            resolve();
        }, accountId);
    });
}


const order1Id = uuid.v4()
const getOrder1 = (amount: bigint) => new Order({
    id: order1Id as OrderId,
    baseToken: new Token({ address: WETH_ADDRESS, network: "stylus" }),
    quoteToken: new Token({ address: USDC_ADDRESS, network: "stylus" }),
    side: "sell",
    type: "midpoint",
    amount: amount,
    timestamp: new Date().getTime()
})

const order2Id = uuid.v4()
const getOrder2 = () => new Order({
    id: order2Id as OrderId,
    baseToken: new Token({ address: WETH_ADDRESS, network: "stylus" }),
    quoteToken: new Token({ address: USDC_ADDRESS, network: "stylus" }),
    side: "buy",
    type: "midpoint",
    amount: 1n,
    timestamp: new Date().getTime()
});

describe("Internal Order Matching", () => {
    test("Two matching orders from different accounts should match full amount", async () => {
        const renegade = new Renegade(renegadeConfig);
        const [accountIdSell, accountIdBuy] = await setupAccount(renegade, 2)

        // Deposit some tokens
        await deposit(renegade, accountIdSell, baseToken, baseTokenAmount, DEVNET_ADMIN_ACCOUNT)
            .then(async () => {
                const sellOrder = getOrder1(baseTokenAmount)
                // Create and submit the order.
                await renegade.placeOrder(accountIdSell, sellOrder);
            })

        await deposit(renegade, accountIdBuy, quoteToken, quoteTokenAmount, DEVNET_ADMIN_ACCOUNT)
            .then(async () => {
                const buyOrder = getOrder2()
                // Create and submit the order.
                await renegade.placeOrder(accountIdBuy, buyOrder);
            })

        // Await until both wallets have an update.
        console.log("Pausing for 45 seconds for settle")
        await new Promise(resolve => setTimeout(resolve, 45000));
        console.log("Resuming")
        // await Promise.all([
        //     blockUntilUpdate(renegade, accountIdBuy),
        //     blockUntilUpdate(renegade, accountIdSell),
        // ]);

        // Assert that the orders were matched.
        let sellAccountOrders = await renegade.queryWallet(accountIdSell).then(() => renegade.getOrders(accountIdSell))
        expect(sellAccountOrders).toMatchObject({})
        let buyAccountOrders = await renegade.queryWallet(accountIdBuy).then(() => renegade.getOrders(accountIdBuy))
        expect(buyAccountOrders).toMatchObject({})

        // Assert that the balances were updated.
        const accountIdSellBalance = await renegade.queryWallet(accountIdSell).then(() => renegade.getBalances(accountIdSell))
        const accountIdBuyBalance = await renegade.queryWallet(accountIdBuy).then(() => renegade.getBalances(accountIdBuy))

        for (const balance of Object.values(accountIdBuyBalance)) {
            if (balance.mint.address === baseToken) {
                expect(balance.amount).toBe(1n);
            } else if (balance.mint.address === quoteToken) {
                expect(balance.amount).toBeLessThan(quoteTokenAmount);
            }
        }
        for (const balance of Object.values(accountIdSellBalance)) {
            if (balance.mint.address === baseToken) {
                expect(balance.amount).toBe(0n);
            } else if (balance.mint.address === quoteToken) {
                expect(balance.amount).toBeGreaterThan(0);
            }
        }
    })

    test("A second match should be possible after the first match", async () => {
        const renegade = new Renegade(renegadeConfig);
        const [accountIdSell, accountIdBuy] = await setupAccount(renegade, 2)

        // Deposit some tokens
        await deposit(renegade, accountIdSell, baseToken, 2n, DEVNET_ADMIN_ACCOUNT)
            .then(async () => {
                const sellOrder = getOrder1(2n)
                // Create and submit the order.
                await renegade.placeOrder(accountIdSell, sellOrder);
            })

        await deposit(renegade, accountIdBuy, quoteToken, quoteTokenAmount, DEVNET_ADMIN_ACCOUNT)
            .then(async () => {
                const buyOrder = getOrder2()
                // Create and submit the order.
                await renegade.placeOrder(accountIdBuy, buyOrder);
            })

        // Await until both wallets have an update.
        console.log("Pausing for 45 seconds for settle")
        await new Promise(resolve => setTimeout(resolve, 45000));
        console.log("Resuming")
        // await Promise.all([
        //     blockUntilUpdate(renegade, accountIdBuy),
        //     blockUntilUpdate(renegade, accountIdSell),
        // ]);

        // Assert that the first orders were matched.
        let sellAccountOrders = await renegade.queryWallet(accountIdSell).then(() => renegade.getOrders(accountIdSell))
        expect(sellAccountOrders).toMatchObject({})
        let buyAccountOrders = await renegade.queryWallet(accountIdBuy).then(() => renegade.getOrders(accountIdBuy))
        expect(buyAccountOrders).toMatchObject({})

        // Assert that the balances were updated.
        const accountIdSellBalance = await renegade.queryWallet(accountIdSell).then(() => renegade.getBalances(accountIdSell))
        const accountIdBuyBalance = await renegade.queryWallet(accountIdBuy).then(() => renegade.getBalances(accountIdBuy))

        for (const balance of Object.values(accountIdBuyBalance)) {
            if (balance.mint.address === baseToken) {
                expect(balance.amount).toBe(1n);
            } else if (balance.mint.address === quoteToken) {
                expect(balance.amount).toBeLessThan(quoteTokenAmount);
            }
        }
        for (const balance of Object.values(accountIdSellBalance)) {
            if (balance.mint.address === baseToken) {
                expect(balance.amount).toBe(0n);
            } else if (balance.mint.address === quoteToken) {
                expect(balance.amount).toBeGreaterThan(0);
            }
        }
    })

});