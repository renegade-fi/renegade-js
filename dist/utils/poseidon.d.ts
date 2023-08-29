export declare const OPT: any;
export declare class Poseidon {
    static F: any;
    static hash(inputs: bigint[]): bigint;
    static hashBytes(msg: Uint8Array): bigint;
    static hashBytesX(msg: Uint8Array, frameSize: number): bigint;
    static spongeHashX(inputs: bigint[], frameSize: number): bigint;
}
export declare const poseidon: typeof Poseidon;
