## Description
A simple React Query library that utilizes the `window.fetch` request function by default. It also supports providing an `axios` instance to replace the default `window.fetch`.  

## Table of contents
- [Simple Usage](#simple-usage)
- [makeRequest](#makeRequest)
    - [Configurations]()
    - [Usage Examples](#usage-examples)
        - [GET](#get)
        - [POST](#post)
        - [Form Data Request](#form-data-request)
        - [Other Request Methods](#other-request-methods)
- [useRequest](#useRequest)
    - [Parameter Properties](#parameter-properties)
    - [Usage Examples](#usage-examples-1)
- [Request Provider](#request-provider)
    - [Properties](#properties)
    - [Usage Examples](#usage-examples-2)
- [useRequestConfig](#useRequestConfig)
- [useRequestData](#useRequestData)
    - [Parameters](#parameters)
    - [Usage Examples](#usage-examples-3)
- [Interceptors](#interceptors)
    - [Request](#request)
    - [Response](#response)

## Simple Usage
```jsx
import React from 'react';
import { useRequest } from 'react-http-query';

const App = () => {
    const [{data, loading, success, error}, makeRequest] = useRequest();

    React.useEffect(() => {
        makeRequest('https://example.com/users');
    }, [])

    return (<>
        { loading && <div>loading...</div> }
        { data && !loading 
            && <main>
                <p>{ data.name }</p>
                <p>{ data.age }</p>
            </main>
        }
        { error && !loading && <div>An error occur fetching user</div> }
    </>)
}
```

## makeRequest
```js
const [{}, makeRequest] = useRequest();
```
`makeRequest` is the function returned by the `useRequest` hook at array index 1, that is used in making your api call. It can be given any name depending on the request purpose e.g. `makeLoginRequest` `makeDeleteUserRequest` etc. It takes two parameters which are
- A required url, which could be an absolute url or a relative path if base url is provided in either the `useRequest` hook or `Request Provider` that wraps all your app components.
- An optional configuration object. It takes all properties that can be passed to window `fetch` function and some additional properties that is discussed below.
### Configuration
| Property | Description | Allowed Values  | Default |
| --- | --- | --- | --- |
| method | It determines the type of request that is to be made | `GET` \| `POST` \| `PUT` \| `PATCH` \| `DELETE` \| `HEAD` \| `OPTIONS`  | `GET` if there is no request *body*. `POST` if there is a request body |
| body | Request body. Any accepted type of body by `fetch` including an _object_ e.g `{value: 3}`, which means you don't have to stringify the payload. | `fetch body types` & `object` |   |
| formData | To send a `FormData` body payload, the payload can be passed to `formData` as javascript object instead of `body`, which converts the data to a `FormData` before sending the request. | `object`  |    |
| retries | Number of times to retry the request if there is a non-server error such as: Request Timeout, Network Error etc. | `number` | 1 |
| bearer | It determines whether Authorization bearer token should be added to request header. See [Request Provider Properties](#properties) for more context. | `boolean` |  true  |
| timeout | Request allowed duration in `milliseconds`. When request duration exceeds this value, the request will be aborted. | `number` |   |
| forceRefetch | It determines if stored/cached value by request, should be returned or new data should be fetched from server  | `boolean` |  `false` |
| isRelative | The `isRelative` property serves to indicate whether the url provided to the `makeRequest` function is a relative path. When set to true, it enforces the addition of the base URL provided to either the `useRequest` hook or the `RequestProvider` to the url specified in the `makeRequest` function. This addition occurs regardless of whether the url is originally an absolute URL or a relative path. Typically, there is no need to explicitly set this property, as the library can determine whether to use the baseUrl based on what is passed to the `makeRequest` function. | `boolean` | `false` |
| metadata | This object allows you to attach custom data or context to a request, making it available for use in different aspects of request handling. It's a valuable tool for including any relevant supplementary details or contextual information that may be needed at different request callbacks, such as `onSuccess`, `onError` & `interceptors` | `object` |   |
| header  | Request headers. If the headers property is passed to the headers `append` it append it to any generated headers by the library otherwise it will override any generated header |  |   | 
| query  | The `query` property represents the request query parameters. It is an object that allows you to specify the query parameters and their corresponding values for the request | `object` |   |
| showSuccess  | Determines whether to display a success alert for a specific request if a success alert is returned in `RequestProvider.onSuccess` | `boolean` | `true`  | 
| showError  | Determines whether to display an error alert for a specific request if an error alert is returned in `RequestProvider.onError` | `boolean` | `true` |
| showLoader  | Determines whether to display a loader for a specific request if loader component is returned in `RequestProvider.onLoading` | `boolean` | `true`  |

### Usage Examples
### GET
```jsx
import React from 'react';
import { useRequest } from 'react-http-query';

const App = () => {
    const [{data, loading, success, error}, makeUserRequest] = useRequest();

    React.useEffect(() => {
        // Generated url -> https://example.com/users?page=1&pageSize=20
        makeUserRequest('https://example.com/users', {
            query: { page: 1, pageSize: 20 },
            retries: 3,
        });
        // No need to explicitly passed the method. GET method is assumed if no body is passed.
    }, [])
}
```
### POST
```jsx
import { useRequest } from 'react-http-query';

const App = () => {
    const [{data, loading, success, error}, makeLoginRequest] = useRequest();

    const onFormSubmit = ({username, password}) => {
        makeLoginRequest('https://example.com/login', {
            body: { username, password },
            timeout: 5000 // 5 secs
        });
        // No need to explicitly passed the method. POST method is assumed when there is a body.
    }
}
```
> **Note:**
> `makeRequest` function also returns the request's response if it is await in an async
> function `const data = await makeRequest(/users)`, which implies a `makeRequest` instance can be used to make request to multiple endpoints.
> This would be a bad practice, as it is advice you create different instances for each request, so their state can be properly managed.
### Form Data Request
```jsx
import { useRequest } from 'react-http-query';

const App = () => {
    const [{data, loading, success, error}, makeSignUpRequest] = useRequest();

    const onFormSubmit = ({username, password, event}) => {
        makeSignUpRequest('https://example.com/signup', {
            formData: { username, password, avatar: event.target.files[0] },
            successMessage: "Your profile have been successfully created."
        });
        // The request payload would be a FormData.
    }
}
```
### Other Request Methods
To make http request other than `GET` or `POST`, the method has to be explicitly specified.
```jsx
import React from 'react';
import { useRequest } from 'react-http-query';

const App = () => {
    const [{data, loading, success, error}, makeProfileUpdateRequest] = useRequest();

    const onFormSubmit = ({lastName, address}) => {
        makeProfileUpdateRequest('https://example.com/user', {
            body: { lastName, address },
            method: "PUT",
            errorMessage: "An error occur updating your profile"
        });
        // The request payload would be a FormData.
    }
}
```
## useRequest
```jsx
const [{data, loading, success, error, message}, makeRequest] = useRequest();
```
The `useRequest` hook provides the request metadata which are:
- Request state
    - data: `Any` The data returned from the request.
    - loading: `Boolean` value indicating whether the request is ongoing.
    - success: `Boolean` value indicating if the request succeeded.
    - error: `Boolean` value indicating if the request failed.
    - message: `String` either the error or success message that could be retrieve from the request.
    - previousData: `Any` The data returned from the previous request. 
    - refetch: `Function` A function that allows you to initiate a network request using the configuration of the most recent network request. It accepts an optional parameter, which represents query parameters. You can provide a partial set of query parameters, and these will be merged with the initial query parameters. When the `refetch` function is called, it disregards any cached responses from previous network requests and initiates a new network request. This ensures that you obtain fresh data from the server or endpoint.
### Parameter Properties
`useRequest` it accepts two optional parameters. 

The first parameters is an objects that allows of the below properties:
| Properties | Description | 
|  ---  |  ---  |
|  name  | The name of the request. This should be a unique identifier, different from any other name given to other request in your application. It is used to retrieve request data stored in the application `state`, `localStorage` or `sessionStorage`.  |
|  baseUrl | The base URL of requests made by the `makeRequest` function. `makeRequest` can be provided with path instead of absolute url, if the `baseUrl` is assigned a value.  |
|  onSuccess  | A callback function that gets invoked when the request succeed. It receives the request's metadata, which includes the response body & derived success message if any. This callback can be used to perform any necessary operations when the request succeeds.  |
|  onMount  | A callback function that is called once your component mounts, it returns a `makeRequest` function as an argument, that could be used to make a request on mount of the components.  |
|  onError  | A callback function that gets invoked when the request fails. It receives the request's metadata, which includes the error body & derived error message if any. This callback can be used to perform any necessary operations when the request encounters an error.  |
| interceptors  | This allow request to be intercepted at the component level before the call is being made or  before the response are being passed to the component state. It allows two optional function parameters, which are `response` and `request`. See more about [intercpetors](#interceptors)  |
|  localStorage | A `Boolean` value that determines if the request's response data should be stored in local storage. The stored value can be retrieved from any part of the application using the `useRequestData` with the `name` property.  |
| sessionStorage | A `Boolean` value that determines if the request's response data should be stored in session storage. The stored value can be retrieved from any part of the application using the `useRequestData` with the `name` property.  |
|  memoryStorage  | A `Boolean` value that determines if the request's response data should be stored in the application memory(state). A browser refresh would cause the data stored to be lost, except the request is made again. The stored value can be retrieved from any part of the application using the `useRequestData` with the `name` property.  |
| onUploadProgress | A `Function` that recieves progress events for uploads. @note available only when axios is provided in the `RequestProvider`. |
| onDownloadProgress | A `Function` that recieves progress events for downloads. @note available only when axios is provided in the `RequestProvider`.  |
| enableRequest | Determines whether the request should be made to the server. If it's an array, waits until none of its items are undefined, null, or an empty string. If it's a non-array, waits until it resolves to a truthy value or 0.  |
| validateStatus | `validateStatus` defines whether to resolve or reject the promise for a given HTTP response status code. @note available only when axios is provided in the `RequestProvider`.  |

The second parameter is a dependency array. When values in this array change, they trigger a rerun of the network request specified in the onMount property of the first parameter. If a network call is in progress when a dependency update occurs, that call is canceled.

### Usage Examples
```jsx
import { useRequest } from 'react-http-query';

const App = () => {
    const [enableButton, setEnableButton] = useState(true);
    const [{loading}, makeLoginRequest] = useRequest({
        name: 'user-profile',
        baseUrl: 'https://example.com',
        onSuccess: (response) => {
            /**
             * response data details
             * `statusText`: Request status text.
             * `headers`: Request headers.
             * `data`: Request response data.
             * `status`: Request status code.
             */
            navigate(`/dashboard/${response.data.data.id}`);
        },
        onError: (error) => {
            /**
             * error data details
             * `statusText`: Request status text.
             * `headers`: Request headers.
             * `data`: Request response data.
             * `status`: Request status code.
             */
            showToast(error.data.message);
            setEnableButton(true);
        },
        localStorage: true,
    });

    const onSubmitButtonClick = ({username, password}) => {
        setEnableButton(false);
        makeLoginRequest('/user/login', {
            body: { username, password },
            successMessage: "Login Successful!"
        });
    }
    ...
}
```
Refetch example.

```jsx
import { useRequest } from 'react-http-query';

const App = () => {
    const [{refetch}] = useRequest({
        onMount: (makeUserListRequest) => 
            // request url would be `https://base-url.com/users?page=1&limit=20`
            makeUserListRequest('/users', { query: { page: 1, limit: 20 }})
    });

    return (
        // `refetch` takes an optional query params which would be merged with previous query 
        // params.
        // request url would be `https://base-url.com/users?page=2&limit=20` retaining the limit
        // query params.
        <button onClick={() => refetch({ page: 2 })}>Page 2</button>
    )
    ...
}
```
Interceptor example.
```jsx
import { useRequest } from 'react-http-query';

const App = () => {
    const [{loading}, makeActivitiesRequest] = useRequest({
        baseUrl: 'https://example.com',
        interceptors: {
            // Do anything before sending the request, including updating the  request headers, body,
            //method, query parameters and url.
            request: (payload) => ({
                ...payload,
                headers: {
                    ...payload.headers,
                    Authorization: `Bearer ${authToken}`
                }
            })
        }
    });

    const onFetchActivities = () => {
        makeActivitiesRequest('/user/activities');
    }
    ...
}
```
## Request Provider
The request provider provides a powerful means of managing/configuring all application request from a single point, such as intercepting & updating all requests, displaying error and success toast, setting loaders to be displayed for all requests, setting baseUrl and using path at every other point in your application and many more. It should ideally be the parent component to every other component making use of the `useRequest()` in your application. The properties table below shows all properties that can be assigned to the request provider
### Properties
|  Property  |  Description  | Default  |
| --- | --- | --- |
| authToken |  Header authorization token. If provided it adds an Authorization bearer token to request's header. To exempt any request, set the `bearer` property of `makeRequest` to false  |    | 
| baseUrl | Base url that would be prepend to relative path passed to `makeRequest` function. `baseUrl` set in `useRequest` takes precedence over this. If an absolute url is provided to `makeRequest`, it overrides the base URL. |  |
| requestTimeout | Allowed duration in `milliseconds` for all request within the applications. When request duration exceeds this value, the request will be aborted. `timeout` set in `makeRequest` takes precedence over this. | ∞ |
| onSuccess | A callback function that is called when any request within the application succeeds. The request's response data is passed down to it. The callback can be used to perform any form of operations at the app level, such as showing success toast. A popup/toast component can be returned to be rendered on request success.  |  |
| onError | A callback function that is called when any request within the application fails. The error data is passed down to it. The callback can be used to perform any form of operations at the app level, such as showing error toast or rerouting on `401` error status code. A popup/toast component can be returned to be rendered on request error. | |
| onLoading | A callback function that is called when any request loading state changes. A loader component can be returned to be rendered when loading is `true`. |  |
| popupTimeout | Display timeout in `seconds` for error or success popup returned in onError or onSuccess callback respectively. | `8s` |
| interceptors  | This allow request to be intercepted at the app level before the call is being made or  before the response are being passed to the component state. It allows two optional function parameters, which are `response` and `request`. See more about [intercpetors](#interceptors)  |  |
| axiosInstance  | An Axios request instance. This library enables you to supply an axiosInstance, which will be utilized for making requests instead of the default underlying fetch function. When provided, `onDownloadProgress` and `onUploadProgress` can be used in conjunction with `useRequest`  |  |
### Usage Examples
```js
import { useRequest, RequestProvider } from 'react-http-query';

const Profile = () => {
    const [{ data, loading }] = useRequest({
        // The baseUrl set in the RequestProvider would be prepend to the path of this request
        onMount: (makeRequest) => makeRequest('/profile')
    });

    return (
        <>
            { !loading && data 
                && <div>
                    <div>{data.user.name}</div>
                    <div>{data.user.age}</div>
                </div>
            }
        </>   
    )
}

const App = () => {

    return (
        {/* The RequestProvider can be implemented in a separate file and then use in your
          * App component. This so you will separate the concerns of the request configuration and
          * keep your app.js file clean. 
          */
         }
        <RequestProvider
            baseUrl="https://www.example.com"
            authToken={authToken}
            onError={(error) => {
                return <Toast message={error.data.message} />
            }}
            interceptors={{
                request: (payload) => ({
                    ...payload,
                    headers: {
                        ...payload.headers
                        // All request from the application would have this `csfrToken` on the request header
                        "x-csfr-token": csfrToken
                    }
                }),
                response: (payload) => {
                    // Action could be performed base on the request status, like navigating to the login page on invalid authentication
                    // error response.
                    if (payload.status === 401) {
                        navigate('/login');
                    }
                }
            }}
            // Timeout in `seconds` to show toast messages if provided.
            popupTimeout={10}
            // Request abort timeout in `milliseconds` if request duration exceeds the set `requestTimeout`
            requestTimeout={10000}
        >
            <Profile />
        </RequestProvider>
    )
}
```
## useRequestConfig
The `useRequestConfig` returns properties that can be used to configure the application request from any part of the application. It also returns loading, that is either `true` or `false` depending on whether there is an ongoing request. Below are properties returned by `useRequestConfig`:
- `loading`: loading state of requests within the application.
- `setAuthToken`: Set the Authorization bearer token to be used for all requests. This could be after the user must have login to the application.
- `setBaseUrl`: Set the base URL to be used for all requests.
```js
const { loading, setAuthToken, setBaseUrl } = useRequestConfig();

// Set the auth token that would be used by all request within the application
setAuthToken(authToken);
```
## useRequestData
`useRequestData` is used to retrieve data save to the `localStorage`, `sessionStorage`, or `memoryStorage` using the assigned name. It allows two positional arguments
| Argument | Description | Allowed Values | Required |
| --- | --- | --- | --- |
| name | The assigned request name. | `string` | yes |
| storageLocation | The location specified for the data to be stored. If not provided, it checkes through all locations. If provided, it checks only the location and if not found, it returns `undefined` | `memory` \| `session` \| `local` | no |

### Usage Examples
```js
...
import { useRequest, RequestContext, useRequestData } from 'react-http-query';

const Login = () => {
    const [{}, makeLoginRequest] = useRequest({ 
        name: "user-profile", 
        localStorage: true,
        interceptors: {
            // The interceptor is to ensure only the user information is saved to the local storage,
            // rather than saving all information coming from the server, which could includes statusCode, successMessage, etc.
            response: (payload) => ({
                ...payload,
                data: payload.data?.data
            })
        } 
    })
    ...
}

const Dashboard = () => {
    const userProfile = useRequestData("user-profile", "local");
    const { setAuthToken } = useContext(RequestContext);

    React.useEffect(() => {
        setAuthToken(userProfile?.token);
    }, [setAuthToken, userProfile?.token])
    ...
}
```
`useRequestData` is not the only means of retrieving saved data. When data are saved to either the `memoryStorage`, `sessionStorage`, or `localStorage` and another request is made to the same endpoint, a check will be made to see if there is an existing saved data, if there is it returns the saved data, otherwise it makes another round of request. A new request will be made if there is a change in the query parameters or `forceRefetch` is set to `true` in the `makeRequest` config. This is especially useful for static data, such as list of countries, etc. as it reduces the number of server call.
```js
const FirstCall = () => {
    [{}] = useRequest({ 
        memoryStorage: true,
        // Request gets to the sever, as this is the first call.
        onMount: (makeCountryLookupRequest) => makeCountryLookupRequest('/lookup/countries')
    });
}

const SecondCall = () => {
    // It is important to still set memoryStorage to true, on subsequent requests
    // This would ensure that the response are cached as well, if another call is made to the server.
    [{}] = useRequest({ 
        memoryStorage: true,
        // Request will not get to the server, saved data from the memory would be retrieved.
        // Response time would be faster than first call.
        onMount: (makeCountryLookupRequest) => makeCountryLookupRequest('/lookup/countries')
    });
}

const ThirdCall = () => {
    [{}] = useRequest({ 
        memoryStorage: true,
        // Request gets to the sever, because `forceRefetch` is set to `true`
        onMount: (makeCountryLookupRequest) => {
            makeCountryLookupRequest('/lookup/countries', { forceRefetch: true })
        }
    });
}
```
## Interceptors
Interceptors are means to intercept requests, perform actions based on the request payload or update the request payload and intercept responses and perform given actions based on the response payload.
Interceptors can be added to `RequestProvider` which is the app level interceptor, as it intercept all requests call within the application. Interceptors can also be added to `useRequest`, this only intercept the requests call made with the `makeRequest` function derived from the `useRequest`.
When interceptor is provided both at the app level and also to `useRequest`, payload goes through the app level interceptor before getting to the `useRequest` interceptor. An update made to the payload at the app level interceptor would be available in the payload at the `useRequest` interceptor.
### Request
Request interceptor intercept outgoing requests.
```js
const App = () => {
    return (
        <RequestProvider
            baseUrl="https://www.example.com"
            interceptors={{
                request: (payload) => {
                    // Below are all the properties of the request interceptor payload.
                    // payload.headers
                    // payload.body
                    // payload.url
                    // payload.method
                    // payload.queryParam
                    return {
                        ...payload,
                        headers: {
                            ...payload.headers
                            "x-request-id": "1234"
                        }
                    }
                }
            }}
        >
            <Profile />
        </RequestProvider>
    )
}


const Profile = () => {
    const [{}, makeRequest] = useRequest({
        interceptors: {
            request: (payload) => {
                // The information added at the app level interceptor would be available in this 
                // interceptor. It's set value can be overwritten.
                console.log(payload.headers["x-request-id"]) // 123
                delete payload.headers["x-request-id"];
                return payload
            }
        }
    })
}
```
### Response
Response interceptor intercept incoming responses.
```js
const App = () => {
    return (
        <RequestProvider
            baseUrl="https://www.example.com"
            interceptors={{
                response: (payload) => {
                    // Below are all the properties of the response interceptor payload.
                    // payload.data
                    // payload.status
                    // payload.url
                    // payload.method
                    // payload.queryParam

                    // Only the data properties can be updated. Other properties are read-only.
                    return {
                        ...payload,
                        data: {
                            ...payload.data,
                            url: payload.url
                        }
                    }
                }
            }}
        >
            <Profile />
        </RequestProvider>
    )
}


const Profile = () => {
    const [{}, makeRequest] = useRequest({
        interceptors: {
            response: (payload) => {
                // The information added at the app level interceptor would be available in this 
                // interceptor
                console.log(payload.data.url) // prints the url added at the app level interceptor.
            }
        }
    })
}
```