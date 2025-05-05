import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, ArrowRight, LoaderCircle } from "lucide-react";
import { Icons } from "@/components/common/Icons";

// MoMo payment options
export type MomoPaymentMode = "app" | "qrcode";
export type MomoPaymentStatus = "waiting" | "processing" | "success" | "failed";

interface MomoPaymentProps {
  momoQrCode: string | null;
  finalAmount: number;
  countdownTime: number;
  momoPaymentMode: MomoPaymentMode;
  momoPaymentStatus: MomoPaymentStatus;
  onModeChange: (mode: MomoPaymentMode) => void;
  onGoBack: () => void;
}

export const MomoPayment: React.FC<MomoPaymentProps> = ({
  momoQrCode,
  finalAmount,
  countdownTime,
  momoPaymentMode,
  momoPaymentStatus,
  onModeChange,
  onGoBack,
}) => {
  // Format countdown time as MM:SS
  const formatCountdown = () => {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-center space-y-5">
      <h3 className="text-xl font-semibold">Thanh toán bằng MoMo</h3>

      {/* MoMo Payment Mode Selector */}
      <div className="flex justify-center mb-4">
        <Tabs
          value={momoPaymentMode}
          onValueChange={(value) => onModeChange(value as MomoPaymentMode)}
          className="w-full max-w-xs"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qrcode" className="flex items-center gap-1">
              <QrCode className="h-4 w-4" />
              Mã QR
            </TabsTrigger>
            <TabsTrigger value="app" className="flex items-center gap-1">
              <ArrowRight className="h-4 w-4" />
              Ứng dụng
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {momoPaymentMode === "qrcode" && (
        <>
          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold">Thanh toán bằng MoMo QR</h4>

            {momoQrCode && (
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src={momoQrCode}
                    alt="MoMo QR Code"
                    className="w-64 h-64"
                  />
                </div>
              </div>
            )}

            <div className="text-lg font-bold">
              Số tiền: ${finalAmount.toFixed(2)}
            </div>

            <div className="text-sm text-muted-foreground max-w-md mx-auto">
              Mở ứng dụng MoMo, chọn 'Quét Mã' và quét mã QR trên để hoàn tất
              thanh toán.
            </div>

            {countdownTime > 0 ? (
              <div className="text-sm">
                Mã QR sẽ hết hạn sau:{" "}
                <span className="font-semibold">{formatCountdown()}</span>
              </div>
            ) : (
              <div className="text-red-500 text-sm">
                Mã QR đã hết hạn. Vui lòng tạo lại.
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={onGoBack}
                >
                  Thử lại
                </Button>
              </div>
            )}

            <div className="p-4 rounded-lg bg-muted mt-4">
              <div className="flex items-center justify-center">
                {momoPaymentStatus === "waiting" && (
                  <>
                    <Icons.info className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm">
                      Đang chờ xác nhận thanh toán...
                    </span>
                  </>
                )}
                {momoPaymentStatus === "processing" && (
                  <>
                    <LoaderCircle className="h-5 w-5 text-primary mr-2 animate-spin" />
                    <span className="text-sm">Đang xử lý thanh toán...</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {momoPaymentMode === "app" && (
        <div className="text-center space-y-4">
          <p className="text-lg">
            Nhấn vào nút bên dưới để chuyển đến ứng dụng MoMo và hoàn tất thanh
            toán của bạn.
          </p>

          <div className="text-lg font-bold">
            Số tiền: ${finalAmount.toFixed(2)}
          </div>

          <Button className="bg-[#d82d8b] hover:bg-[#c4286f] w-full max-w-xs font-semibold py-6 text-lg">
            Thanh toán với MoMo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-sm text-muted-foreground">
            Bạn sẽ được chuyển đến ứng dụng MoMo hoặc trang web thanh toán của
            MoMo để hoàn tất giao dịch.
          </p>
        </div>
      )}

      <Button variant="outline" className="mt-4" onClick={onGoBack}>
        Chọn phương thức khác
      </Button>
    </div>
  );
};
