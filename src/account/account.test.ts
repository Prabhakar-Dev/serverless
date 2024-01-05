import { handler } from './index'
import { CustomAPIGatewayProxyEvent } from './types';
import * as MuniBillingServiceModule from '../common/muniBillingService';

describe('Account Handler',() => {
    test('should return 200 status code and expected response body when passing valid account number', async () => {
        const event = {
            path: { accountNumber: '38E1B4C6' }
        }

        MuniBillingServiceModule.default.prototype.getCustomersByAccountNumber = jest.fn().mockResolvedValueOnce([
            {
              id: 312,
              balance_current: "38.04",
              first_name: "Teresia",
              last_name: "Conroy",
              updated_at: "2023-12-21T13:40:04.000Z",
              company_id: 372,
              munibilling_account_number: "38E1B4C6",
              next_charge_uuid: "CV3U44-ER77GV",
              payment_methods: [
                "Credit",
                "ECheck"
              ],
              recurring_payment: {
                account_vault_id: "84e8128e5cf2fbca6e3657194341a251",
                last_four_digits: "9972",
                recurring_payment_method: "Credit",
                account_name: "Trent Harvey"
              }
            }
          ]);

        const result = await handler(event as CustomAPIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(result.body).toContain(JSON.stringify({
            status: 200,
            message: 'OK',
            data: {
                accountId: 312,
                accountName: 'Teresia Conroy',
                accountNumber: '38E1B4C6',
                balance:  38.04,
                paymentMethods: [
                    "Credit",
                    "ECheck"
                ],
                transactionUuid: 'CV3U44-ER77GV',
                storedPayments: {
                    accountVaultId: "84e8128e5cf2fbca6e3657194341a251",
                    paymentMethod: "Credit",
                    lastFourDigit: "9972",
                    accountHolderName: "Trent Harvey",
                },
            },
        }));
    });

    it('should handle the request and return an error response in case of failure', async () => {
        // Mock event data
        const event = {
            path: { accountNumber: '38E1B4C6' }
        }
    
        // Mock merchant details retrieval failure
        MuniBillingServiceModule.default.prototype.getCustomersByAccountNumber = jest.fn().mockRejectedValueOnce(new Error('Unable to fetch merchant details'));
    
        // Call the handler function
        const result = await handler(event);
    
        // Assert the expected outcome
        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toBe('Unable to fetch merchant details')
      });
});