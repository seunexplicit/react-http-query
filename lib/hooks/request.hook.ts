import createFormData from '../helpers/create-form-data';
import MemoryStorageContext from '../contexts/memory-storage.context';
import objectDeepEqual from '../helpers/object-deep-equal';
import PrivateContext from '../contexts/private.context';
import {
    BodyRequestPayload,
    FormDataRequestPayload,
    GetRequestPayload,
    InterceptorResponsePayload,
    IResponse,
    MakeRequest,
    UseRequestProps,
} from '../model';
import {
    fetchRequest,
    generatePath,
    getRequestAbortter,
    requestHeaderBuilder,
} from '../helpers/request.helper';
import {
    retrieveStoredValue,
    saveValueToLocalStorage,
    saveValueToMemory,
    saveValueToSession,
} from '../helpers/stored-value-management';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

const initialState = {
    loading: false,
    error: false,
    success: false,
    data: null,
    message: '',
    status: null,
};

export const useRequest = <T = any, E = unknown>(
    props?: UseRequestProps<T, E>
): [IResponse<T, E>, MakeRequest<T, E>] => {
    const [state, setState] = useState<IResponse<T, E>>({ ...initialState });
    const retryCount = useRef(1);
    const requestUrlRef = useRef<string>();
    const {
        baseUrl,
        authToken,
        requestTimeout,
        dispatchErrorRequest,
        dispatchLoadingState,
        dispatchSuccessRequest,
        requestInterceptor: appLevelRequestInterceptor,
        responseInterceptor: appLevelResponseInterceptor,
    } = useContext(PrivateContext);
    const { setStoredData, storedData, setRequestUpdate } = useContext(MemoryStorageContext);
    const { localStorage, sessionStorage, memoryStorage, name, interceptors } = props || {};

    const makeRequest = useCallback(
        async (
            path: string,
            config?: GetRequestPayload | BodyRequestPayload | FormDataRequestPayload
        ): Promise<T | E | null> => {
            try {
                dispatchLoadingState?.(true);
                setState((prevState) => ({ ...prevState, loading: true }));

                const requestMethod =
                    config?.method ||
                    ((config as BodyRequestPayload)?.body || (config as FormDataRequestPayload)?.formData
                        ? 'POST'
                        : 'GET');

                requestUrlRef.current = generatePath(path, props?.baseUrl || baseUrl, config?.isRelative);

                // if response was cached return cached response.
                if (!config?.forceRefetch) {
                    const storedValue = retrieveStoredValue<T>(requestUrlRef.current, storedData, name);
                    if (storedValue && objectDeepEqual(storedValue.queryParam, config?.query)) {
                        dispatchLoadingState?.(false);
                        setState((previousState) =>
                            getSuccessState<T>(previousState, storedValue.data, config?.successMessage)
                        );
                        props?.onSuccess?.(storedValue.data);
                        return storedValue.data;
                    }
                }

                let formData: FormData | undefined = undefined;
                const payloadFormData = (config as FormDataRequestPayload)?.formData;
                const [headers, overridesHeaders] = requestHeaderBuilder(
                    config?.bearer ?? true,
                    authToken,
                    config?.header
                );

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
                };

                let payload = appLevelRequestInterceptor?.(interceptorPayload) ?? interceptorPayload;
                payload = interceptors?.request?.(payload) ?? payload;

                retryCount.current = config?.retries ?? retryCount.current;

                const { controller, timeoutRef } =
                    getRequestAbortter(config?.timeout ?? requestTimeout) ?? {};
                const response = await fetchRequest(payload, config, controller);

                if (timeoutRef) clearTimeout(timeoutRef);

                const responseBody = JSON.parse((await response.text()) || '{}');

                const responsePayload = Object.defineProperties(
                    {},
                    {
                        url: getEnumerableProperties(payload.url),
                        method: getEnumerableProperties(payload.method),
                        status: getEnumerableProperties(response.status),
                        data: getEnumerableProperties(responseBody, true),
                        queryParams: getEnumerableProperties(payload.queryParams),
                    }
                ) as InterceptorResponsePayload;

                responsePayload.data =
                    appLevelResponseInterceptor?.(responsePayload)?.data ?? responsePayload?.data;
                responsePayload.data =
                    interceptors?.response?.(responsePayload)?.data ?? responsePayload?.data;

                dispatchLoadingState?.(false);

                if (response.ok) {
                    const successMessage =
                        config?.successMessage || responsePayload.data?.message || response.statusText;

                    const newState = getSuccessState(state, responsePayload.data as T, successMessage);
                    const valueToStore = {
                        name,
                        url: payload.url,
                        value: { data: responsePayload.data, queryParam: payload.queryParams },
                    };
                    if (memoryStorage && setStoredData) saveValueToMemory(valueToStore, setStoredData);
                    if (sessionStorage) saveValueToSession(valueToStore);
                    if (localStorage) saveValueToLocalStorage(valueToStore);

                    setRequestUpdate?.((initialValue) => ++initialValue);
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
                    dispatchErrorRequest?.(responsePayload.data);
                    props?.onError?.(newState.data);
                    setState(newState);
                    return newState.data;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                if (retryCount.current > 1) {
                    retryCount.current = --retryCount.current;
                    const response = await makeRequest(requestUrlRef.current ?? '', {
                        ...config,
                        retries: retryCount.current,
                    });
                    return response;
                }

                dispatchLoadingState?.(false);
                const newState = getErrorState<E>(state, err, err?.message || 'An error occur.');
                dispatchErrorRequest?.(err);
                setState(newState);
                props?.onError?.(newState.data);
                return newState.data;
            }
        },
        [
            appLevelResponseInterceptor,
            appLevelRequestInterceptor,
            dispatchLoadingState,
            dispatchErrorRequest,
            setRequestUpdate,
            sessionStorage,
            requestTimeout,
            setStoredData,
            memoryStorage,
            interceptors,
            localStorage,
            storedData,
            authToken,
            baseUrl,
            props,
            name,
        ]
    );

    useEffect(() => {
        props?.onMount?.(makeRequest);
    }, []);

    return [state, makeRequest];
};

const getSuccessState = <T>(initialState: object, data: T | null, message?: string) => ({
    ...initialState,
    message: message ?? '',
    loading: false,
    success: true,
    error: false,
    data,
});

const getErrorState = <E>(initialState: object, data: E | null, message?: string) => ({
    ...initialState,
    message: message ?? '',
    loading: false,
    success: false,
    error: true,
    data,
});

const getEnumerableProperties = (value: unknown, writable: boolean = false) => ({
    value,
    writable,
    enumerable: true,
});
