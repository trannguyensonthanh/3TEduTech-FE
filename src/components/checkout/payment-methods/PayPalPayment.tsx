import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/common/Icons";

interface PayPalPaymentProps {
  finalAmount: number;
  isProcessing: boolean;
  onGoBack: () => void;
}

export const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  finalAmount,
  isProcessing,
  onGoBack,
}) => {
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);

  // PayPal script initialization
  useEffect(() => {
    if (!paypalButtonRendered && paypalButtonRef.current) {
      // For demo purposes only - in real app, you'd load the PayPal script dynamically
      // This simulates the PayPal button rendering
      setPaypalButtonRendered(true);

      // Simulate PayPal button loading
      setTimeout(() => {
        if (paypalButtonRef.current) {
          const mockButton = document.createElement("button");
          mockButton.className =
            "py-2 px-4 bg-blue-500 text-white rounded-md w-full font-medium";
          mockButton.textContent = "PayPal Checkout";
          mockButton.onclick = () => {
            // Simulate PayPal checkout flow - in a real app, this would be handled by the PayPal SDK
            console.log("PayPal checkout initiated");
          };

          // Clear previous content and append the button
          paypalButtonRef.current.innerHTML = "";
          paypalButtonRef.current.appendChild(mockButton);
        }
      }, 1000);
    }
  }, [paypalButtonRendered]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Thanh toán bằng PayPal</h3>

      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
        <div className="flex items-start">
          <Icons.info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p>
              Bạn sẽ được chuyển hướng đến trang thanh toán PayPal để hoàn tất
              giao dịch.
            </p>
            <p className="mt-1">
              Sau khi thanh toán thành công, bạn sẽ được tự động chuyển về trang
              thông báo kết quả.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 bg-card">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <Icons.paypal className="w-16 h-16 text-blue-500" />
          </div>
          <p className="font-medium">Số tiền thanh toán:</p>
          <p className="text-2xl font-bold mb-4">${finalAmount.toFixed(2)}</p>
        </div>

        {isProcessing ? (
          <div className="flex justify-center items-center py-4">
            <Icons.spinner className="h-6 w-6 animate-spin mr-2" />
            <span>Đang xử lý thanh toán...</span>
          </div>
        ) : (
          <div
            id="paypal-button-container"
            ref={paypalButtonRef}
            className="py-4 flex justify-center"
          >
            <Button disabled className="w-full">
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Đang tải PayPal...
            </Button>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" className="w-full" onClick={onGoBack}>
          Chọn phương thức khác
        </Button>
      </div>
    </div>
  );
};
