import { useContext } from 'react';
import PrivateContext from '../contexts/private.context';

const useRequestConfig = () => {
    const { setAuthToken, setBaseUrl, loading } = useContext(PrivateContext);
    return { setAuthToken, setBaseUrl, loading };
};

export default useRequestConfig;
