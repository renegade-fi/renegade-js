import { evaluateHashChain } from "../state/utils";
import { subtractFF } from "../utils/field";
import { createPublicClient, http, defineChain, parseAbiItem } from "viem";

export async function lookupWallet(skRoot: string) {
  const blinderSeed = BigInt(`0x${skRoot}`) + 1n;
  const [blinder, blinderPrivateShare] = evaluateHashChain(blinderSeed, 2);
  const blinderPublicShare = subtractFF(blinder, blinderPrivateShare);

  const logs = await publicClient.getLogs({
    address: "0xde1eef14801cd14045b645755a5682dd188256b8",
    event: parseAbiItem(
      "event WalletUpdated(uint256 indexed wallet_blinder_share)",
    ),
    args: {
      wallet_blinder_share: blinderPublicShare,
    },
    fromBlock: 0n,
  });
  return logs.length > 0;
}

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
      http: ["https://sequencer.renegade.fi/"],
    },
    public: {
      http: ["https://sequencer.renegade.fi/"],
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
  transport: http(),
});
