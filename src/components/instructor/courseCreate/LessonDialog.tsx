/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/instructor/courseCreate/LessonDialog.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Video,
  FileText,
  BookOpen as BookIcon,
  Upload,
  Trash,
  Edit,
  Plus,
  File as FileIcon,
  X,
  Link as LinkIcon,
  Cloud,
  Captions,
  Loader2,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast'; // Đảm bảo hook toast tồn tại
import QuizQuestionDialog from './QuizQuestionDialog'; // Đảm bảo component tồn tại
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateTempId } from '@/components/common/generateTempId'; // Hàm tạo ID tạm
import TiptapEditor from '@/components/editor/TiptapEditor'; // Editor của bạn
import {
  extractYoutubeId,
  extractVimeoId,
  getYoutubeEmbedUrl,
  getVimeoEmbedUrl,
} from '../../../utils/video.util'; // Các hàm tiện ích video
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  useAddLessonAttachment,
  useCreateLesson,
  useDeleteLessonAttachment,
  useDeleteQuizQuestion,
  useLessonDetail,
  useLessonVideoUrl,
  useUpdateLesson,
  useUpdateLessonVideo,
} from '@/hooks/queries/lesson.queries'; // Hook lấy signed URL
import {
  useAddSubtitleByUrl,
  useDeleteSubtitle,
  useSetPrimarySubtitle,
} from '@/hooks/queries/subtitle.queries';
import { useQueryClient } from '@tanstack/react-query';
import {
  Attachment,
  CreateLessonData,
  UpdateLessonData,
} from '@/services/lesson.service';
import { courseKeys } from '@/hooks/queries/course.queries';
import { Lesson } from '@/types/common.types';
import { useLanguages } from '@/hooks/queries/language.queries';
import { QuizQuestion } from '@/services/quiz.service';
import { Subtitle } from '@/services/subtitle.service';

// --- Zod Schema ---
const quizOptionSchemaFE = z.object({
  tempId: z.union([z.string(), z.number()]).optional(),
  questionId: z.number().optional(),
  optionText: z.string().min(1, 'Option text is required').max(500),
  isCorrectAnswer: z.boolean().default(false),
  optionOrder: z.number().optional(),
});

// const quizQuestionSchemaFE = z.object({
//   tempId: z.union([z.string(), z.number()]).optional(),
//   id: z.number().optional(),
//   questionText: z.string().min(1, 'Question text is required'),
//   explanation: z.string().max(1000).nullable().optional(),
//   questionOrder: z.number().optional(),
//   options: z
//     .array(quizOptionSchemaFE)
//     .min(2, 'Minimum 2 options required')
//     .max(10, 'Maximum 10 options allowed')
//     .refine(
//       (options) => options.filter((opt) => opt.isCorrectAnswer).length === 1,
//       {
//         message: 'Exactly one correct answer must be selected',
//       }
//     ), // Đảm bảo có đúng 1 đáp án đúng
// });

// const attachmentSchemaFE = z.object({
//   tempId: z.union([z.string(), z.number()]).optional(),
//   id: z.number().optional(),
//   fileName: z.string(),
//   fileUrl: z.string().optional(),
//   fileType: z.string().optional(),
//   fileSize: z.number().optional(),
//   // File chỉ bắt buộc khi thêm mới, khi edit có thể là null nếu không thay đổi
//   file: z.custom<File>((val) => val instanceof File, 'Invalid file').nullable(),
// });

// const subtitleSchemaFE = z.object({
//   tempId: z.union([z.string(), z.number()]).optional(),
//   id: z.number().optional(),
//   languageCode: z.string().min(1, 'Code required').max(10),
//   languageName: z.string().min(1, 'Name required').max(50),
//   subtitleUrl: z.string().url('Invalid Subtitle URL').min(1, 'URL required'),
//   isDefault: z.boolean().default(false),
// });

const lessonFormSchema = z
  .object({
    // --- Core Fields ---
    lessonName: z.string().trim().min(1, 'Lesson name is required').max(255),
    description: z.string().max(4000).optional().nullable(),
    lessonType: z.enum(['VIDEO', 'TEXT', 'QUIZ']),
    isFreePreview: z.boolean().default(false),

    // --- Video Fields ---
    videoSourceType: z
      .enum(['CLOUDINARY', 'YOUTUBE', 'VIMEO'])
      .optional()
      .nullable(),
    externalVideoInput: z // Dùng để nhập liệu YT/Vimeo URL hoặc ID
      .string()
      .trim()
      .max(1000)
      // Validate cơ bản URL hoặc ID pattern (có thể cải thiện regex)
      .refine(
        (val) =>
          !val ||
          /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\/[^\s]*)?$/.test(
            val
          ) ||
          /^[a-zA-Z0-9_-]{11}$/.test(val) ||
          /^[0-9]+$/.test(val),
        {
          message: 'Invalid URL or ID format',
        }
      )
      .optional()
      .nullable(),
    lessonVideo: z // Dùng cho file upload lên Cloudinary (File object)
      .custom<File | null>(
        (val) => val === null || val instanceof File,
        'Invalid file format'
      )
      .optional()
      .nullable()
      // Validate kích thước file (ví dụ: max 500MB)
      .refine((file) => !file || file.size <= 500 * 1024 * 1024, {
        message: 'Video file size cannot exceed 500MB.',
      }),

    // --- Text Field ---
    textContent: z // Cho lesson type TEXT
      .string()
      .max(30000, 'Content is too long (max 30000 chars)') // Tăng giới hạn
      .optional()
      .nullable(),

    // --- Trường ẩn để hỗ trợ validation khi edit ---
    _initialExternalVideoId: z.string().optional().nullable(), // Lưu ID gốc khi edit
  })
  // --- Refinements Logic ---
  .refine(
    // Rule 1: Nếu VIDEO và YT/Vimeo => externalVideoInput phải hợp lệ (trích xuất được ID)
    (data) =>
      data.lessonType !== 'VIDEO' ||
      data.videoSourceType === 'CLOUDINARY' ||
      (!!data.externalVideoInput &&
        ((data.videoSourceType === 'YOUTUBE' &&
          extractYoutubeId(data.externalVideoInput)) ||
          (data.videoSourceType === 'VIMEO' &&
            extractVimeoId(data.externalVideoInput)))),
    {
      message: 'Please enter a valid YouTube/Vimeo link or ID',
      path: ['externalVideoInput'],
    }
  )
  .refine(
    // Rule 2: Nếu VIDEO và CLOUDINARY => phải có file mới HOẶC đã có video từ trước (khi edit)
    (data) =>
      data.lessonType !== 'VIDEO' ||
      data.videoSourceType !== 'CLOUDINARY' ||
      !!data.lessonVideo || // Có file mới được chọn
      !!data._initialExternalVideoId, // Hoặc có ID gốc từ trước (chứng tỏ đã upload)
    {
      message: 'Please upload a video file',
      path: ['lessonVideo'],
    }
  )
  .refine(
    // Rule 3: Nếu TEXT => textContent không được rỗng (hoặc có độ dài tối thiểu)
    (data) =>
      data.lessonType !== 'TEXT' ||
      (!!data.textContent && data.textContent.trim().length >= 1), // Chỉ cần không rỗng
    {
      message: 'Text content cannot be empty',
      path: ['textContent'],
    }
  );

