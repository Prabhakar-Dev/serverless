import { handler } from './index'
import { CustomAPIGatewayProxyEvent } from './types';
import * as MuniBillingServiceModule from '../common/muniBillingService';

describe('Merchant Handler',() => {
    test('should return 200 status code and expected response body when passing valid merchant code', async () => {
        const event = {
            path: { merchantCode: '111480' }
        }

        MuniBillingServiceModule.default.prototype.findMerchantByIvrCode = jest.fn().mockResolvedValueOnce([{
            id: 369,
            name: "Kris Inc",
            updated_at: "2023-12-21T13:40:03.000Z",
            ivr_code: 111480,
            payment_methods: [
              "Credit",
              "ECheck"
            ],
            location_code: "db4d2b98",
            allow_partial_payment: true,
            pcon_user_id: "c4902b2f84",
            pcon_user_api_key: "dff90406a7",
            pcon_user_hashkey: "0175dd34d0",
            pcon_developer_id: "7578b04e1a",
            ivr_cc_amount_ptid: "16f7a07ff1",
            ivr_cc_fee_ptid: "1af9c2a95d",
            ivr_ach_ptid: "9e801eec13"
          }]);

        const result = await handler(event as CustomAPIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(result.body).toContain(JSON.stringify({
            status: 200,
            message: 'OK',
            data: {
                merchantId: '369',
                merchantName:  "Kris Inc",
                merchantCode: 111480,
                paymentMethods: [
                    'Credit',
                    'ECheck'
                ],
                locationId: 'db4d2b98',
                pconUserId: 'c4902b2f84',
                pconDeveloperId: '7578b04e1a',
                pconUserApiKey: 'dff90406a7',
                pconUserHashKey: '0175dd34d0',
                ivrAchPtid: '9e801eec13',
                ivrCcAmountPtid: '16f7a07ff1',
                ivrCcFeePtid: '1af9c2a95d',
                allowPartialPayment: true,
            },
        }));
    });

    it('should handle the request and return an error response in case of failure', async () => {
        // Mock event data
        const event = {
          path: {
            merchantCode: '0'
          }
        };
    
        // Mock merchant details retrieval failure
        MuniBillingServiceModule.default.prototype.findMerchantByIvrCode = jest.fn().mockRejectedValueOnce(new Error('Unable to fetch merchant details'));
    
        // Call the handler function
        const result = await handler(event);
    
        // Assert the expected outcome
        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toBe('Unable to fetch merchant details')
      });
});