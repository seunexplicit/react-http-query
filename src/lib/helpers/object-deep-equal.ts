const objectDeepEqual = (aObject: any, bObject: any) => {
    if (typeof aObject !== 'object') return String(aObject) === String(bObject);
    if ([aObject, bObject].includes(null)) return aObject === bObject;
    if (Object.keys(aObject).length !== Object.keys(bObject).length) return false;

    for (const [key, value] of Object.entries(aObject)) {
        if (!objectDeepEqual(value, bObject[key])) return false;
    }

    return true;
};

export default objectDeepEqual;
