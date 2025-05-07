/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/instructor/CourseCreation.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
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

import QuizQuestionDialog from '@/components/instructor/courseCreate/QuizQuestionDialog'; // Import nếu LessonDialog không quản lý

// Import Hooks và Types
import {
  useCourseCurriculum,
  Section,
  Lesson,
  Attachment,
  QuizQuestion,
  Subtitle,
  LessonType,
} from '@/hooks/useCourseCurriculum'; // Hook quản lý state curriculum
import { useCategories } from '@/hooks/queries/category.queries';
import { useLevels } from '@/hooks/queries/level.queries';
import {
  useCreateCourse,
  useDeleteCourse,
  useUpdateCourseThumbnail,
  useUpdateCourseIntroVideo, // Sử dụng hook này nếu cho phép upload promo video
} from '@/hooks/queries/course.queries';
import { useCreateSection } from '@/hooks/queries/section.queries'; // Chỉ cần create
import {
  useCreateLesson,
  useUpdateLessonVideo,
  useAddLessonAttachment,
  useCreateQuizQuestion,
  // Các hook update/delete question/attachment sẽ dùng trong dialog con nếu cần gọi API trực tiếp
} from '@/hooks/queries/lesson.queries';
import { useAddSubtitleByUrl } from '@/hooks/queries/subtitle.queries'; // Chỉ cần add bằng URL ở đây
import { AddSubtitleData } from '@/services/subtitle.service';
import {
  CreateLessonData,
  CreateQuestionData,
} from '@/services/lesson.service';
import { CheckCircle, Save } from 'lucide-react';
import { generateTempId } from '@/components/common/generateTempId';
import LessonDialog from '@/components/instructor/courseCreate/LessonDialog';
import DeleteConfirmationDialog from '@/components/instructor/courseCreate/DeleteConfirmationDialog';

// Zod schema cho form chính (Basic Info, Details, Pricing)
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

// Mock data (nên thay bằng API fetch nếu cần)
const mockLanguages = [
  { id: 1, name: 'vi' },
  { id: 2, name: 'en' },
];

