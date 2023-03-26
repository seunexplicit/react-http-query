import queryBuilder from './query-builder';
import {
    BodyRequestPayload,
    FormDataRequestPayload,
    GetRequestPayload,
    InterceptorPayload,
    RequestHeader,
} from '../model';

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
 * @param isRelative Detemine if path is relative path or absolute path
 * @returns {string}
 */
export const generatePath = (
    path: string,
    baseUrl: string | undefined,
    isRelative: boolean | undefined
): string => {
    return `${
        isRelative === true && baseUrl
            ? concatBasePath(path, baseUrl)
            : isRelative === false || !isPath(path)
            ? path
            : concatBasePath(path, baseUrl)
    }`;
};

const concatBasePath = (path: string, baseUrl: string | undefined) => {
    return (
        (baseUrl?.charAt(baseUrl?.length - 1) === '/' ? baseUrl : `${baseUrl}/`) +
        (path.charAt(0) === '/' ? path.substring(1) : path)
    );
};

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
    const overridesHeaders =
        !!headerPropsKey.length && (headerPropsKey.length > 1 || headerPropsKey[0] !== 'append');

    if (!overridesHeaders) {
        Object.assign(headers, {
            'Content-Type': 'application/json',
            ...(headerProps?.append as Record<string, string>),
        });

        if (allowBearer && authorizationToken) {
            Object.assign(headers, { Authorization: `Bearer ${authorizationToken}` });
        }

        return [headers, overridesHeaders];
    }

    return [{ ...(headerProps as Record<string, string>) }, overridesHeaders];
};

/**
 * Get an abort controller.
 *
 * @param timeout Request timeout.
 * @returns
 */
export const getRequestAbortter = (timeout?: number) => {
    if (!timeout) return;
    const controller = new AbortController();
    const timeoutRef = setTimeout(() => controller.abort(), timeout);
    return { controller, timeoutRef };
};

export const fetchRequest = (
    payload: InterceptorPayload,
    config?: GetRequestPayload | BodyRequestPayload | FormDataRequestPayload,
    controller?: AbortController
) => {
    return fetch(`${payload.url}${queryBuilder(payload.queryParams)}`, {
        headers: payload.headers,
        method: payload.method,
        ...getProperty('mode', config),
        ...getProperty('cache', config),
        ...getProperty('window', config),
        ...getProperty('redirect', config),
        ...getProperty('referrer', config),
        ...getProperty('integrity', config),
        ...getProperty('keepalive', config),
        ...getProperty('signal', controller),
        ...getProperty('credentials', config),
        ...getProperty('referrerPolicy', config),
        body:
            payload.body instanceof Blob ||
            typeof payload.body === 'string' ||
            ArrayBuffer.isView(payload.body) ||
            payload.body instanceof FormData ||
            payload.body instanceof ArrayBuffer ||
            payload.body instanceof URLSearchParams
                ? payload.body
                : payload.body && JSON.stringify(payload.body),
    });
};

const getProperty = (key: string, payload?: any) => payload?.[key] !== undefined && { [key]: payload[key] };
