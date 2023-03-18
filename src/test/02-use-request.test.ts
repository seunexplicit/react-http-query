import { act, BAD_URL, GOOD_URL, renderHook, setupMockupRequest, __BAD_RESPONSE__, __MOCK_DATA__ } from "./test-util";
import fetchMock from "jest-fetch-mock";
import { useRequest } from "../lib";

fetchMock.enableMocks();
const mockedFetch = fetch as unknown as typeof fetchMock;

describe(`useRequest`, () => {
    beforeEach(() => {
        mockedFetch.resetMocks();
        setupMockupRequest();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should get reponse payload from `onSuccess` callback', async () => {
        let responsePayload: any;

        const { result } = renderHook(() => useRequest({
            onSuccess: (response) => {
                responsePayload = response;
            }
        }));

        const  [, makeRequest] = result.current;
        await  act(() => makeRequest(GOOD_URL));

        expect(responsePayload.body).toStrictEqual(__MOCK_DATA__.body);
    });

    test('should get error payload from `onError` callback', async () => {
        let errorPayload: any;

        const { result } = renderHook(() => useRequest({
            onError: (error) => {
                errorPayload = error;
            }
        }));

        const  [, makeRequest] = result.current;
        await  act(() => makeRequest(BAD_URL));

        expect(errorPayload).toStrictEqual(__BAD_RESPONSE__);
    });

    test('should intercept and update request method', async () => {
        const { result } = renderHook(() => useRequest({
            interceptors: {
                request: (payload) => {
                    return {
                        ...payload,
                        method: 'DELETE'
                    }
                }
            }
        }));

        const  [, makeRequest] = result.current;
        await  act(() => makeRequest(BAD_URL));

        expect(fetchMock.mock.lastCall[1]?.method).toBe('DELETE');
    });

    test('should intercept and update request body', async () => {
        const interceptorBody = { payload: 'intercept'}
        const { result } = renderHook(() => useRequest({
            interceptors: {
                request: (payload) => {
                    return {
                        ...payload,
                        body: interceptorBody
                    }
                }
            }
        }));

        const  [, makeRequest] = result.current;
        await  act(() => makeRequest(GOOD_URL, { body: { payload: 'original' } }));

        expect(fetchMock.mock.lastCall[1]?.body).toBe(JSON.stringify(interceptorBody));
    });

    test('should intercept and update request header', async () => {
        const interceptorHeader = { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer yHjj7hqwrekjj977aw'
        }
        const { result } = renderHook(() => useRequest({
            interceptors: {
                request: (payload) => {
                    return {
                        ...payload,
                        headers: interceptorHeader
                    }
                }
            }
        }));

        const  [, makeRequest] = result.current;
        await  act(() => makeRequest(GOOD_URL));

        expect(fetchMock.mock.lastCall[1]?.headers).toStrictEqual(interceptorHeader);
    });

    test('should intercept and update request query parameters', async () => {
        const interceptorQueryParams = { source: 'interceptor' };
        const query = { page: 1 };

        const { result } = renderHook(() => useRequest({
            interceptors: {
                request: (payload) => {
                    return {
                        ...payload,
                        queryParams: {
                            ...payload.queryParams,
                            ...interceptorQueryParams
                        }
                    }
                }
            }
        }));

        const  [, makeRequest] = result.current;
        await  act(() => makeRequest(GOOD_URL, { query }));

        expect(fetchMock.mock.calls[0][0]).toBe(`${GOOD_URL}?page=1&source=interceptor`);
    });

    test('should intercept and update response payload', async () => {
        const interceptorQueryParams = { source: 'interceptor' };
        const query = { page: 1 };

        const { result } = renderHook(() => useRequest({
            interceptors: {
                request: (payload) => {
                    return {
                        ...payload,
                        queryParams: {
                            ...payload.queryParams,
                            ...interceptorQueryParams
                        }
                    }
                }
            }
        }));

        const  [, makeRequest] = result.current;
        await  act(() => makeRequest(GOOD_URL, { query }));

        expect(fetchMock.mock.calls[0][0]).toBe(`${GOOD_URL}?page=1&source=interceptor`);
    });
});