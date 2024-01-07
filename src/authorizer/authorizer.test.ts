import { APIGatewayAuthorizerResult, APIGatewayProxyResult } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import { handler } from './index'
import { CustomAPIGatewayProxyEvent } from './types';
import { CONSTANTS } from '../common/constants';


describe('Authorizer Handler',() => {

    test('should return 200 status code and expected response when token is valid', async () => {
        const mockedDecodedValue = {
            iat: 123123123,
            username: 'Ram',
            access: 'admin'
        };
        const verifyMock = jest.spyOn(jwt, 'verify') as jest.Mock;
        verifyMock.mockResolvedValueOnce(mockedDecodedValue);
    
        const result = await handler({
            methodArn: '132132123',
            requestId: '1234567890',
            authorizationToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        } as unknown as CustomAPIGatewayProxyEvent) as APIGatewayAuthorizerResult;
        console.log(result);
        
      
        expect(result.principalId).toBeTruthy();
        expect(result.policyDocument.Statement[0].Effect).toBe('Allow');
    });
    test('should return 500 status code and expected response when token is invalid', async () => {
        const mockedDecodedValue = false;
        const verifyMock = jest.spyOn(jwt, 'verify') as jest.Mock;
        verifyMock.mockResolvedValueOnce(mockedDecodedValue);
    
        const result = await handler({
            methodArn: '132132123',
            requestId: '1234567890',
            authorizationToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        } as unknown as CustomAPIGatewayProxyEvent) as APIGatewayAuthorizerResult;

        expect(result.principalId).toBeTruthy();
        expect(result.policyDocument.Statement[0].Effect).toBe('Deny');
    });

    test('should return 500 status code and expected response when token is missing', async () => {
        const result = await handler({
            methodArn: '132132123',
            requestId: '1234567890',
        } as unknown as CustomAPIGatewayProxyEvent) as APIGatewayAuthorizerResult;
      
        expect(result.principalId).toBeTruthy();
        expect(result.policyDocument.Statement[0].Effect).toBe('Deny');
    });
});