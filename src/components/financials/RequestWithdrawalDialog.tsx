// src/components/financials/RequestWithdrawalDialog.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Cho notes
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Icons } from '@/components/common/Icons'; // DollarSign, Wallet, Spinner, Send
import { useRequestWithdrawal } from '@/hooks/queries/financials.queries'; // Hook tạo request
import { RequestWithdrawalFormData } from '@/services/financials.service'; // Type cho form data
import { useMyPayoutMethods } from '@/hooks/queries/instructor.queries'; // Lấy payout methods
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { InstructorPayoutMethodItem } from '@/services/instructor.service';

interface RequestWithdrawalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  currencySymbol?: string;
  onSuccess?: () => void; // Callback khi request thành công
}

const requestWithdrawalSchema = z.object({
  amount: z
    .number()
    .min(10, { message: 'Minimum withdrawal amount is $10.' }) // Ví dụ min amount
    .max(10000, { message: 'Maximum withdrawal amount is $10,000.' }), // Ví dụ max amount
  instructorPayoutMethodId: z
    .string()
    .min(1, { message: 'Please select a payout method.' })
    .transform(Number), // Chuyển string từ Select về number
  notes: z.string().max(500, 'Notes cannot exceed 500 characters.').optional(),
});

type WithdrawalFormValues = z.infer<typeof requestWithdrawalSchema>;

export const RequestWithdrawalDialog: React.FC<
  RequestWithdrawalDialogProps
