// src/services/lesson.service.ts
import { QuizQuestion, Subtitle } from '@/hooks/useCourseCurriculum';
import apiHelper, { fetchWithAuth } from './apiHelper'; // Import fetchWithAuth nếu cần cho upload

// export interface Lesson {
//   LessonID: number;
//   SectionID: number;
//   LessonName: string;
//   Description?: string | null;
//   LessonOrder: number;
//   LessonType: 'VIDEO' | 'TEXT' | 'QUIZ';
//   VideoUrl?: string | null;
//   ExternalVideoID?: string | null;
//   ThumbnailUrl?: string | null;
//   VideoDurationSeconds?: number | null;
//   TextContent?: string | null;
//   IsFreePreview: boolean;
//   VideoPublicId?: string | null; // Thêm để quản lý xóa video
//   CreatedAt: string;
//   UpdatedAt: string;
//   // Có thể có attachments hoặc quiz info nếu API trả về
//   attachments?: Attachment[];
// }
export interface Lesson {
  tempId: string; // ID tạm để FE quản lý local
  lessonId?: number; // optional: có nếu đang edit
  sectionId: number;
  lessonName: string;
  description?: string | null;
  lessonOrder: number;
  lessonType: 'VIDEO' | 'TEXT' | 'QUIZ';
  isFreePreview: boolean;

  // VIDEO-related
  videoSourceType?: 'CLOUDINARY' | 'YOUTUBE' | 'VIMEO';
  externalVideoInput?: string | null; // nếu dùng YT/Vimeo
  lessonVideo?: File | null; // file upload nếu dùng Cloudinary
  lessonVideoPreview?: string | null; // URL preview

  videoPublicId?: string | null; // nếu edit lại video Cloudinary
  videoDurationSeconds?: number | null;

  // TEXT-related
  textContent?: string | null;

  // QUIZ-related
  quizQuestions?: QuizQuestion[]; // nếu là bài quiz

  // SUBTITLES (nếu dùng video + phụ đề)
  subtitles?: Subtitle[];
  createdAt: string;
  updatedAt: string;
  // Có thể có attachments hoặc quiz info nếu API trả về
  attachments?: Attachment[];
}

// export interface Attachment {
//   AttachmentID: number;
//   LessonID: number;
//   FileName: string;
//   FileURL: string;
//   FileType?: string | null;
//   FileSize?: number | null;
//   CloudStorageID?: string | null; // Quan trọng để xóa
//   UploadedAt: string;
// }
export interface Attachment {
  attachmentId: number;
  lessonId: number;
  fileName: string;
  fileUrl?: string;
  file?: File | null; // file mới upload
  fileType?: string | null;
  fileSize?: number | null;
  cloudStorageId?: string | null; // Quan trọng để xóa
  uploadedAt: string;
}

export interface LessonListData {
  lessons: Lesson[];
}

export interface CreateLessonData {
  // sectionId lấy từ URL
  lessonName: string;
  lessonType: 'VIDEO' | 'TEXT' | 'QUIZ';
  description?: string;
  videoUrl?: string; // Có thể ko cần nếu upload sau
  externalVideoId?: string;
  thumbnailUrl?: string;
  videoSourceType?: 'YOUTUBE' | 'VIMEO' | 'CLOUDINARY'; // Nếu có
  externalVideoInput?: string; // Nếu có
  videoDurationSeconds?: number;
  textContent?: string;
  isFreePreview?: boolean;
}

export interface UpdateLessonData {
  lessonName?: string;
  description?: string;
  lessonType?: 'VIDEO' | 'TEXT' | 'QUIZ';
  videoUrl?: string | null; // Cho phép null để xóa link
  externalVideoId?: string | null;
  thumbnailUrl?: string | null;
  videoDurationSeconds?: number | null;
  textContent?: string | null;
  isFreePreview?: boolean;
}

export interface LessonOrderData {
  id: number; // LessonID
  order: number;
}

// --- Lesson APIs ---

/** Lấy danh sách lessons của section */
export const getLessons = async (
  courseId: number,
  sectionId: number
): Promise<LessonListData> => {
  // API này thường không gọi riêng lẻ
  return apiHelper.get(`/courses/${courseId}/sections/${sectionId}/lessons`);
};

/** Tạo lesson mới */
export const createLesson = async (
  courseId: number,
  sectionId: number,
  data: CreateLessonData
): Promise<Lesson> => {
  return apiHelper.post(
    `/courses/${courseId}/sections/${sectionId}/lessons`,
    data
  );
};

