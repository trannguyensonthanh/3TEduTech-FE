import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { PaymentMethod } from './PaymentMethodsTable';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: PaymentMethod | null;
  onSubmit: (data: { id: string; name: string }) => void;
  isEditing: boolean;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  open,
  onOpenChange,
  paymentMethod,
  onSubmit,
  isEditing,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      id: paymentMethod?.id || '',
      name: paymentMethod?.name || '',
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        id: paymentMethod?.id || '',
        name: paymentMethod?.name || '',
      });
    }
  }, [open, paymentMethod, reset]);

  const onFormSubmit = (data: { id: string; name: string }) => {
    onSubmit({
      id: data.id,
      name: data.name,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-primary">
            {isEditing ? 'Edit Payment Method' : 'Add New Payment Method'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="id" className="text-sm font-medium">
              Method ID
            </Label>
            <Input
              id="id"
              {...register('id', {
                required: 'Method ID is required',
                maxLength: {
                  value: 20,
                  message: 'Method ID cannot exceed 20 characters',
                },
              })}
              className="w-full uppercase"
              disabled={isEditing}
              placeholder="MOMO, VNPAY, BANK, CRYPTO"
            />
            {errors.id && (
              <p className="text-sm text-destructive">{errors.id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Method Name
            </Label>
            <Input
              id="name"
              {...register('name', { required: 'Method name is required' })}
              className="w-full"
              placeholder="MoMo E-Wallet, VNPay, Bank Transfer"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isEditing ? 'Update Method' : 'Add Method'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