const CourseCreation: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [isLoading, setIsLoading] = useState(false);

  // State for Media Tab
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [promoVideoUrl, setPromoVideoUrl] = useState<string>(''); // Chỉ dùng URL cho promo

  // State for Curriculum managed by custom hook
  const {
    sections,
    addSection,
    updateSection,
    deleteSection,
    addLesson,
    updateLesson,
    deleteLesson,
    // reorderSections,
    // reorderLessons,
    // setCurriculum, // Sẽ dùng cho Edit mode
  } = useCourseCurriculum();

  // State for managing dialogs and editing data
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [quizQuestionDialogOpen, setQuizQuestionDialogOpen] = useState(false); // Vẫn cần để mở dialog quiz từ lesson dialog
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [currentSectionIdForLesson, setCurrentSectionIdForLesson] = useState<
    number | string | null
  >(null);
  const [editingQuizQuestion, setEditingQuizQuestion] =
    useState<QuizQuestion | null>(null); // State để truyền vào QuizQuestionDialog

  // Refs for file inputs
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const lessonVideoRef = useRef<HTMLInputElement>(null);
  const attachmentRef = useRef<HTMLInputElement>(null);
  // State mới cho dialog xác nhận xóa
  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    type: 'section' | 'lesson' | null;
    itemId: number | string | null;
    sectionIdForLesson?: number | string | null; // Cần cho xóa lesson
    onConfirm: () => void;
    itemName?: string;
  }>({
    isOpen: false,
    type: null,
    itemId: null,
    onConfirm: () => {},
    itemName: '',
  });
  // Fetch static data
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const { data: levelsData, isLoading: isLoadingLevels } = useLevels();

  // Mutation hooks
  const { mutateAsync: createCourseMutateAsync } = useCreateCourse();
  const { mutateAsync: createSectionMutateAsync } = useCreateSection();
  const { mutateAsync: createLessonMutateAsync } = useCreateLesson();
  const { mutateAsync: updateLessonVideoMutateAsync } = useUpdateLessonVideo();
  const { mutateAsync: createQuizQuestionMutateAsync } =
    useCreateQuizQuestion();
  const { mutateAsync: addLessonAttachmentMutateAsync } =
    useAddLessonAttachment();
  const { mutateAsync: addSubtitleByUrlMutateAsync } = useAddSubtitleByUrl();
  const { mutateAsync: updateCourseThumbnailMutateAsync } =
    useUpdateCourseThumbnail();
  const { mutateAsync: updateCourseIntroVideoMutateAsync } =
    useUpdateCourseIntroVideo(); // Hook này có thể không cần nếu chỉ dùng URL
  const { mutateAsync: deleteCourseMutateAsync } = useDeleteCourse();

  // React Hook Form setup
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      courseName: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      originalPrice: 0,
      discountedPrice: null,
      categoryId: 0,
      levelId: 0,
      language: 'vi',
      requirements: null,
      learningOutcomes: null,
    } as CourseFormData,
  });

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

  // --- Dialog Handling Logic ---

  // Section Dialog
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
        editingSection.tempId || editingSection.id!,
        data.sectionName,
        data.description
      );
    } else {
      addSection(data.sectionName, data.description ?? undefined); // Truyền undefined nếu null/empty
    }
    setSectionDialogOpen(false);
  };

  // Lesson Dialog
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
  // const handleDeleteLessonCallback = (
  //   sectionId: number | string,
  //   lessonId: number | string
  // ) => {
  //   if (
  //     window.confirm(
  //       'Are you sure you want to delete this lesson and all its content?'
  //     )
  //   ) {
  //     deleteLesson(sectionId, lessonId); // Gọi callback từ hook
  //   }
  // };

  // --- MAIN SUBMIT LOGIC ---
  const onSubmit = async (formData: CourseFormData) => {
    let createdCourseId: number | null = null;
    setSaveStatus('saving');
    setIsLoading(true);

    try {
      // --- Step 1: Create Draft Course ---
      console.log('Step 1: Creating draft course...');
      const coursePayload = {
        courseName: formData.courseName,
        slug: form.getValues('slug'), // Lấy slug đã tạo
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        originalPrice: formData.originalPrice || 0,
        discountedPrice: formData.discountedPrice
          ? formData.discountedPrice
          : null,
        categoryId: formData.categoryId,
        levelId: formData.levelId,
        language: formData.language,
        requirements: formData.requirements || null,
        learningOutcomes: formData.learningOutcomes || null,
        thumbnailUrl: null, // Sẽ cập nhật sau khi upload
        introVideoUrl: promoVideoUrl || null, // Dùng URL từ state
      };
      const courseResponse = await createCourseMutateAsync(coursePayload);
      console.log('courseResponse:', courseResponse);
      createdCourseId = Number(courseResponse.courseId);
      console.log(`Step 1 Success: Course created with ID: ${createdCourseId}`);

      // --- Step 2: Update Thumbnail (if exists) ---
      if (thumbnail && createdCourseId) {
        console.log('Step 2: Uploading thumbnail...');
        try {
          await updateCourseThumbnailMutateAsync({
            courseId: createdCourseId,
            file: thumbnail,
          });
          console.log('Step 2 Success: Thumbnail uploaded.');
        } catch (thumbError: any) {
          console.error('Warning: Thumbnail upload failed:', thumbError);
          toast({
            title: 'Warning: Thumbnail Upload Failed',
            description: thumbError.message || 'Could not upload thumbnail.',
            variant: 'destructive',
            duration: 7000,
          });
        }
      }
      // Note: Intro video URL được gửi khi tạo course, không cần update riêng nếu chỉ dùng URL

      // --- Step 3: Create Curriculum (Sections, Lessons, etc.) ---
      console.log('Step 3: Creating curriculum...');
      if (!createdCourseId) throw new Error('Course ID is missing.');

      for (const [sectionIndex, section] of sections.entries()) {
        console.log(
          `  Creating section ${sectionIndex + 1}: "${section.sectionName}"`
        );
        const sectionPayload = {
          sectionName: section.sectionName,
          description: section.description || null,
          sectionOrder: sectionIndex, // Truyền order từ state frontend
        };
        const sectionResponse = await createSectionMutateAsync({
          courseId: createdCourseId,
          data: sectionPayload,
        });
        console.log('sectionResponse:', sectionResponse);
        const createdSectionId = Number(sectionResponse.sectionId);
        console.log(
          `    Section ${sectionIndex + 1} created with ID: ${createdSectionId}`
        );

        for (const [lessonIndex, lesson] of section.lessons.entries()) {
          const currentLessonOrder = lessonIndex; // Dùng index làm order
          console.log(
            `      Creating lesson ${currentLessonOrder + 1}: "${
              lesson.lessonName
            }"`
          );
          const lessonPayload: CreateLessonData = {
            lessonName: lesson.lessonName,
            lessonType: lesson.lessonType,
            isFreePreview: lesson.isFreePreview || false,
            description: lesson.description || null,
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
          };

          const lessonResponse = await createLessonMutateAsync({
            courseId: createdCourseId,
            sectionId: createdSectionId,
            data: lessonPayload,
          });
          const createdLessonId = Number(lessonResponse.lessonId);
          console.log(
            `        Lesson ${
              currentLessonOrder + 1
            } created with ID: ${createdLessonId}`
          );

          // Upload Lesson Video (Cloudinary)
          if (
            lesson.lessonType === 'VIDEO' &&
            lesson.videoSourceType === 'CLOUDINARY' &&
            lesson.lessonVideo
          ) {
            console.log(
              `        Uploading video for lesson ${createdLessonId}...`
            );
            try {
              await updateLessonVideoMutateAsync({
                lessonId: createdLessonId,
                file: lesson.lessonVideo,
              });
              console.log(
                `          Video uploaded for lesson ${createdLessonId}.`
              );
            } catch (lessonVideoError: any) {
              console.error(
                `Warning: Failed to upload video for lesson ${createdLessonId}:`,
                lessonVideoError
              );
              toast({
                title: `Warning: Video Upload Failed (Lesson: ${lesson.lessonName})`,
                description: lessonVideoError.message,
                variant: 'destructive',
                duration: 7000,
              });
            }
          }

          // Create Quiz Questions
          if (
            lesson.lessonType === 'QUIZ' &&
            lesson.questions &&
            lesson.questions.length > 0
          ) {
            for (const [qIndex, question] of lesson.questions.entries()) {
              const currentQuestionOrder = qIndex;
              console.log(
                `        Creating question ${
                  currentQuestionOrder + 1
                } for lesson ${createdLessonId}`
              );
              const questionPayload: CreateQuestionData = {
                questionText: question.questionText,
                explanation: question.explanation || null,
                questionOrder: currentQuestionOrder, // Truyền order
                options: question.options.map((opt, oIndex) => ({
                  optionText: opt.optionText,
                  isCorrectAnswer: opt.isCorrectAnswer,
                  optionOrder: oIndex, // Truyền order
                })),
              };
              await createQuizQuestionMutateAsync({
                lessonId: createdLessonId,
                data: questionPayload,
              });
              console.log(
                `          Question ${
                  currentQuestionOrder + 1
                } created for lesson ${createdLessonId}.`
              );
            }
          }

          // Upload Attachments
          if (lesson.attachments && lesson.attachments.length > 0) {
            for (const attachment of lesson.attachments) {
              console.log(
                `        Uploading attachment: "${attachment.fileName}" for lesson ${createdLessonId}`
              );
              try {
                await addLessonAttachmentMutateAsync({
                  lessonId: createdLessonId,
                  file: attachment.file,
                });
                console.log(
                  `          Attachment uploaded for lesson ${createdLessonId}.`
                );
              } catch (attachError: any) {
                console.error(
                  `Warning: Failed to upload attachment "${attachment.fileName}" for lesson ${createdLessonId}:`,
                  attachError
                );
                toast({
                  title: `Warning: Attachment Upload Failed`,
                  description: attachError.message,
                  variant: 'destructive',
                  duration: 7000,
                });
              }
            }
          }

          // Add Subtitles (by URL)
          if (lesson.subtitles && lesson.subtitles.length > 0) {
            for (const subtitle of lesson.subtitles) {
              console.log(
                `        Adding subtitle: ${subtitle.languageName} for lesson ${createdLessonId}`
              );
              const subtitlePayload: AddSubtitleData = {
                languageCode: subtitle.languageCode,
                languageName: subtitle.languageName,
                subtitleUrl: subtitle.subtitleUrl,
                isDefault: subtitle.isDefault,
              };
              try {
                await addSubtitleByUrlMutateAsync({
                  lessonId: createdLessonId,
                  data: subtitlePayload,
                });
                console.log(
                  `          Subtitle added for lesson ${createdLessonId}.`
                );
              } catch (subError: any) {
                console.error(
                  `Warning: Failed to add subtitle "${subtitle.languageName}" for lesson ${createdLessonId}:`,
                  subError
                );
                toast({
                  title: `Warning: Subtitle Add Failed`,
                  description: subError.message,
                  variant: 'destructive',
                  duration: 7000,
                });
              }
            }
          }
        } // End loop lessons
      } // End loop sections

      console.log('Step 3 Success: Curriculum created/updated.');

      // --- Final Step: Success ---
      setSaveStatus('saved');
      setIsLoading(false);
      toast({
        title: 'Course Created Successfully!',
        description:
          'Your course draft is ready. You can continue editing or submit it for review.',
        variant: 'default',
      });
      navigate('/instructor/courses');
    } catch (error: any) {
      console.error('CRITICAL ERROR during course creation:', error);
      setSaveStatus('error');
      setIsLoading(false);
      toast({
        title: 'Course Creation Failed',
        description: `A critical error occurred: ${
          error.message || 'Unknown error.'
        }. Please check the details and try again.`,
        variant: 'destructive',
        duration: 9000,
      });

      // --- Rollback Attempt ---
      if (createdCourseId) {
        console.warn(
          `Attempting to delete draft course ${createdCourseId} due to critical error.`
        );
        try {
          await deleteCourseMutateAsync(createdCourseId);
          console.log(`Draft course ${createdCourseId} deleted after error.`);
          toast({
            title: 'Rollback Successful',
            description: `The partially created course draft (ID: ${createdCourseId}) has been deleted.`,
            variant: 'default',
            duration: 7000,
          });
        } catch (rollbackError: any) {
          console.error(
            `Failed to delete draft course ${createdCourseId}:`,
            rollbackError
          );
          toast({
            title: 'Rollback Failed',
            description: `Could not delete the partially created course draft (ID: ${createdCourseId}). Please delete it manually. Error: ${rollbackError.message}`,
            variant: 'destructive',
            duration: 15000,
          });
        }
      }
    }
  };

  const handleDeleteSectionRequest = (sectionId: number | string) => {
    setDeleteDialogState({
      isOpen: true,
      type: 'section',
      itemId: sectionId,
      onConfirm: async () => {
        try {
          await deleteSection(sectionId); // Gọi hàm xóa từ hook useCourseCurriculum
          toast({
            title: 'Section deleted',
            description: 'The section and all its lessons have been deleted.',
            variant: 'default',
          });
        } catch (error) {
          console.error('Failed to delete section:', error);
          toast({
            title: 'Error',
            description: 'Failed to delete the section. Please try again.',
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
      itemName: `section and all its lessons`,
    });
  };

  const handleDeleteLessonRequest = (
    sectionIdForLesson: number | string,
    lessonId: number | string
  ) => {
    setDeleteDialogState({
      isOpen: true,
      type: 'lesson',
      itemId: lessonId,
      sectionIdForLesson: sectionIdForLesson,
      onConfirm: async () => {
        try {
          await deleteLesson(sectionIdForLesson, lessonId); // Gọi hàm xóa từ hook useCourseCurriculum
          toast({
            title: 'Lesson deleted',
            description: 'The lesson and all its content have been deleted.',
            variant: 'default',
          });
        } catch (error) {
          console.error('Failed to delete lesson:', error);
          toast({
            title: 'Error',
            description: 'Failed to delete the lesson. Please try again.',
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
      itemName: `lesson and all its content`,
    });
  };

  // --- Render ---
  if (isLoadingCategories || isLoadingLevels) {
    return <FullScreenLoader />;
  }

  return (
    <InstructorLayout>
      <div className="container mx-auto px-4 py-8">
        {' '}
        {/* Thêm container */}
        <div className="space-y-6">
          {' '}
          {/* Tăng space */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Create New Course
            </h1>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Save Draft Button */}
              <Button
                // Thêm variant success nếu có
                onClick={form.handleSubmit(onSubmit, (errors) => {
                  console.error('Form validation errors:', errors);
                  console.log('Form values:', form.getValues());
                  toast({
                    title: 'Validation Error',
                    description:
                      'Please fix the errors in the form before saving.',
                    variant: 'destructive',
                  });
                })}
                disabled={saveStatus === 'saving' || isLoading}
                size="sm" // Giảm kích thước nút
              >
                {isLoading || saveStatus === 'saving' ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Saving...
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </>
                )}
              </Button>
              {/* Submit for Approval Button (Optional) */}
              {/* <Button variant="secondary" size="sm" onClick={handleSubmitForApproval} disabled={isLoading}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Submit for Approval
                    </Button> */}
            </div>
          </div>
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
              {' '}
              {/* Thêm khoảng cách */}
              {/* Tab Contents */}
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
                  handleDeleteSection={handleDeleteSectionRequest}
                  handleAddLesson={handleOpenAddLessonDialog}
                  handleEditLesson={handleOpenEditLessonDialog}
                  handleDeleteLesson={handleDeleteLessonRequest}
                />
              </TabsContent>
              <TabsContent value="pricing">
                <PricingTab form={form} />
              </TabsContent>
            </div>
          </Tabs>
          {/* Dialogs */}
          <SectionDialog
            open={sectionDialogOpen}
            onClose={() => setSectionDialogOpen(false)}
            onSave={handleSaveSectionDialog}
            initialData={editingSection}
            isEditing={!!editingSection}
          />
          {/* LessonDialog chỉ render khi cần và có state để quản lý */}
          {lessonDialogOpen && (
            <LessonDialog
              open={lessonDialogOpen}
              onClose={() => setLessonDialogOpen(false)}
              onSave={handleSaveLessonDialog}
              initialData={editingLesson}
              isEditing={!!editingLesson}
              lessonVideoRef={lessonVideoRef}
              attachmentRef={attachmentRef}
              // Pass down state and handlers related to quiz/attachments/subtitles managed within LessonDialog now
            />
          )}
          {/* Loading Overlay */}
          {/* {isLoading && <FullScreenLoader />} */}
          <DeleteConfirmationDialog
            open={deleteDialogState.isOpen}
            onOpenChange={(open) => {
              if (!open) {
                // Nếu người dùng đóng dialog (bằng nút Cancel hoặc click ra ngoài)
                setDeleteDialogState({
                  isOpen: false,
                  type: null,
                  itemId: null,
                  onConfirm: () => {},
                });
              }
            }}
            onConfirm={deleteDialogState.onConfirm}
            itemName={deleteDialogState.itemName}
            // Bạn có thể tùy chỉnh title và description nếu muốn dựa trên deleteDialogState.type
            title={
              deleteDialogState.type === 'section'
                ? 'Delete Section?'
                : deleteDialogState.type === 'lesson'
                ? 'Delete Lesson?'
                : 'Are you sure?'
            }
            description={
              deleteDialogState.type === 'section'
                ? 'This will permanently delete the section and all lessons within it. This action cannot be undone.'
                : deleteDialogState.type === 'lesson'
                ? 'This will permanently delete the lesson and all its content (videos, quizzes, attachments). This action cannot be undone.'
                : 'This action cannot be undone. This will permanently delete the selected item.'
            }
          />
        </div>
      </div>
    </InstructorLayout>
  );
};

export default CourseCreation;
