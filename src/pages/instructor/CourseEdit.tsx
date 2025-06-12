/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import _ from 'lodash';
import { toast } from 'sonner';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import InstructorLayout from '@/components/layout/InstructorLayout';
import FullScreenLoader from '@/components/common/FullScreenLoader';
import ConfirmationDialog from '@/components/instructor/courseCreate/ConfirmationDialog';
import { Icons } from '@/components/common/Icons';

// Tabs & Child Components
import BasicInfoTab from '@/components/instructor/courseCreate/BasicInfoTab';
import DetailsTab from '@/components/instructor/courseCreate/DetailsTab';
import MediaTab from '@/components/instructor/courseCreate/MediaTab';
import PricingTab from '@/components/instructor/courseCreate/PricingTab';
import CurriculumTab from '@/components/instructor/courseCreate/CurriculumTab';

// Hooks, Services & Types
import {
  useCourseDetailBySlug,
  useUpdateCourse,
  useSubmitCourseForApproval,
  useDeleteCourse,
  useUpdateCourseThumbnail,
} from '@/hooks/queries/course.queries';
import { useCategories } from '@/hooks/queries/category.queries';
import { useLevels } from '@/hooks/queries/level.queries';
import { useLanguages } from '@/hooks/queries/language.queries';
import {
  courseEditSchema,
  TCourseEditSchema,
} from '@/lib/validators/courseEditValidator';
import { CourseStatusId } from '@/types/common.types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

