export const CONSTANTS = Object.freeze({
    OK: 'OK',
    HEALTHY: 'Healthy',
    UNAUTHORIZED: 'Unauthorized',
    AUTHORIZATION_TOKEN_INVALID: 'The authorization token is invalid',
    STATUS_CODE: {
        SUCCESS: 200,
        INTERNAL_SERVER_ERROR: 500,
    },
    STATUS: {
        MB_ROR_ENDPOINT_FOR_STATUS: 'paya/checkpoints',
        MB_NODE_PAYA_ADAPTOR_ENDPOINT_FOR_STATUS: 'status',
        MB_ROR_API_SERVICE_DOWN: 'Munibilling ROR Api Services is down',
        MB_NODE_PAYA_ADAPTER_SERVICE_DOWN:
          'Munibilling Node Paya Adapter services is down',
          


        API_OPERATION: 'Server Health Status.',
        SUCCESS: 'Server Health Status.',
        APP_NAME: 'app.name',
        APP_VERSION: 'app.version',
        NODE_VERSION: 'nodeVersion',
        MB_NODE_PAYA_ADAPTER_HOST: 'munibilling_paya.baseURL',
        MB_ROR_API_HOST: 'munibilling.host',
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
      API_OPERATION: 'Generate Token.',
      SUCCESS: 'The token generated successfully.',
      INVALID_API_PASS: 'Invalid Secret API Key and Secret API Password.',
      API_KEY: 'nodeApiKey',
      PASS_KEY: 'nodeApiPass',
    },
    MERCHANT_MESSAGES: {
      API_OPERATION:
        'Retrieve merchant details based on numeric unique identifier of merchant.',
      SUCCESS: 'Fetched merchant details successfully.',
    },
    ACCOUNT_MESSAGES: {
      API_OPERATION: 'Retrieve customer account details based on Account Number.',
      SUCCESS: 'Fetched account details successfully.',
      ACCOUNT_DETAILS_NOT_FOUND: 'Account details not found.',
    },
    CONVENIENCE_FEE_MESSAGES: {
      API_OPERATION: 'Retrieve convenience fee details.',
      SUCCESS: 'Fetched convenience fee details details successfully.',
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
      CUSTOMER_NOT_FOUND: 'Customer has not found',
      API_OPERATION: 'Save payment transaction response into munibilling.',
    },
    MB_INSTANCE: {
      LIFETIME_TOKEN: 'munibilling_paya.lifetimeToken',
      MB_BASEURL: 'munibilling.baseURL',
      MB_PAYA_BASEURL: 'munibilling_paya.baseURL',
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
    SWAGGER: {
      API_HEADERS: [
        {
          name: 'pcon-user-id',
          description: 'PCON user ID ',
          required: true,
        },
        {
          name: 'pcon-user-api-key',
          description: 'PCON user API key ',
          required: true,
        },
        {
          name: 'pcon-user-hash-key',
          description: 'PCON user hash key ',
          required: true,
        },
      ],
    },
    JWT: {
      DEFAULT_EXPIRY: 15,
    },
});
  