import { APIGatewayProxyResult } from 'aws-lambda';
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
            authorizationToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        } as unknown as CustomAPIGatewayProxyEvent) as APIGatewayProxyResult as any;
        console.log(result);
        
      
        expect(result.principalId).toBeTruthy();
    });
    test('should return 500 status code and expected response when token is invalid', async () => {
        const mockedDecodedValue = false;
        const verifyMock = jest.spyOn(jwt, 'verify') as jest.Mock;
        verifyMock.mockResolvedValueOnce(mockedDecodedValue);
    
        const result = await handler({
            authorizationToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        } as unknown as CustomAPIGatewayProxyEvent) as APIGatewayProxyResult;
        console.log(result);
        
      
        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toBe(CONSTANTS.AUTHORIZATION_TOKEN_INVALID);
    });

    test('should return 500 status code and expected response when token is missing', async () => {
        const result = await handler({} as unknown as CustomAPIGatewayProxyEvent) as APIGatewayProxyResult;
      
        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toBe(CONSTANTS.AUTHENTICATION_TOKEN_MISSING);
    });
});