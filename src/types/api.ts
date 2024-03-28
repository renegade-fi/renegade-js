import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { z } from "zod";
import { sign_http_request } from "../../renegade-utils";
import { Token, Wallet } from "../state";

export const RENEGADE_AUTH_HEADER = "renegade-auth";
export const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";

/**
 * Creates and executes a POST request using the provided URL and data.
 * The response is validated against a Zod schema and returns a typed result.
 * If `isAuthenticated` is true, the request includes authentication headers.
 *
 * @param {string} url - The URL to send the POST request to.
 * @param {any} data - The data to be sent in the request body. This data is serialized before sending.
 * @param {S} schema - A Zod schema to validate the response. The function returns a promise of the schema's inferred type.
 * @param {boolean} [isAuthenticated=false] - Optional. If true, authentication headers are added to the request.
 */
export function createPostRequest(
  url: string,
  data: any,
  secretKey?: string,
): Promise<AxiosResponse> {
  const serializedData = customSerializer(data);
  const request: AxiosRequestConfig = {
    method: "POST",
    url,
    data: serializedData,
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  };

  if (secretKey) {
    const [renegadeAuth, renegadeAuthExpiration] = sign_http_request(
      request.data ?? "",
      BigInt(Date.now()),
      secretKey,
    );
    request.headers = request.headers || {};
    request.headers[RENEGADE_AUTH_HEADER] = renegadeAuth;
    request.headers[RENEGADE_AUTH_EXPIRATION_HEADER] = renegadeAuthExpiration;
  }
  const response = axios
    .request(request)
    .then((response) => {
      if (response.status !== 200) {
        const errorMessage =
          response.data ||
          response.statusText ||
          `HTTP error ${response.status}`;
        return Promise.reject(new Error(errorMessage));
      }
      return response;
    })
    .catch((error) => {
      throw new Error(error.message || "Network or parsing error occurred.");
    });
  return response;
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
  wallet: (value) => value.serialize(),
};

export type CreateWalletRequest = {
  wallet: Wallet;
};

export type GetPriceReportRequest = {
  base_token: string;
  quote_token: string;
};

export const AxiosResponseSchema = z.object({
  status: z.number(),
  statusText: z.string(),
});

export const CreateWalletResponse = AxiosResponseSchema.extend({
  data: z.object({
    wallet_id: z.string().uuid(),
    task_id: z.string().uuid(),
  }),
});

export const TaskStatus = z.object({
  id: z.string().uuid(),
  state: z.string(),
  description: z.string(),
  committed: z.boolean(),
});

export const TaskQueueListResponse = AxiosResponseSchema.extend({
  data: z.object({
    tasks: z.array(
      z.object({
        id: z.string().uuid(),
        status: z.string(),
        committed: z.boolean(),
      }),
    ),
  }),
});

export const TaskStatusResponse = AxiosResponseSchema.extend({
  data: z.object({
    id: z.string().uuid(),
    status: z.string(),
    committed: z.boolean(),
  }),
});
