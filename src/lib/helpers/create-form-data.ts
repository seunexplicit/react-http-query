/**
 * Generate formdata payload.
 * 
 * @param payload Payload
 * @returns
 */
const createFormData = (payload: Record<string, any>) => {
    return Object.keys(payload).reduce((previousValue, currentValue) => {
        if (payload[currentValue] instanceof FileList) {
            for (let count = 0; count < payload[currentValue].length; count++) {
                previousValue.append(currentValue, payload[currentValue].item(count));
            }
        }
        else if (typeof payload[currentValue] === 'object') {
            return addObjectToFormData(previousValue, payload[currentValue], currentValue);
        }
        else previousValue.append(currentValue, payload[currentValue]);
        return previousValue;
    }, new FormData());
};

const addObjectToFormData = (formData: FormData, payload: any, name: string) => {
    Object.entries(payload).forEach(([key, value]) => {
        if (typeof value === 'object') {
            formData = addObjectToFormData(formData, value, `${name}[${key}]`)
        }
        else formData.append(`${name}[${key}]`, value as any);
    });
    return formData
}

export default createFormData;