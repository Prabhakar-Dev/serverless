import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

export interface AchAPIGatewayProxyEvent {
    readonly query: EventQueryStringParameters | null | undefined;
}

export interface EventQueryStringParameters {
    [name: string]: string | undefined;
}

export interface TwilioGatherResquest {
    attributes: VoiceResponse.SayAttributes;
    message: string;
}




export interface IMerchantDTO {
    id: number;
    name: string;
    updated_at: string;
    ivr_code: number;
    payment_methods: string[];
    location_code: string;
    allow_partial_payment: boolean;
    pcon_user_id: string;
    pcon_user_api_key: string;
    pcon_user_hashkey: string;
    pcon_developer_id: string;
    ivr_cc_amount_ptid: string;
    ivr_cc_fee_ptid: string;
    ivr_ach_ptid: string;
  }
  
  export interface IMerchant {
    merchantId: string;
    merchantName: string;
    merchantCode: number;
    paymentMethods: string[];
    locationId: string;
    pconUserId: string;
    pconDeveloperId: string;
    pconUserApiKey: string;
    pconUserHashKey: string;
    ivrAchPtid: string;
    ivrCcAmountPtid: string;
    ivrCcFeePtid: string;
    allowPartialPayment: boolean;
  }
  
  interface IRecurringPayments {
    account_vault_id: string;
    last_four_digits: string;
    recurring_payment_method: string;
    account_name: string;
  }
  
  export interface ICustomerAccountDTO {
    id: number;
    balance_current: string;
    first_name: string;
    last_name: string;
    updated_at: string;
    company_id: number;
    munibilling_account_number: string;
    next_charge_uuid: string;
    payment_methods: string[];
    recurring_payment: IRecurringPayments;
  }
  
  interface IStoredPayments {
    accountVaultId: string;
    paymentMethod: string;
    lastFourDigit: string;
    accountHolderName: string;
  }
  
  export interface ICustomerAccount {
    accountId: number;
    accountName: string;
    accountNumber: string;
    balance: number;
    paymentMethods: string[];
    transactionUuid: string;
    storedPayments: IStoredPayments;
  }
  
  export interface IConvenienceFeeDTO {
    payment_method: string;
    customer_id: number;
    account_number: string;
    base_amount: string;
    customer_fee: string;
  }
  
  export interface IConvenienceFee {
    totalAmount: number;
    convenienceFee: number;
  }
  