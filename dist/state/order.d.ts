import { OrderId } from "../types";
import Token from "./token";
export default class Order {
    readonly orderId: OrderId;
    readonly baseToken: Token;
    readonly quoteToken: Token;
    readonly side: "buy" | "sell";
    readonly type: "midpoint" | "limit";
    readonly amount: bigint;
    readonly minimumAmount?: bigint;
    readonly price?: number;
    readonly timestamp: number;
    constructor(params: {
        id?: OrderId;
        baseToken: Token;
        quoteToken: Token;
        side: "buy" | "sell";
        type: "midpoint" | "limit";
        amount: bigint;
        minimumAmount?: bigint;
        price?: number;
        timestamp?: number;
    });
    pack(): bigint[];
    serialize(): string;
    static deserialize(serializedOrder: any): Order;
}
