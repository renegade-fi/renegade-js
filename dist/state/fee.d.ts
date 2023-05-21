import { FeeId } from "../types";
import Token from "./token";
export default class Fee {
    readonly feeId: FeeId;
    readonly recipientKey: bigint;
    readonly gasMint: Token;
    readonly gasAmount: bigint;
    readonly percentageFee: number;
    constructor(params: {
        recipientKey: bigint;
        gasMint: Token;
        gasAmount: bigint;
        percentageFee: number;
    });
    pack(): bigint[];
    serialize(): string;
    static deserialize(serializedFee: any): Fee;
}
