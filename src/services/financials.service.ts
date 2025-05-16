// src/services/financials.service.ts
import apiHelper from './apiHelper';

export interface AvailableBalanceResponse {
  balance: number;
  currency: string; // e.g., 'VND'
}

export interface WithdrawalRequestData {
  requestedAmount: number;
  // currency và method cố định ở backend, không cần gửi lên
  instructorNotes?: string;
}

export interface WithdrawalRequest {
  requestId: number;
  instructorId: number;
  requestedAmount: number;
  requestedCurrencyId: string;
  paymentMethodId: string;
  payoutDetailsSnapshot: string; // JSON string
  status: string; // WithdrawalStatus Enum
  instructorNotes?: string | null;
  adminId?: number | null;
  adminNotes?: string | null;
  processedAt?: string | null; // ISO Date string
  payoutId?: number | null;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface ReviewWithdrawalData {
  decision: 'APPROVED' | 'REJECTED';
  adminNotes?: string;
}

export interface WithdrawalHistoryResponse {
  requests: Partial<WithdrawalRequest>[]; // Thông tin rút gọn
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WithdrawalHistoryParams {
  page?: number;
  limit?: number;
  status?: string; // WithdrawalStatus Enum
}

export interface Payout {
  PayoutID: number;
  Amount: number;
  CurrencyID: string;
  PayoutStatusID: string; // PayoutStatus Enum
  RequestedAt: string;
  ProcessedAt?: string | null;
  CompletedAt?: string | null;
  PaymentMethodID: string;
  // Thêm các trường cần thiết khác từ API response
  InstructorName?: string;
  AdminName?: string;
  Fee?: number;
  AdminNote?: string;
}

export interface PayoutListResponse {
  payouts: Partial<Payout>[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PayoutQueryParams {
  page?: number;
  limit?: number;
  instructorId?: number;
  statusId?: string; // PayoutStatus Enum
  paymentMethodId?: string;
  sortBy?: string;
}

export interface ProcessPayoutData {
  status: 'PAID' | 'FAILED';
  actualAmount?: number;
  actualCurrencyId?: string; // Currency Enum
  exchangeRate?: number;
  fee?: number;
  completedAt?: string; // ISO Date string
  adminNotes?: string;
}

export interface RevenueDetail {
  SplitID: number;
  Amount: number; // Số tiền instructor nhận được từ split này
  RevenueDate: string; // CreatedAt của split
  PayoutID?: number | null;
  OrderItemID: number;
  CourseSalePrice: number; // PriceAtOrder của OrderItem
  OrderID: number;
  OrderDate: string;
  CourseID: number;
  CourseName: string;
  CourseSlug: string;
  PayoutStatusID?: string | null; // Trạng thái của Payout liên kết
  PayoutDate?: string | null; // CompletedAt của Payout liên kết
}

export interface RevenueDetailsResponse {
  revenues: RevenueDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RevenueDetailsParams {
  page?: number;
  limit?: number;
  payoutStatus?: 'ALL' | 'PAID' | 'UNPAID';
}

// --- Instructor APIs ---

/** Instructor: Lấy số dư khả dụng */
export const getMyAvailableBalance =
  async (): Promise<AvailableBalanceResponse> => {
    return apiHelper.get('/financials/balance');
  };

/** Instructor: Tạo yêu cầu rút tiền */
export const requestWithdrawal = async (
  data: WithdrawalRequestData
): Promise<WithdrawalRequest> => {
  // API backend chỉ cần requestedAmount và notes
  return apiHelper.post('/financials/withdrawals/request', data);
};

/** Instructor: Lấy lịch sử yêu cầu rút tiền */
export const getMyWithdrawalHistory = async (
  params?: WithdrawalHistoryParams
): Promise<WithdrawalHistoryResponse> => {
  return apiHelper.get('/financials/withdrawals/history', undefined, params);
};

/** Instructor: Lấy lịch sử chi trả */
export const getMyPayoutHistory = async (
  params?: PayoutQueryParams
): Promise<PayoutListResponse> => {
  // Instructor chỉ xem của mình, không cần instructorId filter
  const { instructorId, ...restParams } = params || {}; // Loại bỏ instructorId nếu có
  return apiHelper.get('/financials/payouts/history', undefined, restParams);
};

/** Instructor: Lấy chi tiết doanh thu */
export const getMyRevenueDetails = async (
  params?: RevenueDetailsParams
): Promise<RevenueDetailsResponse> => {
  return apiHelper.get('/financials/revenue-details', undefined, params);
};

// --- Admin APIs ---

/** Admin: Duyệt/Từ chối yêu cầu rút tiền */
export const reviewWithdrawalRequest = async (
  requestId: number,
  data: ReviewWithdrawalData
): Promise<WithdrawalRequest> => {
  return apiHelper.patch(`/financials/withdrawals/${requestId}/review`, data);
};

/** Admin: Lấy danh sách Payouts */
export const getPayouts = async (
  params?: PayoutQueryParams
): Promise<PayoutListResponse> => {
  return apiHelper.get('/financials/payouts', undefined, params);
};

/** Admin: Xử lý chi trả */
export const processPayoutExecution = async (
  payoutId: number,
  data: ProcessPayoutData
): Promise<Payout> => {
  return apiHelper.patch(`/financials/payouts/${payoutId}/process`, data);
};
