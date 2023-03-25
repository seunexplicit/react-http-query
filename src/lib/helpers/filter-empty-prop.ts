/**
 * Filters object properties that has null, undefined or empty string as thier value
 *
 * @param obj - Target object
 * @returns
 */
const filterEmptyProperties = (obj: Record<string, any>) => {
    return Object.keys(obj).reduce<Record<string, any>>((previousValue, currentValue) => {
        if (typeof obj[currentValue] === 'object' && !Array.isArray(obj[currentValue])) {
            previousValue[currentValue] = filterEmptyProperties(obj[currentValue]);
        }
        if (obj[currentValue] !== undefined && obj[currentValue] !== '' && obj[currentValue] !== null) {
            previousValue[currentValue] = obj[currentValue];
        }
        return previousValue;
    }, {});
};

export default filterEmptyProperties;
