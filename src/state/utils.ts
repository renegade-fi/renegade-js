import keccak256 from "keccak256";
import * as uuid from "uuid";
import { OrderId } from "../types";
import { F } from "../utils/field";
import { poseidon } from "../utils/poseidon";
import Order from "./order";

export const RENEGADE_AUTH_HEADER = "renegade-auth";
export const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";

export function generateId(data: Buffer): string {
  const dataHash = new Uint8Array(keccak256(data));
  return uuid.v4({ random: dataHash.slice(-16) });
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

// TODO: Implement Poseidon with correct parameters
export function* PoseidonCSPRNG(
  seed: bigint,
): Generator<bigint, bigint, undefined> {
  let state = seed;

  while (true) {
    const hash = F.e(poseidon.hash([state]));
    state = hash;
    yield hash;
  }
}

export function findZeroOrders(orders: Record<OrderId, Order>) {
  return Object.entries(orders)
    .filter(([, order]) => order.amount === 0n)
    .map(([id]) => id as OrderId);
}
