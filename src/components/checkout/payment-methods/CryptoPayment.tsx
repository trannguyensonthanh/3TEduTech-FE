import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/common/Icons";
import { CopyableField } from "../CopyableField";

// Crypto payment details
export interface CryptoPaymentDetails {
  coin: string;
  network: string;
  address: string;
  amount: string;
}

interface CryptoPaymentProps {
  cryptoDetails: CryptoPaymentDetails;
  finalAmount: number;
  onGoBack: () => void;
  onComplete: () => void;
}

export const CryptoPayment: React.FC<CryptoPaymentProps> = ({
  cryptoDetails,
  finalAmount,
  onGoBack,
  onComplete,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Thanh toán {cryptoDetails.coin}</h3>

      <div className="rounded-lg border p-4 bg-card">
        <CopyableField label="Loại coin" value={cryptoDetails.coin} />
        <CopyableField label="Mạng lưới" value={cryptoDetails.network} />
        <CopyableField label="Địa chỉ ví" value={cryptoDetails.address} />
        <CopyableField label="Số lượng" value={cryptoDetails.amount} />

        <div className="mt-4 p-3 rounded-lg bg-primary/10">
          <div className="font-semibold">
            Giá trị tương đương: ${finalAmount.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Vui lòng chuyển đúng loại coin, đúng mạng và đúng số lượng.
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted">
        <div className="flex items-start">
          <Icons.info className="h-5 w-5 text-primary mr-2 mt-0.5" />
          <div className="text-sm">
            <p>
              Chờ xác nhận blockchain, có thể mất 10-15 phút tùy thuộc vào tắc
              nghẽn mạng.
            </p>
            <p className="mt-1">
              Chúng tôi sẽ cập nhật trạng thái đơn hàng sau khi xác nhận giao
              dịch thành công.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" className="flex-1" onClick={onGoBack}>
          Chọn phương thức khác
        </Button>
        <Button className="flex-1" onClick={onComplete}>
          Tôi đã chuyển coin
        </Button>
      </div>
    </div>
  );
};
