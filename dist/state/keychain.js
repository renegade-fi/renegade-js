import { sha256 } from "@noble/hashes/sha256";
// import { readFileSync, writeFileSync } from "fs";
import { get_key_hierarchy, sign_http_request, sign_message } from "../../renegade-utils";
/**
 * Represents a signing key used for signing messages.
 */
class SigningKey {
    /**
     * The hexadecimal representation of the secret key.
     */
    secretKey;
    /**
     * The hexadecimal representation of the public key.
     */
    publicKey;
    constructor(secretKey) {
        if (secretKey.length !== 32) {
            throw new Error("SigningKey secretKey must be 32 bytes.");
        }
        this.secretKey = Buffer.from(secretKey).toString("hex");
        this.publicKey = JSON.parse(get_key_hierarchy(this.secretKey)).public_keys.pk_root.replace("0x", "");
    }
    signMessage(message) {
        return sign_message(message, this.secretKey);
    }
}
class IdentificationKey {
    /**
     * The hexadecimal representation of the secret key.
     */
    secretKey;
    /**
     * The hexadecimal representation of the public key.
     */
    publicKey;
    constructor(secretKey, publicKey) {
        this.secretKey = secretKey;
        this.publicKey = publicKey;
    }
}
/**
 * The Keychain stores the entire KeyHierarchy for a Renegade Account.
 */
export default class Keychain {
    static CREATE_SK_ROOT_MESSAGE = "Unlock your Renegade account.\nTestnet v0";
    static CREATE_SK_MATCH_MESSAGE = "Unlock your Renegade match key.\nTestnet v0";
    /**
     * The full renegade key hierarchy, including root, match, and settle
     * keypairs. Note that the Keychain class always contains all three secret
     * keys; for delegation to non-super-relayers, we support delegation without
     * sk_root.
     */
    keyHierarchy;
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
            skRoot = crypto.getRandomValues(new Uint8Array(32));
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
        const skMatch = JSON.parse(get_key_hierarchy(root.secretKey)).private_keys.sk_match.replace("0x", "");
        const pkMatch = JSON.parse(get_key_hierarchy(root.secretKey)).public_keys.pk_match.replace("0x", "");
        const match = new IdentificationKey(skMatch, pkMatch);
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
        const [renegadeAuth, renegadeAuthExpiration] = sign_http_request(dataBuffer, BigInt(Date.now()), this.keyHierarchy.root.secretKey);
        return [renegadeAuth, renegadeAuthExpiration];
    }
    /**
     * Save the keychain to a file.
     *
     * @param filePath File path to save the keychain to.
     */
    saveToFile(filePath) {
        // writeFileSync(filePath, this.serialize());
    }
    /**
     * Load the keychain from a file.
     *
     * @param filePath File path to load the keychain from.
     */
    loadFromFile(filePath) {
        // const keychainSerialized = readFileSync(filePath, "utf8");
        // const keychainDeserialized = Keychain.deserialize(
        //   JSON.parse(keychainSerialized),
        // );
        // this.keyHierarchy = keychainDeserialized.keyHierarchy;
    }
    /**
     * Serialize the keychain to a string. Note that @noble/secp256k1 uses little
     * endian byte order for all EC points, so we reverse the byte order for big
     * endian encodings.
     *
     * @returns The serialized keychain.
     */
    serialize() {
        return get_key_hierarchy(this.keyHierarchy.root.secretKey);
    }
    static deserialize(serializedKeychain) {
        let skRoot = Buffer.from(serializedKeychain.private_keys.sk_root.replace("0x", ""), "hex");
        if (skRoot.length < 32) {
            skRoot = Buffer.concat([Buffer.alloc(32 - skRoot.length), skRoot]);
        }
        return new Keychain({ skRoot });
    }
}
