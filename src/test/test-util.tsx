import React from 'react'
import { RequestProvider } from '../lib'
import { RequestProviderProps } from '../lib/index.d'

export const RequestWrapper = (props: Omit<RequestProviderProps, 'children'>) => 
  ({children}: {children: React.ReactNode}) => {
    return (
      <RequestProvider {...props}>
          {children}
      </RequestProvider>
    )
  }


export const MessagePopup = ({ message }: any) => (<div 
  style={{position: 'absolute'}}>
    <span>{ message }</span>
</div>)

export const __STORAGE_NAME_PREFIX__ = 'react-http-request';

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

export const mockWindowProperty = (property: string | any, value: any) => {
  const { [property]: originalProperty } = window
  delete window[property]
  beforeAll(() => {
    Object.defineProperty(window, property, {
      configurable: true,
      writable: true,
      value,
    })
  })
  afterAll(() => {
    window[property] = originalProperty
  })
}

/**
 * Set a delay
 * 
 * @param time Time in milliseconds
 * @returns 
 */
export const delay = (time: number) => {
  return new Promise((resolve, ) => {
    setTimeout(() => {
      console.log({ time, resolve })
      resolve('')
    }, time);
  });
}

export * from '@testing-library/react';
