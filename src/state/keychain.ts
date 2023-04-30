import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import * as crypto from "crypto";
import * as fs from "fs";

// Allow for synchronous ed25519 signing. See:
// https://github.com/paulmillr/noble-ed25519/blob/main/README.md
ed.utils.sha512Sync = (...m) => sha512(ed.utils.concatBytes(...m));

const SIG_VALIDITY_WINDOW_MS = 10_000;

class SigningKey {
  secretKey: Uint8Array;
  publicKey: Uint8Array;

  constructor(secretKey: Uint8Array) {
    if (secretKey.length !== 32) {
      throw new Error("SigningKey secretKey must be 32 bytes.");
    }
    this.secretKey = secretKey;
    this.publicKey = ed.sync.getPublicKey(secretKey);
  }

  signMessage(message: Uint8Array): Uint8Array {
    const prehash = ed.utils.sha512Sync(message);
    return ed.sync.signWithContext(prehash, this.secretKey);
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
    this.publicKey = ed.utils.sha512Sync(this.secretKey).slice(32);
  }
}

/**
 * The KeyHierarchy contains the root, match, settle, and view keypairs for a
 * Renegade Account.
 */
interface KeyHierarchy {
  root: SigningKey;
  match: SigningKey;
  settle: SigningKey;
  view: SigningKey;
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
      skRoot = ed.utils
        .sha512Sync(Buffer.from(options.seed, "ascii"))
        .slice(32);
    } else if (options.filePath) {
      this.loadFromFile(options.filePath);
      return;
    } else if (options.skRoot) {
      if (options.skRoot.length !== 32) {
        throw new Error("KeychainOptions.skRoot must be 32 bytes.");
      }
      skRoot = options.skRoot;
    } else {
      skRoot = crypto.randomBytes(32);
    }
    // Populate the hierarchy.
    this.populateHierarchy(skRoot);
  }

  /**
   * Given a seed buffer, computes the entire Renegade key hierarchy.
   */
  private populateHierarchy(skRoot: Uint8Array): void {
    // Deive the root key.
    const root = new SigningKey(skRoot);

    // Derive the match key.
    const rootSignatureBytes = root.signMessage(
      Buffer.from(Keychain.CREATE_SK_MATCH_MESSAGE),
    );
    const skMatch = ed.utils.sha512Sync(rootSignatureBytes).slice(32);
    const match = new SigningKey(skMatch);

    // Derive the settle key.
    const matchSignatureBytes = match.signMessage(
      Buffer.from(Keychain.CREATE_SK_SETTLE_MESSAGE),
    );
    const skSettle = ed.utils.sha512Sync(matchSignatureBytes).slice(32);
    const settle = new SigningKey(skSettle);

    // Derive the view key.
    const settleSignatureBytes = settle.signMessage(
      Buffer.from(Keychain.CREATE_SK_VIEW_MESSAGE),
    );
    const skView = ed.utils.sha512Sync(settleSignatureBytes).slice(32);
    const view = new SigningKey(skView);

    // Save the key hierarchy.
    this.keyHierarchy = { root, match, settle, view };
  }

  /**
   * Sign a data buffer (concretely, a request's body) with an expiring
   * signature using sk_root.
   *
   * @returns A tuple consisting of an expiring signature and an expiration
   * timestamp, to be appended as headers to the request.
   */
  generateExpiringSignature(dataBuffer: Buffer): [number[], number] {
    const validUntil = Date.now() + SIG_VALIDITY_WINDOW_MS;
    const validUntilBuffer = Buffer.alloc(8);
    validUntilBuffer.writeBigUInt64LE(BigInt(validUntil));
    const message = Buffer.concat([dataBuffer, validUntilBuffer]);
    const signature = this.keyHierarchy.root.signMessage(message);
    return [Array.from(signature), validUntil];
  }

  /**
   * Save the keychain to a file.
   *
   * @param filePath File path to save the keychain to.
   */
  saveToFile(filePath: string): void {
    fs.writeFileSync(filePath, this.serialize());
  }

  /**
   * Load the keychain from a file.
   *
   * @param filePath File path to load the keychain from.
   */
  private loadFromFile(filePath: string): void {
    const keychainSerialized = fs.readFileSync(filePath, "utf8");
    const keychainDeserialized = Keychain.deserialize(
      JSON.parse(keychainSerialized),
    );
    this.keyHierarchy = keychainDeserialized.keyHierarchy;
  }

  /**
   * Serialize the keychain to a string. Note that @noble/ed25519 uses little
   * endian byte order for all EC points, so we reverse the byte order for big
   * endian encodings.*
   * @param asBigEndian If true, the keys will be serialized in big endian byte order.
   * @returns The serialized keychain.
   */
  serialize(asBigEndian?: boolean): string {
    const orderBytes = (x: Buffer) => (asBigEndian ? x.reverse() : x);
    return `{
      "public_keys": {
        "pk_root": "${orderBytes(
          Buffer.from(this.keyHierarchy.root.publicKey),
        ).toString("hex")}",
        "pk_match": "${orderBytes(
          Buffer.from(this.keyHierarchy.match.publicKey),
        ).toString("hex")}",
        "pk_settle": "${orderBytes(
          Buffer.from(this.keyHierarchy.settle.publicKey),
        ).toString("hex")}",
        "pk_view": "${orderBytes(
          Buffer.from(this.keyHierarchy.view.publicKey),
        ).toString("hex")}"
      },
      "secret_keys": {
        "sk_root": "${orderBytes(
          Buffer.from(this.keyHierarchy.root.secretKey),
        ).toString("hex")}",
        "sk_match": "${orderBytes(
          Buffer.from(this.keyHierarchy.match.secretKey),
        ).toString("hex")}",
        "sk_settle": "${orderBytes(
          Buffer.from(this.keyHierarchy.settle.secretKey),
        ).toString("hex")}",
        "sk_view": "${orderBytes(
          Buffer.from(this.keyHierarchy.view.secretKey),
        ).toString("hex")}"
      }
    }`.replace(/[\s\n]/g, "");
  }

  static deserialize(serializedKeychain: any, asBigEndian?: boolean): Keychain {
    const skRoot = Buffer.from(
      serializedKeychain.secret_keys.sk_root.replace("0x", ""),
      "hex",
    );
    return new Keychain({ skRoot: asBigEndian ? skRoot.reverse() : skRoot });
  }
}
