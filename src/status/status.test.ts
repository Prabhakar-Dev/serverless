import axios from 'axios';
import { APIGatewayEvent } from 'aws-lambda';
import { handler } from './index'
import { CONSTANTS } from '../common/constants';


describe('Status Handler',() => {
    test('should return 200 status code and expected response body when dependencies are healthy', async () => {
      const axiosMock = jest.spyOn(axios, 'get');
      axiosMock.mockResolvedValueOnce({ data: { munibillingRorApiServices: true } });
      axiosMock.mockResolvedValueOnce({ data: { munibillingNodePayaAdapter: true } });

      const result = await handler({} as APIGatewayEvent);
      
      expect(result.statusCode).toBe(200);
      expect(result.body).toContain(JSON.stringify({
        status: 200,
        message: 'OK',
        data: {
          app_name: 'AWS lamda',  
          api_version: process.env.AWS_LAMBDA_FUNCTION_VERSION,
          node_version: process.versions.node,
          munibilling_ror_api_services: CONSTANTS.HEALTHY,
          munibilling_node_paya_adapter: CONSTANTS.HEALTHY,
        },
      }));
    });

    test('should throw an error when MB_ROR_API_SERVICE_DOWN', async () => {
      const axiosMock = jest.spyOn(axios, 'get');
      axiosMock.mockRejectedValueOnce(new Error('Network Error'));
      axiosMock.mockResolvedValueOnce({ status: 'fulfilled' });

      const response = await handler({} as APIGatewayEvent);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain(JSON.stringify({
        status: 200,
        message: 'OK',
        data: {
          app_name: 'AWS lamda',  
          api_version: process.env.AWS_LAMBDA_FUNCTION_VERSION,
          node_version: process.versions.node,
          munibilling_ror_api_services: CONSTANTS.UNHEALTHY,
          munibilling_node_paya_adapter: CONSTANTS.HEALTHY,
        },
      }));
    });

    test('should throw an error when MB_NODE_PAYA_ADAPTER_SERVICE_DOWN', async () => {

      const axiosMock = jest.spyOn(axios, 'get');
      axiosMock.mockResolvedValueOnce({ status: 'fulfilled' });
      axiosMock.mockRejectedValueOnce(new Error('Network Error'));

      const response = await handler({} as APIGatewayEvent);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain(JSON.stringify({
        status: 200,
        message: 'OK',
        data: {
          app_name: 'AWS lamda',  
          api_version: process.env.AWS_LAMBDA_FUNCTION_VERSION,
          node_version: process.versions.node,
          munibilling_ror_api_services: CONSTANTS.HEALTHY,
          munibilling_node_paya_adapter: CONSTANTS.UNHEALTHY,
        },
      }));
    });
});