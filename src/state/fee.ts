import * as uuid from "uuid";

import { FeeId } from "../types";
import Token from "./token";

export default class Fee {
  public readonly feeId: FeeId;
  constructor(
    public readonly pkSettle: bigint,
    public readonly gasMint: Token,
    public readonly gasAmount: bigint,
    public readonly percentFee: number,
  ) {
    this.feeId = uuid.v4();
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
    return new Fee(
      BigInt(serializedFee.pk_settle),
      Token.deserialize(serializedFee.gas_mint),
      BigInt(serializedFee.gas_amount),
      serializedFee.percent_fee,
    );
  }
}
