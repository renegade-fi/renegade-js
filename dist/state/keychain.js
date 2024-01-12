import { sha256 } from "@noble/hashes/sha256";
import * as secp from "@noble/secp256k1";
import { randomBytes } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { compute_poseidon_hash, get_key_hierarchy, sign_http_request, sign_message, } from "../../dist/renegade-utils";
import { bigIntToUint8Array } from "./utils";
// Allow for synchronous secp256 signing. See:
// https://github.com/paulmillr/noble-secp256k1/blob/main/README.md
secp.etc.hmacSha256Sync = (...m) => sha256(secp.etc.concatBytes(...m));
class SigningKey {
    constructor(secretKey) {
        if (secretKey.length !== 32) {
            throw new Error("SigningKey secretKey must be 32 bytes.");
        }
        this.secretKey = secretKey;
        this.secretKeyHex = Buffer.from(secretKey).toString("hex");
        this.publicKey = secp.getPublicKey(secretKey);
        const point = secp.ProjectivePoint.fromHex(this.publicKey);
        this.x = point.x;
        this.y = point.y;
    }
    signMessage(message) {
        return sign_message(message, this.secretKeyHex);
    }
}
class IdentificationKey {
    constructor(secretKey) {
        if (secretKey.length !== 32) {
            throw new Error("IdentificationKey secretKey must be 32 bytes.");
        }
        this.secretKey = secretKey;
        const secretKeyHex = Buffer.from(secretKey).toString("hex");
        const publicKeyBigInt = compute_poseidon_hash(secretKeyHex);
        this.publicKey = bigIntToUint8Array(publicKeyBigInt);
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
            skRoot = sha256(Buffer.from(options.seed));
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
            skRoot = randomBytes(32);
        }
        // Populate the hierarchy.
        this.populateHierarchy(skRoot);
    }
    /**
     * Given a seed buffer, computes the entire Renegade key hierarchy.
     */
    populateHierarchy(skRoot) {
        // Derive the root key.
        const root = new SigningKey(skRoot);
        // Derive the match key.
        const rootSignatureBytes = root.signMessage(Keychain.CREATE_SK_MATCH_MESSAGE);
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
    generateExpiringSignature(dataBuffer) {
        const [renegadeAuth, renegadeAuthExpiration] = sign_http_request(dataBuffer, BigInt(Date.now()), this.keyHierarchy.root.secretKeyHex);
        return [renegadeAuth, renegadeAuthExpiration];
    }
    /**
     * Save the keychain to a file.
     *
     * @param filePath File path to save the keychain to.
     */
    saveToFile(filePath) {
        writeFileSync(filePath, this.serialize());
    }
    /**
     * Load the keychain from a file.
     *
     * @param filePath File path to load the keychain from.
     */
    loadFromFile(filePath) {
        const keychainSerialized = readFileSync(filePath, "utf8");
        const keychainDeserialized = Keychain.deserialize(JSON.parse(keychainSerialized));
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
    serialize(asBigEndian) {
        return get_key_hierarchy(this.keyHierarchy.root.secretKeyHex);
    }
    static deserialize(serializedKeychain, asBigEndian) {
        let skRoot = Buffer.from(serializedKeychain.private_keys.sk_root.replace("0x", ""), "hex");
        if (skRoot.length < 32) {
            skRoot = Buffer.concat([Buffer.alloc(32 - skRoot.length), skRoot]);
        }
        return new Keychain({ skRoot: asBigEndian ? skRoot.reverse() : skRoot });
    }
}
Keychain.CREATE_SK_ROOT_MESSAGE = "Unlock your Renegade account.\nTestnet v0";
Keychain.CREATE_SK_MATCH_MESSAGE = "Unlock your Renegade match key.\nTestnet v0";
export default Keychain;
