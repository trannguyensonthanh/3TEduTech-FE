/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/instructor/CourseEdit.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import InstructorLayout from '@/components/layout/InstructorLayout';
import FullScreenLoader from '@/components/common/FullScreenLoader';
import BasicInfoTab from '@/components/instructor/courseCreate/BasicInfoTab';
import DetailsTab from '@/components/instructor/courseCreate/DetailsTab';
import MediaTab from '@/components/instructor/courseCreate/MediaTab';
import CurriculumTab from '@/components/instructor/courseCreate/CurriculumTab';
import PricingTab from '@/components/instructor/courseCreate/PricingTab';
import SectionDialog from '@/components/instructor/courseCreate/SectionDialog';
import { useQueryClient } from '@tanstack/react-query';
// Import Hooks and Types
import { useCourseCurriculum } from '@/hooks/useCourseCurriculum';
import { useCategories } from '@/hooks/queries/category.queries';
import { useLevels } from '@/hooks/queries/level.queries';
import { useDeleteSection } from '@/hooks/queries/section.queries'; // Import hook delete section
import { useDeleteLesson } from '@/hooks/queries/lesson.queries'; // Import hook delete lesson
import {
  useCourseDetailBySlug,
  useUpdateCourse,
  useDeleteCourse,
  useUpdateCourseThumbnail,
  // useSubmitCourseForApproval, // Nếu cần
  useSubmitCourseForApproval,

  // useSyncCourseCurriculum, // *** Bỏ hook sync ***
  // useUpdateSectionsOrder, // Import nếu dùng kéo thả
  // useUpdateLessonsOrder,  // Import nếu dùng kéo thả
  courseKeys, // Import key để invalidate
} from '@/hooks/queries/course.queries';
// Không cần import các hook create/update/delete section/lesson lẻ nữa nếu dùng sync
// import { useCreateSection, useUpdateSection, useDeleteSection } from '@/hooks/queries/section.queries';
// import { useCreateLesson, useUpdateLesson, useDeleteLesson as useDeleteLessonMutate } from '@/hooks/queries/lesson.queries';
// ... (Các import hook lẻ khác cũng có thể bỏ nếu sync xử lý hết)
import DeleteConfirmationDialog from '@/components/instructor/courseCreate/ConfirmationDialog';
import {
  ListRestart,
  RotateCcw,
  Save,
  Loader2,
  CheckCircle,
  Trash2,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { Course, UpdateCourseData } from '@/services/course.service';

import _ from 'lodash'; // Ensure lodash is installed and imported
import { generateTempId } from '@/components/common/generateTempId';
import LessonDialog from '@/components/instructor/courseCreate/LessonDialog';
import { Form } from '@/components/ui/form';
import { useLessonVideoUrl } from '@/hooks/queries/lesson.queries';
import { getVimeoEmbedUrl, getYoutubeEmbedUrl } from '@/utils/video.util';
import { Section, Lesson, CourseStatusId } from '@/types/common.types';
import { Badge } from '@/components/ui/badge';
import ConfirmationDialog from '@/components/instructor/courseCreate/ConfirmationDialog';
import { useLanguages } from '@/hooks/queries/language.queries';
// Zod schema (Thêm ID)
// Zod schema (Giữ nguyên)
const courseFormSchema = z
  .object({
    courseId: z.number().optional(),
    courseName: z.string().min(1, 'Course title is required').max(255),
    slug: z.string().optional(),
    shortDescription: z.string().min(1, 'Short description required').max(500),
    fullDescription: z.string().min(1, 'Full description required').max(30000), // Tăng giới hạn
    originalPrice: z.preprocess(
      (val) => (val === '' ? NaN : parseFloat(String(val))),
      z.number({ required_error: 'Price required' }).min(0)
    ),
    discountedPrice: z.preprocess(
      (val) =>
        val === '' || val === null || val === undefined
          ? null
          : parseFloat(String(val)),
      z.number().min(0).optional().nullable()
    ),
    categoryId: z.preprocess(
      (val) => (val ? parseInt(String(val), 10) : null),
      z
        .number({ required_error: 'Category required' })
        .int()
        .positive()
        .nullable()
    ),
    levelId: z.preprocess(
      (val) => (val ? parseInt(String(val), 10) : null),
      z.number({ required_error: 'Level required' }).int().positive().nullable()
    ),
    language: z.string().min(1, 'Language required'),
    requirements: z.string().max(5000).optional().nullable(), // Tăng giới hạn
    learningOutcomes: z.string().max(5000).optional().nullable(), // Tăng giới hạn
  })
  .refine(
    (data) =>
      data.discountedPrice === null ||
      data.discountedPrice <= data.originalPrice,
    {
      message: 'Discount price cannot be higher than original.',
      path: ['discountedPrice'],
    }
  );
type CourseFormData = z.infer<typeof courseFormSchema>;

const mockLanguages = [
  { id: 1, name: 'vi' },
  { id: 2, name: 'en' },
];

const CourseEdit: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courseSlug } = useParams<{ courseSlug: string }>();

  const [activeTab, setActiveTab] = useState('basic');
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [isInitializing, setIsInitializing] = useState(true);

  // State for Media
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [promoVideoUrl, setPromoVideoUrl] = useState<string>('');
  const [submitConfirmDialogState, setSubmitConfirmDialogState] = useState<{
    isOpen: boolean;
    courseId: number | null;
    courseName: string | null;
    isProcessing: boolean; // Thêm cờ loading
  }>({ isOpen: false, courseId: null, courseName: null, isProcessing: false });
  // State for Dialogs
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [currentSectionIdForLesson, setCurrentSectionIdForLesson] = useState<
    number | string | null
  >(null);
  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    type: 'section' | 'lesson' | null;
    itemId: number | string | null;
    sectionIdForLesson?: number | string | null;
    onConfirm: () => void;
    itemName?: string;
  }>({
    isOpen: false,
    type: null,
    itemId: null,
    onConfirm: () => {},
    itemName: '',
  });
  const [deleteCourseDialogState, setDeleteCourseDialogState] = useState<{
    isOpen: boolean;
    courseId: number | null;
    courseName: string | null;
    isProcessing: boolean; // Thêm cờ loading
  }>({ isOpen: false, courseId: null, courseName: null, isProcessing: false });
  const [loading, setLoading] = useState(false);
  // Refs
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const lessonVideoRef = useRef<HTMLInputElement>(null);
  const attachmentRef = useRef<HTMLInputElement>(null);
  const initialCourseDataRef = useRef<Course | null>(null); // Để so sánh thay đổi

  // State for Curriculum managed by custom hook
  const { sections } = useCourseCurriculum();

  // State for Dialogs

  // --- Data Fetching ---
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const { data: levelsData, isLoading: isLoadingLevels } = useLevels();
  const {
    data: fetchedCourseData,
    isLoading: isLoadingCourse,
    error: courseError,
    refetch: refetchCourse,
  } = useCourseDetailBySlug(courseSlug, {
    enabled: !!courseSlug,
    staleTime: 1000 * 60 * 1, // Giảm staleTime để fetch lại thường xuyên hơn khi invalidate
    refetchOnWindowFocus: true, // Refetch khi focus lại tab
  });
  const queryClient = useQueryClient();
  // --- Form Setup ---
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {}, // Set trong useEffect
    mode: 'onChange',
  });

  // Initialize Form and local states from fetched data
  useEffect(() => {
    if (fetchedCourseData) {
      console.log('[CourseEdit] Fetched course data:', fetchedCourseData);
      // Lưu trữ bản gốc để so sánh
      initialCourseDataRef.current = JSON.parse(
        JSON.stringify(fetchedCourseData)
      );

      form.reset({
        courseId: Number(fetchedCourseData.courseId) || undefined,
        courseName: fetchedCourseData.courseName || '',
        slug: fetchedCourseData.slug || '',
        shortDescription: fetchedCourseData.shortDescription || '',
        fullDescription: fetchedCourseData.fullDescription || '',
        originalPrice: fetchedCourseData.originalPrice || 0,
        discountedPrice: fetchedCourseData.discountedPrice ?? null,
        categoryId: fetchedCourseData.categoryId || null, // Dùng null nếu API trả về null/0
        levelId: fetchedCourseData.levelId || null,
        language: fetchedCourseData.language || 'vi',
        requirements: fetchedCourseData.requirements || null,
        learningOutcomes: fetchedCourseData.learningOutcomes || null,
      });
      setThumbnailPreview(fetchedCourseData.thumbnailUrl || null);
      setPromoVideoUrl(fetchedCourseData.introVideoUrl || '');
      setThumbnail(null); // Reset file thumbnail mới
      setIsInitializing(false);
      setSaveStatus('idle');
    } else if (courseSlug && !isLoadingCourse && courseError) {
      setIsInitializing(false);
      toast({
        title: 'Error Loading Course',
        description: (courseError as Error).message,
        variant: 'destructive',
      });
    }
  }, [
    fetchedCourseData,
    form,
    courseSlug,
    isLoadingCourse,
    courseError,
    toast,
  ]);

  // --- Mutation Hooks ---
  const { mutateAsync: updateCourseMutateAsync, isPending: isUpdatingCourse } =
    useUpdateCourse();
  const {
    mutateAsync: updateCourseThumbnailMutateAsync,
    isPending: isUploadingThumb,
  } = useUpdateCourseThumbnail();

  const {
    mutateAsync: deleteSectionMutateAsync,
    isPending: isDeletingSection,
  } = useDeleteSection();
  const { mutateAsync: deleteLessonMutateAsync, isPending: isDeletingLesson } =
    useDeleteLesson();
  const { mutateAsync: submitCourseMutateAsync, isPending: isSubmitting } =
    useSubmitCourseForApproval();
  const { mutateAsync: deleteCourseMutateAsync, isPending: isDeletingCourse } =
    useDeleteCourse();
  const { data: languagesData, isLoading: isLoadingLanguages } = useLanguages();
  // *** Thêm hook reorder nếu cần ***
  // const { mutateAsync: reorderSectionsMutateAsync, isPending: isReorderingSections } = useUpdateSectionsOrder();
  // const { mutateAsync: reorderLessonsMutateAsync, isPending: isReorderingLessons } = useUpdateLessonsOrder();

  // Combine processing states
  // Combine processing states
  const isProcessing =
    isLoadingCourse ||
    isInitializing ||
    isUpdatingCourse ||
    isUploadingThumb ||
    isDeletingSection ||
    isDeletingLesson ||
    isSubmitting ||
    isDeletingCourse;

  /* || isReorderingSections || isReorderingLessons */

  // Slug generation
  const generateSlug = useCallback((title: string): string => {
    if (!title) return '';
    return (
      title
        .toLowerCase()
        // Bỏ dấu tiếng Việt
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd') // Thay chữ đ
        // Xóa ký tự đặc biệt trừ dấu gạch ngang
        .replace(/[^\w\s-]/g, '')
        // Thay khoảng trắng bằng gạch ngang
        .replace(/\s+/g, '-')
        // Xóa các dấu gạch ngang liền kề
        .replace(/-+/g, '-')
        // Xóa gạch ngang đầu/cuối
        .replace(/^-+|-+$/g, '')
        .trim()
    );
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('courseName', title);
    form.setValue('slug', generateSlug(title));
  };

  // Thumbnail change handler
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // TODO: Validate file size/type again on client-side if needed
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
      toast({ title: 'Thumbnail Selected', description: file.name });
    } else {
      setThumbnail(null);
      setThumbnailPreview(null);
    }
  };
  const handleOpenAddSectionDialog = () => {
    setEditingSection(null);
    setSectionDialogOpen(true);
  };
  const handleOpenEditSectionDialog = (section: Section) => {
    setEditingSection(section);
    setSectionDialogOpen(true);
  };
  // Hàm này sẽ mở dialog xác nhận, không gọi API trực tiếp
  const handleDeleteSectionRequest = (sectionId: number | string) => {
    const section = fetchedCourseData?.sections?.find(
      (s) => s.sectionId === sectionId
    );
    if (!section) return;
    setDeleteDialogState({
      isOpen: true,
      type: 'section',
      itemId: sectionId,
      onConfirm: async () => {
        // Logic xóa thực sự nằm ở đây
        try {
          setDeleteDialogState((prev) => ({ ...prev, isDeleting: true })); // Bắt đầu loading
          await deleteSectionMutateAsync({
            courseId: Number(fetchedCourseData?.courseId),
            sectionId: Number(sectionId),
          });
          toast({
            title: 'Success',
            description: 'Section deleted successfully.',
          });
          // Invalidate để load lại curriculum
          queryClient.invalidateQueries({
            queryKey: courseKeys.detailById(
              Number(fetchedCourseData?.courseId)
            ),
          });
          queryClient.invalidateQueries({
            queryKey: courseKeys.detailBySlug(courseSlug),
          });
        } catch (error: any) {
          toast({
            title: 'Error',
            description: `Failed to delete section: ${error.message}`,
            variant: 'destructive',
          });
        } finally {
          setDeleteDialogState({
            isOpen: false,
            type: null,
            itemId: null,
            onConfirm: () => {},
          }); // Đóng dialog
        }
      },
      itemName: `section "${section.sectionName}" and all its lessons`,
    });
  };

  const handleOpenAddLessonDialog = (sectionId: number | string) => {
    setCurrentSectionIdForLesson(sectionId);
    setEditingLesson(null);
    setLessonDialogOpen(true);
  };
  const handleOpenEditLessonDialog = (
    sectionId: number | string,
    lesson: Lesson
  ) => {
    // Tạo bản sao nông khi mở edit
    setEditingLesson({ ...lesson });
    setCurrentSectionIdForLesson(sectionId);
    setLessonDialogOpen(true);
  };
  // Hàm này sẽ mở dialog xác nhận
  const handleDeleteLessonRequest = (
    sectionId: number | string,
    lessonId: number | string
  ) => {
    const section = fetchedCourseData?.sections?.find(
      (s) => s.sectionId === sectionId
    );
    const lesson = section?.lessons.find(
      (l) => l.lessonId === lessonId || l.tempId === lessonId
    );
    if (!lesson) return;
    setDeleteDialogState({
      isOpen: true,
      type: 'lesson',
      itemId: lessonId,
      sectionIdForLesson: sectionId, // Lưu lại để biết invalidate đúng
      onConfirm: async () => {
        try {
          setDeleteDialogState((prev) => ({ ...prev, isDeleting: true }));
          await deleteLessonMutateAsync({
            lessonId: Number(lessonId),
            courseId: Number(fetchedCourseData?.courseId),
          });
          toast({
            title: 'Success',
            description: 'Lesson deleted successfully.',
          });
          // Invalidate để load lại curriculum
          queryClient.invalidateQueries({
            queryKey: courseKeys.detailById(
              Number(fetchedCourseData?.courseId)
            ),
          });
          queryClient.invalidateQueries({
            queryKey: courseKeys.detailBySlug(courseSlug),
          });
        } catch (error: any) {
          toast({
            title: 'Error',
            description: `Failed to delete lesson: ${error.message}`,
            variant: 'destructive',
          });
        } finally {
          setDeleteDialogState({
            isOpen: false,
            type: null,
            itemId: null,
            onConfirm: () => {},
          });
        }
      },
      itemName: `lesson "${lesson.lessonName}"`,
    });
  };

  // --- Main Save Changes Handler ---
  const handleSaveChanges = async (formData: CourseFormData) => {
    if (!fetchedCourseData) return;
    const courseId = Number(fetchedCourseData.courseId);
    setSaveStatus('saving');
    let hasError = false;

    try {
      // 1. Update Course Info (nếu form dirty)
      if (form.formState.isDirty) {
        console.log('[Save] Updating course info...');
        const courseUpdatePayload: UpdateCourseData = {
          courseName: formData.courseName,
          slug: formData.slug,
          shortDescription: formData.shortDescription,
          fullDescription: formData.fullDescription,
          originalPrice: formData.originalPrice,
          discountedPrice: formData.discountedPrice,
          categoryId: formData.categoryId,
          levelId: formData.levelId,
          language: formData.language,
          requirements: formData.requirements,
          learningOutcomes: formData.learningOutcomes,
          introVideoUrl: promoVideoUrl || null,
        };
        await updateCourseMutateAsync(
          { courseId, data: courseUpdatePayload },
          {
            onSuccess: (data) => {
              toast({
                title: 'Success',
                description: 'Course information updated successfully.',
              });
              navigate(`/instructor/courses/${data.slug}/edit`); // Chuyển hướng về trang chi tiết khóa học
            },
            onError: (error: any) => {
              toast({
                title: 'Error',
                description: `Failed to update course information: ${error.message}`,
                variant: 'destructive',
              });
              throw error; // Rethrow to handle in the outer try-catch
            },
          }
        );
        console.log('[Save] Course info updated.');
      }

      // 2. Update Thumbnail (nếu có file mới)
      if (thumbnail) {
        console.log('[Save] Updating thumbnail...');
        await updateCourseThumbnailMutateAsync({ courseId, file: thumbnail });
        console.log('[Save] Thumbnail updated.');
        setThumbnail(null); // Reset file state
      }

      // 3. Curriculum đã được lưu tự động thông qua các dialog và API CRUD lẻ
      // Không cần gọi API sync ở đây nữa.

      setSaveStatus('saved');
      toast({
        title: 'Changes Saved',
        description: 'Course details updated successfully.',
      });
      form.reset({}, { keepValues: true }); // Reset dirty state
      // Refetch lại để đảm bảo dữ liệu form và initialRef đồng bộ
      await refetchCourse();
    } catch (error: any) {
      console.error('Error saving changes:', error);
      setSaveStatus('error');
      hasError = true;
      toast({
        title: 'Save Failed',
        description: error.message || 'Could not save changes.',
        variant: 'destructive',
      });
    } finally {
      // setLoading(false); // Không cần state loading riêng nữa nếu dùng isProcessing
      if (!hasError) {
        setTimeout(() => setSaveStatus('idle'), 2000); // Giữ trạng thái 'saved' 2 giây
      } else {
        setSaveStatus('idle'); // Reset về idle nếu có lỗi
      }
    }
  };

  // --- Discard Changes Handler ---
  const handleDiscardChanges = () => {
    // Check if there are unsaved changes in the form or thumbnail
    const isDataDirty = form.formState.isDirty || !!thumbnail;

    // Deep compare current sections with initial sections (more reliable)
    const sectionsFromFetch = initialCourseDataRef.current?.sections || [];
    const currentSections = fetchedCourseData?.sections || []; // Lấy sections hiện tại từ query data
    const curriculumIsDirty = !_.isEqual(currentSections, sectionsFromFetch);

    if (isDataDirty || curriculumIsDirty) {
      if (window.confirm('Discard all unsaved changes?')) {
        setIsInitializing(true); // Show loader while resetting
        refetchCourse().finally(() => setIsInitializing(false)); // Refetch data to reset everything
      }
    } else {
      toast({ title: 'No Changes', description: 'No changes to discard.' });
    }
  };
  const handleSubmitRequest = () => {
    if (
      !fetchedCourseData ||
      fetchedCourseData.statusId !== CourseStatusId.DRAFT
    )
      return;
    setSubmitConfirmDialogState({
      isOpen: true,
      courseId: fetchedCourseData?.courseId || null,
      courseName: fetchedCourseData?.courseName || null,
      isProcessing: false,
    });
  };

  const confirmSubmit = async () => {
    const courseId = submitConfirmDialogState.courseId;
    if (!courseId) return;
    setSubmitConfirmDialogState((prev) => ({ ...prev, isProcessing: true })); // Thêm cờ loading nếu cần

    try {
      // Có thể thêm data như ghi chú nếu API hỗ trợ
      // const submitData: SubmitCourseData = { notes: "Ready for review" };
      await submitCourseMutateAsync({ courseId /*, data: submitData */ });
      toast({ title: 'Submitted', description: 'Course sent for approval.' });
      refetchCourse(); // Load lại data để cập nhật status
      setSubmitConfirmDialogState({
        isOpen: false,
        courseId: fetchedCourseData?.courseId || null,
        courseName: fetchedCourseData?.courseName || null,
        isProcessing: false,
      });
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Could not submit course.',
        variant: 'destructive',
      });
      setSubmitConfirmDialogState((prev) => ({ ...prev, isProcessing: false })); // Tắt loading nếu lỗi
    }
  };

  // --- ** Delete Course Handler ** ---
  const handleDeleteRequest = () => {
    if (
      !fetchedCourseData ||
      (fetchedCourseData.statusId !== CourseStatusId.DRAFT &&
        fetchedCourseData.statusId !== CourseStatusId.REJECTED)
    )
      setDeleteCourseDialogState({
        isOpen: true,
        courseId: fetchedCourseData?.courseId || null,
        courseName: fetchedCourseData?.courseName || null,
        isProcessing: false,
      });
    return;
  };

  const confirmDelete = async () => {
    const courseId = deleteCourseDialogState.courseId;
    if (!courseId) return;
    setDeleteCourseDialogState((prev) => ({ ...prev, isProcessing: true }));

    try {
      await deleteCourseMutateAsync(courseId);
      toast({
        title: 'Course Deleted',
        description: `Course "${deleteCourseDialogState.courseName}" has been deleted.`,
      });
      setDeleteCourseDialogState({
        isOpen: false,
        courseId: fetchedCourseData?.courseId || null,
        courseName: fetchedCourseData?.courseName || null,
        isProcessing: false,
      });
      navigate('/instructor/courses'); // Chuyển hướng về trang danh sách
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Could not delete course.',
        variant: 'destructive',
      });
      setDeleteCourseDialogState((prev) => ({ ...prev, isProcessing: false })); // Tắt loading nếu lỗi
    } finally {
      // Đóng dialog ngay cả khi lỗi? Hoặc chỉ khi thành công?
      // setDeleteCourseDialogState({ isOpen: false, courseId: null, courseName: null });
    }
  };
  // --- Render Logic ---
  if (
    isLoadingCourse ||
    isInitializing ||
    isLoadingCategories ||
    isLoadingLevels
  ) {
    return (
      <InstructorLayout>
        <FullScreenLoader />
      </InstructorLayout>
    );
  }
  if (courseError) {
    return (
      <InstructorLayout>
        <div className="container mx-auto px-4 py-8 text-destructive text-center">
          Error loading course data: {(courseError as Error).message}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchCourse()}
            className="ml-4"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </InstructorLayout>
    );
  }
  if (!fetchedCourseData) {
    return (
      <InstructorLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          Course not found or you do not have permission to edit it.
        </div>
      </InstructorLayout>
    );
  }
  const courseId = Number(fetchedCourseData.courseId);
  const currentStatus = fetchedCourseData.statusId as CourseStatusId;
  const canEdit =
    currentStatus === CourseStatusId.DRAFT ||
    currentStatus === CourseStatusId.REJECTED ||
    currentStatus === CourseStatusId.PUBLISHED; // Cho phép sửa cả Published
  const canDelete =
    currentStatus === CourseStatusId.DRAFT ||
    currentStatus === CourseStatusId.REJECTED;
  const canSubmit = currentStatus === CourseStatusId.DRAFT; // Chỉ gửi duyệt từ Draft
  // const canArchive = currentStatus === CourseStatusId.PUBLISHED; // Điều kiện để Archive
  // Xác định có thay đổi chưa lưu
  // Cần so sánh sâu curriculum nếu muốn chính xác hơn
  const isDirty =
    form.formState.isDirty ||
    !!thumbnail ||
    !_.isEqual(
      fetchedCourseData?.sections || [],
      initialCourseDataRef.current?.sections || []
    );

  if (courseError) {
    return (
      <InstructorLayout>
        <div className="container mx-auto px-4 py-8 text-destructive text-center">
          Error loading course data: {(courseError as Error).message}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchCourse()}
            className="ml-4"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </InstructorLayout>
    );
  }

  if (!fetchedCourseData) {
    // Đã hết loading nhưng không có data
    return (
      <InstructorLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          Course not found or you do not have permission to edit it.
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="container mx-auto px-4 py-8">
        <Form {...form}>
          {/* onSubmit được đặt ở đây để bao gồm cả các nút header */}
          <form
            onSubmit={form.handleSubmit(handleSaveChanges)}
            className="space-y-6"
          >
            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
              {/* Title và Status */}
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold tracking-tight line-clamp-1"
                  title={form.watch('courseName')}
                >
                  Edit Course:{' '}
                  <span className="text-muted-foreground">
                    {form.watch('courseName') || '...'}
                  </span>
                </h1>
                <Badge
                  variant={
                    currentStatus === CourseStatusId.PUBLISHED
                      ? 'success'
                      : currentStatus === CourseStatusId.PENDING
                      ? 'outline'
                      : currentStatus === CourseStatusId.REJECTED
                      ? 'destructive'
                      : currentStatus === CourseStatusId.ARCHIVED
                      ? 'secondary'
                      : 'default' // Draft
                  }
                  className="mt-1"
                >
                  {currentStatus}
                </Badge>
                {/* Thông báo nếu đang Pending */}
                {currentStatus === CourseStatusId.PENDING && (
                  <p className="text-xs text-yellow-600 mt-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Course is pending
                    review. Editing is disabled.
                  </p>
                )}
                {/* Thông báo nếu Rejected */}
                {currentStatus === CourseStatusId.REJECTED && (
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Course was
                    rejected. Please revise and resubmit.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDiscardChanges}
                  disabled={isProcessing || !isDirty}
                >
                  {' '}
                  <ListRestart className="mr-2 h-4 w-4" /> Discard{' '}
                </Button>
                <Button
                  type="submit"
                  variant={saveStatus === 'saved' ? 'secondary' : 'default'}
                  disabled={
                    isProcessing ||
                    saveStatus === 'saving' ||
                    !isDirty ||
                    !canEdit
                  }
                  size="sm"
                >
                  {/* ... Icon và Text nút Save Changes ... */}
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : saveStatus === 'saved' ? (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isProcessing
                    ? 'Saving...'
                    : saveStatus === 'saved'
                    ? 'Saved'
                    : 'Save Changes'}
                </Button>
                {/* --- Nút Submit for Approval --- */}
                {canSubmit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSubmitRequest}
                    disabled={isProcessing || isSubmitting || isDirty}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Submit for Approval
                  </Button>
                )}
                {/* --- Nút Delete Course --- */}
                {canDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteRequest}
                    disabled={isProcessing || isDeletingCourse}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Course
                  </Button>
                )}
                {/* --- Nút Archive (Tương lai) --- */}
                {/* {canArchive && (
                       <Button type="button" variant="outline" size="sm" onClick={handleArchiveRequest} disabled={isProcessing}>
                          <Archive className="mr-2 h-4 w-4" /> Archive Course
                       </Button>
                  )} */}
              </div>
            </div>

            {/* --- Tabs --- */}
            {/* Vô hiệu hóa nội dung Tabs nếu không thể edit */}
            <fieldset disabled={!canEdit} className="disabled:opacity-70">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                  <TabsTrigger value="basic">1. Basic</TabsTrigger>
                  <TabsTrigger value="details">2. Details</TabsTrigger>
                  <TabsTrigger value="media">3. Media</TabsTrigger>
                  <TabsTrigger value="curriculum">4. Curriculum</TabsTrigger>
                  <TabsTrigger value="pricing">5. Pricing</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                  <TabsContent value="basic">
                    <BasicInfoTab
                      form={form}
                      mockCategories={categoriesData?.categories || []}
                      mockLevels={levelsData?.levels || []}
                      mockLanguages={languagesData.languages}
                      handleTitleChange={handleTitleChange}
                    />
                  </TabsContent>
                  <TabsContent value="details">
                    <DetailsTab form={form} />
                  </TabsContent>
                  <TabsContent value="media">
                    <MediaTab
                      thumbnail={thumbnail}
                      thumbnailPreview={thumbnailPreview}
                      promoVideoUrl={promoVideoUrl}
                      setPromoVideoUrl={setPromoVideoUrl}
                      handleThumbnailChange={handleThumbnailChange}
                      setThumbnail={setThumbnail}
                      setThumbnailPreview={setThumbnailPreview}
                      promoVideo={null}
                      promoVideoPreview={null}
                      setPromoVideo={() => {}}
                      setPromoVideoPreview={() => {}}
                    />
                  </TabsContent>
                  <TabsContent value="curriculum">
                    <CurriculumTab
                      courseId={Number(fetchedCourseData.courseId)}
                      sections={fetchedCourseData.sections || []} // Luôn lấy từ data fetch mới nhất
                      handleAddSection={handleOpenAddSectionDialog}
                      handleEditSection={handleOpenEditSectionDialog}
                      handleDeleteSection={handleDeleteSectionRequest}
                      handleAddLesson={handleOpenAddLessonDialog}
                      handleEditLesson={handleOpenEditLessonDialog}
                      handleDeleteLesson={handleDeleteLessonRequest}
                      // onReorderSections={handleReorderSections}
                      // onReorderLessons={handleReorderLessons}
                    />
                  </TabsContent>
                  <TabsContent value="pricing">
                    <PricingTab form={form} />
                  </TabsContent>
                </div>
              </Tabs>
            </fieldset>
          </form>
        </Form>

        {/* --- Dialogs --- */}
        {/* Section Dialog */}
        <SectionDialog
          open={sectionDialogOpen}
          onClose={() => {
            setSectionDialogOpen(false);
            setEditingSection(null);
          }}
          initialData={editingSection}
          isEditing={!!editingSection}
          courseId={courseId}
        />
        {/* Lesson Dialog */}
        {lessonDialogOpen && currentSectionIdForLesson && (
          <LessonDialog
            open={lessonDialogOpen}
            onClose={() => {
              setLessonDialogOpen(false);
              setEditingLesson(null);
              setCurrentSectionIdForLesson(null);
            }}
            initialData={editingLesson}
            isEditing={!!editingLesson}
            sectionId={currentSectionIdForLesson}
            courseId={courseId}
            lessonVideoRef={lessonVideoRef}
            attachmentRef={attachmentRef}
          />
        )}
        {/* Delete Course Dialog */}
        <ConfirmationDialog
          open={deleteCourseDialogState.isOpen}
          onOpenChange={(open) => {
            if (!open && !deleteCourseDialogState.isProcessing)
              setDeleteCourseDialogState({
                isOpen: false,
                courseId: null,
                courseName: null,
                isProcessing: false,
              });
          }} // Chỉ đóng nếu không đang xử lý
          onConfirm={confirmDelete}
          itemName={`course "${deleteCourseDialogState.courseName}"`}
          title="Delete Course?"
          description="This action is irreversible and will permanently delete the course and all associated data."
          confirmText="Delete"
          confirmVariant="destructive"
          isConfirming={deleteCourseDialogState.isProcessing} // Truyền trạng thái loading
        />
        {/* Submit Confirmation Dialog */}
        <ConfirmationDialog
          open={submitConfirmDialogState.isOpen}
          onOpenChange={(open) => {
            if (!open && !submitConfirmDialogState.isProcessing)
              setSubmitConfirmDialogState({
                isOpen: false,
                courseId: null,
                courseName: null,
                isProcessing: false,
              });
          }}
          onConfirm={confirmSubmit}
          itemName={`course "${submitConfirmDialogState.courseName}" for approval`}
          title="Submit for Approval?"
          description="Ensure your course is complete and meets quality standards. You won't be able to edit it during the review process."
          confirmText="Submit"
          confirmVariant="default" // Hoặc "primary" nếu bạn có
          isConfirming={submitConfirmDialogState.isProcessing} // Truyền trạng thái loading
        />

        {/* Loading Overlay */}
        {(isProcessing || isInitializing) && <FullScreenLoader />}
      </div>
    </InstructorLayout>
  );
};

export default CourseEdit;
