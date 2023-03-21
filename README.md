## Table of contents
- [Simple Usage](#simple-usage)
- [makeRequest](#makeRequest)
    - [Configurations]()
    - [Usage Examples]()
        - [GET](#get)
        - [POST](#post)
        - [Form Data Request](#form-data-request)
        - [Other Request Methods](#other-request-methods)
- [useRequest](#useRequest)
    - [Parameter Properties](#parameter-properties)
    - [Usage Examples]()
- [Request Provider](#request-provider)
    - [Properties]()
    - [Usage Examples]()
- [useRequestData](#useRequestData)
    - [Parameters]()
    - [Usage Examples]()

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
| bearer | Header authorization token. If provided it adds an Authorization property to the request header. |    |
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
            mehod: "PUT"
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
|  name  | The name of the request. This should be a unique identifier, different from any other name given to other request in your application. It is used to retrieve request data stoared in the application `state`, `localStorage` or `sessionStorage`.  |
|  baseUrl | The base URL of requests made by the `makeRequest` function. `makeRequest` can be provided with path instead of absolute url, if the `baseUrl` is assigned a value.  |
|  onSuccess  | A callback function is called when the request succeeds. The request's response data is passed down to it. The callback can be used to perform required operations when the request succeeds.  |
|  onError  | A callback function is called when the request fails. The request's response error body is passed down to it. The callback can be used to perform required operations when the request fails.  |
| interceptors  | This allow request to be intercepted before the call is being made or the response, before they are being passed to the component state. It allows two optional function parameters, which are `response` and `request`. See more about [intercpetors]()  |
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
