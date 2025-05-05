import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentMethodsTable, {
  PaymentMethod,
} from '@/components/admin/payment-methods/PaymentMethodsTable';
import PaymentMethodDialog from '@/components/admin/payment-methods/PaymentMethodDialog';
import DeletePaymentMethodDialog from '@/components/admin/payment-methods/DeletePaymentMethodDialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';

// Mock data for payment methods
const mockPaymentMethods: PaymentMethod[] = [
  { id: 'MOMO', name: 'MoMo E-Wallet' },
  { id: 'VNPAY', name: 'VNPay Payment Gateway' },
  { id: 'BANK', name: 'Bank Transfer' },
  { id: 'CRYPTO', name: 'Cryptocurrency' },
  { id: 'PAYPAL', name: 'PayPal' },
  { id: 'STRIPE', name: 'Stripe' },
  { id: 'CASH', name: 'Cash On Delivery' },
];

const PaymentMethodsManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const itemsPerPage = 10;

  useEffect(() => {
    // In a real app, fetch payment methods from API
    // For now, using mock data
    const fetchPaymentMethods = async () => {
      try {
        setIsLoading(true);
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPaymentMethods(mockPaymentMethods);
        setTotalPages(Math.ceil(mockPaymentMethods.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment methods. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [toast]);

  const handleAddPaymentMethod = (data: { id: string; name: string }) => {
    // Check if payment method ID already exists
    if (
      paymentMethods.some(
        (method) => method.id.toUpperCase() === data.id.toUpperCase()
      )
    ) {
      toast({
        title: 'Error',
        description: `Payment method with ID ${data.id.toUpperCase()} already exists.`,
        variant: 'destructive',
      });
      return;
    }

    // In a real app, make API call to add payment method
    const newMethod: PaymentMethod = {
      id: data.id.toUpperCase(),
      name: data.name,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    toast({
      title: 'Success',
      description: 'Payment method added successfully.',
    });
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsAddDialogOpen(true);
  };

  const handleUpdateMethod = (data: { id: string; name: string }) => {
    if (!selectedMethod) return;

    // In a real app, make API call to update payment method
    const updatedMethods = paymentMethods.map((method) =>
      method.id === selectedMethod.id ? { ...method, name: data.name } : method
    );

    setPaymentMethods(updatedMethods);
    setSelectedMethod(null);
    toast({
      title: 'Success',
      description: 'Payment method updated successfully.',
    });
  };

  const handleDeleteClick = (method: PaymentMethod) => {
    setMethodToDelete(method);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMethod = () => {
    if (!methodToDelete) return;

    // In a real app, make API call to delete payment method
    const updatedMethods = paymentMethods.filter(
      (method) => method.id !== methodToDelete.id
    );
    setPaymentMethods(updatedMethods);
    setMethodToDelete(null);
    setIsDeleteDialogOpen(false);
    toast({
      title: 'Success',
      description: 'Payment method deleted successfully.',
    });
  };

  // Calculate pagination
  const paginatedMethods = paymentMethods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Payment Methods Management
          </h1>
          <Button
            onClick={() => {
              setSelectedMethod(null);
              setIsAddDialogOpen(true);
            }}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Payment Method
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Supported Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center text-muted-foreground">
                Loading payment methods...
              </div>
            ) : (
              <>
                <PaymentMethodsTable
                  paymentMethods={paginatedMethods}
                  onEdit={handleEditMethod}
                  onDelete={handleDeleteClick}
                />
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            className={
                              currentPage === 1
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => setCurrentPage(page)}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            className={
                              currentPage === totalPages
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <PaymentMethodDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        paymentMethod={selectedMethod}
        onSubmit={selectedMethod ? handleUpdateMethod : handleAddPaymentMethod}
        isEditing={!!selectedMethod}
      />

      <DeletePaymentMethodDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteMethod}
        methodName={methodToDelete?.name || ''}
        methodId={methodToDelete?.id || ''}
      />
    </AdminLayout>
  );
};

export default PaymentMethodsManagement;
