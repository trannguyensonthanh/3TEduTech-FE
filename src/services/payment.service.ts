// src/services/payment.service.ts
import apiHelper from './apiHelper';

export interface CreateVnpayUrlData {
  orderId: number;
  bankCode?: string;
  locale?: 'vn' | 'en';
}

export interface CreateVnpayUrlResponse {
  paymentUrl: string;
}

/** Tạo URL thanh toán VNPay */
export const createVnpayPaymentUrl = async (
  data: CreateVnpayUrlData
): Promise<CreateVnpayUrlResponse> => {
  return apiHelper.post('/payments/vnpay/create-url', data);
};

// Hàm xử lý vnpay_return chỉ là redirect, không cần gọi API từ FE
// Hàm xử lý vnpay_ipn là webhook từ backend
