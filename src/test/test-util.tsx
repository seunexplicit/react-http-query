import React, {ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import { RequestProvider } from '../lib'

const RequestWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <RequestProvider baseUrl={''}>
        {children}
    </RequestProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: RequestWrapper, ...options})

export const __MOCK_DATA__ = {
  body: { 
    data: {
      name: 'react-http-query',
      message: 'Request 1 Successful' 
    }
  },
  status: 200,
};

export const __BAD_RESPONSE__ = {
  status: 400,
  body: {
    message: "Bad request"
  }
}

export const GOOD_URL = 'http://www.good-url.com/';
export const BAD_URL = 'http://www.bad-url.com/'

export const setupMockupRequest = () => {
  fetchMock.mockResponse(req => {
    return req.url === GOOD_URL
      ? Promise.resolve(JSON.stringify(__MOCK_DATA__))
      : Promise.reject(__BAD_RESPONSE__)
})
}

export * from '@testing-library/react'
export {customRender as render}