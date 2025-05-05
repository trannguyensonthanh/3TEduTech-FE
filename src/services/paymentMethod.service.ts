// src/services/paymentMethod.service.ts
import apiHelper from './apiHelper';

// --- Kiểu dữ liệu ---
// Định nghĩa interface cho đối tượng PaymentMethod trả về từ API
export interface PaymentMethod {
  MethodID: string;
  MethodName: string;
  // Thêm các trường khác nếu API trả về (ví dụ: isEnabled)
}

// Định nghĩa interface cho dữ liệu tạo mới (Admin)
export interface CreatePaymentMethodData {
  methodId: string;
  methodName: string;
}

// Định nghĩa interface cho dữ liệu cập nhật (Admin)
export interface UpdatePaymentMethodData {
  methodName: string; // Chỉ cho phép cập nhật tên?
}

// Định nghĩa kiểu dữ liệu cho response trả về từ API lấy danh sách
interface PaymentMethodListResponse {
  paymentMethods: PaymentMethod[];
  // Có thể có thông tin phân trang nếu API hỗ trợ
}

// --- Hàm gọi API ---

/**
 * Lấy danh sách tất cả các phương thức thanh toán khả dụng.
 * (Dùng cho cả Admin và Instructor/User khi cần hiển thị lựa chọn)
 * @returns {Promise<PaymentMethodListResponse>}
 */
export const getAvailablePaymentMethods =
  async (): Promise<PaymentMethodListResponse> => {
    // Giả sử API GET /payment-methods trả về dạng { paymentMethods: [...] }
    return apiHelper.get('/payment-methods');
  };

// --- Admin APIs ---

/**
 * Admin: Tạo phương thức thanh toán mới.
 * @param {CreatePaymentMethodData} data - Dữ liệu phương thức mới.
 * @returns {Promise<PaymentMethod>} - Phương thức vừa tạo.
 */
export const createPaymentMethod = async (
  data: CreatePaymentMethodData
): Promise<PaymentMethod> => {
  return apiHelper.post('/payment-methods', data);
};

/**
 * Admin: Lấy chi tiết một phương thức thanh toán.
 * @param {string} methodId - ID của phương thức.
 * @returns {Promise<PaymentMethod>} - Chi tiết phương thức.
 */
export const getPaymentMethodById = async (
  methodId: string
): Promise<PaymentMethod> => {
  return apiHelper.get(`/payment-methods/${methodId}`);
};

/**
 * Admin: Cập nhật tên phương thức thanh toán.
 * @param {string} methodId - ID của phương thức cần cập nhật.
 * @param {UpdatePaymentMethodData} data - Dữ liệu cập nhật.
 * @returns {Promise<PaymentMethod>} - Phương thức đã cập nhật.
 */
export const updatePaymentMethod = async (
  methodId: string,
  data: UpdatePaymentMethodData
): Promise<PaymentMethod> => {
  return apiHelper.patch(`/payment-methods/${methodId}`, data);
};

/**
 * Admin: Xóa phương thức thanh toán.
 * @param {string} methodId - ID của phương thức cần xóa.
 * @returns {Promise<void>}
 */
export const deletePaymentMethod = async (methodId: string): Promise<void> => {
  await apiHelper.delete(`/payment-methods/${methodId}`);
};
