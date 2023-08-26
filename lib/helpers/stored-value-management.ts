import RequestHandler from '../handler/request-handler';
import { IRequestData, InterceptorPayload, StoredValue } from '../model';

export const __STORAGE_NAME_PREFIX__ = 'react-http-request';
interface SaveStoredValueArgs<T> {
    name?: string;
    value: StoredValue<T>;
    url: string;
}

export const retrieveStoredValue = <T>(
    url: string,
    storedMemoryState: Record<string, StoredValue<unknown> | undefined>,
    name: string | undefined
): StoredValue<T> | undefined => {
    const nameValue = `${__STORAGE_NAME_PREFIX__}-${name || url}`;
    const value = storedMemoryState?.[nameValue];
    if (typeof value !== 'undefined') return value as StoredValue<T>;
    return getValueFromSession(name ?? '', url) ?? getValueFromLocal(name ?? '', url);
};

export const getValueFromSession = <T>(name: string, url = ''): StoredValue<T> | undefined => {
    const value = sessionStorage.getItem(`${__STORAGE_NAME_PREFIX__}-${name || url}`);
    return parseValue(value);
};

export const getValueFromLocal = <T>(name: string, url = ''): StoredValue<T> | undefined => {
    const value = localStorage.getItem(`${__STORAGE_NAME_PREFIX__}-${name || url}`);
    return parseValue(value);
};

const parseValue = (value: string | null) => {
    if (value !== null) return JSON.parse(value);
    return undefined;
};

export const saveValueToSession = <T>(args: SaveStoredValueArgs<T>) => {
    const nameValue = `${__STORAGE_NAME_PREFIX__}-${args.name || args.url}`;
    sessionStorage.setItem(nameValue, JSON.stringify(args.value));
};

export const saveValueToLocalStorage = <T>(args: SaveStoredValueArgs<T>) => {
    const nameValue = `${__STORAGE_NAME_PREFIX__}-${args.name || args.url}`;
    localStorage.setItem(nameValue, JSON.stringify(args.value));
};

export const saveValueToMemory = <T>(
    args: SaveStoredValueArgs<T>,
    setState: React.Dispatch<React.SetStateAction<Record<string, StoredValue<unknown> | undefined>>>
) => {
    const nameValue = `${__STORAGE_NAME_PREFIX__}-${args.name || args.url}`;
    setState((previousValue) => ({ ...previousValue, [nameValue]: args.value }));
};

export const storeValue = (
    requestData: IRequestData['data'],
    payload: InterceptorPayload,
    requestHandler: RequestHandler
) => {
    const { name, setStateData, localStorage, sessionStorage, setRequestUpdate, memoryStorage } =
        requestHandler.getDependency();

    const valueToStore = {
        name,
        url: payload.url,
        value: { data: requestData, queryParam: payload.queryParams },
    };
    if (memoryStorage && setStateData) {
        saveValueToMemory(valueToStore, setStateData);
    }
    if (sessionStorage) saveValueToSession(valueToStore);
    if (localStorage) saveValueToLocalStorage(valueToStore);

    setRequestUpdate?.((initialValue) => ++initialValue);
};
