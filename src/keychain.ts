import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import BN from "bn.js";
import * as crypto from "crypto";
import * as fs from "fs";
import keccak256 from "keccak256";

// Allow for synchronous ed25519 signing. See:
// https://github.com/paulmillr/noble-ed25519/blob/main/README.md
ed.utils.sha512Sync = (...m) => sha512(ed.utils.concatBytes(...m));

class RenegadeKeypair {
  // Hex of 2^255 - 19.
  static CURVE_25519_FIELD_ORDER = new BN(
    "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed",
    16,
  );

  secretKey: BN;
  publicKey: BN;

  constructor(secretKey: BN) {
    if (
      secretKey.lt(new BN(0)) ||
      secretKey.gt(RenegadeKeypair.CURVE_25519_FIELD_ORDER)
    ) {
      throw new Error("Secret key is out of range: " + secretKey.toString(16));
    }
    this.secretKey = secretKey;
    this.publicKey = this.recoverPublicKey(secretKey);
  }

  signMessage(message: string): Uint8Array {
    const secretKeyArray = Buffer.from(this.secretKey.toArray("be", 32));
    const messageArray = Buffer.from(message, "ascii");
    const signature = ed.sync.sign(messageArray, secretKeyArray); // 64 bytes
    return signature;
  }

  /**
   * Recover the public key for a given secret key.
   *
   * Use fast exponentiation to compute:
   * 2^secretKey mod (2^255 - 19)
   */
  private recoverPublicKey(secretKey: BN): BN {
    let publicKey = new BN(1);
    // `iterativeSquareModP` keeps tracks of 2^(2^i) mod (2^255 - 19)
    let iterativeSquareModP = new BN(2);
    for (let i = 0; i < 255; i++) {
      // If the binary representation of the secret key has a 1 at this index,
      // multiply the public key by the current iterative square.
      if (secretKey.and(new BN(2).pow(new BN(i))).gt(new BN(0))) {
        publicKey = publicKey.mul(iterativeSquareModP);
        publicKey = publicKey.mod(RenegadeKeypair.CURVE_25519_FIELD_ORDER);
      }
      // Advance the iterative square.
      iterativeSquareModP = iterativeSquareModP.mul(iterativeSquareModP);
      iterativeSquareModP = iterativeSquareModP.mod(
        RenegadeKeypair.CURVE_25519_FIELD_ORDER,
      );
    }
    return publicKey;
  }
}

/**
 * The KeyHierarchy contains the root, match, settle, and view keypairs for a
 * Renegade Account.
 */
interface KeyHierarchy {
  root: RenegadeKeypair;
  match: RenegadeKeypair;
  settle: RenegadeKeypair;
  view: RenegadeKeypair;
}

/**
 * Options for creating a Keychain.
 */
interface KeychainOptions {
  // The file path to load the keychain from. If undefined, the keychain will be
  // generated from the seed.
  filePath?: string;
  // The ASCII seed to use to generate the keychain. If undefined, a random seed
  // will be used.
  seed?: string | Buffer;
}

/**
 * The Keychain stores the entire KeyHierarchy for a Renegade Account.
 */
export default class Keychain {
  static CREATE_SK_ROOT_MESSAGE = "Unlock your Renegade account.\nTestnet v0";
  static CREATE_SK_MATCH_MESSAGE =
    "Unlock your Renegade match key.\nTestnet v0";
  static CREATE_SK_SETTLE_MESSAGE =
    "Unlock your Renegade settle key.\nTestnet v0";
  static CREATE_SK_VIEW_MESSAGE = "Unlock your Renegade view key.\nTestnet v0";

