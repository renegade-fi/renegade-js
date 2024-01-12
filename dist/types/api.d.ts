import { ZodSchema, z, infer as zInfer } from "zod";
import { Wallet } from "../state";
export declare const RENEGADE_AUTH_HEADER = "renegade-auth";
export declare const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";
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
export declare function createPostRequest<S extends ZodSchema>(url: string, data: any, schema: S, isAuthenticated?: boolean): Promise<zInfer<S>>;
export type CreateWalletRequest = {
    wallet: Wallet;
};
export declare const AxiosResponse: z.ZodObject<{
    status: z.ZodNumber;
    statusText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status?: number;
    statusText?: string;
}, {
    status?: number;
    statusText?: string;
}>;
export declare const CreateWalletResponse: z.ZodObject<{
    status: z.ZodNumber;
    statusText: z.ZodString;
    data: z.ZodObject<{
        wallet_id: z.ZodString;
        task_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        wallet_id?: string;
        task_id?: string;
    }, {
        wallet_id?: string;
        task_id?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    status?: number;
    statusText?: string;
    data?: {
        wallet_id?: string;
        task_id?: string;
    };
}, {
    status?: number;
    statusText?: string;
    data?: {
        wallet_id?: string;
        task_id?: string;
    };
}>;
