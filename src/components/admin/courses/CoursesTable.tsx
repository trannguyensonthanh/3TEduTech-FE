/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Eye, MoreHorizontal, Star, Trash, X } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  slug: string;
  instructor: string;
  instructorId: number;
  category: string;
  price: number;
  status: string;
  rating: string;
  students: number;
  createdAt: string;
  description: string;
  thumbnailUrl: string;
  promoVideoUrl: string;
  curriculum: any[];
}

interface CoursesTableProps {
  courses: Course[];
  onViewDetails: (courseId: number) => void;
  onStatusChange: (courseId: number, newStatus: string) => void;
  onDelete: (courseId: number) => void;
}

const CoursesTable: React.FC<CoursesTableProps> = ({
  courses,
  onViewDetails,
  onStatusChange,
  onDelete,
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.id}</TableCell>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>{course.instructor}</TableCell>
              <TableCell>{course.category}</TableCell>
              <TableCell>${course.price.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span
                    className={`mr-2 h-2 w-2 rounded-full ${
                      course.status === 'PUBLISHED'
                        ? 'bg-green-500'
                        : course.status === 'PENDING'
                        ? 'bg-yellow-500'
                        : course.status === 'REJECTED'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  ></span>
                  {course.status}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {course.rating}
                </div>
              </TableCell>
              <TableCell>{course.students}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewDetails(course.id)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    {course.status === 'PENDING' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(course.id, 'PUBLISHED')}
                        >
                          <Check className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(course.id, 'REJECTED')}
                        >
                          <X className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    {course.status === 'PUBLISHED' && (
                      <DropdownMenuItem
                        onClick={() => onStatusChange(course.id, 'DRAFT')}
                      >
                        <X className="mr-2 h-4 w-4" /> Unpublish
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(course.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoursesTable;
