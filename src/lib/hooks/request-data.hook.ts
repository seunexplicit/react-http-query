import MemoryStorageContext from '../contexts/memory-storage.context';
import {
    __STORAGE_NAME_PREFIX__,
    getValueFromLocal,
    getValueFromSession,
    retrieveStoredValue
} from '../helpers/stored-value-management';
import { useContext, useEffect, useState } from 'react';
import { StorageType } from '../index.d';

export const useRequestData = <T>(name: string, storageLocation?: StorageType) => {
    const [ data, setData ] = useState<T>();
    const { storedData, requestUpdate } = useContext(MemoryStorageContext);

    useEffect(() => {
        if (storageLocation === 'session') setData(getValueFromSession<T>(name)?.data)
        else if (storageLocation === 'local') setData(getValueFromLocal<T>(name)?.data)
        else if (storageLocation === 'memory') {
            setData(storedData?.[`${__STORAGE_NAME_PREFIX__}-${name}`])
        }
        else setData(retrieveStoredValue<T>('', storedData, name)?.data)
    }, [name, storageLocation, storedData, requestUpdate]);

    return data;
}