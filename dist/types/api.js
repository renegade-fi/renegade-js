import axios from "axios";
import { z } from "zod";
import { sign_http_request } from "../../renegade-utils";
import { createZodFetcher } from "../utils";
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
export function createPostRequest(url, data, schema, secretKey) {
    const serializedData = customSerializer(data);
    const request = {
        method: "POST",
        url,
        data: serializedData,
        headers: {
            "Content-Type": "application/json",
        },
        validateStatus: () => true,
    };
    if (secretKey) {
        const [renegadeAuth, renegadeAuthExpiration] = sign_http_request(request.data ?? "", BigInt(Date.now()), secretKey);
        console.log("🚀 ~ renegadeAuth:", renegadeAuth);
        request.headers = request.headers || {};
        request.headers[RENEGADE_AUTH_HEADER] = renegadeAuth;
        request.headers[RENEGADE_AUTH_EXPIRATION_HEADER] = renegadeAuthExpiration;
    }
    const fetchWithZod = createZodFetcher(axios.request);
    const response = fetchWithZod(schema, request)
        .then((response) => {
        // TODO: Sync error messages with frontend expected errors
        if (response.status !== 200) {
            // Handle non-200 responses
            const errorMessage = response.statusText || "Error occurred during the request in.";
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
function customSerializer(obj) {
    const resultParts = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let serializedValue;
            if (Object.prototype.hasOwnProperty.call(customSerializers, key)) {
                serializedValue = customSerializers[key](obj[key]);
            }
            else {
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
export const TaskStatus = z.object({
    id: z.string().uuid(),
    status: z.object({
        task_type: z.string(),
        state: z.string(),
    }),
    committed: z.boolean(),
});
export const TaskQueueListResponse = AxiosResponse.extend({
    data: z.object({
        tasks: z.array(z.object({
            id: z.string().uuid(),
            status: z.string(),
            committed: z.boolean(),
        }))
    })
});
export const TaskStatusResponse = AxiosResponse.extend({
    data: z.object({
        id: z.string().uuid(),
        status: z.string(),
        committed: z.boolean(),
    }),
});
