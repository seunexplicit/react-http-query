import queryBuilder from './query-builder';
import { getProperty } from './request.helper';
import { HandlerDependency, InterceptorPayload, IRequestData } from '../model';
import { getStatusMessage } from './get-status-message';

export const makeFetchRequest = async <T>(
    payload: InterceptorPayload,
    config?: HandlerDependency<T>,
    controller?: AbortController
): Promise<IRequestData> => {
    try {
        const response = await fetch(`${payload.url}${queryBuilder(payload.queryParams)}`, {
            headers: payload.headers,
            method: payload.method,
            ...getProperty('mode', config?.requestConfig),
            ...getProperty('cache', config?.requestConfig),
            ...getProperty('window', config?.requestConfig),
            ...getProperty('redirect', config?.requestConfig),
            ...getProperty('referrer', config?.requestConfig),
            ...getProperty('integrity', config?.requestConfig),
            ...getProperty('keepalive', config?.requestConfig),
            ...getProperty('signal', controller),
            ...getProperty('credentials', config?.requestConfig),
            ...getProperty('referrerPolicy', config?.requestConfig),
            body:
                payload.body instanceof Blob ||
                typeof payload.body === 'string' ||
                ArrayBuffer.isView(payload.body) ||
                payload.body instanceof FormData ||
                payload.body instanceof ArrayBuffer ||
                payload.body instanceof URLSearchParams
                    ? payload.body
                    : payload.body
                    ? JSON.stringify(payload.body)
                    : undefined,
        });

        const responseBody = JSON.parse((await response.text()) || '{}');

        return {
            error: !response.ok,
            retry: false,
            data: {
                data: responseBody,
                status: response.status,
                statusText: response.statusText ?? getStatusMessage(response.status),
                headers: response.headers,
            },
        };
    } catch (err: any) {
        return {
            error: true,
            data: {
                data: err,
                status: err.status ?? 0,
                headers: payload.headers,
                statusText: err.message,
            },
            retry: true,
        };
    }
};
