import { z } from "zod";
export type PriceReport = z.infer<typeof priceReportSchema>;
export type ExchangeHealthState = z.infer<typeof exchangeHealthStatesSchema>;
export declare const HealthStateEnum: z.ZodEnum<["Connecting", "Live", "NoDataReported", "Nominal", "NotEnoughData", "TooMuchDeviation", "TooStale", "Unsupported"]>;
declare const priceReportSchema: z.ZodObject<{
    baseToken: z.ZodRecord<z.ZodString, z.ZodString>;
    exchange: z.ZodNullable<z.ZodEnum<["Binance", "Coinbase", "Kraken", "Okx", "UniswapV3", "Median"]>>;
    localTimestamp: z.ZodNumber;
    midpointPrice: z.ZodNumber;
    quoteToken: z.ZodRecord<z.ZodString, z.ZodString>;
    reportedTimestamp: z.ZodNullable<z.ZodNumber>;
    topic: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    healthState: z.ZodEnum<["Connecting", "Live", "NoDataReported", "Nominal", "NotEnoughData", "TooMuchDeviation", "TooStale", "Unsupported"]>;
}, "strip", z.ZodTypeAny, {
    baseToken?: Record<string, string>;
    exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
    localTimestamp?: number;
    midpointPrice?: number;
    quoteToken?: Record<string, string>;
    reportedTimestamp?: number;
    topic?: string;
    type?: string;
    healthState?: "Connecting" | "Live" | "NoDataReported" | "Nominal" | "NotEnoughData" | "TooMuchDeviation" | "TooStale" | "Unsupported";
}, {
    baseToken?: Record<string, string>;
    exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
    localTimestamp?: number;
    midpointPrice?: number;
    quoteToken?: Record<string, string>;
    reportedTimestamp?: number;
    topic?: string;
    type?: string;
    healthState?: "Connecting" | "Live" | "NoDataReported" | "Nominal" | "NotEnoughData" | "TooMuchDeviation" | "TooStale" | "Unsupported";
}>;
export declare const oldExchangeHealthStatesSchema: z.ZodObject<{
    all_exchanges: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        Nominal: z.ZodObject<{
            baseToken: z.ZodRecord<z.ZodString, z.ZodString>;
            exchange: z.ZodNullable<z.ZodEnum<["Binance", "Coinbase", "Kraken", "Okx", "UniswapV3", "Median"]>>;
            localTimestamp: z.ZodNumber;
            midpointPrice: z.ZodNumber;
            quoteToken: z.ZodRecord<z.ZodString, z.ZodString>;
            reportedTimestamp: z.ZodNullable<z.ZodNumber>;
            topic: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        Nominal?: {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        };
    }, {
        Nominal?: {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        };
    }>, z.ZodEnum<["Connecting", "Live", "NoDataReported", "Nominal", "NotEnoughData", "TooMuchDeviation", "TooStale", "Unsupported"]>]>>;
    median: z.ZodObject<{
        DataTooStale: z.ZodOptional<z.ZodTuple<[z.ZodObject<{
            baseToken: z.ZodRecord<z.ZodString, z.ZodString>;
            exchange: z.ZodNullable<z.ZodEnum<["Binance", "Coinbase", "Kraken", "Okx", "UniswapV3", "Median"]>>;
            localTimestamp: z.ZodNumber;
            midpointPrice: z.ZodNumber;
            quoteToken: z.ZodRecord<z.ZodString, z.ZodString>;
            reportedTimestamp: z.ZodNullable<z.ZodNumber>;
            topic: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }>, z.ZodNumber], null>>;
        Nominal: z.ZodOptional<z.ZodObject<{
            baseToken: z.ZodRecord<z.ZodString, z.ZodString>;
            exchange: z.ZodNullable<z.ZodEnum<["Binance", "Coinbase", "Kraken", "Okx", "UniswapV3", "Median"]>>;
            localTimestamp: z.ZodNumber;
            midpointPrice: z.ZodNumber;
            quoteToken: z.ZodRecord<z.ZodString, z.ZodString>;
            reportedTimestamp: z.ZodNullable<z.ZodNumber>;
            topic: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }>>;
        TooMuchDeviation: z.ZodOptional<z.ZodTuple<[z.ZodObject<{
            baseToken: z.ZodRecord<z.ZodString, z.ZodString>;
            exchange: z.ZodNullable<z.ZodEnum<["Binance", "Coinbase", "Kraken", "Okx", "UniswapV3", "Median"]>>;
            localTimestamp: z.ZodNumber;
            midpointPrice: z.ZodNumber;
            quoteToken: z.ZodRecord<z.ZodString, z.ZodString>;
            reportedTimestamp: z.ZodNullable<z.ZodNumber>;
            topic: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }>, z.ZodNumber], null>>;
    }, "strip", z.ZodTypeAny, {
        DataTooStale?: [{
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, number, ...unknown[]];
        Nominal?: {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        };
        TooMuchDeviation?: [{
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, number, ...unknown[]];
    }, {
        DataTooStale?: [{
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, number, ...unknown[]];
        Nominal?: {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        };
        TooMuchDeviation?: [{
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, number, ...unknown[]];
    }>;
}, "strip", z.ZodTypeAny, {
    all_exchanges?: Record<string, "Connecting" | "Live" | "NoDataReported" | "Nominal" | "NotEnoughData" | "TooMuchDeviation" | "TooStale" | "Unsupported" | {
        Nominal?: {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        };
    }>;
    median?: {
        DataTooStale?: [{
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, number, ...unknown[]];
        Nominal?: {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        };
        TooMuchDeviation?: [{
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, number, ...unknown[]];
    };
}, {
    all_exchanges?: Record<string, "Connecting" | "Live" | "NoDataReported" | "Nominal" | "NotEnoughData" | "TooMuchDeviation" | "TooStale" | "Unsupported" | {
        Nominal?: {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        };
    }>;
    median?: {
        DataTooStale?: [{
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, number, ...unknown[]];
        Nominal?: {
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        };
        TooMuchDeviation?: [{
            baseToken?: Record<string, string>;
            exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
            localTimestamp?: number;
            midpointPrice?: number;
            quoteToken?: Record<string, string>;
            reportedTimestamp?: number;
            topic?: string;
            type?: string;
        }, number, ...unknown[]];
    };
}>;
export declare const GetExchangeHealthStatesResponse: z.ZodObject<{
    status: z.ZodNumber;
    statusText: z.ZodString;
    data: z.ZodObject<{
        all_exchanges: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
            Nominal: z.ZodObject<{
                baseToken: z.ZodRecord<z.ZodString, z.ZodString>;
                exchange: z.ZodNullable<z.ZodEnum<["Binance", "Coinbase", "Kraken", "Okx", "UniswapV3", "Median"]>>;
                localTimestamp: z.ZodNumber;
                midpointPrice: z.ZodNumber;
                quoteToken: z.ZodRecord<z.ZodString, z.ZodString>;
                reportedTimestamp: z.ZodNullable<z.ZodNumber>;
                topic: z.ZodOptional<z.ZodString>;
                type: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
        }, {
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
        }>, z.ZodEnum<["Connecting", "Live", "NoDataReported", "Nominal", "NotEnoughData", "TooMuchDeviation", "TooStale", "Unsupported"]>]>>;
        median: z.ZodObject<{
            DataTooStale: z.ZodOptional<z.ZodTuple<[z.ZodObject<{
                baseToken: z.ZodRecord<z.ZodString, z.ZodString>;
                exchange: z.ZodNullable<z.ZodEnum<["Binance", "Coinbase", "Kraken", "Okx", "UniswapV3", "Median"]>>;
                localTimestamp: z.ZodNumber;
                midpointPrice: z.ZodNumber;
                quoteToken: z.ZodRecord<z.ZodString, z.ZodString>;
                reportedTimestamp: z.ZodNullable<z.ZodNumber>;
                topic: z.ZodOptional<z.ZodString>;
                type: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }>, z.ZodNumber], null>>;
            Nominal: z.ZodOptional<z.ZodObject<{
                baseToken: z.ZodRecord<z.ZodString, z.ZodString>;
                exchange: z.ZodNullable<z.ZodEnum<["Binance", "Coinbase", "Kraken", "Okx", "UniswapV3", "Median"]>>;
                localTimestamp: z.ZodNumber;
                midpointPrice: z.ZodNumber;
                quoteToken: z.ZodRecord<z.ZodString, z.ZodString>;
                reportedTimestamp: z.ZodNullable<z.ZodNumber>;
                topic: z.ZodOptional<z.ZodString>;
                type: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }>>;
            TooMuchDeviation: z.ZodOptional<z.ZodTuple<[z.ZodObject<{
                baseToken: z.ZodRecord<z.ZodString, z.ZodString>;
                exchange: z.ZodNullable<z.ZodEnum<["Binance", "Coinbase", "Kraken", "Okx", "UniswapV3", "Median"]>>;
                localTimestamp: z.ZodNumber;
                midpointPrice: z.ZodNumber;
                quoteToken: z.ZodRecord<z.ZodString, z.ZodString>;
                reportedTimestamp: z.ZodNullable<z.ZodNumber>;
                topic: z.ZodOptional<z.ZodString>;
                type: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }>, z.ZodNumber], null>>;
        }, "strip", z.ZodTypeAny, {
            DataTooStale?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
            TooMuchDeviation?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
        }, {
            DataTooStale?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
            TooMuchDeviation?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
        }>;
    }, "strip", z.ZodTypeAny, {
        all_exchanges?: Record<string, "Connecting" | "Live" | "NoDataReported" | "Nominal" | "NotEnoughData" | "TooMuchDeviation" | "TooStale" | "Unsupported" | {
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
        }>;
        median?: {
            DataTooStale?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
            TooMuchDeviation?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
        };
    }, {
        all_exchanges?: Record<string, "Connecting" | "Live" | "NoDataReported" | "Nominal" | "NotEnoughData" | "TooMuchDeviation" | "TooStale" | "Unsupported" | {
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
        }>;
        median?: {
            DataTooStale?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
            TooMuchDeviation?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
        };
    }>;
}, "strip", z.ZodTypeAny, {
    status?: number;
    statusText?: string;
    data?: {
        all_exchanges?: Record<string, "Connecting" | "Live" | "NoDataReported" | "Nominal" | "NotEnoughData" | "TooMuchDeviation" | "TooStale" | "Unsupported" | {
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
        }>;
        median?: {
            DataTooStale?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
            TooMuchDeviation?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
        };
    };
}, {
    status?: number;
    statusText?: string;
    data?: {
        all_exchanges?: Record<string, "Connecting" | "Live" | "NoDataReported" | "Nominal" | "NotEnoughData" | "TooMuchDeviation" | "TooStale" | "Unsupported" | {
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
        }>;
        median?: {
            DataTooStale?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
            Nominal?: {
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            };
            TooMuchDeviation?: [{
                baseToken?: Record<string, string>;
                exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
                localTimestamp?: number;
                midpointPrice?: number;
                quoteToken?: Record<string, string>;
                reportedTimestamp?: number;
                topic?: string;
                type?: string;
            }, number, ...unknown[]];
        };
    };
}>;
declare const exchangeHealthStatesSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    baseToken: z.ZodRecord<z.ZodString, z.ZodString>;
    exchange: z.ZodNullable<z.ZodEnum<["Binance", "Coinbase", "Kraken", "Okx", "UniswapV3", "Median"]>>;
    localTimestamp: z.ZodNumber;
    midpointPrice: z.ZodNumber;
    quoteToken: z.ZodRecord<z.ZodString, z.ZodString>;
    reportedTimestamp: z.ZodNullable<z.ZodNumber>;
    topic: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    healthState: z.ZodEnum<["Connecting", "Live", "NoDataReported", "Nominal", "NotEnoughData", "TooMuchDeviation", "TooStale", "Unsupported"]>;
}, "strip", z.ZodTypeAny, {
    baseToken?: Record<string, string>;
    exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
    localTimestamp?: number;
    midpointPrice?: number;
    quoteToken?: Record<string, string>;
    reportedTimestamp?: number;
    topic?: string;
    type?: string;
    healthState?: "Connecting" | "Live" | "NoDataReported" | "Nominal" | "NotEnoughData" | "TooMuchDeviation" | "TooStale" | "Unsupported";
}, {
    baseToken?: Record<string, string>;
    exchange?: "Binance" | "Coinbase" | "Kraken" | "Okx" | "UniswapV3" | "Median";
    localTimestamp?: number;
    midpointPrice?: number;
    quoteToken?: Record<string, string>;
    reportedTimestamp?: number;
    topic?: string;
    type?: string;
    healthState?: "Connecting" | "Live" | "NoDataReported" | "Nominal" | "NotEnoughData" | "TooMuchDeviation" | "TooStale" | "Unsupported";
}>>;
export declare function parseExchangeHealthStates({ median, all_exchanges, }: z.infer<typeof oldExchangeHealthStatesSchema>): ExchangeHealthState;
export {};
