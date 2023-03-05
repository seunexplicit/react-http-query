/**
 * Filters object properties that has null, undefined or empty string as thier value
 *
 * @param obj - Target object
 * @returns
 */
declare const filterEmptyProperties: (obj: Record<string, any>) => Record<string, any>;
export default filterEmptyProperties;
