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

// Import Hooks and Types
import {
  useCourseCurriculum,
  Section,
  Lesson,
  LessonType,
} from '@/hooks/useCourseCurriculum';
import { useCategories } from '@/hooks/queries/category.queries';
import { useLevels } from '@/hooks/queries/level.queries';
import {
  useCourseDetailBySlug,
  useUpdateCourse,
  useDeleteCourse,
  useUpdateCourseThumbnail,

  // useSubmitCourseForApproval, // Nếu cần
  useSyncCourseCurriculum, // *** Import hook sync curriculum ***
} from '@/hooks/queries/course.queries';
// Không cần import các hook create/update/delete section/lesson lẻ nữa nếu dùng sync
// import { useCreateSection, useUpdateSection, useDeleteSection } from '@/hooks/queries/section.queries';
// import { useCreateLesson, useUpdateLesson, useDeleteLesson as useDeleteLessonMutate } from '@/hooks/queries/lesson.queries';
// ... (Các import hook lẻ khác cũng có thể bỏ nếu sync xử lý hết)

import { ListRestart, RotateCcw } from 'lucide-react';
import {
  Course,
  SyncCurriculumPayload,
  UpdateCourseData,
} from '@/services/course.service';

import _ from 'lodash'; // Ensure lodash is installed and imported
import { generateTempId } from '@/components/common/generateTempId';
import LessonDialog from '@/components/instructor/courseCreate/LessonDialog';
import { Form } from '@/components/ui/form';
import { useLessonVideoUrl } from '@/hooks/queries/lesson.queries';

