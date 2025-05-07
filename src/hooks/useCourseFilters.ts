// src/hooks/useCourseFilters.ts (Phiên bản mới)
import { useState, useCallback } from 'react';
import { InstructorCourseStatus } from '@/types/common.types'; // Giả sử bạn định nghĩa các type ở đây

export interface CourseFilterParams {
  search?: string;
  // Thay vì activeTab, chúng ta sẽ truyền các tham số cụ thể hơn cho API
  instructorId?: number | null; // Lọc theo instructor cụ thể (cho tab "My Courses")
  statusId?: InstructorCourseStatus | 'PUBLISHED_ALL' | null; // Thêm trạng thái đặc biệt cho tab "All"
  categoryId?: number | null; // Sử dụng ID thay vì string name
  levelId?: number | null; // Sử dụng ID
  isFeatured?: 0 | 1 | null; // Đổi tên từ 'featured'
  page?: number;
  limit?: number;
  sortBy?: string; // Ví dụ: 'createdAt', 'popularity', 'price'
  sortDirection?: 'asc' | 'desc';
}

export const useCourseFilters = (initialPage = 1, initialLimit = 9) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit); // Items per page có thể cố định hoặc thay đổi

  const [filterParams, setFilterParams] = useState<
    Omit<CourseFilterParams, 'page' | 'limit'>
  >({
    search: '',
    instructorId: null, // Sẽ được set khi chọn tab "My Courses"
    // statusId: 'PUBLISHED_ALL', // Trạng thái mặc định cho tab "All"
    categoryId: null,
    levelId: null,
    isFeatured: null,
    sortBy: 'createdAt', // Mặc định sắp xếp
    sortDirection: 'desc',
  });

  const updateFilter = useCallback(
    <K extends keyof typeof filterParams>(
      key: K,
      value: (typeof filterParams)[K]
    ) => {
      setFilterParams((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
    },
    []
  );

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Hàm để set các filter dựa trên Tab chính
  const setActiveTab = useCallback(
    (tab: 'all' | 'myCourses', currentInstructorId: number) => {
      if (tab === 'all') {
        setFilterParams((prev) => ({
          ...prev,
          instructorId: null, // Không lọc theo instructor
          status: 'PUBLISHED', // Trạng thái đặc biệt để backend hiểu là lấy PUBLISHED của mọi người + tất cả của tôi
        }));
      } else {
        // myCourses
        setFilterParams((prev) => ({
          ...prev,
          instructorId: currentInstructorId, // Lọc theo instructor hiện tại
          status: null, // Bỏ lọc status mặc định, để filter chi tiết quyết định
        }));
      }
      setCurrentPage(1);
    },
    []
  );

  // Hàm clear filter chi tiết
  const clearDetailFilters = useCallback(() => {
    setFilterParams((prev) => ({
      ...prev, // Giữ lại searchTerm, instructorId, status (từ tab)
      categoryId: null,
      levelId: null,
      isFeatured: null,
      // Có thể reset cả status ở đây nếu muốn, hoặc để Select status đảm nhiệm
      // status: prev.activeTab === 'myCourses' ? null : 'PUBLISHED_ALL', // Reset status về mặc định của tab
    }));
    setCurrentPage(1);
  }, []);

  // Tạo object params hoàn chỉnh để truyền cho useCourses hook
  const queryParams: CourseFilterParams = {
    ...filterParams,
    page: currentPage,
    limit: limit,
  };

  return {
    queryParams, // Params để truyền vào useCourses
    filterParams, // Chỉ state filter để điều khiển UI
    currentPage,
    limit,
    updateFilter, // Hàm cập nhật từng filter
    setActiveTab, // Hàm chuyển tab chính
    clearDetailFilters, // Hàm xóa filter chi tiết
    setPage, // Hàm chuyển trang
  };
};
