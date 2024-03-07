import * as uuid from "uuid";
import Token from "./token";
export default class Balance {
    balanceId;
    mint;
    amount;
    relayer_fee_balance;
    protocol_fee_balance;
    constructor(params) {
        this.balanceId = uuid.v4();
        this.mint = params.mint;
        this.amount = params.amount;
        this.relayer_fee_balance = BigInt(0);
        this.protocol_fee_balance = BigInt(0);
    }
    pack() {
        return [
            BigInt("0x" + this.mint.address),
            this.amount,
            this.relayer_fee_balance,
            this.protocol_fee_balance,
        ];
    }
    serialize() {
        return `{
      "mint": "${this.mint.serialize()}",
      "amount": ${this.amount},
      "relayer_fee_balance": ${this.relayer_fee_balance},
      "protocol_fee_balance": ${this.protocol_fee_balance}
    }`.replace(/[\s\n]/g, "");
    }
    static deserialize(serializedBalance) {
        return new Balance({
            mint: Token.deserialize(serializedBalance.mint),
            amount: BigInt(serializedBalance.amount),
        });
    }
}