/** Cập nhật thứ tự lessons */
export const updateLessonsOrder = async (
  courseId: number,
  sectionId: number,
  lessonOrders: LessonOrderData[]
): Promise<LessonListData> => {
  // Giả sử API nhận mảng trực tiếp
  return apiHelper.patch(
    `/courses/${courseId}/sections/${sectionId}/lessons/order`,
    lessonOrders
  );
};

/** Lấy chi tiết lesson */
export const getLessonById = async (lessonId: number): Promise<Lesson> => {
  // API này dùng ID lesson trực tiếp
  return apiHelper.get(`/lessons/${lessonId}`);
};

/** Cập nhật lesson */
export const updateLesson = async (
  lessonId: number,
  data: UpdateLessonData
): Promise<Lesson> => {
  return apiHelper.patch(`/lessons/${lessonId}`, data);
};

/** Xóa lesson */
export const deleteLesson = async (lessonId: number): Promise<void> => {
  await apiHelper.delete(`/lessons/${lessonId}`);
};

/** Upload/Cập nhật video bài học */
export const updateLessonVideo = async (
  lessonId: number,
  file: File
): Promise<Lesson> => {
  const formData = new FormData();
  formData.append('video', file);
  const API_BASE_URL: string = 'http://localhost:5000/v1';
  const url = new URL(`${API_BASE_URL}/lessons/${lessonId}/video`);
  return fetchWithAuth(url, {
    method: 'PATCH',
    body: formData,
  });
};

/** Lấy Signed URL cho video private */
export const getLessonVideoSignedUrl = async (
  lessonId: number
): Promise<{ signedUrl: string }> => {
  return apiHelper.get(`/lessons/${lessonId}/video-url`);
};

// --- Attachment APIs ---

/** Thêm file đính kèm */
export const addLessonAttachment = async (
  lessonId: number,
  file: File
): Promise<Attachment> => {
  const formData = new FormData();
  formData.append('attachment', file);
  const API_BASE_URL: string = 'http://localhost:5000/v1';
  const url = new URL(`${API_BASE_URL}/lessons/${lessonId}/attachments`);
  return fetchWithAuth(url, {
    method: 'POST',
    body: formData,
  });
};

/** Xóa file đính kèm */
export const deleteLessonAttachment = async (
  lessonId: number,
  attachmentId: number
): Promise<void> => {
  await apiHelper.delete(`/lessons/${lessonId}/attachments/${attachmentId}`);
};

// --- Quiz Question APIs (Quản lý bởi Instructor) ---
// Các hàm này sẽ gọi đến endpoints quản lý quiz questions, có thể là lồng trong lesson hoặc đứng riêng

// export interface QuizQuestion {
//   QuestionID: number;
//   LessonID: number;
//   QuestionText: string;
//   Explanation?: string | null;
//   QuestionOrder: number;
//   options: QuizOption[];
// }
// export interface QuizOption {
//   OptionID: number;
//   QuestionID: number;
//   OptionText: string;
//   IsCorrectAnswer: boolean;
//   OptionOrder: number;
// }
export interface CreateQuestionData {
  questionText: string;
  explanation?: string;
  questionOrder?: number; // Service backend tự tính?
  options: {
    optionText: string;
    isCorrectAnswer: boolean;
    optionOrder: number;
  }[];
}
export interface UpdateQuestionData {
  questionText?: string;
  explanation?: string;
  questionOrder?: number;
  options?: {
    optionText: string;
    isCorrectAnswer: boolean;
    optionOrder: number;
  }[];
}

/** Instructor: Lấy danh sách câu hỏi quiz của bài học */
export const getQuizQuestionsForLesson = async (
  lessonId: number
): Promise<{ questions: QuizQuestion[] }> => {
  return apiHelper.get(`/lessons/${lessonId}/quiz/questions`);
};

/** Instructor: Tạo câu hỏi quiz mới */
export const createQuizQuestion = async (
  lessonId: number,
  data: CreateQuestionData
): Promise<QuizQuestion> => {
  return apiHelper.post(`/lessons/${lessonId}/quiz/questions`, data);
};

/** Instructor: Cập nhật câu hỏi quiz */
export const updateQuizQuestion = async (
  questionId: number,
  data: UpdateQuestionData
): Promise<QuizQuestion> => {
  // Endpoint này đứng riêng
  return apiHelper.patch(`/quiz-questions/${questionId}`, data);
};

/** Instructor: Xóa câu hỏi quiz */
export const deleteQuizQuestion = async (questionId: number): Promise<void> => {
  // Endpoint này đứng riêng
  await apiHelper.delete(`/quiz-questions/${questionId}`);
};