type LessonFormData = z.infer<typeof lessonFormSchema>;

// Props Interface (Giữ nguyên)
interface LessonDialogProps {
  open: boolean;
  onClose: () => void;
  initialData: Lesson | null;
  isEditing: boolean;
  sectionId: number | string; // ** LUÔN CẦN sectionId **
  courseId: number; // ** Cần courseId để invalidate **
  lessonVideoRef: React.RefObject<HTMLInputElement>;
  attachmentRef: React.RefObject<HTMLInputElement>;
}

const LessonDialog: React.FC<LessonDialogProps> = ({
  open,
  onClose,
  initialData,
  isEditing,
  sectionId, // Nhận sectionId
  courseId, // Nhận courseId
  lessonVideoRef,
  attachmentRef,
}) => {
  const queryClient = useQueryClient();
  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {},
    mode: 'onChange', // Validate khi thay đổi
  });

  // --- States ---
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [subtitleToDelete, setSubtitleToDelete] = useState<Subtitle | null>(
    null
  );
  const [currentVideoUrlPreview, setCurrentVideoUrlPreview] = useState<
    string | null
  >(null);
  const [externalVideoInfo, setExternalVideoInfo] = useState<{
    type: 'youtube' | 'vimeo';
    id: string;
  } | null>(null);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  // State để lưu File object mới chọn (quan trọng cho việc upload sau khi tạo/sửa lesson)
  const [newVideoFileToUpload, setNewVideoFileToUpload] = useState<File | null>(
    null
  );
  // State để lưu trữ attachments MỚI cần upload
  const [newAttachmentsToUpload, setNewAttachmentsToUpload] = useState<
    Attachment[]
  >([]);
  const [editingQuizQuestion, setEditingQuizQuestion] =
    useState<QuizQuestion | null>(null);
  const [newSubtitle, setNewSubtitle] = useState<
    Omit<Subtitle, 'id' | 'tempId' | 'lessonId'>
  >({
    languageCode: '',
    subtitleUrl: '',
    isDefault: false,
  });
  const { data: languagesData, isLoading: isLoadingLanguages } = useLanguages();
  // --- Data Fetching ---
  const currentLessonId =
    isEditing && initialData?.lessonId
      ? Number(initialData.lessonId)
      : undefined;
  // Fetch chi tiết lesson KHI EDITING để lấy attachments, subtitles, questions mới nhất
  // (Nếu initialData từ props đã đủ thì không cần fetch lại)
  const { data: fetchedLessonDetails, isLoading: isLoadingDetails } =
    useLessonDetail(currentLessonId, {
      enabled: isEditing && !!currentLessonId, // Chỉ fetch khi edit và có ID
      staleTime: 1000 * 30, // Cache ngắn hơn vì có thể thay đổi thường xuyên
    });
  // Fetch signed URL nếu cần
  const videoIdToFetchUrl =
    isEditing &&
    initialData?.videoSourceType === 'CLOUDINARY' &&
    initialData?.externalVideoId &&
    !newVideoFileToUpload
      ? currentLessonId
      : undefined;
  const {
    data: fetchedVideoData,
    isLoading: isLoadingVideoUrl,
    isError: isErrorVideoUrl,
  } = useLessonVideoUrl(videoIdToFetchUrl);
  console.log(initialData);

  // --- Mutation Hooks ---
  const { mutateAsync: createLessonMutateAsync, isPending: isCreatingLesson } =
    useCreateLesson();
  const { mutateAsync: updateLessonMutateAsync, isPending: isUpdatingLesson } =
    useUpdateLesson();
  const {
    mutateAsync: updateLessonVideoMutateAsync,
    isPending: isUploadingVideo,
  } = useUpdateLessonVideo();
  const {
    mutateAsync: addAttachmentMutateAsync,
    isPending: isUploadingAttachment,
  } = useAddLessonAttachment();
  const {
    mutateAsync: deleteAttachmentMutateAsync,
    isPending: isDeletingAttachment,
  } = useDeleteLessonAttachment();
  const { mutateAsync: addSubtitleMutateAsync, isPending: isAddingSubtitle } =
    useAddSubtitleByUrl();
  const {
    mutateAsync: deleteSubtitleMutateAsync,
    isPending: isDeletingSubtitle,
  } = useDeleteSubtitle();
  const {
    mutateAsync: setPrimarySubtitleMutateAsync,
    isPending: isSettingPrimarySub,
  } = useSetPrimarySubtitle();
  // *** Thêm hook mutation cho Quiz nếu quản lý ở đây ***
  // const { mutateAsync: createQuestionMutateAsync, isPending: isCreatingQuestion } = useCreateQuizQuestion();
  // const { mutateAsync: updateQuestionMutateAsync, isPending: isUpdatingQuestion } = useUpdateQuestion();
  const {
    mutateAsync: deleteQuestionMutateAsync,
    isPending: isDeletingQuestion,
  } = useDeleteQuizQuestion();

  const isProcessing =
    isCreatingLesson ||
    isUpdatingLesson ||
    isUploadingVideo ||
    isUploadingAttachment ||
    isDeletingAttachment ||
    isAddingSubtitle ||
    isDeletingSubtitle ||
    isSettingPrimarySub; // Thêm các cờ isPending khác nếu có
  // --- Effects ---

  // Main Effect for Initialization and Resetting
  useEffect(() => {
    console.log('[Init Effect] Running. Open:', open);
    // Dọn dẹp Blob URL cũ
    if (currentVideoUrlPreview) URL.revokeObjectURL(currentVideoUrlPreview);

    setExternalVideoInfo(null);
    setCurrentVideoUrlPreview(null); // Reset preview chính
    setNewVideoFileToUpload(null); // Reset file mới
    setNewAttachmentsToUpload([]); // Reset file attachment mới

    if (open) {
      const dataToReset = isEditing ? initialData : null; // Dữ liệu gốc để reset
      const detailsToUse = isEditing
        ? fetchedLessonDetails || initialData
        : null; // Ưu tiên dữ liệu fetch mới nhất nếu có
      let newPreviewUrl: string | null = null;

      if (isEditing && initialData) {
        console.log('[Effect Init] Editing Mode. InitialData:', initialData);
        // 2. Reset Form
        form.reset({
          lessonName: dataToReset.lessonName,
          description: dataToReset.description || null,
          lessonType: dataToReset.lessonType,
          isFreePreview: dataToReset.isFreePreview,
          videoSourceType:
            dataToReset.videoSourceType ||
            (dataToReset.lessonType === 'VIDEO' ? 'CLOUDINARY' : null),
          externalVideoInput:
            dataToReset.videoSourceType === 'YOUTUBE'
              ? getYoutubeEmbedUrl(dataToReset.externalVideoId || '')
              : dataToReset.videoSourceType === 'VIMEO'
              ? getVimeoEmbedUrl(dataToReset.externalVideoId || '')
              : null,
          textContent: dataToReset.textContent || null,
          lessonVideo: null, // RHF field for new file upload always starts null
          _initialExternalVideoId: dataToReset.externalVideoId, // For refine rule
        } as any);

        // 3. Determine Initial Preview URL
        if (dataToReset.lessonType === 'VIDEO') {
          if (dataToReset.videoSourceType === 'CLOUDINARY') {
            if (dataToReset.externalVideoId === 'uploaded') {
              // Needs fetched signed URL

              if (isLoadingVideoUrl) {
                console.log(
                  '[Effect Init] Waiting for Cloudinary signed URL...'
                );
                // Preview remains null for now, loader shown in JSX
              } else if (fetchedVideoData?.signedUrl) {
                console.log(
                  '[Effect Init] Using fetched Cloudinary signed URL.'
                );
                newPreviewUrl = fetchedVideoData.signedUrl;
              } else if (isErrorVideoUrl) {
                console.error(
                  '[Effect Init] Error fetching Cloudinary signed URL.'
                );
              }
            }
          } else if (
            initialData.videoSourceType === 'YOUTUBE' ||
            initialData.videoSourceType === 'VIMEO'
          ) {
            const id = initialData.externalVideoId; // Assume ID is stored
            const type = initialData.videoSourceType.toLowerCase() as
              | 'youtube'
              | 'vimeo';
            if (id) {
              const embedUrl =
                type === 'youtube'
                  ? getYoutubeEmbedUrl(id)
                  : getVimeoEmbedUrl(id);
              console.log(`[Effect Init] Setting ${type} embed URL.`);
              newPreviewUrl = embedUrl;
              setExternalVideoInfo({ type, id }); // Set info for iframe rendering
            }
          }
        }

        // 4. Initialize nested arrays (create copies)
        setQuizQuestions(
          detailsToUse.questions?.map((q) => ({
            ...q,
            tempId: q.tempId || q.questionId || generateTempId('question'),
            options:
              q.options?.map((o) => ({
                ...o,
                tempId: o.tempId || o.optionId || generateTempId('option'),
              })) || [],
          })) || []
        );
        setAttachments(
          (detailsToUse.attachments?.map((a) => ({
            ...a,
            tempId: a.tempId || a.attachmentId || generateTempId('attach'),
            file: null,
          })) as Attachment[]) || []
        );
        setSubtitles(
          detailsToUse.subtitles?.map((s) => ({
            ...s,
            tempId: s.tempId || s.subtitleId || generateTempId('subtitle'),
          })) || []
        );
      } else {
        // Adding New
        console.log('[Effect Init] Add New Mode. Resetting form and states.');
        form.reset({
          lessonName: '',
          description: null,
          lessonType: 'VIDEO',
          isFreePreview: false,
          videoSourceType: 'CLOUDINARY',
          externalVideoInput: null,
          lessonVideo: null,
          textContent: null,
        });
        setQuizQuestions([]);
        setAttachments([]);
        setSubtitles([]);
      }

      // 5. Set the calculated preview URL
      if (currentVideoUrlPreview !== newPreviewUrl) {
        // Avoid unnecessary sets
        setCurrentVideoUrlPreview(newPreviewUrl);
      }
      console.log(newPreviewUrl);
      // 6. Reset other dialog states
      setNewSubtitle({
        languageCode: '',
        subtitleUrl: '',
        isDefault: false,
      });
      setEditingQuizQuestion(null);
      setQuizDialogOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    isEditing,
    initialData,
    form.reset,
    fetchedVideoData,
    isLoadingVideoUrl,
    isErrorVideoUrl,
    fetchedLessonDetails,
  ]); // Dependencies

  // Effect cập nhật preview khi signed URL về
  useEffect(() => {
    if (videoIdToFetchUrl && fetchedVideoData?.signedUrl) {
      if (currentVideoUrlPreview !== fetchedVideoData.signedUrl) {
        if (currentVideoUrlPreview?.startsWith('blob:'))
          URL.revokeObjectURL(currentVideoUrlPreview);
        console.log(
          '[Cloudinary URL Effect] Received signed URL:',
          fetchedVideoData.signedUrl
        );
        setCurrentVideoUrlPreview(fetchedVideoData.signedUrl);
      }
    }
    // Nếu đang edit mà không fetch được URL (lỗi hoặc không có ID) thì để preview là null
    else if (
      videoIdToFetchUrl &&
      (isErrorVideoUrl || (!isLoadingVideoUrl && !fetchedVideoData?.signedUrl))
    ) {
      if (
        currentVideoUrlPreview &&
        !currentVideoUrlPreview.startsWith('blob:')
      ) {
        // Chỉ reset nếu đang hiển thị URL cũ
        setCurrentVideoUrlPreview(null);
      }
    }
  }, [
    fetchedVideoData,
    videoIdToFetchUrl,
    isErrorVideoUrl,
    isLoadingVideoUrl,
    currentVideoUrlPreview,
  ]);

  // Effect for YouTube/Vimeo input change
  useEffect(() => {
    const source = form.watch('videoSourceType');
    const input = form.watch('externalVideoInput');

    // Only run if the source is YT/Vimeo
    if (source !== 'YOUTUBE' && source !== 'VIMEO') {
      // If source changed away from YT/Vimeo, reset the info
      if (externalVideoInfo !== null) {
        setExternalVideoInfo(null);
        // Optionally reset preview if it was YT/Vimeo
        if (
          currentVideoUrlPreview &&
          (currentVideoUrlPreview.includes('youtube.com') ||
            currentVideoUrlPreview.includes('vimeo.com'))
        ) {
          setCurrentVideoUrlPreview(null);
        }
      }
      return;
    }

    let videoId: string | null = null;
    let videoType: 'youtube' | 'vimeo' | null = null;
    let embedUrl: string | null = null;

    if (source === 'YOUTUBE') {
      videoId = extractYoutubeId(input || '');
      if (videoId) {
        videoType = 'youtube';
        embedUrl = getYoutubeEmbedUrl(videoId);
      }
    } else if (source === 'VIMEO') {
      videoId = extractVimeoId(input || '');
      if (videoId) {
        videoType = 'vimeo';
        embedUrl = getVimeoEmbedUrl(videoId);
      }
    }

    // Update states if needed
    if (videoId && videoType) {
      if (
        externalVideoInfo?.id !== videoId ||
        externalVideoInfo?.type !== videoType
      ) {
        setExternalVideoInfo({ id: videoId, type: videoType });
      }
      if (currentVideoUrlPreview !== embedUrl) {
        if (currentVideoUrlPreview?.startsWith('blob:'))
          URL.revokeObjectURL(currentVideoUrlPreview);
        setCurrentVideoUrlPreview(embedUrl);
      }
    } else {
      if (externalVideoInfo !== null) {
        setExternalVideoInfo(null);
        if (
          currentVideoUrlPreview &&
          (currentVideoUrlPreview.includes('youtube.com') ||
            currentVideoUrlPreview.includes('vimeo.com'))
        ) {
          setCurrentVideoUrlPreview(null);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('externalVideoInput'), form.watch('videoSourceType')]); // Watch relevant form fields

  // Effect for final cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentVideoUrlPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(currentVideoUrlPreview);
      }
    };
  }, [currentVideoUrlPreview]);

  // --- Handlers ---

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentVideoUrlPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(currentVideoUrlPreview);
    }
    setCurrentVideoUrlPreview(null);
    setExternalVideoInfo(null); // Reset YT/Vimeo info

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic client-side validation (optional, supplement Zod)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Video cannot exceed 100MB.',
          variant: 'destructive',
        });
        if (lessonVideoRef.current) lessonVideoRef.current.value = ''; // Clear input
        return;
      }
      const newBlobUrl = URL.createObjectURL(file);
      setCurrentVideoUrlPreview(newBlobUrl);
      form.setValue('lessonVideo', file, { shouldValidate: true });
      setNewVideoFileToUpload(file); // ** Quan trọng: Lưu File object vào state riêng **
      form.setValue('lessonVideo', file, { shouldValidate: true }); // Cập nhật RHF để validate
      toast({ title: 'Video Selected', description: file.name });
    } else {
      setNewVideoFileToUpload(null);
      form.setValue('lessonVideo', null);
    }
  };

  const handleFormSubmit = async (formData: LessonFormData) => {
    console.log('[Submit] Form Data:', formData);
    // Kiểm tra trạng thái video upload
    try {
      let savedLessonId: number | undefined | string = isEditing
        ? initialData?.lessonId
        : undefined;
      let lessonSavedSuccessfully = false;
      // 1. Tạo hoặc Cập nhật Lesson Metadata
      const lessonPayload: CreateLessonData | UpdateLessonData = {
        lessonName: formData.lessonName,
        description: formData.description,
        lessonType: formData.lessonType,
        isFreePreview: formData.isFreePreview,
        textContent:
          formData.lessonType === 'TEXT' ? formData.textContent : null,
        videoSourceType:
          formData.lessonType === 'VIDEO' ? formData.videoSourceType : null,
        // ExternalVideoId sẽ được xử lý cẩn thận
        externalVideoInput: null, // Tạm thời set null
      };

      // Xác định externalVideoId cho API
      if (formData.lessonType === 'VIDEO') {
        if (formData.videoSourceType === 'CLOUDINARY') {
          // Nếu KHÔNG upload file mới VÀ đang edit => giữ ID cũ
          if (
            !newVideoFileToUpload &&
            isEditing &&
            initialData?.videoSourceType === 'CLOUDINARY'
          ) {
            lessonPayload.externalVideoInput = initialData.externalVideoId;
          } else {
            lessonPayload.externalVideoInput = null; // Sẽ được set sau khi upload
          }
        } else if (
          formData.videoSourceType === 'YOUTUBE' ||
          formData.videoSourceType === 'VIMEO'
        ) {
          const id = externalVideoInfo?.id; // Lấy ID đã validate
          if (!id) {
            toast({ title: 'Invalid Link/ID', variant: 'destructive' });
            form.setError('externalVideoInput', {
              message: 'Invalid Link or ID',
            });
            return;
          }
          lessonPayload.externalVideoInput = id;
        }
      } else {
        delete lessonPayload.videoSourceType; // Không cần gửi nếu không phải VIDEO
        delete lessonPayload.externalVideoInput; // Không cần gửi nếu không phải VIDEO
      }

      console.log('[Submit] Lesson Payload before API call:', lessonPayload);

      let lessonResponse: Lesson; // Lưu kết quả lesson đã tạo/sửa

      if (isEditing && currentLessonId) {
        console.log(
          '[Submit] Updating Lesson Metadata:',
          currentLessonId,
          lessonPayload
        );
        lessonResponse = await updateLessonMutateAsync(
          {
            lessonId: currentLessonId,
            data: lessonPayload as UpdateLessonData,
          },
          {
            onSuccess: (data) => {
              toast({
                title: 'Lesson Updated',
                description: 'Lesson metadata updated successfully.',
              });
              queryClient.invalidateQueries({
                queryKey: ['lessons', 'detail', currentLessonId],
              });
            },
            onError: (error: any) => {
              console.error('Error updating lesson metadata:', error);
              toast({
                title: 'Update Failed',
                description:
                  error.message || 'Could not update lesson metadata.',
                variant: 'destructive',
              });
            },
          }
        );
        savedLessonId = lessonResponse.lessonId || currentLessonId; // Cập nhật ID nếu BE trả về
        lessonSavedSuccessfully = true;
      } else {
        console.log('[Submit] Creating New Lesson Metadata:', lessonPayload);
        lessonResponse = await createLessonMutateAsync({
          courseId: Number(courseId),
          sectionId: Number(sectionId),
          data: lessonPayload as CreateLessonData,
        });
        savedLessonId = lessonResponse.lessonId; // Lấy ID mới
        toast({ title: 'Lesson Created', description: 'Metadata saved.' });
        lessonSavedSuccessfully = true;
      }

      if (!savedLessonId) {
        throw new Error('Failed to get Lesson ID after save.');
      }
      savedLessonId = Number(savedLessonId); // Đảm bảo là number
      let videoUploadError: Error | null = null;
      // 2. Upload Video Mới (nếu có)
      if (newVideoFileToUpload && formData.videoSourceType === 'CLOUDINARY') {
        console.log(
          '[Submit] Uploading new Cloudinary video for lesson:',
          savedLessonId
        );
        toast({ title: 'Uploading Video...', description: 'Please wait.' });
        try {
          await updateLessonVideoMutateAsync({
            lessonId: savedLessonId,
            file: newVideoFileToUpload,
          });
          toast({
            title: 'Video Uploaded',
            description: 'Video successfully uploaded.',
          });
          setNewVideoFileToUpload(null); // Reset state file sau khi upload thành công
        } catch (uploadError: any) {
          videoUploadError = uploadError; // Lưu lỗi lại
          toast({
            title: 'Video Upload Failed',
            description: uploadError.message || 'Could not upload video.',
            variant: 'destructive',
          });
          // *** KHÔNG ĐÓNG DIALOG, KHÔNG TIẾP TỤC ***
          // Người dùng cần xử lý lỗi này (ví dụ: chọn lại file)
          return; // Dừng hàm submit ở đây
        }
      }

      // 3. Upload Attachments Mới (nếu có) - dùng state newAttachmentsToUpload
      const attachmentErrors: { fileName: string; reason: string }[] = [];
      if (newAttachmentsToUpload.length > 0 && !videoUploadError) {
        // Chỉ chạy nếu không có lỗi video trước đó
        console.log(
          '[Submit] Uploading new attachments for lesson:',
          savedLessonId
        );
        toast({
          title: 'Uploading Attachments...',
          description: `Uploading ${newAttachmentsToUpload.length} file(s).`,
        });
        const uploadPromises = newAttachmentsToUpload.map((att) =>
          addAttachmentMutateAsync({
            lessonId: savedLessonId as number,
            file: att.file!,
          })
            .then(() => ({ status: 'fulfilled', fileName: att.fileName }))
            .catch((err) => ({
              status: 'rejected',
              fileName: att.fileName,
              reason: err.message || 'Upload failed',
            }))
        );
        const results = await Promise.allSettled(uploadPromises);
        results.forEach((result: any) => {
          if (result.status === 'rejected') {
            attachmentErrors.push({
              fileName: result.reason.fileName,
              reason: result.reason.reason,
            });
            toast({
              title: `Attachment Upload Failed: ${result.reason.fileName}`,
              description: result.reason.reason,
              variant: 'destructive',
            });
          }
        });
        // Reset ngay cả khi có lỗi, vì những cái thành công đã lên rồi
        setNewAttachmentsToUpload([]);
      }

      // 4. Invalidate Query và Đóng Dialog (chỉ đóng nếu không có lỗi nghiêm trọng như upload video)
      if (!videoUploadError) {
        // Chỉ đóng nếu video upload thành công (hoặc không cần upload)
        queryClient.invalidateQueries({
          queryKey: courseKeys.detailById(courseId),
        });
        queryClient.invalidateQueries({
          queryKey: courseKeys.detailBySlug(undefined),
        });
        // Hiển thị thông báo tổng kết nếu có lỗi attachment
        if (attachmentErrors.length > 0) {
          toast({
            title: 'Some Attachments Failed',
            description: `Could not upload ${attachmentErrors.length} attachment(s).`,
            variant: 'destructive',
          });
        } else if (lessonSavedSuccessfully) {
          // Chỉ hiển thị thành công chung nếu mọi thứ (metadata, video, attachment) đều ổn
          toast({
            title: isEditing ? 'Lesson Updated' : 'Lesson Added',
            description: 'All changes saved successfully.',
          });
        }
        onClose();
      }
    } catch (error: any) {
      // Bắt lỗi từ create/update metadata
      console.error('Error saving lesson metadata:', error);
      toast({
        title: 'Save Failed',
        description: error.message || 'Could not save lesson metadata.',
        variant: 'destructive',
      });
      // Không đóng dialog khi lỗi metadata
    }
  };
  // --- Other Handlers (Attachment, Quiz, Subtitle) ---
  // Keep these handlers as they were, ensuring they manage their respective states correctly
  const handleInternalAttachmentUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      const validFiles = files; // Thêm validation nếu cần

      const newUploads = validFiles.map(
        (file) =>
          ({
            tempId: generateTempId('new-attach'),
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            file: file, // Giữ File object ở đây để upload sau
          } as Attachment)
      );

      if (newUploads.length > 0) {
        setNewAttachmentsToUpload((prev) => [...prev, ...newUploads]);
        setAttachments((prev) => [...prev, ...newUploads]); // Thêm vào danh sách hiển thị luôn
        toast({
          title: 'Attachments Ready',
          description: `${newUploads.length} file(s) ready for upload upon saving lesson.`,
        });
      }
      if (attachmentRef.current) attachmentRef.current.value = ''; // Reset input
    }
  };

  const handleInternalRemoveAttachment = async (
    idToRemove: number | string
  ) => {
    const attachment = attachments.find(
      (a) => a.attachmentId === idToRemove || a.tempId === idToRemove
    );
    if (!attachment) return;

    // Nếu là attachment mới (chỉ có tempId và file), chỉ cần xóa khỏi state FE
    if (attachment.tempId && !attachment.attachmentId) {
      if (
        window.confirm(
          `Remove attachment "${attachment.fileName}"? It hasn't been saved yet.`
        )
      ) {
        setAttachments((prev) => prev.filter((a) => a.tempId !== idToRemove));
        setNewAttachmentsToUpload((prev) =>
          prev.filter((a) => a.tempId !== idToRemove)
        ); // Xóa khỏi hàng đợi upload
        toast({
          title: 'Attachment Removed',
          description: `"${attachment.fileName}" removed.`,
        });
      }
      return;
    }

    // Nếu là attachment đã lưu (có id), gọi API xóa
    if (
      attachment.attachmentId &&
      window.confirm(`Permanently delete attachment "${attachment.fileName}"?`)
    ) {
      try {
        await deleteAttachmentMutateAsync({
          lessonId: Number(currentLessonId),
          attachmentId: Number(attachment.attachmentId),
        });
        // Xóa khỏi state hiển thị sau khi API thành công
        setAttachments((prev) =>
          prev.filter((a) => a.attachmentId !== idToRemove)
        );
        toast({
          title: 'Attachment Deleted',
          description: `"${attachment.fileName}" deleted successfully.`,
        });
        // Invalidate query lesson detail để cập nhật danh sách attachments
        queryClient.invalidateQueries({
          queryKey: ['lessonDetail', currentLessonId],
        }); // Giả sử bạn có key này
      } catch (error: any) {
        toast({
          title: 'Delete Failed',
          description: error.message || 'Could not delete attachment.',
          variant: 'destructive',
        });
      }
    }
  };

  const openAddQuizDialog = () => {
    // Chỉ mở dialog nếu lesson đã được lưu (có lessonId)
    if (!currentLessonId) {
      toast({
        title: 'Save Lesson First',
        description: 'Please save the lesson before adding quiz questions.',
        variant: 'destructive',
      });
      return;
    }
    setEditingQuizQuestion(null);
    setQuizDialogOpen(true);
  };

  const openEditQuizDialog = (question: QuizQuestion) => {
    // Chỉ mở dialog nếu lesson đã được lưu
    if (!currentLessonId) return; // Không nên xảy ra nếu question tồn tại
    setEditingQuizQuestion(question);
    setQuizDialogOpen(true);
  };

  const deleteQuizQuestionInternal = async (questionId: number | string) => {
    // *** THAY THẾ BẰNG HOOK DELETE QUESTION ***

    if (!currentLessonId || !questionId || typeof questionId === 'string')
      return; // Cần ID thật

    if (window.confirm('Delete this question and its options?')) {
      try {
        await deleteQuestionMutateAsync({
          lessonId: Number(currentLessonId),
          questionId: Number(questionId),
        }); // Gọi API xóa
        console.log(
          `API call to delete question ${questionId} for lesson ${currentLessonId}`
        ); // Placeholder
        // Cập nhật state cục bộ SAU KHI API thành công (hoặc dựa vào invalidation)
        setQuizQuestions((prev) =>
          prev
            .filter(
              (q) => q.questionId !== questionId && q.tempId !== questionId
            )
            .map((q, index) => ({ ...q, questionOrder: index }))
        );
        toast({ title: 'Question removed' });
        // Invalidate query chi tiết lesson hoặc course
        queryClient.invalidateQueries({
          queryKey: courseKeys.detailById(courseId),
        });
      } catch (error: any) {
        toast({
          title: 'Delete Failed',
          description: error.message || 'Could not delete question.',
          variant: 'destructive',
        });
      }
    }
  };
  // --- Subtitle Logic ---
  const handleAddSubtitle = async () => {
    if (!currentLessonId) {
      toast({
        title: 'Cannot Add Subtitle',
        description: 'Please save the lesson first.',
        variant: 'destructive',
      });
      return;
    }
    if (!newSubtitle.languageCode.trim() || !newSubtitle.subtitleUrl.trim()) {
      toast({
        title: 'Missing Info',
        description: 'Please provide language code, name, and URL.',
        variant: 'destructive',
      });
      return;
    }
    try {
      // Validate URL format before adding
      new URL(newSubtitle.subtitleUrl);
    } catch (_) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid Subtitle URL.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await addSubtitleMutateAsync(
        {
          lessonId: Number(currentLessonId),
          data: {
            languageCode: newSubtitle.languageCode,
            subtitleUrl: newSubtitle.subtitleUrl,
            isDefault: newSubtitle.isDefault,
          },
        },
        {
          onSuccess: (data) => {
            toast({
              title: 'Subtitle Added',
              description: `Subtitle for ${data.languageCode} added successfully.`,
            });
            queryClient.invalidateQueries({
              queryKey: ['lessons', 'detail', currentLessonId],
            });
            // Reset form
            setNewSubtitle({
              languageCode: '',
              subtitleUrl: '',
              isDefault: false,
            });
          },
          onError: (error: any) => {
            console.error('Error adding subtitle:', error);
            toast({
              title: 'Add Subtitle Failed',
              description: 'Could not add subtitle.',
              variant: 'destructive',
            });
          },
        }
      );
    } catch (error: any) {
      toast({
        title: 'Add Subtitle Failed',
        description: 'Could not add subtitle.',
        variant: 'destructive',
      });
    }
  };
  const handleRemoveSubtitle = (idToRemove: number | string) => {
    const subtitle = subtitles.find(
      (s) => s.subtitleId === idToRemove || s.tempId === idToRemove
    );
    if (!subtitle) return;

    setSubtitleToDelete(subtitle); // Lưu subtitle cần xóa vào state
  };
  // const handleRemoveSubtitle = async (idToRemove: number | string) => {
  //   const subtitle = subtitles.find(
  //     (s) => s.subtitleId === idToRemove || s.tempId === idToRemove
  //   );
  //   if (!subtitle || !subtitle.subtitleId) return; // Chỉ xóa cái đã lưu

  //   try {
  //     const confirmDelete = window.confirm(
  //       `Are you sure you want to delete the subtitle "${subtitle.languageName}"?`
  //     );

  //     if (!confirmDelete) return;

  //     await deleteSubtitleMutateAsync(
  //       {
  //         lessonId: Number(currentLessonId),
  //         subtitleId: Number(subtitle.subtitleId),
  //       },
  //       {
  //         onSuccess: () => {
  //           setSubtitles((prev) =>
  //             prev.filter((s) => s.subtitleId !== idToRemove)
  //           );
  //           toast({
  //             title: 'Subtitle Removed',
  //             description: `Subtitle "${subtitle.languageName}" has been successfully removed.`,
  //           });
  //         },
  //         onError: (error: any) => {
  //           toast({
  //             title: 'Remove Subtitle Failed',
  //             description: error.message || 'Could not remove subtitle.',
  //             variant: 'destructive',
  //           });
  //         },
  //       }
  //     );
  //     setSubtitles((prev) => prev.filter((s) => s.subtitleId !== idToRemove));
  //     toast({ title: 'Subtitle Removed' });
  //   } catch (error: any) {
  //     toast({
  //       title: 'Remove Subtitle Failed',
  //       description: error.message || 'Could not remove subtitle.',
  //       variant: 'destructive',
  //     });
  //   }
  // };
  const handleSetDefaultSubtitle = async (idToSet: number | string) => {
    const subtitle = subtitles.find(
      (s) => s.subtitleId === idToSet || s.tempId === idToSet
    );
    if (!subtitle || !subtitle.subtitleId || subtitle.isDefault) return; // Chỉ set cái đã lưu và chưa phải default

    try {
      await setPrimarySubtitleMutateAsync(
        {
          lessonId: Number(currentLessonId),
          subtitleId: Number(subtitle.subtitleId),
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['lessons', 'detail', currentLessonId],
            });
            toast({
              title: 'Default Subtitle Set',
              description: `Subtitle "${subtitle.languageCode}" is now the default.`,
            });
          },
          onError: (error: any) => {
            console.error('Error setting default subtitle:', error);
            toast({
              title: 'Failed to Set Default Subtitle',
              description:
                error?.response?.data?.message ||
                'An error occurred while setting the default subtitle.',
              variant: 'destructive',
            });
          },
        }
      );
    } catch (error) {
      toast({
        title: 'Set Default Subtitle Failed',
        description: error.message || 'Could not set default subtitle.',
        variant: 'destructive',
      });
    }
  };

  // --- RENDER ---
  const videoPreviewSrc =
    currentVideoUrlPreview ||
    (externalVideoInfo
      ? externalVideoInfo.type === 'youtube'
        ? getYoutubeEmbedUrl(externalVideoInfo.id)
        : getVimeoEmbedUrl(externalVideoInfo.id)
      : null);
  const showVideoPreview = !!videoPreviewSrc;
  const showYTOrVimeoPreview = !!externalVideoInfo;
  const showCloudinaryPreview = showVideoPreview && !showYTOrVimeoPreview; // Blob hoặc Signed URL
  const showUploadPlaceholder =
    !showVideoPreview && form.watch('videoSourceType') === 'CLOUDINARY';
  const showLinkPlaceholder =
    !showVideoPreview &&
    (form.watch('videoSourceType') === 'YOUTUBE' ||
      form.watch('videoSourceType') === 'VIMEO');
  console.log('form values', form.getValues());
  console.log(
    'isProcessing || !form.formState.isValid',
    isProcessing,
    !form.formState.isValid,
    isProcessing || !form.formState.isValid
  );
  console.log('Form Errors:', form.formState.errors);
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          {' '}
          <DialogTitle>
            {isEditing ? 'Edit Lesson' : 'Add New Lesson'}
          </DialogTitle>{' '}
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-200px)] pr-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6 p-1"
            >
              {/* --- Basic Fields --- */}
              {/* ... (Fields: lessonName, lessonType, isFreePreview, description) ... */}
              <FormField
                control={form.control}
                name="lessonName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Lesson Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Introduction" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lessonType"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="QUIZ">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFreePreview"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Free Preview</FormLabel>
                      <FormDescription className="text-xs">
                        Allow free access.
                      </FormDescription>
                    </div>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe..."
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* --- VIDEO Section --- */}
              {form.watch('lessonType') === 'VIDEO' && (
                <div className="space-y-4 border rounded-md p-4 bg-muted/20">
                  <h3 className="font-semibold text-base flex items-center">
                    <Video className="h-5 w-5 mr-2 text-primary" /> Video
                    Settings
                  </h3>
                  <FormField
                    control={form.control}
                    name="videoSourceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue('lessonVideo', null);
                            form.setValue('externalVideoInput', '');
                            setCurrentVideoUrlPreview(null);
                            setExternalVideoInfo(null);
                          }}
                          value={field.value ?? 'CLOUDINARY'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CLOUDINARY">
                              <Cloud className="inline-block h-4 w-4 mr-2" />
                              Upload (Cloudinary)
                            </SelectItem>
                            <SelectItem value="YOUTUBE">
                              <LinkIcon className="inline-block h-4 w-4 mr-2" />
                              YouTube Link
                            </SelectItem>
                            <SelectItem value="VIMEO">
                              <LinkIcon className="inline-block h-4 w-4 mr-2" />
                              Vimeo Link
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cloudinary */}
                  {form.watch('videoSourceType') === 'CLOUDINARY' && (
                    <FormField
                      control={form.control}
                      name="lessonVideo"
                      render={({ fieldState }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Video File</FormLabel>
                          <FormControl>
                            <div>
                              <input
                                type="file"
                                ref={lessonVideoRef}
                                accept="video/*"
                                style={{ display: 'none' }}
                                onChange={handleVideoFileChange}
                              />
                              {isLoadingVideoUrl && videoIdToFetchUrl ? (
                                <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-md">
                                  <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                              ) : showCloudinaryPreview ? (
                                <div className="relative group aspect-video">
                                  <video
                                    key={videoPreviewSrc}
                                    src={videoPreviewSrc!}
                                    controls
                                    className="w-full h-full rounded-md bg-black object-contain"
                                    onError={(e) => {
                                      /*...*/
                                    }}
                                  />
                                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 z-10">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="icon"
                                      className="h-8 w-8"
                                      title="Replace"
                                      onClick={() =>
                                        lessonVideoRef.current?.click()
                                      }
                                    >
                                      <Edit size={16} />
                                    </Button>
                                    {videoPreviewSrc?.startsWith('blob:') && (
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8"
                                        title="Remove"
                                        onClick={() => {
                                          if (currentVideoUrlPreview)
                                            URL.revokeObjectURL(
                                              currentVideoUrlPreview
                                            );

                                          setCurrentVideoUrlPreview(null);
                                          form.setValue('lessonVideo', null);
                                        }}
                                      >
                                        <Trash size={16} />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ) : showUploadPlaceholder ? (
                                <div
                                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary"
                                  onClick={() =>
                                    lessonVideoRef.current?.click()
                                  }
                                >
                                  <Upload className="h-10 w-10 mx-auto mb-2" />
                                  <p className="text-sm">
                                    Click or drag & drop
                                  </p>
                                  <span className="text-xs">(Max 100MB)</span>
                                </div>
                              ) : null}
                              {isErrorVideoUrl && videoIdToFetchUrl && (
                                <p className="text-xs text-red-600 mt-1">
                                  Error loading video.
                                </p>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  )}

                  {/* YouTube/Vimeo */}
                  {(form.watch('videoSourceType') === 'YOUTUBE' ||
                    form.watch('videoSourceType') === 'VIMEO') && (
                    <FormField
                      control={form.control}
                      name="externalVideoInput"
                      render={({ field, fieldState }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>
                            {form.watch('videoSourceType')} Link/ID *
                          </FormLabel>
                          {showYTOrVimeoPreview ? (
                            <div className="relative group aspect-video">
                              <AspectRatio
                                ratio={16 / 9}
                                className="bg-muted rounded-md overflow-hidden"
                              >
                                <iframe
                                  key={externalVideoInfo!.id}
                                  className="w-full h-full"
                                  src={videoPreviewSrc!}
                                  title={`${externalVideoInfo!.type} Player`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </AspectRatio>
                              <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 z-10">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  className="h-8 w-8"
                                  title="Change Link"
                                  onClick={() =>
                                    document
                                      .getElementById(`ext-vid-input`)
                                      ?.focus()
                                  }
                                >
                                  <Edit size={16} />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed rounded-md p-6 text-center">
                              <LinkIcon className="h-10 w-10 mx-auto mb-2" />
                              <p className="text-sm">
                                Paste {form.watch('videoSourceType')} link or ID
                                below.
                              </p>
                            </div>
                          )}
                          <FormControl>
                            <Input
                              id="ext-vid-input"
                              placeholder="Paste link or ID"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Subtitles */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-3 text-base flex items-center">
                      {' '}
                      <Captions className="h-5 w-5 mr-2" /> Subtitles{' '}
                    </h4>
                    {/* Form Add Subtitle */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 items-end border-b pb-3">
                      <div className="space-y-1">
                        <Label htmlFor="sub-code" className="text-xs">
                          Language code*
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setNewSubtitle({
                              ...newSubtitle,
                              languageCode: value,
                            })
                          }
                          value={newSubtitle.languageCode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languagesData?.languages?.map((language) => (
                              <SelectItem
                                key={language.languageCode}
                                value={language.languageCode}
                              >
                                {language.languageName} ({language.languageCode}
                                )
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="sub-url" className="text-xs">
                          Subtitles url (.vtt)*
                        </Label>
                        <Input
                          id="sub-url"
                          type="url"
                          placeholder="https://..."
                          value={newSubtitle.subtitleUrl}
                          onChange={(e) =>
                            setNewSubtitle({
                              ...newSubtitle,
                              subtitleUrl: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-2 md:col-span-3">
                        <Checkbox
                          id="sub-default"
                          checked={newSubtitle.isDefault}
                          onCheckedChange={(checked) =>
                            setNewSubtitle({
                              ...newSubtitle,
                              isDefault: !!checked,
                            })
                          }
                        />
                        <Label
                          htmlFor="sub-default"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Set as default
                        </Label>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddSubtitle}
                          className="ml-auto"
                          disabled={
                            isAddingSubtitle ||
                            !newSubtitle.languageCode ||
                            !newSubtitle.subtitleUrl
                          }
                        >
                          {isAddingSubtitle ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4 mr-1" />
                          )}{' '}
                          Add
                        </Button>
                      </div>
                    </div>
                    {/* List Subtitles */}
                    {subtitles.length > 0 ? (
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Manage Subtitles
                        </Label>
                        {subtitles.map((sub) => (
                          <div
                            key={sub.tempId || sub.subtitleId}
                            className="flex items-center justify-between text-sm p-2 border rounded bg-background"
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="defaultSub"
                                id={`def-${sub.tempId || sub.subtitleId}`}
                                checked={sub.isDefault}
                                onChange={() =>
                                  handleSetDefaultSubtitle(
                                    sub.tempId || sub.subtitleId!
                                  )
                                }
                                className="form-radio h-4 w-4"
                              />
                              <Label
                                htmlFor={`def-${sub.tempId || sub.subtitleId}`}
                                className="cursor-pointer flex flex-col"
                              >
                                <span className="font-medium">
                                  ({sub.languageCode})
                                </span>
                                <a
                                  href={sub.subtitleUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-blue-600 hover:underline truncate max-w-[200px] sm:max-w-xs md:max-w-sm"
                                >
                                  {sub.subtitleUrl}
                                </a>
                              </Label>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleRemoveSubtitle(
                                  sub.tempId || sub.subtitleId!
                                )
                              }
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        No subtitles added.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TEXT */}
              {form.watch('lessonType') === 'TEXT' && (
                <FormField
                  control={form.control}
                  name="textContent"
                  render={({ fieldState }) => (
                    <FormItem className="border rounded-md p-4 bg-muted/20">
                      <FormLabel className="font-semibold text-base flex items-center mb-3">
                        {' '}
                        <FileText /> Content *{' '}
                      </FormLabel>
                      <FormControl>
                        <Controller
                          name="textContent"
                          control={form.control}
                          render={({ field: ctrlField }) => (
                            <TiptapEditor
                              initialContent={ctrlField.value || ''}
                              onContentChange={ctrlField.onChange}
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              )}

              {/* QUIZ */}
              {form.watch('lessonType') === 'QUIZ' && (
                <div className="space-y-4 border rounded-md p-4 bg-muted/20">
                  <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <h3 className="font-semibold text-base flex items-center">
                      <BookIcon /> Questions
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openAddQuizDialog}
                    >
                      <Plus /> Add
                    </Button>
                  </div>
                  {quizQuestions.length > 0 ? (
                    <div className="space-y-3 mt-2">
                      {quizQuestions.map((q, index) => (
                        <div
                          key={q.tempId || q.questionId}
                          className="border rounded-md p-3 bg-background"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium text-sm flex-1 mr-2">
                              Q{index + 1}:{' '}
                              <span className="font-normal line-clamp-2">
                                {q.questionText}
                              </span>
                            </p>
                            <div className="flex space-x-1 shrink-0">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => openEditQuizDialog(q)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  deleteQuizQuestionInternal(
                                    q.tempId || q.questionId!
                                  )
                                }
                              >
                                <Trash size={16} className="text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            {q.options.map((opt) => (
                              <li
                                key={opt.tempId || opt.optionId}
                                className={`text-xs ${
                                  opt.isCorrectAnswer ? 'text-green-600' : ''
                                }`}
                              >
                                {opt.optionText}
                                {opt.isCorrectAnswer && ' ✔️'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border border-dashed rounded-md">
                      <p className="text-sm mb-2">No questions yet.</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={openAddQuizDialog}
                      >
                        <Plus /> Add Question
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Attachments */}
              <div className="border rounded-md p-4 space-y-3 bg-muted/20">
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                  <h3 className="font-semibold text-base flex items-center">
                    <FileIcon /> Attachments
                  </h3>
                  <div>
                    <input
                      type="file"
                      ref={attachmentRef}
                      style={{ display: 'none' }}
                      onChange={handleInternalAttachmentUpload}
                      multiple
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => attachmentRef.current?.click()}
                      disabled={isUploadingAttachment}
                    >
                      <Upload className="h-4 w-4 mr-1" />{' '}
                      {isUploadingAttachment ? 'Uploading...' : 'Add Files'}
                    </Button>
                  </div>
                </div>
                {/* Danh sách attachment ĐÃ LƯU */}
                {attachments.filter((a) => a.attachmentId).length > 0 && (
                  <div className="space-y-2 border-b pb-2 mb-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Uploaded Files
                    </Label>
                    {attachments
                      .filter((a) => a.attachmentId)
                      .map((att) => (
                        <div
                          key={att.attachmentId}
                          className="flex items-center justify-between p-2 border rounded bg-background"
                        >
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <FileIcon size={16} />
                            <span
                              className="text-sm truncate"
                              title={att.fileName}
                            >
                              {att.fileName}
                            </span>
                            {att.fileSize && (
                              <span className="text-xs text-muted-foreground shrink-0">
                                ({(att.fileSize / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              handleInternalRemoveAttachment(att.attachmentId!)
                            }
                            disabled={isDeletingAttachment}
                          >
                            <Trash size={16} className="text-destructive" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
                {/* Danh sách attachment MỚI CHƯA LƯU */}
                {newAttachmentsToUpload.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      New Files (will upload on save)
                    </Label>
                    {newAttachmentsToUpload.map((att) => (
                      <div
                        key={att.tempId}
                        className="flex items-center justify-between p-2 border rounded bg-muted"
                      >
                        <div className="flex items-center space-x-2 overflow-hidden">
                          <FileIcon size={16} />
                          <span
                            className="text-sm truncate"
                            title={att.fileName}
                          >
                            {att.fileName}
                          </span>
                          {att.fileSize && (
                            <span className="text-xs text-muted-foreground shrink-0">
                              ({(att.fileSize / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleInternalRemoveAttachment(att.tempId!)
                          }
                        >
                          <Trash size={16} className="text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {attachments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No attachments.
                  </p>
                )}
              </div>

              {/* Footer Buttons */}
              <DialogFooter className="pt-6 sticky bottom-0 bg-background/95 backdrop-blur-sm pb-4 -mx-1 -mb-1 px-1 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing || !form.formState.isValid}
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isEditing ? 'Update Lesson' : 'Add Lesson'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
        {/* Nested Quiz Dialog */}
        {quizDialogOpen && (
          <QuizQuestionDialog
            key={
              editingQuizQuestion?.tempId ||
              editingQuizQuestion?.questionId ||
              'new-quiz-q'
            }
            open={quizDialogOpen}
            onClose={() => setQuizDialogOpen(false)}
            initialData={editingQuizQuestion}
            isEditing={!!editingQuizQuestion}
            lessonId={Number(currentLessonId)}
            courseId={courseId}
          />
        )}

        {subtitleToDelete && (
          <Dialog
            open={!!subtitleToDelete}
            onOpenChange={() => setSubtitleToDelete(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete the subtitle "
                <strong>{subtitleToDelete.languageCode}</strong>"?
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSubtitleToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await deleteSubtitleMutateAsync(
                        {
                          lessonId: Number(currentLessonId),
                          subtitleId: Number(subtitleToDelete.subtitleId),
                        },
                        {
                          onSuccess: () => {
                            toast({
                              title: 'Subtitle Removed',
                              description: `Subtitle "${subtitleToDelete.languageCode}" has been successfully removed.`,
                            });
                            queryClient.invalidateQueries({
                              queryKey: ['lessons', 'detail', currentLessonId],
                            });
                          },
                          onError: (error: any) => {
                            toast({
                              title: 'Remove Subtitle Failed',
                              description:
                                error.message || 'Could not remove subtitle.',
                              variant: 'destructive',
                            });
                          },
                        }
                      );

                      toast({
                        title: 'Subtitle Removed',
                        description: `Subtitle "${subtitleToDelete.languageCode}" has been successfully removed.`,
                      });
                    } catch (error: any) {
                      toast({
                        title: 'Remove Subtitle Failed',
                        description:
                          error.message || 'Could not remove subtitle.',
                        variant: 'destructive',
                      });
                    } finally {
                      setSubtitleToDelete(null); // Đóng dialog
                    }
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LessonDialog;
