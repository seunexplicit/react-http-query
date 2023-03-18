import { createContext } from "react";
import { InterceptorPayload, InterceptorResponsePayload } from "../index.d";

interface PrivateContextProps {
    requestTimeout?: number;
    dispatchErrorRequest?: (payload: any) => void;
    dispatchSuccessRequest?: (payload: any) => void;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    requestInterceptor?: (payload: InterceptorPayload) => InterceptorPayload;
    responseInterceptor?: (payload: InterceptorResponsePayload) => InterceptorResponsePayload;
}

const PrivateContext = createContext<PrivateContextProps>({});

export default PrivateContext;

interface PrivateProviderProps extends PrivateContextProps {
    children: JSX.Element,
}

export const PrivateProvider: React.FC<PrivateProviderProps> = ({ children, ...props }) => {
    return (
        <PrivateContext.Provider value={props}>
            {children}
        </PrivateContext.Provider>
    )
}