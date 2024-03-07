import * as uuid from "uuid";

import { limbsToBigIntLE } from "../state/utils";
import { BalanceId } from "../types";
import Token from "./token";

export default class Balance {
  public readonly balanceId: BalanceId;
  public readonly mint: Token;
  public readonly amount: bigint;
  public readonly relayer_fee_balance: bigint;
  public readonly protocol_fee_balance: bigint;

  constructor(params: { mint: Token; amount: bigint }) {
    this.balanceId = uuid.v4() as BalanceId;
    this.mint = params.mint;
    this.amount = params.amount;
    this.relayer_fee_balance = BigInt(0);
    this.protocol_fee_balance = BigInt(0);
  }

  pack(): bigint[] {
    return [
      BigInt("0x" + this.mint.address),
      this.amount,
      this.relayer_fee_balance,
      this.protocol_fee_balance,
    ];
  }

  serialize(): string {
    return `{
      "mint": "${this.mint.serialize()}",
      "amount": ${this.amount},
      "relayer_fee_balance": ${this.relayer_fee_balance},
      "protocol_fee_balance": ${this.protocol_fee_balance}
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedBalance: any): Balance {
    return new Balance({
      mint: Token.deserialize(serializedBalance.mint),
      amount: BigInt(serializedBalance.amount),
    });
  }
}
