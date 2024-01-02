export interface CustomAPIGatewayProxyEvent {
    readonly path: pathParams;
}

export interface pathParams {
    merchantCode: string
}

export interface IMerchant {
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

export interface IMerchantResponse {
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