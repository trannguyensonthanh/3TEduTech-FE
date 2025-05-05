import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedRole: string | null;
  setSelectedRole: (value: string | null) => void;
  selectedStatus: string | null;
  setSelectedStatus: (value: string | null) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Select
        value={selectedRole ?? 'all'}
        onValueChange={(value) =>
          setSelectedRole(value === 'all' ? null : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="NU">Student</SelectItem>
          <SelectItem value="GV">Instructor</SelectItem>
          <SelectItem value="AD">Admin</SelectItem>
          <SelectItem value="SA">Super Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={selectedStatus ?? 'all'}
        onValueChange={(value) =>
          setSelectedStatus(value === 'all' ? null : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
          <SelectItem value="BANNED">Banned</SelectItem>
          <SelectItem value="PENDING_VERIFICATION">
            Pending Verification
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserFilters;
