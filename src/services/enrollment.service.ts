// src/services/enrollment.service.ts
import apiHelper from './apiHelper';

export interface Enrollment {
  EnrollmentID: number;
  AccountID: number;
  CourseID: number;
  EnrolledAt: string; // ISO Date string
  PurchasePrice: number;
  // Thông tin join (từ API response)
  CourseName?: string;
  Slug?: string;
  ThumbnailUrl?: string | null;
  ShortDescription?: string;
  InstructorName?: string;
  // Thêm progress nếu API trả về
  progressPercentage?: number;
}

export interface EnrollmentListResponse {
  enrollments: Enrollment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EnrollmentQueryParams {
  page?: number;
  limit?: number;
}

/** Lấy danh sách khóa học đã đăng ký của user hiện tại */
export const getMyEnrollments = async (
  params?: EnrollmentQueryParams
): Promise<EnrollmentListResponse> => {
  return apiHelper.get('/enrollments/me', undefined, params);
};

/** User tự đăng ký khóa học (miễn phí/test) */
export const enrollCourse = async (courseId: number): Promise<Enrollment> => {
  // API này có thể không cần body nếu giá được xác định ở backend
  return apiHelper.post(`/enrollments/courses/${courseId}`);
};

// Hàm isUserEnrolled thường được dùng nội bộ ở service khác, không cần gọi API trực tiếp từ FE
// Nếu FE cần check thì có thể gọi getMyEnrollments và kiểm tra hoặc tạo API riêng
