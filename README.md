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
            && <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                    <tr>
                </thead>
                <tbody>
                    { data.items?.map((item) => (
                        <tr>
                            <td>{item.name}</td>
                            <td>{item.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        }
        {
            error && !loading 
                && <div>An error occur fetching user</div>
        }
    </>)
}
```