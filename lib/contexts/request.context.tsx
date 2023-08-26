import { createContext, useMemo, useState } from 'react';
import { IRequestData, RequestProviderProps } from '../model';
import { MemoryStorageProvider } from './memory-storage.context';
import { PrivateProvider } from './private.context';

const __DEFAULT_POPUP_TIMEOUT__ = 8;

const RequestContext = createContext({});

export default RequestContext;

export const RequestProvider: React.FC<RequestProviderProps> = ({ children, ...prop }) => {
    const [baseUrl, setBaseUrl] = useState(prop.baseUrl);
    const [authToken, setAuthToken] = useState(prop.authToken || '');
    const [loading, setLoading] = useState(false);
    const [successPopup, setSuccessPopup] = useState<React.ReactNode | undefined>();
    const [errorPopup, setErrorPopup] = useState<React.ReactNode | undefined>();
    const [loaderComponent, setLoaderComponent] = useState<React.ReactNode | undefined>();

    function dispatchErrorRequest<T>(errorPayload: IRequestData<T>['data'], showError: boolean = true) {
        const popup = prop?.onError?.(errorPayload) ?? undefined;

        if (!showError) return;

        setErrorPopup(popup);
        if (popup) {
            setTimeout(
                () => setErrorPopup(undefined),
                (prop.popupTimeout ?? __DEFAULT_POPUP_TIMEOUT__) * 1000
            );
        }
    }

    function dispatchSuccessRequest<T>(errorPayload: IRequestData<T>['data'], showSuccess: boolean = true) {
        const popup = prop?.onSuccess?.(errorPayload) ?? undefined;

        if (!showSuccess) return;

        setSuccessPopup(popup);
        if (popup) {
            setTimeout(
                () => setSuccessPopup(undefined),
                (prop.popupTimeout ?? __DEFAULT_POPUP_TIMEOUT__) * 1000
            );
        }
    }

    function dispatchLoadingState(state: boolean, showLoader: boolean = true) {
        setLoading(state);
        const loader = prop?.onLoading?.(state) ?? undefined;

        if (!showLoader) return;
        setLoaderComponent(state ? loader : undefined);
    }

    const value = useMemo(
        () => ({ baseUrl, setBaseUrl, authToken, setAuthToken, loading }),
        [baseUrl, setBaseUrl, authToken, setAuthToken, loading]
    );

    return (
        <RequestContext.Provider value={value}>
            <MemoryStorageProvider>
                <PrivateProvider
                    loading={loading}
                    baseUrl={baseUrl}
                    authToken={authToken}
                    setBaseUrl={setBaseUrl}
                    setAuthToken={setAuthToken}
                    requestTimeout={prop?.requestTimeout}
                    dispatchLoadingState={dispatchLoadingState}
                    dispatchErrorRequest={dispatchErrorRequest}
                    dispatchSuccessRequest={dispatchSuccessRequest}
                    requestInterceptor={prop?.interceptors?.request}
                    responseInterceptor={prop?.interceptors?.response}
                    axiosInstance={prop?.axiosInstance}
                >
                    <>
                        {errorPopup}
                        {successPopup}
                        {loaderComponent}
                        {children}
                    </>
                </PrivateProvider>
            </MemoryStorageProvider>
        </RequestContext.Provider>
    );
};
