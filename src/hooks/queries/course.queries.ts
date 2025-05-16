/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/queries/course.queries.ts
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getCourses,
  createCourse,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  updateCourseThumbnail,
  submitCourseForApproval,
  reviewCourseApproval,
  toggleCourseFeature,
  Course,
  CourseListResponse,
  CourseQueryParams,
  CreateCourseData,
  UpdateCourseData,
  SubmitCourseData,
  ReviewCourseData,
  ToggleFeatureData,
  ApprovalRequestListItem,
  updateCourseIntroVideo,
  BulkReorderResponse,
  updateLessonsOrderApi,
  OrderItemData,
  updateSectionsOrderApi,
  syncCourseCurriculum,
  SyncCurriculumPayload,
  SyncCurriculumResponse,
  getCourseStatuses,
  getApprovalRequests, // *** Import hàm service mới ***
  getApprovalRequestDetails, // *** Import hàm service mới ***
  ApprovalRequestListResponse, // *** Import kiểu dữ liệu mới ***
  ApprovalRequestQueryParams, // *** Import kiểu dữ liệu mới ***
} from '@/services/course.service'; // Điều chỉnh đường dẫn nếu cần

// Query Key Factory
export const courseKeys = {
  all: ['courses'] as const,
  lists: (params?: CourseQueryParams) =>
    [...courseKeys.all, 'list', params || {}] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detailBySlug: (slug: string | undefined) =>
    [...courseKeys.details(), 'slug', slug] as const,
  detailById: (id: number | undefined) =>
    [...courseKeys.details(), 'id', id] as const,
  // --- Keys mới cho Approval Requests ---
  approvalRequests: ['approvalRequests'] as const,
  approvalRequestLists: (params?: ApprovalRequestQueryParams) =>
    [...courseKeys.approvalRequests, 'list', params || {}] as const,
  approvalRequestDetails: () =>
    [...courseKeys.approvalRequests, 'detail'] as const,
  approvalRequestDetail: (id: number | undefined) =>
    [...courseKeys.approvalRequestDetails(), id] as const,
};

// --- Queries ---

/** Hook lấy danh sách khóa học */
export const useCourses = (
  params?: CourseQueryParams,
  options?: Omit<
    UseQueryOptions<CourseListResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = courseKeys.lists(params);
  return useQuery<CourseListResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getCourses(params),
    placeholderData: undefined,
    ...options,
  });
};

/** Hook lấy chi tiết khóa học bằng slug */
export const useCourseDetailBySlug = (
  slug: string | undefined,
  options?: Omit<UseQueryOptions<Course, Error>, 'queryKey' | 'queryFn'>
) => {
  const queryKey = courseKeys.detailBySlug(slug);
  return useQuery<Course, Error>({
    queryKey: queryKey,
    queryFn: () => getCourseBySlug(slug!), // Dùng ! vì enabled đảm bảo slug có giá trị
    enabled: !!slug, // Chỉ chạy khi slug có giá trị
    staleTime: 1000 * 60 * 2, // Cache chi tiết khóa học 2 phút
    ...options,
  });
};

// --- Mutations ---

/** Hook tạo khóa học (Instructor) */
export const useCreateCourse = (
  options?: UseMutationOptions<Course, Error, CreateCourseData>
) => {
  const queryClient = useQueryClient();
  return useMutation<Course, Error, CreateCourseData>({
    mutationFn: createCourse,
    onSuccess: () => {
      // Invalidate danh sách khóa học (chung và của instructor nếu có filter)
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      console.log('Course created successfully.');
      // toast.success('Tạo khóa học thành công!');
      // Có thể chuyển hướng đến trang chỉnh sửa khóa học mới tạo
    },
    onError: (error) => {
      console.error('Course creation failed:', error.message);
      // toast.error(error.message || 'Tạo khóa học thất bại.');
    },
    ...options,
  });
};

