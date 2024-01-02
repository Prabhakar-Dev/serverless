import {
  APIGatewayProxyResult,
} from 'aws-lambda';
import { getLogger } from '../common/logger';
import MuniBiilingService from '../common/muniBillingService';
import { CONSTANTS } from '../common/constants'
import { CustomAPIGatewayProxyEvent, IMerchant, IMerchantResponse } from './types';
import {
  getMerchantMapping,
} from '../common/mapping';

const logger = getLogger(__filename);

export const handler = async (
  event: CustomAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('merchant', {
      step: 'init',
      event
    })
     // Access path variables
     const { path: pathParameters } = event;
     
     const merchantCode: string = pathParameters && pathParameters.merchantCode;
     const result =  await getMerchantDetails(merchantCode);
     logger.info('merchant', {
        step: 'fetched merchant details',
        result
     })
     
    const apiGatewayProxyResult =  {
      statusCode: 200,
      body: JSON.stringify(result),
    };

    logger.info('merchant', {
      step: 'end',
      apiGatewayProxyResult
   })
   return apiGatewayProxyResult;
  } catch (error) {
    logger.error('merchant', {
      step: 'error',
      error: error.message
    })
    return {
      statusCode: error.status || CONSTANTS.STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function getMerchantDetails(merchantCode: string) {
  try {
    logger.info('merchant', {
      step: 'initiate to fetch merchant details',
      params: { merchantCode }
    })
    const service = new MuniBiilingService()
    const [merchant]: [IMerchant] = await service.findMerchantByIvrCode(merchantCode);
    logger.info('merchant', {
      step: 'fetched merchant details by merchant code',
      merchant
    })
    const response: IMerchantResponse =  await getMerchantMapping(merchant, merchantCode);
    logger.info('merchant', {
      step: 'Created final response',
      mapResponse: response
    })

    const finalResponse =  {
      status: CONSTANTS.STATUS_CODE.SUCCESS,
      message: CONSTANTS.OK,
      data: response
    };
    logger.info('merchant', {
      step: 'end',
      finalResponse
    })

    return finalResponse;
  } catch (error) {
    logger.error('merchant', {
      step: 'error',
      error: error.message,
    })
    throw new Error(error.message);
  }
}