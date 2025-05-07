import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SkillsTable from '@/components/admin/skills/SkillsTable';
import SkillDialog from '@/components/admin/skills/SkillDialog';
import DeleteSkillDialog from '@/components/admin/skills/DeleteSkillDialog';
import PaginationControls from '@/components/admin/PaginationControls';
import {
  useCreateSkill,
  useDeleteSkill,
  useSkills,
  useUpdateSkill,
} from '@/hooks/queries/skill.queries';
import { Skill } from '@/services/skill.service';

// Mock data for demo purpose
// const mockSkills: Skill[] = [
//   {
//     id: 1,
//     name: 'JavaScript',
//     description:
//       'A programming language that is one of the core technologies of the World Wide Web.',
//     createdAt: '2023-01-15T08:30:00Z',
//     updatedAt: '2023-01-15T08:30:00Z',
//   },
//   {
//     id: 2,
//     name: 'Python',
//     description: 'A high-level, general-purpose programming language.',
//     createdAt: '2023-01-16T10:45:00Z',
//     updatedAt: '2023-02-20T14:15:00Z',
//   },
//   {
//     id: 3,
//     name: 'React',
//     description: 'A JavaScript library for building user interfaces.',
//     createdAt: '2023-01-18T12:00:00Z',
//     updatedAt: '2023-01-18T12:00:00Z',
//   },
//   {
//     id: 4,
//     name: 'UI/UX Design',
//     description:
//       'The process of designing the user interface and user experience of a product.',
//     createdAt: '2023-02-01T09:20:00Z',
//     updatedAt: '2023-02-01T09:20:00Z',
//   },
//   {
//     id: 5,
//     name: 'Digital Marketing',
//     description:
//       'The use of the internet, mobile devices, social media, search engines, and other channels to reach consumers.',
//     createdAt: '2023-02-10T15:30:00Z',
//     updatedAt: '2023-02-10T15:30:00Z',
//   },
//   // Additional mock skills for better pagination testing
//   {
//     id: 6,
//     name: 'Node.js',
//     description: "A JavaScript runtime built on Chrome's V8 JavaScript engine.",
//     createdAt: '2023-03-01T10:00:00Z',
//     updatedAt: '2023-03-01T10:00:00Z',
//   },
//   {
//     id: 7,
//     name: 'TypeScript',
//     description:
//       'A strongly typed programming language that builds on JavaScript.',
//     createdAt: '2023-03-05T14:25:00Z',
//     updatedAt: '2023-03-05T14:25:00Z',
//   },
//   {
//     id: 8,
//     name: 'Docker',
//     description:
//       'A platform for developing, shipping, and running applications in containers.',
//     createdAt: '2023-03-10T09:15:00Z',
//     updatedAt: '2023-03-10T09:15:00Z',
//   },
//   {
//     id: 9,
//     name: 'Git',
//     description: 'A distributed version control system.',
//     createdAt: '2023-03-15T11:30:00Z',
//     updatedAt: '2023-03-15T11:30:00Z',
//   },
//   {
//     id: 10,
//     name: 'AWS',
//     description: 'A cloud computing platform provided by Amazon.',
//     createdAt: '2023-03-20T13:45:00Z',
//     updatedAt: '2023-03-20T13:45:00Z',
//   },
//   {
//     id: 11,
//     name: 'SQL',
//     description:
//       'A domain-specific language used for managing data in relational databases.',
//     createdAt: '2023-03-25T16:00:00Z',
//     updatedAt: '2023-03-25T16:00:00Z',
//   },
//   {
//     id: 12,
//     name: 'GraphQL',
//     description:
//       'A query language for APIs and a runtime for executing those queries.',
//     createdAt: '2023-04-01T08:30:00Z',
//     updatedAt: '2023-04-01T08:30:00Z',
//   },
// ];

const SkillsManagement: React.FC = () => {
  const { toast } = useToast();

  // Quản lý tham số truy vấn
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sử dụng hook useSkills để lấy dữ liệu từ API
  const { data, isLoading, isError, refetch } = useSkills({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  const skills = data?.skills || [];
  const totalPages = data?.totalPages || 1;

  // Quản lý trạng thái dialog
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Sử dụng các mutation hooks
  const createSkillMutation = useCreateSkill({
    onSuccess: () => {
      toast({
        title: 'Skill added',
        description: 'The skill has been added successfully.',
      });
      refetch(); // Làm mới danh sách kỹ năng
      setIsAddEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add skill.',
        variant: 'destructive',
      });
    },
  });

  const updateSkillMutation = useUpdateSkill({
    onSuccess: () => {
      toast({
        title: 'Skill updated',
        description: 'The skill has been updated successfully.',
      });
      refetch(); // Làm mới danh sách kỹ năng
      setIsAddEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update skill.',
        variant: 'destructive',
      });
    },
  });

  const deleteSkillMutation = useDeleteSkill({
    onSuccess: () => {
      toast({
        title: 'Skill deleted',
        description: 'The skill has been deleted successfully.',
        variant: 'destructive',
      });
      refetch(); // Làm mới danh sách kỹ năng
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete skill.',
        variant: 'destructive',
      });
    },
  });

  const handleAddSkill = () => {
    setSkillToEdit(null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setSkillToEdit(skill);
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteSkill = (skillId: number) => {
    const skill = skills.find((s) => s.skillId === skillId);
    if (skill) {
      setSkillToDelete(skill);
      setIsDeleteDialogOpen(true);
    }
  };

  // Xử lý submit thêm hoặc chỉnh sửa kỹ năng
  const handleSubmitSkill = async (data: {
    skillName: string;
    description: string | null;
  }) => {
    if (skillToEdit) {
      // Cập nhật kỹ năng
      updateSkillMutation.mutate({
        skillId: skillToEdit.skillId,
        data: {
          skillName: data.skillName,
          description: data.description,
        },
      });
    } else {
      // Thêm kỹ năng mới
      createSkillMutation.mutate({
        skillName: data.skillName,
        description: data.description,
      });
    }
  };

  // Xử lý xác nhận xóa kỹ năng
  const handleConfirmDelete = async () => {
    if (skillToDelete) {
      deleteSkillMutation.mutate(skillToDelete.skillId);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary dark:text-primary-light">
            Skills Management
          </h1>
          <Button
            onClick={handleAddSkill}
            className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:hover:bg-primary-light/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </div>

        <Card className="border-t-4 border-t-primary shadow-md dark:border-t-primary-light dark:shadow-none">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-muted-foreground-light" />
                <Input
                  type="search"
                  placeholder="Search skills..."
                  className="pl-8 border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-700 dark:focus:border-primary-light dark:focus:ring-primary-light"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                <SkillsTable
                  skills={skills}
                  onEdit={handleEditSkill}
                  onDelete={handleDeleteSkill}
                />
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <SkillDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        skill={skillToEdit}
        onSubmit={handleSubmitSkill}
      />

      {skillToDelete && (
        <DeleteSkillDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          skillName={skillToDelete.skillName}
        />
      )}
    </AdminLayout>
  );
};

export default SkillsManagement;
