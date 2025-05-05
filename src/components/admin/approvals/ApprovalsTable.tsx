import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Approval {
  id: number;
  courseName: string;
  instructorName: string;
  type: string;
  categoryName: string;
  price: number;
  submittedAt: string;
  status: string;
}

interface ApprovalsTableProps {
  approvals: Approval[];
  onReview: (id: number) => void;
}

const ApprovalsTable: React.FC<ApprovalsTableProps> = ({
  approvals,
  onReview,
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvals.map((approval) => (
            <TableRow key={approval.id}>
              <TableCell>{approval.id}</TableCell>
              <TableCell className="font-medium">
                {approval.courseName}
              </TableCell>
              <TableCell>{approval.instructorName}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {approval.type === 'NEW_COURSE' ? 'New Course' : 'Update'}
                </Badge>
              </TableCell>
              <TableCell>{approval.categoryName}</TableCell>
              <TableCell>${approval.price.toFixed(2)}</TableCell>
              <TableCell>{approval.submittedAt}</TableCell>
              <TableCell>
                <Badge
                  className={
                    approval.status === 'APPROVED'
                      ? 'bg-green-500'
                      : approval.status === 'REJECTED'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }
                >
                  {approval.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReview(approval.id)}
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApprovalsTable;
