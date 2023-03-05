import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { createContext, useState, useMemo, useContext, useEffect } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var MemoryStorageContext = createContext({ storedData: {} });
var MemoryStorageProvider = function (_a) {
    var children = _a.children;
    var _b = useState({}), storedData = _b[0], setStoredData = _b[1];
    var _c = useState(0), requestUpdate = _c[0], setRequestUpdate = _c[1];
    return (jsx(MemoryStorageContext.Provider, __assign({ value: {
            storedData: storedData,
            requestUpdate: requestUpdate,
            setRequestUpdate: setRequestUpdate,
            setStoredData: setStoredData,
        } }, { children: children })));
};

var PrivateContext = createContext({ loading: false });
var PrivateProvider = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return jsx(PrivateContext.Provider, __assign({ value: props }, { children: children }));
};

/**
 * Generate formdata payload.
 *
 * @param payload Payload
 * @returns
 */
var createFormData = function (payload) {
    var formData = new FormData();
    addObjectToFormData(formData, payload);
    return formData;
};
var addObjectToFormData = function (formData, payload, name) {
    Object.entries(payload).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        var valuekey = name ? "".concat(name, "[").concat(key, "]") : key;
        value instanceof FileList
            ? appendFileListToFormData(formData, value, valuekey)
            : value instanceof File || value instanceof Blob
                ? formData.append(valuekey, value)
                : typeof value === 'object'
                    ? addObjectToFormData(formData, value, valuekey)
                    : formData.append(valuekey, value);
    });
};
var appendFileListToFormData = function (formData, fileList, name) {
    for (var count = 0; count < fileList.length; count++) {
        formData.append(name, fileList.item(count));
    }
};

var objectDeepEqual = function (aObject, bObject) {
    if (typeof aObject !== 'object')
        return String(aObject) === String(bObject);
    if ([aObject, bObject].includes(null))
        return aObject === bObject;
    if (Object.keys(aObject).length !== Object.keys(bObject).length)
        return false;
    for (var _i = 0, _a = Object.entries(aObject); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (!objectDeepEqual(value, bObject[key]))
            return false;
    }
    return true;
};

/**
 * Filters object properties that has null, undefined or empty string as thier value
 *
 * @param obj - Target object
 * @returns
 */
var filterEmptyProperties = function (obj) {
    return Object.keys(obj).reduce(function (previousValue, currentValue) {
        if (typeof obj[currentValue] === 'object' && !Array.isArray(obj[currentValue])) {
            previousValue[currentValue] = filterEmptyProperties(obj[currentValue]);
        }
        if (obj[currentValue] !== undefined && obj[currentValue] !== '' && obj[currentValue] !== null) {
            previousValue[currentValue] = obj[currentValue];
        }
        return previousValue;
    }, {});
};

/**
 * Helper to concat query param object into a string
 *
 * @param query - Query param as object with keys & value
 * @descriptions {searchText: 'value'} => ?searchText=value
 * @returns {string}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var queryBuilder = function (query) {
    if (!query)
        return '';
    var name = function (_name) { return "".concat(_name, "="); };
    return Object.keys(query || {}).reduce(function (previousValue, currentValue, index) {
        var queryProp = typeof query[currentValue] === 'object'
            ? name(currentValue) + JSON.stringify(filterEmptyProperties(query[currentValue]))
            : query[currentValue] === undefined ||
                query[currentValue] === '' ||
                query[currentValue] === null
                ? ''
                : name(currentValue) + query[currentValue];
        return "".concat(previousValue).concat(index && queryProp ? '&' : '').concat(queryProp);
    }, '?');
};

/**
 * Checks if a string is an absolute url or a path
 * @param url String to check
 * @returns {boolean}
 */
var isPath = function (url) {
    try {
        new URL(url);
        return false;
    }
    catch (_err) {
        return true;
    }
};
/**
 * Generate request path.
 *
 * @param path Request path or url
 * @param baseUrl Request base url
 * @param isRelative Detemine if path is relative path or absolute path
 * @returns {string}
 */
