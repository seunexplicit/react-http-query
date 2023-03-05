/// <reference types="react" />
declare const useRequestConfig: () => {
    setAuthToken: import("react").Dispatch<import("react").SetStateAction<string>> | undefined;
    setBaseUrl: import("react").Dispatch<import("react").SetStateAction<string>> | undefined;
    loading: boolean;
};
export default useRequestConfig;
