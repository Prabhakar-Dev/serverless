export interface CustomAPIGatewayProxyEvent {
    readonly path: pathParams;
}

export interface pathParams {
    accountNumber: string
}

interface IRecurringPayment {
    account_vault_id: string;
    last_four_digits: string;
    recurring_payment_method: string;
    account_name: string;
}

export interface ICustomer {
    id: number;
    balance_current: string;
    first_name: string;
    last_name: string;
    updated_at: string;
    company_id: number;
    munibilling_account_number: string;
    next_charge_uuid: string;
    payment_methods: string[];
    recurring_payment: IRecurringPayment;
}

interface IStoredPayments {
    accountVaultId: string;
    paymentMethod: string;
    lastFourDigit: string;
    accountHolderName: string;
}

export interface ICustomerResponse {
    accountId: number;
    accountName: string;
    accountNumber: string;
    balance: number;
    paymentMethods: string[];
    transactionUuid: string;
    storedPayments: IStoredPayments;
}