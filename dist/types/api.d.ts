import { ZodSchema, z, infer as zInfer } from "zod";
import { Wallet } from "../state";
export declare const RENEGADE_AUTH_HEADER = "renegade-auth";
export declare const RENEGADE_AUTH_EXPIRATION_HEADER = "renegade-auth-expiration";
/**
 * Creates an Axios POST request configuration after validating the data against the provided Zod schema.
 *
 * @param url The URL for the POST request.
 * @param data The data to be sent in the request.
 * @param schema The Zod schema to validate the data against.
 * @returns AxiosRequestConfig for the POST request.
 * @throws If the data validation fails.
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
