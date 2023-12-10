/// <reference types="node" />
import { OrderId } from "../types";
import Order from "./order";
export declare const RENEGADE_AUTH_HEADER = "renegade-auth";
export declare const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";
export declare function generateId(data: Buffer): string;
export declare function bigIntToLimbsLE(number: bigint, bitsPerLimb?: number, numLimbs?: number): bigint[];
export declare function limbsToBigIntLE(limbs: (number | bigint)[], bitsPerLimb?: number): bigint;
export declare function splitBigIntIntoWords(number: bigint, SCALAR_WORDS?: number): bigint[];
export declare function combineWordsIntoBigInt(words: bigint[]): bigint;
/**
 * Convert a bigint to a Uint8Array
 */
export declare function bigIntToUint8Array(number: bigint): Uint8Array;
/**
 * Convert a Uint8Array to a bigint
 */
export declare function uint8ArrayToBigInt(buf: Uint8Array): bigint;
/**
 * Compute a chained Poseidon hash of the given length from the given seed
 */
export declare function evaluateHashChain(seed: bigint, length: number): bigint[];
/**
 * Create a secret sharing of a wallet given the secret shares and blinders
 */
export declare function createWalletSharesWithRandomness(walletShares: bigint[], blinder: bigint, privateBlinderShare: bigint, secretShares: bigint[]): bigint[][];
export declare function findZeroOrders(orders: Record<OrderId, Order>): OrderId[];
