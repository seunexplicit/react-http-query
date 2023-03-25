import {
    renderHook,
    act,
    setupMockupRequest,
    GOOD_URL,
    RequestWrapper,
    UseRequestConfigWrapper,
    __MOCK_AUTH_TOKEN__,
} from './test-util';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('useRequestConfig', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        setupMockupRequest();
    });

    test('`setAuthToken` should set authToken used by the application', async () => {
        const { result } = renderHook(UseRequestConfigWrapper, {
            wrapper: RequestWrapper({ baseUrl: GOOD_URL }),
        });

        const [{ setAuthToken }] = result.current;
        await act(() => setAuthToken(__MOCK_AUTH_TOKEN__));
        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));

        expect(fetchMock.mock.calls[0][1]?.headers?.['Authorization']).toBe(`Bearer ${__MOCK_AUTH_TOKEN__}`);
    });

    test('`setBaseUrl` should set base URL used by the application', async () => {
        const newBaseUrl = 'http://new-base-url.com/';
        const { result } = renderHook(UseRequestConfigWrapper, {
            wrapper: RequestWrapper({ baseUrl: GOOD_URL }),
        });

        const [{ setBaseUrl }] = result.current;
        await act(() => setBaseUrl(newBaseUrl));
        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));

        expect(fetchMock.mock.calls[0][0]).toBe(newBaseUrl);
    });
});
