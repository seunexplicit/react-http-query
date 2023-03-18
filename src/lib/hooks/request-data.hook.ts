import MemoryStorageContext from '../contexts/memory-storage.context';
import {
    __STORAGE_NAME_PREFIX__,
    getValueFromLocal,
    getValueFromSession,
    retrieveStoredValue
} from '../helpers/stored-value-management';
import { useContext, useEffect, useState } from 'react';

export const useRequestData = <T>(name: string, storageLocation?: 'memory' | 'session' | 'local') => {
    const [ data, setData ] = useState<T>();
    const { storedData, requestUpdate } = useContext(MemoryStorageContext);

    useEffect(() => {
        if (storageLocation === 'session') setData(getValueFromSession<T>(name)?.data)
        if (storageLocation === 'local') setData(getValueFromLocal<T>(name)?.data)
        if (storageLocation === 'memory') {
            setData(storedData?.[`${__STORAGE_NAME_PREFIX__}-${name}`])
        }
        setData(retrieveStoredValue<T>('', storedData, name)?.data)
    }, [name, storageLocation, storedData, requestUpdate]);

    return data;
}