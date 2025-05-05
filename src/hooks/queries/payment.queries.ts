// src/hooks/queries/payment.queries.ts
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
  createVnpayPaymentUrl,
  CreateVnpayUrlData,
  CreateVnpayUrlResponse,
} from '@/services/payment.service';

// --- Mutations ---

/** Hook tạo URL thanh toán VNPay */
export const useCreateVnpayUrl = (
  options?: UseMutationOptions<
    CreateVnpayUrlResponse,
    Error,
    CreateVnpayUrlData
  >
) => {
  return useMutation<CreateVnpayUrlResponse, Error, CreateVnpayUrlData>({
    mutationFn: createVnpayPaymentUrl,
    onSuccess: (data) => {
      console.log('VNPay URL created.');
      // Thường sẽ dùng URL này để redirect ngay lập tức
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error) => {
      console.error('Create VNPay URL failed:', error.message);
      // toast.error(error.message || 'Tạo link thanh toán thất bại.');
    },
    ...options,
  });
};

// Không cần hook cho vnpay_return hay ipn vì chúng là xử lý của backend/redirect