// Zod schema (Thêm ID)
const courseFormSchema = z
  .object({
    id: z.number().optional(),
    courseName: z.string().min(1, 'Course title is required').max(255),
    slug: z.string().optional(),
    shortDescription: z
      .string()
      .min(1, 'Short description is required')
      .max(500),
    fullDescription: z
      .string()
      .min(1, 'Full description is required')
      .max(20000),
    originalPrice: z.preprocess(
      (val) => (val === '' ? NaN : parseFloat(String(val))), // Chuyển đổi string thành number
      z
        .number({ required_error: 'Original price is required' })
        .min(0, 'Price must be non-negative')
    ),
    discountedPrice: z.preprocess(
      (val) =>
        val === '' || val === null || val === undefined
          ? null
          : parseFloat(String(val)), // Chuyển đổi string thành number hoặc null
      z.number().min(0, 'Price must be non-negative').optional().nullable()
    ),
    categoryId: z.preprocess(
      (val) => parseInt(String(val), 10), // Chuyển đổi string thành number
      z.number({ required_error: 'Category is required' }).int().positive()
    ),
    levelId: z.preprocess(
      (val) => parseInt(String(val), 10), // Chuyển đổi string thành number
      z.number({ required_error: 'Level is required' }).int().positive()
    ),
    language: z.string().min(1, 'Language is required'),
    requirements: z.string().max(4000).optional().nullable(),
    learningOutcomes: z.string().max(4000).optional().nullable(),
  })
  .refine(
    (data) =>
      data.discountedPrice === null ||
      data.discountedPrice <= data.originalPrice,
    {
      message: 'Discounted price cannot be higher than the original price.',
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

  // State for Curriculum managed by custom hook
  const {
    sections,
    addSection,
    updateSection,
    deleteSection,
    addLesson,
    updateLesson,
    deleteLesson,
    reorderSections, // Thêm
    reorderLessons, // Thêm
    setCurriculum,
  } = useCourseCurriculum();

  // State for Dialogs
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentSectionIdForLesson, setCurrentSectionIdForLesson] = useState<
    number | string | null
  >(null);

  // Refs
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const lessonVideoRef = useRef<HTMLInputElement>(null);
  const attachmentRef = useRef<HTMLInputElement>(null);
  const initialCourseDataRef = useRef<Course | null>(null); // Reference to store initial course data

  // Fetch static data
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const { data: levelsData, isLoading: isLoadingLevels } = useLevels();

  // Fetch Existing Course Data
  const {
    data: fetchedCourseData,
    isLoading: isLoadingCourse,
    error: courseError,
    refetch: refetchCourse,
  } = useCourseDetailBySlug(courseSlug, {
    enabled: !!courseSlug,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Form setup
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      id: undefined, // ID của course khi edit
      courseName: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      originalPrice: 0,
      discountedPrice: 0,
      categoryId: 0,
      levelId: 0,
      language: 'vi',
      requirements: null,
      learningOutcomes: null,
    },
  });

  // Initialize Form and Curriculum State
  useEffect(() => {
    if (fetchedCourseData) {
      initialCourseDataRef.current = JSON.parse(
        JSON.stringify(fetchedCourseData)
      ); // Store initial course data for comparison

      form.reset({
        id: Number(fetchedCourseData.courseId) || undefined,
        courseName: fetchedCourseData.courseName || '',
        slug: fetchedCourseData.slug || '',
        shortDescription: fetchedCourseData.shortDescription || '',
        fullDescription: fetchedCourseData.fullDescription || '',
        originalPrice: fetchedCourseData.originalPrice || 0,
        discountedPrice:
          fetchedCourseData.discountedPrice !== null
            ? fetchedCourseData.discountedPrice
            : null,
        categoryId: fetchedCourseData.categoryId || 0,
        levelId: fetchedCourseData.levelId || 0,
        language: fetchedCourseData.language || 'vi',
        requirements: fetchedCourseData.requirements || null,
        learningOutcomes: fetchedCourseData.learningOutcomes || null,
      });
      // *** Gọi setCurriculum để khởi tạo state từ dữ liệu fetch về ***
      setCurriculum(
        (fetchedCourseData.sections || []).map((section) => ({
          ...section,
          sectionName: section.sectionName || 'Untitled Section', // Provide a default value if necessary
          lessons: (section.lessons || []).map((lesson) => ({
            ...lesson,
            lessonName: lesson.lessonName || 'Untitled Lesson', // Provide a default value
            lessonType: (lesson.lessonType as LessonType) || 'VIDEO', // Default to "video" or another valid type
            isFreePreview: lesson.isFreePreview || false, // Default to false
          })),
        }))
      );
      setThumbnailPreview(fetchedCourseData.thumbnailUrl || null);
      setPromoVideoUrl(fetchedCourseData.introVideoUrl || '');
      setThumbnail(null);
      setIsInitializing(false);
      setSaveStatus('idle'); // Reset save status sau khi load xong
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
    setCurriculum,
    courseSlug,
    isLoadingCourse,
    courseError,
    toast,
  ]);

  const hasCurriculumChanged = !_.isEqual(
    sections.map((section) => {
      const { sectionName, tempId, ...restSection } = section; // Exclude sectionName and tempId
      return {
        ...restSection,
        lessons: section.lessons.map((lesson) => {
          const { lessonName, tempId, ...restLesson } = lesson; // Exclude lessonName and tempId
          return {
            ...restLesson,
            attachments: lesson.attachments?.map((att) => ({
              ...att,
              file: att.file || null, // Normalize file property
            })),
            questions: lesson.questions?.map((q) => {
              const { tempId, ...restQuestion } = q; // Exclude tempId
              return {
                ...restQuestion,
                options: q.options
                  .map(({ tempId, ...restOption }) => ({
                    ...restOption,
                  }))
                  .sort((a, b) => (a.optionOrder ?? 0) - (b.optionOrder ?? 0)),
              };
            }),
          };
        }),
      };
    }),
    initialCourseDataRef.current?.sections?.map((section) => ({
      ...section,
      lessons: section.lessons.map((lesson) => ({
        ...lesson,
        attachments: lesson.attachments?.map((att) => ({
          ...att,
          file: att.file || null, // Normalize file property
        })),
        questions: lesson.questions?.map((q) => ({
          ...q,
          options: q.options.sort(
            (a, b) => (a.optionOrder ?? 0) - (b.optionOrder ?? 0)
          ),
        })),
      })),
    }))
  );
  // --- Mutation Hooks ---
  const { mutateAsync: updateCourseMutateAsync, isPending: isUpdatingCourse } =
    useUpdateCourse();
  const {
    mutateAsync: updateCourseThumbnailMutateAsync,
    isPending: isUploadingThumb,
  } = useUpdateCourseThumbnail();
  const {
    mutateAsync: syncCurriculumMutateAsync,
    isPending: isSyncingCurriculum,
  } = useSyncCourseCurriculum(); // Hook sync mới
  const { mutateAsync: deleteCourseMutateAsync, isPending: isDeletingCourse } =
    useDeleteCourse(); // Vẫn cần nếu có nút xóa course
  // Hook to fetch signed URL for private lesson video

  // Bỏ các hook lẻ cho section/lesson CUD nếu dùng sync
  // const { mutateAsync: createSectionMutateAsync, isPending: isCreatingSection } = useCreateSection();
  // const { mutateAsync: updateSectionMutateAsync, isPending: isUpdatingSection } = useUpdateSection();
  // const { mutateAsync: deleteSectionMutateAsync, isPending: isDeletingSection } = useDeleteSection();
  // const { mutateAsync: createLessonMutateAsync, isPending: isCreatingLesson } = useCreateLesson();
  // const { mutateAsync: updateLessonMutateAsync, isPending: isUpdatingLesson } = useUpdateLesson();
  // const { mutateAsync: deleteLessonMutateAsync, isPending: isDeletingLesson } = useDeleteLessonMutate();
  // ... (Bỏ các hook lẻ cho quiz, attachment, subtitle CUD)

  // Combine processing states
  const isProcessing =
    isLoadingCourse ||
    isInitializing ||
    isUpdatingCourse ||
    isUploadingThumb ||
    isSyncingCurriculum ||
    isDeletingCourse; // Đơn giản hóa isProcessing

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

  // --- Dialog Handling Logic (Update state local bằng hook useCourseCurriculum) ---
  const handleOpenAddSectionDialog = () => {
    setEditingSection(null);
    setSectionDialogOpen(true);
  };
  const handleOpenEditSectionDialog = (section: Section) => {
    setEditingSection(section);
    setSectionDialogOpen(true);
  };
  const handleSaveSectionDialog = (data: {
    sectionName: string;
    description?: string | null;
  }) => {
    if (editingSection) {
      updateSection(
        editingSection.tempId || editingSection.sectionId!,
        data.sectionName,
        data.description
      );
    } else {
      addSection(data.sectionName, data.description ?? undefined);
    }
    setSectionDialogOpen(false);
    form.setValue('courseName', form.getValues('courseName'), {
      shouldDirty: true,
    }); // Mark form as dirty when curriculum changes
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
    console.log('Opening edit dialog for lesson:', lesson);
    if (lesson.lessonVideoFile) {
      console.log(
        '  Original lessonVideoFile is File:',
        lesson.lessonVideoFile instanceof File,
        lesson.lessonVideoFile?.name
      );
    }

    setCurrentSectionIdForLesson(sectionId);

    // Tạo bản sao nông cho Lesson. Các thuộc tính object/array sẽ là tham chiếu.
    const lessonCopy: Lesson = { ...lesson };

    // Nếu LessonDialog sẽ quản lý state riêng cho questions, attachments, subtitles
    // thì việc sao chép nông các mảng này là đủ, vì dialog sẽ tạo bản sao khi khởi tạo state của nó.
    // Ví dụ, trong LessonDialog:
    // const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    // useEffect(() => { if (initialData) setQuizQuestions(_.cloneDeep(initialData.questions || [])) }, [initialData]);

    // Nếu bạn muốn chắc chắn rằng `lessonCopy` hoàn toàn độc lập cho các mảng đó ngay từ đầu:
    lessonCopy.questions = (lesson.questions || []).map((q) => ({
      ...q,
      options: (q.options || []).map((o) => ({ ...o })),
    }));
    lessonCopy.attachments = (lesson.attachments || []).map((a) => ({
      ...a,
      // Giữ nguyên tham chiếu 'file' nếu nó là File object
      // file: a.file // Không cần gán lại nếu ...a đã giữ tham chiếu
    }));
    lessonCopy.subtitles = (lesson.subtitles || []).map((s) => ({ ...s }));

    console.log('Setting editingLesson with (copied):', lessonCopy);
    if (lessonCopy.lessonVideoFile) {
      console.log(
        '  Copied lessonVideoFile is File:',
        lessonCopy.lessonVideoFile instanceof File,
        lessonCopy.lessonVideoFile?.name
      );
    }

    setEditingLesson(lessonCopy);
    setLessonDialogOpen(true);
  };
  const handleSaveLessonDialog = (lessonDataFromDialog: Lesson) => {
    if (!currentSectionIdForLesson) return;
    const lessonToSave: Lesson = {
      ...lessonDataFromDialog,
      tempId:
        editingLesson?.tempId ||
        lessonDataFromDialog.tempId ||
        (editingLesson?.id ? undefined : generateTempId('lesson')),
      id: editingLesson?.id,
      lessonOrder: editingLesson?.lessonOrder, // Giữ order khi edit, hook add sẽ tự tính
      externalVideoId:
        lessonDataFromDialog.videoSourceType === 'CLOUDINARY' &&
        !lessonDataFromDialog.lessonVideoFile &&
        editingLesson?.externalVideoId
          ? editingLesson.externalVideoId
          : lessonDataFromDialog.externalVideoId,
      lessonVideoFile: lessonDataFromDialog.lessonVideoFile || null,
    };

    if (editingLesson) {
      updateLesson(currentSectionIdForLesson, lessonToSave);
    } else {
      const { id, tempId, lessonOrder, ...lessonPayload } = lessonToSave; // Bỏ các trường ko cần khi add
      addLesson(
        currentSectionIdForLesson,
        lessonPayload as Omit<Lesson, 'id' | 'tempId' | 'lessonOrder'>
      );
    }
    setLessonDialogOpen(false);
  };

  // --- Delete Callbacks (Chỉ cập nhật state local) ---
  const handleDeleteSectionCallback = useCallback(
    (sectionId: number | string) => {
      const sectionToDelete = sections.find(
        (s) => s.sectionId === sectionId || s.tempId === sectionId
      );
      if (!sectionToDelete) return;
      if (
        window.confirm(
          `Mark section "${sectionToDelete.sectionName}" and all its lessons for deletion? Changes will be saved when you click 'Save Changes'.`
        )
      ) {
        deleteSection(sectionId); // Gọi hook để xóa khỏi state local
        form.setValue('courseName', form.getValues('courseName'), {
          shouldDirty: true,
        }); // Đánh dấu có thay đổi
      }
    },
    [sections, deleteSection, form]
  );

  const handleDeleteLessonCallback = useCallback(
    (sectionId: number | string, lessonId: number | string) => {
      const section = sections.find(
        (s) => s.sectionId === sectionId || s.tempId === sectionId
      );
      const lessonToDelete = section?.lessons.find(
        (l) => l.id === lessonId || l.tempId === lessonId
      );
      if (!lessonToDelete) return;
      if (
        window.confirm(
          `Mark lesson "${lessonToDelete.lessonName}" for deletion? Changes will be saved when you click 'Save Changes'.`
        )
      ) {
        deleteLesson(sectionId, lessonId); // Gọi hook để xóa khỏi state local
        form.setValue('courseName', form.getValues('courseName'), {
          shouldDirty: true,
        }); // Đánh dấu có thay đổi
      }
    },
    [sections, deleteLesson, form]
  );
  console.log('fetchedCourseData', fetchedCourseData);

  // --- MAIN SAVE CHANGES LOGIC (Uses Sync API) ---
  const handleSaveChanges = async (formData: CourseFormData) => {
    if (!fetchedCourseData) return;
    const courseId = Number(fetchedCourseData.courseId);
    setSaveStatus('saving');
    setLoading(true);
    console.log('Saving changes for course:', courseId);

    try {
      console.log('Form Data:', formData);
      // --- Step 1: Update Basic Course Info & Promo URL ---
      const courseUpdatePayload: UpdateCourseData = {
        courseName: formData.courseName,
        slug: form.getValues('slug'),
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        originalPrice: formData.originalPrice || 0,
        discountedPrice: formData.discountedPrice
          ? formData.discountedPrice
          : null,
        categoryId: formData.categoryId,
        levelId: formData.levelId,
        language: formData.language,
        requirements: formData.requirements,
        learningOutcomes: formData.learningOutcomes,
        introVideoUrl: promoVideoUrl || null, // Cập nhật cả URL video giới thiệu
      };
      // Chỉ gọi update nếu form dirty
      if (form.formState.isDirty) {
        console.log('Step 1: Updating course info...');
        await updateCourseMutateAsync({ courseId, data: courseUpdatePayload });
        console.log('Step 1 Success.');
      } else {
        console.log('Step 1: No changes in basic info/pricing/details.');
      }

      // --- Step 2: Update Thumbnail (if changed) ---
      if (thumbnail) {
        // Chỉ upload nếu có file mới
        console.log('Step 2: Updating thumbnail...');
        await updateCourseThumbnailMutateAsync({ courseId, file: thumbnail });
        console.log('Step 2 Success.');
      } else {
        console.log('Step 2: No new thumbnail to upload.');
      }

      // --- Step 3: Sync Curriculum (Gửi toàn bộ state sections hiện tại) ---
      console.log('Step 3: Syncing curriculum...');
      // Sắp xếp lại theo order trước khi gửi
      const sortedSections = [...sections].sort(
        (a, b) => (a.sectionOrder ?? 0) - (b.sectionOrder ?? 0)
      );
      const curriculumPayload: SyncCurriculumPayload = {
        sections: sortedSections.map((section, sectionIndex) => ({
          id: section.sectionId || null,
          tempId: section.tempId || generateTempId('section'),
          sectionName: section.sectionName,
          description: section.description || null,
          sectionOrder: sectionIndex,
          lessons: (section.lessons || [])
            .sort((a, b) => (a.lessonOrder ?? 0) - (b.lessonOrder ?? 0))
            .map((lesson, lessonIndex) => ({
              id: lesson.lessonId || null,
              tempId: lesson.tempId || generateTempId('lesson'),
              lessonName: lesson.lessonName,
              description: lesson.description || null,
              lessonOrder: lessonIndex,
              lessonType: lesson.lessonType,
              isFreePreview: lesson.isFreePreview,
              videoSourceType:
                lesson.lessonType === 'VIDEO'
                  ? lesson.videoSourceType
                  : undefined,
              externalVideoInput:
                lesson.lessonType === 'VIDEO'
                  ? lesson.externalVideoInput
                  : undefined,
              textContent:
                lesson.lessonType === 'TEXT' ? lesson.textContent : undefined,
              questions:
                lesson.lessonType === 'QUIZ'
                  ? (lesson.questions || []).map((question, questionIndex) => ({
                      id: question.questionId || null,
                      tempId: question.tempId || generateTempId('question'),
                      questionText: question.questionText,
                      explanation: question.explanation || null,
                      questionOrder: questionIndex,
                      options: (question.options || [])
                        .sort(
                          (a, b) => (a.optionOrder ?? 0) - (b.optionOrder ?? 0)
                        )
                        .map((option, optionIndex) => ({
                          id: option.optionId || null,
                          optionText: option.optionText,
                          isCorrectAnswer: option.isCorrectAnswer,
                          optionOrder: optionIndex,
                        })),
                    }))
                  : undefined,
              attachments: (lesson.attachments || []).map((attachment) => ({
                id: attachment.attachmentId || null,
                fileName: attachment.fileName,
                file: attachment.file || null,
              })),
              subtitles:
                lesson.lessonType === 'VIDEO'
                  ? (lesson.subtitles || []).map((subtitle) => ({
                      id: subtitle.subtitleId || null,
                      languageCode: subtitle.languageCode,
                      languageName: subtitle.languageName,
                      subtitleUrl: subtitle.subtitleUrl,
                      isDefault: subtitle.isDefault,
                    }))
                  : undefined,
            })),
        })),
      };

      console.log('Curriculum Payload:', {
        courseId,
        payload: curriculumPayload,
      });
      await syncCurriculumMutateAsync({ courseId, payload: curriculumPayload });
      console.log('Step 3 Success.');

      // --- Final Step: Success ---
      setSaveStatus('saved');
      toast({
        title: 'Course Updated',
        description: 'All changes saved successfully.',
      });
      setThumbnail(null); // Reset file state sau khi upload thành công
      form.reset({}, { keepValues: true }); // Reset dirty state nhưng giữ lại giá trị hiện tại
      // Fetch lại dữ liệu để đảm bảo đồng bộ hoàn toàn và reset isDirty
      await refetchCourse();
    } catch (error: any) {
      console.error('CRITICAL ERROR during course update:', error);
      setSaveStatus('error');
      toast({
        title: 'Update Failed',
        description: `An error occurred: ${error.message || 'Unknown error.'}`,
        variant: 'destructive',
        duration: 9000,
      });
      // Không rollback ở frontend khi update thất bại, user cần sửa lỗi
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // --- Render ---
  if (
    isLoadingCourse ||
    isInitializing ||
    isLoadingCategories ||
    isLoadingLevels
  ) {
    // Thêm check loading categories/levels
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
        <div className="space-y-6">
          {/* --- Header --- */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSaveChanges, (errors) => {
                // Thêm hàm xử lý lỗi validation
                console.error('Form Validation Errors:', errors);
                toast({
                  title: 'Invalid Data',
                  description:
                    'Please check the highlighted fields for errors.',
                  variant: 'destructive',
                });
                // Tìm field lỗi đầu tiên và focus (hoặc chuyển tab)
                const firstErrorField = Object.keys(
                  errors
                )[0] as keyof CourseFormData;
                if (firstErrorField) {
                  form.setFocus(firstErrorField);
                  // Thêm logic chuyển tab nếu cần dựa vào firstErrorField
                }
              })}
              className="space-y-6"
            >
              {' '}
              {/* Gán onSubmit ở đây */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
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
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      fetchedCourseData.statusId === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : fetchedCourseData.statusId === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {fetchedCourseData.statusId}
                  </span>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {/* Reset Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (
                        form.formState.isDirty ||
                        thumbnail ||
                        hasCurriculumChanged
                      ) {
                        if (window.confirm('Discard all unsaved changes?')) {
                          setIsInitializing(true);
                          refetchCourse(); // Reset form and curriculum
                        }
                      } else {
                        toast({
                          title: 'No Changes',
                          description: 'No changes to discard.',
                        });
                      }
                    }}
                    disabled={
                      isProcessing ||
                      (!form.formState.isDirty &&
                        !thumbnail &&
                        _.isEqual(
                          sections,
                          initialCourseDataRef.current?.sections
                        ))
                    }
                  >
                    <ListRestart className="mr-2 h-4 w-4" /> Discard Changes
                  </Button>
                  <Button
                    type="button"
                    onClick={() => console.log(form.getValues())}
                  >
                    Log Form Values
                  </Button>
                  {/* Save Changes Button */}
                  <Button
                    type="submit"
                    variant={saveStatus === 'saved' ? 'secondary' : 'default'}
                    disabled={
                      isProcessing ||
                      saveStatus === 'saving' ||
                      (!form.formState.isDirty &&
                        !thumbnail &&
                        _.isEqual(
                          sections,
                          initialCourseDataRef.current?.sections
                        ))
                    } // Disable nếu không có thay đổi
                    size="sm"
                  >
                    {/* ... (Nội dung nút Save Changes) ... */}
                    Save Changes
                  </Button>
                </div>
              </div>
              {/* --- Tabs --- */}
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
                      mockLanguages={mockLanguages}
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
                      sections={sections}
                      handleAddSection={handleOpenAddSectionDialog}
                      handleEditSection={handleOpenEditSectionDialog}
                      handleDeleteSection={handleDeleteSectionCallback}
                      handleAddLesson={handleOpenAddLessonDialog}
                      handleEditLesson={handleOpenEditLessonDialog}
                      handleDeleteLesson={handleDeleteLessonCallback}
                    />
                  </TabsContent>
                  <TabsContent value="pricing">
                    <PricingTab form={form} />
                  </TabsContent>
                </div>
              </Tabs>
            </form>
          </Form>

          {/* --- Dialogs --- */}
          <SectionDialog
            open={sectionDialogOpen}
            onClose={() => {
              setSectionDialogOpen(false);
              setEditingSection(null);
            }}
            onSave={handleSaveSectionDialog}
            initialData={editingSection}
            isEditing={!!editingSection}
          />
          {lessonDialogOpen && (
            <LessonDialog
              open={lessonDialogOpen}
              onClose={() => {
                setLessonDialogOpen(false);
                setEditingLesson(null);
                setCurrentSectionIdForLesson(null);
              }}
              onSave={handleSaveLessonDialog}
              initialData={editingLesson}
              isEditing={!!editingLesson}
              lessonVideoRef={lessonVideoRef}
              attachmentRef={attachmentRef}
            />
          )}

          {/* Loading Overlay */}
          {(isProcessing || isInitializing || loading) && <FullScreenLoader />}
        </div>
      </div>
    </InstructorLayout>
  );
};

export default CourseEdit;
