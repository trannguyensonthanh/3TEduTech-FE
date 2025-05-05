// src/hooks/queries/paymentMethod.queries.ts
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getAvailablePaymentMethods,
  createPaymentMethod,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod,
  PaymentMethod, // Giả sử đã định nghĩa interface PaymentMethod trong service
} from '@/services/paymentMethod.service'; // Điều chỉnh đường dẫn nếu cần

// Query Key Factory
const paymentMethodKeys = {
  all: ['paymentMethods'] as const,
  lists: () => [...paymentMethodKeys.all, 'list'] as const,
  details: () => [...paymentMethodKeys.all, 'detail'] as const,
  detail: (id: string | undefined) =>
    [...paymentMethodKeys.details(), id] as const,
};

// --- Queries ---

/** Hook lấy danh sách payment methods */
export const usePaymentMethods = (
  options?: Omit<
    UseQueryOptions<{ paymentMethods: PaymentMethod[] }, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = paymentMethodKeys.lists();
  return useQuery<{ paymentMethods: PaymentMethod[] }, Error>({
    queryKey: queryKey,
    queryFn: getAvailablePaymentMethods,
    staleTime: 1000 * 60 * 60, // Cache 1 giờ vì ít thay đổi
    ...options,
  });
};

/** Hook Admin lấy chi tiết payment method */
export const usePaymentMethodDetail = (
  methodId: string | undefined,
  options?: Omit<UseQueryOptions<PaymentMethod, Error>, 'queryKey' | 'queryFn'>
) => {
  const queryKey = paymentMethodKeys.detail(methodId);
  return useQuery<PaymentMethod, Error>({
    queryKey: queryKey,
    queryFn: () => getPaymentMethodById(methodId!),
    enabled: !!methodId,
    ...options,
  });
};

// --- Mutations (Admin) ---

/** Hook Admin tạo payment method */
export const useCreatePaymentMethod = (
  options?: UseMutationOptions<
    PaymentMethod,
    Error,
    { methodId: string; methodName: string }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    PaymentMethod,
    Error,
    { methodId: string; methodName: string }
  >({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.lists() });
      console.log('Payment method created successfully.');
      // toast.success('Tạo phương thức thanh toán thành công!');
    },
    onError: (error) => {
      console.error('Payment method creation failed:', error.message);
      // toast.error(error.message || 'Tạo phương thức thất bại.');
    },
    ...options,
  });
};

/** Hook Admin cập nhật payment method */
export const useUpdatePaymentMethod = (
  options?: UseMutationOptions<
    PaymentMethod,
    Error,
    { methodId: string; data: { methodName: string } }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    PaymentMethod,
    Error,
    { methodId: string; data: { methodName: string } }
  >({
    mutationFn: ({ methodId, data }) => updatePaymentMethod(methodId, data),
    onSuccess: (updatedMethod) => {
      queryClient.setQueryData(
        paymentMethodKeys.detail(updatedMethod.MethodID),
        updatedMethod
      );
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.lists() });
      console.log('Payment method updated successfully.');
      // toast.success('Cập nhật phương thức thành công!');
    },
    onError: (error) => {
      console.error('Payment method update failed:', error.message);
      // toast.error(error.message || 'Cập nhật phương thức thất bại.');
    },
    ...options,
  });
};

/** Hook Admin xóa payment method */
export const useDeletePaymentMethod = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    // Input là methodId
    mutationFn: deletePaymentMethod,
    onSuccess: (_, methodId) => {
      queryClient.removeQueries({
        queryKey: paymentMethodKeys.detail(methodId),
      });
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.lists() });
      console.log('Payment method deleted successfully.');
      // toast.success('Xóa phương thức thành công!');
    },
    onError: (error) => {
      console.error('Payment method deletion failed:', error.message);
      // toast.error(error.message || 'Xóa phương thức thất bại.');
    },
    ...options,
  });
};
