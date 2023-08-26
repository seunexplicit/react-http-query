import {
    act,
    BAD_URL,
    screen,
    GOOD_URL,
    waitFor,
    MessagePopup,
    mockWindowProperty,
    renderHook,
    RequestWrapper,
    setupMockupRequest,
    __BAD_RESPONSE__,
    __MOCK_DATA__,
    delay,
    __MOCK_AUTH_TOKEN__,
} from './test-util';
import fetchMock from 'jest-fetch-mock';
import { useRequest } from '../lib';
import StorageMock from './mock-storage';

fetchMock.enableMocks();

describe('RequestProvider', () => {
    mockWindowProperty('localStorage', new StorageMock());
    mockWindowProperty('sessionStorage', new StorageMock());

    beforeEach(() => {
        fetchMock.resetMocks();
        setupMockupRequest();
        localStorage.clear();
        sessionStorage.clear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test(`should use "baseUrl" passed to "RequestProvider" if url passed to 
    "makeRequest" is path`, async () => {
        const baseUrl = 'http://baseUrl.com/';
        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest({}), { wrapper: RequestWrapper({ baseUrl }) });

        await act(() => makeRequest('/request/path'));

        expect(fetchMock.mock.calls[0][0]).toBe(`${baseUrl}request/path`);
    });

    test(`baseUrl passed to useRequest should preceed baseUrl passed to useRequest if both
    are provided and url passed to makeRequest is path`, async () => {
        const providerUrl = 'http://provider.com/';
        const hookUrl = 'http://hook.com';

        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest({ baseUrl: hookUrl }), {
            wrapper: RequestWrapper({ baseUrl: providerUrl }),
        });

        await act(() => makeRequest('/request/path'));

        expect(fetchMock.mock.calls[0][0]).toBe(`${hookUrl}/request/path`);
    });

    test(`should add Authorization prop to header when "authToken" is passed to 
    "RequestProvider"`, async () => {
        const providerUrl = 'http://provider.com/';

        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({ baseUrl: providerUrl, authToken: __MOCK_AUTH_TOKEN__ }),
        });

        await act(() => makeRequest('/request/path'));

        expect(fetchMock.mock.calls[0][1]?.headers?.['Authorization']).toBe(`Bearer ${__MOCK_AUTH_TOKEN__}`);
    });

    test('should intercept and update request properties', async () => {
        const interceptorQuery = { page: 1 };
        const interceptorHeader = { 'Content-Type': 'text/plain', 'x-csrf-token': 'Uihdhapx84akjf' };

        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                baseUrl: GOOD_URL,
                interceptors: {
                    request: (payload) => ({
                        ...payload,
                        queryParams: interceptorQuery,
                        headers: interceptorHeader,
                        method: 'DELETE',
                    }),
                },
            }),
        });

        await act(() => makeRequest(''));

        expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE');
        expect(fetchMock.mock.calls[0][1]?.headers).toStrictEqual(interceptorHeader);
        expect(fetchMock.mock.calls[0][0]).toBe(`${GOOD_URL}?page=1`);
    });

    test(`Request provider and useRequest interceptor should intercept and update request 
    properties`, async () => {
        const appLevelQueryInterceptor = { page: 1 };
        const appLevelHeaderInterceptor = {
            'Content-Type': 'text/plain',
            'x-csrf-token': 'Uihdhapx84akjf',
        };
        const componentLevelQueryInterceptor = { pageSize: 20 };
        const componentLevelHeaderInterceptor = { 'x-append-token': __MOCK_AUTH_TOKEN__ };

        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(
            () =>
                useRequest({
                    interceptors: {
                        request: (payload) => ({
                            ...payload,
                            queryParams: { ...payload.queryParams, ...componentLevelQueryInterceptor },
                            headers: { ...payload.headers, ...componentLevelHeaderInterceptor },
                            method: 'PUT',
                        }),
                    },
                }),
            {
                wrapper: RequestWrapper({
                    baseUrl: GOOD_URL,
                    interceptors: {
                        request: (payload) => ({
                            ...payload,
                            queryParams: appLevelQueryInterceptor,
                            headers: appLevelHeaderInterceptor,
                            method: 'DELETE',
                        }),
                    },
                }),
            }
        );

        await act(() => makeRequest(''));

        expect(fetchMock.mock.calls[0][1]?.method).toBe('PUT');
        expect(fetchMock.mock.calls[0][1]?.headers).toStrictEqual({
            ...appLevelHeaderInterceptor,
            ...componentLevelHeaderInterceptor,
        });
        expect(fetchMock.mock.calls[0][0]).toBe(`${GOOD_URL}?page=1&pageSize=20`);
    });

    test('should intercept and update response data property', async () => {
        const responseParamenters = {};
        const interceptorBody = { extra: 'interceptor' };

        const { result } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                baseUrl: GOOD_URL,
                interceptors: {
                    response: (payload) => {
                        responseParamenters['status'] = payload.status;
                        responseParamenters['method'] = payload.method;
                        payload.data = { ...payload.data, ...interceptorBody };
                        return payload;
                    },
                },
            }),
        });

        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));
        const [{ data }] = result.current;

        expect(responseParamenters.method).toBe('GET');
        expect(responseParamenters.status).toBe(200);
        expect(data).toStrictEqual({ ...__MOCK_DATA__, ...interceptorBody });
    });

    test(`Request provider and useRequest interceptor should intercept and update response 
    properties`, async () => {
        const responseParameters = {};
        const appLevelBodyInterceptor = { appExtra: 'interceptor' };
        const componentLevelBodyInterceptor = { componentExtra: 'interceptor_2' };

        const { result } = renderHook(
            () =>
                useRequest({
                    interceptors: {
                        response: (payload) => {
                            responseParameters['method'] = payload.method;
                            payload.data = { ...payload.data, ...componentLevelBodyInterceptor };
                            return payload;
                        },
                    },
                }),
            {
                wrapper: RequestWrapper({
                    baseUrl: GOOD_URL,
                    interceptors: {
                        response: (payload) => {
                            responseParameters['status'] = payload.status;
                            payload.data = { ...payload.data, ...appLevelBodyInterceptor };
                            return payload;
                        },
                    },
                }),
            }
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));
        const [{ data }] = result.current;

        expect(responseParameters.method).toBe('GET');
        expect(responseParameters.status).toBe(200);
        expect(data).toStrictEqual({
            ...__MOCK_DATA__,
            ...componentLevelBodyInterceptor,
            ...appLevelBodyInterceptor,
        });
    });

    test('Should fail when request duration exceed `requestTimeout` set in `RequestProvider`', async () => {
        fetchMock.mockResponse(async () => {
            jest.advanceTimersByTime(60);
            return {};
        });

        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({ baseUrl: GOOD_URL, requestTimeout: 50 }),
        });

        await act(() => makeRequest(''));

        await expect(fetchMock.mock.results[0].value).rejects.toThrow('The operation was aborted.');
    });

    test('should call `RequestProvider` `onError` callback when request fails', async () => {
        let errorResponse = {};

        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                baseUrl: BAD_URL,
                onError: (errorPayload) => {
                    errorResponse = errorPayload.data;
                },
            }),
        });

        await act(() => makeRequest(''));

        expect(errorResponse).toStrictEqual(__BAD_RESPONSE__);
    });

    test('should show error popup on request error, if popup is returned in onError callback', async () => {
        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                baseUrl: BAD_URL,
                popupTimeout: 0.05,
                onError: ({ data }) => {
                    return <MessagePopup message={data.body?.message}></MessagePopup>;
                },
            }),
        });

        await act(() => makeRequest(''));

        expect(await screen.findByText(__BAD_RESPONSE__.body.message)).toBeInTheDocument();
        jest.advanceTimersByTime(60);
        await waitFor(() => {
            expect(screen.queryByText(__BAD_RESPONSE__.body.message)).not.toBeInTheDocument();
        });
    });

    test('should not show error popup if `showError` is set to `false`', async () => {
        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                baseUrl: BAD_URL,
                popupTimeout: 0.05,
                onError: ({ data }) => {
                    return <MessagePopup message={data.body?.message}></MessagePopup>;
                },
            }),
        });

        await act(() => makeRequest('', { showError: false }));

        expect(screen.queryByText(__BAD_RESPONSE__.body.message)).toBe(null);
    });

    test('should call `RequestProvider` `onSuccess` callback when request succeed', async () => {
        let successResponse = {};

        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                baseUrl: GOOD_URL,
                onSuccess: (successPayload) => {
                    successResponse = successPayload.data;
                },
            }),
        });

        await act(() => makeRequest(''));

        expect(successResponse).toStrictEqual(__MOCK_DATA__);
    });

    test(`should show success popup on request success, if popup is returned in onSuccess 
    callback`, async () => {
        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                baseUrl: GOOD_URL,
                popupTimeout: 0.05,
                onSuccess: (successPayload) => {
                    return <MessagePopup message={successPayload.data?.body.data.message}></MessagePopup>;
                },
            }),
        });

        await act(() => makeRequest(''));

        expect(await screen.findByText(__MOCK_DATA__.body.data.message)).toBeInTheDocument();
        jest.advanceTimersByTime(60);
        await waitFor(() => {
            expect(screen.queryByText(__MOCK_DATA__.body.data.message)).not.toBeInTheDocument();
        });
    });

    test('should not show success popup if `showSuccess` is set to `false`', async () => {
        const {
            result: {
                current: [, makeRequest],
            },
        } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                baseUrl: GOOD_URL,
                popupTimeout: 0.05,
                onSuccess: (successPayload) => {
                    return <MessagePopup message={successPayload.data?.body.data.message}></MessagePopup>;
                },
            }),
        });

        await act(() => makeRequest('', { showSuccess: false }));

        expect(screen.queryByText(__MOCK_DATA__.body.data.message)).not.toBeInTheDocument();
    });

    describe('Showing loader popup', () => {
        const loadingMessage = 'loading...';

        beforeEach(() => {
            fetchMock.mockResponse(async () => {
                await delay(10);
                return {};
            });
        });

        afterEach(() => {
            fetchMock.resetMocks();
        });


        test('should show loader component, if loader component is returned in loading callback', async () => {
            let loadingState = false;

            const {
                result: {
                    current: [, makeRequest],
                },
            } = renderHook(() => useRequest(), {
                wrapper: RequestWrapper({
                    baseUrl: GOOD_URL,
                    onLoading: (loading) => {
                        loadingState = loading;
                        return <MessagePopup message={loadingMessage}></MessagePopup>;
                    },
                }),
            });

            act(() => {
                makeRequest('');
            });

            expect(loadingState).toBe(true);
            expect(await screen.findByText(loadingMessage)).toBeInTheDocument();

            jest.advanceTimersByTime(20);

            await waitFor(() => {
                expect(screen.queryByText(loadingMessage)).not.toBeInTheDocument();
            });
            expect(loadingState).toBe(false);
        });

        test('should show not loader component, if `showLoader` is set to `false`', async () => {
            let loadingState = false;

            const {
                result: {
                    current: [, makeRequest],
                },
            } = renderHook(() => useRequest(), {
                wrapper: RequestWrapper({
                    baseUrl: GOOD_URL,
                    onLoading: (loading) => {
                        loadingState = loading;
                        return <MessagePopup message={loadingMessage}></MessagePopup>;
                    },
                }),
            });

            act(() => {
                makeRequest('', { showLoader: false });
            });

            expect(loadingState).toBe(true);
            expect(screen.queryByText(loadingMessage)).not.toBeInTheDocument();
        });
    })

});
