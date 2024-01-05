import * as jwt from 'jsonwebtoken';
import { CONSTANTS } from '../common/constants'
import { getErrorResponse } from '../common/errorFormatting'
import { getLogger } from '../common/logger';
import { CustomAPIGatewayProxyEvent } from './types';
import { APIGatewayAuthorizerResult } from 'aws-lambda';

const logger = getLogger(__filename);

// Environment Variables!
const JWT_SECRET_KEY = process.env.JWT_SECRET || '';

const verifyToken = async (token: string): Promise<Record<string, number | string | unknown>> => {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET_KEY) as Record<string, number | string | unknown>;
    return decoded;
  } catch (error) {
    throw new Error(CONSTANTS.AUTHORIZATION_TOKEN_INVALID);
  }
};

export const handler = async (event: CustomAPIGatewayProxyEvent) => {
  try {
    logger.info('authorizer', {
      step: 'init',
      event: JSON.stringify(event),
    })

    const authorizationHeader = event.authorizationToken;
    
    if (!authorizationHeader) {
      logger.error('authorizer', {
        step: 'token missing in header',
        error: CONSTANTS.AUTHENTICATION_TOKEN_MISSING
      })
      throw new Error(CONSTANTS.AUTHENTICATION_TOKEN_MISSING);
    }
    
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = await verifyToken(token);

    if(!decodedToken) {
      logger.error('authorizer', {
        step: 'token verifying failed',
        error: CONSTANTS.AUTHORIZATION_TOKEN_INVALID
      })
      throw new Error(CONSTANTS.AUTHORIZATION_TOKEN_INVALID)
    }

    logger.info('authorizer', {
      step: 'end',
      decodedToken
    });
    return generatePolicy(`${decodedToken.iat}`, 'Allow', event.methodArn);
  } catch (error) {
    logger.error('authorizer', {
      step: 'error',
      error: JSON.stringify(error),
    })
    return getErrorResponse(error);
  }
};

const generatePolicy = (principalId: string , effect: string, resource: string) => {
  const authResponse: APIGatewayAuthorizerResult = {
      principalId,
      policyDocument: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
        Version: ''
      },
  };
  return authResponse;
};