/** Hook cập nhật khóa học (Instructor/Admin) */
export const useUpdateCourse = (
  options?: UseMutationOptions<
    Course,
    Error,
    { courseId: number; data: UpdateCourseData }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Course,
    Error,
    { courseId: number; data: UpdateCourseData }
  >({
    mutationFn: ({ courseId, data }) => updateCourse(courseId, data),
    onSuccess: (updatedCourse) => {
      // Cập nhật cache chi tiết theo ID và Slug
      queryClient.setQueryData(
        courseKeys.detailById(updatedCourse.courseId),
        updatedCourse
      );
      queryClient.setQueryData(
        courseKeys.detailBySlug(updatedCourse.slug),
        updatedCourse
      );
      // Invalidate cache danh sách
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      console.log('Course updated successfully.');
      // toast.success('Cập nhật khóa học thành công!');
    },
    onError: (error) => {
      console.error('Course update failed:', error.message);
      // toast.error(error.message || 'Cập nhật khóa học thất bại.');
    },
    ...options,
  });
};

/** Hook xóa khóa học (Instructor/Admin) */
export const useDeleteCourse = (
  options?: UseMutationOptions<void, Error, number>
) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteCourse,
    onSuccess: (_, courseId) => {
      // Xóa cache chi tiết
      queryClient.removeQueries({ queryKey: courseKeys.detailById(courseId) });
      // Cần lấy slug trước khi xóa để remove cache theo slug? Hơi phức tạp.
      // Cách đơn giản hơn là invalidate tất cả chi tiết
      queryClient.invalidateQueries({ queryKey: courseKeys.details() });
      // Invalidate cache danh sách
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      console.log('Course deleted successfully.');
      // toast.success('Xóa khóa học thành công!');
    },
    onError: (error) => {
      console.error('Course deletion failed:', error.message);
      // toast.error(error.message || 'Xóa khóa học thất bại.');
    },
    ...options,
  });
};

/** Hook cập nhật thumbnail (Instructor/Admin) */
export const useUpdateCourseThumbnail = (
  options?: UseMutationOptions<Course, Error, { courseId: number; file: File }>
) => {
  const queryClient = useQueryClient();
  return useMutation<Course, Error, { courseId: number; file: File }>({
    mutationFn: ({ courseId, file }) => updateCourseThumbnail(courseId, file),
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData(
        courseKeys.detailById(updatedCourse.courseId),
        updatedCourse
      );
      queryClient.setQueryData(
        courseKeys.detailBySlug(updatedCourse.slug),
        updatedCourse
      );
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      console.log('Course thumbnail updated successfully.');
      // toast.success('Cập nhật thumbnail thành công!');
    },
    onError: (error) => {
      console.error('Thumbnail update failed:', error.message);
      // toast.error(error.message || 'Cập nhật thumbnail thất bại.');
    },
    ...options,
  });
};

/** Hook cập nhật video giới thiệu (Instructor/Admin) */
export const useUpdateCourseIntroVideo = (
  options?: UseMutationOptions<Course, Error, { courseId: number; file: File }>
) => {
  const queryClient = useQueryClient();
  return useMutation<Course, Error, { courseId: number; file: File }>({
    mutationFn: ({ courseId, file }) => updateCourseIntroVideo(courseId, file),
    onSuccess: (updatedCourse) => {
      // Cập nhật cache chi tiết khóa học
      queryClient.setQueryData(
        courseKeys.detailById(updatedCourse.courseId),
        updatedCourse
      );
      queryClient.setQueryData(
        courseKeys.detailBySlug(updatedCourse.slug),
        updatedCourse
      );
      // Invalidate danh sách nếu cần cập nhật URL/thông tin video ở list view
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      console.log('Course intro video updated successfully.');
      // toast.success('Cập nhật video giới thiệu thành công!');
    },
    onError: (error) => {
      console.error('Intro video update failed:', error.message);
      // toast.error(error.message || 'Cập nhật video giới thiệu thất bại.');
    },
    ...options,
  });
};

