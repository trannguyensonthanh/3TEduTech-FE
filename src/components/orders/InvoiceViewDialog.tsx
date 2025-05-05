import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/common/Icons';

interface InvoiceViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: {
    id: string;
    orderId: string;
    date: Date;
    total: number;
    items: Array<{
      id: number;
      title: string;
      price: number;
    }>;
    customerInfo: {
      name: string;
      email: string;
    };
  } | null;
}

const InvoiceViewDialog: React.FC<InvoiceViewDialogProps> = ({
  open,
  onOpenChange,
  invoice,
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would trigger a PDF download
    console.log('Downloading invoice...');
    alert('Tính năng tải xuống hóa đơn sẽ sớm được cập nhật');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Hóa đơn #{invoice.id}</DialogTitle>
          <DialogDescription>
            Hóa đơn cho đơn hàng #{invoice.orderId}
          </DialogDescription>
        </DialogHeader>

        <div className="print:font-sans p-4 print:p-0" id="invoice-content">
          <div className="flex justify-between items-start mb-8 border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold">HÓA ĐƠN</h1>
              <p className="text-muted-foreground">#{invoice.id}</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold text-lg">EdTech Platform</h2>
              <p className="text-muted-foreground">contact@example.com</p>
              <p className="text-muted-foreground">
                123 Education St, Learning City
              </p>
            </div>
          </div>

          <div className="flex justify-between mb-8">
            <div>
              <h3 className="font-medium mb-2">Thông tin khách hàng:</h3>
              <p>{invoice.customerInfo.name}</p>
              <p>{invoice.customerInfo.email}</p>
            </div>
            <div className="text-right">
              <h3 className="font-medium mb-2">Chi tiết đơn hàng:</h3>
              <p>Ngày mua: {invoice.date.toLocaleDateString('vi-VN')}</p>
              <p>Đơn hàng: #{invoice.orderId}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead className="bg-muted">
              <tr>
                <th className="py-2 px-4 text-left">STT</th>
                <th className="py-2 px-4 text-left">Khóa học</th>
                <th className="py-2 px-4 text-right">Giá</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{item.title}</td>
                  <td className="py-2 px-4 text-right">
                    ${item.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="py-2 px-4" colSpan={2}>
                  Tổng cộng
                </td>
                <td className="py-2 px-4 text-right">
                  ${invoice.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="text-center text-sm text-muted-foreground print:mt-8">
            <p>Cảm ơn bạn đã mua khóa học của chúng tôi!</p>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ
              support@example.com
            </p>
          </div>
        </div>

        <DialogFooter className="print:hidden gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Icons.printer className="mr-2 h-4 w-4" />
            In hóa đơn
          </Button>
          <Button onClick={handleDownload}>
            <Icons.download className="mr-2 h-4 w-4" />
            Tải xuống PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewDialog;
