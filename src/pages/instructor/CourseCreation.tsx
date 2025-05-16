/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/instructor/CourseCreation.tsx
import React, { useState, useRef, useCallback } from 'react';
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
// Bỏ CurriculumTab và PricingTab khỏi trang Create ban đầu
// import CurriculumTab from '@/components/instructor/courseCreate/CurriculumTab';
// import PricingTab from '@/components/instructor/courseCreate/PricingTab';

// Import Hooks and Types
import { useCategories } from '@/hooks/queries/category.queries';
import { useLevels } from '@/hooks/queries/level.queries';
import {
  useCreateCourse,
  useUpdateCourseThumbnail, // Vẫn cần nếu cho upload thumbnail ngay
  // useUpdateCourseIntroVideo, // Nếu dùng upload video intro
} from '@/hooks/queries/course.queries';
import { Save, Loader2 } from 'lucide-react';
import { Course } from '@/types/common.types'; // Import Course type
import PricingTab from '@/components/instructor/courseCreate/PricingTab';
import { Form } from '@/components/ui/form';
import { useLanguages } from '@/hooks/queries/language.queries';

// Zod schema chỉ cần cho các trường tạo ban đầu
const createCourseFormSchema = z
  .object({
    courseName: z.string().trim().min(1, 'Course title is required').max(255),
    slug: z.string().optional(), // Slug sẽ được tạo tự động
    shortDescription: z
      .string()
      .trim()
      .min(1, 'Short description required')
      .max(500),
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
    // Thêm các trường từ DetailsTab nếu muốn lưu ngay
    fullDescription: z.string().max(30000).optional().nullable(),
    requirements: z.string().max(5000).optional().nullable(),
    learningOutcomes: z.string().max(5000).optional().nullable(),
    // Thêm các trường từ PricingTab nếu muốn lưu ngay
    originalPrice: z.preprocess(
      (val) => (val === '' || val === null ? 0 : parseFloat(String(val))),
      z.number().min(0).default(0)
    ), // Mặc định giá 0 nếu là free/chưa set
    discountedPrice: z.preprocess(
      (val) =>
        val === '' || val === null || val === undefined
          ? null
          : parseFloat(String(val)),
      z.number().min(0).optional().nullable()
    ),
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

// Type cho form Create (có thể bỏ bớt nếu các tab khác chưa nhập)
type CreateCourseFormData = Pick<
  z.infer<typeof createCourseFormSchema>,
  | 'courseName'
  | 'slug'
  | 'shortDescription'
  | 'categoryId'
  | 'levelId'
  | 'language'
  | 'fullDescription'
  | 'requirements'
  | 'learningOutcomes'
  | 'originalPrice'
  | 'discountedPrice' // Lấy thêm các trường nếu cần
>;

const CourseCreation: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic'); // Có thể chỉ cần 1 tab ban đầu
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // State for Media Tab
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [promoVideoUrl, setPromoVideoUrl] = useState<string>(''); // Chỉ dùng URL

  // Refs
  const thumbnailRef = useRef<HTMLInputElement>(null);

  // Fetch static data
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const { data: levelsData, isLoading: isLoadingLevels } = useLevels();

  // Mutation hooks
  const { mutateAsync: createCourseMutateAsync, isPending: isCreatingCourse } =
    useCreateCourse();
  const {
    mutateAsync: updateCourseThumbnailMutateAsync,
    isPending: isUploadingThumb,
  } = useUpdateCourseThumbnail();
  // Fetch languages
  const { data: languagesData, isLoading: isLoadingLanguages } = useLanguages();
  // Form setup chỉ cho các trường cần thiết ban đầu
  const form = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseFormSchema),
    defaultValues: {
      courseName: '',
      slug: '',
      shortDescription: '',
      categoryId: null,
      levelId: null,
      language: 'vi',
      fullDescription: '',
      requirements: null,
      learningOutcomes: null,
      originalPrice: 0,
      discountedPrice: null,
    },
    mode: 'onChange',
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

  // --- Save Draft Handler ---
  const handleSaveDraft = async (formData: CreateCourseFormData) => {
    setIsSavingDraft(true);
    console.log('[Create] Saving Draft. Form data:', formData);
    console.log('[Create] Thumbnail file:', thumbnail);

    try {
      // 1. Tạo khóa học nháp với thông tin từ form
      const coursePayload = {
        courseName: formData.courseName,
        slug: form.getValues('slug'), // Lấy slug đã tạo
        shortDescription: formData.shortDescription,
        categoryId: formData.categoryId!, // Zod đảm bảo có giá trị
        levelId: formData.levelId!, // Zod đảm bảo có giá trị
        language: formData.language,
        // Gửi cả các trường khác nếu đã nhập
        fullDescription: formData.fullDescription,
        requirements: formData.requirements,
        learningOutcomes: formData.learningOutcomes,
        originalPrice: formData.originalPrice,
        discountedPrice: formData.discountedPrice,
        introVideoUrl: promoVideoUrl || null,
        // Các trường khác sẽ có giá trị mặc định ở backend (status: DRAFT, etc.)
      };

      const createdCourse = await createCourseMutateAsync(coursePayload);
      const createdCourseId = Number(createdCourse.courseId);
      const createdCourseSlug = createdCourse.slug;
      console.log(
        `[Create] Draft course created with ID: ${createdCourseId}, Slug: ${createdCourseSlug}`
      );

      // 2. Upload Thumbnail (nếu có) - thực hiện sau khi có courseId
      if (thumbnail && createdCourseId) {
        console.log('[Create] Uploading thumbnail...');
        try {
          await updateCourseThumbnailMutateAsync({
            courseId: createdCourseId,
            file: thumbnail,
          });
          console.log('[Create] Thumbnail uploaded.');
        } catch (thumbError: any) {
          console.warn(
            'Thumbnail upload failed, but draft created:',
            thumbError.message
          );
          toast({
            title: 'Warning',
            description: 'Draft created, but thumbnail upload failed.',
            variant: 'default',
          });
          // Vẫn tiếp tục chuyển hướng
        }
      }

      // 3. Thành công -> Chuyển hướng sang trang Edit
      toast({
        title: 'Draft Saved',
        description: 'You can now build your curriculum.',
      });
      navigate(`/instructor/courses/${createdCourseSlug}/edit`); // Chuyển hướng
    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast({
        title: 'Save Draft Failed',
        description: error.message || 'Could not save draft course.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  // --- Render ---
  const isLoading =
    isLoadingCategories ||
    isLoadingLevels ||
    isCreatingCourse ||
    isUploadingThumb;

  return (
    <InstructorLayout>
      <div className="container mx-auto px-4 py-8">
        <Form {...form}>
          {/* Gán onSubmit ở đây */}
          <form
            onSubmit={form.handleSubmit(handleSaveDraft)}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Create New Course
              </h1>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Draft & Continue
              </Button>
            </div>

            {/* Có thể chỉ hiển thị các tab cần thiết ban đầu */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                {' '}
                {/* Chỉ 4 tab ban đầu */}
                <TabsTrigger value="basic">1. Basic Info</TabsTrigger>
                <TabsTrigger value="details">2. Details</TabsTrigger>
                <TabsTrigger value="media">3. Media</TabsTrigger>
                <TabsTrigger value="pricing">4. Pricing</TabsTrigger>
                {/* <TabsTrigger value="curriculum" disabled>5. Curriculum (Save Draft First)</TabsTrigger> */}
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
                <TabsContent value="pricing">
                  <PricingTab form={form} />
                </TabsContent>
                {/* <TabsContent value="curriculum"><p className="text-center text-muted-foreground py-8">Save the draft first to start building the curriculum.</p></TabsContent> */}
              </div>
            </Tabs>
            {/* Nút Save Draft ở dưới cùng nếu cần */}
            {/* <div className="flex justify-end pt-6 border-t">
                 <Button type="submit" disabled={isLoading || !form.formState.isValid}> ... Save Draft ... </Button>
             </div> */}
          </form>
        </Form>
        {/* Loading Overlay */}
        {isLoading && <FullScreenLoader />}
      </div>
    </InstructorLayout>
  );
};

export default CourseCreation;
