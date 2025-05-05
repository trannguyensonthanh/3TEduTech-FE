import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/common/Icons";
import { useToast } from "@/components/ui/use-toast";
import { CopyableField } from "../CopyableField";

// Bank account details for bank transfer method
export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  transferContent: string;
  qrCodeUrl?: string;
}

interface BankTransferPaymentProps {
  bankDetails: BankAccountDetails;
  finalAmount: number;
  onGoBack: () => void;
  onComplete: () => void;
}

export const BankTransferPayment: React.FC<BankTransferPaymentProps> = ({
  bankDetails,
  finalAmount,
  onGoBack,
  onComplete,
}) => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">
        Thanh toán bằng Chuyển khoản Ngân hàng (VietQR)
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* VietQR Code Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <img
              src={bankDetails.qrCodeUrl}
              alt="VietQR Code"
              className="w-56 h-56 mx-auto"
            />
          </div>
          <div className="text-sm text-center px-4">
            <p>
              Mở ứng dụng Ngân hàng của bạn, chọn tính năng Quét mã QR để thanh
              toán nhanh chóng.
            </p>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="rounded-lg border p-4 bg-card">
          <CopyableField label="Ngân hàng" value={bankDetails.bankName} />
          <CopyableField
            label="Số tài khoản"
            value={bankDetails.accountNumber}
          />
          <CopyableField
            label="Chủ tài khoản"
            value={bankDetails.accountHolder}
          />
          <CopyableField label="Chi nhánh" value={bankDetails.branch} />

          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <label className="text-sm text-muted-foreground font-medium">
              Nội dung chuyển khoản
            </label>
            <div className="flex items-center mt-1 p-2 rounded bg-background border">
              <div className="flex-1 font-bold">
                {bankDetails.transferContent}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(bankDetails.transferContent);
                  toast({
                    title: "Đã sao chép",
                    description:
                      "Nội dung chuyển khoản đã được sao chép vào clipboard",
                  });
                }}
              >
                <Icons.copy className="h-4 w-4 mr-1" />
                Sao chép
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-primary/10">
            <div className="font-semibold">
              Số tiền cần chuyển: ${finalAmount.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Vui lòng chuyển đúng số tiền và nội dung chuyển khoản để đơn hàng
              được xử lý nhanh chóng.
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted">
        <div className="flex items-start">
          <Icons.info className="h-5 w-5 text-primary mr-2 mt-0.5" />
          <div className="text-sm">
            <p>
              Vui lòng nhập chính xác nội dung chuyển khoản để đơn hàng được xử
              lý tự động.
            </p>
            <p className="mt-1">
              Đơn hàng sẽ được xác nhận sau khi chúng tôi nhận được thanh toán
              của bạn (có thể mất vài phút).
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" className="flex-1" onClick={onGoBack}>
          Chọn phương thức khác
        </Button>
        <Button className="flex-1" onClick={onComplete}>
          Tôi đã chuyển khoản
        </Button>
      </div>
    </div>
  );
};