/** Hook gửi duyệt khóa học (Instructor) */
export const useSubmitCourseForApproval = (
  options?: UseMutationOptions<
    { message: string; request: ApprovalRequestListItem },
    Error,
    { courseId: number; data?: SubmitCourseData }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string; request: ApprovalRequestListItem },
    Error,
    { courseId: number; data?: SubmitCourseData }
  >({
    mutationFn: ({ courseId, data }) => submitCourseForApproval(courseId, data),
    onSuccess: (data, variables) => {
      // Invalidate cache chi tiết khóa học để cập nhật status
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailById(variables.courseId),
      });
      // Cần lấy slug để invalidate theo slug?
      queryClient.invalidateQueries({ queryKey: courseKeys.details() }); // Invalidate all details
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() }); // Invalidate lists
      console.log('Course submitted for approval.');
      // toast.success('Đã gửi yêu cầu duyệt khóa học.');
    },
    onError: (error) => {
      console.error('Course submission failed:', error.message);
      // toast.error(error.message || 'Gửi yêu cầu duyệt thất bại.');
    },
    ...options,
  });
};

/** Hook duyệt/từ chối khóa học (Admin) */
export const useReviewCourseApproval = (
  options?: UseMutationOptions<
    { message: string; request: ApprovalRequestListItem },
    Error,
    { requestId: number; data: ReviewCourseData }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string; request: ApprovalRequestListItem },
    Error,
    { requestId: number; data: ReviewCourseData }
  >({
    mutationFn: ({ requestId, data }) => reviewCourseApproval(requestId, data),
    onSuccess: (data) => {
      // Invalidate cache chi tiết khóa học liên quan (cần lấy courseId từ response?)
      // const courseId = data.request.CourseID; // Giả sử response trả về courseId
      // queryClient.invalidateQueries({ queryKey: courseKeys.detailById(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.details() }); // Invalidate all details
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() }); // Invalidate lists
      // Invalidate cache danh sách approval requests (nếu có)
      console.log('Course approval reviewed.');
      // toast.success('Đã xử lý yêu cầu duyệt.');
    },
    onError: (error) => {
      console.error('Course review failed:', error.message);
      // toast.error(error.message || 'Xử lý yêu cầu duyệt thất bại.');
    },
    ...options,
  });
};

/** Hook Admin lấy danh sách yêu cầu phê duyệt */
export const useAdminGetApprovalRequests = (
  params?: ApprovalRequestQueryParams,
  options?: Omit<
    UseQueryOptions<ApprovalRequestListResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = courseKeys.approvalRequestLists(params);
  return useQuery<ApprovalRequestListResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getApprovalRequests(params),
    placeholderData: undefined,
    ...options,
  });
};

/** Hook Admin lấy chi tiết yêu cầu phê duyệt */
export const useAdminGetApprovalRequestDetail = (
  requestId: number | undefined,
  options?: Omit<
    UseQueryOptions<ApprovalRequestListItem, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = courseKeys.approvalRequestDetail(requestId);
  return useQuery<ApprovalRequestListItem, Error>({
    queryKey: queryKey,
    queryFn: () => getApprovalRequestDetails(requestId!),
    enabled: !!requestId,
    ...options,
  });
};

/** Hook đánh dấu/bỏ đánh dấu nổi bật (Admin) */
export const useToggleCourseFeature = (
  options?: UseMutationOptions<
    Course,
    Error,
    { courseId: number; data: ToggleFeatureData }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    Course,
    Error,
    { courseId: number; data: ToggleFeatureData }
  >({
    mutationFn: ({ courseId, data }) => toggleCourseFeature(courseId, data),
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData(
        courseKeys.detailById(updatedCourse.courseId),
        updatedCourse
      );
      queryClient.setQueryData(
        courseKeys.detailBySlug(updatedCourse.slug),
        updatedCourse
      );
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      console.log('Course feature status toggled.');
      // toast.success('Cập nhật trạng thái nổi bật thành công!');
    },
    onError: (error) => {
      console.error('Toggle feature failed:', error.message);
      // toast.error(error.message || 'Cập nhật trạng thái nổi bật thất bại.');
    },
    ...options,
  });
};

