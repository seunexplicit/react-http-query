import createFormData from '../helpers/create-form-data';
import objectDeepEqual from '../helpers/object-deep-equal';
import {
    fetchRequest,
    generatePath,
    getEnumerableProperties,
    getInitialState,
    getRequestAbortter,
    requestHeaderBuilder,
} from '../helpers/request.helper';
import {
    retrieveStoredValue,
    saveValueToLocalStorage,
    saveValueToMemory,
    saveValueToSession,
} from '../helpers/stored-value-management';
import {
    BodyRequestPayload,
    FormDataRequestPayload,
    GetRequestPayload,
    HandlerDependency,
    InterceptorPayload,
    InterceptorResponsePayload,
    IRequestHandler,
    IResponse,
    MakeRequest,
    RequestMethod,
} from '../model';

export default class RequestHandler<T, E> implements IRequestHandler<T, E> {
    private dependency: HandlerDependency<T, E> = {
        stateData: {},
    };

    private responsePayload: IResponse<T, E> = { ...getInitialState };
    private retryCount = 1;

    constructor(
        private setRequestState: React.Dispatch<React.SetStateAction<[IResponse<T, E>, MakeRequest<T, E>]>>
    ) {}

    setDependency(dependency: typeof this.dependency) {
        this.dependency = { ...this.dependency, ...dependency };
    }

    private isLoading() {
        this.responsePayload = { ...this.responsePayload, loading: true };
    }

    get requestMethod(): RequestMethod {
        return this.dependency.method || (this.dependency.body || this.dependency.formData ? 'POST' : 'GET');
    }

    get requestUrl(): string {
        return generatePath(
            this.dependency.path ?? '',
            this.dependency.baseUrl || this.dependency.appLevelBaseUrl,
            this.dependency.isRelative
        );
    }

    private get requestHeader(): Record<string, string> {
        const [headers, overridesHeaders] = requestHeaderBuilder(
            this.dependency.bearer ?? true,
            this.dependency.authToken,
            this.dependency.header
        );

        !overridesHeaders && this.dependency.formData && delete headers['Content-Type'];
        return headers;
    }

    private get requestPayload(): InterceptorPayload {
        const formData = this.dependency.formData && createFormData(this.dependency.formData);

        return {
            headers: this.requestHeader,
            method: this.requestMethod,
            queryParams: this.dependency.query,
            url: this.requestUrl,
            body: formData ?? this.dependency.body,
        };
    }

    private async getResponse(response: Response): Promise<InterceptorResponsePayload> {
        const responseBody = JSON.parse((await response.text()) || '{}');

        return Object.defineProperties(
            {},
            {
                url: getEnumerableProperties(this.requestUrl),
                method: getEnumerableProperties(this.requestMethod),
                status: getEnumerableProperties(response.status),
                data: getEnumerableProperties(responseBody, true),
                queryParams: getEnumerableProperties(this.dependency.query),
            }
        ) as InterceptorResponsePayload;
    }

    private setSuccessResponse(data: any, message: string = '') {
        this.responsePayload = {
            ...this.responsePayload,
            data,
            message: this.dependency.successMessage || (data as any).message || message,
            loading: false,
            success: true,
            error: false,
        };

        this.setRequestState((initialState) => {
            Object.assign(initialState, { 0: this.responsePayload });
            return initialState;
        });
        this.dependency.dispatchLoadingState?.(false);
        this.dependency.dispatchSuccessRequest?.(data);
        this.dependency.onSuccess?.(data);
    }

    private setErrorResponse(data: any, message: string = '') {
        this.responsePayload = {
            ...this.responsePayload,
            data,
            message:
                this.dependency.errorMessage ||
                data?.error ||
                data?.message ||
                data?.error?.message ||
                data?.error?.error ||
                message,
            loading: false,
            success: false,
            error: true,
        };

        this.setRequestState((initialState) => {
            Object.assign(initialState, { 0: this.responsePayload });
            return initialState;
        });
        this.dependency.dispatchLoadingState?.(false);
        this.dependency.dispatchErrorRequest?.(data);
        this.dependency.onError?.(data);
    }

    private async initRequest() {
        try {
            this.dependency.dispatchLoadingState?.(true);
            this.isLoading();

            // if response was cached return cached response.
            if (!this.dependency.forceRefetch) {
                const storedValue = retrieveStoredValue<T>(
                    this.requestUrl,
                    this.dependency.stateData,
                    this.dependency.name
                );
                if (storedValue && objectDeepEqual(storedValue.queryParam, this.dependency.query)) {
                    this.setSuccessResponse(storedValue.data);
                    return;
                }
            }

            let payload = this.requestPayload;
            payload = this.dependency.appLevelInterceptor?.request?.(payload) ?? payload;
            payload = this.dependency.interceptors?.request?.(payload) ?? payload;

            const { controller, timeoutRef } =
                getRequestAbortter(this.dependency.timeout ?? this.dependency.appLevelTimeout) ?? {};
            const response = await fetchRequest(payload, this.dependency, controller);

            if (timeoutRef) clearTimeout(timeoutRef);

            const responsePayload = await this.getResponse(response);

            responsePayload.data =
                this.dependency.appLevelInterceptor?.response?.(responsePayload)?.data ??
                responsePayload?.data;
            responsePayload.data =
                this.dependency.interceptors?.response?.(responsePayload)?.data ?? responsePayload?.data;

            if (response.ok) {
                const valueToStore = {
                    name: this.dependency.name,
                    url: payload.url,
                    value: { data: responsePayload.data, queryParam: payload.queryParams },
                };
                if (this.dependency.memoryStorage && this.dependency.setStateData) {
                    saveValueToMemory(valueToStore, this.dependency.setStateData);
                }
                if (this.dependency.sessionStorage) saveValueToSession(valueToStore);
                if (this.dependency.localStorage) saveValueToLocalStorage(valueToStore);

                this.dependency.setRequestUpdate?.((initialValue) => ++initialValue);
                this.setSuccessResponse(responsePayload.data, response.statusText);
            } else {
                this.setErrorResponse(responsePayload);
            }
        } catch (err: any) {
            if (this.retryCount > 1) {
                this.retryCount = --this.retryCount;
                await this.initRequest();
            }

            this.setErrorResponse(err, 'An error occur.');
        }
    }

    async makeRequest(
        path: string,
        config?: GetRequestPayload | BodyRequestPayload | FormDataRequestPayload
    ) {
        // Stop concurrent requests
        if (!this.responsePayload.loading) {
            this.dependency = { ...this.dependency, ...config, path };
            this.retryCount = config?.retries || this.retryCount;
            await this.initRequest();
        }
        return this.responsePayload.data;
    }
}
