import MemoryStorageContext from '../contexts/memory-storage.context';
import {
    __STORAGE_NAME_PREFIX__,
    getValueFromLocal,
    getValueFromSession,
    retrieveStoredValue,
} from '../helpers/stored-value-management';
import { useContext, useEffect, useState } from 'react';
import { IRequestData, StorageType } from '../model';

export const useRequestData = <T>(name: string, storageLocation?: StorageType) => {
    const [data, setData] = useState<T>();
    const { storedData, requestUpdate } = useContext(MemoryStorageContext);

    useEffect(() => {
        if (storageLocation === 'session')
            setData(getValueFromSession<IRequestData<T>['data']>(name)?.data.data);
        else if (storageLocation === 'local')
            setData(getValueFromLocal<IRequestData<T>['data']>(name)?.data.data);
        else if (storageLocation === 'memory') {
            setData(storedData?.[`${__STORAGE_NAME_PREFIX__}-${name}`]?.data as any);
        } else setData(retrieveStoredValue<IRequestData<T>['data']>('', storedData, name)?.data.data);
    }, [name, storageLocation, storedData, requestUpdate]);

    return data;
};
