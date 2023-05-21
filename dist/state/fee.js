import * as uuid from "uuid";
import Token from "./token";
import { bigIntToLimbsLE } from "./utils";
export default class Fee {
    constructor(params) {
        this.feeId = uuid.v4();
        this.recipientKey = params.recipientKey;
        this.gasMint = params.gasMint;
        this.gasAmount = params.gasAmount;
        this.percentageFee = params.percentageFee;
    }
    pack() {
        return [
            this.recipientKey,
            BigInt("0x" + this.gasMint.address),
            this.gasAmount,
            BigInt(this.percentageFee),
        ];
    }
    serialize() {
        return `{
      "recipient_key": "${this.recipientKey}",
      "gas_addr": "${this.gasMint.serialize()}",
      "gas_amount": [${bigIntToLimbsLE(this.gasAmount).join(",")}],
      "percentage_fee": ${this.percentageFee}
    }`.replace(/[\s\n]/g, "");
    }
    static deserialize(serializedFee) {
        return new Fee({
            recipientKey: BigInt(serializedFee.pk_settle),
            gasMint: Token.deserialize(serializedFee.gas_mint),
            gasAmount: BigInt(serializedFee.gas_amount),
            percentageFee: serializedFee.percent_fee,
        });
    }
}
