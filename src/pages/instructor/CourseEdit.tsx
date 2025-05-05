/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { useToast } from '@/hooks/use-toast';
import { useGetCourseById } from '@/hooks/queries/course.queries'; // Custom hook to fetch course data
import FullScreenLoader from '@/components/common/FullScreenLoader';
import SectionDialog from '@/components/instructor/courseCreate/SectionDialog';
import LessonDialog from '@/components/instructor/courseCreate/LessonDialog';
import QuizQuestionDialog from '@/components/instructor/courseCreate/QuizQuestionDialog';
import PricingTab from '@/components/instructor/courseCreate/PricingTab';
import CurriculumTab from '@/components/instructor/courseCreate/CurriculumTab';
import MediaTab from '@/components/instructor/courseCreate/MediaTab';
import DetailsTab from '@/components/instructor/courseCreate/DetailsTab';
import BasicInfoTab from '@/components/instructor/courseCreate/BasicInfoTab';

const CourseEdit = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  const { data: courseData, isLoading, isError } = useGetCourseById(courseId);
  const [activeTab, setActiveTab] = useState('basic');
  const [sections, setSections] = useState([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [promoVideo, setPromoVideo] = useState<File | null>(null);
  const [promoVideoPreview, setPromoVideoPreview] = useState<string | null>(
    null
  );
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const form = useForm({
    defaultValues: {
      courseName: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      originalPrice: '',
      discountedPrice: '',
      categoryId: '',
      levelId: '',
      language: '',
      requirements: '',
      learningOutcomes: '',
    },
  });

  useEffect(() => {
    if (courseData && !isLoading) {
      form.reset({
        courseName: courseData.title,
        slug: courseData.slug,
        shortDescription: courseData.shortDescription,
        fullDescription: courseData.fullDescription,
        originalPrice: courseData.originalPrice.toString(),
        discountedPrice: courseData.discountedPrice?.toString() || '',
        categoryId: courseData.categoryId.toString(),
        levelId: courseData.levelId.toString(),
        language: courseData.language,
        requirements: courseData.requirements.join(', '),
        learningOutcomes: courseData.learningOutcomes.join(', '),
      });
      setSections(courseData.sections);
      setThumbnailPreview(courseData.thumbnail);
      setPromoVideoPreview(courseData.promoVideo);
    }
  }, [courseData, isLoading, form]);

  const handleUpdateCourse = async (data: any) => {
    setIsLoadingUpdate(true);
    try {
      // Update course logic here
      toast({
        title: 'Success',
        description: 'Course updated successfully.',
      });
      navigate(`/instructor/courses`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update course. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError) {
    return (
      <InstructorLayout>
        <div className="flex justify-center items-center h-full">
          <p>Failed to load course data. Please try again later.</p>
        </div>
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <Button
            variant={isLoadingUpdate ? 'outline' : 'default'}
            onClick={() => form.handleSubmit(handleUpdateCourse)()}
            disabled={isLoadingUpdate}
          >
            {isLoadingUpdate ? 'Updating...' : 'Update Course'}
          </Button>
        </div>

        <Tabs
          defaultValue="basic"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-6">
            <BasicInfoTab form={form} />
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-6">
            <DetailsTab form={form} />
          </TabsContent>

          <TabsContent value="media" className="space-y-6 mt-6">
            <MediaTab
              thumbnail={thumbnail}
              thumbnailPreview={thumbnailPreview}
              promoVideo={promoVideo}
              promoVideoPreview={promoVideoPreview}
              setThumbnail={setThumbnail}
              setThumbnailPreview={setThumbnailPreview}
              setPromoVideo={setPromoVideo}
              setPromoVideoPreview={setPromoVideoPreview}
            />
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-4 mt-6">
            <CurriculumTab sections={sections} setSections={setSections} />
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4 mt-6">
            <PricingTab form={form} />
          </TabsContent>
        </Tabs>
      </div>

      <SectionDialog
        open={sectionDialogOpen}
        onClose={() => setSectionDialogOpen(false)}
        sections={sections}
        setSections={setSections}
      />

      <LessonDialog
        open={lessonDialogOpen}
        onClose={() => setLessonDialogOpen(false)}
        sections={sections}
        setSections={setSections}
      />

      <QuizQuestionDialog
        open={questionDialogOpen}
        onClose={() => setQuestionDialogOpen(false)}
      />
    </InstructorLayout>
  );
};

export default CourseEdit;
