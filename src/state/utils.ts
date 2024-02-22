import { sha256 } from "@noble/hashes/sha256";
import * as uuid from "uuid";
import { get_key_hierarchy } from "../../renegade-utils";
import { OrderId, WalletId } from "../types";
import {
  addFF,
  computePoseidonHash,
  subtractFF,
  toFieldScalar,
} from "../utils/field";
import Order from "./order";

export const RENEGADE_AUTH_HEADER = "renegade-auth";
export const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";

export function generateId(sk_root: string): WalletId {
  const publicKey = JSON.parse(
    get_key_hierarchy(sk_root),
  ).public_keys.pk_root.replace("0x", "");
  const dataHash = sha256(Buffer.from(publicKey, "hex"));
  return uuid.v4({ random: dataHash.slice(-16) }) as WalletId;
}

export function bigIntToLimbsLE(
  number: bigint,
  bitsPerLimb?: number,
  numLimbs?: number,
): bigint[] {
  bitsPerLimb = bitsPerLimb || 32;
  numLimbs = numLimbs || 8;
  if (number < 0n || number >= 2n ** BigInt(bitsPerLimb * numLimbs)) {
    throw new Error("Invalid conversion of bigint to limbs: " + number);
  }
  const limbs = [];
  for (let i = 0; i < numLimbs; i++) {
    limbs.push((number >> BigInt(i * bitsPerLimb)) % 2n ** BigInt(bitsPerLimb));
  }
  return limbs;
}

export function limbsToBigIntLE(
  limbs: (number | bigint)[],
  bitsPerLimb?: number,
): bigint {
  bitsPerLimb = bitsPerLimb || 32;
  let number = 0n;
  for (let i = 0; i < limbs.length; i++) {
    number += BigInt(limbs[i]) * 2n ** BigInt(i * bitsPerLimb);
  }
  return number;
}

/**
 * Convert a bigint to a Uint8Array
 */
export function bigIntToUint8Array(number: bigint): Uint8Array {
  return new Uint8Array(Buffer.from(number.toString(16), "hex")).reverse();
}

/**
 * Convert a Uint8Array to a bigint
 */
export function uint8ArrayToBigInt(buf: Uint8Array) {
  return BigInt("0x" + Buffer.from(buf).toString("hex"));
}

/**
 * Compute a chained Poseidon hash of the given length from the given seed
 */
export function evaluateHashChain(seed: bigint, length: number) {
  seed = toFieldScalar(seed);
  const res: bigint[] = [];
  for (let i = 0; i < length; i++) {
    seed = computePoseidonHash(seed);
    res.push(seed);
  }
  return res;
}

/**
 * Create a secret sharing of a wallet given the secret shares and blinders
 */
export function createWalletSharesWithRandomness(
  walletShares: bigint[],
  blinder: bigint,
  privateBlinderShare: bigint,
  secretShares: bigint[],
) {
  // const publicShares: bigint[] = walletShares.map((share) => F.e(share));
  const publicShares = walletShares;
  const walletPublicShares: bigint[] = publicShares.map((share, i) => {
    return subtractFF(share, secretShares[i]);
  });
  const privateShares = secretShares;
  const publicBlindedShares: bigint[] = walletPublicShares.map((share) =>
    addFF(share, blinder),
  );
  /// This is necessary because this implementation will blind the blinder as well as the shares, which is undesirable
  privateShares[privateShares.length - 1] = privateBlinderShare;
  publicBlindedShares[walletPublicShares.length - 1] = subtractFF(
    blinder,
    privateBlinderShare,
  );
  return [privateShares, publicBlindedShares];
}

export function findZeroOrders(orders: Record<OrderId, Order>) {
  return Object.entries(orders)
    .filter(([, order]) => order.amount === 0n)
    .map(([id]) => id as OrderId);
}