var generatePath = function (path, baseUrl, isRelative) {
    return "".concat(isRelative === true && baseUrl
        ? concatBasePath(path, baseUrl)
        : isRelative === false || !isPath(path)
            ? path
            : concatBasePath(path, baseUrl));
};
var concatBasePath = function (path, baseUrl) {
    return (((baseUrl === null || baseUrl === void 0 ? void 0 : baseUrl.charAt((baseUrl === null || baseUrl === void 0 ? void 0 : baseUrl.length) - 1)) === '/' ? baseUrl : "".concat(baseUrl, "/")) +
        (path.charAt(0) === '/' ? path.substring(1) : path));
};
/**
 * Builds request headers
 *
 * @param allowBearer If to allow authorization to the request heeader
 * @param authorizationToken Authorization header
 * @param headerProps User haeder properties
 * @returns
 */
var requestHeaderBuilder = function (allowBearer, authorizationToken, headerProps) {
    var headers = {};
    var headerPropsKey = Object.keys(headerProps || {});
    var overridesHeaders = !!headerPropsKey.length && (headerPropsKey.length > 1 || headerPropsKey[0] !== 'append');
    if (!overridesHeaders) {
        Object.assign(headers, __assign({ 'Content-Type': 'application/json' }, headerProps === null || headerProps === void 0 ? void 0 : headerProps.append));
        if (allowBearer && authorizationToken) {
            Object.assign(headers, { Authorization: "Bearer ".concat(authorizationToken) });
        }
        return [headers, overridesHeaders];
    }
    return [__assign({}, headerProps), overridesHeaders];
};
/**
 * Get an abort controller.
 *
 * @param timeout Request timeout.
 * @returns
 */
var getRequestAbortter = function (timeout) {
    if (!timeout)
        return;
    var controller = new AbortController();
    var timeoutRef = setTimeout(function () { return controller.abort(); }, timeout);
    return { controller: controller, timeoutRef: timeoutRef };
};
var fetchRequest = function (payload, config, controller) {
    return fetch("".concat(payload.url).concat(queryBuilder(payload.queryParams)), __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ headers: payload.headers, method: payload.method }, getProperty('mode', config)), getProperty('cache', config)), getProperty('window', config)), getProperty('redirect', config)), getProperty('referrer', config)), getProperty('integrity', config)), getProperty('keepalive', config)), getProperty('signal', controller)), getProperty('credentials', config)), getProperty('referrerPolicy', config)), { body: payload.body instanceof Blob ||
            typeof payload.body === 'string' ||
            ArrayBuffer.isView(payload.body) ||
            payload.body instanceof FormData ||
            payload.body instanceof ArrayBuffer ||
            payload.body instanceof URLSearchParams
            ? payload.body
            : payload.body && JSON.stringify(payload.body) }));
};
var getProperty = function (key, payload) {
    var _a;
    return (payload === null || payload === void 0 ? void 0 : payload[key]) !== undefined && (_a = {}, _a[key] = payload[key], _a);
};
var getInitialState = {
    loading: false,
    error: false,
    success: false,
    data: null,
    message: '',
    status: null,
};
var getEnumerableProperties = function (value, writable) {
    if (writable === void 0) { writable = false; }
    return ({
        value: value,
        writable: writable,
        enumerable: true,
    });
};

var __STORAGE_NAME_PREFIX__ = 'react-http-request';
var retrieveStoredValue = function (url, storedMemoryState, name) {
    var _a;
    var nameValue = "".concat(__STORAGE_NAME_PREFIX__, "-").concat(name || url);
    var value = storedMemoryState === null || storedMemoryState === void 0 ? void 0 : storedMemoryState[nameValue];
    if (typeof value !== 'undefined')
        return value;
    return (_a = getValueFromSession(name !== null && name !== void 0 ? name : '', url)) !== null && _a !== void 0 ? _a : getValueFromLocal(name !== null && name !== void 0 ? name : '', url);
};
var getValueFromSession = function (name, url) {
    if (url === void 0) { url = ''; }
    var value = sessionStorage.getItem("".concat(__STORAGE_NAME_PREFIX__, "-").concat(name || url));
    return parseValue(value);
};
var getValueFromLocal = function (name, url) {
    if (url === void 0) { url = ''; }
    var value = localStorage.getItem("".concat(__STORAGE_NAME_PREFIX__, "-").concat(name || url));
    return parseValue(value);
};
var parseValue = function (value) {
    if (value !== null)
        return JSON.parse(value);
    return undefined;
};
var saveValueToSession = function (args) {
    var nameValue = "".concat(__STORAGE_NAME_PREFIX__, "-").concat(args.name || args.url);
    sessionStorage.setItem(nameValue, JSON.stringify(args.value));
};
var saveValueToLocalStorage = function (args) {
    var nameValue = "".concat(__STORAGE_NAME_PREFIX__, "-").concat(args.name || args.url);
    localStorage.setItem(nameValue, JSON.stringify(args.value));
};
var saveValueToMemory = function (args, setState) {
    var nameValue = "".concat(__STORAGE_NAME_PREFIX__, "-").concat(args.name || args.url);
    setState(function (previousValue) {
        var _a;
        return (__assign(__assign({}, previousValue), (_a = {}, _a[nameValue] = args.value, _a)));
    });
};

