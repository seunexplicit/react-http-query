import { act, BAD_URL, screen, GOOD_URL, waitFor, MessagePopup, mockWindowProperty, renderHook, RequestWrapper, setupMockupRequest, __BAD_RESPONSE__, __MOCK_DATA__, delay } from "./test-util";
import fetchMock from "jest-fetch-mock";
import { useRequest } from "../lib";
import StorageMock from "./mock-storage";

fetchMock.enableMocks();

describe(`RequestProvider`, () => {
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
    })

    test('should use `baseUrl` passed to `RequestProvider` if url passed to `makeRequest` is path', async () => {
        const baseUrl = 'http://baseUrl.com/'; 
        const { result: { current: [, makeRequest] } } = renderHook(
            () => useRequest({ }), 
            { wrapper: RequestWrapper({ baseUrl })}
        );

        await act(() => makeRequest('/request/path'));
        
        expect(fetchMock.mock.calls[0][0]).toBe(`${baseUrl}request/path`);
    });

    test(`baseUrl passed to useRequest should preceed baseUrl passed to useRequest if both
        are provided and url passed to makeRequest is path`, async (
    ) => {
        const providerUrl = 'http://provider.com/';
        const hookUrl = 'http://hook.com'; 

        const { result: { current: [, makeRequest] } } = renderHook(
            () => useRequest({ baseUrl: hookUrl }), 
            { wrapper: RequestWrapper({ baseUrl: providerUrl })}
        );

        await act(() => makeRequest('/request/path'));
        
        expect(fetchMock.mock.calls[0][0]).toBe(`${hookUrl}/request/path`);
    });

    test('should add Authorization prop to header when `authToken` is passed to `RequestProvider`', async () => {
        const providerUrl = 'http://provider.com/';
        const authToken = 'yUI09HJklhngJJKjhdhdg/aliyEb'; 

        const { result: { current: [, makeRequest] } } = renderHook(
            () => useRequest(), 
            { wrapper: RequestWrapper({ baseUrl: providerUrl, authToken })}
        );

        await act(() => makeRequest('/request/path'));
        
        expect((fetchMock.mock.calls[0][1]?.headers)['Authorization'])
            .toBe(`Bearer ${authToken}`);
    });

    test('should intercept and update request properties', async () => {
        const interceptorQuery = { page: 1 };
        const interceptorHeader = { 'Content-Type': 'text/plain', 'x-csrf-token': 'Uihdhapx84akjf' }

        const { result: { current: [, makeRequest] } } = renderHook(
            () => useRequest(), 
            { wrapper: RequestWrapper({ 
                baseUrl: GOOD_URL, 
                interceptors: {
                    request: (payload) => ({
                        ...payload, 
                        queryParams: interceptorQuery,
                        headers: interceptorHeader,
                        method: 'DELETE' 
                    })
                } 
            })}
        );

        await act(() => makeRequest(''));
        
        expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE')
        expect(fetchMock.mock.calls[0][1]?.headers).toStrictEqual(interceptorHeader);
        expect(fetchMock.mock.calls[0][0]).toBe(`${GOOD_URL}?page=1`);
    });

    test('Request provider and useRequest interceptor should intercept and update request properties', async () => {
        const appLevelQueryInterceptor = { page: 1 };
        const appLevelHeaderInterceptor = { 
            'Content-Type': 'text/plain', 
            'x-csrf-token': 'Uihdhapx84akjf' 
        };
        const componentLevelQueryInterceptor = { pageSize: 20 };
        const componentLevelHeaderInterceptor = {'x-append-token': 'uiJkuaD2pqm89/hyUisnaK'}

        const { result: { current: [, makeRequest] } } = renderHook(
            () => useRequest({
                interceptors: {
                    request: (payload) => ({
                        ...payload,
                        queryParams: { ...payload.queryParams, ...componentLevelQueryInterceptor },
                        headers: { ...payload.headers, ...componentLevelHeaderInterceptor },
                        method: 'PUT'
                    })
                }
            }), 
            { wrapper: RequestWrapper({ 
                baseUrl: GOOD_URL, 
                interceptors: {
                    request: (payload) => ({
                        ...payload, 
                        queryParams: appLevelQueryInterceptor,
                        headers: appLevelHeaderInterceptor,
                        method: 'DELETE' 
                    })
                } 
            })}
        );

        await act(() => makeRequest(''));

        expect(fetchMock.mock.calls[0][1]?.method).toBe('PUT')
        expect(fetchMock.mock.calls[0][1]?.headers)
            .toStrictEqual({...appLevelHeaderInterceptor, ...componentLevelHeaderInterceptor});
        expect(fetchMock.mock.calls[0][0]).toBe(`${GOOD_URL}?page=1&pageSize=20`);
    });

    test('should intercept and update response data property', async () => {
        const responseParamenters = {};
        const interceptorBody = { extra: 'interceptor' };

        const { result } = renderHook(
            () => useRequest(), 
            { wrapper: RequestWrapper({ 
                baseUrl: GOOD_URL, 
                interceptors: {
                    response: (payload) => {
                        responseParamenters['status'] = payload.status;
                        responseParamenters['method'] = payload.method;
                        payload.data = {...payload.data, ...interceptorBody}
                        return payload
                    }
                } 
            })}
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));
        const [{ data }] = result.current; 
        
        expect(responseParamenters.method).toBe('GET')
        expect(responseParamenters.status).toBe(200);
        expect(data).toStrictEqual({...__MOCK_DATA__, ...interceptorBody});
    });

    test('Request provider and useRequest interceptor should intercept and update response properties', async () => {
        const responseParamenters = {};
        const appLevelBodyInterceptor = { app_extra: 'interceptor' };
        const componentLevelBodyInterceptor = { component_extra: 'interceptor_2' };

        const { result } = renderHook(
            () => useRequest({
                interceptors: {
                    response: (payload) => {
                        responseParamenters['method'] = payload.method;
                        payload.data = { ...payload.data, ...componentLevelBodyInterceptor };
                        return payload;
                    }
                }
            }), 
            { wrapper: RequestWrapper({ 
                baseUrl: GOOD_URL, 
                interceptors: {
                    response: (payload) => {
                        responseParamenters['status'] = payload.status;
                        payload.data = {...payload.data, ...appLevelBodyInterceptor}
                        return payload
                    }
                } 
            })}
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));
        const [{ data }] = result.current; 
        
        expect(responseParamenters.method).toBe('GET')
        expect(responseParamenters.status).toBe(200);
        expect(data).toStrictEqual({
            ...__MOCK_DATA__,
            ...componentLevelBodyInterceptor,
            ...appLevelBodyInterceptor 
        });
    });

    test('Should fail when request duration exceed `requestTimeout` set in `RequestProvider`', async () => {
        fetchMock.mockResponse(async () => {
            jest.advanceTimersByTime(60)
            return {}
        })

        const { result: { current: [, makeRequest]} } = renderHook(
            () => useRequest(), 
            { wrapper: RequestWrapper({ baseUrl: GOOD_URL, requestTimeout: 50 })}
        );

        await act(() => makeRequest(''));
        
        await expect(fetchMock.mock.results[0].value).rejects
            .toThrow('The operation was aborted.');
    });

    test('should call `RequestProvider` `onError` callback when request fails', async () => {
        let errorResponse = {};

        const { result: { current: [, makeRequest]} } = renderHook(
            () => useRequest(), 
            { wrapper: RequestWrapper({ 
                baseUrl: BAD_URL,
                onError: (errorPayload) => {
                    errorResponse = errorPayload;
                }  
            })}
        );

        await act(() => makeRequest(''));

        expect(errorResponse).toStrictEqual(__BAD_RESPONSE__);
    });

    test('should show error popup on request error, if popup is returned in onError callback', async () => {
       const { result: { current: [, makeRequest]} } = renderHook(
            () => useRequest(), 
            { wrapper: RequestWrapper({ 
                baseUrl: BAD_URL,
                popupTimeout: 0.05,
                onError: (errorPayload) => {
                    return <MessagePopup message={errorPayload.body?.message}></MessagePopup>
                }  
            })}
        );

        await act(() => makeRequest(''));

        expect(await screen.findByText(__BAD_RESPONSE__.body.message))
            .toBeInTheDocument();
        jest.advanceTimersByTime(60)
        await waitFor(() => {
            expect(screen.queryByText(__BAD_RESPONSE__.body.message)).not.toBeInTheDocument()
        })
    });

    test('should call `RequestProvider` `onSuccess` callback when request succeed', async () => {
        let successResponse = {};

        const { result: { current: [, makeRequest]} } = renderHook(
            () => useRequest(), 
            { wrapper: RequestWrapper({ 
                baseUrl: GOOD_URL,
                onSuccess: (successPayload) => {
                    successResponse = successPayload;
                }  
            })}
        );

        await act(() => makeRequest(''));

        expect(successResponse).toStrictEqual(__MOCK_DATA__);
    });

    test('should show success popup on request success, if popup is returned in onSuccess callback', async () => {
        const { result: { current: [, makeRequest]} } = renderHook(
             () => useRequest(), 
             { wrapper: RequestWrapper({ 
                 baseUrl: GOOD_URL,
                 popupTimeout: 0.05,
                 onSuccess: (successPayload) => {
                     return <MessagePopup message={successPayload.body.data.message}></MessagePopup>
                 }  
             })}
         );
 
         await act(() => makeRequest(''));
 
        expect(await screen.findByText(__MOCK_DATA__.body.data.message))
            .toBeInTheDocument();
        jest.advanceTimersByTime(60);
        await waitFor(() => {
            expect(screen.queryByText(__MOCK_DATA__.body.data.message)).not.toBeInTheDocument()
        });
    });

    test('should show loader component, if loader component is returned in loading callback', async () => {
        jest.useRealTimers();
        const loadingMessage = "loading...";
        let loadingState = false;

        fetchMock.mockResponse(async () => {
            await delay(40);
            return {}
        });

        const { result: { current: [, makeRequest]} } = renderHook(
            () => useRequest(), 
            { wrapper: RequestWrapper({ 
                baseUrl: GOOD_URL,
                onLoading: (loading) => {
                    loadingState = loading;
                    return <MessagePopup message={loadingMessage}></MessagePopup>
                }  
            })}
        );
 
        await act(() => makeRequest(''));
 
        expect(loadingState).toBe(true);
        expect(await screen.findByText(loadingMessage)).toBeInTheDocument();

        jest.useFakeTimers()
        jest.advanceTimersByTime(30);

        await waitFor(() => {
            expect(screen.queryByText(loadingMessage)).not.toBeInTheDocument()
        });
        expect(loadingState).toBe(false);
    });
});