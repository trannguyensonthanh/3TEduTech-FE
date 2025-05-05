// src/hooks/queries/lesson.queries.ts
import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  createLesson,
  updateLessonsOrder,
  updateLesson,
  deleteLesson,
  getLessonById,
  updateLessonVideo,
  addLessonAttachment,
  deleteLessonAttachment,
  getQuizQuestionsForLesson,
  createQuizQuestion, // Import thêm hàm quiz
  Lesson,
  Attachment,
  LessonListData,
  CreateLessonData,
  UpdateLessonData,
  LessonOrderData,
  QuizQuestion,
  CreateQuestionData,
  getLessonVideoSignedUrl,
} from '@/services/lesson.service'; // Đảm bảo service export đủ
import { courseKeys } from './course.queries'; // Cần để invalidate course detail

// Query Key Factory
const lessonKeys = {
  all: ['lessons'] as const,
  lists: (sectionId?: number) =>
    [...lessonKeys.all, 'list', { sectionId }] as const, // Key cho list theo section
  details: () => [...lessonKeys.all, 'detail'] as const,
  detail: (id: number | undefined) => [...lessonKeys.details(), id] as const,
  quizQuestions: (lessonId?: number) =>
    [...lessonKeys.all, 'quizQuestions', { lessonId }] as const, // Key cho quiz questions
  videoUrl: (id: number | undefined) =>
    [...lessonKeys.all, 'videoUrl', id] as const, // Key cho signed URL
};

// --- Queries ---

/** Hook lấy chi tiết lesson */
export const useLessonDetail = (
  lessonId: number | undefined,
  options?: Omit<UseQueryOptions<Lesson, Error>, 'queryKey' | 'queryFn'>
) => {
  const queryKey = lessonKeys.detail(lessonId);
  return useQuery<Lesson, Error>({
    queryKey: queryKey,
    queryFn: () => getLessonById(lessonId!),
    enabled: !!lessonId,
    ...options,
  });
};

/** Hook lấy Signed URL cho video private */
export const useLessonVideoUrl = (
  lessonId: number | undefined,
  options?: Omit<
    UseQueryOptions<{ signedUrl: string }, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = lessonKeys.videoUrl(lessonId);
  return useQuery<{ signedUrl: string }, Error>({
    queryKey: queryKey,
    queryFn: () => getLessonVideoSignedUrl(lessonId!),
    enabled: !!lessonId, // Chỉ fetch khi có lessonId
    staleTime: 1000 * 60 * 50, // Cache URL trong 50 phút (ít hơn thời hạn 1 giờ của URL)
    refetchOnWindowFocus: false, // Không cần refetch khi focus lại cửa sổ
    refetchOnReconnect: false,
    retry: 1, // Thử lại 1 lần nếu lỗi
    ...options,
  });
};

/** Hook lấy câu hỏi quiz của lesson (Instructor) */
export const useLessonQuizQuestions = (
  lessonId: number | undefined,
  options?: Omit<
    UseQueryOptions<{ questions: QuizQuestion[] }, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = lessonKeys.quizQuestions(lessonId);
  return useQuery<{ questions: QuizQuestion[] }, Error>({
    queryKey: queryKey,
    queryFn: () => getQuizQuestionsForLesson(lessonId!),
    enabled: !!lessonId,
    ...options,
  });
};

// --- Mutations ---

/** Hook tạo lesson */
export const useCreateLesson = (
  options?: UseMutationOptions<
    Lesson,
    Error,
    { courseId: number; sectionId: number; data: CreateLessonData }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Lesson,
    Error,
    { courseId: number; sectionId: number; data: CreateLessonData }
  >({
    mutationFn: ({ courseId, sectionId, data }) =>
      createLesson(courseId, sectionId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailById(variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailBySlug(undefined),
      });
      console.log('Lesson created successfully.');
    },
    onError: (error) => {
      console.error('Lesson creation failed:', error.message);
    },
    ...options,
  });
};

/** Hook cập nhật thứ tự lessons */
export const useUpdateLessonsOrder = (
  options?: UseMutationOptions<
    LessonListData,
    Error,
    { courseId: number; sectionId: number; lessonOrders: LessonOrderData[] }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    LessonListData,
    Error,
    { courseId: number; sectionId: number; lessonOrders: LessonOrderData[] }
  >({
    mutationFn: ({ courseId, sectionId, lessonOrders }) =>
      updateLessonsOrder(courseId, sectionId, lessonOrders),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailById(variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailBySlug(undefined),
      });
      console.log('Lessons order updated.');
    },
    onError: (error) => {
      console.error('Update lessons order failed:', error.message);
    },
    ...options,
  });
};

