/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/CheckoutPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Icons } from '@/components/common/Icons'; // Bỏ nếu không dùng nhiều
import { useToast } from '@/hooks/use-toast';
import { useMyCart } from '@/hooks/queries/cart.queries';
import { useCreateOrderFromCart } from '@/hooks/queries/order.queries';

import { useValidatePromotionCode } from '@/hooks/queries/promotion.queries'; // Giả sử bạn có hook này
import { ValidatedPromotionInfo } from '@/types/cart.types'; // Giả sử bạn có các type này
import {
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  ShoppingCart,
  TicketPercent,
  ExternalLink,
  Info,
  XCircle,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AspectRatio } from '@/components/ui/aspect-ratio'; // Thêm nếu cần cho item
import { useCreateVnpayUrl } from '@/hooks/queries/payment.queries';
import { CartDetails, CartItem } from '@/services/cart.service';
import { CreateVnpayUrlData } from '@/services/payment.service';
import { CreateOrderFromCartPayload } from '@/services/order.service';
import { Icons } from '@/components/common/Icons';

// Payment Method Item (Có thể tách ra file riêng nếu muốn)
const PaymentMethodItem: React.FC<{
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}> = ({ id, name, icon, description, isSelected, onSelect, disabled }) => (
  <button
    type="button"
    role="radio"
    aria-checked={isSelected}
    onClick={onSelect}
    disabled={disabled}
    className={`w-full p-3 sm:p-4 border rounded-lg flex items-center space-x-3 transition-all text-left
                ${
                  isSelected
                    ? 'ring-2 ring-primary border-primary bg-primary/5 shadow-md'
                    : 'hover:border-foreground/30 bg-card hover:bg-muted/50'
                }
                ${
                  disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
  >
    <div
      className={`p-2 rounded-full ${
        isSelected
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground'
      }`}
    >
      {icon}
    </div>
    <div>
      <span
        className={`font-semibold ${
          isSelected ? 'text-primary' : 'text-card-foreground'
        }`}
      >
        {name}
      </span>
      {description && (
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      )}
    </div>
  </button>
);

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Lấy cartData từ state của router hoặc fetch lại
  const [initialCartDataFromState] = useState<CartDetails | undefined>(
    location.state?.cartData
  );
  const [initialValidatedPromoFromState] =
    useState<ValidatedPromotionInfo | null>(
      location.state?.validatedPromoInfo || null
    );

  const {
    data: liveCartData,
    isLoading: isLoadingCart,
    isError: isCartError,
    error: cartError,
    refetch: refetchCart,
  } = useMyCart({
    enabled: !initialCartDataFromState, // Chỉ fetch nếu không có data từ state (hoặc luôn fetch để đảm bảo mới nhất)
    placeholderData: initialCartDataFromState
      ? () => initialCartDataFromState
      : undefined,
    staleTime: 1000 * 15, // Cache 15s
    refetchOnWindowFocus: true,
  });

  console.log(initialCartDataFromState);

  const cartToUse = liveCartData || initialCartDataFromState;
  const items = useMemo(() => cartToUse?.items || [], [cartToUse]);
  const summary = cartToUse?.summary;

  // State cho Promo Code và Payment Method
  const [promoCodeInput, setPromoCodeInput] = useState(
    initialValidatedPromoFromState?.discountCode || ''
  );
  const [validatedPromo, setValidatedPromo] =
    useState<ValidatedPromotionInfo | null>(initialValidatedPromoFromState);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<string>('VNPAY'); // Mặc định VNPAY

  // Mutation Hooks
  const { mutateAsync: createOrderMutateAsync, isPending: isCreatingOrder } =
    useCreateOrderFromCart();
  const {
    mutateAsync: createVnpayUrlMutateAsync,
    isPending: isCreatingVnpayUrl,
  } = useCreateVnpayUrl();
  const { mutate: validatePromoMutate, isPending: isValidatingPromo } =
    useValidatePromotionCode();

  const isProcessingPaymentAction = isCreatingOrder || isCreatingVnpayUrl;

  // Redirect nếu giỏ hàng rỗng
  useEffect(() => {
    if (!isLoadingCart && (!cartToUse || items.length === 0)) {
      navigate('/cart', { replace: true });
    }
  }, [cartToUse, items, isLoadingCart, navigate, toast]);

  // Xử lý áp dụng mã giảm giá
  const handleApplyPromo = () => {
    if (!promoCodeInput.trim() || isValidatingPromo) return;
    validatePromoMutate(promoCodeInput.trim(), {
      // Truyền object payload
      onSuccess: (data) => {
        if (data.isValid && data.discountAmount >= 0) {
          // Cho phép discountAmount = 0 nếu mã hợp lệ nhưng không áp dụng
          setValidatedPromo({
            promotionId: data.promotionId,
            discountCode: promoCodeInput.trim(),
            discountAmount: data.discountAmount,
            message: data.message,
          });
          toast({
            title:
              data.discountAmount > 0 ? 'Promo Applied' : 'Promo Code Valid',
            description: data.message,
          });
        } else {
          setValidatedPromo(null);
          toast({
            title: 'Invalid Promo',
            description: data.message || 'This promo code is not valid.',
            variant: 'destructive',
          });
        }
      },
      onError: (error: any) => {
        setValidatedPromo(null);
        toast({
          title: 'Error Validating Promo',
          description:
            error.response?.data?.message ||
            error.message ||
            'Could not validate promo code.',
          variant: 'destructive',
        });
      },
    });
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (
      !cartToUse ||
      items.length === 0 ||
      isProcessingPaymentAction ||
      !selectedPaymentMethodId
    )
      return;

    const orderPayload: string = validatedPromo?.discountCode || '';
    console.log('Order Payload:', validatedPromo?.discountCode);

    try {
      toast({
        title: 'Placing Your Order...',
        description: 'Please wait a moment.',
        duration: 8000,
      });
      const createdOrder = await createOrderMutateAsync(
        orderPayload ? JSON.stringify(orderPayload) : null
      );
      console.log('Order created successfully:', createdOrder);

      if (createdOrder && createdOrder.orderId) {
        if (selectedPaymentMethodId === 'VNPAY') {
          toast({
            title: 'Order Placed!',
            description: 'Redirecting to VNPAY for payment...',
            duration: 8000,
          });
          const vnpayPayload: CreateVnpayUrlData = {
            orderId: createdOrder.orderId,
            // amount: createdOrder.finalAmount, // Backend sẽ tự lấy amount từ order
            // bankCode: 'VISA', // Hoặc 'VNBANK', 'VISA', 'MASTER'
            locale: 'vn', // Hoặc 'en'
          };
          const vnpayResponse = await createVnpayUrlMutateAsync(vnpayPayload, {
            onSuccess: (data) => {
              console.log('VNPAY URL successfully created:', data);
            },
            onError: (error: any) => {
              console.error('Error creating VNPAY URL:', error);
            },
          });
          console.log('VNPAY URL:', vnpayResponse);
          if (vnpayResponse.paymentUrl) {
            window.location.href = vnpayResponse.paymentUrl; // Redirect
          } else {
            throw new Error('Could not retrieve VNPAY payment URL.');
          }
        } else if (selectedPaymentMethodId === 'COD') {
          // Ví dụ COD
          toast({
            title: 'Order Placed (COD)',
            description: 'Your order will be processed. Thank you!',
          });
          navigate(`/order-success/${createdOrder.orderId}?payment_method=cod`);
        }
        // Thêm các case khác cho từng payment method
      } else {
        throw new Error('Order creation failed or did not return valid data.');
      }
    } catch (error: any) {
      console.error('Checkout process error:', error);
      toast({
        title: 'Checkout Failed',
        description:
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred.',
        variant: 'destructive',
        duration: 7000,
      });
    }
  };

  // --- Tính toán giá trị hiển thị ---
  const subtotal = summary?.finalPrice || 0; // Giá sau khi đã trừ discount của từng khóa học
  const promoDiscount = validatedPromo?.discountAmount || 0;
  const finalTotal = Math.max(0, subtotal - promoDiscount); // Đảm bảo không âm

  // --- Render Logic ---
  if (isLoadingCart && !initialCartDataFromState) {
    return (
      <Layout>
        <div className="container mx-auto p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading checkout...</p>
        </div>
      </Layout>
    );
  }
  if (isCartError && !initialCartDataFromState) {
    return (
      <Layout>
        <div className="container mx-auto p-12 text-center text-destructive">
          <XCircle className="h-12 w-12 mx-auto mb-2" />
          <p className="font-semibold">Error loading checkout</p>
          <p className="text-sm">
            {cartError?.message || 'Please try again later.'}
          </p>
        </div>
      </Layout>
    );
  }
  if (!cartToUse || items.length === 0) {
    return (
      <Layout>
        <div className="container p-12 text-center">Redirecting to cart...</div>
      </Layout>
    );
  }

  const paymentMethodsList = [
    {
      id: 'VNPAY',
      name: 'VNPAY Gateway',
      icon: (
        <img src="/images/payment/vnpay_logo.jpg" alt="VNPAY" className="h-6" />
      ),
      description: 'Pay with ATM, Visa/Master, QR Code via VNPAY.',
    },
    {
      id: 'MOMO',
      name: 'MoMo E-Wallet',
      icon: (
        <img src="/images/payment/momo_logo.png" alt="MoMo" className="h-6" />
      ),
      disabled: true,
    },
    {
      id: 'COD',
      name: 'Cash on Delivery (COD)',
      icon: <Landmark className="h-5 w-5 text-green-600" />,
      description: 'Pay when you receive your order (if applicable).',
      disabled: true,
    }, // Tạm disable
    {
      id: 'PAYPAL',
      name: 'PayPal',
      icon: <Icons.paypal className="h-6 w-6 text-blue-600" />,
      disabled: true,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm group"
        >
          <ChevronLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />{' '}
          Back
        </Button>
        <h1 className="text-3xl lg:text-4xl font-bold mb-8 tracking-tight">
          Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-border/60">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard size={24} className="text-primary" /> Select
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose your preferred way to pay.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethodsList.map((method) => (
                  <PaymentMethodItem
                    key={method.id}
                    {...method}
                    isSelected={selectedPaymentMethodId === method.id}
                    onSelect={() => setSelectedPaymentMethodId(method.id)}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Thông tin bổ sung hoặc form nếu cần cho payment method */}
            {/* Ví dụ: form nhập thông tin thẻ (nếu không dùng cổng redirect) */}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-xl p-5 sm:p-6 bg-card shadow-xl sticky top-24">
              <h3 className="text-lg font-semibold mb-5 border-b pb-3 flex items-center gap-2">
                <ShoppingCart size={20} />
                Order Summary
              </h3>
              <ScrollArea className="max-h-64 mb-4 pr-2 -mr-2">
                {items.map((item: CartItem) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-3 py-2.5 border-b last:border-b-0"
                  >
                    <Link to={`/courses/${item.slug}`} className="shrink-0">
                      {item.thumbnailUrl && item.courseName ? (
                        <div className="w-20 h-14 bg-muted rounded flex items-center justify-center">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.courseName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-11 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            No Image
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="flex-grow min-w-0">
                      <Link
                        to={`/courses/${item.slug}`}
                        className="text-sm font-medium line-clamp-2 hover:text-primary"
                        title={item.courseName}
                      >
                        {item.courseName}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        ${item.currentPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <Separator className="my-4" />
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {validatedPromo && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                    <span>Promo "{validatedPromo.discountCode}"</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-xl mb-6">
                <span>Order Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="checkout-promo-code"
                  className="text-xs font-medium"
                >
                  Apply Promo Code
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="checkout-promo-code"
                    placeholder="Enter code"
                    value={promoCodeInput}
                    onChange={(e) =>
                      setPromoCodeInput(e.target.value.toUpperCase())
                    }
                    className="h-9 text-sm"
                    disabled={isValidatingPromo}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={isValidatingPromo || !promoCodeInput.trim()}
                    className="h-9 shrink-0 text-sm px-3"
                  >
                    {isValidatingPromo ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
                {validatedPromo?.message && (
                  <p
                    className={`text-xs mt-1 ${
                      validatedPromo.discountAmount > 0
                        ? 'text-green-600'
                        : 'text-amber-600'
                    } flex items-center`}
                  >
                    <Info size={13} className="mr-1" />
                    {validatedPromo.message}
                  </p>
                )}

                <Button
                  className="w-full h-11 text-base font-semibold mt-4"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={
                    isProcessingPaymentAction ||
                    items.length === 0 ||
                    !selectedPaymentMethodId
                  }
                >
                  {isProcessingPaymentAction ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-5 w-5" />
                  )}
                  Place Order & Pay
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                By proceeding, you agree to our{' '}
                <Link to="/terms" className="underline hover:text-primary">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="underline hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
