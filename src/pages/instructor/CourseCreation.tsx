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
import LessonDialog from '@/components/instructor/courseCreate/LessonDialog';
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

// Zod schema cho form chính (Basic Info, Details, Pricing)
const courseFormSchema = z
  .object({
    courseName: z.string().min(1, 'Course title is required').max(255),
    slug: z.string().optional(), // Readonly, generated from title
    shortDescription: z
      .string()
      .min(1, 'Short description is required')
      .max(500),
    fullDescription: z
      .string()
      .min(1, 'Full description is required')
      .max(20000), // Tăng giới hạn
    originalPrice: z.preprocess(
      (val) => (val === '' ? NaN : parseFloat(String(val))), // Chuyển "" thành NaN để bắt lỗi required
      z
        .number({ required_error: 'Original price is required' })
        .min(0, 'Price must be non-negative')
    ),
    discountedPrice: z.preprocess(
      (val) =>
        val === '' || val === null || val === undefined
          ? null
          : parseFloat(String(val)), // Giữ null/undefined
      z.number().min(0, 'Price must be non-negative').optional().nullable()
    ),
    categoryId: z.preprocess(
      (val) => (val ? parseInt(String(val), 10) : undefined), // Chuyển sang number
      z.number({ required_error: 'Category is required' }).int().positive()
    ),
    levelId: z.preprocess(
      (val) => (val ? parseInt(String(val), 10) : undefined), // Chuyển sang number
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
      categoryId: undefined,
      levelId: undefined,
      language: 'vi',
      requirements: null,
      learningOutcomes: null,
    },
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
    setCurrentSectionIdForLesson(sectionId);
    setEditingLesson(lesson); // Truyền dữ liệu lesson hiện tại vào dialog
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
  const handleDeleteLessonCallback = (
    sectionId: number | string,
    lessonId: number | string
  ) => {
    if (
      window.confirm(
        'Are you sure you want to delete this lesson and all its content?'
      )
    ) {
      deleteLesson(sectionId, lessonId); // Gọi callback từ hook
    }
  };

  // --- MAIN SUBMIT LOGIC ---
  const onSubmit = async (formData: CourseFormData) => {
    let createdCourseId: number | null = null;
    setSaveStatus('saving');
    setIsLoading(true);
    console.log('Submitting Form Data:', formData);
    console.log('Submitting Curriculum State:', sections);
    console.log('Submitting Thumbnail File:', thumbnail);
    console.log('Submitting Promo Video URL:', promoVideoUrl);

    try {
      // --- Step 1: Create Draft Course ---
      console.log('Step 1: Creating draft course...');
      const coursePayload = {
        courseName: formData.courseName,
        // Lấy slug đã tạo
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        originalPrice: formData.originalPrice || 0,
        discountedPrice: formData.discountedPrice || null,
        categoryId: formData.categoryId,
        levelId: formData.levelId,
        language: formData.language,
        requirements: formData.requirements || null,
        learningOutcomes: formData.learningOutcomes || null,
        thumbnailUrl: null, // Sẽ cập nhật sau khi upload
        introVideoUrl: promoVideoUrl || null, // Dùng URL từ state
      };
      const courseResponse = await createCourseMutateAsync(coursePayload);
      createdCourseId = courseResponse.CourseID;
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
        const createdSectionId = sectionResponse.SectionID;
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
            videoSourceType: lesson.videoSourceType,
            externalVideoInput: lesson.externalVideoInput, // Đã đổi tên
            textContent: lesson.textContent || null,
            // lessonOrder: currentLessonOrder, // Backend tự xử lý khi tạo hoặc cần API cập nhật order riêng
          };

          const lessonResponse = await createLessonMutateAsync({
            courseId: createdCourseId,
            sectionId: createdSectionId,
            data: lessonPayload,
          });
          const createdLessonId = lessonResponse.LessonID;
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
                variant={saveStatus === 'saved' ? 'secondary' : 'default'} // Thêm variant success nếu có
                onClick={form.handleSubmit(onSubmit)}
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
                  handleDeleteSection={(id) => {
                    if (window.confirm('Delete section and all its lessons?'))
                      deleteSection(id);
                  }}
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
          {isLoading && <FullScreenLoader />}
        </div>
      </div>
    </InstructorLayout>
  );
};

export default CourseCreation;
