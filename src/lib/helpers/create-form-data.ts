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
        } else previousValue.append(currentValue, payload[currentValue]);
        return previousValue;
    }, new FormData());
};

export default createFormData;