import { BalanceId } from "../types";
import Token from "./token";
export default class Balance {
    readonly balanceId: BalanceId;
    readonly mint: Token;
    readonly amount: bigint;
    constructor(params: {
        mint: Token;
        amount: bigint;
    });
    pack(): bigint[];
    serialize(): string;
    static deserialize(serializedBalance: any): Balance;
}