var RequestHandler = /** @class */ (function () {
    function RequestHandler(setRequestState) {
        this.setRequestState = setRequestState;
        this.dependency = {
            stateData: {},
        };
        this.responsePayload = __assign({}, getInitialState);
        this.retryCount = 1;
    }
    RequestHandler.prototype.setDependency = function (dependency) {
        this.dependency = __assign(__assign({}, this.dependency), dependency);
    };
    RequestHandler.prototype.isLoading = function () {
        this.responsePayload = __assign(__assign({}, this.responsePayload), { loading: true });
    };
    Object.defineProperty(RequestHandler.prototype, "requestMethod", {
        get: function () {
            return this.dependency.method || (this.dependency.body || this.dependency.formData ? 'POST' : 'GET');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestHandler.prototype, "requestUrl", {
        get: function () {
            var _a;
            return generatePath((_a = this.dependency.path) !== null && _a !== void 0 ? _a : '', this.dependency.baseUrl || this.dependency.appLevelBaseUrl, this.dependency.isRelative);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestHandler.prototype, "requestHeader", {
        get: function () {
            var _a;
            var _b = requestHeaderBuilder((_a = this.dependency.bearer) !== null && _a !== void 0 ? _a : true, this.dependency.authToken, this.dependency.header), headers = _b[0], overridesHeaders = _b[1];
            !overridesHeaders && this.dependency.formData && delete headers['Content-Type'];
            return headers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestHandler.prototype, "requestPayload", {
        get: function () {
            var formData = this.dependency.formData && createFormData(this.dependency.formData);
            return {
                headers: this.requestHeader,
                method: this.requestMethod,
                queryParams: this.dependency.query,
                url: this.requestUrl,
                body: formData !== null && formData !== void 0 ? formData : this.dependency.body,
            };
        },
        enumerable: false,
        configurable: true
    });
    RequestHandler.prototype.getResponse = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var responseBody, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, response.text()];
                    case 1:
                        responseBody = _b.apply(_a, [(_c.sent()) || '{}']);
                        return [2 /*return*/, Object.defineProperties({}, {
                                url: getEnumerableProperties(this.requestUrl),
                                method: getEnumerableProperties(this.requestMethod),
                                status: getEnumerableProperties(response.status),
                                data: getEnumerableProperties(responseBody, true),
                                queryParams: getEnumerableProperties(this.dependency.query),
                            })];
                }
            });
        });
    };
    RequestHandler.prototype.setSuccessResponse = function (data, message) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        if (message === void 0) { message = ''; }
        this.responsePayload = __assign(__assign({}, this.responsePayload), { data: data, message: this.dependency.successMessage || data.message || message, loading: false, success: true, error: false });
        this.setRequestState(function (initialState) {
            Object.assign(initialState, { 0: _this.responsePayload });
            return initialState;
        });
        (_b = (_a = this.dependency).dispatchLoadingState) === null || _b === void 0 ? void 0 : _b.call(_a, false);
        (_d = (_c = this.dependency).dispatchSuccessRequest) === null || _d === void 0 ? void 0 : _d.call(_c, data);
        (_f = (_e = this.dependency).onSuccess) === null || _f === void 0 ? void 0 : _f.call(_e, data);
    };
    RequestHandler.prototype.setErrorResponse = function (data, message) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (message === void 0) { message = ''; }
        this.responsePayload = __assign(__assign({}, this.responsePayload), { data: data, message: this.dependency.errorMessage ||
                (data === null || data === void 0 ? void 0 : data.error) ||
                (data === null || data === void 0 ? void 0 : data.message) ||
                ((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) ||
                ((_b = data === null || data === void 0 ? void 0 : data.error) === null || _b === void 0 ? void 0 : _b.error) ||
                message, loading: false, success: false, error: true });
        this.setRequestState(function (initialState) {
            Object.assign(initialState, { 0: _this.responsePayload });
            return initialState;
        });
        (_d = (_c = this.dependency).dispatchLoadingState) === null || _d === void 0 ? void 0 : _d.call(_c, false);
        (_f = (_e = this.dependency).dispatchErrorRequest) === null || _f === void 0 ? void 0 : _f.call(_e, data);
        (_h = (_g = this.dependency).onError) === null || _h === void 0 ? void 0 : _h.call(_g, data);
    };
    RequestHandler.prototype.initRequest = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __awaiter(this, void 0, void 0, function () {
            var storedValue, payload, _w, controller, timeoutRef, response, responsePayload, valueToStore, err_1;
            return __generator(this, function (_x) {
                switch (_x.label) {
                    case 0:
                        _x.trys.push([0, 3, , 6]);
                        (_b = (_a = this.dependency).dispatchLoadingState) === null || _b === void 0 ? void 0 : _b.call(_a, true);
                        this.isLoading();
                        // if response was cached return cached response.
                        if (!this.dependency.forceRefetch) {
                            storedValue = retrieveStoredValue(this.requestUrl, this.dependency.stateData, this.dependency.name);
                            if (storedValue && objectDeepEqual(storedValue.queryParam, this.dependency.query)) {
                                this.setSuccessResponse(storedValue.data);
                                return [2 /*return*/];
                            }
                        }
                        payload = this.requestPayload;
                        payload = (_e = (_d = (_c = this.dependency.appLevelInterceptor) === null || _c === void 0 ? void 0 : _c.request) === null || _d === void 0 ? void 0 : _d.call(_c, payload)) !== null && _e !== void 0 ? _e : payload;
                        payload = (_h = (_g = (_f = this.dependency.interceptors) === null || _f === void 0 ? void 0 : _f.request) === null || _g === void 0 ? void 0 : _g.call(_f, payload)) !== null && _h !== void 0 ? _h : payload;
                        _w = (_k = getRequestAbortter((_j = this.dependency.timeout) !== null && _j !== void 0 ? _j : this.dependency.appLevelTimeout)) !== null && _k !== void 0 ? _k : {}, controller = _w.controller, timeoutRef = _w.timeoutRef;
                        return [4 /*yield*/, fetchRequest(payload, this.dependency, controller)];
                    case 1:
                        response = _x.sent();
                        if (timeoutRef)
                            clearTimeout(timeoutRef);
                        return [4 /*yield*/, this.getResponse(response)];
                    case 2:
                        responsePayload = _x.sent();
                        responsePayload.data =
                            (_p = (_o = (_m = (_l = this.dependency.appLevelInterceptor) === null || _l === void 0 ? void 0 : _l.response) === null || _m === void 0 ? void 0 : _m.call(_l, responsePayload)) === null || _o === void 0 ? void 0 : _o.data) !== null && _p !== void 0 ? _p : responsePayload === null || responsePayload === void 0 ? void 0 : responsePayload.data;
                        responsePayload.data =
                            (_t = (_s = (_r = (_q = this.dependency.interceptors) === null || _q === void 0 ? void 0 : _q.response) === null || _r === void 0 ? void 0 : _r.call(_q, responsePayload)) === null || _s === void 0 ? void 0 : _s.data) !== null && _t !== void 0 ? _t : responsePayload === null || responsePayload === void 0 ? void 0 : responsePayload.data;
                        if (response.ok) {
                            valueToStore = {
                                name: this.dependency.name,
                                url: payload.url,
                                value: { data: responsePayload.data, queryParam: payload.queryParams },
                            };
                            if (this.dependency.memoryStorage && this.dependency.setStateData) {
                                saveValueToMemory(valueToStore, this.dependency.setStateData);
                            }
                            if (this.dependency.sessionStorage)
                                saveValueToSession(valueToStore);
                            if (this.dependency.localStorage)
                                saveValueToLocalStorage(valueToStore);
                            (_v = (_u = this.dependency).setRequestUpdate) === null || _v === void 0 ? void 0 : _v.call(_u, function (initialValue) { return ++initialValue; });
                            this.setSuccessResponse(responsePayload.data, response.statusText);
                        }
                        else {
                            this.setErrorResponse(responsePayload);
                        }
                        return [3 /*break*/, 6];
                    case 3:
                        err_1 = _x.sent();
                        if (!(this.retryCount > 1)) return [3 /*break*/, 5];
                        this.retryCount = --this.retryCount;
                        return [4 /*yield*/, this.initRequest()];
                    case 4:
                        _x.sent();
                        _x.label = 5;
                    case 5:
                        this.setErrorResponse(err_1, 'An error occur.');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RequestHandler.prototype.makeRequest = function (path, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.responsePayload.loading) return [3 /*break*/, 2];
                        this.dependency = __assign(__assign(__assign({}, this.dependency), config), { path: path });
                        this.retryCount = (config === null || config === void 0 ? void 0 : config.retries) || this.retryCount;
                        return [4 /*yield*/, this.initRequest()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.responsePayload.data];
                }
            });
        });
    };
    return RequestHandler;
}());

