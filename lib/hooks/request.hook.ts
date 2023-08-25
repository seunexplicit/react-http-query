import MemoryStorageContext from '../contexts/memory-storage.context';
import PrivateContext from '../contexts/private.context';
import { IResponse, MakeRequest, UseRequestProps } from '../model';
import { useContext, useEffect, useMemo, useState } from 'react';
import RequestHandler from '../handler/request-handler';
import { getInitialState } from '../helpers/request.helper';

export const useRequest = <T = any>(props?: UseRequestProps<T>): [IResponse<T>, MakeRequest<T>] => {
    const requestHandler = useMemo(() => {
        const handler = new RequestHandler<T>();
        return handler;
    }, []);

    const makeRequest = useMemo(() => requestHandler.makeRequest.bind(requestHandler), []);

    const [state, setState] = useState<[IResponse<T>, MakeRequest<T>]>([getInitialState, makeRequest]);

    const {
        baseUrl,
        authToken,
        axiosInstance,
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
            axiosInstance,
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
    ]);

    useEffect(() => {
        props?.onMount?.(makeRequest);
        requestHandler.setStateSetter(setState);
    }, []);

    return state;
};
