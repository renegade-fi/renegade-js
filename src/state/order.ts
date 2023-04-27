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
    public readonly price?: bigint,
  ) {
    // this.orderId = generateId(Buffer.concat([
    //   Buffer.from(baseToken.address),
    //   Buffer.from(quoteToken.address),
    // ]));
  }
}
