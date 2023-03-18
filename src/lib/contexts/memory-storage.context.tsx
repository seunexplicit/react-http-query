import { createContext, useState } from "react";

interface MemoryStorageContextProps {
    setStoredData?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    storedData?: Record<string, any>;
    setRequestUpdate?: React.Dispatch<React.SetStateAction<number>>;
    requestUpdate?: number;   
}

const MemoryStorageContext = createContext<MemoryStorageContextProps>({});

export default MemoryStorageContext;

interface MemoryStorageProviderProps {
    children: JSX.Element;
}

export const MemoryStorageProvider: React.FC<MemoryStorageProviderProps>  = ({children}) => {
    const [ storedData, setStoredData ] = useState<Record<string, any>>();
    const [requestUpdate, setRequestUpdate] = useState<number>(0);

    return (
        <MemoryStorageContext.Provider 
            value={{
                storedData, 
                requestUpdate, 
                setRequestUpdate, 
                setStoredData
                }}>
            {children}
        </MemoryStorageContext.Provider>
    );
}