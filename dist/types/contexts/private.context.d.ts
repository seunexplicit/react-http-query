/// <reference types="react" />
import { PrivateContextProps } from '../model';
declare const PrivateContext: import("react").Context<PrivateContextProps>;
export default PrivateContext;
interface PrivateProviderProps extends PrivateContextProps {
    children: JSX.Element;
}
export declare const PrivateProvider: React.FC<PrivateProviderProps>;
