type Uuid = string;

export type WalletId = Uuid;
export type BalanceId = Uuid;
export type OrderId = Uuid;
export type FeeId = Uuid;

export type AccountId = Uuid;
export type TaskId = Uuid;
export type CallbackId = Uuid;

export enum Exchange {
  Median = 0,
  Binance,
  Coinbase,
  Kraken,
  Okx,
  Uniswapv3,
}
