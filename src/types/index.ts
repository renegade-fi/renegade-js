type Uuid = string;

/**
 * Brands and types for Wallet-related IDs.
 */
enum WalletIdBrand {
  _ = "",
}
export type WalletId = WalletIdBrand & Uuid;
enum BalanceIdBrand {
  _ = "",
}
export type BalanceId = BalanceIdBrand & Uuid;
enum OrderIdBrand {
  _ = "",
}
export type OrderId = OrderIdBrand & Uuid;
enum FeeIdBrand {
  _ = "",
}
export type FeeId = FeeIdBrand & Uuid;

/**
 * Brands and types for Renegade object related IDs.
 */
enum AccountIdBrand {
  _ = "",
}
export type AccountId = AccountIdBrand & Uuid;
enum TaskIdBrand {
  _ = "",
}
export type TaskId = TaskIdBrand & Uuid;
enum CallbackIdBrand {
  _ = "",
}
export type CallbackId = CallbackIdBrand & Uuid;

export enum Exchange {
  Median = 0,
  Binance,
  Coinbase,
  Kraken,
  Okx,
  Uniswapv3,
}
