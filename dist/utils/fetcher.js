import * as fetch from "isomorphic-fetch";
export const defaultFetcher = async (...args) => {
    const response = await fetch(...args);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
};
export function createZodFetcher(fetcher = defaultFetcher) {
    return async (schema, ...args) => {
        const response = await fetcher(...args);
        return schema.parse(response.data);
    };
}
