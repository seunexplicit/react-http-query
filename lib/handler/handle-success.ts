import {
    saveValueToLocalStorage,
    saveValueToMemory,
    saveValueToSession,
} from '../helpers/stored-value-management';
import { InterceptorPayload, InterceptorResponsePayload } from '../model';
import RequestHandler from './request-handler';

export const handleSuccess = async (
    payload: InterceptorResponsePayload,
    requestMeta: InterceptorPayload,
    requestHandler: RequestHandler
) => {
    const { getDependency } = requestHandler;
    const {
        appLevelInterceptor: { response: appResponseInterceptor } = {},
        interceptors: { response: componentResponseInterceptor } = {},
        setStateData,
        memoryStorage,
        sessionStorage,
        localStorage,
        name,
        setRequestUpdate,
    } = getDependency();

    payload.data = (await appResponseInterceptor?.(payload))?.data ?? payload?.data;
    payload.data = (await componentResponseInterceptor?.(payload))?.data ?? payload?.data;

    const valueToStore = {
        name,
        url: requestMeta.url,
        value: { data: payload.data, queryParam: requestMeta.queryParams },
    };
    if (memoryStorage && setStateData) {
        saveValueToMemory(valueToStore, setStateData);
    }
    if (sessionStorage) saveValueToSession(valueToStore);
    if (localStorage) saveValueToLocalStorage(valueToStore);

    setRequestUpdate?.((initialValue) => ++initialValue);

    return payload;
};
