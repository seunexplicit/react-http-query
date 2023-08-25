export type RequestHeader = Record<string, string> | { append: Record<string, string> };

export type RequestMethod = 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export type StorageType = 'memory' | 'session' | 'local';
export interface InterceptorPayload {
    headers: Record<string, any>;
    body?: unknown;
    method: RequestMethod;
    url: string;
    queryParams?: Record<string, any>;
}

interface ProgressEvent {
    loaded: number;
    total: number;
    lengthComputable: boolean;
    target: any; // This can be further typed based on your application's needs
}

export interface StoredValue<T> {
    data: T;
    queryParam?: Record<string, unknown>;
}

export interface InterceptorResponsePayload {
    data: Record<string, any>;
    readonly status?: number;
    readonly method?: RequestMethod;
    readonly url?: string;
    readonly queryParams?: Record<string, any>;
    readonly headers?: any;
    readonly statusText?: string;
}

export interface RequestPayload extends RequestInit {
    retries?: number;
    bearer?: boolean;
    timeout?: number;
    isRelative?: boolean;
    errorMessage?: string;
    forceRefetch?: boolean;
    header?: RequestHeader;
    successMessage?: string;
    /**
     * When set to `false`, the global success alert returned in {@linkcode RequestProviderProps.onSuccess} will be hidden for this request.
     * @default true
     */
    showSuccess?: boolean;
    /**
     * When set to `false`, the global error alert returned in {@linkcode RequestProviderProps.onError} will be hidden for this request.
     * @default true
     */
    showError?: boolean;
    /**
     * When set to `false`, the global loader returned in {@linkcode RequestProviderProps.onLoading} will be hidden for this request.
     * @default true
     */
    showLoader?: boolean;
    query?: Record<string, unknown>;
    /**
     * `responseType` indicates the type of data that the server will respond with
     * options are: `arraybuffer`, `document`, `json`, `text`, `stream`
     * @note axiosInstance only.
     */
    responseType?: string;
    /**
     * `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
     * @note axiosInstance only.
     */
    xsrfCookieName?: string;
    /**
     * `xsrfHeaderName` is the name of the http header that carries the xsrf token value
     * @note axiosInstance only.
     */
    xsrfHeaderName?: string;
    /**
     * `proxy` defines the hostname, port, and protocol of the proxy server.
     * You can also define your proxy using the conventional `http_proxy` and
     * `https_proxy` environment variables. If you are using environment variables
     * for your proxy configuration, you can also define a `no_proxy` environment
     * variable as a comma-separated list of domains that should not be proxied.
     * Use `false` to disable proxies, ignoring environment variables.
     * `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
     * supplies credentials.
     * This will set an `Proxy-Authorization` header, overwriting any existing
     * `Proxy-Authorization` custom headers you have set using `headers`.
     * If the proxy server uses HTTPS, then you must set the protocol to `https`.
     * @example
     * ```js
     * {
     *   protocol: 'https';
     *   host: '127.0.0.1';
     *   port: 9000;
     *   auth: {
     *       username: 'mikeymike';
     *       password: 'rapunz3l';
     *   };
     * }
     * ```
     * @note axiosInstance only.
     */
    proxy?: any;
}

export interface GetRequestPayload extends Omit<RequestPayload, 'body'> {
    method?: Extract<RequestMethod, 'GET'>;
}

export interface BodyRequestPayload extends Omit<RequestPayload, 'body'> {
    method?: Exclude<RequestMethod, 'GET'>;
    body?: unknown;
}

export interface FormDataRequestPayload extends Omit<RequestPayload, 'body'> {
    method?: Exclude<RequestMethod, 'GET'>;
    formData: unknown;
}

export interface IResponse<T> {
    loading: boolean;
    error: true | false;
    success: boolean;
    data?: T | null;
    message: string;
    status?: number | string | null;
    refetch: () => Promise<T | null | undefined>;
}

export type Interceptors = {
    /** Intercept request payload */
    response?: (
        payload: InterceptorResponsePayload
    ) => InterceptorResponsePayload | Promise<InterceptorResponsePayload>;
    /** Intercept response payload */
    request?: (payload: InterceptorPayload) => InterceptorPayload | Promise<InterceptorPayload>;
};

export interface UseRequestProps<T extends any = any, K extends any = any> {
    name?: string;
    baseUrl?: string;
    localStorage?: boolean;
    memoryStorage?: boolean;
    sessionStorage?: boolean;
    /**
     * A callback function that is called when the request succeeds.
     * The request's response data is passed down to it.
     * The callback can be used to perform any required operations when the request succeeds.
     *
     * @param res Success response object.
     */
    onSuccess?: (res: IRequestData<T>['data']) => void;
    /**
     * A callback function that is called when the request fails.
     * The request's response error body is passed down to it.
     * The callback can be used to perform any required operations when the request fails.
     *
     * @param error Error response object.
     */
    onError?: (error: IRequestData<K>['data']) => void;
    /**
     * A callback function that is called once your component mounts, it returns a
     * `makeRequest` function as an argument, that could be used to make a request on mount
     * of the components.
     *
     * @param makeRequest Request function.
     */
    onMount?: (makeRequest: MakeRequest<T>) => void;
    /**
     * This allow request to be intercepted at the component level before the call is being
     * made or  before the response are being passed to the component state.
     * It allows two optional function parameters, which are `response` and `request`
     */
    interceptors?: Interceptors;
    /**
     * `onUploadProgress` allows handling of progress events for uploads
     *  @note axiosInstance only.
     */
    onUploadProgress?: (event: ProgressEvent) => void;
    /**
     * `onDownloadProgress` allows handling of progress events for downloads
     *  @note axiosInstance only.
     */
    onDownloadProgress?: (event: ProgressEvent) => void;
    /**
     * `validateStatus` defines whether to resolve or reject the promise for a given
     * HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
     * or `undefined`), the promise will be resolved; otherwise, the promise will be
     * rejected.
     * @note axiosInstance only.
     */
    validateStatus?: (status: number) => boolean;
}

