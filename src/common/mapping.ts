import { MapperConfiguration, MappingPair } from '@dynamic-mapper/mapper';
import {
  IMerchantDTO,
  IMerchant,
  ICustomerAccountDTO,
  ICustomerAccount,
  IConvenienceFeeDTO,
  IConvenienceFee,
} from './types';
import { CONSTANTS } from './constants';
import { IConvenienceFeeResponse } from 'convenienceFee/types';

export async function getMerchantMapping(merchant: IMerchantDTO, merchantCode: string) {
  const mappingPair = new MappingPair<IMerchantDTO, IMerchant>();

  const configuration = new MapperConfiguration((cfg) => {
    cfg.createMap(mappingPair, {
      merchantId: (opt) => opt.mapFrom((src) => src.id.toString()),
      merchantName: (opt) => opt.mapFrom((src) => src.name),
      merchantCode: (opt) => opt.mapFrom(() => Number(merchantCode)),
      paymentMethods: (opt) => opt.mapFrom((src) => src.payment_methods),
      locationId: (opt) => opt.mapFrom((src) => src.location_code),
      pconUserId: (opt) => opt.mapFrom((src) => src.pcon_user_id),
      pconDeveloperId: (opt) => opt.mapFrom((src) => src.pcon_developer_id),
      pconUserApiKey: (opt) => opt.mapFrom((src) => src.pcon_user_api_key),
      pconUserHashKey: (opt) => opt.mapFrom((src) => src.pcon_user_hashkey),
      ivrAchPtid: (opt) => opt.mapFrom((src) => src.ivr_ach_ptid),
      ivrCcAmountPtid: (opt) => opt.mapFrom((src) => src.ivr_cc_amount_ptid),
      ivrCcFeePtid: (opt) => opt.mapFrom((src) => src.ivr_cc_fee_ptid),
      allowPartialPayment: (opt) =>
        opt.mapFrom((src) => src.allow_partial_payment),
    });
  });
  const mapper = configuration.createMapper();
  return mapper.map(mappingPair, merchant);
}

export async function getCustomerMapping(customerDetails: ICustomerAccountDTO, accountNumber: string) {
  const mappingPair = new MappingPair<ICustomerAccountDTO, ICustomerAccount>();

  const configuration = new MapperConfiguration((cfg) => {
    cfg.createMap(mappingPair, {
      accountId: (opt) => opt.mapFrom((src) => src.id),
      accountName: (opt) =>
        opt.mapFrom((src) => `${src.first_name} ${src.last_name}`),
      accountNumber: (opt) => opt.mapFrom(() => accountNumber),
      balance: (opt) =>
        opt.mapFrom((src) => Number(Number(src.balance_current).toFixed(2))),
      paymentMethods: (opt) => opt.mapFrom((src) => src.payment_methods),
      transactionUuid: (opt) => opt.mapFrom((src) => src.next_charge_uuid),
      storedPayments: (opt) =>
        opt.mapFrom((src) => {
          return {
            accountVaultId: src?.recurring_payment?.account_vault_id || '',
            paymentMethod: src?.recurring_payment?.recurring_payment_method || '',
            lastFourDigit: src?.recurring_payment?.last_four_digits || '',
            accountHolderName: src?.recurring_payment?.account_name || '',
          };
        }),
    });
  });
  const mapper = configuration.createMapper();
  return mapper.map(mappingPair, customerDetails);
}

export async function getConvenienceFeeMapping(
  convenienceFeeDetails: IConvenienceFeeDTO[],
) {
  const mappingPair = new MappingPair<IConvenienceFeeDTO, IConvenienceFee>();

  const configuration = new MapperConfiguration((cfg) => {
    cfg.createMap(mappingPair, {
      totalAmount: (opt) => opt.mapFrom((src) => Number(src.base_amount)),
      convenienceFee: (opt) => opt.mapFrom((src) => Number(src.customer_fee)),
    });
  });
  const mapper = configuration.createMapper();

  const getPaymentMethod = (paymentMethod: string) => {
    let mappedPaymentMethod: string | null;

    switch (true) {
      case paymentMethod.toUpperCase() ===
        CONSTANTS.CONVENIENCE_FEE_MESSAGES.PAYMENT_METHODS.CREDIT:
        mappedPaymentMethod =
          CONSTANTS.CONVENIENCE_FEE_MESSAGES.PAYMENT_METHODS.CC;
        break;
      case paymentMethod.toUpperCase() ===
        CONSTANTS.CONVENIENCE_FEE_MESSAGES.PAYMENT_METHODS.ECHECK ||
        paymentMethod.toUpperCase() ===
          CONSTANTS.CONVENIENCE_FEE_MESSAGES.PAYMENT_METHODS.ACH:
        mappedPaymentMethod =
          CONSTANTS.CONVENIENCE_FEE_MESSAGES.PAYMENT_METHODS.ACH;
        break;
      default:
        mappedPaymentMethod = null;
    }
    return mappedPaymentMethod;
  };

  const result: Record<string, IConvenienceFeeResponse> = {};
  convenienceFeeDetails.forEach((sourceData: IConvenienceFeeDTO) => {
    if (sourceData.payment_method) {
      const key = getPaymentMethod(sourceData.payment_method);
      if (key) result[key] = mapper.map(mappingPair, sourceData);
    }
  });

  return result;
}
