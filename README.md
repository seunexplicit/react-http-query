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
- [Request Context](#request-context)
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
- A mandatory url, which could be an absolute url or a relative path if base url is provided in either the `useRequest` hook or `Request Provider` that wraps all your app components.
- An optional configuration object. It takes all properties that can be passed to window `fetch` function and some additional properties that is discussed below.
### Configuration
| Property | Description | Default |
| --- | --- | --- |
| method | This could be one of  `GET`, `POST`, `PUT`, `PATCH`, `HEAD`, `OPTIONS`. it determines the type of request that is to be made | `GET` if there is no request *body*. `POST` if there is a request body |
| body | Request body. Any accepted type of body by fetch including an _object_ (`{value: 3}`, which implies you don't have to stringify the payload). |   |
| formData | To send a `FormData` body payload, the payload can be passed to `formData` as javascript object instead of `body`, which converts the data to a `FormData` before sending the request. |    |
| retries | Number of times to retry the request if there is a non-server error such as: Request Timeout, Network Error etc. | 1 |
| bearer | A `Boolean` value, that determines whether Authorization bearer token should be added to request header. See [Request Provider Properties](#properties) for more context. |  true  |
| timeout | Request allowed duration in `milliseconds`. When request duration exceeds this value, the request will be aborted. |   |
| useBaseUrl | Determines whether to use the base URL passed to either the `useRequest` hook or the `RequestProvider` and use the url passed to the `makeRequest` function as path regardless of if it is an absolute url or a path. There would most likely not be a need for this as the library can determine whether to use the baseUrl based on what is passed to the `makeRequest` function. | false |
| errorMessage | Request error message. The library tries to get the error message from the response payload and returns it in the state message prop, but this override any error message gotten from the response payload |     |
| successMessage | Response success message. The library tries to get the success message from the response payload and returns it in the state message prop, but this override any success message gotten from the response payload |   |
| headers  | Request headers. If the headers property as passed to the headers `append` it append it to any generated headers by the library otherwise it will override any generated header |   | 
| query  | Request query parameters. It adds any assigned value the request url as query parameters |   |

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
    - data: The request returned data.
    - loading: `Boolean` value indicating whether the request is ongoing.
    - success: `Boolean` value indicating if the request succeeded.
    - error: `Boolean` value indicating if the request failed.
    - message: `String` either the error or success message that could be retrieve from the request.
- makeRequest: The function used to initiate the request.
### Parameter Properties
`useRequest` also accepts an optional parameters, which allows the following properties:
| Properties | Description | 
|  ---  |  ---  |
|  name  | The name of the request. This should be a unique identifier, different from any other name given to other request in your application. It is used to retrieve request data stored in the application `state`, `localStorage` or `sessionStorage`.  |
|  baseUrl | The base URL of requests made by the `makeRequest` function. `makeRequest` can be provided with path instead of absolute url, if the `baseUrl` is assigned a value.  |
|  onSuccess  | A callback function that is called when the request succeeds. The request's response data is passed down to it. The callback can be used to perform any required operations when the request succeeds.  |
|  onError  | A callback function that is called when the request fails. The request's response error body is passed down to it. The callback can be used to perform any required operations when the request fails.  |
| interceptors  | This allow request to be intercepted at the component level before the call is being made or  before the response are being passed to the component state. It allows two optional function parameters, which are `response` and `request`. See more about [intercpetors]()  |
|  localStorage | A `Boolean` value that determines if the request's response data should be stored in local storage. The stored value can be retrieved from any part of the application using the `useRequestData` with the `name` property.  |
| sessionStorage | A `Boolean` value that determines if the request's response data should be stored in session storage. The stored value can be retrieved from any part of the application using the `useRequestData` with the `name` property.  |
|  memoryStorage  | A `Boolean` value that determines if the request's response data should be stored in the application memory(state). A browser refresh would cause the data stored to be lost, except the request is made again. The stored value can be retrieved from any part of the application using the `useRequestData` with the `name` property.  |
### Usage Examples
```jsx
import { useRequest } from 'react-http-query';

const App = () => {
    const [enableButton, setEnableButton] = useState(true);
    const [{loading}, makeLoginRequest] = useRequest({
        name: 'user-profile',
        baseUrl: 'https://example.com',
        onSuccess: (response) => {
            navigate(`/dashboard/${response.data.id}`);
        },
        onError: (error) => {
            showToast(error.message);
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
| interceptors  | This allow request to be intercepted at the app level before the call is being made or  before the response are being passed to the component state. It allows two optional function parameters, which are `response` and `request`. See more about [intercpetors]()  |  |
### Usage Examples
```js
import React from 'react';
import { useRequest, RequestProvider } from 'react-http-query';

const Profile = () => {
    const [{ data, loading }, makeRequest] = useRequest();

    React.useEffect(() => {
        // The baseUrl set in the RequestProvider would be prepend to the path of this request
        makeRequest('/profile');
    }, [])

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
                return <Toast message={error.message} />
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
## Request Context
The `RequestContext` must be used along side the `RequestProvider`, it give access to the following properties:
- `loading`: Get loading state of requests from any component within the application.
- `baseUrl`: Get the current base URL that is being used for request.
- `setAuthToken`: Set the Authorization bearer token to be used for all requests. This could be after the user must have login to the application.
- `setBaseUrl`: Set the base URL to be used for all requests.
```js
const { loading, baseUrl, setAuthToken, setBaseUrl } = useContext(RequestContext);

setAuthToken(authToken);
```
## useRequestData
`useRequestData` is used to retrieve data save to the `localStorage`, `sessionStorage`, or `memoryStorage` using the assigned name. It allows two arguments
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
    [{}, makeCountryLookupRequest] = useRequest({ memoryStorage: true });

    React.useEffect(() => {
        // Request gets to the sever, as this is the first call.
        makeCountryLookupRequest('/lookup/countries');
    }, [])
}

const SecondCall = () => {
    // It is important to still set memoryStorage to true, on subsequent requests
    // This would ensure that the response are cached as well, if another call is made to the server.
    [{}, makeCountryLookupRequest] = useRequest({ memoryStorage: true });

    React.useEffect(() => {
        // Request will not get to the server, saved data from the memory would be retrieved.
        // Response time would be faster than first call.
        makeCountryLookupRequest('/lookup/countries');
    }, [])
}

const ThirdCall = () => {
    [{}, makeCountryLookupRequest] = useRequest({ memoryStorage: true });

    React.useEffect(() => {
        // Request gets to the sever, because `forceRefetch` is set to `true`
        makeCountryLookupRequest('/lookup/countries', { forceRefetch: true });
    }, [])
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