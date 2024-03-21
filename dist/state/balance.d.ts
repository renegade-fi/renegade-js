import { BalanceId } from "../types";
import Token from "./token";
export default class Balance {
    readonly balanceId: BalanceId;
    readonly mint: Token;
    amount: bigint;
    readonly relayer_fee_balance: bigint;
    readonly protocol_fee_balance: bigint;
    constructor(params: {
        id?: BalanceId;
        mint: Token;
        amount: bigint;
        relayer_fee_balance: bigint;
        protocol_fee_balance: bigint;
    });
    pack(): bigint[];
    serialize(): string;
    static deserialize(serializedBalance: any): Balance;
}
