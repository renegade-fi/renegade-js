import { AxiosRequestConfig } from "axios";
import { Wallet } from "../state";

/**
 * Creates an Axios POST request configuration after validating the data against the provided Zod schema.
 *
 * @param url The URL for the POST request.
 * @param data The data to be sent in the request.
 * @param schema The Zod schema to validate the data against.
 * @returns AxiosRequestConfig for the POST request.
 * @throws If the data validation fails.
 */
export function createPostRequest<T>(url: string, data: T): AxiosRequestConfig {
  const serializedData = customSerializer(data);
  return {
    method: "POST",
    url,
    data: serializedData,
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  };
}

function customSerializer(obj: Record<string, any>) {
  const resultParts: string[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let serializedValue: string;
      if (Object.prototype.hasOwnProperty.call(customSerializers, key)) {
        serializedValue = customSerializers[key](obj[key]);
      } else {
        serializedValue = JSON.stringify(obj[key]);
      }
      resultParts.push(`"${key}":${serializedValue}`);
    }
  }

  return `{${resultParts.join(",")}}`;
}

const customSerializers = {
  wallet: (value) => value.serialize(false),
};

export type CreateWalletRequest = {
  wallet: Wallet;
};
