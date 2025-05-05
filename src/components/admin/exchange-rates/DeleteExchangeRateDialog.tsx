import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DeleteExchangeRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  fromCurrency: string;
  toCurrency: string;
}

const DeleteExchangeRateDialog: React.FC<DeleteExchangeRateDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  fromCurrency,
  toCurrency,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Delete Exchange Rate
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete the exchange rate from{' '}
            <span className="font-semibold">{fromCurrency}</span> to{' '}
            <span className="font-semibold">{toCurrency}</span>? This action
            cannot be undone and may affect payment calculations.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteExchangeRateDialog;
