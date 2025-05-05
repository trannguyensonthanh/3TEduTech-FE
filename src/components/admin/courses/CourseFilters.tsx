import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Search } from 'lucide-react';

interface CourseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search courses..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selectedCategory || 'Filter by Category'}{' '}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
            All Categories
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedCategory('Programming')}>
            Programming
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedCategory('Design')}>
            Design
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedCategory('Business')}>
            Business
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedCategory('Marketing')}>
            Marketing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedCategory('Photography')}>
            Photography
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selectedStatus || 'Filter by Status'}{' '}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
            All Statuses
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedStatus('DRAFT')}>
            Draft
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedStatus('PENDING')}>
            Pending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedStatus('PUBLISHED')}>
            Published
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedStatus('REJECTED')}>
            Rejected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CourseFilters;