const CourseEdit: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');

  // State cho các hành động chính
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // State cho media files (không thuộc form)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // --- Data Fetching ---
  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = useCourseDetailBySlug(courseSlug);
  const { data: categoriesData, isLoading: catLoading } = useCategories({
    limit: 0,
  });
  const { data: levelsData, isLoading: levelLoading } = useLevels();
  const { data: languagesData, isLoading: langLoading } = useLanguages({
    isActive: true,
  });

  // --- Mutations ---
  const { mutate: updateCourse, isPending: isUpdatingCourse } =
    useUpdateCourse();
  const { mutate: updateThumbnail, isPending: isUploadingThumb } =
    useUpdateCourseThumbnail();
  const { mutate: submitForApproval, isPending: isSubmitting } =
    useSubmitCourseForApproval();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const isProcessing =
    isUpdatingCourse || isUploadingThumb || isSubmitting || isDeleting;

  // --- Form Setup ---
  const form = useForm<TCourseEditSchema>({
    resolver: zodResolver(courseEditSchema),
    mode: 'onChange',
  });

  // -- Khởi tạo Form với dữ liệu từ API --
  useEffect(() => {
    if (course) {
      const formData = {
        courseId: Number(course.courseId),
        slug: course.slug,
        courseName: course.courseName,
        shortDescription: course.shortDescription || '',
        fullDescription: course.fullDescription || '',
        requirements: course.requirements || '',
        learningOutcomes: course.learningOutcomes || '',
        categoryId: course.categoryId || undefined,
        levelId: course.levelId || undefined,
        language:
          course.language === 'vi' || course.language === 'en'
            ? (course.language as 'vi' | 'en')
            : 'en',
        originalPrice: course.pricing?.base?.originalPrice,
        discountedPrice: course.pricing?.base?.discountedPrice,
        introVideoUrl: course.introVideoUrl || '',
      };
      form.reset(formData);
    }
  }, [course, form]);

  // --- HÀM LƯU THAY ĐỔI CHÍNH ---
  const handleSaveChanges = (formData: TCourseEditSchema) => {
    if (!course) return;

    const promise = new Promise((resolve, reject) => {
      (async () => {
        try {
          // Bước 1: Lưu thông tin khóa học nếu form có thay đổi
          if (form.formState.isDirty) {
            const { courseId, ...payload } = courseEditSchema.parse(formData);
            await updateCourse({
              courseId: Number(course.courseId),
              data: payload,
            });
          }

          // Bước 2: Upload thumbnail nếu có file mới
          if (thumbnailFile) {
            await updateThumbnail({
              courseId: course.courseId,
              file: thumbnailFile,
            });
          }

          resolve('All changes saved successfully!');
        } catch (err) {
          reject(err);
        }
      })();
    });

    toast.promise(promise, {
      loading: 'Saving changes...',
      success: (message) => {
        setThumbnailFile(null); // Reset file sau khi thành công
        refetch(); // Fetch lại dữ liệu mới nhất để reset form state và isDirty
        return message as string;
      },
      error: (err: any) => err.message || 'An error occurred while saving.',
    });
  };

  // --- Action Handlers ---
  const confirmSubmit = () => {
    if (!course) return;
    submitForApproval(
      { courseId: course.courseId },
      {
        onSuccess: () => {
          toast.success('Course submitted for approval successfully!');
          refetch();
          setIsSubmitConfirmOpen(false);
        },
        onError: (err) =>
          toast.error((err as Error).message || 'Submission failed.'),
      }
    );
  };

  const confirmDelete = () => {
    if (!course) return;
    deleteCourse(course.courseId, {
      onSuccess: () => {
        toast.success(`Course "${course.courseName}" has been deleted.`);
        navigate('/instructor/courses');
      },
      onError: (err) =>
        toast.error((err as Error).message || 'Could not delete course.'),
    });
  };

  // --- Render Logic ---
  const isLoadingPage = isLoading || catLoading || levelLoading || langLoading;
  if (isLoadingPage && !course) {
    return (
      <InstructorLayout>
        <FullScreenLoader text='Loading Course Editor...' />
      </InstructorLayout>
    );
  }
  if (isError) {
    return (
      <InstructorLayout>
        <div className='p-8 text-center text-destructive'>
          Error: {error.message}
        </div>
      </InstructorLayout>
    );
  }
  if (!course) {
    return (
      <InstructorLayout>
        <div className='p-8 text-center'>Course not found.</div>
      </InstructorLayout>
    );
  }

  const currentStatus = course.statusId as CourseStatusId;
  const canEdit = ![CourseStatusId.PENDING].includes(currentStatus);
  const canSubmit = [CourseStatusId.DRAFT, CourseStatusId.REJECTED].includes(
    currentStatus
  );
  const hasUnsavedChanges = form.formState.isDirty || !!thumbnailFile;

  return (
    <InstructorLayout>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSaveChanges)}
          className='p-4 md:p-8 space-y-6'
        >
          <header className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4'>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>Edit Course</h1>
              <div className='flex items-center gap-2 mt-1'>
                <p
                  className='text-muted-foreground truncate'
                  title={course.courseName}
                >
                  {course.courseName}
                </p>
                <Badge
                  variant={
                    currentStatus === 'PUBLISHED' ? 'success' : 'outline'
                  }
                >
                  {currentStatus}
                </Badge>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                type='submit'
                size='sm'
                disabled={!hasUnsavedChanges || isProcessing}
              >
                {isProcessing ? (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Icons.save className='mr-2 h-4 w-4' />
                )}
                Save Changes
              </Button>

              <Button
                type='button'
                size='sm'
                onClick={() => setIsSubmitConfirmOpen(true)}
                disabled={!canSubmit || isSubmitting || hasUnsavedChanges}
              >
                {isSubmitting ? (
                  <Icons.spinner className='h-4 w-4 animate-spin' />
                ) : (
                  <Icons.send className='h-4 w-4' />
                )}{' '}
                <span className='ml-2'>Submit</span>
              </Button>
            </div>
          </header>

          {hasUnsavedChanges && (
            <Alert
              variant='default'
              className='bg-yellow-50 border-yellow-200 text-yellow-800'
            >
              <Icons.alertCircle className='h-4 w-4 !text-yellow-600' />
              <AlertTitle>You have unsaved changes!</AlertTitle>
              <AlertDescription>
                Don't forget to save your work before submitting for approval or
                leaving the page.
              </AlertDescription>
            </Alert>
          )}

          <fieldset
            disabled={!canEdit || isProcessing}
            className='disabled:opacity-75'
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className='grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5'>
                <TabsTrigger value='basic'>Basic Info</TabsTrigger>
                <TabsTrigger value='details'>Details</TabsTrigger>
                <TabsTrigger value='media'>Media</TabsTrigger>
                <TabsTrigger value='curriculum'>Curriculum</TabsTrigger>
                <TabsTrigger value='pricing'>Pricing</TabsTrigger>
              </TabsList>
              <div className='mt-6'>
                {/* Các TabsContent không cần thay đổi, chúng chỉ tương tác với form context */}
                <TabsContent
                  value='basic'
                  forceMount
                  className={activeTab !== 'basic' ? 'hidden' : ''}
                >
                  <BasicInfoTab
                    categories={categoriesData?.categories || []}
                    levels={levelsData?.levels || []}
                    languages={languagesData?.languages || []}
                    isLoading={false}
                  />
                </TabsContent>
                <TabsContent
                  value='details'
                  forceMount
                  className={activeTab !== 'details' ? 'hidden' : ''}
                >
                  <DetailsTab />
                </TabsContent>
                <TabsContent
                  value='media'
                  forceMount
                  className={activeTab !== 'media' ? 'hidden' : ''}
                >
                  {/* Cập nhật MediaTab để nhận file và preview, không tự gọi API */}
                  <MediaTab
                    onThumbnailChange={setThumbnailFile}
                    initialThumbnail={course.thumbnailUrl}
                    initialIntroVideo={course.introVideoUrl}
                  />
                </TabsContent>
                <TabsContent
                  value='curriculum'
                  forceMount
                  className={activeTab !== 'curriculum' ? 'hidden' : ''}
                >
                  <CurriculumTab
                    courseId={course.courseId}
                    initialSections={(course.sections || []).map(
                      (section: any) => ({
                        ...section,
                        sectionId: Number(section.sectionId),
                      })
                    )}
                  />
                </TabsContent>
                <TabsContent
                  value='pricing'
                  forceMount
                  className={activeTab !== 'pricing' ? 'hidden' : ''}
                >
                  <PricingTab />
                </TabsContent>
              </div>
            </Tabs>
          </fieldset>

          <div className='flex justify-start pt-6 border-t mt-6'>
            <Button
              type='button'
              variant='destructive'
              onClick={() => setIsDeleteConfirmOpen(true)}
              disabled={isDeleting}
            >
              {isDeleting ? <Icons.spinner /> : <Icons.trash />} Delete Course
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* Dialogs */}
      <ConfirmationDialog
        open={isSubmitConfirmOpen}
        onOpenChange={setIsSubmitConfirmOpen}
        onConfirm={confirmSubmit}
        isConfirming={isSubmitting}
        title='Submit Course for Approval?'
        description='Please ensure your course is complete and meets all quality standards. You will not be able to edit the course while it is under review.'
        confirmText='Yes, Submit for Approval'
      />
      <ConfirmationDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
        title='Delete This Course Permanently?'
        description={`This will permanently delete "${course.courseName}" and all of its content, including enrollments and data. This action cannot be undone.`}
        confirmText='Yes, Delete This Course'
        confirmVariant='destructive'
      />
    </InstructorLayout>
  );
};

export default CourseEdit;
