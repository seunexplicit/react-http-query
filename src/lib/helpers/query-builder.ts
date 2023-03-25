import filterEmptyProperties from './filter-empty-prop';

/**
 * Helper to concat query param object into a string
 *
 * @param query - Query param as object with keys & value
 * @descriptions {searchText: 'value'} => ?searchText=value
 * @returns {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryBuilder = (query?: Record<string, any>): string => {
    if (!query) return '';

    const name = (_name: string) => `${_name}=`;

    return Object.keys(query || {}).reduce((previousValue, currentValue, index) => {
        const queryProp =
            typeof query[currentValue] === 'object'
                ? name(currentValue) + JSON.stringify(filterEmptyProperties(query[currentValue]))
                : query[currentValue] === undefined ||
                  query[currentValue] === '' ||
                  query[currentValue] === null
                ? ''
                : name(currentValue) + query[currentValue];
        return `${previousValue}${index && queryProp ? '&' : ''}${queryProp}`;
    }, '?');
};

export default queryBuilder;
