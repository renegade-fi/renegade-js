/// <reference types="node" />
import { OrderId } from "../types";
import Order from "./order";
export declare const RENEGADE_AUTH_HEADER = "renegade-auth";
export declare const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";
export declare function generateId(data: Buffer): string;
export declare function bigIntToLimbsLE(number: bigint, bitsPerLimb?: number, numLimbs?: number): bigint[];
export declare function limbsToBigIntLE(limbs: (number | bigint)[], bitsPerLimb?: number): bigint;
export declare function PoseidonCSPRNG(seed: bigint): Generator<bigint, bigint, undefined>;
export declare function findZeroOrders(orders: Record<OrderId, Order>): OrderId[];
