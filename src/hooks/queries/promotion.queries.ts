// src/hooks/queries/promotion.queries.ts
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getPromotions,
  createPromotion,
  getPromotionById,
  updatePromotion,
  deactivatePromotion,
  validatePromotionCode,
  Promotion,
  PromotionListResponse,
  PromotionQueryParams,
  CreatePromotionData,
  UpdatePromotionData,
} from '@/services/promotion.service';
import { ValidatePromoResponse } from '@/types/cart.types';

// Query Key Factory
const promotionKeys = {
  all: ['promotions'] as const,
  lists: (params?: PromotionQueryParams) =>
    [...promotionKeys.all, 'list', params || {}] as const,
  details: () => [...promotionKeys.all, 'detail'] as const,
  detail: (id: number | undefined) => [...promotionKeys.details(), id] as const,
  validate: (code: string) => [...promotionKeys.all, 'validate', code] as const, // Key cho validation
};

// --- Queries (Admin) ---

/** Hook Admin lấy danh sách promotions */
export const usePromotions = (
  params?: PromotionQueryParams,
  options?: Omit<
    UseQueryOptions<PromotionListResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = promotionKeys.lists(params);
  return useQuery<PromotionListResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getPromotions(params),
    staleTime: 5000, // Adjust the stale time as needed
    ...options,
  });
};

/** Hook Admin lấy chi tiết promotion */
export const usePromotionDetail = (
  promotionId: number | undefined,
  options?: Omit<UseQueryOptions<Promotion, Error>, 'queryKey' | 'queryFn'>
) => {
  const queryKey = promotionKeys.detail(promotionId);
  return useQuery<Promotion, Error>({
    queryKey: queryKey,
    queryFn: () => getPromotionById(promotionId!),
    enabled: !!promotionId,
    ...options,
  });
};

// --- Mutations (Admin) ---

/** Hook Admin tạo promotion */
export const useCreatePromotion = (
  options?: UseMutationOptions<Promotion, Error, CreatePromotionData>
) => {
  const queryClient = useQueryClient();
  return useMutation<Promotion, Error, CreatePromotionData>({
    mutationFn: createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
      console.log('Promotion created successfully.');
      // toast.success('Tạo mã giảm giá thành công!');
    },
    onError: (error) => {
      console.error('Promotion creation failed:', error.message);
      // toast.error(error.message || 'Tạo mã giảm giá thất bại.');
    },
    ...options,
  });
};

/** Hook Admin cập nhật promotion */
export const useUpdatePromotion = (
  options?: UseMutationOptions<
    Promotion,
    Error,
    { promotionId: number; data: UpdatePromotionData }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Promotion,
    Error,
    { promotionId: number; data: UpdatePromotionData }
  >({
    mutationFn: ({ promotionId, data }) => updatePromotion(promotionId, data),
    onSuccess: (updatedPromotion) => {
      queryClient.setQueryData(
        promotionKeys.detail(updatedPromotion.PromotionID),
        updatedPromotion
      );
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
      console.log('Promotion updated successfully.');
      // toast.success('Cập nhật mã giảm giá thành công!');
    },
    onError: (error) => {
      console.error('Promotion update failed:', error.message);
      // toast.error(error.message || 'Cập nhật mã giảm giá thất bại.');
    },
    ...options,
  });
};

/** Hook Admin hủy kích hoạt promotion */
export const useDeactivatePromotion = (
  options?: UseMutationOptions<{ message: string }, Error, number>
) => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, number>({
    mutationFn: deactivatePromotion,
    onSuccess: (data, promotionId) => {
      // Invalidate chi tiết và danh sách
      queryClient.invalidateQueries({
        queryKey: promotionKeys.detail(promotionId),
      });
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
      console.log('Promotion deactivated successfully.');
      // toast.success('Đã hủy kích hoạt mã giảm giá.');
    },
    onError: (error) => {
      console.error('Promotion deactivation failed:', error.message);
      // toast.error(error.message || 'Hủy kích hoạt thất bại.');
    },
    ...options,
  });
};

// --- Mutation (User) ---

/** Hook User kiểm tra mã giảm giá */
export const useValidatePromotionCode = (
  options?: UseMutationOptions<ValidatePromoResponse, Error, string>
) => {
  return useMutation<ValidatePromoResponse, Error, string>({
    // Input là promotionCode (string)
    mutationFn: validatePromotionCode,
    // Không cần onSuccess/onError chung, component tự xử lý kết quả/lỗi
    ...options,
  });
};