// --- Hook Mutation MỚI cho Sync Curriculum ---
export const useSyncCourseCurriculum = (
  options?: UseMutationOptions<
    SyncCurriculumResponse,
    Error,
    { courseId: number; payload: SyncCurriculumPayload }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    SyncCurriculumResponse,
    Error,
    { courseId: number; payload: SyncCurriculumPayload }
  >({
    mutationFn: ({ courseId, payload }) =>
      syncCourseCurriculum(courseId, payload),
    onSuccess: (data, variables) => {
      // Invalidate cache chi tiết khóa học để lấy lại dữ liệu mới nhất
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailById(variables.courseId),
      });
      // Cần lấy slug để invalidate? Hoặc invalidate all slugs
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailBySlug(undefined),
      });
      console.log(`Curriculum synced for course ${variables.courseId}`);
      // toast.success(data.message || 'Curriculum saved successfully!');
    },
    onError: (error) => {
      console.error('Curriculum sync failed:', error.message);
      // toast.error(`Failed to save curriculum: ${error.message}`);
    },
    ...options,
  });
};

// --- Hook Mutation MỚI cho Bulk Reorder Sections ---
export const useUpdateSectionsOrder = (
  options?: UseMutationOptions<
    BulkReorderResponse,
    Error,
    { courseId: number; orderedSections: OrderItemData[] }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    BulkReorderResponse,
    Error,
    { courseId: number; orderedSections: OrderItemData[] }
  >({
    mutationFn: ({ courseId, orderedSections }) =>
      updateSectionsOrderApi(courseId, orderedSections),
    onSuccess: (data, variables) => {
      // Invalidate cache chi tiết khóa học để cập nhật thứ tự sections
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailById(variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailBySlug(undefined),
      });
      console.log(`Sections order updated for course ${variables.courseId}`);
      // toast.success(data.message || 'Sections order updated!');
    },
    onError: (error) => {
      console.error('Update sections order failed:', error.message);
      // toast.error(`Failed to update sections order: ${error.message}`);
    },
    ...options,
  });
};

// --- Hook Mutation MỚI cho Bulk Reorder Lessons ---
export const useUpdateLessonsOrder = (
  options?: UseMutationOptions<
    BulkReorderResponse,
    Error,
    { sectionId: number; orderedLessons: OrderItemData[] }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    BulkReorderResponse,
    Error,
    { sectionId: number; orderedLessons: OrderItemData[] }
  >({
    mutationFn: ({ sectionId, orderedLessons }) =>
      updateLessonsOrderApi(sectionId, orderedLessons),
    onSuccess: (data, variables) => {
      // Invalidate cache chi tiết khóa học chứa section này
      // Việc này hơi khó vì không có courseId trực tiếp, cách đơn giản là invalidate all course details
      queryClient.invalidateQueries({ queryKey: courseKeys.details() });
      console.log(`Lessons order updated for section ${variables.sectionId}`);
      // toast.success(data.message || 'Lessons order updated!');
    },
    onError: (error) => {
      console.error('Update lessons order failed:', error.message);
      // toast.error(`Failed to update lessons order: ${error.message}`);
    },
    ...options,
  });
};

/** Hook lấy danh sách trạng thái khóa học */
export const useCourseStatuses = (
  options?: Omit<
    UseQueryOptions<
      { statusId: string; statusName: string; description: string }[],
      Error
    >,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<
    { statusId: string; statusName: string; description: string }[],
    Error
  >({
    queryKey: ['courseStatuses'], // Key cho cache
    queryFn: getCourseStatuses, // Hàm gọi API
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    ...options,
  });
};

// /** Hook Admin lấy danh sách khóa học chờ duyệt */
// export const useAdminGetPendingCourses = (
//   params?: PendingCourseQueryParams,
//   options?: Omit<
//     UseQueryOptions<PendingCourseListResponse, Error>,
//     'queryKey' | 'queryFn'
//   >
// ) => {
//   const queryKey = courseKeys.adminPending(params);
//   return useQuery<PendingCourseListResponse, Error>({
//     queryKey: queryKey,
//     queryFn: () => getPendingCoursesForAdmin(params),
//     placeholderData: undefined, // Giữ lại data cũ khi đang fetch trang/sort mới
//     ...options,
//   });
// };
