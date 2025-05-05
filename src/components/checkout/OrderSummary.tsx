import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface CartItem {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  price: number;
  discountedPrice?: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total }) => {
  // Tax rate (10%)
  const taxAmount = total * 0.1;
  const finalAmount = total + taxAmount;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Tóm tắt đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex space-x-4">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Giảng viên: {item.instructor}
                  </p>
                  <p className="text-sm font-semibold">
                    {item.discountedPrice ? (
                      <>
                        <span className="line-through text-muted-foreground mr-2">
                          ${item.price.toFixed(2)}
                        </span>
                        ${item.discountedPrice.toFixed(2)}
                      </>
                    ) : (
                      `$${item.price.toFixed(2)}`
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Thuế (10%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Tổng cộng:</span>
          <span>${finalAmount.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
