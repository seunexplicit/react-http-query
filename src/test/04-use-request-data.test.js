import {
    mockWindowProperty,
    renderHook,
    act,
    setupMockupRequest,
    UseRequestDataWrapper,
    GOOD_URL,
    RequestWrapper,
    __MOCK_DATA__,
} from './test-util';
import fetchMock from 'jest-fetch-mock';
import StorageMock from './mock-storage';

fetchMock.enableMocks();

describe('useRequestData', () => {
    mockWindowProperty('localStorage', new StorageMock());
    mockWindowProperty('sessionStorage', new StorageMock());

    beforeEach(() => {
        fetchMock.resetMocks();
        setupMockupRequest();
        localStorage.clear();
        sessionStorage.clear();
    });

    test('Should retrieve data from memory if request data is saved to memory', async () => {
        const requestName = 'memory-storage';
        const { result } = renderHook(
            () => UseRequestDataWrapper({ storage: 'memory', name: requestName, lookupName: requestName }),
            { wrapper: RequestWrapper({ baseUrl: GOOD_URL }) }
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));

        expect(result.current[0]).toStrictEqual(__MOCK_DATA__);
    });

    test(`Should retrieve data from "sessionStorage" if request data is saved to 
    "sessionStorage"`, async () => {
        const requestName = 'session-storage';
        const { result } = renderHook(
            () => UseRequestDataWrapper({ storage: 'session', name: requestName, lookupName: requestName }),
            { wrapper: RequestWrapper({ baseUrl: GOOD_URL }) }
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));

        expect(result.current[0]).toStrictEqual(__MOCK_DATA__);
    });

    test('Should retrieve data from `localStorage` if request data is saved to `localStorage`', async () => {
        const requestName = 'local-storage';
        const { result } = renderHook(
            () => UseRequestDataWrapper({ storage: 'local', name: requestName, lookupName: requestName }),
            { wrapper: RequestWrapper({ baseUrl: GOOD_URL }) }
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));

        expect(result.current[0]).toStrictEqual(__MOCK_DATA__);
    });

    test('Should return undefined when a storage not stored into is specified', async () => {
        const requestName = 'local-storage';
        const { result } = renderHook(
            () =>
                UseRequestDataWrapper({
                    storage: 'local',
                    name: requestName,
                    lookupStorage: 'session',
                    lookupName: requestName,
                }),
            { wrapper: RequestWrapper({ baseUrl: GOOD_URL }) }
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));

        expect(result.current[0]).toBeUndefined();
    });

    test('Should return undefined when a non existing request name is specified', async () => {
        const { result } = renderHook(
            () =>
                UseRequestDataWrapper({
                    storage: 'local',
                    name: 'local-storage',
                    lookupStorage: 'local',
                    lookupName: 'session-storage',
                }),
            { wrapper: RequestWrapper({ baseUrl: GOOD_URL }) }
        );

        const [, makeRequest] = result.current;
        await act(() => makeRequest(''));

        expect(result.current[0]).toBeUndefined();
    });
});
