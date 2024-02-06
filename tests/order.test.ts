import { describe, expect, test } from 'vitest';
import { Keychain, Order, OrderId, Renegade, Token } from "../src";
import { DEVNET_ADMIN_ACCOUNT, WETH_ADDRESS, deposit, renegadeConfig } from './utils';

/**
 * Checks the equality of two hashmaps of orders, ignoring the timestamp.
 */
export function expectOrderEquality(order1: Order, order2: Order) {
    expect(order1.orderId).toEqual(order2.orderId);
    expect(order1.baseToken).toEqual(order2.baseToken);
    expect(order1.quoteToken).toEqual(order2.quoteToken);
    expect(order1.side).toEqual(order2.side);
    expect(order1.type).toEqual(order2.type);
    expect(order1.amount).toEqual(order2.amount);
    expect(order1.minimumAmount).toEqual(order2.minimumAmount);
    expect(order1.worstPrice).toEqual(order2.worstPrice);
}

/**
 * Checks the equality of two hashmaps of orders, ignoring the timestamp.
 */
export function expectOrdersEquality(
    orders1: Record<OrderId, Order>,
    orders2: Record<OrderId, Order>,
) {
    expect(Object.keys(orders1).sort()).toEqual(Object.keys(orders2).sort());
    for (const orderId in orders1) {
        expectOrderEquality(orders1[orderId as OrderId], orders2[orderId as OrderId]);
    }
}

const getOrder1 = () => new Order({
    baseToken: new Token({ ticker: "WETH" }),
    quoteToken: new Token({ ticker: "USDC" }),
    side: "sell",
    type: "midpoint",
    amount: 1n,
    timestamp: new Date().getTime()
})

const getOrder2 = () => new Order({
    baseToken: new Token({ ticker: "WETH" }),
    quoteToken: new Token({ ticker: "USDC" }),
    side: "buy",
    type: "midpoint",
    amount: 1n,
    timestamp: new Date().getTime()
});

describe("Creating and Cancelling Orders", () => {
    test('Creating an order should result in the order being added to the Account\'s orders', async () => {
        // Setup the Account.
        const renegade = new Renegade(renegadeConfig);
        const accountId = renegade.registerAccount(new Keychain());
        await renegade.initializeAccount(accountId);

        await deposit(renegade, accountId, WETH_ADDRESS, 1n, DEVNET_ADMIN_ACCOUNT)

        // Create and submit the order.
        const order = getOrder1()
        await renegade.placeOrder(accountId, order);

        const orders = await renegade.queryWallet(accountId).then(() => renegade.getOrders(accountId));
        console.log("SDK Order: ", order)
        console.log("Relayer Orders: ", orders)
        expectOrdersEquality(orders, {
            [order.orderId]: order,
        });

        // Teardown.
        await renegade.teardown();
    })

    test("Modifying an order should work", async () => {
        // Setup the Account.
        const renegade = new Renegade(renegadeConfig);
        const accountId = renegade.registerAccount(new Keychain());
        await renegade.initializeAccount(accountId);

        const order1 = getOrder1()

        console.log("PLACING ORDER")
        await renegade.placeOrder(accountId, order1);
        let orders = await renegade.queryWallet(accountId).then(() => renegade.getOrders(accountId));
        expectOrdersEquality(orders, {
            [order1.orderId]: order1,
        });

        const order2 = new Order({
            ...getOrder2(),
            id: order1.orderId
        })

        // Modify the order.
        console.log("MODIFYING ORDER")
        await renegade.modifyOrder(accountId, order1.orderId, order2);
        console.log("Order 1: ", order1)
        orders = await renegade.queryWallet(accountId).then(() => renegade.getOrders(accountId));
        expectOrdersEquality(orders, {
            [order1.orderId]: order2,
        });

        // Teardown.
        await renegade.teardown();
    });

    // TODO: Known to error with Plonk prover error
    test.skip("Creating mulitple orders should work", async () => {
        // Setup the Account.
        const renegade = new Renegade(renegadeConfig);
        const accountId = renegade.registerAccount(new Keychain());
        await renegade.initializeAccount(accountId);

        // Create and submit the orders.
        const order1 = getOrder1()
        await renegade.placeOrder(accountId, order1);
        let orders = await renegade.queryWallet(accountId).then(() => renegade.getOrders(accountId))
        expectOrdersEquality(orders, {
            [order1.orderId]: order1,
        });

        const order2 = getOrder2()
        await renegade.placeOrder(accountId, order2);
        orders = await renegade.queryWallet(accountId).then(() => renegade.getOrders(accountId))
        expectOrdersEquality(orders, {
            [order1.orderId]: order1,
            [order2.orderId]: order2,
        });
    })

    // TODO: Known to error with Plonk prover error
    test.skip(
        "Creating and cancelling multiple orders should work",
        async () => {
            // Setup the Account.
            const renegade = new Renegade(renegadeConfig);
            const accountId = renegade.registerAccount(new Keychain());
            await renegade.initializeAccount(accountId);

            // Create and submit the orders.
            const order1 = getOrder1()
            await renegade.placeOrder(accountId, order1);
            let orders = await renegade.queryWallet(accountId).then(() => renegade.getOrders(accountId))
            expectOrdersEquality(orders, {
                [order1.orderId]: order1,
            });

            const order2 = getOrder2()
            await renegade.placeOrder(accountId, order2);
            orders = await renegade.queryWallet(accountId).then(() => renegade.getOrders(accountId))
            expectOrdersEquality(orders, {
                [order1.orderId]: order1,
                [order2.orderId]: order2,
            });

            // Cancel one of the orders.
            await renegade.cancelOrder(accountId, order1.orderId);
            orders = await renegade.queryWallet(accountId).then(() => renegade.getOrders(accountId))
            console.log("🚀 ~ orders:", orders)
            expectOrdersEquality(orders, {
                [order2.orderId]: order2,
            });

            // Teardown.
            await renegade.teardown();
        },
    );

    // TODO: Implement once batch proofs are in
    test.todo("Modify and place order should work", async () => {
        // Setup the Account.
        const renegade = new Renegade(renegadeConfig);
        const accountId = renegade.registerAccount(new Keychain());
        await renegade.initializeAccount(accountId);

        // Fill with orders
        for (let i = 0; i < 5; i++) {
            const order = new Order({ ...getOrder1() })
            await renegade.placeOrder(accountId, order);
        }

        // Match and fill 1 order

        // use modifyOrPlaceOrder to place a new order

    })

})