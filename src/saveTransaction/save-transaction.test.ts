/* eslint-disable @typescript-eslint/no-explicit-any */
import { handler } from './index'
import { CustomAPIGatewayProxyEvent } from './types';
import * as MuniBillingServiceModule from '../common/muniBillingService';
import { CONSTANTS } from '../common/constants';
import axios from 'axios';

describe('Account Handler',() => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('should return 200 status code and expected response body when passing valid account number', async () => {
        const axiosMock = jest.spyOn(axios, 'post');
        axiosMock
            .mockResolvedValueOnce({ data: { data: { encryptedStr: 'mockedEncryptedStr' } } })
            .mockResolvedValueOnce({ data: { data: { id: 'mockedTransactionId' } } })
            .mockResolvedValueOnce({ data: { data: { encryptedStr: 'mockedEncryptedStr' } } })
            .mockResolvedValueOnce({ data: { data: { id: 'mockedTransactionId' } } })

        MuniBillingServiceModule.default.prototype.createNewRemoteCharges = jest.fn().mockResolvedValue({
            id: 1,
            uuid: "11ee998c5152d688816bf58f",
            amount: "883.48",
            updated_at: "2023-12-21T13:40:04.000Z",
            company_id: 375,
            customer_id: 315,
            type_name: "IVR",
            status_name: "Success"
        });

        
        const event = {
            body: {
                merchantCode: 12312,
                accountId: 2456938,
                accountNumber: "123123123",
                transactionUuid: "11ee998c5152d688816bf58f",
                pconAmountResponse: {
                  transaction_amount: 883.48,
                  transaction_id: "11ee998c5152d688816bf58f",
                  payment_method: "cc",
                  reason_code_id: 1000
                },
                pconFeeResponse: {
                  transaction_amount: 883.48,
                  transaction_id: "11ee199a070ac9e08fc87524",
                  payment_method: "cc",
                  reason_code_id: 1000
                }
            },
            headers: {
                pconUserId:'11ee112c8f0',
                pconUserApiKey:'11ee4e350c',
                pconUserHashKey:'a166d6a528a'
            }
        }

      
        const result = await handler(event as CustomAPIGatewayProxyEvent);
        console.log('result :: ', result);
        

        expect(result.statusCode).toBe(200);
        expect(result.body).toContain(JSON.stringify({
            status: 200,
            message: 'OK',
            data: {
                message: CONSTANTS.SAVE_TRANSACTION_MESSAGES.SUCCESS
            },
        }));
    });

    test('should return 500 status code and expected response body when passing invalid body', async () => {
        const axiosMock = jest.spyOn(axios, 'post');
        axiosMock
            .mockResolvedValueOnce({ data: { data: { encryptedStr: 'mockedEncryptedStr' } } })
            .mockResolvedValueOnce({ data: { data: { id: 'mockedTransactionId' } } })
            .mockResolvedValueOnce({ data: { data: { encryptedStr: 'mockedEncryptedStr' } } })
            .mockResolvedValueOnce({ data: { data: { id: 'mockedTransactionId' } } })

        MuniBillingServiceModule.default.prototype.createNewRemoteCharges = jest.fn().mockResolvedValue({
            id: 1,
            uuid: "11ee998c5152d688816bf58f",
            amount: "883.48",
            updated_at: "2023-12-21T13:40:04.000Z",
            company_id: 375,
            customer_id: 315,
            type_name: "IVR",
            status_name: "Success"
        });

        
        const event = {
            body: {
                merchantCode: 12312,
                accountId: 2456938,
                accountNumber: "123123123",
                transactionUuid: "11ee998c5152d688816bf58f",
                pconAmountResponse: {
                  transaction_amount: 883.48,
                  transaction_id: "11ee998c5152d688816bf58f",
                  payment_method: "cc",
                  reason_code_id: 1000
                },
            },
            headers: {
                pconUserId:'11ee112c8f0',
                pconUserApiKey:'11ee4e350c',
                pconUserHashKey:'a166d6a528a'
            }
        }

      
        const result = await handler(event as CustomAPIGatewayProxyEvent);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toBe(CONSTANTS.BAD_GATEWAY);
    });

    test('should return 500 status code and expected response body when reject promise', async () => {
        const axiosMock = jest.spyOn(axios, 'post');
        axiosMock
            .mockResolvedValueOnce({ data: { data: { encryptedStr: 'mockedEncryptedStr' } } })
            .mockResolvedValueOnce({ data: { data: { id: 'mockedTransactionId' } } })
            .mockResolvedValueOnce({ data: { data: { encryptedStr: 'mockedEncryptedStr' } } })
            .mockResolvedValueOnce({ data: { data: { id: 'mockedTransactionId' } } })

        MuniBillingServiceModule.default.prototype.createNewRemoteCharges = jest.fn().mockRejectedValueOnce(new Error('Some MuniBillingService error'));
        
        const event = {
            body: {
                merchantCode: 12312,
                accountId: 2456938,
                accountNumber: "123123123",
                transactionUuid: "11ee998c5152d688816bf58f",
                pconAmountResponse: {
                  transaction_amount: 883.48,
                  transaction_id: "11ee998c5152d688816bf58f",
                  payment_method: "cc",
                  reason_code_id: 1000
                },
                pconFeeResponse: {
                  transaction_amount: 883.48,
                  transaction_id: "11ee199a070ac9e08fc87524",
                  payment_method: "cc",
                  reason_code_id: 1000
                }
            },
            headers: {
                pconUserId:'11ee112c8f0',
                pconUserApiKey:'11ee4e350c',
                pconUserHashKey:'a166d6a528a'
            }
        }
      
        const result = await handler(event as CustomAPIGatewayProxyEvent);

        expect(result.statusCode).toBe(500);
    });

      test('should throw an error if required headers are missing', async () => {
        // Arrange
        const event = {
          body: {
            merchantCode: 12312,
            accountId: 2456938,
            accountNumber: "123123123",
            transactionUuid: "11ee998c5152d688816bf58f",
            pconAmountResponse: {
              transaction_amount: 883.48,
              transaction_id: "11ee998c5152d688816bf58f",
              payment_method: "cc",
              reason_code_id: 1000
            },
            pconFeeResponse: {
              transaction_amount: 883.48,
              transaction_id: "11ee199a070ac9e08fc87524",
              payment_method: "cc",
              reason_code_id: 1000
            }
          },
          headers: {}
        };

        const result = await handler(event as CustomAPIGatewayProxyEvent);
  
        // Act and Assert
        expect(result.statusCode).toBe(500);
      });
});