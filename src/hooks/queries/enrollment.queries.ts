// src/hooks/queries/enrollment.queries.ts
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getMyEnrollments,
  enrollCourse,
  Enrollment,
  EnrollmentListResponse,
  EnrollmentQueryParams,
} from '@/services/enrollment.service';
import { courseKeys } from './course.queries'; // Để invalidate course detail (isEnrolled)

// Query Key Factory
const enrollmentKeys = {
  all: ['enrollments'] as const,
  myLists: (params?: EnrollmentQueryParams) =>
    [...enrollmentKeys.all, 'myList', params || {}] as const,
};

// --- Queries ---

/** Hook lấy danh sách khóa học đã đăng ký */
export const useMyEnrollments = (
  params?: EnrollmentQueryParams,
  options?: Omit<
    UseQueryOptions<EnrollmentListResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = enrollmentKeys.myLists(params);
  return useQuery<EnrollmentListResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getMyEnrollments(params),
    staleTime: 1000 * 60, // Adjust the stale time as needed (e.g., 1 minute)
    ...options,
  });
};

// --- Mutations ---

/** Hook để user tự enroll (khóa miễn phí/test) */
export const useEnrollCourse = (
  options?: UseMutationOptions<Enrollment, Error, number>
) => {
  const queryClient = useQueryClient();
  return useMutation<Enrollment, Error, number>({
    // Input là courseId
    mutationFn: enrollCourse,
    onSuccess: (data) => {
      // Invalidate danh sách enrollment của user
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.myLists() });
      // Invalidate chi tiết khóa học để cập nhật isEnrolled
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailById(data.CourseID),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailBySlug(undefined),
      }); // Cần slug?
      console.log(`Enrolled in course ${data.CourseID} successfully.`);
      // toast.success('Đăng ký khóa học thành công!');
    },
    onError: (error) => {
      console.error('Enrollment failed:', error.message);
      // toast.error(error.message || 'Đăng ký khóa học thất bại.');
    },
    ...options,
  });
};
