import { createPublicClient, http, defineChain } from 'viem';
export const stylusDevnetEc2 = defineChain({
    id: 473474,
    name: "Renegade Testnet",
    network: "Renegade Testnet",
    testnet: true,
    nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: {
            http: ["http://35.183.100.90:8547/"],
        },
        public: {
            http: ["http://35.183.100.90:8547/"],
        },
    },
    blockExplorers: {
        default: {
            name: "Explorer",
            url: "https://explorer.renegade.fi/",
        },
    },
});
export const publicClient = createPublicClient({
    chain: stylusDevnetEc2,
    transport: http()
});
