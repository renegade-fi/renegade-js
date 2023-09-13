import { z } from "zod";

export type PriceReport = z.infer<typeof priceReportSchema>;
export type ExchangeHealthState = z.infer<typeof exchangeHealthStatesSchema>;

const ExchangeEnum = z.enum([
  "Binance",
  "Coinbase",
  "Kraken",
  "Okx",
  "UniswapV3",
  "Median",
]);

export const HealthStateEnum = z.enum([
  "Connecting",
  "Live",
  "NoDataReported",
  "Nominal",
  "NotEnoughData",
  "TooMuchDeviation",
  "TooStale",
  "Unsupported",
]);

const oldPriceReportSchema = z.object({
  baseToken: z.record(z.string()),
  // TODO: Test this
  exchange: ExchangeEnum.nullable(),
  localTimestamp: z.number(),
  midpointPrice: z.number(),
  quoteToken: z.record(z.string()),
  reportedTimestamp: z.number().nullable(),
  topic: z.string().optional(),
  type: z.string().optional(),
});

const priceReportSchema = z.object({
  baseToken: z.record(z.string()),
  exchange: ExchangeEnum.nullable(),
  localTimestamp: z.number(),
  midpointPrice: z.number(),
  quoteToken: z.record(z.string()),
  reportedTimestamp: z.number().nullable(),
  topic: z.string().optional(),
  type: z.string().optional(),
  healthState: HealthStateEnum,
});

const medianSchema = z.object({
  DataTooStale: z.tuple([oldPriceReportSchema, z.number()]).optional(),
  Nominal: oldPriceReportSchema.optional(),
  TooMuchDeviation: z.tuple([oldPriceReportSchema, z.number()]).optional(),
});

const allExchangesNominalSchema = z.object({
  Nominal: oldPriceReportSchema,
});

const allExchangesSchema = z.record(
  allExchangesNominalSchema.or(HealthStateEnum),
);

export const oldExchangeHealthStatesSchema = z.object({
  all_exchanges: allExchangesSchema,
  median: medianSchema,
});

const exchangeHealthStatesSchema = z.record(priceReportSchema);

function parseMedian(median: z.infer<typeof medianSchema>): PriceReport {
  let res;
  if (median.Nominal) {
    res = {
      ...median.Nominal,
      healthState: HealthStateEnum.enum.Live,
    };
    return res;
  }
  if (median.DataTooStale) {
    res = {
      ...median.DataTooStale[0],
      healthState: HealthStateEnum.enum.TooStale,
    };
    return res;
  }
  if (median.TooMuchDeviation) {
    res = {
      ...median.TooMuchDeviation[0],
      healthState: HealthStateEnum.enum.TooMuchDeviation,
    };
    return res;
  }
}

function parseExchanges(
  data: z.infer<typeof allExchangesNominalSchema | typeof HealthStateEnum>,
): PriceReport {
  const isHealthState = HealthStateEnum.safeParse(data);
  if (isHealthState.success) {
    return {
      healthState: isHealthState.data,
    };
  } else {
    return {
      ...allExchangesNominalSchema.parse(data).Nominal,
      healthState: HealthStateEnum.enum.Live,
    };
  }
}

export function parseExchangeHealthStates({
  median,
  all_exchanges,
}: z.infer<typeof oldExchangeHealthStatesSchema>): ExchangeHealthState {
  return {
    [ExchangeEnum.enum.Median]: parseMedian(median),
    [ExchangeEnum.enum.Binance]: parseExchanges(
      all_exchanges[ExchangeEnum.enum.Binance],
    ),
    [ExchangeEnum.enum.Coinbase]: parseExchanges(
      all_exchanges[ExchangeEnum.enum.Coinbase],
    ),
    [ExchangeEnum.enum.Kraken]: parseExchanges(
      all_exchanges[ExchangeEnum.enum.Kraken],
    ),
    [ExchangeEnum.enum.Okx]: parseExchanges(
      all_exchanges[ExchangeEnum.enum.Okx],
    ),
    [ExchangeEnum.enum.UniswapV3]: parseExchanges(
      all_exchanges[ExchangeEnum.enum.UniswapV3],
    ),
  };
}
