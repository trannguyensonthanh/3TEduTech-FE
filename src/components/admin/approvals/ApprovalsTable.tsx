// src/components/admin/approvals/ApprovalsTable.tsx
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
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Eye, Clock, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import { format } from 'date-fns'; // Thư viện định dạng ngày giờ
import { Card } from '@/components/ui/card';

import {
  ApprovalRequestListItem,
  ApprovalStatusType,
} from '@/services/course.service';

// Type cho một item trong danh sách pending (lấy từ PendingCoursesListResponse)

interface ApprovalsTableProps {
  approvals: ApprovalRequestListItem[];
  onReview: (slug: string, requestId: number) => void; // Truyền slug và request ID
  isLoading?: boolean;
  itemsPerPage?: number; // Dùng cho skeleton
}

// Helper function để lấy variant và icon cho Badge status
const getStatusBadgeProps = (
  status: ApprovalStatusType | string
): {
  variant: 'success' | 'destructive' | 'secondary' | 'default' | 'outline';
  Icon?: React.ElementType;
} => {
  switch (status) {
    case 'APPROVED':
      return { variant: 'success', Icon: CheckCircle };
    case 'REJECTED':
      return { variant: 'destructive', Icon: XCircle };
    case 'PENDING':
      return { variant: 'outline', Icon: Hourglass };
    default:
      return { variant: 'secondary', Icon: undefined }; // Trạng thái khác (nếu có)
  }
};

const ApprovalsTable: React.FC<ApprovalsTableProps> = ({
  approvals,
  onReview,
  isLoading = false,
  itemsPerPage = 10,
}) => {
  const renderSkeletonRows = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <TableRow key={`skeleton-row-${index}`}>
        {/* Điều chỉnh số lượng và chiều rộng skeleton cell cho khớp */}
        <TableCell className="w-[300px]">
          <Skeleton className="h-4 w-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-24" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-20 ml-auto" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card className="border shadow-sm">
      {' '}
      {/* Thêm border và shadow nhẹ */}
      <Table>
        <TableHeader>
          <TableRow>
            {/* Bỏ cột ID nếu không cần thiết */}
            {/* <TableHead className="w-[50px]">ID</TableHead> */}
            <TableHead>Course Name</TableHead>
            <TableHead>Instructor</TableHead>
            {/* <TableHead>Category</TableHead> */}
            <TableHead>Submitted</TableHead>
            {/* <TableHead>Reviewed</TableHead> */} {/* Có thể thêm cột này */}
            <TableHead>Request Type</TableHead>
            <TableHead>Status</TableHead> {/* Thêm cột Status */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            renderSkeletonRows(itemsPerPage)
          ) : approvals.length > 0 ? (
            approvals.map((approval) => {
              const { variant: statusVariant, Icon: StatusIcon } =
                getStatusBadgeProps(approval.status);
              const isPending = approval.status === 'PENDING';

              return (
                <TableRow key={approval.requestId}>
                  <TableCell
                    className="font-medium max-w-[300px] truncate"
                    title={approval.courseName}
                  >
                    {approval.courseName}
                  </TableCell>
                  <TableCell>{approval.instructorName}</TableCell>
                  {/* <TableCell>
                    <Badge variant="outline">{approval.categoryName}</Badge>
                  </TableCell> */}
                  <TableCell>
                    <span className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(approval?.requestDate), 'PP')}{' '}
                      {/* Định dạng ngắn gọn hơn */}
                    </span>
                  </TableCell>
                  {/* <TableCell>{approval.reviewedAt ? format(new Date(approval.reviewedAt), 'PP') : '-'}</TableCell> */}
                  <TableCell>
                    <Badge
                      variant={
                        approval.requestType === 'NEW_COURSE'
                          ? 'default'
                          : 'secondary'
                      }
                      className="capitalize"
                    >
                      {approval.requestType.replace('_', ' ').toLowerCase()}
                    </Badge>
                  </TableCell>
                  {/* Cột Status mới */}
                  <TableCell>
                    <Badge variant={statusVariant} className="capitalize">
                      {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                      {approval.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Nút Review chỉ hiển thị/enable khi status là PENDING */}
                    <Button
                      variant={isPending ? 'default' : 'outline'} // Nổi bật nút review cho pending
                      size="sm"
                      onClick={() =>
                        onReview(approval.courseSlug, approval.requestId)
                      }
                    >
                      <Eye className="mr-1.5 h-4 w-4" />
                      {isPending ? 'Review' : 'View Detail'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                {' '}
                {/* Tăng colSpan */}
                No approval requests found for this status.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ApprovalsTable;
