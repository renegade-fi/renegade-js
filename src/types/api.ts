import axios, { AxiosRequestConfig } from "axios";
import { ZodSchema, z, infer as zInfer } from "zod";
import { Wallet } from "../state";
import { createZodFetcher } from "../utils";

export const RENEGADE_AUTH_HEADER = "renegade-auth";
export const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";

/**
 * Creates an Axios POST request configuration after validating the data against the provided Zod schema.
 *
 * @param url The URL for the POST request.
 * @param data The data to be sent in the request.
 * @param schema The Zod schema to validate the data against.
 * @returns AxiosRequestConfig for the POST request.
 * @throws If the data validation fails.
 */
export function createPostRequest<S extends ZodSchema>(
  url: string,
  data: any,
  schema: S,
  isAuthenticated?: boolean,
): Promise<zInfer<S>> {
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

  if (isAuthenticated) {
    const messageBuffer = request.data ?? "";
    const [renegadeAuth, renegadeAuthExpiration] =
      this.keychain.generateExpiringSignature(messageBuffer);
    request.headers = request.headers || {};
    request.headers[RENEGADE_AUTH_HEADER] = renegadeAuth;
    request.headers[RENEGADE_AUTH_EXPIRATION_HEADER] = renegadeAuthExpiration;
  }

  const fetchWithZod = createZodFetcher(axios.request);
  const response = fetchWithZod(schema, request)
    .then((response) => {
      if (response.status !== 200) {
        // Handle non-200 responses
        const errorMessage =
          response.statusText || "Error occurred during the request in.";
        // TODO: Use RenegadeError
        return Promise.reject(new Error(errorMessage));
      }
      return response; // Return response for status 200
    })
    .catch((error) => {
      // Handle errors in fetchWithZod or non-200 status
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
  wallet: (value) => value.serialize(false),
};

export type CreateWalletRequest = {
  wallet: Wallet;
};

export const AxiosResponse = z.object({
  status: z.number(),
  statusText: z.string(),
});

export const CreateWalletResponse = AxiosResponse.extend({
  data: z.object({
    wallet_id: z.string().uuid(),
    task_id: z.string().uuid(),
  }),
});