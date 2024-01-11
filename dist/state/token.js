const ADDR_TO_TICKER = {
    "2260fac5e5542a773aa44fbcfedf7c193bc2c599": "WBTC",
    c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2: "WETH",
    b8c77482e45f1f44de1745f52c74426c631bdd52: "BNB",
    "7d1afa7b718fb893db30a3abc0cfc608aacfebb0": "MATIC",
    "4e15361fd6b4bb609fa63c81a2be19d873717870": "FTM",
    "6810e776880c02933d47db1b9fc05908e5386b96": "GNO",
    be9895146f7af43049ca1c1ae358b0541ea49704: "CBETH",
    "5a98fcbea516cf06857215779fd812ca3bef1b32": "LDO",
    a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48: "USDC",
    dac17f958d2ee523a2206206994597c13d831ec7: "USDT",
    "4fabb145d64652a948d72533023f6e7a623c7c53": "BUSD",
    ba11d00c5f74255f56a5e366f4f77f5a186d7f55: "BAND",
    "514910771af9ca656af840dff83e8264ecf986ca": "LINK",
    "1f9840a85d5af5bf1d1762f925bdaddc4201f984": "UNI",
    d533a949740bb3306d119cc777fa900ba034cd52: "CRV",
    "92d6c1e31e14520e676a687f0a93788b716beff5": "DYDX",
    "6b3595068778dd592e39a122f4f5a5cf09c90fe2": "SUSHI",
    "111111111117dc0aa78b770fa6a738034120c302": "1INCH",
    ba100000625a3754423978a60c9317c58a424e3d: "BAL",
    b3999f658c0391d94a37f7ff328f3fec942bcadc: "HFT",
    bc396689893d065f41bc2c6ecbee5e0085233447: "PERP",
    "4691937a7508860f876c9c0a2a617e7d9e945d4b": "WOO",
    e41d2489571d322189246dafa5ebde1f4699f498: "ZRX",
    "7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9": "AAVE",
    c00e94cb662c3520282e6f5717214004a7f26888: "COMP",
    "9f8f72aa9304c8b593d555f12ef6589cc3a579a2": "MKR",
    "0bc529c00c6401aef6d220be8c6ea1667f6ad93e": "YFI",
    "090185f2135308bad17527004364ebcc2d37e5f6": "SPELL",
    "4c19596f5aaff459fa38b0f7ed92f11ae6543784": "TRU",
    "33349b282065b0284d756f0577fb39c158f935e6": "MPL",
    c011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f: "SNX",
    "221657776846890989a759ba2973e427dff5c9bb": "REP",
    "77777feddddffc19ff86db637967013e6c6a116c": "TORN",
    "408e41876cccdc0f92210600ef50372656052a38": "REN",
    af5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6: "STG",
    "4a220e6096b25eadb88358cb44068a3248254675": "QNT",
    bbbbca6a901c926f240b89eacb641d8aec7aeafd: "LRC",
    "42bbfa2e77757c645eeaad1655e0911a7553efbc": "BOBA",
    "4d224452801aced8b2f0aebe155379bb5d594381": "APE",
    bb0e17ef65f82ab018d8edd776e8dd940327b28b: "AXS",
    f629cbd94d3791c9250152bd8dfbdf380e2a3b9c: "ENJ",
    ba5bde662c17e2adff1075610382b9b691296350: "RARE",
    "95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce": "SHIB",
    "7a58c0be72be218b41c608b7fe7c5bb630736c71": "PEOPLE",
    d26114cd6ee289accf82350c8d8487fedb8a0c07: "OMG",
    c944e90c64b2c07662a292be6244bdf05cda44a7: "GRT",
    c18360217d8f7ab5e7c516566761ea12ce7f9d72: "ENS",
    "0f5d2fb29fb7d3cfee444a200298f468908cc942": "MANA",
    "15d4c048f83bd7e37d49ea4c83a07267ec4203da": "GALA",
    "31c8eacbffdd875c74b94b077895bd78cf1e64a3": "RAD",
    "18aaa7115705e8be94bffebde57af9bfc265b998": "AUDIO",
    "0d8775f648430679a709e98d2b0cb6250d2887ef": "BAT",
};
const KATANA_ADDR_TO_TICKER = {
    ...ADDR_TO_TICKER,
    "49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": "WETH",
    "8e3feea13add88dce4439bc1d02a662ab4c4cb6dca4639dccba89b4e594680": "USDC",
};
const STYLUS_ADDR_TO_TICKER = {
    ...ADDR_TO_TICKER,
    "408da76e87511429485c32e4ad647dd14823fdc4": "WETH",
    "1bdce09dbc6fc66fb0f9c585c442a5a46eed7e7b": "USDC",
};
const TICKER_TO_ADDR = {};
for (const addr in ADDR_TO_TICKER) {
    TICKER_TO_ADDR[ADDR_TO_TICKER[addr]] = addr;
}
const KATANA_TICKER_TO_ADDR = {};
for (const addr in KATANA_ADDR_TO_TICKER) {
    KATANA_TICKER_TO_ADDR[KATANA_ADDR_TO_TICKER[addr]] = addr;
}
const STYLUS_TICKER_TO_ADDR = {};
for (const addr in STYLUS_ADDR_TO_TICKER) {
    STYLUS_TICKER_TO_ADDR[STYLUS_ADDR_TO_TICKER[addr]] = addr;
}
export default class Token {
    /**
     * Create a new Token from either the ERC-20 address or ticker symbol.
     *
     * @param address The ERC-20 ETH mainnet address of the token.
     * @param ticker The ticker symbol of the token.
     */
    constructor(params) {
        if ((params.address && params.ticker) ||
            (!params.address && !params.ticker)) {
            throw new Error("Exactly one of address or ticker must be specified.");
        }
        if (params.ticker) {
            let REMAPPED_TICKER_TO_ADDR = TICKER_TO_ADDR;
            if (params.network === "katana") {
                REMAPPED_TICKER_TO_ADDR = KATANA_TICKER_TO_ADDR;
            }
            else if (params.network === "stylus") {
                REMAPPED_TICKER_TO_ADDR = STYLUS_TICKER_TO_ADDR;
            }
            params.ticker = params.ticker.toUpperCase();
            if (params.ticker in REMAPPED_TICKER_TO_ADDR) {
                params.address = REMAPPED_TICKER_TO_ADDR[params.ticker];
            }
            else {
                throw new Error(`Unknown ticker: ${params.ticker}${params.network ? " in network: " + params.network : ""}. Try using the params.address instead.`);
            }
        }
        this.address = params.address.toLowerCase().replace("0x", "");
    }
    serialize() {
        return "0x" + this.address;
    }
    static deserialize(serializedToken) {
        return new Token({ address: serializedToken });
    }
}
