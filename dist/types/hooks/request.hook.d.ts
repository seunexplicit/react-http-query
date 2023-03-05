import { IResponse, MakeRequest, UseRequestProps } from '../model';
export declare const useRequest: <T = any, E = unknown>(props?: UseRequestProps<T, E> | undefined) => [IResponse<T, E>, MakeRequest<T, E>];
