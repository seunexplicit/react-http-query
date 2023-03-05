/// <reference types="react" />
import { BodyRequestPayload, FormDataRequestPayload, GetRequestPayload, IRequestHandler, IResponse, MakeRequest, RequestMethod } from '../model';
export default class RequestHandler<T, E> implements IRequestHandler<T, E> {
    private setRequestState;
    private dependency;
    private responsePayload;
    private retryCount;
    constructor(setRequestState: React.Dispatch<React.SetStateAction<[IResponse<T, E>, MakeRequest<T, E>]>>);
    setDependency(dependency: typeof this.dependency): void;
    private isLoading;
    get requestMethod(): RequestMethod;
    get requestUrl(): string;
    private get requestHeader();
    private get requestPayload();
    private getResponse;
    private setSuccessResponse;
    private setErrorResponse;
    private initRequest;
    makeRequest(path: string, config?: GetRequestPayload | BodyRequestPayload | FormDataRequestPayload): Promise<T | E | null | undefined>;
}
