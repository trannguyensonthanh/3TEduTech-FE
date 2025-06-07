/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/financials/AddPayoutMethodDialog.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldErrors,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Icons } from '@/components/common/Icons';
import { useAddMyPayoutMethod } from '@/hooks/queries/instructor.queries';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  BankAccountDetails,
  CreateInstructorPayoutMethodData,
  InstructorPayoutMethodItem,
} from '@/services/instructor.service';
import { AnimatePresence, motion } from 'framer-motion';

// --- Dữ liệu ví dụ (Nên lấy từ nguồn tin cậy hoặc API) ---
const countries = [
  { code: '', name: 'Select Country...' },
  { code: 'US', name: 'United States' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'OTHER', name: 'Other International' },
];

const currencies = [
  { code: '', name: 'Select Currency...' },
  { code: 'USD', name: 'USD - US Dollar' },
  { code: 'VND', name: 'VND - Vietnamese Dong' },
  { code: 'EUR', name: 'EUR - Euro' },
  { code: 'GBP', name: 'GBP - British Pound' },
];
// --- Kết thúc Dữ liệu ví dụ ---

// --- Zod Schemas ---
const paypalDetailsSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid PayPal email address.' })
    .min(1, 'PayPal email is required.'),
});

// Type cho details của BankAccount trong form
type BankAccountFormDetails = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  country: string;
  currencyId: string;
  iban?: string | null; // Cho phép null để Zod optional hoạt động tốt hơn với reset
  swiftBic?: string | null;
  routingNumber?: string | null;
};

const bankAccountDetailsBaseSchema = z.object({
  accountHolderName: z
    .string()
    .min(3, { message: 'Account holder name is required (min 3 characters).' }),
  bankName: z
    .string()
    .min(2, { message: 'Bank name is required (min 2 characters).' }),
  accountNumber: z
    .string()
    .min(5, { message: 'Account number is required (min 5 characters).' }),
  country: z
    .string()
    .min(2, { message: 'Please select the country of your bank.' }),
  currencyId: z
    .string()
    .min(3, { message: 'Please select account currency.' })
    .max(3),
});

const bankAccountDetailsConditionalSchema = z.object({
  iban: z.string().optional().nullable(),
  swiftBic: z.string().optional().nullable(),
  routingNumber: z.string().optional().nullable(),
});

const paypalFormSchema = z.object({
  methodId: z.literal('PAYPAL'),
  details: paypalDetailsSchema,
});

const bankAccountFormSchema = z.object({
  methodId: z.literal('BANK_TRANSFER'),
  details: bankAccountDetailsBaseSchema
    .merge(bankAccountDetailsConditionalSchema)
    .superRefine((data, ctx) => {
      if (
        data.country === 'US' &&
        (!data.routingNumber || !/^\d{9}$/.test(data.routingNumber))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A valid 9-digit Routing Number is required for US banks.',
          path: ['routingNumber'],
        });
      }
      // Ví dụ: Yêu cầu IBAN cho các nước châu Âu (thêm mã quốc gia vào list)
      const europeanCountries = ['DE', 'FR', 'ES', 'IT', 'GB']; // Mở rộng danh sách này
      if (
        data.country &&
        europeanCountries.includes(data.country) &&
        (!data.iban || data.iban.length < 15)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A valid IBAN is required for this European country.',
          path: ['iban'],
        });
      }
      // Ví dụ: Yêu cầu SWIFT/BIC cho giao dịch quốc tế hoặc các nước "OTHER"
      if (
        data.country === 'OTHER' &&
        (!data.swiftBic ||
          (data.swiftBic.length !== 8 && data.swiftBic.length !== 11))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "A valid 8 or 11 character SWIFT/BIC code is required for 'Other International'.",
          path: ['swiftBic'],
        });
      }
    }),
});

const addPayoutMethodFormSchema = z.discriminatedUnion('methodId', [
  paypalFormSchema,
  bankAccountFormSchema,
]);
type AddPayoutMethodFormData = z.infer<typeof addPayoutMethodFormSchema>;

// --- Props Interface ---
interface AddPayoutMethodDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newMethod: InstructorPayoutMethodItem) => void;
}

