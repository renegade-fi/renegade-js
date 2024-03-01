import * as uuid from "uuid";
import { limbsToBigIntLE } from "../state/utils";
import Token from "./token";
export default class Balance {
    balanceId;
    mint;
    amount;
    constructor(params) {
        this.balanceId = uuid.v4();
        this.mint = params.mint;
        this.amount = params.amount;
    }
    pack() {
        return [BigInt("0x" + this.mint.address), this.amount];
    }
    serialize() {
        return `{
      "mint": "${this.mint.serialize()}",
      "amount": ${this.amount}
    }`.replace(/[\s\n]/g, "");
    }
    static deserialize(serializedBalance) {
        return new Balance({
            mint: Token.deserialize(serializedBalance.mint),
            amount: limbsToBigIntLE(serializedBalance.amount),
        });
    }
}
