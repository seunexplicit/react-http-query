import { makeAxiosRequest } from '../helpers/axios-request';
import createFormData from '../helpers/create-form-data';
import { makeFetchRequest } from '../helpers/fetch-request';
import objectDeepEqual from '../helpers/object-deep-equal';
import {
    generatePath,
    getEnumerableProperties,
    getErrorMessage,
    getInitialState,
    getRequestAbortter,
    requestHeaderBuilder,
} from '../helpers/request.helper';
import { retrieveStoredValue, storeValue } from '../helpers/stored-value-management';
import {
    BodyRequestPayload,
    FormDataRequestPayload,
    GetRequestPayload,
    HandlerDependency,
    InterceptorPayload,
    InterceptorResponsePayload,
    IRequestData,
    IRequestHandler,
    IResponse,
    MakeRequest,
    RequestMethod,
} from '../model';

type StateSetter<T> = React.Dispatch<React.SetStateAction<[IResponse<T>, MakeRequest<T>]>>;

export default class RequestHandler<T = any> implements IRequestHandler<T> {
    private dependency: HandlerDependency<T> = {
        stateData: {},
    };

    private responsePayload: IResponse<T> = { ...getInitialState };
    private retryCount = 1;
    private stateSetter: StateSetter<T> | null = null;

    constructor() {}

    setDependency(dependency: typeof this.dependency) {
        this.dependency = { ...this.dependency, ...dependency };
    }

    getDependency() {
        return this.dependency;
    }

    private isLoading() {
        this.responsePayload = { ...this.responsePayload, loading: true };
    }

    get requestMethod(): RequestMethod {
        const { method, body, formData } = this.dependency.requestConfig ?? {};

        return method || ((body || formData) ? 'POST' : 'GET');
    }

    get requestUrl(): string {
        return generatePath(
            this.dependency.path ?? '',
            this.dependency.baseUrl || this.dependency.appLevelBaseUrl,
            this.dependency.requestConfig?.isRelative
        );
    }

    private get requestHeader(): Record<string, string> {
        const [headers, overridesHeaders] = requestHeaderBuilder(
            this.dependency.requestConfig?.bearer ?? true,
            this.dependency.authToken,
            this.dependency.requestConfig?.header
        );

        console.log({ headers, overridesHeaders });
        !overridesHeaders && this.dependency.requestConfig?.formData && delete headers['Content-Type'];
        return headers;
    }

    private get requestPayload(): InterceptorPayload {
        const formData =
            this.dependency.requestConfig?.formData &&
            createFormData(this.dependency.requestConfig?.formData);

        return {
            headers: this.requestHeader,
            method: this.requestMethod,
            queryParams: this.dependency.requestConfig?.query,
            url: this.requestUrl,
            body: formData ?? this.dependency.requestConfig?.body,
        };
    }

    private refetch() {
        return this.makeRequest(this.dependency.path ?? '', this.dependency.requestConfig);
    }

    private async getResponse(response: IRequestData): Promise<InterceptorResponsePayload> {
        return Object.defineProperties(
            {},
            {
                url: getEnumerableProperties(this.requestUrl),
                method: getEnumerableProperties(this.requestMethod),
                status: getEnumerableProperties(response.data?.status),
                data: getEnumerableProperties(response.data?.data, true),
                headers: getEnumerableProperties(response.data?.headers),
                statusText: getEnumerableProperties(response.data?.statusText),
                queryParams: getEnumerableProperties(this.dependency.requestConfig?.query),
            }
        ) as InterceptorResponsePayload;
    }

    private setSuccessResponse({ data }: IRequestData) {
        const { requestConfig } = this.dependency;

        this.responsePayload = {
            ...this.responsePayload,
            data: data.data,
            status: data.status,
            message: requestConfig?.successMessage ?? data?.data?.message ?? data.statusText,
            loading: false,
            success: true,
            error: false,
            refetch: this.refetch.bind(this),
        };

        this.stateSetter?.((initialState) => [this.responsePayload, initialState[1]]);

        this.dependency.dispatchLoadingState?.(false);
        this.dependency.dispatchSuccessRequest?.(data, requestConfig?.showSuccess);
        this.dependency.onSuccess?.(data);
    }

