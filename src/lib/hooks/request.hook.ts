import createFormData from '../helpers/create-form-data';
import MemoryStorageContext from '../contexts/memory-storage.context';
import objectDeepEqual from '../helpers/object-deep-equal';
import queryBuilder from '../helpers/query-builder';
import RequestContext from '../contexts/request.context';
import { generatePath, getRequestAbortter, requestHeaderBuilder } from '../helpers/request.helper';
import { InterceptorPayload, InterceptorResponsePayload, RequestHeader, RequestMethod } from '../index.d';
import { retrieveStoredValue, saveValueToLocalStorage, saveValueToMemory } from '../helpers/stored-value-management';
import { useCallback, useContext, useRef, useState } from 'react';
import PrivateContext from '../contexts/private.context';

interface RequestPayload {
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

interface GetRequestPayload extends RequestPayload {
    method?: Extract<RequestMethod, 'GET'>;
}

interface BodyRequestPayload extends RequestPayload {
    method?: Exclude<RequestMethod, 'GET'>;
    body: Record<string, any>;
}

interface FormDataRequestPayload extends RequestPayload {
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

const initialState = {
    loading: false,
    error: false,
    success: false,
    data: null,
    message: '',
    status: null,
};


interface UseRequestProps<T, E> {
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

export const useRequest = <T = Record<string, unknown> | null, E = unknown>(
    props?: UseRequestProps<T, E>
): [
    IResponse<T, E>, 
    ((url: string, config?: GetRequestPayload | BodyRequestPayload | FormDataRequestPayload) => Promise<T | E | null>)
] => {
    const [state, setState] = useState<IResponse<T, E>>({ ...initialState });
    const { baseUrl, authToken } = useContext(RequestContext);
    const retryCount = useRef(1);
    const requestUrlRef = useRef<string>();
    const { 
        setLoading,
        requestTimeout, 
        dispatchErrorRequest,
        dispatchSuccessRequest,
        requestInterceptor: appLevelRequestInterceptor, 
        responseInterceptor: appLevelResponseInterceptor, 
    } = useContext(PrivateContext);
    const { setStoredData, storedData, setRequestUpdate } = useContext(MemoryStorageContext);
    const { localStorage, sessionStorage, memoryStorage, name, interceptors } = props || {};

    const makeRequest = useCallback(
        async (path: string, config?: GetRequestPayload | BodyRequestPayload | FormDataRequestPayload): Promise<T | E | null> => {
            try {
                setLoading?.(true);
                setState((prevState) => ({ ...prevState, loading: true }));

                const requestMethod =
                    config?.method ||
                    ((config as BodyRequestPayload)?.body || (config as FormDataRequestPayload)?.formData
                        ? 'POST'
                        : 'GET');

                requestUrlRef.current = generatePath(path, props?.baseUrl || baseUrl, config?.useBaseUrl);

                // if response was cached return cached response.
                if (!config?.forceRefetch) {
                    const storedValue = retrieveStoredValue<T>(requestUrlRef.current, storedData, name);
                    if (storedValue && objectDeepEqual(storedValue.queryParam, config?.query)) {
                        setLoading?.(false);
                        setState((previousState) => 
                            getSuccessState<T>(previousState, storedValue.data, config?.successMessage)
                        );
                        props?.onSuccess?.(storedValue.data);
                        return storedValue.data;
                    }
                }

                let formData: FormData | undefined = undefined;
                const payloadFormData = (config as FormDataRequestPayload)?.formData;
                const [headers, overridesHeaders] = requestHeaderBuilder(config?.bearer ?? true, authToken, config?.header);

                if (payloadFormData) {
                    !overridesHeaders && delete headers['Content-Type'];
                    formData = createFormData(payloadFormData);
                }

                const interceptorPayload = {
                    headers, 
                    method: requestMethod,
                    queryParams: config?.query,
                    url: requestUrlRef.current,
                    body: formData ?? (config as BodyRequestPayload)?.body,
                }

                let payload = appLevelRequestInterceptor?.(interceptorPayload) ?? interceptorPayload;
                payload = interceptors?.request?.(payload) ?? payload;

                retryCount.current = config?.retries ?? retryCount.current;

                const { controller, timeoutRef } = getRequestAbortter(config?.timeout ?? requestTimeout) ?? {};
                const response = await fetch(`${payload.url}${queryBuilder(payload.queryParams)}`, {
                    headers: payload.headers,
                    method: payload.method,
                    signal: controller?.signal,
                    body: payload.body instanceof FormData 
                        ? payload.body
                        : (payload.body && JSON.stringify(payload.body)),
                });

                if (timeoutRef) clearTimeout(timeoutRef);

                const responseBody = JSON.parse((await response.text()) || '{}');
                setLoading?.(false);

                let responsePayload: InterceptorResponsePayload = {
                    url: payload.url,
                    data: responseBody,
                    method: payload.method,
                    status: response.status,
                    queryParams: payload.queryParams,
                }
                responsePayload = appLevelResponseInterceptor?.(responsePayload) ?? responsePayload;
                responsePayload = interceptors?.response?.(responsePayload) ?? responsePayload

                if (response.ok) {
                    const successMessage =
                        config?.successMessage || responsePayload.data?.message || response.statusText;

                    const newState = getSuccessState(state, responseBody, successMessage);
                    const valueToStore = {   
                        name, 
                        url: payload.url,
                        value: { data: responsePayload.data, queryParam: payload.queryParams },
                    };
                    if (memoryStorage && setStoredData) saveValueToMemory(valueToStore, setStoredData);
                    if (sessionStorage) saveValueToLocalStorage(valueToStore);
                    if (localStorage) saveValueToLocalStorage(valueToStore);

                    setRequestUpdate?.((initialValue) => initialValue++);
                    dispatchSuccessRequest?.(responsePayload.data);
                    setState(newState);
                    props?.onSuccess?.(responsePayload.data as T);

                    return newState.data;
                } else {
                    const errorMessage =
                        config?.errorMessage ||
                        responsePayload.data?.error ||
                        responsePayload.data?.message ||
                        responsePayload.data?.error?.message ||
                        responsePayload.data?.error?.error;

                    const newState = getErrorState<E>(state, responsePayload.data as E, errorMessage);
                    dispatchErrorRequest?.(responsePayload.data)
                    props?.onError?.(newState.data);
                    setState(newState);
                    return newState.data;
                }
            } catch (err: any) {
                if (retryCount.current > 1) {
                    retryCount.current = --retryCount.current;
                    const response = await makeRequest(requestUrlRef.current!!, { ...config, retries: retryCount.current });
                    return response;
                }

                const newState = getErrorState<E>(state, err, err.message || 'An error occur.');
                dispatchErrorRequest?.(null);
                setState(newState);
                props?.onError?.(newState.data);
                return newState.data;
            }
        },
        [
            appLevelResponseInterceptor,
            appLevelRequestInterceptor, 
            dispatchSuccessRequest,
            dispatchErrorRequest,
            setRequestUpdate, 
            sessionStorage, 
            requestTimeout,
            setStoredData,
            memoryStorage,
            interceptors, 
            localStorage,
            setLoading,
            storedData,
            authToken, 
            baseUrl, 
            props,   
            state,   
            name, 
        ]
    );

    return [ state, makeRequest ];
};

const getSuccessState = <T>(initialState: object, data: T | null, message?: string) => ({
    ...initialState,
    message: message ?? '',
    loading: false,
    success: true,
    error: false,
    data
});

const getErrorState = <E>(initialState: object, data: E | null, message?: string) => ({
    ...initialState,
    message: message ?? '',
    loading: false,
    success: false,
    error: true,
    data,
});
