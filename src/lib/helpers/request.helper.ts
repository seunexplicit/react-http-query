import queryBuilder from './query-builder';
import {
    BodyRequestPayload,
    FormDataRequestPayload,
    GetRequestPayload,
    InterceptorPayload,
    RequestHeader
} from '../index.d';
/**
 * Checks if a string is an absolute url or a path
 * @param url String to check
 * @returns {boolean}
 */
export const isPath = (url: string): boolean => {
    try {
        new URL(url);
        return false;
    } catch (_err) {
        return true;
    }
};

/**
 * Generate request path.
 * 
 * @param path Request path or url
 * @param baseUrl Request base url
 * @returns {string}
 */
export const generatePath = (path: string, baseUrl: string, useBaseUrl: boolean | undefined): string => {
    return `${
        useBaseUrl === true && baseUrl 
            ? concatBasePath(path, baseUrl)
            : useBaseUrl === false || !isPath(path)
            ? path
            : concatBasePath(path, baseUrl)
    }`;
};

const concatBasePath = (path: string, baseUrl: string) => {
    return (baseUrl.charAt(baseUrl.length - 1) === '/' ? baseUrl : `${baseUrl}/`)  
        + (path.charAt(0) === '/' ? path.substring(1) : path);
}

/**
 * Builds request headers
 * 
 * @param allowBearer If to allow authorization to the request heeader
 * @param authorizationToken Authorization header
 * @param headerProps User haeder properties
 * @returns 
 */
export const requestHeaderBuilder = (
    allowBearer?: boolean,
    authorizationToken?: string,
    headerProps?: RequestHeader
): [Record<string, string>, boolean] => {
    const headers: Record<string, string> = {};
    const headerPropsKey = Object.keys(headerProps || {});
    const overridesHeaders = !!headerPropsKey.length
        && (headerPropsKey.length > 1 || headerPropsKey[0] !== 'append')

    if (!overridesHeaders) {
        Object.assign(headers, {
            'Content-Type': 'application/json',
            ...(headerProps?.append as Record<string, string>)
        });
        
        if (allowBearer && authorizationToken) {
            Object.assign(headers, {Authorization: `Bearer ${authorizationToken}`});
        }

        return [headers, overridesHeaders];
    }

    return [{...(headerProps as Record<string, string>)}, overridesHeaders];
}

/**
 * Get an abort controller.
 * 
 * @param timeout Request timeout.
 * @returns 
 */
export const getRequestAbortter = (timeout?: number) => {
    if (!timeout) return;
    const controller  = new AbortController();
    const timeoutRef = setTimeout(() => controller.abort(), timeout);
    return { controller, timeoutRef } 
}


export const fetchRequest = (
    payload: InterceptorPayload, 
    config?: GetRequestPayload | BodyRequestPayload | FormDataRequestPayload,
    controller?: AbortController
) => {
    return fetch(`${payload.url}${queryBuilder(payload.queryParams)}`, {
        headers: payload.headers,
        method: payload.method,
        signal: controller?.signal,
        mode: config?.mode,
        cache: config?.cache,
        integrity: config?.integrity,
        keepalive: config?.keepalive,
        window: config?.window,
        redirect: config?.redirect,
        referrer: config?.referrer,
        referrerPolicy: config?.referrerPolicy,
        credentials: config?.credentials,
        body: payload.body instanceof FormData 
            || payload.body instanceof URLSearchParams
            || payload.body instanceof Blob
            || payload.body instanceof ArrayBuffer
            || ArrayBuffer.isView(payload.body)
            || typeof payload.body === 'string'
            ? payload.body
            : (payload.body && JSON.stringify(payload.body)),
    });
}
