/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  Book,
  BookOpen,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  File,
  FileText,
  Image,
  Info,
  Layers,
  Link as LinkIcon,
  Plus,
  Save,
  Trash,
  Upload,
  UploadCloud,
  Video,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CoursePreviewDialog from '@/components/instructor/courseCreate/CoursePreviewDialog';
import QuizQuestionDialog from '@/components/instructor/courseCreate/QuizQuestionDialog';
import PricingTab from '@/components/instructor/courseCreate/PricingTab';
import CurriculumTab from '@/components/instructor/courseCreate/CurriculumTab';
import MediaTab from '@/components/instructor/courseCreate/MediaTab';
import DetailsTab from '@/components/instructor/courseCreate/DetailsTab';
import BasicInfoTab from '@/components/instructor/courseCreate/BasicInfoTab';
import SectionDialog from '@/components/instructor/courseCreate/SectionDialog';
import LessonDialog from '@/components/instructor/courseCreate/LessonDialog';
import { useCategories } from '@/hooks/queries/category.queries';
import { useSkills } from '@/hooks/queries/skill.queries';
import { useLevels } from '@/hooks/queries/level.queries';
import {
  useCreateCourse,
  useDeleteCourse,
  useSubmitCourseForApproval,
  useUpdateCourseThumbnail,
} from '@/hooks/queries/course.queries';
import { useCreateSection } from '@/hooks/queries/section.queries';
import {
  useAddLessonAttachment,
  useCreateLesson,
  useCreateQuizQuestion,
  useUpdateLessonVideo,
} from '@/hooks/queries/lesson.queries';
import { useAddSubtitleByUrl } from '@/hooks/queries/subtitle.queries';
import FullScreenLoader from '@/components/common/FullScreenLoader';

// Types based on your database schema
type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ';

interface QuizOption {
  id: number;
  optionText: string;
  isCorrectAnswer: boolean;
  optionOrder: number;
}

interface QuizQuestion {
  id: number;
  questionText: string;
  explanation: string | null;
  questionOrder: number;
  options: QuizOption[];
}

interface Attachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  file: File; // Thay đổi từ string thành File
}

interface Lesson {
  id: number;
  lessonName: string;
  description?: string | null; // Mô tả bài học (nếu có)
  videoDurationSeconds?: string;
  lessonType: LessonType;
  isFreePreview: boolean;
  textContent?: string;
  externalVideoInput?: string;
  thumbnailUrl?: string;
  questions?: QuizQuestion[];
  attachments: Attachment[];
  lessonVideo?: File | null; // Thay đổi từ string thành File | null
  subtitles?: {
    languageCode: string;
    languageName: string;
    subtitleUrl: string;
    isDefault: boolean;
  }[]; // Định nghĩa phụ đề
  videoSourceType?: 'CLOUDINARY' | 'YOUTUBE' | 'VIMEO';
}

interface Section {
  id: number;
  sectionName: string;
  description?: string | null; // Mô tả chương (nếu có)
  lessons: Lesson[];
}

const CourseCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [previewOpen, setPreviewOpen] = useState(false);

  // File upload refs

  const lessonVideoRef = useRef<HTMLInputElement>(null);
  const attachmentRef = useRef<HTMLInputElement>(null);

  // State for thumbnail and video
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [promoVideo, setPromoVideo] = useState<File | null>(null);
  const [promoVideoPreview, setPromoVideoPreview] = useState<string | null>(
    null
  );
  const [videoSourceType, setVideoSourceType] = useState<
    'CLOUDINARY' | 'YOUTUBE' | 'VIMEO'
  >('CLOUDINARY');
  // State for curriculum
  const [sections, setSections] = useState<Section[]>([]);

  // State for section/lesson editing
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [lessonData, setLessonData] = useState<{
    id?: number;
    lessonName: string;
    videoDurationSeconds: string;
    lessonType: LessonType;
    isFreePreview: boolean;
    textContent: string;
    externalVideoInput: string;
    questions: QuizQuestion[];
    attachments: Attachment[];
    lessonVideo: File | null;
    videoSourceType: 'CLOUDINARY' | 'YOUTUBE' | 'VIMEO';
    subtitles?: {
      languageCode: string;
      languageName: string;
      subtitleUrl: string;
      isDefault: boolean;
    }[]; // Định nghĩa phụ đề
  }>({
    id: null,
    lessonName: '',
    videoDurationSeconds: '',
    lessonType: 'VIDEO',
    isFreePreview: false,
    textContent: '',
    externalVideoInput: '',
    questions: [],
    attachments: [],
    lessonVideo: null,
    videoSourceType: 'CLOUDINARY',
    subtitles: [], // Khởi tạo phụ đề rỗng
  });
  const [promoVideoUrl, setPromoVideoUrl] = useState<string>('');
  // State for add/edit section/lesson dialogs
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // State for quiz editing
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  );
  const [questionData, setQuestionData] = useState<{
    questionText: string;
    explanation: string;
    options: { optionText: string; isCorrectAnswer: boolean }[];
  }>({
    questionText: '',
    explanation: '',
    options: [
      { optionText: '', isCorrectAnswer: false },
      { optionText: '', isCorrectAnswer: false },
      { optionText: '', isCorrectAnswer: false },
      { optionText: '', isCorrectAnswer: false },
    ],
  });
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);

  // Fetch categories using the custom hook
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const { data: levels, isLoading: isLoadingLevels } = useLevels();
  const { mutate: createCourse } = useCreateCourse();
  const { mutate: createSection } = useCreateSection();
  const { mutate: createLesson } = useCreateLesson();
  const { mutate: updateLessonVideo } = useUpdateLessonVideo();
  const { mutate: createQuizQuestion } = useCreateQuizQuestion();
  const { mutate: addLessonAttachment } = useAddLessonAttachment();
  const { mutate: addSubtitleByUrl } = useAddSubtitleByUrl();
  const { mutate: updateCourseThumbnail } = useUpdateCourseThumbnail();
  const { mutate: deleteCourse } = useDeleteCourse();
  // const { mutate: submitCourseForApproval } = useSubmitCourseForApproval();

  // const handleSubmitForApproval = () => {
  //   if (!form.getValues('courseName')) {
  //     toast({
  //       title: 'Error',
  //       description: 'Please fill in the course name before submitting.',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   submitCourseForApproval(
  //     { courseId: 123, data: { /* Add any additional data if needed */ } },
  //     {
  //       onSuccess: () => {
  //         toast({
  //           title: 'Success',
  //           description: 'Course submitted for approval successfully.',
  //         });
  //       },
  //       onError: (error) => {
  //         toast({
  //           title: 'Error',
  //           description: error.message || 'Failed to submit course for approval.',
  //           variant: 'destructive',
  //         });
  //       },
  //     }
  //   );
  // };
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

  const handleVideoSourceTypeChange = (
    sourceType: 'CLOUDINARY' | 'YOUTUBE' | 'VIMEO'
  ) => {
    setLessonData((prevLessonData) => ({
      ...prevLessonData,
      videoSourceType: sourceType,
      externalVideoInput:
        sourceType === 'CLOUDINARY' ? '' : prevLessonData.externalVideoInput, // Giữ URL nếu là YOUTUBE/VIMEO
      lessonVideo:
        sourceType === 'CLOUDINARY' ? prevLessonData.lessonVideo : null, // Xóa file nếu không phải CLOUDINARY
    }));
  };

  const onSubmit = async (data: any) => {
    let courseId: number | null = null;
    setSaveStatus('saving');
    setIsLoading(true); // Hiển thị loading
    try {
      // 1. Tạo khóa học (Draft)
      const coursePayload = {
        courseName: data.courseName,
        slug: data.slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        originalPrice: parseFloat(data.originalPrice),
        discountedPrice: parseFloat(data.discountedPrice) || null,
        categoryId: parseInt(data.categoryId, 10),
        levelId: parseInt(data.levelId, 10),
        language: data.language,
        requirements: data.requirements,
        learningOutcomes: data.learningOutcomes,
        introVideoUrl: promoVideoUrl,
      };

      const courseResponse = await new Promise((resolve, reject) => {
        createCourse(coursePayload, {
          onSuccess: resolve,
          onError: reject,
        });
      });

      courseId = (courseResponse as { CourseID: number }).CourseID;

      // 2. Upload thumbnail (nếu có) - Có thể coi là tùy chọn, lỗi thì cảnh báo nhưng không thoát? Hoặc thoát tùy yêu cầu.
      // Ở đây chọn cách cảnh báo và tiếp tục
      if (thumbnail) {
        console.log('Uploading thumbnail...');
        try {
          await new Promise((resolve, reject) => {
            updateCourseThumbnail(
              { courseId, file: thumbnail },
              {
                onSuccess: resolve,
                onError: reject,
              }
            );
          });
          console.log('Thumbnail uploaded successfully.');
        } catch (thumbError) {
          console.error('Error uploading thumbnail:', thumbError);
          toast({
            title: 'Cảnh báo',
            description: `Không thể tải lên ảnh đại diện. Bạn có thể thử lại sau. Quá trình tạo khóa học vẫn tiếp tục. Lỗi: ${
              (thumbError as Error).message || 'Unknown error'
            }`,
            variant: 'destructive', // Có thể dùng variant 'warning' nếu có
            duration: 7000, // Hiển thị lâu hơn
          });
          // KHÔNG throw lỗi ở đây nếu muốn tiếp tục
        }
      }

      // 3. Tạo các chương (Sections)
      console.log('Creating sections...');
      for (const section of sections) {
        console.log(`Creating section: "${section.sectionName}"`);
        const sectionPayload = {
          sectionName: section.sectionName,
          description: section.description || '',
        };

        const sectionResponse = await new Promise((resolve, reject) => {
          createSection(
            { courseId, data: sectionPayload },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });

        const sectionId = (sectionResponse as { SectionID: number }).SectionID;

        // 4. Tạo các bài học (Lessons) trong chương
        for (const lesson of section.lessons) {
          console.log(`Creating lesson: "${lesson.lessonName}"`);
          const lessonPayload: any = {
            // Dùng any để linh hoạt hơn hoặc tạo type/interface chi tiết
            lessonName: lesson.lessonName,
            lessonType: lesson.lessonType,
            isFreePreview: lesson.isFreePreview || false,
            description: lesson.description || null, // Thêm mô tả bài học nếu có
            // lessonOrder sẽ được xử lý ở backend hoặc thêm vào đây
          };

          // Chỉ thêm các trường liên quan đến type cụ thể
          if (lesson.lessonType === 'TEXT') {
            lessonPayload.textContent = lesson.textContent || '';
          } else if (lesson.lessonType === 'VIDEO') {
            lessonPayload.videoSourceType = lesson.videoSourceType; // 'CLOUDINARY', 'YOUTUBE', 'VIMEO'
            lessonPayload.externalVideoInput = lesson.externalVideoInput; // Lưu link gốc hoặc video file object
            // Duration sẽ được cập nhật sau khi upload (Cloudinary) hoặc lấy từ API (YT/Vimeo) ở backend
            lessonPayload.videoDurationSeconds = 0; // Có thể khởi tạo là 0
          }
          // Quiz sẽ xử lý riêng sau khi tạo lesson

          const lessonResponse = await new Promise((resolve, reject) => {
            createLesson(
              { courseId, sectionId, data: lessonPayload },
              {
                onSuccess: resolve,
                onError: reject,
              }
            );
          });

          const lessonId = (lessonResponse as { LessonID: number }).LessonID;
          // Handle video source type
          if (lesson.lessonType === 'VIDEO') {
            if (lesson.videoSourceType === 'CLOUDINARY' && lesson.lessonVideo) {
              await new Promise((resolve, reject) => {
                updateLessonVideo(
                  { lessonId, file: lesson.lessonVideo },
                  {
                    onSuccess: resolve,
                    onError: (error) => {
                      toast({
                        title: 'Error',
                        description: `Failed to upload video for lesson "${lesson.lessonName}".`,
                        variant: 'destructive',
                      });
                      reject(error);
                    },
                  }
                );
              });
            }
          }

          // Handle quiz questions
          if (lesson.lessonType === 'QUIZ' && lesson.questions) {
            for (const question of lesson.questions) {
              const questionPayload = {
                lessonId,
                questionText: question.questionText,
                explanation: question.explanation,
                options: question.options.map((option) => ({
                  optionText: option.optionText,
                  isCorrectAnswer: option.isCorrectAnswer,
                  optionOrder: option.optionOrder,
                })),
              };

              await new Promise((resolve, reject) => {
                createQuizQuestion(
                  { lessonId, data: questionPayload },
                  {
                    onSuccess: resolve,
                    onError: reject,
                  }
                );
              });
            }
          }

          // Handle text content
          if (lesson.lessonType === 'TEXT' && lesson.textContent) {
            // Text content is already included in the lessonPayload above
            console.log('Text content processed:', lesson.textContent);
          }
          // 5. Thêm phụ đề (nếu có)
          if (lesson.subtitles) {
            for (const subtitle of lesson.subtitles) {
              const subtitlePayload = {
                languageCode: subtitle.languageCode,
                languageName: subtitle.languageName,
                subtitleUrl: subtitle.subtitleUrl,
                isDefault: subtitle.isDefault,
              };

              await new Promise((resolve, reject) => {
                addSubtitleByUrl(
                  { lessonId, data: subtitlePayload },
                  {
                    onSuccess: resolve,
                    onError: reject,
                  }
                );
              });
            }
          }

          // 6. Thêm file đính kèm (nếu có)
          if (lesson.attachments) {
            for (const attachment of lesson.attachments) {
              const attachmentPayload = new FormData();
              attachmentPayload.append('attachment', attachment.fileUrl);

              await new Promise((resolve, reject) => {
                addLessonAttachment(
                  { lessonId, file: attachment.file },
                  {
                    onSuccess: resolve,
                    onError: reject,
                  }
                );
              });
            }
          }
          // Nếu mọi thứ thành công
          toast({
            title: 'Thành công',
            description: 'Khóa học của bạn đã được tạo thành công.',
            variant: 'default', // Nên có variant success
          });
          setSaveStatus('saved');
          // Có thể chuyển hướng người dùng đến trang quản lý khóa học
          navigate(`/instructor/courses`);
        }
      }

      toast({
        title: 'Success',
        description: 'Your course has been created successfully.',
      });
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error submitting course:', error);
      // Lỗi xảy ra ở bất kỳ bước quan trọng nào (createCourse, createSection, createLesson, ...)
      // đã throw lỗi và nhảy vào đây.
      toast({
        title: 'Đã xảy ra lỗi nghiêm trọng',
        description: `Không thể hoàn tất việc tạo khóa học. ${
          error.message || 'Lỗi không xác định.'
        } Vui lòng thử lại.`,
        variant: 'destructive',
        duration: 9000,
      });
      setSaveStatus('error');

      // --- Cân nhắc Rollback ---
      // Nếu courseId đã được tạo nhưng các bước sau lỗi, bạn có thể muốn xóa course nháp này đi
      if (courseId) {
        console.warn(
          `Attempting to delete draft course ${courseId} due to error.`
        );
        try {
          // Gọi API để xóa courseId
          await new Promise((resolve, reject) => {
            deleteCourse(courseId, {
              onSuccess: resolve,
              onError: reject,
            });
          });
        } catch (rollbackError) {
          console.error(
            `Failed to delete draft course ${courseId}:`,
            rollbackError
          );
        }
      }
    } finally {
      setIsLoading(false);
      // Giữ trạng thái error/saved để người dùng biết kết quả, không reset về idle ngay
      // setTimeout(() => setSaveStatus('idle'), 3000); // Có thể reset sau 1 khoảng tgian
    }
  };

  const handlePreview = () => {
    setPreviewOpen(true);
    toast({
      title: 'Course Preview',
      description: 'This is how your course will appear to students.',
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('courseName', title);
    form.setValue('slug', generateSlug(title));
  };

  // File handling functions
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: 'Thumbnail uploaded',
        description: `File "${file.name}" has been uploaded successfully.`,
      });
    }
  };

  // const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setPromoVideo(file);
  //     const videoUrl = URL.createObjectURL(file);
  //     setPromoVideoPreview(videoUrl);
  //     toast({
  //       title: 'Video uploaded',
  //       description: `File "${file.name}" has been uploaded successfully.`,
  //     });
  //   }
  // };

  const handleLessonVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      setLessonData((prevLessonData) => ({
        ...prevLessonData,
        lessonVideo: file,
        externalVideoInput: videoUrl,
      }));
      toast({
        title: 'Lesson video uploaded',
        description: `File "${file.name}" has been uploaded successfully.`,
      });
    }
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAttachment: Attachment = {
        id: Date.now(),
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileType: file.type,
        fileSize: file.size,
        file: file,
      };
      setLessonData((prevLessonData) => ({
        ...prevLessonData,
        attachments: [...prevLessonData.attachments, newAttachment],
      }));
      toast({
        title: 'Attachment added',
        description: `File "${file.name}" has been attached to the lesson.`,
      });
    }
  };

  const handleRemoveAttachment = (attachmentId: number) => {
    setLessonData({
      ...lessonData,
      attachments: lessonData.attachments.filter(
        (attachment) => attachment.id !== attachmentId
      ),
    });

    toast({
      title: 'Attachment removed',
      description: 'The attachment has been removed from the lesson.',
    });
  };

  // Section handling functions
  const handleAddSection = () => {
    setSectionTitle('');
    setEditingSectionId(null);
    setSectionDialogOpen(true);
  };

  const handleEditSection = (sectionId: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      setSectionTitle(section.sectionName);
      setEditingSectionId(sectionId);
      setSectionDialogOpen(true);
    }
  };

  const handleSaveSection = () => {
    if (editingSectionId) {
      // Update existing section
      setSections(
        sections.map((section) =>
          section.id === editingSectionId
            ? { ...section, sectionName: sectionTitle }
            : section
        )
      );
      toast({
        title: 'Section updated',
        description: 'The section has been updated successfully.',
      });
    } else {
      // Add new section
      console.log('Adding new section:', sectionTitle);
      console.log('Sections before adding:', sections);
      const newSectionId = Math.max(0, ...sections.map((s) => s.id)) + 1;
      console.log('New section ID:', newSectionId);

      setSections([
        ...sections,
        {
          id: newSectionId,
          sectionName: sectionTitle,
          lessons: [],
        },
      ]);
      console.log('Sections after adding:', sections);
      toast({
        title: 'Section added',
        description: 'A new section has been added to your course.',
      });
    }
    setSectionDialogOpen(false);
  };

  // Lesson handling functions
  const handleAddLesson = (sectionId: number) => {
    setCurrentSectionId(sectionId);
    setEditingLessonId(null);
    setLessonData({
      lessonName: '',
      videoDurationSeconds: '',
      lessonType: 'VIDEO',
      isFreePreview: false,
      textContent: '',
      externalVideoInput: '',
      questions: [],
      attachments: [],
      lessonVideo: null,
      videoSourceType: 'CLOUDINARY',
      subtitles: [], // Khởi tạo phụ đề rỗng
    });
    setLessonDialogOpen(true);
  };

  const handleEditLesson = (sectionId: number, lessonId: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const lesson = section.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        setCurrentSectionId(sectionId);
        setEditingLessonId(lessonId);
        setLessonData({
          lessonName: lesson.lessonName,
          videoDurationSeconds: lesson.videoDurationSeconds,
          lessonType: lesson.lessonType,
          isFreePreview: lesson.isFreePreview,
          textContent: lesson.textContent || '',
          externalVideoInput: lesson.externalVideoInput || '',
          questions: lesson.questions || [],
          attachments: lesson.attachments || [],
          lessonVideo: lesson.lessonVideo || null,
          videoSourceType: lesson.videoSourceType || 'CLOUDINARY',
          subtitles: lesson.subtitles || [],
        });
        setLessonDialogOpen(true);
      }
    }
  };

  const handleSaveLesson = () => {
    if (!lessonData.lessonName.trim()) {
      toast({
        title: 'Error',
        description: 'Lesson name is required.',
        variant: 'destructive',
      });
      return;
    }

    const lessonToSave = {
      ...lessonData,
      id: editingLessonId || Date.now(),
    };

    // Lưu bài học vào danh sách bài học
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === currentSectionId
          ? {
              ...section,
              lessons: editingLessonId
                ? section.lessons.map((lesson) =>
                    lesson.id === editingLessonId ? lessonToSave : lesson
                  )
                : [...section.lessons, lessonToSave],
            }
          : section
      )
    );

    toast({
      title: editingLessonId ? 'Lesson updated' : 'Lesson added',
      description: editingLessonId
        ? 'The lesson has been updated successfully.'
        : 'A new lesson has been added to your course.',
    });

    setLessonDialogOpen(false);
  };

  const handleDeleteLesson = (sectionId: number, lessonId: number) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.filter(
                (lesson) => lesson.id !== lessonId
              ),
            }
          : section
      )
    );
    toast({
      title: 'Lesson deleted',
      description: 'The lesson has been removed from your course.',
      variant: 'destructive',
    });
  };

  // Quiz question handling functions
  const handleAddQuestion = () => {
    setCurrentQuestionId(null);
    setQuestionData({
      questionText: '',
      explanation: '',
      options: [
        { optionText: '', isCorrectAnswer: false },
        { optionText: '', isCorrectAnswer: false },
        { optionText: '', isCorrectAnswer: false },
        { optionText: '', isCorrectAnswer: false },
      ],
    });
    setQuestionDialogOpen(true);
  };

  const handleEditQuestion = (questionId: number) => {
    const question = lessonData.questions.find((q) => q.id === questionId);
    if (question) {
      setCurrentQuestionId(questionId);
      setQuestionData({
        questionText: question.questionText,
        explanation: question.explanation || '',
        options: question.options.map((opt) => ({
          optionText: opt.optionText,
          isCorrectAnswer: opt.isCorrectAnswer,
        })),
      });
      setQuestionDialogOpen(true);
    }
  };

  const handleSaveQuestion = () => {
    // Validate at least one correct answer
    if (!questionData.options.some((opt) => opt.isCorrectAnswer)) {
      toast({
        title: 'Error',
        description: 'Please mark at least one option as correct.',
        variant: 'destructive',
      });
      return;
    }

    // Filter out empty options
    const filteredOptions = questionData.options.filter(
      (opt) => opt.optionText.trim() !== ''
    );

    if (filteredOptions.length < 2) {
      toast({
        title: 'Error',
        description: 'Please provide at least two answer options.',
        variant: 'destructive',
      });
      return;
    }

    const questionToSave: QuizQuestion = {
      id: currentQuestionId || Date.now(),
      questionText: questionData.questionText,
      explanation: questionData.explanation,
      questionOrder: currentQuestionId
        ? lessonData.questions.find((q) => q.id === currentQuestionId)
            ?.questionOrder || 0
        : lessonData.questions.length,
      options: filteredOptions.map((opt, index) => ({
        id: Date.now() + index,
        optionText: opt.optionText,
        isCorrectAnswer: opt.isCorrectAnswer,
        optionOrder: index,
      })),
    };

    if (currentQuestionId) {
      // Update existing question
      setLessonData({
        ...lessonData,
        questions: lessonData.questions.map((q) =>
          q.id === currentQuestionId ? questionToSave : q
        ),
      });
    } else {
      // Add new question
      setLessonData({
        ...lessonData,
        questions: [...lessonData.questions, questionToSave],
      });
    }

    setQuestionDialogOpen(false);
    toast({
      title: currentQuestionId ? 'Question updated' : 'Question added',
      description: currentQuestionId
        ? 'The question has been updated successfully.'
        : 'A new question has been added to the quiz.',
    });
  };

  const handleDeleteQuestion = (questionId: number) => {
    setLessonData({
      ...lessonData,
      questions: lessonData.questions.filter((q) => q.id !== questionId),
    });

    toast({
      title: 'Question deleted',
      description: 'The question has been removed from the quiz.',
      variant: 'destructive',
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    setQuestionData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, optionText: value } : opt
      ),
    }));
  };

  const handleCorrectAnswerChange = (index: number) => {
    setQuestionData({
      ...questionData,
      options: questionData.options.map((opt, i) =>
        i === index ? { ...opt, isCorrectAnswer: !opt.isCorrectAnswer } : opt
      ),
    });
  };

  const mockLanguages = [
    { id: 1, name: 'en' },
    // { id: 2, name: 'Spanish' },
    // { id: 3, name: 'French' },
    // { id: 4, name: 'German' },
    { id: 5, name: 'vi' },
  ];

  return (
    <InstructorLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant={saveStatus === 'saved' ? 'outline' : 'default'}
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
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
            {/* <Button variant="outline" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button> */}
          </div>
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

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4 mt-6">
            <BasicInfoTab
              form={form}
              mockCategories={categories?.categories}
              mockLevels={levels?.levels}
              mockLanguages={mockLanguages}
              handleTitleChange={handleTitleChange}
            />
          </TabsContent>

          {/* Course Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-6">
            <DetailsTab form={form} />
          </TabsContent>

          {/* Media Tab */}
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
              handleThumbnailChange={handleThumbnailChange}
              // handleVideoChange={handleVideoChange}
              promoVideoUrl={promoVideoUrl}
              setPromoVideoUrl={setPromoVideoUrl}
            />
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-4 mt-6">
            <CurriculumTab
              sections={sections}
              handleAddSection={handleAddSection}
              handleEditSection={handleEditSection}
              handleAddLesson={handleAddLesson}
              handleEditLesson={handleEditLesson}
              handleDeleteLesson={handleDeleteLesson}
            />
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-4 mt-6">
            <PricingTab form={form} />
          </TabsContent>
        </Tabs>

        {/* <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            disabled={activeTab === 'basic'}
            onClick={() => {
              const tabs = [
                'basic',
                'details',
                'media',
                'curriculum',
                'pricing',
              ];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1]);
              }
            }}
          >
            Previous
          </Button>

          <Button
            disabled={activeTab === 'pricing'}
            onClick={() => {
              const tabs = [
                'basic',
                'details',
                'media',
                'curriculum',
                'pricing',
              ];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
              }
            }}
          >
            Next
          </Button>
        </div> */}
      </div>

      {/* Edit Section Dialog */}
      <SectionDialog
        open={sectionDialogOpen}
        onClose={() => setSectionDialogOpen(false)}
        onSave={handleSaveSection}
        sectionTitle={sectionTitle}
        setSectionTitle={setSectionTitle}
        isEditing={!!editingSectionId}
      />

      {/* Edit Lesson Dialog */}
      <LessonDialog
        open={lessonDialogOpen}
        onClose={() => setLessonDialogOpen(false)}
        onSave={handleSaveLesson}
        lessonData={lessonData}
        setLessonData={setLessonData}
        handleLessonVideoChange={handleLessonVideoChange}
        handleAttachmentUpload={handleAttachmentUpload}
        handleRemoveAttachment={handleRemoveAttachment}
        handleAddQuestion={handleAddQuestion}
        handleEditQuestion={handleEditQuestion}
        handleDeleteQuestion={handleDeleteQuestion}
        lessonVideoRef={lessonVideoRef}
        attachmentRef={attachmentRef}
        editingLessonId={editingLessonId}
        handleVideoSourceTypeChange={handleVideoSourceTypeChange}
      />

      {/* Quiz Question Dialog */}
      <QuizQuestionDialog
        open={questionDialogOpen}
        onClose={() => setQuestionDialogOpen(false)}
        onSave={handleSaveQuestion}
        questionData={questionData}
        setQuestionData={setQuestionData}
        currentQuestionId={currentQuestionId}
        handleOptionChange={handleOptionChange}
        handleCorrectAnswerChange={handleCorrectAnswerChange}
      />

      {/* Course Preview Modal */}
      {/* <CoursePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        thumbnailPreview={thumbnailPreview}
        formValues={{
          title: form.watch('title'),
          shortDescription: form.watch('shortDescription'),
          category: form.watch('category'),
          level: form.watch('level'),
          language: form.watch('language'),
          price: form.watch('price'),
        }}
        sections={sections}
      /> */}
      {isLoading && <FullScreenLoader />}
    </InstructorLayout>
  );
};

export default CourseCreation;
