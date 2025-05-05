// src/services/review.service.ts
import apiHelper from './apiHelper';

export interface Review {
  ReviewID: number;
  CourseID: number;
  AccountID: number;
  Rating: number;
  Comment?: string | null;
  ReviewedAt: string; // ISO Date string
  // Thông tin join
  UserFullName?: string;
  UserAvatar?: string | null;
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  averageRating: number | null;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string; // 'ReviewedAt:desc', 'Rating:desc', etc.
  rating?: number; // 1-5
}

export interface CreateUpdateReviewData {
  rating: number; // 1-5
  comment?: string;
}

/** Tạo hoặc cập nhật đánh giá */
export const createOrUpdateReview = async (
  courseId: number,
  data: CreateUpdateReviewData
): Promise<Review> => {
  return apiHelper.post(`/courses/${courseId}/reviews`, data);
};

/** Lấy danh sách đánh giá của khóa học */
export const getReviewsByCourse = async (
  courseId: number,
  params?: ReviewQueryParams
): Promise<ReviewListResponse> => {
  return apiHelper.get(`/courses/${courseId}/reviews`, undefined, params);
};

/** Lấy đánh giá của user hiện tại cho khóa học */
export const getMyReviewForCourse = async (
  courseId: number
): Promise<Review | null> => {
  // API trả về null nếu chưa có review
  return apiHelper.get(`/courses/${courseId}/my-review`);
};

/** Xóa đánh giá */
export const deleteReview = async (reviewId: number): Promise<void> => {
  // API này đứng riêng
  await apiHelper.delete(`/reviews/${reviewId}`);
};
