import * as uuid from "uuid";

import { FeeId } from "../types";
import Token from "./token";
import { bigIntToLimbsLE } from "./utils";

export default class Fee {
  public readonly feeId: FeeId;
  public readonly recipientKey: bigint;
  public readonly gasMint: Token;
  public readonly gasAmount: bigint;
  public readonly percentageFee: number;
  constructor(params: {
    recipientKey: bigint;
    gasMint: Token;
    gasAmount: bigint;
    percentageFee: number;
  }) {
    this.feeId = uuid.v4() as FeeId;
    this.recipientKey = params.recipientKey;
    this.gasMint = params.gasMint;
    this.gasAmount = params.gasAmount;
    this.percentageFee = params.percentageFee;
  }

  pack(): bigint[] {
    return [
      this.recipientKey,
      BigInt("0x" + this.gasMint.address),
      this.gasAmount,
      BigInt(this.percentageFee),
    ];
  }

  serialize(): string {
    return `{
      "recipient_key": "${this.recipientKey}",
      "gas_addr": "${this.gasMint.serialize()}",
      "gas_amount": [${bigIntToLimbsLE(this.gasAmount).join(",")}],
      "percentage_fee": ${this.percentageFee}
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedFee: any): Fee {
    return new Fee({
      recipientKey: BigInt(serializedFee.pk_settle),
      gasMint: Token.deserialize(serializedFee.gas_mint),
      gasAmount: BigInt(serializedFee.gas_amount),
      percentageFee: serializedFee.percent_fee,
    });
  }
}
