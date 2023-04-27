import { BalanceId } from "../types";
import Token from "./token";
import { generateId } from "./utils";

export default class Balance {
  public readonly balanceId: BalanceId;
  constructor(public readonly mint: Token, public readonly amount: bigint) {
    this.balanceId = generateId(
      Buffer.concat([
        Buffer.from(mint.address),
        Buffer.from(amount.toString()),
      ]),
    );
  }
}
