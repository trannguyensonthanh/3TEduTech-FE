/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/CartPage.tsx
import React, { useState, useMemo, useEffect } from 'react'; // Thêm useEffect
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/common/Icons';
import {
  useMyCart,
  useRemoveCourseFromCart,
  useClearMyCart,
} from '@/hooks/queries/cart.queries';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Trash2,
  XCircle,
  ShoppingBag,
  TicketPercent,
  AlertCircle,
} from 'lucide-react';
import { ValidatedPromotionInfo } from '@/types/cart.types'; // Import type ValidatedPromotionInfo
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useValidatePromotionCode } from '@/hooks/queries/promotion.queries';
import { CartItem } from '@/services/cart.service';

const CartPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // --- Fetch Cart Data ---
  const {
    data: cartData,
    isLoading: isLoadingCart,
    isError: isCartError,
    error: cartError,
    refetch: refetchCart,
  } = useMyCart();

  // --- Mutations ---
  const { mutate: removeItemMutate, isPending: isRemovingItem } =
    useRemoveCourseFromCart();
  const { mutate: clearCartMutate, isPending: isClearingCart } =
    useClearMyCart();
  const { mutate: validatePromoMutate, isPending: isApplyingPromo } =
    useValidatePromotionCode();

  // --- State for Promo Code ---
  const [promoCodeInput, setPromoCodeInput] = useState('');
  // State để lưu trữ thông tin mã giảm giá đã validate thành công
  const [validatedPromo, setValidatedPromo] =
    useState<ValidatedPromotionInfo | null>(null);

  const items = cartData?.items || [];
  const summary = cartData?.summary;

  // Reset validatedPromo nếu giỏ hàng thay đổi (ví dụ: xóa item)
  useEffect(() => {
    setValidatedPromo(null);
    setPromoCodeInput(''); // Reset cả ô input promo code
  }, [cartData?.items.length, summary?.finalPrice]); // Theo dõi sự thay đổi của item hoặc tổng tiền

  // --- Handlers ---
  const handleRemoveItem = (courseId: number) => {
    if (isRemovingItem) return;
    removeItemMutate(courseId, {
      onSuccess: (data) => {
        toast({ title: 'Item Removed', description: data.message });
        // React Query tự cập nhật cache cho cartKeys.myCart nếu hook mutation được cấu hình đúng
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Could not remove item.',
          variant: 'destructive',
        });
      },
    });
  };

  const handleClearCart = () => {
    if (items.length === 0 || isClearingCart) return;
    // Dùng ConfirmationDialog nếu muốn
    if (
      window.confirm(
        'Are you sure you want to clear your cart? This will also remove any applied promo code.'
      )
    ) {
      clearCartMutate(undefined, {
        onSuccess: (data) => {
          toast({ title: 'Cart Cleared', description: data.message });
          setValidatedPromo(null); // Xóa promo đã áp dụng ở FE
          setPromoCodeInput('');
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message || 'Could not clear cart.',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleApplyPromo = () => {
    if (!promoCodeInput.trim() || isApplyingPromo) return;
    validatePromoMutate(promoCodeInput.trim(), {
      onSuccess: (data) => {
        if (data.isValid && data.discountAmount > 0) {
          setValidatedPromo({
            promotionId: data.promotionId,
            discountCode: promoCodeInput.trim(), // Lưu mã đã nhập
            discountAmount: data.discountAmount,
            message: data.message,
          });
          toast({ title: 'Promo Code Applied', description: data.message });
        } else {
          setValidatedPromo(null); // Xóa promo cũ nếu mã mới không hợp lệ hoặc không giảm giá
          toast({
            title: 'Promo Code',
            description:
              data.message || "This promo code is not valid or doesn't apply.",
            variant: 'destructive',
          });
        }
      },
      onError: (error: any) => {
        // `error` có thể chứa response từ ApiError
        setValidatedPromo(null); // Xóa promo cũ nếu có lỗi
        toast({
          title: 'Invalid Promo Code',
          description:
            error.response?.data?.message ||
            error.message ||
            'Could not validate promo code.',
          variant: 'destructive',
        });
      },
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({ title: 'Cart is Empty', variant: 'destructive' });
      return;
    }
    // Khi checkout, truyền cả thông tin cart và validatedPromo (nếu có)
    // Backend sẽ sử dụng promotionId và discountAmount để tạo Order
    navigate('/checkout', {
      state: { cartData, validatedPromoInfo: validatedPromo },
    });
  };

  // --- Tính toán hiển thị giá ---
  const subtotalBeforePromo = summary?.finalPrice || 0; // Giá sau khi đã trừ discount của từng khóa học
  const promoDiscountAmount = validatedPromo?.discountAmount || 0;
  const finalTotal = Math.max(0, subtotalBeforePromo - promoDiscountAmount); // Đảm bảo không âm

  // --- Render Logic ---

  if (isLoadingCart) {
    return (
      <Layout>
        <div className="container mx-auto p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your cart...</p>
        </div>
      </Layout>
    );
  }
  if (isCartError) {
    return (
      <Layout>
        <div className="container mx-auto p-12 text-center text-destructive">
          <XCircle className="h-12 w-12 mx-auto mb-2" />
          <p className="font-semibold">Error loading cart</p>
          <p className="text-sm">
            {cartError?.message || 'Please try refreshing the page.'}
          </p>
          <Button
            onClick={() => refetchCart()}
            variant="outline"
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8 tracking-tight">
          Your Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16 space-y-6 bg-card border rounded-lg shadow-sm">
            <ShoppingBag className="h-16 w-16 text-primary mx-auto opacity-70" />
            <h2 className="text-2xl font-semibold">
              Your cart is looking a little light!
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Fill it up with amazing courses and kickstart your learning
              journey.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link to="/courses">Explore Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-semibold">
                  {items.length} Course{items.length !== 1 ? 's' : ''}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  disabled={isClearingCart || items.length === 0}
                  className="text-muted-foreground hover:text-destructive"
                >
                  {isClearingCart ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Clear All
                </Button>
              </div>

              <div className="space-y-4 divide-y divide-border">
                {items.map((item: CartItem) => (
                  <div
                    key={item.cartItemId}
                    className="flex flex-col sm:flex-row gap-4 pt-4 first:pt-0"
                  >
                    <Link
                      to={`/courses/${item.slug}`}
                      className="block w-full sm:w-40 md:w-48 shrink-0"
                    >
                      <AspectRatio
                        ratio={16 / 9}
                        className="bg-muted rounded-md overflow-hidden"
                      >
                        <img
                          src={
                            item.thumbnailUrl ||
                            `https://via.placeholder.com/320x180?text=${encodeURIComponent(
                              item.courseName
                            )}`
                          }
                          alt={item.courseName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </AspectRatio>
                    </Link>

                    <div className="flex-grow flex flex-col">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            to={`/courses/${item.slug}`}
                            className="text-base md:text-lg font-semibold hover:text-primary transition-colors line-clamp-2 pr-2"
                            title={item.courseName}
                          >
                            {item.courseName}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.courseId)}
                            disabled={isRemovingItem}
                            className="h-8 w-8 shrink-0 -mr-2 -mt-1"
                          >
                            <XCircle className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          By {item.instructorName}
                        </p>
                      </div>

                      <div className="mt-auto pt-2 flex items-baseline justify-start">
                        {item.currentPrice < item.originalPrice ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-primary">
                              ${item.currentPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                            {/* <Badge variant="destructive_outline" className="text-xs">
                                {Math.round((1 - item.currentPrice / item.originalPrice) * 100)}% OFF
                            </Badge> */}
                          </div>
                        ) : (
                          <span className="text-lg font-bold">
                            ${item.currentPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 bg-card shadow-sm sticky top-24">
                <h3 className="text-xl font-semibold mb-6 border-b pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${subtotalBeforePromo.toFixed(2)}</span>
                  </div>
                  {validatedPromo && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                      <span>Promo "{validatedPromo.discountCode}":</span>
                      <span>-${promoDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-2xl mb-6">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="promo-code" className="text-sm font-medium">
                    Have a Promo Code?
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="promo-code"
                      placeholder="Enter code"
                      value={promoCodeInput}
                      onChange={(e) =>
                        setPromoCodeInput(e.target.value.toUpperCase())
                      }
                      className="h-10"
                      disabled={isApplyingPromo}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo || !promoCodeInput.trim()}
                      className="h-10 shrink-0"
                    >
                      {isApplyingPromo ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  </div>
                  {validatedPromo?.message && (
                    <p
                      className={`text-xs ${
                        validatedPromo.discountAmount > 0
                          ? 'text-green-600'
                          : 'text-muted-foreground'
                      } flex items-center`}
                    >
                      {validatedPromo.discountAmount > 0 && (
                        <TicketPercent size={14} className="mr-1" />
                      )}
                      {validatedPromo.message}
                    </p>
                  )}

                  <Button
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full text-primary hover:text-primary"
                  >
                    <Link to="/courses">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