var useRequest = function (props) {
    var _a = useState([
        getInitialState,
        function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); }); },
    ]), state = _a[0], setState = _a[1];
    var requestHandler = useMemo(function () {
        var handler = new RequestHandler(setState);
        Object.assign(state, { 1: handler.makeRequest.bind(handler) });
        return handler;
    }, []);
    var _b = useContext(PrivateContext), baseUrl = _b.baseUrl, authToken = _b.authToken, requestTimeout = _b.requestTimeout, dispatchErrorRequest = _b.dispatchErrorRequest, dispatchLoadingState = _b.dispatchLoadingState, dispatchSuccessRequest = _b.dispatchSuccessRequest, appLevelRequestInterceptor = _b.requestInterceptor, appLevelResponseInterceptor = _b.responseInterceptor;
    var _c = useContext(MemoryStorageContext), setStoredData = _c.setStoredData, storedData = _c.storedData, setRequestUpdate = _c.setRequestUpdate;
    var _d = props || {}, localStorage = _d.localStorage, sessionStorage = _d.sessionStorage, memoryStorage = _d.memoryStorage, name = _d.name, interceptors = _d.interceptors;
    useEffect(function () {
        requestHandler.setDependency(__assign(__assign({}, props), { appLevelBaseUrl: baseUrl, appLevelTimeout: requestTimeout, authToken: authToken, dispatchErrorRequest: dispatchErrorRequest, dispatchLoadingState: dispatchLoadingState, dispatchSuccessRequest: dispatchSuccessRequest, setStateData: setStoredData, stateData: storedData, setRequestUpdate: setRequestUpdate, appLevelInterceptor: {
                request: appLevelRequestInterceptor,
                response: appLevelResponseInterceptor,
            } }));
    }, [
        name,
        baseUrl,
        authToken,
        storedData,
        interceptors,
        localStorage,
        memoryStorage,
        sessionStorage,
        requestTimeout,
        setRequestUpdate,
        dispatchErrorRequest,
        dispatchLoadingState,
        dispatchSuccessRequest,
        appLevelRequestInterceptor,
        appLevelResponseInterceptor,
    ]);
    useEffect(function () {
        var _a;
        (_a = props === null || props === void 0 ? void 0 : props.onMount) === null || _a === void 0 ? void 0 : _a.call(props, requestHandler.makeRequest.bind(requestHandler));
    }, []);
    return state;
};

