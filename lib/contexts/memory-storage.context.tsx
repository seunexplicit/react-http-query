import { createContext, useState } from 'react';
import { MemoryStorageContextProps, StoredValue } from '../model';

const MemoryStorageContext = createContext<MemoryStorageContextProps<unknown>>({ storedData: {} });

export default MemoryStorageContext;

interface MemoryStorageProviderProps {
    children: JSX.Element;
}

export const MemoryStorageProvider: React.FC<MemoryStorageProviderProps> = ({ children }) => {
    const [storedData, setStoredData] = useState<Record<string, StoredValue<unknown> | undefined>>({});
    const [requestUpdate, setRequestUpdate] = useState<number>(0);

    return (
        <MemoryStorageContext.Provider
            value={{
                storedData,
                requestUpdate,
                setRequestUpdate,
                setStoredData,
            }}
        >
            {children}
        </MemoryStorageContext.Provider>
    );
};
