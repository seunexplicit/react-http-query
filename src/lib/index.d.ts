export type RequestHeader = Record<string, string> | { append: Record<string, string> };

type RequestMethod = "GET" | "HEAD" | "OPTIONS" | "POST" | "DELETE" | "PUT" | "PATCH";

export interface InterceptorPayload {
    headers: Record<string, string>,
    body?: Record<string, any> | FormData,
    method: RequestMethod,
    url: string,
    queryParams?: Record<string, any>
}

export interface InterceptorResponsePayload {
    data: Record<string, any>,
    status?: number,
    method?: RequestMethod,
    url?: string,
    queryParams?: Record<string, any>
}