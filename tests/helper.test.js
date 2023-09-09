import { getErrorMessage, getSuccessMessage } from "../lib/helpers/get-messages";
import { getStatusMessage } from "../lib/helpers/get-status-message";

describe('Helper Funcs', () => {
    describe('getSuccessMessage()', () => {
        it('should return an empty string if no messages are available', () => {
            expect(getSuccessMessage({})).toBe('')
        })

        it('should return request config message when request config `successMessage` & request data message is available', () => {
            expect(getSuccessMessage(
                { message: 'request data message'}, 
                { requestConfig: { successMessage: 'successMessage'} })
            ).toBe('successMessage')
        })

        it('should return request config message when request config `metadata` & request data message is provided', () => {
            expect(getSuccessMessage(
                { message: 'request data message'}, 
                { requestConfig: { metadata: { successMessage: 'metadata' } } })
            ).toBe('metadata')
        })

        it('should return `successMessage` when `successMessage` and `metadata` message is provided', () => {
            expect(getSuccessMessage(
                {}, 
                { requestConfig: { successMessage: 'successMessage', metadata: { successMessage: 'metadata' } } })
            ).toBe('successMessage')
        })

        it('should try to return request data message if available', () => {
            expect(
                getSuccessMessage({ data: { message: 'request data message' } })
            ).toBe('request data message')
        })
    })

    describe('getErrorMessage()', () => {
        it('should return an empty string if no messages are available', () => {
            expect(getErrorMessage({})).toBe('')
        })

        it('should return request config message when request config `errorMessage` & request error message is available', () => {
            expect(getErrorMessage(
                { message: 'request data message'}, 
                { requestConfig: { errorMessage: 'errorMessage'} })
            ).toBe('errorMessage')
        })

        it('should return `metadata` error message when request config `metadata` & request error message is provided', () => {
            expect(getErrorMessage(
                { message: 'request data message'}, 
                { requestConfig: { metadata: { errorMessage: 'metadata' } } })
            ).toBe('metadata')
        })

        it('should return `errorMessage` when `errorMessage` and `metadata` message is provided', () => {
            expect(getErrorMessage(
                {}, 
                { requestConfig: { errorMessage: 'errorMessage', metadata: { errorMessage: 'metadata' } } })
            ).toBe('errorMessage')
        })

        it('should try to return request data message if available', () => {
            expect(
                getSuccessMessage({ data: { message: 'request data message' } })
            ).toBe('request data message')
        })
    })

    describe('getStatusMessage()', () => {
        it('should return empty message if status not provided', () => {
            expect(getStatusMessage()).toBe('')
        })

        it('should return empty message if status not available', () => {
            expect(getStatusMessage(600)).toBe('')
        })

        it('should return correct status message', () => {
            expect(getStatusMessage(300)).toBe('Multiple Choices')
        })
    })
});