// --- Component ---
export const AddPayoutMethodDialog: React.FC<AddPayoutMethodDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [selectedMethodType, setSelectedMethodType] = useState<
    'PAYPAL' | 'BANK_TRANSFER'
  >('PAYPAL');

  const form = useForm<AddPayoutMethodFormData>({
    resolver: zodResolver(addPayoutMethodFormSchema),
    // Default values sẽ được set trong useEffect
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = form;

  const watchedMethodId = watch('methodId');
  const watchedBankDetails = watch('details') as
    | BankAccountFormDetails
    | undefined; // Cast để truy cập an toàn hơn
  const watchedCountryForBank = watchedBankDetails?.country;

  useEffect(() => {
    if (isOpen) {
      const defaultValuesBasedOnType =
        selectedMethodType === 'PAYPAL'
          ? { methodId: 'PAYPAL', details: { email: '' } }
          : {
              methodId: 'BANK_TRANSFER',
              details: {
                accountHolderName: '',
                bankName: '',
                accountNumber: '',
                country: '',
                currencyId: 'USD',
                routingNumber: '',
                iban: '',
                swiftBic: '',
              },
            };
      reset(defaultValuesBasedOnType as AddPayoutMethodFormData); // Đảm bảo kiểu khớp
    }
  }, [selectedMethodType, isOpen, reset]);

  const addMethodMutation = useAddMyPayoutMethod({
    onSuccess: (newMethod) => {
      toast({
        title: 'Payout Method Added',
        description: `${
          newMethod.methodName || newMethod.methodId
        } has been successfully added.`,
      });
      onSuccess?.(newMethod);
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to Add Method',
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });

  const onSubmitForm: SubmitHandler<AddPayoutMethodFormData> = (data) => {
    // `data` đã được Zod validate và có kiểu đúng theo `methodId`
    // Chuyển đổi `details` để loại bỏ các trường `null` hoặc `undefined` không cần thiết trước khi gửi
    let finalDetails = {};
    if (data.methodId === 'PAYPAL') {
      finalDetails = data.details;
    } else if (data.methodId === 'BANK_TRANSFER') {
      const bankDetails = data.details as BankAccountFormDetails;
      finalDetails = Object.fromEntries(
        Object.entries(bankDetails).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ''
        )
      ) as unknown as BankAccountDetails;
    }

    const submissionData: CreateInstructorPayoutMethodData = {
      methodId: data.methodId,
      details: finalDetails,
    };
    addMethodMutation.mutate(submissionData);
  };

  // Helper để lấy lỗi chi tiết một cách an toàn
  const getDetailError = (
    fieldName: keyof BankAccountFormDetails | 'email'
  ): string | undefined => {
    if (!errors.details) return undefined;
    return errors.details[fieldName]?.message;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!addMethodMutation.isPending) {
          reset();
          onOpenChange(open);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg md:max-w-xl dark:bg-slate-800/90 backdrop-blur-sm border-slate-700/70">
        <DialogHeader className="pb-4 mb-4 border-b dark:border-slate-700">
          <DialogTitle className="text-2xl font-semibold flex items-center">
            <Icons.plusCircle className="mr-3 h-6 w-6 text-primary dark:text-primary/90" />
            Add New Payout Method
          </DialogTitle>
          <DialogDescription className="pt-1">
            Securely add a new PayPal or Bank Account to receive your earnings.
            All information is encrypted.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="py-2 space-y-6">
          {' '}
          {/* Giảm py */}
          <div className="space-y-1.5">
            <Label htmlFor="add-methodType-select">Payment Method Type</Label>
            <Controller
              name="methodId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value as 'PAYPAL' | 'BANK_TRANSFER');
                    setSelectedMethodType(value as 'PAYPAL' | 'BANK_TRANSFER');
                  }}
                  value={field.value}
                  disabled={addMethodMutation.isPending}
                >
                  <SelectTrigger
                    id="add-methodType-select"
                    className="h-11 text-sm"
                  >
                    <SelectValue placeholder="Select method type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYPAL">
                      <div className="flex items-center">
                        <Icons.paypal className="mr-2 h-5 w-5 text-blue-600" />
                        PayPal
                      </div>
                    </SelectItem>
                    <SelectItem value="BANK_TRANSFER">
                      <div className="flex items-center">
                        <Icons.landmark className="mr-2 h-5 w-5 text-green-600" />
                        Bank Account
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMethodType}
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: 'auto',
                transition: { duration: 0.3, ease: 'easeInOut' },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: { duration: 0.2, ease: 'easeInOut' },
              }}
              className="overflow-hidden"
            >
              {watchedMethodId === 'PAYPAL' && ( // Dùng watchedMethodId để UI khớp với state của form
                <div className="space-y-1.5 pt-2">
                  <Label htmlFor="paypal-email-input">
                    PayPal Email Address{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="paypal-email-input"
                    type="email"
                    {...register('details.email' as any)}
                    placeholder="your.paypal.email@example.com"
                    className={cn(
                      'h-11',
                      getDetailError('email') && 'border-destructive'
                    )}
                    disabled={addMethodMutation.isPending}
                  />
                  {getDetailError('email') && (
                    <p className="text-xs text-destructive mt-1">
                      {getDetailError('email')}
                    </p>
                  )}
                </div>
              )}

              {watchedMethodId === 'BANK_TRANSFER' && (
                <div className="space-y-5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="bank-country-select">
                        Country of Bank{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name={'details.country' as any}
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ''}
                            disabled={addMethodMutation.isPending}
                          >
                            <SelectTrigger
                              id="bank-country-select"
                              className={cn(
                                'h-11',
                                getDetailError('country') &&
                                  'border-destructive'
                              )}
                            >
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Select Country</SelectLabel>
                                {countries.map((c) => (
                                  <SelectItem key={c.code} value={c.code}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {getDetailError('country') && (
                        <p className="text-xs text-destructive mt-1">
                          {getDetailError('country')}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bank-currency-select">
                        Account Currency{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name={'details.currencyId' as any}
                        control={control}
                        defaultValue="USD"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || 'USD'}
                            disabled={addMethodMutation.isPending}
                          >
                            <SelectTrigger
                              id="bank-currency-select"
                              className={cn(
                                'h-11',
                                getDetailError('currencyId') &&
                                  'border-destructive'
                              )}
                            >
                              <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((c) => (
                                <SelectItem key={c.code} value={c.code}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {getDetailError('currencyId') && (
                        <p className="text-xs text-destructive mt-1">
                          {getDetailError('currencyId')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bank-holderName-input">
                      Account Holder Name{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="bank-holderName-input"
                      {...register('details.accountHolderName' as any)}
                      placeholder="Full name as on bank account"
                      className={cn(
                        'h-11',
                        getDetailError('accountHolderName') &&
                          'border-destructive'
                      )}
                      disabled={addMethodMutation.isPending}
                    />
                    {getDetailError('accountHolderName') && (
                      <p className="text-xs text-destructive mt-1">
                        {getDetailError('accountHolderName')}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bank-bankName-input">
                      Bank Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="bank-bankName-input"
                      {...register('details.bankName' as any)}
                      placeholder="Full legal name of the bank"
                      className={cn(
                        'h-11',
                        getDetailError('bankName') && 'border-destructive'
                      )}
                      disabled={addMethodMutation.isPending}
                    />
                    {getDetailError('bankName') && (
                      <p className="text-xs text-destructive mt-1">
                        {getDetailError('bankName')}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bank-accountNumber-input">
                      Account Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="bank-accountNumber-input"
                      {...register('details.accountNumber' as any)}
                      placeholder="Your bank account number"
                      className={cn(
                        'h-11',
                        getDetailError('accountNumber') && 'border-destructive'
                      )}
                      disabled={addMethodMutation.isPending}
                    />
                    {getDetailError('accountNumber') && (
                      <p className="text-xs text-destructive mt-1">
                        {getDetailError('accountNumber')}
                      </p>
                    )}
                  </div>

                  {watchedCountryForBank === 'US' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="bank-routingNumber-input">
                        Routing Number (ABA){' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="bank-routingNumber-input"
                        {...register('details.routingNumber' as any)}
                        placeholder="9-digit number"
                        className={cn(
                          'h-11',
                          getDetailError('routingNumber') &&
                            'border-destructive'
                        )}
                        disabled={addMethodMutation.isPending}
                      />
                      {getDetailError('routingNumber') && (
                        <p className="text-xs text-destructive mt-1">
                          {getDetailError('routingNumber')}
                        </p>
                      )}
                    </div>
                  )}
                  {watchedCountryForBank &&
                    !['US', 'VN'].includes(watchedCountryForBank) && (
                      <>
                        <div className="space-y-1.5">
                          <Label htmlFor="bank-iban-input">
                            IBAN{' '}
                            {countries
                              .find((c) => c.code === watchedCountryForBank)
                              ?.name?.includes('Europe') && (
                              <span className="text-destructive">*</span>
                            )}
                          </Label>
                          <Input
                            id="bank-iban-input"
                            {...register('details.iban' as any)}
                            placeholder="International Bank Account Number"
                            className={cn(
                              'h-11',
                              getDetailError('iban') && 'border-destructive'
                            )}
                            disabled={addMethodMutation.isPending}
                          />
                          {getDetailError('iban') && (
                            <p className="text-xs text-destructive mt-1">
                              {getDetailError('iban')}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="bank-swiftBic-input">
                            SWIFT/BIC Code{' '}
                            {countries
                              .find((c) => c.code === watchedCountryForBank)
                              ?.name?.includes('Europe') && (
                              <span className="text-destructive">*</span>
                            )}
                          </Label>
                          <Input
                            id="bank-swiftBic-input"
                            {...register('details.swiftBic' as any)}
                            placeholder="8 or 11 character bank code"
                            className={cn(
                              'h-11',
                              getDetailError('swiftBic') && 'border-destructive'
                            )}
                            disabled={addMethodMutation.isPending}
                          />
                          {getDetailError('swiftBic') && (
                            <p className="text-xs text-destructive mt-1">
                              {getDetailError('swiftBic')}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <DialogFooter className="pt-8 mt-2 border-t dark:border-slate-700">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 text-base"
                disabled={addMethodMutation.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-11 px-6 text-base"
              disabled={addMethodMutation.isPending || !isDirty}
            >
              {addMethodMutation.isPending ? (
                <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Icons.plus className="mr-2 h-5 w-5" />
              )}
              Save Payment Method
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
