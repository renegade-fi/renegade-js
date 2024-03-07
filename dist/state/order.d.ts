import { OrderId } from "../types";
import Token from "./token";
export default class Order {
    readonly orderId: OrderId;
    readonly baseToken: Token;
    readonly quoteToken: Token;
    readonly side: "buy" | "sell";
    readonly type: "midpoint" | "bidirectional";
    readonly amount: bigint;
    readonly minimumAmount: bigint;
    readonly worstPrice: number;
    constructor(params: {
        id?: OrderId;
        baseToken: Token;
        quoteToken: Token;
        side: "buy" | "sell";
        type: "midpoint" | "bidirectional";
        amount: bigint;
        minimumAmount?: bigint;
        worstPrice?: number;
    });
    pack(): bigint[];
    serialize(): string;
    static deserialize(serializedOrder: any): Order;
}
