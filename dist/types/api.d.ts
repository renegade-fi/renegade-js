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
export declare function createPostRequest<T>(url: string, data: T): AxiosRequestConfig;
export type CreateWalletRequest = {
    wallet: Wallet;
};
