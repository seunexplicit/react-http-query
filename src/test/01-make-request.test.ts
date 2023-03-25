import { act, renderHook } from "@testing-library/react";
import { useRequest } from '../lib';
import { BAD_URL, GOOD_URL, setupMockupRequest, __BAD_RESPONSE__, __MOCK_DATA__ } from "./test-util";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
const mockedFetch = fetch as unknown as typeof fetchMock;

describe('makeRequest', () => {

    beforeEach(() => {
        mockedFetch.resetMocks();
        setupMockupRequest();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should make an API call', async () => {
        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const  [, makeRequest] = result.current;
        await act(() => makeRequest(GOOD_URL));
        const [{ data: { body }, success, error }, ] = result.current as any

        expect((body as any)?.data.name).toBe(__MOCK_DATA__.body.data.name);
        expect(success).toBe(true);
        expect(error).toBe(false);
        expect(fetch).toBeCalled()
    });

    test('should contain error body when request has error', async () => {
        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const  [, makeRequest] = result.current;
        await act(() => makeRequest(BAD_URL));
        const [{ data: { status }, success, error }, ] = result.current as any

        expect(status).toBe(__BAD_RESPONSE__.status);
        expect(success).toBe(false);
        expect(error).toBe(true);
        expect(fetch).toBeCalled()
    });

    test('should make a get request when no method and no body is passed', async () => {
        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const  [, makeRequest] = result.current;
        await act(async () => await makeRequest(GOOD_URL));

        expect(fetch).toBeCalled()
        expect(mockedFetch.mock.calls[0][1]?.method).toBe('GET');
    });

    test('should make a post request when body is passed and no method is passed', async () => {
        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const  [, makeRequest] = result.current;
        await act(async () => await makeRequest(GOOD_URL, { body: {} }));
        
        expect(fetch).toBeCalled()
        expect(mockedFetch.mock.calls[0][1]?.method).toBe('POST');
    });

    test('should make a request with the specified method', async () => {
        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const  [, makeRequest] = result.current;
        await act(async () => await makeRequest(GOOD_URL, { body: {}, method: 'PUT' }));
        
        expect(fetch).toBeCalled()
        expect(mockedFetch.mock.calls[0][1]?.method).toBe('PUT');
    });

    test('should convert data to FormData', async () => {
        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const  [, makeRequest] = result.current;
        await act(async () => await makeRequest(GOOD_URL, { formData: { data: 'form-data' } }));
        
        expect(fetch).toBeCalled()
        expect(mockedFetch.mock.calls[0][1]?.body instanceof FormData).toBe(true);
        expect((mockedFetch.mock.calls[0][1]?.body as any)?.get('data')).toBe("form-data");
        expect((mockedFetch.mock.calls[0][1]?.headers as any)['Content-Type']).toBeUndefined();
    });

    test('should make request with the given query parameters', async () => {
        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const query = { count: 0 };

        const  [, makeRequest] = result.current;
        await act(async () => await makeRequest(GOOD_URL, { query }));

        expect(mockedFetch).toBeCalled()
        expect(mockedFetch.mock.calls[0][0]).toBe(`${GOOD_URL}?count=0`);
    });

    test('should append to the header properties when properties is passed to header append object', async () => {
        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const additionalHeaderProps = { 'x-append': 'append-value' }

        const  [, makeRequest] = result.current;
        await act(async () => await makeRequest(GOOD_URL, 
            { header: { append: additionalHeaderProps } }
        ));

        expect(mockedFetch).toBeCalled()
        expect((mockedFetch.mock.calls[0][1]?.headers as any)['Content-Type'])
            .toBe('application/json');
        expect((mockedFetch.mock.calls[0][1]?.headers as any)['x-append'])
            .toBe(additionalHeaderProps['x-append']);
    });

    test('should override header properties when properties passed to header', async () => {
        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const header = { 'x-override': 'override-value' }

        const  [, makeRequest] = result.current;
        await act(async () => await makeRequest(GOOD_URL, 
            { header }
        ));

        expect(mockedFetch).toBeCalled()
        expect((mockedFetch.mock.calls[0][1]?.headers as any)['Content-Type'])
            .toBeUndefined();
        expect((mockedFetch.mock.calls[0][1]?.headers as any)['x-override'])
            .toBe(header['x-override']);
    });

    test('should throw error when request duration exceed passed timeout', async () => {
        mockedFetch.mockResponseOnce(async () => {
            jest.advanceTimersByTime(60)
            return {}
        })

        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const  [, makeRequest] = result.current;
        await act(async () => await makeRequest(GOOD_URL, { timeout: 50 }));

        await expect(mockedFetch.mock.results[0].value).rejects
            .toThrow('The operation was aborted.');
        expect(mockedFetch).toBeCalled();
    });

    test('should be successful when request duration is less than passed timeout', async () => {
        mockedFetch.mockResponseOnce(async () => {
            jest.advanceTimersByTime(50)
            return JSON.stringify(__MOCK_DATA__)
        })

        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const  [, makeRequest] = result.current;
        await act(async () => await makeRequest(GOOD_URL, { timeout: 60 }));
        const [{ data: { status } }, ] = result.current as any

        expect(status).toBe(__MOCK_DATA__.status);
        expect(mockedFetch).toBeCalled();
    });

    test('should make request the number of passed retries when there is a failure', async () => {
        mockedFetch.mockResponse(async () => {
            jest.advanceTimersByTime(60)
            return {}
        })

        const { result } = renderHook(useRequest, {
            initialProps: {}
        });

        const  [, makeRequest] = result.current;
        await act(() => makeRequest(GOOD_URL, { timeout: 50, retries: 3 }));

        expect(mockedFetch).toBeCalledTimes(3);
    });
})