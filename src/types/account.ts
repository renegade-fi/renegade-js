import BN from "bn.js";

type Uuid = string;

/*** Account Types ***/
export type AccountId = Uuid;
export type CallbackId = Uuid;
export interface Token {}
export enum Exchange {
  Median = 0,
  Binance,
  Coinbase,
  Kraken,
  Okx,
  Uniswapv3,
}

/*** Balance Types ***/
export type BalanceId = Uuid;
export interface Balance {
  mint: Token;
  amount: number;
}

/*** Order Types ***/
export type OrderId = Uuid;
export interface Order {
  baseToken: Token;
  quoteToken: Token;
  side: "buy" | "sell";
  type: "midpoint" | "limit";
  amount: number;
  price?: number;
}

/*** Fee Types ***/
export type FeeId = Uuid;
export interface Fee {
  pkSettle: BN;
  gasMint: Token;
  gasAmount: number;
  percentFee: number;
}
