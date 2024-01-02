import {
  APIGatewayProxyResult,
} from 'aws-lambda';
import { getLogger } from '../common/logger';
import MuniBiilingService from '../common/muniBillingService';
import { CONSTANTS } from '../common/constants'
import { CustomAPIGatewayProxyEvent, ICustomer, ICustomerResponse } from './types';
import {
  getCustomerMapping,
} from '../common/mapping';

const logger = getLogger(__filename);

export const handler = async (
  event: CustomAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('account', {
      step: 'init',
      event
    })
    // Access path variables
    const { path: pathParameters } = event;
    const accountNumber: string = pathParameters && pathParameters.accountNumber;
    const result =  await getCustomersByAccountNumber(accountNumber);
    logger.info('account', {
      step: 'fetching customer account details',
      result
    })
     
    const apiGatewayProxyResult =  {
      statusCode: 200,
      body: JSON.stringify(result),
    };
    logger.info('account', {
      step: 'end',
      apiGatewayProxyResult
    })
    return apiGatewayProxyResult;
  } catch (error) {
    logger.error('account', {
      step: 'error',
      error: error.message
    })
    return {
      statusCode: error.status || CONSTANTS.STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function getCustomersByAccountNumber(accountNumber: string) {
  try {
    logger.info('account', {
      step: 'initiate to fetch customer account details',
      accountNumber
    })

    const service = new MuniBiilingService()
    const [customer]: [ICustomer] = await service.getCustomersByAccountNumber(accountNumber);
    logger.info('account', {
      step: 'fetched customer account details',
      customer: JSON.stringify(customer),
    })

    const response: ICustomerResponse =  await getCustomerMapping(customer, accountNumber);
    logger.info('account', {
      step: 'create final response',
      mapResponse: response
    })

    const finalResponse =  {
      status: CONSTANTS.STATUS_CODE.SUCCESS,
      message: CONSTANTS.OK,
      data: response
    };
    logger.info('account: customer account details', {
      step: 'end',
      finalResponse
    })

    return finalResponse;
  } catch (error) {
    logger.error('account: customer account details', {
      step: 'error',
      error: error.message
    })
    throw new Error(error.message);
  }
}