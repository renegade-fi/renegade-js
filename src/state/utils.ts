import keccak256 from "keccak256";
import * as uuid from "uuid";

export function generateId(data: Buffer): uuid {
  const dataHash = new Uint8Array(keccak256(data));
  return uuid.v4({ random: dataHash.slice(-16) });
}
