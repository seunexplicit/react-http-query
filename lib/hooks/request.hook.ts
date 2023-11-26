import MemoryStorageContext from '../contexts/memory-storage.context';
import PrivateContext from '../contexts/private.context';
import RequestHandler from '../handler/request-handler';
import { isNullish } from '../helpers/is-nullish';
import { getInitialState } from '../helpers/request.helper';
import { IResponse, MakeRequest, UseRequestProps } from '../model';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const useRequest = <T = any>(
    props?: UseRequestProps<T>,
    dependency?: Array<unknown>
): [IResponse<T>, MakeRequest<T>] => {
    const requestHandler = useMemo(() => {
        const handler = new RequestHandler<T>();
        return handler;
    }, []);

    const makeRequest = useMemo(() => requestHandler.makeRequest.bind(requestHandler), []);

    const [state, setState] = useState<[IResponse<T>, MakeRequest<T>]>([
        { ...getInitialState, refetch: requestHandler.refetch.bind(requestHandler) },
        makeRequest,
    ]);

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
    const { localStorage, sessionStorage, memoryStorage, name, interceptors } = props ?? {};

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

    const initRequest = useCallback(() => {
        requestHandler.abortRequest();
        props?.onMount?.(makeRequest);
        requestHandler.setStateSetter(setState);
    }, dependency ?? []);

    const { enableRequest = [] } = props ?? {};

    const enableRequestMemo = useMemo(
        () => {
            if (Array.isArray(enableRequest) && !enableRequest.length) return true;
            else if (
                (Array.isArray(enableRequest) &&
                    enableRequest.every((value) => !isNullish(value) && value !== '')) ||
                (!Array.isArray(enableRequest) && enableRequest) ||
                enableRequest === 0
            ) {
                return true;
            }

            return false;
        },
        Array.isArray(enableRequest) ? enableRequest : [enableRequest]
    );

    useEffect(() => {
        if (enableRequestMemo) initRequest();
    }, [initRequest, enableRequestMemo]);

    return state;
};
