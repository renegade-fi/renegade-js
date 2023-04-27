import * as uuid from "uuid";

import { OrderId } from "../types";
import Token from "./token";

export default class Order {
  public readonly orderId: OrderId;
  constructor(
    public readonly baseToken: Token,
    public readonly quoteToken: Token,
    public readonly side: "buy" | "sell",
    public readonly type: "midpoint" | "limit",
    public readonly amount: bigint,
    public readonly minimumAmount?: bigint,
    public readonly price?: bigint,
  ) {
    this.orderId = uuid.v4();
  }

  serialize(): string {
    return `{
      "base_token": "${this.baseToken.serialize()}",
      "quote_token": "${this.quoteToken.serialize()}",
      "side": "${this.side === "buy" ? "Buy" : "Sell"}",
      "type": "${this.type === "midpoint" ? "Midpoint" : "Limit"}",
      "amount": ${this.amount},
      "minimum_amount": ${this.minimumAmount},
      "price": ${this.price}
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedOrder: any): Order {
    return new Order(
      Token.deserialize(serializedOrder.base_token),
      Token.deserialize(serializedOrder.quote_token),
      serializedOrder.side,
      serializedOrder.type,
      BigInt(serializedOrder.amount),
      BigInt(serializedOrder.minimum_amount),
      BigInt(serializedOrder.price),
    );
  }
}
