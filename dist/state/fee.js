import * as uuid from "uuid";
import Token from "./token";
export default class Fee {
    constructor(params) {
        this.feeId = uuid.v4();
        this.pkSettle = params.pkSettle;
        this.gasMint = params.gasMint;
        this.gasAmount = params.gasAmount;
        this.percentFee = params.percentFee;
    }
    serialize() {
        return `{
      "pk_settle": ${this.pkSettle},
      "gas_mint": "${this.gasMint.serialize()}",
      "gas_amount": ${this.gasAmount},
      "percent_fee": ${this.percentFee}
    }`.replace(/[\s\n]/g, "");
    }
    static deserialize(serializedFee) {
        return new Fee({
            pkSettle: BigInt(serializedFee.pk_settle),
            gasMint: Token.deserialize(serializedFee.gas_mint),
            gasAmount: BigInt(serializedFee.gas_amount),
            percentFee: serializedFee.percent_fee,
        });
    }
}
