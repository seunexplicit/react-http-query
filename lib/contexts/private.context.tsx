import { createContext } from 'react';
import { PrivateContextProps } from '../model';

const PrivateContext = createContext<PrivateContextProps>({ loading: false });

export default PrivateContext;

interface PrivateProviderProps extends PrivateContextProps {
    children: JSX.Element;
}

export const PrivateProvider: React.FC<PrivateProviderProps> = ({ children, ...props }) => {
    return <PrivateContext.Provider value={props}>{children}</PrivateContext.Provider>;
};
