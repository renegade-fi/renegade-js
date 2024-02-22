import {
  add,
  compute_poseidon_hash,
  hex_to_field_scalar,
  subtract,
} from "../../renegade-utils";

export function toFieldScalar(value: bigint): bigint {
  const hexString: string = value.toString(16);
  const fieldScalarString: string = hex_to_field_scalar(hexString);
  return BigInt(fieldScalarString);
}

export function addFF(a: bigint, b: bigint): bigint {
  const hexA: string = a.toString(16);
  const hexB: string = b.toString(16);
  const sumString: string = add(hexA, hexB);
  return BigInt(sumString);
}

export function subtractFF(a: bigint, b: bigint): bigint {
  const hexA: string = a.toString(16);
  const hexB: string = b.toString(16);
  const differenceString: string = subtract(hexA, hexB);
  return BigInt(differenceString);
}

export function computePoseidonHash(input: bigint): bigint {
  const hexInput = input.toString(16);
  const hash: string = compute_poseidon_hash(hexInput);
  return BigInt(hash);
}
