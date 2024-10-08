import {
  APIGatewayProxyResult,
} from 'aws-lambda';
import { getLogger } from '../common/logger';
import MuniBiilingService from '../common/muniBillingService';
import { CONSTANTS } from '../common/constants'
import { getErrorResponse } from '../common/errorFormatting'
import { CustomAPIGatewayProxyEvent, IConvenienceFee, IConvenienceFeeResponse } from './types';
import {
  getConvenienceFeeMapping,
} from '../common/mapping';

const logger = getLogger(__filename);

export const handler = async (
  event: CustomAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('convenience-fee', {
      step: 'init',
      event
    });

    // Access path variables
    const { path: pathParameters } = event;
    const amount: string = pathParameters && pathParameters.amount;
    const accountNumber: string = pathParameters && pathParameters.accountNumber;
    const convenienceFees =  await getConvenienceFee(amount, accountNumber);
    logger.info('convenience-fee', {
      step: 'fetched convenience fees',
      convenienceFees: JSON.stringify(convenienceFees),
    })

    const apiGatewayProxyResult =  {
      statusCode: 200,
      body: JSON.stringify(convenienceFees),
    };
    logger.info('convenience-fee', {
      step: 'end',
      apiGatewayProxyResult
    })

    return apiGatewayProxyResult;
  } catch (error) {
    logger.error('convenience-fee', {
      step: 'error',
      error: JSON.stringify(error),
    })
    return getErrorResponse(error);
  }
};

async function getConvenienceFee(amount: string, accountNumber: string) {
  logger.info('convenience-fee', {
    step: 'initiate to fetch convenience fee',
    params: {
      amount,
      accountNumber
    }
  })
  const service = new MuniBiilingService();
  const convenienceFees: [IConvenienceFee] = await service.getConvenienceFee(amount, accountNumber);
  logger.info('convenience-fee', {
    step: 'successfully fetched convenience fee',
    convenienceFees
  })
  const response: Record<string, IConvenienceFeeResponse> =  await getConvenienceFeeMapping(convenienceFees);
  logger.info('convenience-fee:', {
    step: 'created final response',
    mapResponse: response
  })

  const finalResponse =  {
    status: CONSTANTS.STATUS_CODE.SUCCESS,
    message: CONSTANTS.OK,
    data: response
  };
  logger.info('convenience-fee:', {
    step: 'end',
    finalResponse
  })

  return finalResponse;
}