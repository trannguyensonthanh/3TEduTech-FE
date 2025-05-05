// src/services/order.service.ts
import apiHelper from './apiHelper';

export interface OrderItem {
  OrderItemID: number;
  CourseID: number;
  PriceAtOrder: number;
  EnrollmentID?: number | null;
  // Thông tin join
  CourseName?: string;
  Slug?: string;
  ThumbnailUrl?: string | null;
}

export interface Order {
  OrderID: number;
  AccountID: number;
  OrderDate: string; // ISO Date string
  OriginalTotalPrice: number;
  DiscountAmount: number; // Discount từ promotion
  FinalAmount: number;
  PromotionID?: number | null;
  PaymentID?: number | null;
  OrderStatus: string; // OrderStatus Enum
  // Thông tin join
  items?: OrderItem[];
  PaymentStatusID?: string | null; // PaymentStatus Enum
}

export interface OrderListResponse {
  orders: Partial<Order>[]; // Thông tin rút gọn
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: string; // OrderStatus Enum
}

/** Tạo đơn hàng từ giỏ hàng */
export const createOrderFromCart = async (
  promotionCode?: string | null
): Promise<Order> => {
  return apiHelper.post('/orders', { promotionCode });
};

/** Lấy lịch sử đơn hàng */
export const getMyOrders = async (
  params?: OrderQueryParams
): Promise<OrderListResponse> => {
  return apiHelper.get('/orders', undefined, params);
};

/** Lấy chi tiết đơn hàng */
export const getMyOrderDetails = async (orderId: number): Promise<Order> => {
  return apiHelper.get(`/orders/${orderId}`);
};

// Hàm xử lý webhook không cần gọi từ FE
