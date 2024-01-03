import {
  APIGatewayProxyResult,
} from 'aws-lambda';
import { getLogger } from '../common/logger';
import MuniBiilingService from '../common/muniBillingService';
import { CONSTANTS } from '../common/constants'
import { IRecord } from '../common/types'
import { CustomAPIGatewayProxyEvent, IHeaders, IProcessTransaction, IcreateRemoteChanges } from './types';
import axios from 'axios';

const logger = getLogger(__filename);

// Environment Variables!
const MB_NODE_PAYA_ADAPTER_HOST = `${process.env.MB_NODE_PAYA_API_HOST}/${process.env.MB_NODE_PAYA_API_NAMESPACE}`;
const MB_NODE_PAYA_API_LIFE_TOKEN = process.env.MB_NODE_PAYA_API_LIFE_TOKEN;

export const handler = async (
  event: CustomAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('save-transaction', {
      step: 'init',
      event: JSON.stringify(event),
    })
     // Access path variables
     const { headers, body: eventBody } = event;   
     
     if(!headers || !headers.pconUserId || !headers.pconUserApiKey || !headers.pconUserHashKey) {
      logger.error('save-transaction', {
        step: 'error',
        error: CONSTANTS.BAD_GATEWAY
      })
      new Error(CONSTANTS.BAD_GATEWAY)
     }

     const {
      merchantCode,
      accountNumber,
      accountId: customerId,
      transactionUuid,
      pconAmountResponse,
      pconFeeResponse = null,
    } = eventBody;

     if (
      pconAmountResponse.payment_method.toUpperCase() ===
      CONSTANTS.CONVENIENCE_FEE_MESSAGES.PAYMENT_METHODS.CC &&
      !pconFeeResponse
    ) {
      logger.error('save-transaction', {
        step: 'error',
        error: CONSTANTS.BAD_GATEWAY
      })
      throw new Error(CONSTANTS.BAD_GATEWAY);
    }

    let pconResponseForAmount = null;
    let pconResponseForFee = null;

    if (pconAmountResponse && Object.keys(pconAmountResponse).length) {
      logger.info('save-transaction', {
        step: 'initiate pcon amount transaction',
        pconAmountResponse
      })

      pconResponseForAmount = await processTransaction(headers, {
        pcon_transaction_id: pconAmountResponse?.transaction_id,
        customer_account_number: accountNumber,
        company_muni_id: Number(merchantCode),
        amount: pconAmountResponse?.transaction_amount,
        trans_type: CONSTANTS.TRANS_TYPE.AMOUNT,
        customer_id: customerId,
        reason_code_id: pconAmountResponse?.reason_code_id,
        uuid: transactionUuid,
      });

      logger.info('save-transaction', {
        step: 'successfully saved PCON amount',
        pconResponseForAmount
      })
    }

    if (pconFeeResponse && Object.keys(pconFeeResponse).length) {
      logger.info('save-transaction', {
        step: 'initiate pcon fee transaction',
        pconFeeResponse
      })

      pconResponseForFee = await processTransaction(headers, {
        pcon_transaction_id: pconFeeResponse?.transaction_id,
        customer_account_number: accountNumber,
        company_muni_id: Number(merchantCode),
        amount: pconFeeResponse?.transaction_amount,
        trans_type: CONSTANTS.TRANS_TYPE.FEE,
        customer_id: customerId,
        reason_code_id: pconAmountResponse?.reason_code_id,
        uuid: transactionUuid,
      });
      logger.info('save-transaction', {
        step: 'successfully saved PCON fee',
        pconResponseForFee
      })
    }

    // Check for errors in the responses
    if (pconResponseForAmount && pconResponseForAmount.errors.length !== 0) {
      logger.info('save-transaction', {
        step: 'error',
        error: new Error(`${CONSTANTS.SAVE_TRANSACTION_MESSAGES.PCON_AMOUNT_FAILED}`),
        stack: JSON.stringify(pconResponseForAmount.errors),
      })
      throw new Error(`Unprocessable Entity: ${CONSTANTS.SAVE_TRANSACTION_MESSAGES.PCON_AMOUNT_FAILED}`);
    }

    if (pconResponseForFee && pconResponseForFee?.errors.length !== 0) {
      logger.error('save-transaction', {
        step: 'error',
        error: CONSTANTS.SAVE_TRANSACTION_MESSAGES.PCON_FEE_FAILED,
        stack: JSON.stringify(pconResponseForFee.errors),
      })
      throw new Error(`Unprocessable Entity: ${CONSTANTS.SAVE_TRANSACTION_MESSAGES.PCON_FEE_FAILED}`);
    }

    const apiGatewayProxyResult =  {
      statusCode: 200,
      body: JSON.stringify({
        status: CONSTANTS.STATUS_CODE.SUCCESS,
        message: CONSTANTS.OK,
        data: {
          message: CONSTANTS.SAVE_TRANSACTION_MESSAGES.SUCCESS,
        },
      }),
    };
    logger.info('save-transaction', {
      step: 'end',
      apiGatewayProxyResult
    })

    return apiGatewayProxyResult;
  } catch (error) {
    logger.error('save-transaction', {
      step: 'error',
      error: error.message
    })
    return {
      statusCode: error.status || CONSTANTS.STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function processTransaction(headers: IHeaders, transactionDetails: IProcessTransaction) {
  logger.info('save-transaction', {
    step: 'process the transaction',
    params: {
      headers,
      transactionDetails
    }
  });

  const {
    pcon_transaction_id,
    customer_account_number,
    company_muni_id,
    amount,
    trans_type,
    customer_id,
    reason_code_id,
    uuid,
  } = transactionDetails;

  try {
    const pconEncryptedHeaders = await getHeaderEncryptedForPCON(
      headers,
    );

    logger.info('save-transaction', {
      step: 'header encrypted',
      pconEncryptedHeaders
    });

    const service = new MuniBiilingService()
    const promiseResult = await Promise.allSettled([
      // this is only used for to save the data on MB Node DB.
      saveTransactionOnMunibilling(pconEncryptedHeaders, {
        pcon_transaction_id,
        customer_account_number,
        company_muni_id,
        channel_type: CONSTANTS.CHANNEL_TYPE.IVR,
        trans_type,
      }),
      // This is used for to save data on MB paya DB (source of truth)
      service.createNewRemoteCharges({
        uuid,
        customer_id: customer_id,
        amount,
        ...(customer_account_number
          ? { account_number: customer_account_number }
          : {}),
        type_name: CONSTANTS.CHANNEL_TYPE.IVR,
        status_name: CONSTANTS.PCON_SUCCESS_REASON_CODES.includes(
          reason_code_id,
        )
          ? CONSTANTS.SAVE_TRANSACTION_MESSAGES.TRANSACTION_STATUS.SUCCESS
          : CONSTANTS.SAVE_TRANSACTION_MESSAGES.TRANSACTION_STATUS.FAILED,
      } as IcreateRemoteChanges),
    ]);

    const response = promiseResult.reduce(
      (_prev: any, _curr: any, _index: number) => {
        if (
          _index === 0 &&
          _curr.status === CONSTANTS.PROMISE_STATUS.FULFILLED
        )
          _prev.transactionId = _curr.value;

        if (_curr.status.toUpperCase() === CONSTANTS.PROMISE_STATUS.REJECTED)
          _prev.errors.push(_curr.reason.response.data);

        return _prev;
      },
      {
        transactionId: 0,
        errors: [],
      },
    );

    logger.info('save-transaction', {
      step: 'end process transaction',
      response
    });

    return response;
  } catch (error) {
    logger.error('save-transaction', {
      step: 'error',
      error: error.message
    });
    throw error;
  }
}

async function saveTransactionOnMunibilling(
  pconEncryptedHeaders: string,
  newTransaction: IRecord,
) {
  logger.info('save-transaction', {
    step: 'save transaction in Node paya adapter'
  })

  const {
    data: {
      data: { id },
    },
  } = await axios.post(`${MB_NODE_PAYA_ADAPTER_HOST}/${CONSTANTS.MB_INSTANCE.SAVE_TRANSACTION_ENDPOINT}`,
    { data: newTransaction },
    {
      headers: {
        'x-api-token': `${MB_NODE_PAYA_API_LIFE_TOKEN}`,
        'pcon-user-info': pconEncryptedHeaders,
      },
    },
  );
  logger.info('save-transaction', {
    step: 'saved transaction in Node paya adapter',
    id
  })

  return id;
}

async function getHeaderEncryptedForPCON(headers: IHeaders) {
  logger.info('save-transaction', {
    step: 'initiate the header encryption process',
    headers
  })
  
  const {
    data: {
      data: { encryptedStr },
    },
  } = await axios.post(
    `${MB_NODE_PAYA_ADAPTER_HOST}/${CONSTANTS.MB_INSTANCE.ENCRYPTION_DATA_ENDPOINT}`,
    { data: headers },
    {
      headers: {
        'x-api-token': `${MB_NODE_PAYA_API_LIFE_TOKEN}`
      },
    },
  );
  logger.info('save-transaction', {
    step: 'Header encrypted successfully',
    encryptedStr
  })

  return encryptedStr;
}
