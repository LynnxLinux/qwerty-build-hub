import { apiClient, ApiResponse } from './client';

export interface ShippingOption {
  name: string;
  price: number;
  days: number;
}

export const shippingApi = {
  calculate(zipCode: string): Promise<ApiResponse<ShippingOption>> {
    return apiClient.post('/shipping/calculate', { zipCode });
  },
};
