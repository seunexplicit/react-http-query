import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import { GOOD_URL, BAD_URL,  __MOCK_DATA__, __BAD_RESPONSE__, renderHook, RequestWrapper, act } from "./test-util";
import { useRequest } from '../lib';

const mockAxios = new axiosMockAdapter(axios);

describe('Axios', () => {
    beforeEach(() => {
        mockAxios.onAny(new RegExp(`${GOOD_URL}*`)).reply(200, __MOCK_DATA__)
            .onAny(new RegExp(`${BAD_URL}*`)).reply(400, __BAD_RESPONSE__);
        
    });

    afterEach(() => {
        mockAxios.reset();
    });

    test('should make call with axios sucessfully', async () => {
        const { result: {  current: [, makeRequest] } } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                axiosInstance: axios
            }),
        });

        await act(() => makeRequest(GOOD_URL));

        expect(mockAxios.history.get[0].url).toBe(GOOD_URL);
    });

    test('should make call with the correct parameters', async () => {
        const { result } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                axiosInstance: axios
            }),
        });

        const body = { data: 1 };
        const [, makeRequest ] = result.current;
        await act(() => makeRequest(GOOD_URL, { 
            query: { search: "searchText" }, body
        }));

        expect(mockAxios.history.post[0].url).toBe(`${GOOD_URL}?search=searchText`);
        expect(mockAxios.history.post[0].data).toBe(JSON.stringify(body));
    })

    test('should return the correct success response', async () => {
        const { result } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                axiosInstance: axios
            }),
        });

        const body = { data: 1 };
        const [, makeRequest ] = result.current;
        await act(() => makeRequest(GOOD_URL, { body }));

        const [{ data, status }] = result.current;

        expect(data).toStrictEqual(__MOCK_DATA__);
        expect(status).toBe(200)
        expect(mockAxios.history.post[0].data).toBe(JSON.stringify(body));
    })

    test('should return the correct error response', async () => {
        const { result } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({
                axiosInstance: axios
            }),
        });

        const body = { data: 1 };
        const [, makeRequest ] = result.current;
        await act(() => makeRequest(BAD_URL, { body }));

        const [{ data, status }] = result.current;

        expect(data).toStrictEqual(__BAD_RESPONSE__);
        expect(status).toBe(400)
        expect(mockAxios.history.post[0].data).toBe(JSON.stringify(body));
    });

    test('should use the configured axios instance configuration', async () => {
        const bearerToken = 'temp_token';

        const axiosInstance = axios.create({
            baseURL: GOOD_URL,
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            },
        });

        const { result } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({ axiosInstance })
        });

        const body = { data: 1 };
        const [, makeRequest ] = result.current;
        await act(() => makeRequest('/sample_path', { body }));

        const [{ data, status }] = result.current;
        const postRequestConfig = mockAxios.history.post[0];

        expect(data).toStrictEqual(__MOCK_DATA__);
        expect(postRequestConfig.baseURL).toBe(GOOD_URL)
        expect(postRequestConfig.url).toBe('/sample_path')
        expect(status).toBe(200)
        expect(postRequestConfig.headers.Authorization).toBe(`Bearer ${bearerToken}`);
    });

    test('should correctly merge request headers configuration', async () => {
        const bearerToken = 'axios_token';
        const extraHeaders = 'X-Requested-With';

        const axiosInstance = axios.create({
            baseURL: GOOD_URL,
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'X_XTRA_HEADER': extraHeaders
            },
        });

        const { result } = renderHook(() => useRequest(), {
            wrapper: RequestWrapper({ axiosInstance })
        });

        const makeRequestBearerToken = 'make_request_token';
        const [, makeRequest ] = result.current;
        await act(() => makeRequest('', { 
            header: { 'Authorization': `Bearer ${makeRequestBearerToken}` } 
        }));
        const postRequestConfig = mockAxios.history.get[0];

        expect(postRequestConfig.baseURL).toBe(GOOD_URL)
        expect(postRequestConfig.headers.Authorization).toBe(`Bearer ${makeRequestBearerToken}`);
        expect(postRequestConfig.headers['X_XTRA_HEADER']).toBe(extraHeaders);
    });

})