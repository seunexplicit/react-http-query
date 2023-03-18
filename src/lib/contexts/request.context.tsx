import { createContext, useRef, useState } from 'react';
import { InterceptorPayload, InterceptorResponsePayload } from '../index.d';
import { MemoryStorageProvider } from './memory-storage.context';
import { PrivateProvider } from './private.context';

const __DEFAULT_POPUP_TIMEOUT__ = 8;
const OUT_OF_REQUEST_CONTEXT_ERROR_MESSAGE = 'This method must be used within `react-http-query` `RequestContext`'

interface RequestProviderProps {
    /**
     * Authentication token to be added to the request header's Authorization Bearer
     */
    authToken?: string;
    /** Request delay duration `(in ms)` before cancelling request */
    requestTimeout?: number;
    /** 
     * Base url that would be append to path for every request. 
     * If an absolute url is provider, base url would not be append to it. 
     */
    baseUrl: string;
    children?: React.ReactNode;
    /** 
     * App level request success callback, it returns the success payload.
     * An optional alert component can be returned that is displayed within {@linkcode RequestProviderProps.popupTimeout}  
     */
    onSuccess?: (successPayload: any) => React.ReactNode | undefined;
    /** 
     * App level request error callback, it returns the error payload.
     * An optional alert component can be returned that is displayed within {@linkcode RequestProviderProps.popupTimeout}  
     */
    onError?: (errorPayload: any) => React.ReactNode | undefined;
    /** 
     * Callback that indicate when request is in progress. Returns `true` when in progress and `false` otherwise.
     * An optional loader component can be returned, to be displayed whenever request is in progress.
     */
    onLoading?: (state: boolean) => React.ReactNode | undefined;
    /** App level interceptors */
    interceptors?: {
        /** Intercept request object */
        request?: (payload: InterceptorPayload) => InterceptorPayload;
        /** Intercept response object */
        response?: (payload: InterceptorResponsePayload) => InterceptorResponsePayload;
    };
    /** Display timeout (in seconds) for error or success popup if available. Default to `8s` */
    popupTimeout?: number;
}

interface RequestContextProps {
    baseUrl: string;
    loading: boolean;
    authToken?: string;
    setBaseUrl: React.Dispatch<React.SetStateAction<string>>;
    setAuthToken: React.Dispatch<React.SetStateAction<string>>;
}

const RequestContext = createContext<RequestContextProps>({
    loading: false,
    baseUrl: '', 
    setAuthToken: () => { 
        throw Error(OUT_OF_REQUEST_CONTEXT_ERROR_MESSAGE); 
    },
    setBaseUrl: () => { 
        throw Error(OUT_OF_REQUEST_CONTEXT_ERROR_MESSAGE);
    },  
});

export default RequestContext;

export const RequestProvider: React.FC<RequestProviderProps> = ({children, ...prop}) => {
    const [baseUrl, setBaseUrl] = useState(prop.baseUrl);
    const [authToken, setAuthToken] = useState(prop.authToken || '');
    const [loading, setLoading] = useState(false);
    const successPopupComp = useRef<React.ReactNode | undefined>();
    const errorPopupComp = useRef<React.ReactNode | undefined>();
    
    function dispatchErrorRequest<T>(errorPayload: T) {
        errorPopupComp.current = prop?.onError?.(errorPayload);
        if (errorPopupComp.current) {
            setTimeout(() => 
                errorPopupComp.current = undefined, 
                (prop.popupTimeout || __DEFAULT_POPUP_TIMEOUT__) * 1000
            )
        }
    }

    function dispatchSuccessRequest<T>(errorPayload: T) {
        successPopupComp.current = prop?.onSuccess?.(errorPayload);
        if (successPopupComp.current) {
            setTimeout(() => 
                successPopupComp.current = undefined, 
                (prop.popupTimeout || __DEFAULT_POPUP_TIMEOUT__) * 1000
            )
        }
    }

    return <RequestContext.Provider 
        value={{
            baseUrl, 
            setBaseUrl, 
            authToken,
            setAuthToken,
            loading,
        }}>
        <MemoryStorageProvider>
            <PrivateProvider 
                setLoading={setLoading} 
                dispatchSuccessRequest={dispatchSuccessRequest}
                dispatchErrorRequest={dispatchErrorRequest}
                requestInterceptor={prop?.interceptors?.request}
                responseInterceptor={prop?.interceptors?.response}
                requestTimeout={prop?.requestTimeout}>
                <>
                    {errorPopupComp.current || <></>}
                    {successPopupComp.current || <></>}
                    {children}
                </>
            </PrivateProvider>
        </MemoryStorageProvider>
    </RequestContext.Provider>;
};