var __DEFAULT_POPUP_TIMEOUT__ = 8;
var RequestContext = createContext({});
var RequestProvider = function (_a) {
    var _b, _c;
    var children = _a.children, prop = __rest(_a, ["children"]);
    var _d = useState(prop.baseUrl), baseUrl = _d[0], setBaseUrl = _d[1];
    var _e = useState(prop.authToken || ''), authToken = _e[0], setAuthToken = _e[1];
    var _f = useState(false), loading = _f[0], setLoading = _f[1];
    var _g = useState(), successPopup = _g[0], setSuccessPopup = _g[1];
    var _h = useState(), errorPopup = _h[0], setErrorPopup = _h[1];
    var _j = useState(), loaderComponent = _j[0], setLoaderComponent = _j[1];
    function dispatchErrorRequest(errorPayload) {
        var _a, _b;
        var popup = (_b = (_a = prop === null || prop === void 0 ? void 0 : prop.onError) === null || _a === void 0 ? void 0 : _a.call(prop, errorPayload)) !== null && _b !== void 0 ? _b : undefined;
        setErrorPopup(popup);
        if (popup) {
            setTimeout(function () { return setErrorPopup(undefined); }, (prop.popupTimeout || __DEFAULT_POPUP_TIMEOUT__) * 1000);
        }
    }
    function dispatchSuccessRequest(errorPayload) {
        var _a, _b;
        var popup = (_b = (_a = prop === null || prop === void 0 ? void 0 : prop.onSuccess) === null || _a === void 0 ? void 0 : _a.call(prop, errorPayload)) !== null && _b !== void 0 ? _b : undefined;
        setSuccessPopup(popup);
        if (popup) {
            setTimeout(function () { return setSuccessPopup(undefined); }, (prop.popupTimeout || __DEFAULT_POPUP_TIMEOUT__) * 1000);
        }
    }
    function dispatchLoadingState(state) {
        var _a, _b;
        setLoading(state);
        var loader = (_b = (_a = prop === null || prop === void 0 ? void 0 : prop.onLoading) === null || _a === void 0 ? void 0 : _a.call(prop, state)) !== null && _b !== void 0 ? _b : undefined;
        setLoaderComponent(state ? loader : undefined);
    }
    return (jsx(RequestContext.Provider, __assign({ value: {
            baseUrl: baseUrl,
            setBaseUrl: setBaseUrl,
            authToken: authToken,
            setAuthToken: setAuthToken,
            loading: loading,
        } }, { children: jsx(MemoryStorageProvider, { children: jsx(PrivateProvider, __assign({ loading: loading, baseUrl: baseUrl, authToken: authToken, setBaseUrl: setBaseUrl, setAuthToken: setAuthToken, requestTimeout: prop === null || prop === void 0 ? void 0 : prop.requestTimeout, dispatchLoadingState: dispatchLoadingState, dispatchErrorRequest: dispatchErrorRequest, dispatchSuccessRequest: dispatchSuccessRequest, requestInterceptor: (_b = prop === null || prop === void 0 ? void 0 : prop.interceptors) === null || _b === void 0 ? void 0 : _b.request, responseInterceptor: (_c = prop === null || prop === void 0 ? void 0 : prop.interceptors) === null || _c === void 0 ? void 0 : _c.response }, { children: jsxs(Fragment, { children: [errorPopup && errorPopup, successPopup && successPopup, loaderComponent && loaderComponent, children] }) })) }) })));
};

