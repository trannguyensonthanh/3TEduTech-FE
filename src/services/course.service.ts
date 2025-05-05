/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/course.service.ts
import apiHelper, { fetchWithAuth } from './apiHelper';

// --- Kiểu dữ liệu (Ví dụ - cần định nghĩa chi tiết hơn) ---
export interface Course {
  CourseID: number;
  CourseName: string;
  Slug: string;
  ShortDescription: string;
  FullDescription: string;
  Requirements?: string | null;
  LearningOutcomes?: string | null;
  ThumbnailUrl?: string | null;
  ThumbnailPublicId?: string | null; // Thêm nếu cần quản lý xóa
  IntroVideoUrl?: string | null;
  OriginalPrice: number;
  DiscountedPrice?: number | null;
  InstructorID: number;
  CategoryID: number;
  LevelID: number;
  Language: string;
  StatusID: string; // CourseStatus Enum
  PublishedAt?: string | null; // ISO Date string
  IsFeatured: boolean;
  CreatedAt: string; // ISO Date string
  UpdatedAt: string; // ISO Date string
  // Thông tin join (từ API response)
  CategoryName?: string;
  LevelName?: string;
  StatusName?: string;
  InstructorName?: string;
  InstructorAvatar?: string | null;
  AverageRating?: number | null;
  ReviewCount?: number;
  // Thông tin lồng nhau (từ API get detail)
  sections?: SectionWithLessons[];
  isEnrolled?: boolean;
  userProgress?: Record<
    number,
    { isCompleted: boolean; lastWatchedPosition: number | null }
  >;
}

export interface SectionWithLessons {
  SectionID: number;
  SectionName: string;
  SectionOrder: number;
  Description?: string | null;
  lessons: Lesson[]; // Lesson type cần định nghĩa ở lesson.service
}

export interface Lesson {
  // Định nghĩa tạm ở đây, nên có ở lesson.service
  LessonID: number;
  LessonName: string;
  LessonType: string; // LessonType Enum
  IsFreePreview: boolean;
  VideoDurationSeconds?: number | null;
  // Các trường nội dung (VideoUrl, TextContent) có thể bị ẩn
  [key: string]: any;
}

export interface CourseListResponse {
  courses: Partial<Course>[]; // Danh sách course với thông tin rút gọn
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CourseQueryParams {
  page?: number;
  limit?: number; // 0 = all
  search?: string;
  categoryId?: number;
  levelId?: number;
  instructorId?: number;
  statusId?: string; // CourseStatus Enum hoặc 'ALL'
  isFeatured?: boolean;
  sortBy?: string; // e.g., 'CreatedAt:desc'
}

export interface CreateCourseData {
  courseName: string;
  categoryId: number;
  levelId: number;
  shortDescription: string;
  fullDescription: string;
  requirements?: string;
  learningOutcomes?: string;
  thumbnailUrl?: string; // URL ban đầu có thể ko cần nếu upload sau
  introVideoUrl?: string;
  originalPrice: number;
  discountedPrice?: number;
  language?: string;
}

export interface UpdateCourseData {
  courseName?: string;
  categoryId?: number;
  levelId?: number;
  shortDescription?: string;
  fullDescription?: string;
  requirements?: string;
  learningOutcomes?: string;
  thumbnailUrl?: string; // Có thể cập nhật URL trực tiếp hoặc qua API upload
  introVideoUrl?: string;
  originalPrice?: number;
  discountedPrice?: number | null;
  language?: string;
  slug?: string;
}

export interface SubmitCourseData {
  notes?: string;
}

export interface ReviewCourseData {
  decision: 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
  adminNotes?: string;
}

export interface ToggleFeatureData {
  isFeatured: boolean;
}

export interface ApprovalRequest {
  RequestID: number;
  CourseID: number;
  // Thêm các trường khác nếu cần
  [key: string]: any;
}

// --- Hàm gọi API ---

/** Lấy danh sách khóa học */
export const getCourses = async (
  params?: CourseQueryParams
): Promise<CourseListResponse> => {
  return apiHelper.get('/courses', undefined, params);
};

/** Instructor: Tạo khóa học mới */
export const createCourse = async (data: CreateCourseData): Promise<Course> => {
  return apiHelper.post('/courses', data);
};

/** Lấy chi tiết khóa học theo slug */
export const getCourseBySlug = async (slug: string): Promise<Course> => {
  // apiHelper sẽ tự động gửi token nếu có, service backend sẽ xử lý quyền xem
  return apiHelper.get(`/courses/${slug}`);
};

/** Instructor/Admin: Cập nhật khóa học */
export const updateCourse = async (
  courseId: number,
  data: UpdateCourseData
): Promise<Course> => {
  return apiHelper.patch(`/courses/${courseId}`, data);
};

/** Instructor/Admin: Xóa khóa học */
export const deleteCourse = async (courseId: number): Promise<void> => {
  await apiHelper.delete(`/courses/${courseId}`);
};

/** Instructor/Admin: Upload/Cập nhật thumbnail */
export const updateCourseThumbnail = async (
  courseId: number,
  file: File
): Promise<Course> => {
  const formData = new FormData();
  formData.append('thumbnail', file);
  // Dùng fetch trực tiếp hoặc tạo hàm riêng trong apiHelper cho FormData
  // Giả sử apiHelper.patch có thể xử lý FormData (cần kiểm tra lại apiHelper)
  // return apiHelper.patch(`/courses/${courseId}/thumbnail`, formData, undefined, { 'Content-Type': undefined }); // Xóa content-type
  const API_BASE_URL: string = 'http://localhost:5000/v1';
  const url = new URL(`${API_BASE_URL}/courses/${courseId}/thumbnail`);
  return fetchWithAuth(url, {
    // Sử dụng fetchWithAuth đã có
    method: 'PATCH',
    body: formData,
    // Không cần set Content-Type, browser tự làm cho FormData
  });
};

/** Instructor/Admin: Upload/Cập nhật video giới thiệu */
export const updateCourseIntroVideo = async (
  courseId: number,
  file: File
): Promise<Course> => {
  const formData = new FormData();
  formData.append('introVideo', file); // Tên field phải khớp với Multer backend
  const API_BASE_URL: string = 'http://localhost:5000/v1'; // Nên lấy từ config
  const url = new URL(`${API_BASE_URL}/courses/${courseId}/intro-video`);
  return fetchWithAuth(url, {
    method: 'PATCH',
    body: formData,
  });
};

/** Instructor: Gửi duyệt khóa học */
export const submitCourseForApproval = async (
  courseId: number,
  data?: SubmitCourseData
): Promise<{ message: string; request: ApprovalRequest }> => {
  return apiHelper.post(`/courses/${courseId}/submit`, data || {});
};

/** Admin: Duyệt/Từ chối yêu cầu */
export const reviewCourseApproval = async (
  requestId: number,
  data: ReviewCourseData
): Promise<{ message: string; request: ApprovalRequest }> => {
  // Lưu ý đường dẫn API có thể là /approval-requests/:requestId/review
  // return apiHelper.patch(`/courses/reviews/${requestId}`, data); // Đường dẫn cũ
  return apiHelper.patch(`/approval-requests/${requestId}/review`, data); // Đường dẫn đề xuất
};

/** Admin: Đánh dấu/bỏ đánh dấu nổi bật */
export const toggleCourseFeature = async (
  courseId: number,
  data: ToggleFeatureData
): Promise<Course> => {
  return apiHelper.patch(`/courses/${courseId}/feature`, data);
};
