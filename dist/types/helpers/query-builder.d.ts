/**
 * Helper to concat query param object into a string
 *
 * @param query - Query param as object with keys & value
 * @descriptions {searchText: 'value'} => ?searchText=value
 * @returns {string}
 */
declare const queryBuilder: (query?: Record<string, any>) => string;
export default queryBuilder;
