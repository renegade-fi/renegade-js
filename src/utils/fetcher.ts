import * as fetch from "isomorphic-fetch";

export type AnyFetcher = (...args: any[]) => any;

export type Schema<TData> = {
  parse: (data: unknown) => TData;
};

export type ZodFetcher<TFetcher extends AnyFetcher> = <TData>(
  schema: Schema<TData>,
  ...args: Parameters<TFetcher>
) => Promise<TData>;

export const defaultFetcher = async (...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export function createZodFetcher(): ZodFetcher<typeof fetch>;

export function createZodFetcher<TFetcher extends AnyFetcher>(
  fetcher: TFetcher,
): ZodFetcher<TFetcher>;
export function createZodFetcher(
  fetcher: AnyFetcher = defaultFetcher,
): ZodFetcher<any> {
  return async (schema, ...args) => {
    const response = await fetcher(...args);
    return schema.parse(response.data);
  };
}
