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
import { ExchangeRate } from './ExchangeRatesTable';
import { Currency } from '../currencies/CurrenciesTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ExchangeRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exchangeRate: ExchangeRate | null;
  onSubmit: (data: Omit<ExchangeRate, 'id'>) => void;
  isEditing: boolean;
  currencies: Currency[];
}

const ExchangeRateDialog: React.FC<ExchangeRateDialogProps> = ({
  open,
  onOpenChange,
  exchangeRate,
  onSubmit,
  isEditing,
  currencies,
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
      fromCurrencyId: exchangeRate?.fromCurrencyId || '',
      toCurrencyId: exchangeRate?.toCurrencyId || '',
      rate: exchangeRate ? String(exchangeRate.rate) : '',
      effectiveTimestamp: exchangeRate
        ? new Date(exchangeRate.effectiveTimestamp).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      source: exchangeRate?.source || '',
    },
  });

  const fromCurrency = watch('fromCurrencyId');
  const toCurrency = watch('toCurrencyId');

  React.useEffect(() => {
    if (open) {
      reset({
        fromCurrencyId: exchangeRate?.fromCurrencyId || '',
        toCurrencyId: exchangeRate?.toCurrencyId || '',
        rate: exchangeRate ? String(exchangeRate.rate) : '',
        effectiveTimestamp: exchangeRate
          ? new Date(exchangeRate.effectiveTimestamp).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        source: exchangeRate?.source || '',
      });
    }
  }, [open, exchangeRate, reset]);

  const onFormSubmit = (data: {
    fromCurrencyId: string;
    toCurrencyId: string;
    rate: string;
    effectiveTimestamp: string;
    source: string;
  }) => {
    onSubmit({
      fromCurrencyId: data.fromCurrencyId,
      toCurrencyId: data.toCurrencyId,
      rate: parseFloat(data.rate),
      effectiveTimestamp: new Date(data.effectiveTimestamp).toISOString(),
      source: data.source || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-primary">
            {isEditing ? 'Edit Exchange Rate' : 'Add New Exchange Rate'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromCurrencyId" className="text-sm font-medium">
                From Currency
              </Label>
              <Select
                onValueChange={(value) => setValue('fromCurrencyId', value)}
                value={fromCurrency}
                disabled={isEditing}
              >
                <SelectTrigger id="fromCurrencyId">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      {currency.id} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fromCurrencyId && (
                <p className="text-sm text-destructive">
                  {errors.fromCurrencyId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toCurrencyId" className="text-sm font-medium">
                To Currency
              </Label>
              <Select
                onValueChange={(value) => setValue('toCurrencyId', value)}
                value={toCurrency}
                disabled={isEditing}
              >
                <SelectTrigger id="toCurrencyId">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.id}
                      value={currency.id}
                      disabled={currency.id === fromCurrency}
                    >
                      {currency.id} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.toCurrencyId && (
                <p className="text-sm text-destructive">
                  {errors.toCurrencyId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate" className="text-sm font-medium">
              Exchange Rate
            </Label>
            <Input
              id="rate"
              type="number"
              step="any"
              min="0.000000000000000001"
              {...register('rate', {
                required: 'Exchange rate is required',
                min: { value: 0, message: 'Rate must be greater than 0' },
                validate: (value) =>
                  parseFloat(value) > 0 || 'Rate must be greater than 0',
              })}
              className="w-full"
            />
            {errors.rate && (
              <p className="text-sm text-destructive">{errors.rate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effectiveTimestamp" className="text-sm font-medium">
              Effective From
            </Label>
            <Input
              id="effectiveTimestamp"
              type="datetime-local"
              {...register('effectiveTimestamp', {
                required: 'Effective timestamp is required',
              })}
              className="w-full"
            />
            {errors.effectiveTimestamp && (
              <p className="text-sm text-destructive">
                {errors.effectiveTimestamp.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm font-medium">
              Source (Optional)
            </Label>
            <Input
              id="source"
              {...register('source')}
              className="w-full"
              placeholder="E.g. Yahoo Finance, CoinMarketCap, Manual Update"
            />
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
              {isEditing ? 'Update Rate' : 'Add Rate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExchangeRateDialog;
