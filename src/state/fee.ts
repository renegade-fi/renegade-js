import * as uuid from "uuid";

import { FeeId } from "../types";
import Token from "./token";

export default class Fee {
  public readonly feeId: FeeId;
  public readonly pkSettle: bigint;
  public readonly gasMint: Token;
  public readonly gasAmount: bigint;
  public readonly percentFee: number;
  constructor(params: {
    pkSettle: bigint;
    gasMint: Token;
    gasAmount: bigint;
    percentFee: number;
  }) {
    this.feeId = uuid.v4() as FeeId;
    this.pkSettle = params.pkSettle;
    this.gasMint = params.gasMint;
    this.gasAmount = params.gasAmount;
    this.percentFee = params.percentFee;
  }

  serialize(): string {
    return `{
      "pk_settle": ${this.pkSettle},
      "gas_mint": "${this.gasMint.serialize()}",
      "gas_amount": ${this.gasAmount},
      "percent_fee": ${this.percentFee}
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedFee: any): Fee {
    return new Fee({
      pkSettle: BigInt(serializedFee.pk_settle),
      gasMint: Token.deserialize(serializedFee.gas_mint),
      gasAmount: BigInt(serializedFee.gas_amount),
      percentFee: serializedFee.percent_fee,
    });
  }
}
