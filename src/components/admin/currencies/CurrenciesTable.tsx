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
import { Badge } from '@/components/ui/badge';

export interface Currency {
  id: string;
  name: string;
  type: 'FIAT' | 'CRYPTO';
  decimalPlaces: number;
}

interface CurrenciesTableProps {
  currencies: Currency[];
  onEdit: (currency: Currency) => void;
  onDelete: (currencyId: any) => void;
}

const CurrenciesTable: React.FC<CurrenciesTableProps> = ({
  currencies,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-24 font-semibold">Currency ID</TableHead>
          <TableHead className="font-semibold">Currency Name</TableHead>
          <TableHead className="font-semibold">Type</TableHead>
          <TableHead className="font-semibold">Decimal Places</TableHead>
          <TableHead className="text-right font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currencies.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center py-8 text-muted-foreground"
            >
              No currencies found.
            </TableCell>
          </TableRow>
        ) : (
          currencies.map((currency) => (
            <TableRow
              key={currency.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-medium">{currency.id}</TableCell>
              <TableCell>{currency.name}</TableCell>
              <TableCell>
                <Badge
                  variant={currency.type === 'FIAT' ? 'secondary' : 'outline'}
                  className={
                    currency.type === 'FIAT'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-purple-100 text-purple-800 border-purple-200'
                  }
                >
                  {currency.type}
                </Badge>
              </TableCell>
              <TableCell>{currency.decimalPlaces}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(currency)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(currency.id)}
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

export default CurrenciesTable;
