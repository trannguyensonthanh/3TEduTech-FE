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
import { Currency } from './CurrenciesTable';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CurrencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: Currency | null;
  onSubmit: (data: {
    id: string;
    name: string;
    type: 'FIAT' | 'CRYPTO';
    decimalPlaces: number;
  }) => void;
  isEditing: boolean;
}

const CurrencyDialog: React.FC<CurrencyDialogProps> = ({
  open,
  onOpenChange,
  currency,
  onSubmit,
  isEditing,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      id: currency?.id || '',
      name: currency?.name || '',
      type: currency?.type || 'FIAT',
      decimalPlaces: currency?.decimalPlaces || 2,
    },
  });

  const currencyType = watch('type');

  React.useEffect(() => {
    if (open) {
      reset({
        id: currency?.id || '',
        name: currency?.name || '',
        type: currency?.type || 'FIAT',
        decimalPlaces: currency?.decimalPlaces || 2,
      });
    }
  }, [open, currency, reset]);

  const onFormSubmit = (data: {
    id: string;
    name: string;
    type: string;
    decimalPlaces: number;
  }) => {
    onSubmit({
      id: data.id,
      name: data.name,
      type: data.type as 'FIAT' | 'CRYPTO',
      decimalPlaces: Number(data.decimalPlaces),
    });
    onOpenChange(false);
  };

  const handleTypeChange = (value: string) => {
    setValue('type', value as 'FIAT' | 'CRYPTO');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-primary">
            {isEditing ? 'Edit Currency' : 'Add New Currency'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="id" className="text-sm font-medium">
              Currency ID
            </Label>
            <Input
              id="id"
              {...register('id', {
                required: 'Currency ID is required',
                maxLength: {
                  value: 10,
                  message: 'Currency ID cannot exceed 10 characters',
                },
              })}
              className="w-full"
              disabled={isEditing}
              placeholder="USD, EUR, BTC"
            />
            {errors.id && (
              <p className="text-sm text-destructive">{errors.id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Currency Name
            </Label>
            <Input
              id="name"
              {...register('name', { required: 'Currency name is required' })}
              className="w-full"
              placeholder="US Dollar, Euro, Bitcoin"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Currency Type</Label>
            <RadioGroup
              defaultValue={currency?.type || 'FIAT'}
              value={currencyType}
              onValueChange={handleTypeChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FIAT" id="fiat" />
                <Label htmlFor="fiat" className="cursor-pointer">
                  FIAT
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CRYPTO" id="crypto" />
                <Label htmlFor="crypto" className="cursor-pointer">
                  CRYPTO
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="decimalPlaces" className="text-sm font-medium">
              Decimal Places
            </Label>
            <Input
              id="decimalPlaces"
              type="number"
              min="0"
              max="18"
              {...register('decimalPlaces', {
                required: 'Decimal places is required',
                min: { value: 0, message: 'Minimum value is 0' },
                max: { value: 18, message: 'Maximum value is 18' },
              })}
              className="w-full"
            />
            {errors.decimalPlaces && (
              <p className="text-sm text-destructive">
                {errors.decimalPlaces.message}
              </p>
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
              {isEditing ? 'Update Currency' : 'Add Currency'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencyDialog;
