import { sha256 } from "@noble/hashes/sha256";
import * as secp from "@noble/secp256k1";
import { randomBytes } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import {
  get_verifying_key,
  sign_http_request,
  sign_message,
} from "../../dist/secp256k1";
import { bigIntToUint8Array } from "./utils";

// Allow for synchronous secp256 signing. See:
// https://github.com/paulmillr/noble-secp256k1/blob/main/README.md
secp.etc.hmacSha256Sync = (...m) => sha256(secp.etc.concatBytes(...m));
const SIG_VALIDITY_WINDOW_MS = 10_000;

class SigningKey {
  secretKey: Uint8Array;
  publicKey: Uint8Array;
  // Affine x coordinate of the public key
  x: bigint;
  // Affine y coordinate of the public key
  y: bigint;

  constructor(secretKey: Uint8Array) {
    if (secretKey.length !== 32) {
      throw new Error("SigningKey secretKey must be 32 bytes.");
    }
    this.secretKey = secretKey;
    this.publicKey = secp.getPublicKey(secretKey);

    const point = secp.ProjectivePoint.fromHex(this.publicKey);
    this.x = point.x;
    this.y = point.y;
  }

  signMessage(message: string): string {
    const skRootHex = Buffer.from(this.secretKey).toString("hex");
    return sign_message(message, skRootHex);
  }
}

class IdentificationKey {
  secretKey: Uint8Array;
  publicKey: Uint8Array;

  constructor(secretKey: Uint8Array) {
    if (secretKey.length !== 32) {
      throw new Error("IdentificationKey secretKey must be 32 bytes.");
    }
    this.secretKey = secretKey;
    // TODO: Use sha256 to hash
    // const secretKeyHash = sha256(secretKey);
    // const publicKey = F.e(uint8ArrayToBigInt(secretKeyHash));
    // this.publicKey = bigIntToUint8Array(publicKey);
    // this.publicKey = secp.getPublicKey(secretKey);
    const hexPublicKey = get_verifying_key(
      Buffer.from(secretKey).toString("hex"),
    );
    const bigIntPublicKey = BigInt(`0x${hexPublicKey}`);
    this.publicKey = bigIntToUint8Array(bigIntPublicKey);
  }
}

/**
 * The KeyHierarchy contains the root, match, and settlekeypairs for a Renegade
 * Account.
 */
interface KeyHierarchy {
  root: SigningKey;
  match: IdentificationKey;
}

/**
 * Options for creating a Keychain. If all options are undefined, then a random
 * seed will be used.
 */
interface KeychainOptions {
  // An seed to derive the Keychain.
  seed?: string;
  // A file path to load the Keychain from.
  filePath?: string;
  // The raw sk_root to use for the Keychain.
  skRoot?: Uint8Array;
}

/**
 * The Keychain stores the entire KeyHierarchy for a Renegade Account.
 */
export default class Keychain {
  static CREATE_SK_ROOT_MESSAGE = "Unlock your Renegade account.\nTestnet v0";
  static CREATE_SK_MATCH_MESSAGE = "Unlock your Renegade match key.";

  /**
   * The full renegade key hierarchy, including root, match, and settle
   * keypairs. Note that the Keychain class always contains all three secret
   * keys; for delegation to non-super-relayers, we support delegation without
   * sk_root.
   */
  keyHierarchy: KeyHierarchy;

  /**
   * Create a new Keychain.
   *
   * @param options Options for creating the keychain.
   */
  constructor(options?: KeychainOptions) {
    // Check argument validity.
    options = options || {};
    const numDefinedOptions = [
      options.seed,
      options.filePath,
      options.skRoot,
    ].filter((x) => x !== undefined).length;
    if (numDefinedOptions > 1) {
      throw new Error("Only one of KeychainOptions can be defined.");
    }
    // Extract skRoot from the inputs
    let skRoot: Uint8Array;
    if (options.seed) {
      skRoot = sha256(Buffer.from(options.seed));
    } else if (options.filePath) {
      this.loadFromFile(options.filePath);
      return;
    } else if (options.skRoot) {
      if (options.skRoot.length !== 32) {
        throw new Error("KeychainOptions.skRoot must be 32 bytes.");
      }
      skRoot = options.skRoot;
    } else {
      skRoot = randomBytes(32);
    }
    // Populate the hierarchy.
    this.populateHierarchy(skRoot);
  }

