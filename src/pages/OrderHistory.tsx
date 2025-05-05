/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/components/common/Icons';
import { format } from 'date-fns';
import InvoiceViewDialog from '@/components/orders/InvoiceViewDialog';

// Mock order data - in a real app, this would come from an API
interface OrderItem {
  id: number;
  title: string;
  instructor: string;
  image: string;
  price: number;
}

interface Order {
  id: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  items: OrderItem[];
  total: number;
  invoice?: string;
}

const OrderHistory = () => {
  const navigate = useNavigate();

  // State for invoice dialog
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Mock orders data
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-20251204-001',
      date: new Date(2025, 3, 1), // April 1, 2025
      status: 'completed',
      paymentMethod: 'Credit Card',
      items: [
        {
          id: 1,
          title: 'Advanced React Development',
          instructor: 'Jane Smith',
          image: 'https://via.placeholder.com/150',
          price: 79.99,
        },
        {
          id: 2,
          title: 'TypeScript Masterclass',
          instructor: 'John Doe',
          image: 'https://via.placeholder.com/150',
          price: 59.99,
        },
      ],
      total: 139.98,
      invoice: '/invoices/INV-2025001.pdf',
    },
    {
      id: 'ORD-20251103-002',
      date: new Date(2025, 2, 15), // March 15, 2025
      status: 'completed',
      paymentMethod: 'PayPal',
      items: [
        {
          id: 3,
          title: 'UX/UI Design Fundamentals',
          instructor: 'Sarah Johnson',
          image: 'https://via.placeholder.com/150',
          price: 89.99,
        },
      ],
      total: 89.99,
      invoice: '/invoices/INV-2025002.pdf',
    },
    {
      id: 'ORD-20251004-003',
      date: new Date(2025, 1, 20), // February 20, 2025
      status: 'pending',
      paymentMethod: 'Bank Transfer',
      items: [
        {
          id: 4,
          title: 'Data Science & Machine Learning',
          instructor: 'Michael Brown',
          image: 'https://via.placeholder.com/150',
          price: 129.99,
        },
      ],
      total: 129.99,
    },
    {
      id: 'ORD-20250904-004',
      date: new Date(2025, 1, 5), // February 5, 2025
      status: 'failed',
      paymentMethod: 'MoMo',
      items: [
        {
          id: 5,
          title: 'DevOps Complete Guide',
          instructor: 'Alex Chen',
          image: 'https://via.placeholder.com/150',
          price: 69.99,
        },
      ],
      total: 69.99,
    },
  ]);

  // Get status badge color
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Đang xử lý</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Thất bại</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  // Filter orders by status
  const completedOrders = orders.filter(
    (order) => order.status === 'completed'
  );
  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const failedOrders = orders.filter((order) => order.status === 'failed');

  // Get order item count text
  const getItemCountText = (items: OrderItem[]) => {
    return items.length === 1 ? '1 khóa học' : `${items.length} khóa học`;
  };

  // Function to handle invoice view
  const handleViewInvoice = (order: Order) => {
    // In a real app, you would fetch the invoice details from the server
    const invoiceData = {
      id: order.invoice?.replace('/invoices/INV-', '') || 'unknown',
      orderId: order.id,
      date: order.date,
      total: order.total,
      items: order.items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
      })),
      customerInfo: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
      },
    };

    setSelectedInvoice(invoiceData);
    setInvoiceDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">Lịch sử đơn hàng</h1>
        <p className="text-muted-foreground mb-8">
          Xem và quản lý các đơn hàng của bạn
        </p>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">Tất cả ({orders.length})</TabsTrigger>
            <TabsTrigger value="completed">
              Hoàn thành ({completedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Đang xử lý ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Thất bại ({failedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewInvoice={handleViewInvoice}
                  />
                ))}
              </div>
            ) : (
              <EmptyOrderState />
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedOrders.length > 0 ? (
              <div className="space-y-6">
                {completedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewInvoice={handleViewInvoice}
                  />
                ))}
              </div>
            ) : (
              <EmptyOrderState status="completed" />
            )}
          </TabsContent>

          <TabsContent value="pending">
            {pendingOrders.length > 0 ? (
              <div className="space-y-6">
                {pendingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewInvoice={handleViewInvoice}
                  />
                ))}
              </div>
            ) : (
              <EmptyOrderState status="pending" />
            )}
          </TabsContent>

          <TabsContent value="failed">
            {failedOrders.length > 0 ? (
              <div className="space-y-6">
                {failedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewInvoice={handleViewInvoice}
                  />
                ))}
              </div>
            ) : (
              <EmptyOrderState status="failed" />
            )}
          </TabsContent>
        </Tabs>

        {/* Invoice View Dialog */}
        <InvoiceViewDialog
          open={invoiceDialogOpen}
          onOpenChange={setInvoiceDialogOpen}
          invoice={selectedInvoice}
        />
      </div>
    </Layout>
  );

  // Order Card Component
  function OrderCard({
    order,
    onViewInvoice,
  }: {
    order: Order;
    onViewInvoice: (order: Order) => void;
  }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <Card className="overflow-hidden">
        <CardHeader className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                Đơn hàng #{order.id}
              </CardTitle>
              <CardDescription className="mt-1">
                {format(order.date, 'dd/MM/yyyy HH:mm')}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(order.status)}
              <span className="text-sm text-muted-foreground">
                {getItemCountText(order.items)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm mb-4">
            <div className="mb-2 sm:mb-0">
              <span className="font-medium">Phương thức thanh toán:</span>{' '}
              {order.paymentMethod}
            </div>
            <div className="font-medium">
              <span>Tổng tiền:</span> ${order.total.toFixed(2)}
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4">
              <Separator className="mb-4" />
              <h4 className="font-medium mb-3">Chi tiết đơn hàng</h4>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium">{item.title}</h5>
                      <p className="text-sm text-muted-foreground">
                        Giảng viên: {item.instructor}
                      </p>
                    </div>
                    <div className="font-medium">${item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
          </Button>

          <div className="flex space-x-2">
            {order.status === 'completed' && order.invoice && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewInvoice(order)}
              >
                <Icons.file className="h-4 w-4 mr-1" />
                Hóa đơn
              </Button>
            )}

            {order.status === 'completed' && (
              <Button size="sm" onClick={() => navigate('/my-courses')}>
                Xem khóa học
              </Button>
            )}

            {order.status === 'failed' && (
              <Button size="sm" onClick={() => navigate('/checkout')}>
                Thử lại thanh toán
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Empty state component
  function EmptyOrderState({ status }: { status?: Order['status'] }) {
    let message = 'Bạn chưa có đơn hàng nào';

    if (status) {
      switch (status) {
        case 'completed':
          message = 'Bạn chưa có đơn hàng hoàn thành nào';
          break;
        case 'pending':
          message = 'Bạn không có đơn hàng đang xử lý';
          break;
        case 'failed':
          message = 'Bạn không có đơn hàng thất bại';
          break;
      }
    }

    return (
      <div className="bg-muted/30 rounded-lg p-8 text-center">
        <Icons.shoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">{message}</h3>
        <p className="text-muted-foreground mb-6">
          Khi bạn mua khóa học, đơn hàng của bạn sẽ hiển thị tại đây
        </p>
        <Button onClick={() => navigate('/courses')}>Tìm khóa học</Button>
      </div>
    );
  }
};

export default OrderHistory;
