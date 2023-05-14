export default class Token {
    readonly address: string;
    /**
     * Create a new Token from either the ERC-20 address or ticker symbol.
     *
     * @param address The ERC-20 ETH mainnet address of the token.
     * @param ticker The ticker symbol of the token.
     */
    constructor(params: {
        address?: string;
        ticker?: string;
    });
    serialize(): string;
    static deserialize(serializedToken: string): Token;
}
