import { RequestHeader } from '../model';

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
    const base = baseUrl ?? '';

    return (
        (base?.charAt(base?.length - 1) === '/' ? base : `${base}/`) +
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
    const headerPropsKey = Object.keys(headerProps ?? {});
    const overridesHeaders = !!headerPropsKey.length && headerPropsKey[0] !== 'append';

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

export const getProperty = <T>(key: keyof T, payload?: T) =>
    payload?.[key] !== undefined && { [key]: payload[key] };

export const getInitialState = {
    loading: false,
    error: false,
    success: false,
    data: null,
    message: '',
    status: null,
    refetch: () => Promise.resolve(null),
};

export const getEnumerableProperties = (value: unknown, writable: boolean = false) => ({
    value,
    writable,
    enumerable: true,
});