var useRequestData = function (name, storageLocation) {
    var _a = useState(), data = _a[0], setData = _a[1];
    var _b = useContext(MemoryStorageContext), storedData = _b.storedData, requestUpdate = _b.requestUpdate;
    useEffect(function () {
        var _a, _b, _c;
        if (storageLocation === 'session')
            setData((_a = getValueFromSession(name)) === null || _a === void 0 ? void 0 : _a.data);
        else if (storageLocation === 'local')
            setData((_b = getValueFromLocal(name)) === null || _b === void 0 ? void 0 : _b.data);
        else if (storageLocation === 'memory') {
            setData(storedData === null || storedData === void 0 ? void 0 : storedData["".concat(__STORAGE_NAME_PREFIX__, "-").concat(name)]);
        }
        else
            setData((_c = retrieveStoredValue('', storedData, name)) === null || _c === void 0 ? void 0 : _c.data);
    }, [name, storageLocation, storedData, requestUpdate]);
    return data;
};

var useRequestConfig = function () {
    var _a = useContext(PrivateContext), setAuthToken = _a.setAuthToken, setBaseUrl = _a.setBaseUrl, loading = _a.loading;
    return { setAuthToken: setAuthToken, setBaseUrl: setBaseUrl, loading: loading };
};

export { RequestProvider, useRequest, useRequestConfig, useRequestData };
