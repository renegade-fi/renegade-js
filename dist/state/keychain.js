import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import * as crypto from "crypto";
import * as fs from "fs";
// https://doc.dalek.rs/curve25519_dalek/constants/constant.BASEPOINT_ORDER.html
export const BASEPOINT_ORDER = BigInt(2) ** BigInt(252) + BigInt("0x14def9dea2f79cd65812631a5cf5d3ed");
// Allow for synchronous ed25519 signing. See:
// https://github.com/paulmillr/noble-ed25519/blob/main/README.md
ed.utils.sha512Sync = (...m) => sha512(ed.utils.concatBytes(...m));
const SIG_VALIDITY_WINDOW_MS = 10000;
class SigningKey {
    constructor(secretKey) {
        if (secretKey.length !== 32) {
            throw new Error("SigningKey secretKey must be 32 bytes.");
        }
        this.secretKey = secretKey;
        this.publicKey = ed.sync.getPublicKey(secretKey);
    }
    signMessage(message) {
        const prehash = ed.utils.sha512Sync(message);
        return ed.sync.signWithContext(prehash, this.secretKey);
    }
}
class IdentificationKey {
    constructor(secretKey) {
        if (secretKey.length !== 32) {
            throw new Error("IdentificationKey secretKey must be 32 bytes.");
        }
        this.secretKey = secretKey;
        // TODO: Turn this into a Pedersen hash.
        const secretKeyHash = ed.utils.sha512Sync(this.secretKey);
        const publicKey = BigInt("0x" + Buffer.from(secretKeyHash).toString("hex")) %
            BASEPOINT_ORDER;
        this.publicKey = new Uint8Array(Buffer.from(publicKey.toString(16), "hex"));
    }
}
/**
 * The Keychain stores the entire KeyHierarchy for a Renegade Account.
 */
class Keychain {
    /**
     * Create a new Keychain.
     *
     * @param options Options for creating the keychain.
     */
    constructor(options) {
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
        let skRoot;
        if (options.seed) {
            skRoot = ed.utils
                .sha512Sync(Buffer.from(options.seed, "ascii"))
                .slice(32);
        }
        else if (options.filePath) {
            this.loadFromFile(options.filePath);
            return;
        }
        else if (options.skRoot) {
            if (options.skRoot.length !== 32) {
                throw new Error("KeychainOptions.skRoot must be 32 bytes.");
            }
            skRoot = options.skRoot;
        }
        else {
            skRoot = crypto.randomBytes(32);
        }
        // Populate the hierarchy.
        this.populateHierarchy(skRoot);
    }
    /**
     * Given a seed buffer, computes the entire Renegade key hierarchy.
     */
    populateHierarchy(skRoot) {
        // Deive the root key.
        const root = new SigningKey(skRoot);
        // Derive the match key.
        const rootSignatureBytes = root.signMessage(Buffer.from(Keychain.CREATE_SK_MATCH_MESSAGE));
        const skMatch = ed.utils.sha512Sync(rootSignatureBytes).slice(32);
        const match = new IdentificationKey(skMatch);
        // Derive the settle key.
        const skSettle = ed.utils.sha512Sync(match.secretKey).slice(32);
        const settle = new SigningKey(skSettle);
        // Save the key hierarchy.
        this.keyHierarchy = { root, match, settle };
    }
    /**
     * Sign a data buffer (concretely, a request's body) with an expiring
     * signature using sk_root.
     *
     * @returns A tuple consisting of an expiring signature and an expiration
     * timestamp, to be appended as headers to the request.
     */
    generateExpiringSignature(dataBuffer) {
        const validUntil = Date.now() + SIG_VALIDITY_WINDOW_MS;
        const validUntilBuffer = Buffer.alloc(8);
        validUntilBuffer.writeUInt32LE(validUntil % 2 ** 32, 0);
        validUntilBuffer.writeUInt32LE(Math.floor(validUntil / 2 ** 32), 4);
        const message = Buffer.concat([dataBuffer, validUntilBuffer]);
        const signature = this.keyHierarchy.root.signMessage(message);
        return [Array.from(signature), validUntil];
    }
    /**
     * Save the keychain to a file.
     *
     * @param filePath File path to save the keychain to.
     */
    saveToFile(filePath) {
        fs.writeFileSync(filePath, this.serialize());
    }
    /**
     * Load the keychain from a file.
     *
     * @param filePath File path to load the keychain from.
     */
    loadFromFile(filePath) {
        const keychainSerialized = fs.readFileSync(filePath, "utf8");
        const keychainDeserialized = Keychain.deserialize(JSON.parse(keychainSerialized));
        this.keyHierarchy = keychainDeserialized.keyHierarchy;
    }
    /**
     * Serialize the keychain to a string. Note that @noble/ed25519 uses little
     * endian byte order for all EC points, so we reverse the byte order for big
     * endian encodings.
     *
     * @param asBigEndian If true, the keys will be serialized in big endian byte order.
     * @returns The serialized keychain.
     */
    serialize(asBigEndian) {
        const orderBytes = (x) => (asBigEndian ? x.reverse() : x);
        return `{
      "public_keys": {
        "pk_root": "0x${orderBytes(Buffer.from(this.keyHierarchy.root.publicKey)).toString("hex")}",
        "pk_match": "0x${orderBytes(Buffer.from(this.keyHierarchy.match.publicKey)).toString("hex")}",
        "pk_settle": "0x${orderBytes(Buffer.from(this.keyHierarchy.settle.publicKey)).toString("hex")}"
      },
      "secret_keys": {
        "sk_root": "0x${orderBytes(Buffer.from(this.keyHierarchy.root.secretKey)).toString("hex")}",
        "sk_match": "0x${orderBytes(Buffer.from(this.keyHierarchy.match.secretKey)).toString("hex")}",
        "sk_settle": "0x${orderBytes(Buffer.from(this.keyHierarchy.settle.secretKey)).toString("hex")}"
      }
    }`.replace(/[\s\n]/g, "");
    }
    static deserialize(serializedKeychain, asBigEndian) {
        let skRoot = Buffer.from(serializedKeychain.secret_keys.sk_root.replace("0x", ""), "hex");
        if (skRoot.length < 32) {
            skRoot = Buffer.concat([Buffer.alloc(32 - skRoot.length), skRoot]);
        }
        return new Keychain({ skRoot: asBigEndian ? skRoot.reverse() : skRoot });
    }
}
Keychain.CREATE_SK_ROOT_MESSAGE = "Unlock your Renegade account.\nTestnet v0";
Keychain.CREATE_SK_MATCH_MESSAGE = "Unlock your Renegade match key.\nTestnet v0";
export default Keychain;
