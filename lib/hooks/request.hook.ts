import MemoryStorageContext from '../contexts/memory-storage.context';
import PrivateContext from '../contexts/private.context';
import { IResponse, MakeRequest, UseRequestProps } from '../model';
import { useContext, useEffect, useMemo, useState } from 'react';
import RequestHandler from '../handler/request-handler';
import { getInitialState } from '../helpers/request.helper';

export const useRequest = <T = any, E = unknown>(
    props?: UseRequestProps<T, E>
): [IResponse<T, E>, MakeRequest<T, E>] => {
    const [state, setState] = useState<[IResponse<T, E>, MakeRequest<T, E>]>([
        getInitialState,
        async () => null,
    ]);

    const requestHandler = useMemo(() => {
        const handler = new RequestHandler<T, E>(setState);
        Object.assign(state, { 1: handler.makeRequest.bind(handler) });
        return handler;
    }, []);

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

    useEffect(() => {
        requestHandler.setDependency({
            ...props,
            appLevelBaseUrl: baseUrl,
            appLevelTimeout: requestTimeout,
            authToken,
            dispatchErrorRequest,
            dispatchLoadingState,
            dispatchSuccessRequest,
            setStateData: setStoredData,
            stateData: storedData,
            setRequestUpdate,
            appLevelInterceptor: {
                request: appLevelRequestInterceptor,
                response: appLevelResponseInterceptor,
            },
        });
    }, [
        name,
        baseUrl,
        authToken,
        storedData,
        interceptors,
        localStorage,
        memoryStorage,
        sessionStorage,
        requestTimeout,
        setRequestUpdate,
        dispatchErrorRequest,
        dispatchLoadingState,
        dispatchSuccessRequest,
        appLevelRequestInterceptor,
        appLevelResponseInterceptor,
    ]);

    useEffect(() => {
        props?.onMount?.(requestHandler.makeRequest.bind(requestHandler));
    }, []);

    return state;
};
