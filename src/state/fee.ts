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
    // this.feeId = generateId()
  }
}
