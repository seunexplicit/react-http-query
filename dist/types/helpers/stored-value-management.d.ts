import { StoredValue } from '../model';
export declare const __STORAGE_NAME_PREFIX__ = "react-http-request";
interface SaveStoredValueArgs<T> {
    name?: string;
    value: StoredValue<T>;
    url: string;
}
export declare const retrieveStoredValue: <T>(url: string, storedMemoryState: Record<string, StoredValue<unknown> | undefined>, name: string | undefined) => StoredValue<T> | undefined;
export declare const getValueFromSession: <T>(name: string, url?: string) => StoredValue<T> | undefined;
export declare const getValueFromLocal: <T>(name: string, url?: string) => StoredValue<T> | undefined;
export declare const saveValueToSession: <T>(args: SaveStoredValueArgs<T>) => void;
export declare const saveValueToLocalStorage: <T>(args: SaveStoredValueArgs<T>) => void;
export declare const saveValueToMemory: <T>(args: SaveStoredValueArgs<T>, setState: React.Dispatch<React.SetStateAction<Record<string, StoredValue<unknown> | undefined>>>) => void;
export {};
