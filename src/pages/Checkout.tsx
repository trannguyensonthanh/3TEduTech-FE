import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/common/Icons";

// Import components
import {
  PaymentMethodList,
  PaymentMethod,
} from "@/components/checkout/PaymentMethodList";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import {
  MomoPayment,
  MomoPaymentMode,
  MomoPaymentStatus,
} from "@/components/checkout/payment-methods/MomoPayment";
import {
  BankTransferPayment,
  BankAccountDetails,
} from "@/components/checkout/payment-methods/BankTransferPayment";
import { PayPalPayment } from "@/components/checkout/payment-methods/PayPalPayment";
import {
  CryptoPayment,
  CryptoPaymentDetails,
} from "@/components/checkout/payment-methods/CryptoPayment";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [paymentStep, setPaymentStep] = useState<
    "method-selection" | "payment-details"
  >("method-selection");
  const [bankDetails, setBankDetails] = useState<BankAccountDetails | null>(
    null
  );
  const [cryptoDetails, setCryptoDetails] =
    useState<CryptoPaymentDetails | null>(null);
  const [momoQrCode, setMomoQrCode] = useState<string | null>(null);
  const [countdownTime, setCountdownTime] = useState(900); // 15 minutes in seconds
  const [momoPaymentMode, setMomoPaymentMode] =
    useState<MomoPaymentMode>("qrcode");
  const [momoPaymentStatus, setMomoPaymentStatus] =
    useState<MomoPaymentStatus>("waiting");

  // Tax rate (10%)
  const taxAmount = total * 0.1;
  const finalAmount = total + taxAmount;

  // Payment methods list
  const paymentMethods: PaymentMethod[] = [
    {
      id: "credit-card",
      name: "Credit Card",
      description: "Visa, MasterCard, American Express",
      icon: <Icons.creditCard className="h-6 w-6" />,
      category: "card",
    },
    {
      id: "debit-card",
      name: "Debit Card",
      description: "Direct charge to your bank account",
      icon: <Icons.creditCard className="h-6 w-6" />,
      category: "card",
    },
    {
      id: "bank-transfer",
      name: "Chuyển khoản Ngân hàng (VietQR)",
      description: "Chuyển tiền từ tài khoản ngân hàng của bạn",
      icon: <Icons.building className="h-6 w-6" />,
      category: "bank",
    },
    {
      id: "momo",
      name: "MoMo E-Wallet",
      description: "Pay with your MoMo account",
      icon: <div className="text-pink-500">MoMo</div>,
      category: "digital",
    },
    {
      id: "vnpay",
      name: "VNPAY",
      description: "Vietnam Payment Solution",
      icon: <div className="text-blue-500">VNPAY</div>,
      category: "digital",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with your PayPal account",
      icon: <Icons.paypal className="h-6 w-6 text-blue-500" />,
      category: "digital",
    },
    {
      id: "bitcoin",
      name: "Bitcoin (BTC)",
      description: "Pay with Bitcoin",
      icon: <Icons.bitcoin className="h-6 w-6 text-orange-500" />,
      category: "crypto",
    },
    {
      id: "ethereum",
      name: "Ethereum (ETH)",
      description: "Pay with Ethereum",
      icon: <Icons.ethereum className="h-6 w-6 text-purple-500" />,
      category: "crypto",
    },
    {
      id: "usdt",
      name: "Tether (USDT)",
      description: "Pay with USDT",
      icon: <div className="text-green-500">USDT</div>,
      category: "crypto",
    },
  ];

  // Countdown timer for QR code expiration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (
      paymentStep === "payment-details" &&
      ((paymentMethod === "momo" && momoPaymentMode === "qrcode") ||
        paymentMethod === "vnpay") &&
      countdownTime > 0
    ) {
      interval = setInterval(() => {
        setCountdownTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentStep, paymentMethod, countdownTime, momoPaymentMode]);

  // Reset payment details when changing payment method
  useEffect(() => {
    setBankDetails(null);
    setCryptoDetails(null);
    setMomoQrCode(null);
    setCountdownTime(900);
    setPaymentStep("method-selection");
    setMomoPaymentStatus("waiting");
  }, [paymentMethod]);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  // Handle MoMo payment mode change
  const handleMomoModeChange = (mode: MomoPaymentMode) => {
    setMomoPaymentMode(mode);
  };

  // Mock function to process payment
  const processPayment = () => {
    if (!paymentMethod) {
      toast({
        variant: "destructive",
        title: "Payment method required",
        description: "Please select a payment method to continue",
      });
      return;
    }

    setIsProcessing(true);

    // For demo purposes, simulate different payment workflows
    switch (paymentMethod) {
      case "momo":
        // In a real app, this would call an API to get the QR code URL or redirect URL
        setTimeout(() => {
          if (momoPaymentMode === "qrcode" || Math.random() > 0.5) {
            // QR Code flow
            setMomoQrCode(
              "https://via.placeholder.com/300x300?text=MoMo+QR+Code"
            );
            setMomoPaymentStatus("waiting");
            setPaymentStep("payment-details");
            // In a real implementation, we would start polling for payment status here
            // Simulate status changes for demo purposes
            setTimeout(() => {
              setMomoPaymentStatus("processing");
              setTimeout(() => {
                setMomoPaymentStatus("success");
                clearCart();
                toast({
                  title: "Thanh toán thành công!",
                  description: "Giao dịch MoMo của bạn đã được xác nhận.",
                });
                navigate("/payment-success");
              }, 8000);
            }, 5000);
          } else {
            // Redirect flow - for demo just simulate successful payment
            clearCart();
            toast({
              title: "Payment successful!",
              description: "Your MoMo payment has been processed successfully.",
            });
            navigate("/payment-success");
          }
          setIsProcessing(false);
        }, 1500);
        break;

      case "vnpay":
        // In a real app, this would redirect to VNPAY gateway
        setTimeout(() => {
          // For demo, we'll just simulate a successful payment
          clearCart();
          toast({
            title: "Payment successful!",
            description: "Your VNPAY payment has been processed successfully.",
          });
          navigate("/payment-success");
          setIsProcessing(false);
        }, 2000);
        break;

      case "bank-transfer":
        // Display bank account details with VietQR
        setTimeout(() => {
          setBankDetails({
            bankName: "Vietcombank",
            accountNumber: "9876543210",
            accountHolder: "3TEDUTECH Inc.",
            branch: "Hồ Chí Minh",
            transferContent: `ORDER-${Date.now().toString().substring(8)}`,
            qrCodeUrl: "https://via.placeholder.com/300x300?text=VietQR+Code",
          });
          setPaymentStep("payment-details");
          setIsProcessing(false);
        }, 1000);
        break;

      case "paypal":
        // Set up PayPal payment flow
        setPaymentStep("payment-details");
        setIsProcessing(false);
        break;

      case "bitcoin":
      case "ethereum":
      case "usdt":
        // Display crypto payment details
        setTimeout(() => {
          setCryptoDetails({
            coin:
              paymentMethod === "bitcoin"
                ? "BTC"
                : paymentMethod === "ethereum"
                ? "ETH"
                : "USDT",
            network: paymentMethod === "usdt" ? "TRC20" : "Main Network",
            address: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
            amount:
              paymentMethod === "bitcoin"
                ? "0.00123"
                : paymentMethod === "ethereum"
                ? "0.0123"
                : "50",
          });
          setPaymentStep("payment-details");
          setIsProcessing(false);
        }, 1000);
        break;

      default:
        // For credit card, debit card, etc. - simulate a direct successful payment
        setTimeout(() => {
          clearCart();
          toast({
            title: "Payment successful!",
            description: "Your payment has been processed successfully.",
          });
          navigate("/payment-success");
          setIsProcessing(false);
        }, 2000);
        break;
    }
  };

  // Render payment details based on selected method
  const renderPaymentDetails = () => {
    switch (paymentMethod) {
      case "momo":
        return (
          <MomoPayment
            momoQrCode={momoQrCode}
            finalAmount={finalAmount}
            countdownTime={countdownTime}
            momoPaymentMode={momoPaymentMode}
            momoPaymentStatus={momoPaymentStatus}
            onModeChange={handleMomoModeChange}
            onGoBack={() => setPaymentStep("method-selection")}
          />
        );

      case "bank-transfer":
        return (
          bankDetails && (
            <BankTransferPayment
              bankDetails={bankDetails}
              finalAmount={finalAmount}
              onGoBack={() => setPaymentStep("method-selection")}
              onComplete={() => {
                clearCart();
                toast({
                  title: "Đã ghi nhận đơn hàng",
                  description:
                    "Chúng tôi sẽ kiểm tra và xác nhận thanh toán của bạn.",
                });
                navigate("/payment-success");
              }}
            />
          )
        );

      case "paypal":
        return (
          <PayPalPayment
            finalAmount={finalAmount}
            isProcessing={isProcessing}
            onGoBack={() => setPaymentStep("method-selection")}
          />
        );

      case "bitcoin":
      case "ethereum":
      case "usdt":
        return (
          cryptoDetails && (
            <CryptoPayment
              cryptoDetails={cryptoDetails}
              finalAmount={finalAmount}
              onGoBack={() => setPaymentStep("method-selection")}
              onComplete={() => {
                clearCart();
                toast({
                  title: "Đã ghi nhận đơn hàng",
                  description:
                    "Chúng tôi sẽ kiểm tra và xác nhận thanh toán của bạn.",
                });
                navigate("/payment-success");
              }}
            />
          )
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {paymentStep === "method-selection" ? (
              // Payment Method Selection
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                  <CardDescription>
                    Chọn phương thức thanh toán bạn muốn sử dụng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentMethodList
                    paymentMethods={paymentMethods}
                    selectedMethod={paymentMethod}
                    onMethodChange={setPaymentMethod}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={processPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Tiến hành thanh toán"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              // Payment Details (after selecting a method)
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết thanh toán</CardTitle>
                  <CardDescription>Hoàn tất thanh toán của bạn</CardDescription>
                </CardHeader>
                <CardContent>{renderPaymentDetails()}</CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
