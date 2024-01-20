import * as uuid from "uuid";

import { OrderId } from "../types";
import Token from "./token";
import { bigIntToLimbsLE, limbsToBigIntLE } from "./utils";

// A large number that is used to represent the higest possible price. We should
// think more deeply about extensibility here, as our relayer currently
// overflows large price values.
const MAX_PRICE = 2 ** 20;

export default class Order {
  public readonly orderId: OrderId;
  public readonly baseToken: Token;
  public readonly quoteToken: Token;
  public readonly side: "buy" | "sell";
  public readonly type: "midpoint" | "bidirectional";
  public readonly amount: bigint;
  public readonly minimumAmount: bigint;
  public readonly worstPrice: number;
  public readonly timestamp: number;
  constructor(params: {
    id?: OrderId;
    baseToken: Token;
    quoteToken: Token;
    side: "buy" | "sell";
    type: "midpoint" | "bidirectional";
    amount: bigint;
    minimumAmount?: bigint;
    worstPrice?: number;
    timestamp?: number;
  }) {
    if (params.type === "bidirectional") {
      throw new Error("Bidirectional LP orders are not yet supported.");
    }
    if (params.worstPrice && params.worstPrice > MAX_PRICE) {
      throw new Error(`worstPrice must be less than MAX_PRICE = ${MAX_PRICE}`);
    }
    this.orderId = params.id || (uuid.v4() as OrderId);
    this.baseToken = params.baseToken;
    this.quoteToken = params.quoteToken;
    this.side = params.side;
    this.type = params.type;
    this.amount = params.amount;
    this.minimumAmount = params.minimumAmount || BigInt(0);
    this.worstPrice =
      params.worstPrice !== undefined
        ? params.worstPrice
        : params.side === "buy"
          ? MAX_PRICE
          : 0;
    this.timestamp = params.timestamp || new Date().getTime();
  }

  pack(): bigint[] {
    // TODO: Figure out correct price encoding.
    return [
      BigInt("0x" + this.quoteToken.address),
      BigInt("0x" + this.baseToken.address),
      this.side === "buy" ? 0n : 1n,
      this.amount,
      // Relayer expects worstPrice to be a FixedPoint
      BigInt(Math.floor(this.worstPrice * 2 ** 32 || 0)),
      BigInt(this.timestamp),
    ];
  }

  serialize(): string {
    let minimumAmountSerialized: string | null;
    if (this.minimumAmount) {
      minimumAmountSerialized = `[${bigIntToLimbsLE(this.minimumAmount).join(
        ",",
      )}]`;
    } else {
      minimumAmountSerialized = null;
    }
    return `{
      "id": "${this.orderId}",
      "base_mint": "${this.baseToken.serialize()}",
      "quote_mint": "${this.quoteToken.serialize()}",
      "side": "${this.side === "buy" ? "Buy" : "Sell"}",
      "type": "${this.type === "midpoint" ? "Midpoint" : "Limit"}",
      "amount": [${this.amount}],
      "minimum_amount": ${minimumAmountSerialized},
      "worst_case_price": ${this.worstPrice},
      "timestamp": ${this.timestamp}
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedOrder: any): Order {
    let minimumAmountDeserialized: bigint | undefined;
    if (serializedOrder.minimum_amount) {
      minimumAmountDeserialized = limbsToBigIntLE(
        serializedOrder.minimum_amount,
      );
    } else {
      minimumAmountDeserialized = undefined;
    }
    return new Order({
      id: serializedOrder.id,
      baseToken: Token.deserialize(serializedOrder.base_mint),
      quoteToken: Token.deserialize(serializedOrder.quote_mint),
      side: serializedOrder.side.toLowerCase(),
      type: serializedOrder.type.toLowerCase(),
      amount: limbsToBigIntLE(serializedOrder.amount),
      minimumAmount: minimumAmountDeserialized,
      worstPrice: Number(serializedOrder.worst_case_price),
      timestamp: serializedOrder.timestamp,
    });
  }
}