/** Hook cập nhật lesson */
export const useUpdateLesson = (
  options?: UseMutationOptions<
    Lesson,
    Error,
    { lessonId: number; data: UpdateLessonData }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Lesson,
    Error,
    { lessonId: number; data: UpdateLessonData }
  >({
    mutationFn: ({ lessonId, data }) => updateLesson(lessonId, data),
    onSuccess: (updatedLesson) => {
      queryClient.setQueryData(
        lessonKeys.detail(updatedLesson.LessonID),
        updatedLesson
      );
      // Invalidate course detail chứa lesson này
      // Cần lấy courseId từ lesson? Hơi phức tạp. Tạm invalidate all course details
      queryClient.invalidateQueries({ queryKey: courseKeys.details() });
      console.log('Lesson updated successfully.');
    },
    onError: (error) => {
      console.error('Lesson update failed:', error.message);
    },
    ...options,
  });
};

/** Hook xóa lesson */
export const useDeleteLesson = (
  options?: UseMutationOptions<
    void,
    Error,
    { lessonId: number; courseId?: number }
  >
) => {
  const queryClient = useQueryClient();
  // courseId optional, chỉ dùng để invalidate cache course nếu có
  return useMutation<void, Error, { lessonId: number; courseId?: number }>({
    mutationFn: ({ lessonId }) => deleteLesson(lessonId),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: lessonKeys.detail(variables.lessonId),
      });
      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: courseKeys.detailById(variables.courseId),
        });
        queryClient.invalidateQueries({
          queryKey: courseKeys.detailBySlug(undefined),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: courseKeys.details() });
      }
      console.log('Lesson deleted successfully.');
    },
    onError: (error) => {
      console.error('Lesson deletion failed:', error.message);
    },
    ...options,
  });
};

/** Hook cập nhật video bài học */
export const useUpdateLessonVideo = (
  options?: UseMutationOptions<Lesson, Error, { lessonId: number; file: File }>
) => {
  const queryClient = useQueryClient();
  return useMutation<Lesson, Error, { lessonId: number; file: File }>({
    mutationFn: ({ lessonId, file }) => updateLessonVideo(lessonId, file),
    onSuccess: (updatedLesson) => {
      queryClient.setQueryData(
        lessonKeys.detail(updatedLesson.LessonID),
        updatedLesson
      );
      queryClient.invalidateQueries({ queryKey: courseKeys.details() }); // Invalidate course chứa lesson
      console.log('Lesson video updated successfully.');
    },
    onError: (error) => {
      console.error('Lesson video update failed:', error.message);
    },
    ...options,
  });
};

/** Hook thêm attachment */
export const useAddLessonAttachment = (
  options?: UseMutationOptions<
    Attachment,
    Error,
    { lessonId: number; file: File }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<Attachment, Error, { lessonId: number; file: File }>({
    mutationFn: ({ lessonId, file }) => addLessonAttachment(lessonId, file),
    onSuccess: (data, variables) => {
      // Invalidate cache chi tiết lesson để load lại attachment
      queryClient.invalidateQueries({
        queryKey: lessonKeys.detail(variables.lessonId),
      });
      console.log('Attachment added successfully.');
    },
    onError: (error) => {
      console.error('Add attachment failed:', error.message);
    },
    ...options,
  });
};

/** Hook xóa attachment */
export const useDeleteLessonAttachment = (
  options?: UseMutationOptions<
    void,
    Error,
    { lessonId: number; attachmentId: number }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { lessonId: number; attachmentId: number }>({
    mutationFn: ({ lessonId, attachmentId }) =>
      deleteLessonAttachment(lessonId, attachmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: lessonKeys.detail(variables.lessonId),
      });
      console.log('Attachment deleted successfully.');
    },
    onError: (error) => {
      console.error('Delete attachment failed:', error.message);
    },
    ...options,
  });
};

// --- Quiz Question Mutations (Instructor) ---

/** Hook tạo câu hỏi quiz */
export const useCreateQuizQuestion = (
  options?: UseMutationOptions<
    QuizQuestion,
    Error,
    { lessonId: number; data: CreateQuestionData }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    QuizQuestion,
    Error,
    { lessonId: number; data: CreateQuestionData }
  >({
    mutationFn: ({ lessonId, data }) => createQuizQuestion(lessonId, data),
    onSuccess: (data, variables) => {
      // Invalidate danh sách câu hỏi của lesson đó
      queryClient.invalidateQueries({
        queryKey: lessonKeys.quizQuestions(variables.lessonId),
      });
      console.log('Quiz question created successfully.');
    },
    onError: (error) => {
      console.error('Quiz question creation failed:', error.message);
    },
    ...options,
  });
};
