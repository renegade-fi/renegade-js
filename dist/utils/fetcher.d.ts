import * as fetch from "isomorphic-fetch";
export type AnyFetcher = (...args: any[]) => any;
export type Schema<TData> = {
    parse: (data: unknown) => TData;
};
export type ZodFetcher<TFetcher extends AnyFetcher> = <TData>(schema: Schema<TData>, ...args: Parameters<TFetcher>) => Promise<TData>;
export declare const defaultFetcher: (...args: any) => Promise<any>;
export declare function createZodFetcher(): ZodFetcher<typeof fetch>;
export declare function createZodFetcher<TFetcher extends AnyFetcher>(fetcher: TFetcher): ZodFetcher<TFetcher>;
