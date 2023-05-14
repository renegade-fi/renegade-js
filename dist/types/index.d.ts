type Uuid = string;
type Brand<K, T> = K & {
    __brand: T;
};
/**
 * Brands and types for Wallet-related IDs.
 */
export type WalletId = Brand<Uuid, "WalletId">;
export type BalanceId = Brand<Uuid, "BalanceId">;
export type OrderId = Brand<Uuid, "OrderId">;
export type FeeId = Brand<Uuid, "FeeId">;
/**
 * Brands and types for Renegade object related IDs.
 */
export type AccountId = Brand<Uuid, "AccountId">;
export type TaskId = Brand<Uuid, "TaskId">;
export type CallbackId = Brand<Uuid, "CallbackId">;
export declare enum Exchange {
    Median = 0,
    Binance = 1,
    Coinbase = 2,
    Kraken = 3,
    Okx = 4,
    Uniswapv3 = 5
}
export {};
