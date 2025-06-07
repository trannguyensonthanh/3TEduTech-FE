// src/types/cart.types.ts
import { CartItem, CartSummary } from '@/services/cart.service';

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
