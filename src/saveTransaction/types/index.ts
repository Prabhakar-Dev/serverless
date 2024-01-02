export interface CustomAPIGatewayProxyEvent {
  readonly headers: IHeaders;
  readonly body: IBody;
}

export interface IBody {
  accountId: number;
  transactionUuid: string;
  merchantCode: number;
  accountNumber: string;
  pconAmountResponse: IPconResponse;
  pconFeeResponse: IPconResponse | null;
}

interface IPconResponse {
  transaction_amount: number;
  transaction_id: string;
  payment_method: string;
  reason_code_id: number;
}

export interface IHeaders {
  pconUserId: string;
  pconUserApiKey: string;
  pconUserHashKey: string;
}

export interface IcreateRemoteChanges {
  uuid: string;
  customer_id: number;
  amount: number;
  account_number?: string;
  type_name?: string;
  status_name?: string;
}
