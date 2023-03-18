export type RequestHeader = Record<string, string> | { append: Record<string, string> };

type RequestMethod = "GET" | "HEAD" | "OPTIONS" | "POST" | "DELETE" | "PUT" | "PATCH";

export interface InterceptorPayload {
    headers: Record<string, string>,
    body?: Record<string | unknown> | BodyInit,
    method: RequestMethod,
    url: string,
    queryParams?: Record<string, any>
}

export interface InterceptorResponsePayload {
    data: Record<string, any>,
    readonly status?: number,
    readonly method?: RequestMethod,
    readonly url?: string,
    readonly queryParams?: Record<string, any>
}

export interface RequestPayload extends RequestInit {
    retries?: number;
    bearer?: boolean;
    timeout?: number;
    useBaseUrl?: boolean;
    errorMessage?: string;
    forceRefetch?: boolean;
    header?: RequestHeader;
    successMessage?: string;
    query?: Record<string, unknown>;
}

export interface GetRequestPayload extends Omit<RequestPayload, 'body'> {
    method?: Extract<RequestMethod, 'GET'>;
}

export interface BodyRequestPayload extends Omit<RequestPayload, 'body'> {
    method?: Exclude<RequestMethod, 'GET'>;
    body?: Record<string, unknown> | BodyInit
}

export interface FormDataRequestPayload extends Omit<RequestPayload, 'body'> {
    method?: Exclude<RequestMethod, 'GET'>;
    formData: Record<string, any>;
}

export interface IResponse<T, E> {
    loading: boolean;
    error: true | false;
    success: boolean;
    data?:  T | E | null;
    message: string;
    status?: number | string | null;
}

export interface UseRequestProps<T, E> {
    name?: string;
    baseUrl?: string;
    localStorage?: boolean;
    memoryStorage?: boolean;
    sessionStorage?: boolean;
    onSuccess?: (res: T) => void;
    onError?: (error: E | unknown) => void;
    interceptors?: {
        response?: (payload: InterceptorResponsePayload) => InterceptorResponsePayload;
        request?: (payload: InterceptorPayload) => InterceptorPayload;
    }
}

export interface RequestProviderProps {
    /**
     * Authentication token to be added to the request header's Authorization Bearer
     */
    authToken?: string;
    /** Request delay duration `(in ms)` before cancelling request */
    requestTimeout?: number;
    /** 
     * Base url that would be append to path for every request. 
     * If an absolute url is provider, base url would not be append to it. 
     */
    baseUrl: string;
    children?: React.ReactNode;
    /** 
     * App level request success callback, it returns the success payload.
     * An optional alert component can be returned that is displayed within {@linkcode RequestProviderProps.popupTimeout}  
     */
    onSuccess?: (successPayload: any) => React.ReactNode | void;
    /** 
     * App level request error callback, it returns the error payload.
     * An optional alert component can be returned that is displayed within {@linkcode RequestProviderProps.popupTimeout}  
     */
    onError?: (errorPayload: any) => React.ReactNode | void;
    /** 
     * Callback that indicate when request is in progress. Returns `true` when in progress and `false` otherwise.
     * An optional loader component can be returned, to be displayed whenever request is in progress.
     */
    onLoading?: (state: boolean) => React.ReactNode | void;
    /** App level interceptors */
    interceptors?: {
        /** Intercept request object */
        request?: (payload: InterceptorPayload) => InterceptorPayload;
        /** Intercept response object */
        response?: (payload: InterceptorResponsePayload) => InterceptorResponsePayload;
    };
    /** Display timeout (in seconds) for error or success popup if available. Default to `8s` */
    popupTimeout?: number;
}

export interface RequestContextProps {
    baseUrl: string;
    loading: boolean;
    authToken?: string;
    setBaseUrl: React.Dispatch<React.SetStateAction<string>>;
    setAuthToken: React.Dispatch<React.SetStateAction<string>>;
}