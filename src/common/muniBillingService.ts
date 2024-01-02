import { CONSTANTS } from "./constants";
import axios, { AxiosInstance } from 'axios'

export default class MuniBiilingService {
  private muniAxiosInstance: AxiosInstance;
  private baseURL: string
  
  constructor() {
    this.baseURL = `${process.env.MB_BILLING_PAYA_API_HOST}/${process.env.MB_BILLING_PAYA_API_NAMESPACE}`;
    this.muniAxiosInstance = axios.create({
      baseURL: `${this.baseURL}`,
      timeout: CONSTANTS.AXIOS_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': `${process.env.MB_BILLING_PAYA_API_LIFE_TOKEN}`,
        },
    });
  }

  async findMerchantByIvrCode(ivrCode: string) {
    const baseUrl = CONSTANTS.MB_API_ENDPOINTS.COMPANIES.BASEURL
    const queryParams = new URLSearchParams();

    if (ivrCode) {
      queryParams.append('ivr_code', ivrCode);
    }
    const url = `${baseUrl}?${queryParams.toString()}`;
    const { data } = await this.muniAxiosInstance.get(url);
    return data;
  }

  async getMerchantDetails(id: string) {
    const { data } = await this.muniAxiosInstance.get(`${CONSTANTS.MB_API_ENDPOINTS.COMPANIES.BASEURL}/${id}`);
    return data;
  }

  async getConvenienceFee(base_amount: string, account_number: string) {
    const baseUrl = CONSTANTS.MB_API_ENDPOINTS.CONVENIENCE_FEE.BASEURL;
    const queryParams = new URLSearchParams();
    queryParams.append('base_amount', base_amount);
    queryParams.append('account_number', account_number);

    const url = `${baseUrl}?${queryParams.toString()}`;
    const { data } = await this.muniAxiosInstance.get(url);
    return data;
  }

  async getCustomersByAccountNumber(account_number: string) {
    const baseUrl = CONSTANTS.MB_API_ENDPOINTS.CUSTOMER.BASEURL;
    const queryParams = new URLSearchParams();

    if (account_number) {
      queryParams.append('account_number', account_number);
    }

    const url = `${baseUrl}?${queryParams.toString()}`;
    const { data } = await this.muniAxiosInstance.get(url);
    return data;
  }

  async getCustomersDetails(id: any) {
    const { data } = await this.muniAxiosInstance.get(`${CONSTANTS.MB_API_ENDPOINTS.CUSTOMER.BASEURL}/${id}`);
    return data;
  }

  async createNewRemoteCharges(charge: any) {
    const { data } = await this.muniAxiosInstance.post(CONSTANTS.MB_API_ENDPOINTS.REMOTE_CHARGES.BASEURL, charge);
    return data;
  }
}
