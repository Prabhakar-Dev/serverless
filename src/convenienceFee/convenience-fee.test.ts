import { handler } from './index'
import { CustomAPIGatewayProxyEvent } from './types';
import * as MuniBillingServiceModule from '../common/muniBillingService';

describe('Convenience fee Handler',() => {
    test('should return 200 status code and expected response body when passing valid account number', async () => {
        const event = {
            path: { accountNumber: '38E1B4C6', amount: '117.21' }
        }

        MuniBillingServiceModule.default.prototype.getConvenienceFee = jest.fn().mockResolvedValueOnce([
            {
              payment_method: "Credit",
              customer_id: 311,
              account_number: null,
              base_amount: "117.21",
              customer_fee: "0.0"
            },
            {
              payment_method: "ECheck",
              customer_id: 311,
              account_number: null,
              base_amount: "117.21",
              customer_fee: "0.0"
            }
          ]);

        const result = await handler(event as CustomAPIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(result.body).toContain(JSON.stringify({
            status: 200,
            message: 'OK',
            data: {
                CC: {
                    totalAmount: 117.21,
                    convenienceFee: 0.00,
                },
                ACH: {
                    totalAmount: 117.21,
                    convenienceFee: 0.00,
                }
            },
        }));
    });

    test('should handle the request and return an error response in case of failure', async () => {
        // Mock event data
        const event = {
            path: { accountNumber: '38E1B4C6', amount: '117.21' }
        }
    
        // Mock merchant details retrieval failure
        MuniBillingServiceModule.default.prototype.getConvenienceFee = jest.fn().mockRejectedValueOnce(new Error('Unable to fetch merchant details'));
    
        // Call the handler function
        const result = await handler(event);
    
        // Assert the expected outcome
        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toBe('Unable to fetch merchant details')
      });
});