import { createContext, useState } from 'react';
import { RequestContextProps, RequestProviderProps } from '../index.d';
import { MemoryStorageProvider } from './memory-storage.context';
import { PrivateProvider } from './private.context';

const __DEFAULT_POPUP_TIMEOUT__ = 8;
const OUT_OF_REQUEST_CONTEXT_ERROR_MESSAGE = 'This method must be used within `react-http-query` `RequestContext`'

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
    const [successPopup, setSuccessPopup] = useState<React.ReactNode | undefined>();
    const [errorPopup, setErrorPopup] = useState<React.ReactNode | undefined>();
    const [loaderComponent, setLoaderComponent] = useState<React.ReactNode | undefined>();
    
    function dispatchErrorRequest<T>(errorPayload: T) {
        const popup = prop?.onError?.(errorPayload) ?? undefined;
        setErrorPopup(popup);
        if (popup) {

            setTimeout(() => 
                setErrorPopup(undefined), 
                (prop.popupTimeout || __DEFAULT_POPUP_TIMEOUT__) * 1000
            )
        }
    }

    function dispatchSuccessRequest<T>(errorPayload: T) {
        const popup = prop?.onSuccess?.(errorPayload) ?? undefined;
        setSuccessPopup(popup);

        if (popup) {
            setTimeout(() => 
                setSuccessPopup(undefined), 
                (prop.popupTimeout || __DEFAULT_POPUP_TIMEOUT__) * 1000
            )
        }
    }

    function dispatchLoadingState(state: boolean) {
        setLoading(state);
        const loader = prop?.onLoading?.(state) ?? undefined;
        setLoaderComponent(state ? loader : undefined);
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
                dispatchLoadingState={dispatchLoadingState} 
                dispatchSuccessRequest={dispatchSuccessRequest}
                dispatchErrorRequest={dispatchErrorRequest}
                requestInterceptor={prop?.interceptors?.request}
                responseInterceptor={prop?.interceptors?.response}
                requestTimeout={prop?.requestTimeout}>
                <>
                    {errorPopup && errorPopup}
                    {successPopup && successPopup}
                    {loaderComponent && loaderComponent}
                    {children}
                </>
            </PrivateProvider>
        </MemoryStorageProvider>
    </RequestContext.Provider>;
};
