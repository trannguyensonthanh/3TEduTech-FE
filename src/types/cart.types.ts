// src/types/cart.types.ts
import { CartItem } from '@/services/cart.service';
import { IsoDateTimeString } from './common.types';

export interface CartSummary {
  totalOriginalPrice: number;
  totalDiscount: number;
  finalPrice: number; // Giá trước khi áp dụng mã khuyến mãi từ trang Cart
  itemCount: number;
}

// Thông tin khuyến mãi được xác thực và lưu ở FE
export interface ValidatedPromotionInfo {
  promotionId: number;
  discountCode: string; // Lưu lại mã đã nhập
  discountAmount: number; // Số tiền được giảm
  message?: string; // Thông báo từ API (tùy chọn)
}

export interface CartDetails {
  cartId: number;
  items: CartItem[];
  summary: CartSummary;
  // Không còn appliedPromotion từ API viewCart, FE tự quản lý validatedPromotion
}

// Payload và Response cho API Validate Promo Code
export interface ValidatePromoPayload {
  promotionCode: string;
  // Backend có thể tự lấy currentTotal từ cart của user dựa trên req.user.id
}

export interface ValidatePromoResponse {
  isValid: boolean; // API validate chỉ trả về cái này
  discountAmount: number; // Số tiền giảm nếu hợp lệ
  promotionId: number; // ID của promotion nếu hợp lệ
  message: string; // Thông báo
}
