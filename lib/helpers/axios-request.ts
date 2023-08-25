import queryBuilder from './query-builder';
import { getProperty } from './request.helper';
import { HandlerDependency, InterceptorPayload, IRequestData } from '../model';

export const makeAxiosRequest = async <T>(
    axiosInstance: any,
    payload: InterceptorPayload,
    config?: HandlerDependency<T>,
    controller?: AbortController
): Promise<IRequestData> => {
    try {
        const response = await axiosInstance({
            url: `${payload.url}${queryBuilder(payload.queryParams)}`,
            method: payload.method,
            headers: payload.headers,
            ...getProperty('onUploadProgress', config),
            ...getProperty('onDownloadProgress', config),
            ...getProperty('responseType', config?.requestConfig),
            ...getProperty('xsrfCookieName', config?.requestConfig),
            ...getProperty('xsrfHeaderName', config?.requestConfig),
            ...getProperty('proxy', config?.requestConfig),
            ...getProperty('validateStatus', config),
            ...getProperty('timeout', { timeout: config?.requestConfig?.timeout ?? config?.appLevelTimeout }),
            data: payload.body,
            signal: controller,
        });

        return {
            error: false,
            data: response,
        };
    } catch (err: any) {
        return {
            error: true,
            data: {
                data: err.response?.data,
                status: err.response?.status ?? 0,
                headers: err.response?.headers ?? payload.headers,
                statusText: err.response?.statusText ?? err?.message,
            },
            retry: !err?.response,
        };
    }
};
