declare class SigningKey {
    secretKey: Uint8Array;
    secretKeyHex: string;
    publicKey: Uint8Array;
    x: bigint;
    y: bigint;
    constructor(secretKey: Uint8Array);
    signMessage(message: string): string;
}
declare class IdentificationKey {
    secretKey: Uint8Array;
    publicKey: Uint8Array;
    constructor(secretKey: Uint8Array);
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
    seed?: string;
    filePath?: string;
    skRoot?: Uint8Array;
}
/**
 * The Keychain stores the entire KeyHierarchy for a Renegade Account.
 */
export default class Keychain {
    static CREATE_SK_ROOT_MESSAGE: string;
    static CREATE_SK_MATCH_MESSAGE: string;
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
    constructor(options?: KeychainOptions);
    /**
     * Given a seed buffer, computes the entire Renegade key hierarchy.
     */
    private populateHierarchy;
    /**
     * Sign a data buffer (concretely, a request's body) with an expiring
     * signature using sk_root.
     *
     * @returns A tuple consisting of an expiring signature and an expiration
     * timestamp, to be appended as headers to the request.
     */
    generateExpiringSignature(dataBuffer: string): [string, number];
    /**
     * Save the keychain to a file.
     *
     * @param filePath File path to save the keychain to.
     */
    saveToFile(filePath: string): void;
    /**
     * Load the keychain from a file.
     *
     * @param filePath File path to load the keychain from.
     */
    private loadFromFile;
    /**
     * Serialize the keychain to a string. Note that @noble/secp256k1 uses little
     * endian byte order for all EC points, so we reverse the byte order for big
     * endian encodings.
     *
     * @param asBigEndian If true, the keys will be serialized in big endian byte order.
     * @returns The serialized keychain.
     */
    serialize(asBigEndian?: boolean): string;
    static deserialize(serializedKeychain: any, asBigEndian?: boolean): Keychain;
}
export {};
