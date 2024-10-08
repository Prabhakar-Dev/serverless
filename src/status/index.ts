import {
  APIGatewayEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { getLogger } from '../common/logger';
import axios from 'axios';
import { CONSTANTS } from '../common/constants'

const logger = getLogger(__filename);

// Environment Variables!
const MB_ROR_API_HOST = `${process.env.MB_BILLING_PAYA_API_HOST}/${process.env.MB_BILLING_PAYA_API_NAMESPACE}`;
const MB_NODE_PAYA_ADAPTER_HOST = `${process.env.MB_NODE_PAYA_API_HOST}/${process.env.MB_NODE_PAYA_API_NAMESPACE}`;
const MB_BILLING_PAYA_API_LIFE_TOKEN = process.env.MB_BILLING_PAYA_API_LIFE_TOKEN;
const LAMBDA_VERSION = process.env.AWS_LAMBDA_FUNCTION_VERSION;
const NODE_VERSION = process.versions.node;


export const handler = async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  logger.info('status', {
    step: 'init',
    event,
  });
  
  const result = await statusOfDependencies();

  logger.info('status', { 
    result
  });

  const apiGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(result),
  };

  logger.info('status', { 
    step: 'end',
    apiGatewayProxyResult
  });

  return apiGatewayProxyResult
};

async function statusOfDependencies() {
  logger.info('status', {
    step: 'initiate the check all dependencies',
  });

  const munibillingRorApiServicesPromise = axios.get(`${MB_ROR_API_HOST}/${CONSTANTS.STATUS.MB_ROR_ENDPOINT_FOR_STATUS}`, {
    headers: {
      'x-api-token': `${MB_BILLING_PAYA_API_LIFE_TOKEN}`
    }
  });

  const munibillingNodePayaAdapterPromise = axios.get(`${MB_NODE_PAYA_ADAPTER_HOST}/${CONSTANTS.STATUS.MB_NODE_PAYA_ADAPTOR_ENDPOINT_FOR_STATUS}`);

  const [munibillingRorApiServicesResult, munibillingNodePayaAdapterResult] = await Promise.allSettled([
    munibillingRorApiServicesPromise,
    munibillingNodePayaAdapterPromise,
  ]);

  if (munibillingRorApiServicesResult.status === 'rejected') {
    logger.error('status', {
      step: 'error',
      error: CONSTANTS.STATUS.MB_ROR_API_SERVICE_DOWN
    });
  }

  if (munibillingNodePayaAdapterResult.status === 'rejected') {
    logger.error('status', {
      step: 'error',
      error: CONSTANTS.STATUS.MB_NODE_PAYA_ADAPTER_SERVICE_DOWN
    });
  }

  const response =  {
    status: CONSTANTS.STATUS_CODE.SUCCESS,
    message: CONSTANTS.OK,
    data: {
      app_name: 'AWS lamda',
      api_version: LAMBDA_VERSION,
      node_version: NODE_VERSION,
      munibilling_ror_api_services: munibillingRorApiServicesResult.status === 'fulfilled' ? CONSTANTS.HEALTHY : CONSTANTS.UNHEALTHY,
      munibilling_node_paya_adapter: munibillingNodePayaAdapterResult.status === 'fulfilled' ? CONSTANTS.HEALTHY : CONSTANTS.UNHEALTHY,
    },
  };
  logger.info('status', { step: 'end of check status of dependencies', response });
  return response;
}