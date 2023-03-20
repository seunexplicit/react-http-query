## Table of contents
- [Simple Usage](#simple-usage)
- [makeRequest](#makeRequest)
    - [Configurations]()
- [useRequest](#useRequest)
    - [Parameters]()
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
| method | This could be one of  `GET`, `POST`, `PUT`, `PATCH`, `HEAD`, `OPTIONS`. it determines the type of request that is to be made | `GET` if there is request *body*. `POST` if there is a request body |
| body | Request body. Any accepted type of body by fetch including an ~object~ (`{value: 3}`, which implies you don't have to stringify the payload). |   |
| formData | To send a `FormData` body payload, the payload can be passed to `formData` as javascript object instead of `body`, which converts the data to a `FormData` before sending the request. |    |
| retries | Number of times to retry the request if there is a non-server error such as: Request Timeout, Network Error etc. | 1 |
| bearer | Header authorization token. If provided it adds an Authorization property to the request header. |    |
| timeout | Request allowed duration in `milliseconds`. When request duration exceeds this value, the request will be aborted. |   |
| useBaseUrl | Determines whether to use the base URL passed to either the `useRequest` hook or the `RequestProvider` and use the url passed to the `makeRequest` function as path regardless of if it is an absolute url or a path. There would most likely not be a need for this as the library can determine whether to use the baseUrl based on what is passed to the `makeRequest` function. | false |
| errorMessage | Request error message. The library tries to get the error message from the response payload and returns it in the state message prop, but this override any error message gotten from the response payload |     |
| successMessage | Response success message. The library tries to get the success message from the response payload and returns it in the state message prop, but this override any success message gotten from the response payload |   |
| headers  | Request headers. If the headers property as passed to the headers `append` it append it to any generated headers by the library otherwise it will override any generated header |   | 
| query  | Request query parameters. It adds any assigned value the request url as query parameters |   |

