import { APIGatewayEvent } from 'aws-lambda';
import { handler } from './index'
import { CONSTANTS } from '../common/constants';


describe('Generate Token Handler',() => {
    test('should return 200 status code and expected response when pass valid header', async () => {
        const result = await handler({
            headers: {
                apiKey: process.env.NODE_API_KEY,
                apiPass: process.env.NODE_API_PASS,
            }
        } as unknown as APIGatewayEvent);
      
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).data.accessToken).toBeTruthy();
    });

    test('should throw an error when API_KEY is not valid', async () => {
        const result = await handler({
            headers: {
                apiKey: `${process.env.NODE_API_KEY}0`,
                apiPass: process.env.NODE_API_PASS,
            }
        } as unknown as APIGatewayEvent);
        
        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toEqual(CONSTANTS.GENERATE_TOKEN.INVALID_API_PASS);
    });

    test('should throw an error when NODE_API_PASS is not valid', async () => {
        const result = await handler({
            headers: {
                apiKey: process.env.NODE_API_KEY,
                apiPass: `${process.env.NODE_API_PASS}0`,
            }
        } as unknown as APIGatewayEvent);
        
        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toEqual(CONSTANTS.GENERATE_TOKEN.INVALID_API_PASS);
    });

    test('should throw an error when not passing headers', async () => {
        const result = await handler({
            headers: {}
        } as unknown as APIGatewayEvent);
        
        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body).message).toEqual(CONSTANTS.BAD_GATEWAY);
    });
});