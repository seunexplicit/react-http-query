import { createContext } from 'react';
import { InterceptorPayload, InterceptorResponsePayload } from '../index.d';

interface PrivateContextProps {
    baseUrl?: string;
    loading: boolean;
    authToken?: string;
    requestTimeout?: number;
    dispatchErrorRequest?: (payload: any) => void;
    dispatchSuccessRequest?: (payload: any) => void;
    dispatchLoadingState?: (state: boolean) => void;
    setBaseUrl?: React.Dispatch<React.SetStateAction<string>>;
    setAuthToken?: React.Dispatch<React.SetStateAction<string>>;
    requestInterceptor?: (payload: InterceptorPayload) => InterceptorPayload;
    responseInterceptor?: (payload: InterceptorResponsePayload) => InterceptorResponsePayload;
}

const PrivateContext = createContext<PrivateContextProps>({ loading: false });

export default PrivateContext;

interface PrivateProviderProps extends PrivateContextProps {
    children: JSX.Element;
}

export const PrivateProvider: React.FC<PrivateProviderProps> = ({ children, ...props }) => {
    return <PrivateContext.Provider value={props}>{children}</PrivateContext.Provider>;
};
