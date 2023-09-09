import {
    act,
    BAD_URL,
    GOOD_URL,
    mockWindowProperty,
    renderHook,
    setupMockupRequest,
    StrictMode,
    waitFor,
    __BAD_RESPONSE__,
    __MOCK_DATA__,
} from './test-util';
import fetchMock from 'jest-fetch-mock';
import { useRequest } from '../lib';
import StorageMock from './mock-storage';
import { useEffect } from 'react';
import { MakeRequest } from '../lib/model';

fetchMock.enableMocks();

describe('useRequest', () => {
    mockWindowProperty('localStorage', new StorageMock());
    mockWindowProperty('sessionStorage', new StorageMock());

    beforeEach(() => {
        fetchMock.resetMocks();
        setupMockupRequest();
        localStorage.clear();
        sessionStorage.clear();
    });

    test('should get reponse payload from `onSuccess` callback', async () => {
        let responsePayload: any;

        const { result } = renderHook(() =>
            useRequest({
                onSuccess: (response) => {
                    responsePayload = response.data;
                },
            })
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(GOOD_URL));

        expect(responsePayload.body).toStrictEqual(__MOCK_DATA__.body);
    });

    test('should make request on mount of the component', async () => {
        let done = false;

        const { result } = renderHook(() =>
            useRequest({
                onMount: async (makeRequest) => {
                    await act(() => makeRequest(GOOD_URL));
                    done = true;
                },
            })
        );

        await waitFor(() => expect(done).toBe(true));
        const [{ data }] = result.current;

        expect(data.body).toStrictEqual(__MOCK_DATA__.body);
    });

    test('should not make cyclic call when in strictmode', async () => {
        let requestFn: MakeRequest<any>;

        renderHook(
            () => {
                const [, makeSecondRequest] = useRequest({
                    onMount: (makeRequest) => { requestFn = makeRequest; },
                });
                useEffect(() => {
                    makeSecondRequest(GOOD_URL);
                }, [makeSecondRequest]);
            },
            { wrapper: StrictMode }
        );

        await act(async () => await requestFn(GOOD_URL))
        expect(fetchMock).toBeCalledTimes(1);
    });

    test('should get error payload from `onError` callback', async () => {
        let errorPayload: any;

        const { result } = renderHook(() =>
            useRequest({
                onError: (error) => {
                    errorPayload = error.data;
                },
            })
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(BAD_URL));

        expect(errorPayload).toStrictEqual(__BAD_RESPONSE__);
    });

    test('should refetch request when `refetch` is called', async () => {
        const { result } = renderHook(() =>
            useRequest()
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(GOOD_URL));
        expect(fetchMock).toHaveBeenCalledTimes(1);

        const [{ refetch }] = result.current;
        await act(async () => await refetch());
        
        expect(fetchMock).toBeCalledTimes(2)
        expect(fetchMock).toHaveBeenCalledWith(GOOD_URL, expect.objectContaining({ method: 'GET' }));
    });

    test('should merge query parameter when `refetch` is called with query parameter', async () => {
        const { result } = renderHook(() => useRequest());

        const [, makeRequest] = result.current;
        await act(() => makeRequest(GOOD_URL, { query: { page: 2, offset: 5 }}));
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(`${GOOD_URL}?page=2&offset=5`, expect.any(Object));

        const [{ refetch }] = result.current;
        await act(async () => await refetch({ page: 10 }));
        
        expect(fetchMock).toBeCalledTimes(2)
        expect(fetchMock).toHaveBeenCalledWith(`${GOOD_URL}?page=10&offset=5`, expect.any(Object));
    });

    test('should intercept and update request method', async () => {
        const { result } = renderHook(() =>
            useRequest({
                interceptors: {
                    request: (payload) => {
                        return {
                            ...payload,
                            method: 'DELETE',
                        };
                    },
                },
            })
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(BAD_URL));

        expect(fetchMock.mock.lastCall?.[1]?.method).toBe('DELETE');
    });

    test('should intercept and update request body', async () => {
        const interceptorBody = { payload: 'intercept' };
        const { result } = renderHook(() =>
            useRequest({
                interceptors: {
                    request: (payload) => {
                        return {
                            ...payload,
                            body: interceptorBody,
                        };
                    },
                },
            })
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(GOOD_URL, { body: { payload: 'original' } }));

        expect(fetchMock.mock.lastCall?.[1]?.body).toBe(JSON.stringify(interceptorBody));
    });

    test('should intercept and update request header', async () => {
        const interceptorHeader = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer yHjj7hqwrekjj977aw',
        };
        const { result } = renderHook(() =>
            useRequest({
                interceptors: {
                    request: (payload) => {
                        return {
                            ...payload,
                            headers: interceptorHeader,
                        };
                    },
                },
            })
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(GOOD_URL));

        expect(fetchMock.mock.lastCall?.[1]?.headers).toStrictEqual(interceptorHeader);
    });

    test('should intercept and update request query parameters', async () => {
        const interceptorQueryParams = { source: 'interceptor' };
        const query = { page: 1 };

        const { result } = renderHook(() =>
            useRequest({
                interceptors: {
                    request: (payload) => {
                        return {
                            ...payload,
                            queryParams: {
                                ...payload.queryParams,
                                ...interceptorQueryParams,
                            },
                        };
                    },
                },
            })
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(GOOD_URL, { query }));

        expect(fetchMock.mock.calls[0][0]).toBe(`${GOOD_URL}?page=1&source=interceptor`);
    });

    test('should intercept and update response payload `data`', async () => {
        const interceptorBody = { extra: 'from-Interceptor' };

        const { result } = renderHook(() =>
            useRequest({
                interceptors: {
                    response: (payload) => {
                        payload.data = { ...payload.data, ...interceptorBody };
                        return payload;
                    },
                },
            })
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(GOOD_URL));
        const [{ data }] = result.current;

        expect(data).toStrictEqual({ ...__MOCK_DATA__, ...interceptorBody });
    });

    test('should use url passed to makeRequest if absolute url', async () => {
        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest({ baseUrl: 'http://baseUrl/' }));
        await act(() => makeRequest(GOOD_URL));

        expect(fetchMock.mock.calls[0][0]).toBe(GOOD_URL);
    });

    test('should use `baseUrl` passed to `useRequest` if url passed to `makeRequest` is path', async () => {
        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest({ baseUrl: 'http://baseUrl/' }));
        await act(() => makeRequest('/request/path'));

        expect(fetchMock.mock.calls[0][0]).toBe('http://baseUrl/request/path');
    });

    test(`should use baseUrl passed to useRequest if url passed to makeRequest is absolute url 
        and useBaseUrl is set to true`, async () => {
        const baseUrl = 'http://baseUrl/';
        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest({ baseUrl }));

        await act(() => makeRequest(GOOD_URL, { isRelative: true }));

        expect(fetchMock.mock.calls[0][0]).toBe(`${baseUrl}${GOOD_URL}`);
    });

    test('should store data in localStorage when `localStorage` prop is set to `true`.', async () => {
        const requestName = 'local-storage-name';
        const localStorageSpy = jest.spyOn(window.localStorage, 'setItem');
        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() =>
            useRequest({
                name: requestName,
                localStorage: true,
            })
        );

        await act(() => makeRequest(GOOD_URL));

        expect(localStorageSpy).toBeCalled();
        expect(localStorage.key(0)).toContain(requestName);
    });

    test('should store data in sessionStorage when `sessionStorage` prop is set to `true`.', async () => {
        const requestName = 'session-storage-name';
        const sessionStorageSpy = jest.spyOn(window.sessionStorage, 'setItem');
        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() =>
            useRequest({
                name: requestName,
                sessionStorage: true,
            })
        );

        await act(() => makeRequest(GOOD_URL));

        expect(sessionStorageSpy).toBeCalled();
        expect(sessionStorage.key(0)).toContain(requestName);
    });
});
