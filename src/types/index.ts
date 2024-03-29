import { Wallet } from "../state";

type Uuid = string;

type Brand<K, T> = K & { __brand: T };

/**
 * Brands and types for Wallet-related IDs.
 */
export type WalletId = Brand<Uuid, "WalletId">;
export type BalanceId = Brand<Uuid, "BalanceId">;
export type OrderId = Brand<Uuid, "OrderId">;

/**
 * Brands and types for Renegade object related IDs.
 */
export type AccountId = Brand<Uuid, "AccountId">;
export type TaskId = Brand<Uuid, "TaskId">;
export type CallbackId = Brand<Uuid, "CallbackId">;

export enum Exchange {
  Median = "median",
  Binance = "binance",
  Coinbase = "coinbase",
  Kraken = "kraken",
  Okx = "okx",
  Uniswapv3 = "uniswapv3",
}