export interface RequestProviderProps {
    /**
     * Authentication token to be added to the request header's Authorization Bearer
     */
    authToken?: string;
    /** Request delay duration `(in ms)` before cancelling request */
    requestTimeout?: number;
    /**
     * Base url that would be prepend to relative path passed to `makeRequest` function.
     * If an absolute url is provided to `makeRequest`, it overrides the base URL.
     */
    baseUrl: string;
    children?: React.ReactNode;
    /**
     * App level request success callback, it returns the success payload.
     * An optional alert component can be returned that is displayed within
     * {@linkcode RequestProviderProps.popupTimeout}
     */
    onSuccess?: (successPayload: IRequestData['data']) => React.ReactNode | void;
    /**
     * App level request error callback, it returns the error payload.
     * An optional alert component can be returned that is
     * displayed within {@linkcode RequestProviderProps.popupTimeout}
     */
    onError?: (errorPayload: IRequestData['data']) => React.ReactNode | void;
    /**
     * Callback that indicate when request is in progress. Returns `true` when in progress
     * and `false` otherwise.
     * An optional loader component can be returned, to be displayed whenever request is in progress.
     */
    onLoading?: (state: boolean) => React.ReactNode | void;
    /** App level interceptors */
    interceptors?: Interceptors;
    /** Display timeout (in seconds) for error or success popup if available. Default to `8s` */
    popupTimeout?: number;
    /**
     * `axiosInstance`: Axios provides additional functionality beyond basic fetch methods.
     * For instance, it supports download progress events and upload progress events.
     * You can also create an axios instance with preconfigured headers that your application needs.
     * By providing an axios instance, you are replacing the default fetch used by the library.
     */
    axiosInstance?: any;
}

export interface RequestContextProps {
    baseUrl: string;
    loading: boolean;
    authToken?: string;
    setBaseUrl: React.Dispatch<React.SetStateAction<string>>;
    setAuthToken: React.Dispatch<React.SetStateAction<string>>;
}

export interface MemoryStorageContextProps<T> {
    setStoredData?: React.Dispatch<React.SetStateAction<Record<string, StoredValue<T> | undefined>>>;
    storedData: Record<string, StoredValue<T> | undefined>;
    setRequestUpdate?: React.Dispatch<React.SetStateAction<number>>;
    requestUpdate?: number;
}

export type MakeRequest<T> = (
    url: string,
    config?: GetRequestPayload | BodyRequestPayload | FormDataRequestPayload
) => Promise<IResponse<T>['data']>;

export interface PrivateContextProps {
    baseUrl?: string;
    loading: boolean;
    authToken?: string;
    requestTimeout?: number;
    dispatchErrorRequest?: (payload: any, show?: boolean) => void;
    dispatchSuccessRequest?: (payload: any, show?: boolean) => void;
    dispatchLoadingState?: (state: boolean, show?: boolean) => void;
    setBaseUrl?: React.Dispatch<React.SetStateAction<string>>;
    setAuthToken?: React.Dispatch<React.SetStateAction<string>>;
    requestInterceptor?: (payload: InterceptorPayload) => InterceptorPayload | Promise<InterceptorPayload>;
    responseInterceptor?: (
        payload: InterceptorResponsePayload
    ) => InterceptorResponsePayload | Promise<InterceptorResponsePayload>;
    axiosInstance?: any;
}

export interface IRequestHandler<T> {
    makeRequest: MakeRequest<T>;
}

export type HandlerDependency<T extends any = any> = Omit<
    Partial<PrivateContextProps & UseRequestProps<T>> & {
        requestConfig?: Omit<GetRequestPayload & BodyRequestPayload & FormDataRequestPayload, 'method'> & {
            method?: RequestMethod;
        };
        appLevelInterceptor?: Interceptors;
        appLevelBaseUrl?: string;
        path?: string;
        appLevelTimeout?: number;
        setRequestUpdate?: React.Dispatch<React.SetStateAction<number>>;
        setStateData?: React.Dispatch<React.SetStateAction<Record<string, StoredValue<unknown> | undefined>>>;
        stateData: Record<string, StoredValue<unknown> | undefined>;
        // method?: RequestMethod;
    },
    'requestTimeout'
>;

export interface IRequestData<T extends any = any> {
    data: {
        statusText?: string;
        headers?: any;
        data?: T;
        status: number;
    };
    error: boolean;
    retry?: boolean;
}
