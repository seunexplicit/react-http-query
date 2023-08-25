export interface AxiosInstance {
    // `url` is the server URL that will be used for the request
    url: '/user';

    // `method` is the request method to be used when making the request
    method: 'get'; // default

    // `baseURL` will be prepended to `url` unless `url` is absolute.
    // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
    // to methods of that instance.
    baseURL: 'https://some-domain.com/api';

    // `headers` are custom headers to be sent
    headers: { 'X-Requested-With': 'XMLHttpRequest' };

    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    // NOTE: params that are null or undefined are not rendered in the URL.
    params: {
        ID: 12345;
    };

    // `paramsSerializer` is an optional function in charge of serializing `params`
    // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
    // paramsSerializer: function (params) {
    //   return Qs.stringify(params, {arrayFormat: 'brackets'})
    // },

    // `data` is the data to be sent as the request body
    // Only applicable for request methods 'PUT', 'POST', 'DELETE', and 'PATCH'
    // When no `transformRequest` is set, must be of one of the following types:
    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
    // - Browser only: FormData, File, Blob
    // - Node only: Stream, Buffer
    data: {
        firstName: 'Fred';
    };

    // syntax alternative to send data into the body
    // method post
    // only the value is sent, not the key
    data: 'Country=Brasil&City=Belo Horizonte';

    // `timeout` specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    timeout: 1000; // default is `0` (no timeout)

    // `withCredentials` indicates whether or not cross-site Access-Control requests
    // should be made using credentials
    withCredentials: false; // default

    // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
    // This will set an `Authorization` header, overwriting any existing
    // `Authorization` custom headers you have set using `headers`.
    // Please note that only HTTP Basic auth is configurable through this parameter.
    // For Bearer tokens and such, use `Authorization` custom headers instead.
    auth: {
        username: 'janedoe';
        password: 's00pers3cret';
    };
}

export interface ClonedAxiosInstance {
    // `responseType` indicates the type of data that the server will respond with
    // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
    //   browser only: 'blob'
    responseType: string; // default

    // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
    xsrfCookieName: string;

    // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
    xsrfHeaderName: string;

    // `onUploadProgress` allows handling of progress events for uploads
    // browser only
    onUploadProgress: (event: any) => void;

    // `onDownloadProgress` allows handling of progress events for downloads
    onDownloadProgress: (event: any) => void;

    // `validateStatus` defines whether to resolve or reject the promise for a given
    // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
    // or `undefined`), the promise will be resolved; otherwise, the promise will be
    // rejected.
    validateStatus: (status: number) => boolean;

    // `proxy` defines the hostname, port, and protocol of the proxy server.
    // You can also define your proxy using the conventional `http_proxy` and
    // `https_proxy` environment variables. If you are using environment variables
    // for your proxy configuration, you can also define a `no_proxy` environment
    // variable as a comma-separated list of domains that should not be proxied.
    // Use `false` to disable proxies, ignoring environment variables.
    // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and
    // supplies credentials.
    // This will set an `Proxy-Authorization` header, overwriting any existing
    // `Proxy-Authorization` custom headers you have set using `headers`.
    // If the proxy server uses HTTPS, then you must set the protocol to `https`.
    proxy: {
        protocol: 'https';
        host: '127.0.0.1';
        port: 9000;
        auth: {
            username: 'mikeymike';
            password: 'rapunz3l';
        };
    };

    // `cancelToken` specifies a cancel token that can be used to cancel the request
    // (see Cancellation section below for details)
    cancelToken: any;
}
