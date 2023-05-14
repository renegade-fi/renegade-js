/// <reference types="node" />
export declare const RENEGADE_AUTH_HEADER = "renegade-auth";
export declare const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";
export declare function generateId(data: Buffer): string;
export declare function bigIntToLimbs(bigint: bigint): [bigint, bigint, bigint, bigint];
export declare function limbsToBigInt(limbs: number[]): bigint;
