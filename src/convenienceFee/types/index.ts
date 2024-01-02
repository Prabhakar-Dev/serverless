export interface CustomAPIGatewayProxyEvent {
    readonly path: pathParams;
}

export interface pathParams {
    amount: string
    accountNumber: string
}

export interface IConvenienceFee {
    payment_method: string;
    customer_id: number;
    account_number: string;
    base_amount: string;
    customer_fee: string;
  }
  
  export interface IConvenienceFeeResponse {
    totalAmount: number;
    convenienceFee: number;
  }