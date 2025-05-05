// src/services/progress.service.ts
import apiHelper from './apiHelper';

export interface LessonProgress {
  ProgressID: number;
  AccountID: number;
  LessonID: number;
  IsCompleted: boolean;
  CompletedAt?: string | null; // ISO Date string
  LastWatchedPosition?: number | null; // seconds
  LastWatchedAt?: string | null; // ISO Date string
}

export interface CourseProgressResponse {
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  progressDetails: LessonProgress[]; // Chi tiết từng bài
}

/** Đánh dấu bài học hoàn thành/chưa hoàn thành */
export const markLessonCompletion = async (
  lessonId: number,
  isCompleted: boolean
): Promise<LessonProgress> => {
  return apiHelper.post(`/progress/lessons/${lessonId}/complete`, {
    isCompleted,
  });
};

/** Cập nhật vị trí xem video */
export const updateLastWatchedPosition = async (
  lessonId: number,
  position: number
): Promise<LessonProgress> => {
  return apiHelper.patch(`/progress/lessons/${lessonId}/position`, {
    position,
  });
};

/** Lấy tiến độ tổng quan của khóa học */
export const getCourseProgress = async (
  courseId: number
): Promise<CourseProgressResponse> => {
  return apiHelper.get(`/progress/courses/${courseId}`);
};
