import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/common/Icons";
import { useToast } from "@/components/ui/use-toast";

interface CheckoutReturnProps {
  paymentMethod: "momo" | "vnpay";
}

const CheckoutReturn = ({ paymentMethod }: CheckoutReturnProps) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // In a real implementation, we would make an API call to verify the payment
    // using query parameters from the URL

    // For this demo, we'll simulate the verification process
    const verifyPayment = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // For demo purposes, check for a 'status' parameter in the URL
        // In real implementation, this would be more complex
        const params = new URLSearchParams(location.search);
        const status = params.get("status") || "success"; // Default to success for demo

        if (status === "success") {
          setIsSuccess(true);
          toast({
            title: "Thanh toán thành công",
            description: "Cảm ơn bạn đã mua khóa học!",
          });
        } else {
          setIsSuccess(false);
          setErrorMessage("Thanh toán không thành công. Vui lòng thử lại.");
          toast({
            variant: "destructive",
            title: "Thanh toán thất bại",
            description: "Đã xảy ra lỗi trong quá trình thanh toán.",
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setIsSuccess(false);
        setErrorMessage("Đã xảy ra lỗi trong quá trình xác minh thanh toán.");
        toast({
          variant: "destructive",
          title: "Lỗi xác minh",
          description: "Đã xảy ra lỗi trong quá trình xác minh thanh toán.",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [location.search, toast]);

  const handleGoToMyCourses = () => {
    navigate("/my-courses");
  };

  const handleRetry = () => {
    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {isVerifying
                  ? "Đang xác minh thanh toán..."
                  : isSuccess
                  ? "Thanh toán thành công"
                  : "Thanh toán thất bại"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                {isVerifying ? (
                  <div className="py-8">
                    <Icons.spinner className="h-16 w-16 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">
                      Vui lòng chờ trong khi chúng tôi xác minh thanh toán của
                      bạn...
                    </p>
                  </div>
                ) : isSuccess ? (
                  <div className="py-8">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                      <Icons.check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="mt-4 text-xl font-medium">
                      Thanh toán của bạn đã được xác nhận!
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Cảm ơn bạn đã mua khóa học. Bạn có thể truy cập khóa học
                      ngay bây giờ.
                    </p>
                    <Button
                      onClick={handleGoToMyCourses}
                      className="mt-6 w-full"
                    >
                      Đi đến khóa học của tôi
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                      <Icons.x className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="mt-4 text-xl font-medium">
                      Thanh toán không thành công
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {errorMessage ||
                        "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."}
                    </p>
                    <Button onClick={handleRetry} className="mt-6 w-full">
                      Thử lại
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutReturn;