  /**
   * The full renegade key hierarchy, including root, match, settle, and view
   * keypairs. Note that the Keychain class always contains all four secret
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
    if (options.seed !== undefined && options.filePath !== undefined) {
      throw new Error("Only one of seed or filePath can be provided.");
    }
    // Extract the seed from the inputs.
    let seedBuffer: Buffer;
    if (options.filePath !== undefined) {
      this.loadFromFile(options.filePath);
      return;
    } else if (options.seed === undefined) {
      seedBuffer = crypto.randomBytes(32);
    } else if (typeof options.seed === "string") {
      seedBuffer = Buffer.from(options.seed, "ascii");
    } else {
      seedBuffer = options.seed;
    }
    // Populate the hierarchy.
    this.populateHierarchy(seedBuffer);
  }

  /**
   * Given a seed buffer, computes the entire Renegade key hierarchy.
   */
  private populateHierarchy(seedBuffer: Buffer): void {
    // Deive the root key.
    const rootSecretKey = this.hashBytesMod25519(seedBuffer);
    const root = new RenegadeKeypair(rootSecretKey);

    // Derive the match key.
    const rootSignatureBytes = root.signMessage(
      Keychain.CREATE_SK_MATCH_MESSAGE,
    );
    const matchSecretKey = this.hashBytesMod25519(
      Buffer.from(rootSignatureBytes),
    );
    const match = new RenegadeKeypair(matchSecretKey);

    // Derive the settle key.
    const matchSignatureBytes = match.signMessage(
      Keychain.CREATE_SK_SETTLE_MESSAGE,
    );
    const settleSecretKey = this.hashBytesMod25519(
      Buffer.from(matchSignatureBytes),
    );
    const settle = new RenegadeKeypair(settleSecretKey);

    // Derive the view key.
    const settleSignatureBytes = settle.signMessage(
      Keychain.CREATE_SK_VIEW_MESSAGE,
    );
    const viewSecretKey = this.hashBytesMod25519(
      Buffer.from(settleSignatureBytes),
    );
    const view = new RenegadeKeypair(viewSecretKey);

    // Save the key hierarchy.
    this.keyHierarchy = { root, match, settle, view };
  }

  /**
   * Given a Buffer, hash the buffer with keccak256, and return the resulting
   * hash modulo the Curve25519 field order.
   */
  private hashBytesMod25519(bytes: Buffer): BN {
    const hash = keccak256(bytes);
    const hashBN = new BN(new Uint8Array(hash), undefined, "be");
    const hashMod25519 = hashBN.mod(RenegadeKeypair.CURVE_25519_FIELD_ORDER);
    return hashMod25519;
  }

  /**
   * Save the keychain to a file.
   *
   * @param filePath File path to save the keychain to.
   */
  saveToFile(filePath: string): void {
    const keychainSerialized = JSON.stringify(this.keyHierarchy);
    fs.writeFileSync(filePath, keychainSerialized);
  }

  /**
   * Load the keychain from a file.
   *
   * @param filePath File path to load the keychain from.
   */
  private loadFromFile(filePath: string): void {
    const keychainSerialized = fs.readFileSync(filePath, "utf8");
    this.keyHierarchy = JSON.parse(keychainSerialized);
    // Massage some types.
    const parseAsKeypair = (secretKey: string) =>
      new RenegadeKeypair(new BN(secretKey, 16));
    for (const key of ["root", "match", "settle", "view"]) {
      this.keyHierarchy[key] = parseAsKeypair(this.keyHierarchy[key].secretKey);
    }
  }

  serialize(): {} {
    return `{
      "public_keys": {
        "pk_root": "${this.keyHierarchy.root.publicKey.toString("hex")}",
        "pk_match": "${this.keyHierarchy.match.publicKey.toString("hex")}",
        "pk_settle": "${this.keyHierarchy.settle.publicKey.toString("hex")}",
        "pk_view": "${this.keyHierarchy.view.publicKey.toString("hex")}"
      },
      "secret_keys": {
        "sk_root": "${this.keyHierarchy.root.secretKey.toString("hex")}",
        "sk_match": "${this.keyHierarchy.match.secretKey.toString("hex")}",
        "sk_settle": "${this.keyHierarchy.settle.secretKey.toString("hex")}",
        "sk_view": "${this.keyHierarchy.view.secretKey.toString("hex")}"
      }
    }`.replace(/[\s\n]/g, "");
  }
}
