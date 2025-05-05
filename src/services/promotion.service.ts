// src/services/promotion.service.ts
import apiHelper from './apiHelper';

export interface Promotion {
  PromotionID: number;
  DiscountCode: string;
  PromotionName: string;
  Description?: string | null;
  DiscountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  DiscountValue: number;
  MinOrderValue?: number | null;
  MaxDiscountAmount?: number | null;
  StartDate: string; // ISO Date string
  EndDate: string; // ISO Date string
  MaxUsageLimit?: number | null;
  UsageCount: number;
  Status: string; // PromotionStatus Enum
  CreatedAt: string;
  UpdatedAt: string;
}

export interface PromotionListResponse {
  promotions: Promotion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PromotionQueryParams {
  page?: number;
  limit?: number;
  status?: string; // PromotionStatus Enum
  sortBy?: string;
}

export interface CreatePromotionData {
  discountCode: string;
  promotionName: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  maxUsageLimit?: number;
  status?: string; // PromotionStatus Enum
}

export interface UpdatePromotionData {
  discountCode?: string;
  promotionName?: string;
  description?: string;
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue?: number;
  minOrderValue?: number | null;
  maxDiscountAmount?: number | null;
  startDate?: string;
  endDate?: string;
  maxUsageLimit?: number | null;
  status?: string;
}

export interface ValidatePromoResponse {
  isValid: boolean;
  discountAmount: number;
  promotionId: number;
  message: string;
}

// --- Admin APIs ---

/** Admin: Lấy danh sách promotions */
export const getPromotions = async (
  params?: PromotionQueryParams
): Promise<PromotionListResponse> => {
  return apiHelper.get('/promotions', undefined, params);
};

/** Admin: Tạo promotion */
export const createPromotion = async (
  data: CreatePromotionData
): Promise<Promotion> => {
  return apiHelper.post('/promotions', data);
};

/** Admin: Lấy chi tiết promotion */
export const getPromotionById = async (
  promotionId: number
): Promise<Promotion> => {
  return apiHelper.get(`/promotions/${promotionId}`);
};

/** Admin: Cập nhật promotion */
export const updatePromotion = async (
  promotionId: number,
  data: UpdatePromotionData
): Promise<Promotion> => {
  return apiHelper.patch(`/promotions/${promotionId}`, data);
};

/** Admin: Hủy kích hoạt promotion */
export const deactivatePromotion = async (
  promotionId: number
): Promise<{ message: string }> => {
  return apiHelper.patch(`/promotions/${promotionId}/deactivate`);
};

// --- User APIs ---

/** User: Kiểm tra mã giảm giá */
export const validatePromotionCode = async (
  promotionCode: string
): Promise<ValidatePromoResponse> => {
  return apiHelper.post('/promotions/validate-code', { promotionCode });
};
