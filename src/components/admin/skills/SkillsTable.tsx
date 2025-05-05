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
import { Skill } from '@/services/skill.service';

interface SkillsTableProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: number) => void;
}

const SkillsTable: React.FC<SkillsTableProps> = ({
  skills,
  onEdit,
  onDelete,
}) => {
  console.log('SkillsTable rendered with skills:', skills);
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-12 font-semibold">ID</TableHead>
          <TableHead className="font-semibold">Skill Name</TableHead>
          <TableHead className="font-semibold">Description</TableHead>
          <TableHead className="font-semibold">Created At</TableHead>
          <TableHead className="font-semibold">Updated At</TableHead>
          <TableHead className="text-right font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skills.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center py-8 text-muted-foreground"
            >
              No skills found.
            </TableCell>
          </TableRow>
        ) : (
          skills.map((skill) => (
            <TableRow
              key={skill.SkillID}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell>{skill.SkillID}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {skill.SkillName}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <div className="truncate">{skill.Description || '—'}</div>
              </TableCell>
              <TableCell>{formatDate(skill.CreatedAt)}</TableCell>
              <TableCell>{formatDate(skill.UpdatedAt)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(skill)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(skill.SkillID)}
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

export default SkillsTable;
