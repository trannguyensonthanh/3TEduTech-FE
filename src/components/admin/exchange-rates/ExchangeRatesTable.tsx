/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface ExchangeRate {
  id: number;
  fromCurrencyId: string;
  toCurrencyId: string;
  rate: number;
  effectiveTimestamp: string;
  source: string | null;
}

interface ExchangeRatesTableProps {
  exchangeRates: ExchangeRate[];
  onEdit: (rate: ExchangeRate) => void;
  onDelete: (rateId: any) => void;
}

const ExchangeRatesTable: React.FC<ExchangeRatesTableProps> = ({
  exchangeRates,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-12 font-semibold">ID</TableHead>
          <TableHead className="font-semibold">From</TableHead>
          <TableHead className="font-semibold">To</TableHead>
          <TableHead className="font-semibold">Rate</TableHead>
          <TableHead className="font-semibold">Effective From</TableHead>
          <TableHead className="font-semibold">Source</TableHead>
          <TableHead className="text-right font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exchangeRates.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center py-8 text-muted-foreground"
            >
              No exchange rates found.
            </TableCell>
          </TableRow>
        ) : (
          exchangeRates.map((rate) => (
            <TableRow
              key={rate.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell>{rate.id}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  {rate.fromCurrencyId}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  {rate.toCurrencyId}
                </Badge>
              </TableCell>
              <TableCell className="font-mono">
                {rate.rate.toLocaleString(undefined, {
                  maximumFractionDigits: 18,
                })}
              </TableCell>
              <TableCell>{formatDate(rate.effectiveTimestamp)}</TableCell>
              <TableCell>{rate.source || '—'}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(rate)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(rate.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ExchangeRatesTable;