  /**
   * Given a seed buffer, computes the entire Renegade key hierarchy.
   */
  private populateHierarchy(skRoot: Uint8Array): void {
    // Derive the root key.
    const root = new SigningKey(skRoot);

    // Derive the match key.
    const rootSignatureBytes = root.signMessage(
      Keychain.CREATE_SK_MATCH_MESSAGE,
    );

    const skMatch = sha256(rootSignatureBytes);
    const match = new IdentificationKey(skMatch);

    // Save the key hierarchy.
    this.keyHierarchy = { root, match };
  }

  /**
   * Sign a data buffer (concretely, a request's body) with an expiring
   * signature using sk_root.
   *
   * @returns A tuple consisting of an expiring signature and an expiration
   * timestamp, to be appended as headers to the request.
   */
  generateExpiringSignature(dataBuffer: Buffer): [string, number] {
    const sk_root = Buffer.from(this.keyHierarchy.root.secretKey).toString(
      "hex",
    );

    // TODO: Should message be hashed? No.
    const message = Buffer.from(dataBuffer).toString("hex");
    const now = Date.now();
    const validUntil = now + SIG_VALIDITY_WINDOW_MS;
    const validUntilBuffer = Buffer.alloc(8);
    validUntilBuffer.writeUInt32LE(validUntil % 2 ** 32, 0);
    validUntilBuffer.writeUInt32LE(Math.floor(validUntil / 2 ** 32), 4);
    const [sig_header, expiration] = sign_http_request(
      message,
      BigInt(now),
      sk_root,
    );

    return [sig_header, expiration];
  }

  /**
   * Save the keychain to a file.
   *
   * @param filePath File path to save the keychain to.
   */
  saveToFile(filePath: string): void {
    writeFileSync(filePath, this.serialize());
  }

  /**
   * Load the keychain from a file.
   *
   * @param filePath File path to load the keychain from.
   */
  private loadFromFile(filePath: string): void {
    const keychainSerialized = readFileSync(filePath, "utf8");
    const keychainDeserialized = Keychain.deserialize(
      JSON.parse(keychainSerialized),
    );
    this.keyHierarchy = keychainDeserialized.keyHierarchy;
  }

  /**
   * Serialize the keychain to a string. Note that @noble/secp256k1 uses little
   * endian byte order for all EC points, so we reverse the byte order for big
   * endian encodings.
   *
   * @param asBigEndian If true, the keys will be serialized in big endian byte order.
   * @returns The serialized keychain.
   */
  serialize(asBigEndian?: boolean): string {
    const orderBytes = (x: Buffer) => (asBigEndian ? x.reverse() : x);
    return `{
      "public_keys": {
        "pk_root": "0x${orderBytes(
          Buffer.from(this.keyHierarchy.root.publicKey),
        ).toString("hex")}",
        "pk_match": "0x${orderBytes(
          Buffer.from(this.keyHierarchy.match.publicKey),
        ).toString("hex")}"
      },
      "private_keys": {
        "sk_root": "0x${orderBytes(
          Buffer.from(this.keyHierarchy.root.secretKey),
        ).toString("hex")}",
        "sk_match": "0x${orderBytes(
          Buffer.from(this.keyHierarchy.match.secretKey),
        ).toString("hex")}"
      }
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedKeychain: any, asBigEndian?: boolean): Keychain {
    let skRoot = Buffer.from(
      serializedKeychain.private_keys.sk_root.replace("0x", ""),
      "hex",
    );
    if (skRoot.length < 32) {
      skRoot = Buffer.concat([Buffer.alloc(32 - skRoot.length), skRoot]);
    }
    return new Keychain({ skRoot: asBigEndian ? skRoot.reverse() : skRoot });
  }
}
