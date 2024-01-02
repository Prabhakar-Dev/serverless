import * as jwt from 'jsonwebtoken';
import { CONSTANTS } from '../common/constants'
import { getLogger } from 'common/logger';

const logger = getLogger(__filename);

// Environment Variables!
const JWT_SECRET_KEY = process.env.JWT_SECRET || '';
const JWT_EXPIRY = process.env.JWT_TOKEN_EXPIRY_IN_MINS;

const verifyToken = async (token: string): Promise<Record<string, any>> => {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET_KEY) as Record<string, any>;
    return decoded;
  } catch (error) {
    throw new Error(CONSTANTS.AUTHORIZATION_TOKEN_INVALID);
  }
};

export const handler = async (event: any) => {
  try {
    logger.info('authorizer', {
      step: 'init',
      event
    })

    const authorizationHeader = event.headers?.Authorization;
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
    return {
      statusCode: 200,
      body: JSON.stringify({
        principalId: Math.random()
      }),
    };
   
  } catch (error) {
    logger.error('authorizer', {
      step: 'error',
      error: error.message
    })
    return {
      statusCode: error.status || CONSTANTS.STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
