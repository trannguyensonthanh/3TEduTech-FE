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

export interface PaymentMethod {
  id: string;
  name: string;
}

interface PaymentMethodsTableProps {
  paymentMethods: PaymentMethod[];
  onEdit: (paymentMethod: PaymentMethod) => void;
  onDelete: (paymentMethodId: any) => void;
}

const PaymentMethodsTable: React.FC<PaymentMethodsTableProps> = ({
  paymentMethods,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-40 font-semibold">Method ID</TableHead>
          <TableHead className="font-semibold">Method Name</TableHead>
          <TableHead className="text-right font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentMethods.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className="text-center py-8 text-muted-foreground"
            >
              No payment methods found.
            </TableCell>
          </TableRow>
        ) : (
          paymentMethods.map((method) => (
            <TableRow
              key={method.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-medium">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {method.id}
                </Badge>
              </TableCell>
              <TableCell>{method.name}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(method)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(method.id)}
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

export default PaymentMethodsTable;
