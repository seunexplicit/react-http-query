import { HandlerDependency } from '../model';

export const formatMessage = (message: any) => {
    return Array.isArray(message) ? message.join('\n') : (message ?? '');
};

export const getErrorMessage = (data: any, config?: HandlerDependency) => {
    const { errorMessage, metadata } = config?.requestConfig ?? {};
    if (errorMessage || metadata?.errorMessage) return errorMessage ?? metadata?.errorMessage;

    const errorInstance = data?.response ?? data;

    return formatMessage(
        errorInstance?.error?.message ??
            errorInstance?.error?.error ??
            errorInstance?.error ??
            errorInstance?.data?.message ??
            errorInstance?.message ??
            errorInstance?.statusText
    );
};

export const getSuccessMessage = (data: any, config?: HandlerDependency) => {
    const { successMessage, metadata } = config?.requestConfig ?? {};
    if (successMessage || metadata?.successMessage) return successMessage ?? metadata?.successMessage;

    return formatMessage(data?.message ?? data?.data?.message ?? data?.statusText);
};
