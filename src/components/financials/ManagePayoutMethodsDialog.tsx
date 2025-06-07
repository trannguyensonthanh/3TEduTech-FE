// src/components/financials/ManagePayoutMethodsDialog.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Icons } from '@/components/common/Icons'; // Plus, Paypal, Landmark, Trash, CheckCircle, Edit, Spinner, AlertTriangle
import {
  useMyPayoutMethods,
  useSetMyPrimaryPayoutMethod,
  useDeleteMyPayoutMethod,
  // useUpdateMyPayoutMethodDetails, // Nếu bạn muốn thêm nút Edit ở đây
} from '@/hooks/queries/instructor.queries';
import { useToast } from '@/components/ui/use-toast';
import { AddPayoutMethodDialog } from './AddPayoutMethodDialog'; // Dialog thêm mới
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ConfirmationDialog from '@/components/instructor/courseCreate/ConfirmationDialog'; // Dialog xác nhận xóa
import { cn } from '@/lib/utils';
import { InstructorPayoutMethodItem } from '@/services/instructor.service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ManagePayoutMethodsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManagePayoutMethodsDialog: React.FC<
  ManagePayoutMethodsDialogProps
> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const [showAddMethodDialog, setShowAddMethodDialog] = useState(false);
  const [itemToDelete, setItemToDelete] =
    useState<InstructorPayoutMethodItem | null>(null);

  const {
    data: payoutMethods = [],
    isLoading,
    error,
    refetch,
  } = useMyPayoutMethods({ enabled: isOpen }); // Chỉ fetch khi dialog mở

  const setPrimaryMutation = useSetMyPrimaryPayoutMethod({
    onSuccess: (updatedMethod) => {
      toast({
        title: 'Default Method Updated',
        description: `${updatedMethod.methodName} (${getDisplayDetail(
          updatedMethod
        )}) is now your primary payout method.`,
      });
      // Query sẽ tự cập nhật cache từ hook
    },
    onError: (err) => {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: err.message || 'Could not set primary method.',
      });
    },
  });

  const deleteMutation = useDeleteMyPayoutMethod({
    onSuccess: () => {
      toast({
        title: 'Method Removed',
        description: `The payout method "${itemToDelete?.methodName}" has been removed.`,
      });
      setItemToDelete(null); // Đóng dialog xác nhận
    },
    onError: (err) => {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: err.message || 'Could not remove method.',
      });
      setItemToDelete(null);
    },
  });

  const getDisplayDetail = (method: InstructorPayoutMethodItem): string => {
    if (method.methodId === 'PAYPAL') {
      return method.details?.email || 'N/A';
    }
    if (method.methodId === 'BANK_TRANSFER') {
      return `${method.details?.bankName || 'Bank'} ending in ${
        method.details?.accountNumberLast4 || '****'
      }`;
    }
    return 'Details not available';
  };

  const handleAddNewMethodSuccess = (newMethod: InstructorPayoutMethodItem) => {
    // Không cần làm gì ở đây nếu hook addMyPayoutMethod đã cập nhật cache
    // Nếu không, bạn có thể gọi refetch() hoặc cập nhật state local (ít khuyến khích hơn)
    setShowAddMethodDialog(false); // Đóng dialog thêm
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg md:max-w-xl dark:bg-slate-800/80 backdrop-blur-sm">
          <DialogHeader className="pb-4 border-b dark:border-slate-700">
            <DialogTitle className="text-2xl font-semibold flex items-center">
              <Icons.creditCard className="mr-3 h-6 w-6 text-sky-500 dark:text-sky-400" />
              Manage Payout Methods
            </DialogTitle>
            <DialogDescription>
              Add, remove, or set your default method for receiving earnings.
            </DialogDescription>
          </DialogHeader>

          <div className="py-5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 -mr-2 space-y-4">
            {isLoading &&
              Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={`skel-${i}`}
                  className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              ))}
            {error && (
              <Alert variant="destructive">
                <Icons.alertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading Methods</AlertTitle>
                <AlertDescription>
                  {error.message || 'Could not retrieve your payment methods.'}
                </AlertDescription>
              </Alert>
            )}
            {!isLoading && !error && payoutMethods.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icons.wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />{' '}
                {/* Giả sử có Icons.wallet */}
                <p className="font-medium">No Payout Methods Added Yet</p>
                <p className="text-sm">
                  Add a method to start receiving your earnings.
                </p>
              </div>
            )}
            {!isLoading &&
              !error &&
              payoutMethods.map((method) => (
                <Card
                  key={method.payoutMethodId}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 dark:bg-slate-700/40 border dark:border-slate-600/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                    <div
                      className={cn(
                        'p-2.5 rounded-full',
                        method.methodId === 'PAYPAL'
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-green-100 dark:bg-green-900/30'
                      )}
                    >
                      {method.methodId === 'PAYPAL' ? (
                        <Icons.paypal className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Icons.landmark className="h-6 w-6 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-base flex items-center">
                        {method.methodName}
                        {method.isPrimary && (
                          <Badge
                            variant="success"
                            className="ml-2 text-xs px-1.5 py-0 h-5"
                          >
                            Primary
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground break-all">
                        {getDisplayDetail(method)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 shrink-0 w-full sm:w-auto justify-end">
                    {!method.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs"
                        onClick={() =>
                          setPrimaryMutation.mutate(method.payoutMethodId)
                        }
                        disabled={
                          setPrimaryMutation.isPending &&
                          setPrimaryMutation.variables === method.payoutMethodId
                        }
                      >
                        {setPrimaryMutation.isPending &&
                        setPrimaryMutation.variables ===
                          method.payoutMethodId ? (
                          <Icons.spinner className="h-4 w-4 animate-spin" />
                        ) : (
                          <Icons.checkCircle className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Set Primary
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                      onClick={() => setItemToDelete(method)}
                      disabled={
                        deleteMutation.isPending &&
                        deleteMutation.variables === method.payoutMethodId
                      }
                      aria-label="Remove payment method"
                    >
                      {deleteMutation.isPending &&
                      deleteMutation.variables === method.payoutMethodId ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icons.trash className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
          </div>

          <DialogFooter className="pt-5 border-t dark:border-slate-700 gap-2 sm:gap-0">
            <Button
              variant="default"
              onClick={() => {
                onOpenChange(false); // Đóng dialog hiện tại
                setTimeout(() => setShowAddMethodDialog(true), 150); // Mở dialog thêm sau một chút để tránh lỗi UI
              }}
              className="w-full sm:w-auto h-11 text-base"
            >
              <Icons.plus className="mr-2 h-5 w-5" /> Add New Method
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto h-11 text-base"
              >
                Done
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <ConfirmationDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Remove Payment Method?"
        description={
          <>
            Are you sure you want to remove this payment method? <br />
            <strong>
              {itemToDelete?.methodName}:{' '}
              {itemToDelete && getDisplayDetail(itemToDelete)}
            </strong>
            <br />
            This action cannot be undone.
          </>
        }
        confirmText="Yes, Remove"
        confirmVariant="destructive"
        onConfirm={() => {
          if (itemToDelete) {
            deleteMutation.mutate(itemToDelete.payoutMethodId);
          }
        }}
        isConfirming={deleteMutation.isPending}
      />

      {/* Dialog thêm mới (sẽ được gọi từ đây) */}
      <AddPayoutMethodDialog
        isOpen={showAddMethodDialog}
        onOpenChange={setShowAddMethodDialog}
        onSuccess={(newMethod) => {
          // Callback này được gọi khi AddPayoutMethodDialog thêm thành công
          // Hook useAddMyPayoutMethod đã cập nhật cache, nên ở đây chỉ cần đóng dialog thêm
          setShowAddMethodDialog(false);
          // Không cần mở lại ManagePayoutMethodsDialog vì nó vẫn đang mở ở background
          // Nếu bạn đóng ManagePayoutMethodsDialog trước khi mở AddPayoutMethodDialog,
          // thì ở đây bạn cần onOpenChange(true) để mở lại ManagePayoutMethodsDialog.
          // Hiện tại, ManagePayoutMethodsDialog vẫn mở, nên không cần.
        }}
      />
    </>
  );
};
