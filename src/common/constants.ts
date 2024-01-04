export const CONSTANTS = Object.freeze({
    OK: 'OK',
    HEALTHY: 'Healthy',
    UNAUTHORIZED: 'Unauthorized',
    AUTHORIZATION_TOKEN_INVALID: 'The authorization token is invalid',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    STATUS_CODE: {
        SUCCESS: 200,
        INTERNAL_SERVER_ERROR: 500,
        UNAUTHORIZED: 401
    },
    STATUS: {
        MB_ROR_ENDPOINT_FOR_STATUS: 'paya/checkpoints',
        MB_NODE_PAYA_ADAPTOR_ENDPOINT_FOR_STATUS: 'status',
        MB_ROR_API_SERVICE_DOWN: 'Munibilling ROR Api Services is down',
        MB_NODE_PAYA_ADAPTER_SERVICE_DOWN:
          'Munibilling Node Paya Adapter services is down',
      },
    AXIOS_TIMEOUT: 40000,
    AUTHENTICATION_TOKEN_MISSING: 'Authorization token missing.',
    BAD_GATEWAY: 'Invalid Request/Response or required data seems to be missing.',
    TRANS_TYPE: {
      AMOUNT: 'AMOUNT',
      FEE: 'FEE',
    },
    CHANNEL_TYPE: {
      IVR: 'IVR',
    },
    PCON_SUCCESS_REASON_CODES: [1000, 1002, 1201],
    PROMISE_STATUS: {
      FULFILLED: 'FULFILLED',
      REJECTED: 'REJECTED',
    },
    GENERATE_TOKEN: {
      INVALID_API_PASS: 'Invalid Secret API Key and Secret API Password.',
    },
    CONVENIENCE_FEE_MESSAGES: {
      PAYMENT_METHODS: {
        CC: 'CC',
        ACH: 'ACH',
        ECHECK: 'ECHECK',
        CREDIT: 'CREDIT',
      },
    },
    SAVE_TRANSACTION_MESSAGES: {
      TRANSACTION_STATUS: {
        SUCCESS: 'Success',
        FAILED: 'Failed',
      },
      SUCCESS: 'Transaction saved successfully',
      PCON_FEE_FAILED: 'PCON fee transaction has failed',
      PCON_AMOUNT_FAILED: 'PCON amount transaction has failed',
    },
    MB_INSTANCE: {
      SAVE_TRANSACTION_ENDPOINT: 'save-transaction',
      ENCRYPTION_DATA_ENDPOINT: 'encrypt-data',
    },
    MB_API_ENDPOINTS: {
      COMPANIES: {
        BASEURL: '/paya/companies',
        QUERY_PARAMS: {
          IVR_CODE: 'ivr_code',
        },
      },
      CONVENIENCE_FEE: {
        BASEURL: '/paya/convenience_fees',
        BASE_AMOUNT: 'base_amount',
        ACCOUNT_NUMBER: 'account_number',
      },
      CUSTOMER: {
        BASEURL: '/paya/customers',
        ACCOUNT_NUMBER: 'account_number',
      },
      REMOTE_CHARGES: {
        BASEURL: 'paya/remote_charges',
      },
    },
    JWT: {
      DEFAULT_EXPIRY: 15,
    },
});
  