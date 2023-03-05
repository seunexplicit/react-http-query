/// <reference types="node" />
import { HandlerDependency, InterceptorPayload, RequestHeader } from '../model';
/**
 * Checks if a string is an absolute url or a path
 * @param url String to check
 * @returns {boolean}
 */
export declare const isPath: (url: string) => boolean;
/**
 * Generate request path.
 *
 * @param path Request path or url
 * @param baseUrl Request base url
 * @param isRelative Detemine if path is relative path or absolute path
 * @returns {string}
 */
export declare const generatePath: (path: string, baseUrl: string | undefined, isRelative: boolean | undefined) => string;
/**
 * Builds request headers
 *
 * @param allowBearer If to allow authorization to the request heeader
 * @param authorizationToken Authorization header
 * @param headerProps User haeder properties
 * @returns
 */
export declare const requestHeaderBuilder: (allowBearer?: boolean, authorizationToken?: string, headerProps?: RequestHeader) => [Record<string, string>, boolean];
/**
 * Get an abort controller.
 *
 * @param timeout Request timeout.
 * @returns
 */
export declare const getRequestAbortter: (timeout?: number) => {
    controller: AbortController;
    timeoutRef: NodeJS.Timeout;
} | undefined;
export declare const fetchRequest: <T, E>(payload: InterceptorPayload, config?: HandlerDependency<T, E> | undefined, controller?: AbortController) => Promise<Response>;
export declare const getInitialState: {
    loading: boolean;
    error: boolean;
    success: boolean;
    data: null;
    message: string;
    status: null;
};
export declare const getEnumerableProperties: (value: unknown, writable?: boolean) => {
    value: unknown;
    writable: boolean;
    enumerable: boolean;
};
