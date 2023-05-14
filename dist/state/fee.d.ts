import { FeeId } from "../types";
import Token from "./token";
export default class Fee {
    readonly feeId: FeeId;
    readonly pkSettle: bigint;
    readonly gasMint: Token;
    readonly gasAmount: bigint;
    readonly percentFee: number;
    constructor(params: {
        pkSettle: bigint;
        gasMint: Token;
        gasAmount: bigint;
        percentFee: number;
    });
    serialize(): string;
    static deserialize(serializedFee: any): Fee;
}
