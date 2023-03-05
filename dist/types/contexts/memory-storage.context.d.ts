/// <reference types="react" />
import { MemoryStorageContextProps } from '../model';
declare const MemoryStorageContext: import("react").Context<MemoryStorageContextProps<unknown>>;
export default MemoryStorageContext;
interface MemoryStorageProviderProps {
    children: JSX.Element;
}
export declare const MemoryStorageProvider: React.FC<MemoryStorageProviderProps>;
