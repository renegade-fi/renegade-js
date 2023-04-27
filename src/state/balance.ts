import * as uuid from "uuid";

import { BalanceId } from "../types";
import Token from "./token";

export default class Balance {
  public readonly balanceId: BalanceId;
  constructor(public readonly mint: Token, public readonly amount: bigint) {
    this.balanceId = uuid.v4();
  }

  serialize(): string {
    return `{
      "mint": "${this.mint.serialize()}",
      "amount": ${this.amount}
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedBalance: any): Balance {
    return new Balance(
      Token.deserialize(serializedBalance.mint),
      BigInt(serializedBalance.amount),
    );
  }
}