    setStateSetter(stateSetter: StateSetter<T>) {
        this.stateSetter = stateSetter;
    }

    private setErrorResponse({ data }: IRequestData) {
        this.responsePayload = {
            ...this.responsePayload,
            data: data?.data,
            status: data?.status,
            message: getErrorMessage(data?.data ?? data, this.dependency),
            loading: false,
            success: false,
            error: true,
            refetch: this.refetch.bind(this),
        };

        this.stateSetter?.((initialState) => [this.responsePayload, initialState[1]]);

        this.dependency.dispatchLoadingState?.(false);
        this.dependency.dispatchErrorRequest?.(data, this.dependency.requestConfig?.showError);
        this.dependency.onError?.(data);
    }

    private async initRequest() {
        const {
            appLevelInterceptor: { request: appRequestInterceptor, response: appResponseInterceptor } = {},
            interceptors: {
                request: componentRequestInterceptor,
                response: componentResponseInterceptor,
            } = {},
            axiosInstance,
            requestConfig,
            appLevelTimeout,
        } = this.dependency;

        try {
            this.dependency.dispatchLoadingState?.(true, requestConfig?.showLoader);
            this.isLoading();

            // if response was cached return cached response.
            if (!requestConfig?.forceRefetch) {
                const storedValue = retrieveStoredValue<IRequestData>(
                    this.requestUrl,
                    this.dependency.stateData,
                    this.dependency.name
                );
                if (storedValue && objectDeepEqual(storedValue.queryParam, requestConfig?.query)) {
                    this.setSuccessResponse(storedValue.data);
                    return;
                }
            }

            let payload = this.requestPayload;
            payload = (await appRequestInterceptor?.(payload)) ?? payload;
            payload = (await componentRequestInterceptor?.(payload)) ?? payload;

            const { controller, timeoutRef } =
                getRequestAbortter(requestConfig?.timeout ?? appLevelTimeout) ?? {};

            const response = await (axiosInstance
                ? makeAxiosRequest(axiosInstance, payload, this.dependency, controller)
                : makeFetchRequest(payload, this.dependency, controller));

            if (timeoutRef) clearTimeout(timeoutRef);
            if (response.error && response.retry && this.retryCount > 1) {
                throw new Error(response.data?.statusText ?? 'An error occur');
            }

            const responsePayload = await this.getResponse(response);

            responsePayload.data =
                (await appResponseInterceptor?.(responsePayload))?.data ?? responsePayload?.data;
            responsePayload.data =
                (await componentResponseInterceptor?.(responsePayload))?.data ?? responsePayload?.data;

            if (response.error) this.setErrorResponse(response);
            else {
                const requestData = { ...response.data, data: responsePayload.data };
                storeValue(requestData, payload, this);

                this.setSuccessResponse({ ...response, data: requestData });
            }
        } catch (err: any) {
            if (this.retryCount > 1) {
                this.retryCount = --this.retryCount;
                await this.initRequest();
            }

            this.setErrorResponse({
                data: {
                    data: err,
                    statusText: err.statusText ?? err.message,
                    status: err.status ?? 0,
                },
                error: true,
            });
        }
    }

    async makeRequest(
        path: string,
        config: GetRequestPayload | BodyRequestPayload | FormDataRequestPayload = {}
    ) {
        // Stop concurrent requests
        if (!this.responsePayload.loading) {
            this.dependency = {
                ...this.dependency,
                requestConfig: config as FormDataRequestPayload,
                path,
            };

            this.retryCount = config?.retries || this.retryCount;
            await this.initRequest();
        }
        return this.responsePayload.data;
    }
}
