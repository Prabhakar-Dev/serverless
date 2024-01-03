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
  try {
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
  } catch (error) {
    logger.error('status', { 
      step: 'error',
      error: error.message
    });
    return {
      statusCode: error.status || CONSTANTS.STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function statusOfDependencies() {
  try {
    logger.info('status', {
      step: 'initiate the check all dependencies',
    });
    const [
      { data: munibillingRorApiServices },
      { data: munibillingNodePayaAdapter },
    ] = await Promise.all([
      axios.get(`${MB_ROR_API_HOST}/${CONSTANTS.STATUS.MB_ROR_ENDPOINT_FOR_STATUS}`, {
        headers: {
          'x-api-token': `${MB_BILLING_PAYA_API_LIFE_TOKEN}`
        }
      }),
      axios.get(`${MB_NODE_PAYA_ADAPTER_HOST}/${CONSTANTS.STATUS.MB_NODE_PAYA_ADAPTOR_ENDPOINT_FOR_STATUS}`),
    ]);

    if (!munibillingRorApiServices) {
      logger.error('status', {
        step: 'error',
        error: CONSTANTS.STATUS.MB_ROR_API_SERVICE_DOWN
      });
      throw new Error(CONSTANTS.STATUS.MB_ROR_API_SERVICE_DOWN);
    }
    if (!munibillingNodePayaAdapter) {
      logger.error('status', {
        step: 'error',
        error: CONSTANTS.STATUS.MB_NODE_PAYA_ADAPTER_SERVICE_DOWN
      });
      throw new Error(CONSTANTS.STATUS.MB_NODE_PAYA_ADAPTER_SERVICE_DOWN);
    }

    const response =  {
      status: CONSTANTS.STATUS_CODE.SUCCESS,
      message: CONSTANTS.OK,
      data: {
        app_name: 'AWS lamda',
        api_version: LAMBDA_VERSION,
        node_version: NODE_VERSION,
        munibilling_ror_api_services: CONSTANTS.HEALTHY,
        munibilling_node_paya_adapter: CONSTANTS.HEALTHY,
      },
    };
    logger.info('status', { step: 'end of check status of dependencies', response });
    return response;
  } catch (error) {
    logger.error('status', { 
      step: 'error',
      error: error.message
    });
    throw new Error(error.message);
  }
}