> = ({
  isOpen,
  onOpenChange,
  currentBalance,
  currencySymbol = '$',
  onSuccess,
}) => {
  const { toast } = useToast();
  const { data: payoutMethods = [], isLoading: isLoadingMethods } =
    useMyPayoutMethods({ enabled: isOpen });

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(requestWithdrawalSchema),
    defaultValues: {
      amount: undefined, // Để placeholder hiển thị
      instructorPayoutMethodId: undefined,
      notes: '',
    },
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    // Reset form khi dialog đóng/mở hoặc balance thay đổi
    if (isOpen) {
      const defaultMethod = payoutMethods.find((m) => m.isPrimary);
      reset({
        amount: undefined,
        instructorPayoutMethodId: defaultMethod?.payoutMethodId,
        notes: '',
      });
    }
  }, [isOpen, reset, payoutMethods]);

  useEffect(() => {
    // Cập nhật max cho amount validation khi currentBalance thay đổi
    requestWithdrawalSchema.shape.amount._def.checks.forEach((check) => {
      if (check.kind === 'max') {
        check.value = currentBalance;
        check.message = `Amount cannot exceed your current balance of ${currencySymbol}${currentBalance.toFixed(
          2
        )}.`;
      }
    });
  }, [currentBalance, currencySymbol]);

  const requestWithdrawalMutation = useRequestWithdrawal({
    onSuccess: (data) => {
      toast({
        title: 'Withdrawal Requested',
        description:
          'Your withdrawal request has been submitted for processing.',
      });
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description:
          error.message || 'Could not submit your withdrawal request.',
      });
    },
  });

  const onSubmit: SubmitHandler<WithdrawalFormValues> = (data) => {
    if (data.amount > currentBalance) {
      form.setError('amount', {
        type: 'manual',
        message: `Amount cannot exceed your current balance of ${currencySymbol}${currentBalance.toFixed(
          2
        )}.`,
      });
      return;
    }
    const submissionData: RequestWithdrawalFormData = {
      amount: data.amount,
      instructorPayoutMethodId: data.instructorPayoutMethodId,
      notes: data.notes || undefined,
    };
    requestWithdrawalMutation.mutate(submissionData);
  };

  const getDisplayDetailShort = (
    method: InstructorPayoutMethodItem
  ): string => {
    if (method.methodId === 'PAYPAL')
      return `PayPal: ${method.details?.email || 'N/A'}`;
    if (method.methodId === 'BANK_TRANSFER')
      return `${method.details?.bankName || 'Bank'} (...${
        method.details?.accountNumberLast4 || '****'
      })`;
    return method.methodName;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) reset();
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-md dark:bg-slate-800/80 backdrop-blur-sm">
        <DialogHeader className="pb-4 border-b dark:border-slate-700">
          <DialogTitle className="text-2xl font-semibold flex items-center">
            <Icons.wallet className="mr-3 h-6 w-6 text-green-500 dark:text-green-400" />
            Request Payout
          </DialogTitle>
          <DialogDescription>
            Withdraw funds from your available balance. Minimum withdrawal:{' '}
            {currencySymbol}10.00.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="py-4 space-y-6">
          <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Available Balance
            </p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {currencySymbol}
              {currentBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="withdrawal-amount">
              Amount to Withdraw <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 h-full flex items-center text-muted-foreground text-sm">
                {currencySymbol}
              </span>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    id="withdrawal-amount"
                    type="number"
                    placeholder="0.00"
                    value={field.value === undefined ? '' : field.value} // Handle undefined for placeholder
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ''
                          ? undefined
                          : parseFloat(e.target.value)
                      )
                    }
                    className={cn(
                      'pl-7 h-12 text-lg',
                      errors.amount && 'border-destructive'
                    )}
                    min="10" // HTML5 min
                    step="0.01"
                    disabled={requestWithdrawalMutation.isPending}
                  />
                )}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payout-method">
              Withdraw to <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="instructorPayoutMethodId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))} // Ensure value is number
                  value={field.value?.toString() || ''}
                  disabled={
                    isLoadingMethods || requestWithdrawalMutation.isPending
                  }
                >
                  <SelectTrigger
                    id="payout-method"
                    className={cn(
                      'h-11 text-sm',
                      errors.instructorPayoutMethodId && 'border-destructive'
                    )}
                  >
                    <SelectValue
                      placeholder={
                        isLoadingMethods
                          ? 'Loading methods...'
                          : 'Select payout method'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingMethods ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : payoutMethods.length > 0 ? (
                      payoutMethods.map((method) => (
                        <SelectItem
                          key={method.payoutMethodId}
                          value={method.payoutMethodId.toString()}
                        >
                          <div className="flex items-center">
                            {method.methodId === 'PAYPAL' ? (
                              <Icons.paypal className="mr-2 h-4 w-4 text-blue-500" />
                            ) : (
                              <Icons.landmark className="mr-2 h-4 w-4 text-green-500" />
                            )}
                            {getDisplayDetailShort(method)}{' '}
                            {method.isPrimary && '(Primary)'}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-methods" disabled>
                        No payout methods configured.
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.instructorPayoutMethodId && (
              <p className="text-xs text-destructive mt-1">
                {errors.instructorPayoutMethodId.message}
              </p>
            )}
            {payoutMethods.length === 0 && !isLoadingMethods && (
              <p className="text-xs text-muted-foreground mt-1">
                You need to{' '}
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => {
                    onOpenChange(
                      false
                    ); /* TODO: Open ManagePayoutMethodsDialog */
                  }}
                >
                  add a payout method
                </Button>{' '}
                first.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="withdrawal-notes">Notes (Optional)</Label>
            <Textarea
              id="withdrawal-notes"
              {...register('notes')}
              placeholder="Any specific instructions for this withdrawal?"
              rows={3}
              disabled={requestWithdrawalMutation.isPending}
            />
            {errors.notes && (
              <p className="text-xs text-destructive mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 text-base"
                disabled={requestWithdrawalMutation.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-11 px-6 text-base"
              disabled={
                requestWithdrawalMutation.isPending ||
                !isDirty ||
                payoutMethods.length === 0
              }
            >
              {requestWithdrawalMutation.isPending ? (
                <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Icons.send className="mr-2 h-5 w-5" />
              )}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
