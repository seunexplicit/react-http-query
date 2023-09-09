import { HttpStatusCode } from '../utils';

export const getStatusMessage = (status: number) => {
    if (!status) return '';

    const requestStatus = Object.entries(HttpStatusCode).find(([, statusCode]) => statusCode === status);

    return requestStatus?.[0]?.split(/(?=[A-Z])/).join(' ') ?? '';
};
