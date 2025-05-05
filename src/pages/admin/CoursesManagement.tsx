/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import CourseFilters from '@/components/admin/courses/CourseFilters';
import CoursesTable from '@/components/admin/courses/CoursesTable';
import CourseDetailsDialog from '@/components/admin/courses/CourseDetailsDialog';
import LessonDetailsDialog from '@/components/admin/courses/LessonDetailsDialog';
import CourseDeleteDialog from '@/components/admin/courses/CourseDeleteDialog';
import PaginationComponent from '@/components/admin/courses/PaginationComponent';

// Mock data for demonstration
const mockCourses = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  title: `Course ${i + 1}: Learn Something Amazing`,
  slug: `course-${i + 1}-complete-guide-something-amazing`,
  instructor: `Instructor ${Math.floor(i / 3) + 1}`,
  instructorId: Math.floor(i / 3) + 1,
  category: ['Programming', 'Design', 'Business', 'Marketing', 'Photography'][
    i % 5
  ],
  price: Math.floor(Math.random() * 150) + 9.99,
  status: ['DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED'][i % 4],
  rating: (Math.random() * 3 + 2).toFixed(1),
  students: Math.floor(Math.random() * 5000),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split('T')[0],
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nunc nisl aliquet nunc, quis aliquam nisl nunc sit amet nisl.',
  thumbnailUrl: `https://via.placeholder.com/640x360?text=Course+${i + 1}`,
  promoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  curriculum: [
    {
      id: 1,
      title: 'Section 1: Introduction',
      lessons: [
        {
          id: 1,
          title: 'Welcome to the Course',
          duration: '05:30',
          type: 'VIDEO',
          isPreview: true,
          videoUrl: 'https://www.example.com/video1',
        },
        {
          id: 2,
          title: 'Course Overview',
          duration: '10:15',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.example.com/video2',
        },
      ],
    },
    {
      id: 2,
      title: 'Section 2: Getting Started',
      lessons: [
        {
          id: 3,
          title: 'Setting Up Your Environment',
          duration: '15:45',
          type: 'TEXT',
          isPreview: false,
          content: '<h1>Setting Up</h1><p>Instructions here</p>',
        },
        {
          id: 4,
          title: 'Basic Concepts',
          duration: '12:30',
          type: 'QUIZ',
          isPreview: false,
          questions: [
            {
              id: 1,
              text: 'What is React?',
              explanation: 'A JS Library',
              options: [
                { id: 1, text: 'A library', isCorrect: true },
                { id: 2, text: 'A framework', isCorrect: false },
              ],
            },
          ],
        },
        {
          id: 5,
          title: 'Your First Project',
          duration: '20:15',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.example.com/video3',
        },
      ],
    },
    {
      id: 3,
      title: 'Section 3: Advanced Topics',
      lessons: [
        {
          id: 6,
          title: 'Advanced Techniques',
          duration: '18:20',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.example.com/video4',
        },
        {
          id: 7,
          title: 'Best Practices',
          duration: '14:10',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.example.com/video5',
        },
      ],
    },
  ],
}));

const CoursesManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [courses, setCourses] = useState(mockCourses);

  // State for dialog components
  const [courseDetailsOpen, setCourseDetailsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [lessonDetailsOpen, setLessonDetailsOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const itemsPerPage = 10;

  // Filter courses based on search and filters
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? course.category === selectedCategory
        : true;
      const matchesStatus = selectedStatus
        ? course.status === selectedStatus
        : true;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => b.id - a.id); // Sort by newest first

  // Paginate courses
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle course status changes
  const handleCourseStatusChange = (courseId: number, newStatus: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, status: newStatus } : course
      )
    );

    toast({
      title: 'Course status updated',
      description: `Course status has been changed to ${newStatus.toLowerCase()}.`,
    });
  };

  // Handle course deletion
  const handleDeleteCourse = () => {
    if (courseToDelete) {
      setCourses(courses.filter((course) => course.id !== courseToDelete));

      toast({
        title: 'Course deleted',
        description: 'The course has been deleted successfully.',
        variant: 'destructive',
      });

      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  // View course details
  const handleViewCourseDetails = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setCourseDetailsOpen(true);
    }
  };

  // View lesson details
  const handleViewLessonDetails = (lessonId: number, courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      for (const section of course.curriculum) {
        const lesson = section.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          setSelectedLesson({ ...lesson, sectionTitle: section.title });
          setLessonDetailsOpen(true);
          return;
        }
      }
    }
  };

  // Handle delete button click
  const handleDeleteButtonClick = (courseId: number) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Course Management</h1>
        </div>

        <CourseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        <CoursesTable
          courses={paginatedCourses}
          onViewDetails={handleViewCourseDetails}
          onStatusChange={handleCourseStatusChange}
          onDelete={handleDeleteButtonClick}
        />

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Dialog components */}
      <CourseDetailsDialog
        open={courseDetailsOpen}
        onOpenChange={setCourseDetailsOpen}
        course={selectedCourse}
        onViewLesson={handleViewLessonDetails}
      />

      <LessonDetailsDialog
        open={lessonDetailsOpen}
        onOpenChange={setLessonDetailsOpen}
        lesson={selectedLesson}
      />

      <CourseDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteCourse}
      />
    </AdminLayout>
  );
};

export default CoursesManagement;
