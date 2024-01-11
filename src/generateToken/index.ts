import * as jwt from 'jsonwebtoken';
import { CONSTANTS } from '../common/constants'
import { getLogger } from 'common/logger';
import { APIGatewayProxyResult } from 'aws-lambda';

const logger = getLogger(__filename);

// Environment Variables!
const JWT_SECRET_KEY = process.env.JWT_SECRET || '';
const JWT_EXPIRY = process.env.JWT_TOKEN_EXPIRY_IN_MINS;
const API_KEY = process.env.NODE_API_KEY;
const API_PASS = process.env.NODE_API_PASS;

export const handler = async (
  event: any,
): Promise<APIGatewayProxyResult> => {
  try {

    logger.info('generate-token', {
      step: 'init',
      event,
    });

    const { headers } = event;
    if(!headers || !headers.apiKey || !headers.apiPass) {
      logger.error('generate-token', {
        step: 'error',
        error: CONSTANTS.BAD_GATEWAY,
      });
      throw new Error(CONSTANTS.BAD_GATEWAY)
    }

    if(headers.apiKey !== API_KEY || headers.apiPass !== API_PASS) {
      logger.error('generate-token', { 
        step: 'error',
        error: CONSTANTS.GENERATE_TOKEN.INVALID_API_PASS
      });
      throw new Error(CONSTANTS.GENERATE_TOKEN.INVALID_API_PASS)
    }

    const accessToken = jwt.sign({ username: headers.apikey }, JWT_SECRET_KEY, {
      expiresIn: `${CONSTANTS.JWT.DEFAULT_EXPIRY}m`,
    });

    logger.info('generate-token', { 
      step: 'token generated successfully',
      accessToken
    });

    const apiGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({
        status: CONSTANTS.STATUS_CODE.SUCCESS,
        message: CONSTANTS.OK,
        data: { accessToken },
      }),
    };

    logger.info('generate-token', { 
      step: 'end',
      apiGatewayProxyResult
    });

    return apiGatewayProxyResult
  } catch (error) {
    logger.error('generate-token', { 
      step: 'error',
      error: error.message
    });
    return {
      statusCode: error.status || CONSTANTS.STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
