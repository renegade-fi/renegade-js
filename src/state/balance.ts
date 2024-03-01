import * as uuid from "uuid";

import { limbsToBigIntLE } from "../state/utils";
import { BalanceId } from "../types";
import Token from "./token";

export default class Balance {
  public readonly balanceId: BalanceId;
  public readonly mint: Token;
  public readonly amount: bigint;

  constructor(params: { mint: Token; amount: bigint }) {
    this.balanceId = uuid.v4() as BalanceId;
    this.mint = params.mint;
    this.amount = params.amount;
  }

  pack(): bigint[] {
    return [BigInt("0x" + this.mint.address), this.amount];
  }

  serialize(): string {
    return `{
      "mint": "${this.mint.serialize()}",
      "amount": ${this.amount}
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedBalance: any): Balance {
    return new Balance({
      mint: Token.deserialize(serializedBalance.mint),
      amount: limbsToBigIntLE(serializedBalance.amount),
    });
  }
}
