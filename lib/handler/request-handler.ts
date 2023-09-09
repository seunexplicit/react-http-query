import createFormData from '../helpers/create-form-data';
import objectDeepEqual from '../helpers/object-deep-equal';
import { getErrorMessage, getSuccessMessage } from '../helpers/get-messages';
import { makeAxiosRequest } from '../helpers/axios-request';
import { makeFetchRequest } from '../helpers/fetch-request';
import { retrieveStoredValue, storeValue } from '../helpers/stored-value-management';
import {
    generatePath,
    getEnumerableProperties,
    getInitialState,
    getRequestAbortter,
    requestHeaderBuilder,
} from '../helpers/request.helper';
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
    RequestPayload,
} from '../model';

type StateSetter<T> = React.Dispatch<React.SetStateAction<[IResponse<T>, MakeRequest<T>]>>;

export default class RequestHandler<T = any> implements IRequestHandler<T> {
    private dependency: HandlerDependency<T> = {
        requestConfig: {},
        stateData: {},
    };

    private responsePayload: IResponse<T> = { ...getInitialState };
    private retryCount = 1;
    private stateSetter: StateSetter<T> | null = null;

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
        const { method, body, formData } = this.dependency.requestConfig;

        return method || (body || formData ? 'POST' : 'GET');
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

        !overridesHeaders && this.dependency.requestConfig?.formData && delete headers['Content-Type'];
        return headers;
    }

    private get requestPayload(): InterceptorPayload {
        const { formData, query, body, metadata } = this.dependency.requestConfig;
        const createdFormData = formData && createFormData(formData);

        return {
            headers: this.requestHeader,
            method: this.requestMethod,
            queryParams: query,
            url: this.requestUrl,
            body: createdFormData ?? body,
            metadata: Object.freeze(metadata),
        };
    }

    private refetch(queryParam: RequestPayload['query'] = {}) {
        return this.makeRequest(this.dependency.path ?? '', {
            ...this.dependency.requestConfig,
            query: { ...this.dependency.requestConfig?.query, ...queryParam },
        } as FormDataRequestPayload);
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

    private setSuccessResponse(data: IRequestData['data']) {
        const { showSuccess, metadata } = this.dependency.requestConfig;
        const message = getSuccessMessage(data, this.dependency);

        this.responsePayload = {
            ...this.responsePayload,
            previousData: this.responsePayload.data,
            metadata: Object.freeze(metadata),
            data: data.data,
            status: data.status,
            message,
            loading: false,
            success: true,
            error: false,
            refetch: this.refetch.bind(this),
        };

        this.stateSetter?.((initialState) => [this.responsePayload, initialState[1]]);

        const callbackData = { ...data, metadata: Object.freeze(metadata), message };

        this.dependency.dispatchLoadingState?.(false);
        this.dependency.dispatchSuccessRequest?.(callbackData, showSuccess);
        this.dependency.onSuccess?.(callbackData);
    }

    setStateSetter(stateSetter: StateSetter<T>) {
        this.stateSetter = stateSetter;
    }

    private setErrorResponse({ data }: IRequestData) {
        const { showError, metadata } = this.dependency.requestConfig;
        const message = getErrorMessage(data?.data ?? data, this.dependency);

        this.responsePayload = {
            ...this.responsePayload,
            previousData: this.responsePayload.data,
            data: data?.data,
            status: data?.status,
            metadata: Object.freeze(metadata),
            message,
            loading: false,
            success: false,
            error: true,
            refetch: this.refetch.bind(this),
        };

        this.stateSetter?.((initialState) => [this.responsePayload, initialState[1]]);

        const callbackData = { ...data, metadata: Object.freeze(metadata), message };

        this.dependency.dispatchLoadingState?.(false);
        this.dependency.dispatchErrorRequest?.(callbackData, showError);
        this.dependency.onError?.(callbackData);
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
                const storedValue = retrieveStoredValue<IRequestData['data']>(
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

                this.setSuccessResponse(requestData);
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
