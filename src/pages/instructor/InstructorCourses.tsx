/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/instructor/InstructorCourses.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { Button } from '@/components/ui/button';
// ... (các import UI components khác) ...
import PaginationControls from '@/components/admin/PaginationControls';
import { useCourseFilters } from '@/hooks/useCourseFilters'; // Import hook mới
import { useCourses, useCourseStatuses } from '@/hooks/queries/course.queries'; // Hook để fetch courses từ API
import { useCategories } from '@/hooks/queries/category.queries'; // Fetch categories
import { useLevels } from '@/hooks/queries/level.queries'; // Fetch levels
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import {
  Book,
  Plus,
  Search,
  Filter,
  X /* ... các icons khác ... */,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Eye, Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Course } from '@/services/course.service';

const InstructorCourses = () => {
  const currentInstructorId = JSON.parse(
    localStorage.getItem('user') || '{}'
  ).id; // Lấy ID từ localStorage user object
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const {
    queryParams,
    filterParams,
    currentPage,
    limit,
    updateFilter,
    setActiveTab,
    clearDetailFilters,
    setPage,
  } = useCourseFilters();

  // --- Fetch Data ---
  // Sử dụng hook useCourses với queryParams từ useCourseFilters
  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    isError,
    error,
  } = useCourses(queryParams);
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const { data: levelsData, isLoading: isLoadingLevels } = useLevels();
  const { data: statusesData, isLoading: isLoadingStatuses } =
    useCourseStatuses();
  // --- Xử lý dữ liệu từ API ---
  const courses = coursesData?.courses || [];
  const totalCourses = coursesData?.total || 0;
  const totalPages = Math.ceil(totalCourses / limit);
  console.log('courses', courses);
  // Set tab mặc định khi component mount
  useEffect(() => {
    setActiveTab('all', currentInstructorId); // Mặc định hiển thị tab "All"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInstructorId]); // Chỉ chạy lại nếu instructorId thay đổi

  // --- Handlers ---
  const handleSelectFilterChange = (
    filterKey: 'categoryId' | 'levelId' | 'statusId',
    value: string
  ) => {
    // Chuyển value về number nếu là categoryId hoặc levelId
    const finalValue =
      filterKey === 'categoryId' || filterKey === 'levelId'
        ? value === 'all'
          ? null
          : parseInt(value, 10)
        : value === 'all'
        ? null
        : value;
    updateFilter(filterKey, finalValue as any); // Cập nhật filter tương ứng
  };

  const handleFeaturedFilterChange = (value: string | 1 | 0) => {
    if (value === 'all') {
      updateFilter('isFeatured', null);
    } else if (value === 1 || value === 'true') {
      updateFilter('isFeatured', 1);
    } else if (value === 0 || value === 'false') {
      updateFilter('isFeatured', 0);
    }
  };

  // --- Render ---

  // Function để render skeleton loading
  const renderSkeletonGrid = (count = 6) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={`skeleton-${index}`}>
          <Skeleton className="aspect-video w-full rounded-t-lg" />
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2 mt-1" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/4" />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <InstructorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Courses</h1>
          <Link to="/instructor/courses/create">
            <Button>
              {' '}
              <Plus className="mr-2 h-4 w-4" /> Create New Course{' '}
            </Button>
          </Link>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-8"
                value={filterParams.searchTerm || ''}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
              />
            </div>
            {/* Filter Button */}
            <div>
              <Button
                variant="outline"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="w-full md:w-auto"
                aria-expanded={isFilterDropdownOpen}
                disabled={isLoadingCategories || isLoadingLevels} // Disable khi đang load filter data
              >
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div>
          </div>

          {/* Filter Dropdown */}
          {isFilterDropdownOpen && (
            <div className="bg-card border rounded-md p-4 shadow-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="space-y-1">
                  <label
                    htmlFor="category-filter"
                    className="text-sm font-medium"
                  >
                    Category
                  </label>
                  <Select
                    value={filterParams.categoryId?.toString() || 'all'} // Dùng ID
                    onValueChange={(value) =>
                      handleSelectFilterChange('categoryId', value)
                    }
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger id="category-filter">
                      {' '}
                      <SelectValue
                        placeholder={
                          isLoadingCategories ? 'Loading...' : 'Select category'
                        }
                      />{' '}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoriesData?.categories?.map(
                        (
                          category // Lấy từ API
                        ) => (
                          <SelectItem
                            key={category.categoryId}
                            value={category.categoryId.toString()}
                          >
                            {category.categoryName}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Level Filter */}
                <div className="space-y-1">
                  <label htmlFor="level-filter" className="text-sm font-medium">
                    Level
                  </label>
                  <Select
                    value={filterParams.levelId?.toString() || 'all'} // Dùng ID
                    onValueChange={(value) =>
                      handleSelectFilterChange('levelId', value)
                    }
                    disabled={isLoadingLevels}
                  >
                    <SelectTrigger id="level-filter">
                      {' '}
                      <SelectValue
                        placeholder={
                          isLoadingLevels ? 'Loading...' : 'Select level'
                        }
                      />{' '}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {levelsData?.levels?.map(
                        (
                          level // Lấy từ API
                        ) => (
                          <SelectItem
                            key={level.levelId}
                            value={level.levelId.toString()}
                          >
                            {level.levelName}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-1">
                  <label
                    htmlFor="status-filter"
                    className="text-sm font-medium"
                  >
                    Status
                  </label>
                  <Select
                    value={filterParams.statusId || 'PUBLISHED_ALL'} // Dùng status từ filterParams
                    onValueChange={(value) =>
                      handleSelectFilterChange('statusId', value)
                    }
                  >
                    <SelectTrigger id="status-filter">
                      {' '}
                      <SelectValue placeholder="Select status" />{' '}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLISHED_ALL">
                        All Statuses
                      </SelectItem>
                      {/* Có thể chỉ hiển thị các status liên quan đến "My Courses" nếu đang ở tab đó */}
                      {statusesData?.map((status) => (
                        <SelectItem
                          key={status.statusId}
                          value={status.statusId}
                        >
                          {' '}
                          {status.statusName}{' '}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Featured Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="featured-filter"
                    className="text-sm font-medium"
                  >
                    Featured
                  </label>
                  <Select
                    value={
                      filterParams.isFeatured === null
                        ? 'all'
                        : filterParams.isFeatured
                        ? 'true'
                        : 'false'
                    }
                    onValueChange={handleFeaturedFilterChange}
                  >
                    <SelectTrigger id="featured-filter">
                      {' '}
                      <SelectValue placeholder="Featured status" />{' '}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="true">Featured</SelectItem>
                      <SelectItem value="false">Not Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Clear Button */}
              <div className="flex justify-end pt-2 border-t mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearDetailFilters}
                >
                  {' '}
                  Clear Detail Filters{' '}
                </Button>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(filterParams.categoryId ||
            filterParams.levelId ||
            filterParams.statusId ||
            filterParams.isFeatured !== null) && (
            <div className="flex flex-wrap gap-2 items-center pt-2">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {filterParams.categoryId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {
                    categoriesData?.categories?.find(
                      (c) => c.categoryId === filterParams.categoryId
                    )?.categoryName
                  }
                  <button
                    onClick={() => updateFilter('categoryId', null)}
                    className="ml-1 opacity-70 hover:opacity-100"
                  >
                    {' '}
                    <X size={14} />{' '}
                  </button>
                </Badge>
              )}
              {filterParams.levelId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {
                    levelsData?.levels?.find(
                      (l) => l.levelId === filterParams.levelId
                    )?.levelName
                  }
                  <button
                    onClick={() => updateFilter('levelId', null)}
                    className="ml-1 opacity-70 hover:opacity-100"
                  >
                    {' '}
                    <X size={14} />{' '}
                  </button>
                </Badge>
              )}
              {filterParams.statusId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {
                    statusesData?.find(
                      (s) => s.statusId === filterParams.statusId
                    )?.statusName
                  }
                  <button
                    onClick={() => updateFilter('statusId', null)}
                    className="ml-1 opacity-70 hover:opacity-100"
                  >
                    {' '}
                    <X size={14} />{' '}
                  </button>
                </Badge>
              )}
              {filterParams.isFeatured !== null && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filterParams.isFeatured ? 'Featured' : 'Not Featured'}
                  <button
                    onClick={() => updateFilter('isFeatured', null)}
                    className="ml-1 opacity-70 hover:opacity-100"
                  >
                    {' '}
                    <X size={14} />{' '}
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Tabs Chính */}
        <Tabs
          value={queryParams.instructorId === null ? 'all' : 'myCourses'} // Xác định tab dựa trên instructorId trong queryParams
          className="w-full"
          onValueChange={(value) =>
            setActiveTab(value as 'all' | 'myCourses', currentInstructorId)
          }
        >
          <TabsList className="grid grid-cols-2 w-full md:w-auto md:inline-grid md:grid-cols-2 gap-2">
            {' '}
            {/* Layout linh hoạt hơn */}
            <TabsTrigger value="all">All Published & My Courses</TabsTrigger>
            <TabsTrigger value="myCourses">My Courses Dashboard</TabsTrigger>
          </TabsList>

          {/* Content Area */}
          <div className="mt-6">
            {isLoadingCourses ? (
              renderSkeletonGrid(limit) // Hiển thị skeleton khi đang tải
            ) : isError ? (
              <div className="text-center py-10 text-red-600">
                <p>
                  Error loading courses: {error?.message || 'Unknown error'}
                </p>
              </div>
            ) : courses.length > 0 ? (
              <>
                <CoursesGrid
                  courses={courses.filter(
                    (course): course is Course => course.courseId !== undefined
                  )}
                  currentInstructorId={currentInstructorId}
                />
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setPage}
                    />
                  </div>
                )}
              </>
            ) : (
              // No Courses Found Message
              <div className="text-center py-10 col-span-full">
                <Book className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or create your first course.
                </p>
                <div className="mt-6">
                  <Link to="/instructor/courses/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create Course
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </InstructorLayout>
  );
};
// CoursesGrid component (giữ nguyên hoặc có thể cải thiện chút)
interface CoursesGridProps {
  courses: Course[]; // Sử dụng Course type
  currentInstructorId: number;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({
  courses,
  currentInstructorId,
}) => {
  console.log('coursescourses', courses);
  // Nếu không có courses nào (sau khi đã lọc), hiển thị thông báo ở đây
  // đã được xử lý ở component cha
  if (courses.length === 0) {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10">
        <Book className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">No courses found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or create your first course.
        </p>
        <div className="mt-6">
          <Link to="/instructor/courses/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Course
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.courseId} className="flex flex-col">
          {' '}
          {/* Thêm flex flex-col để footer luôn ở dưới */}
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <img
              src={course.thumbnailUrl} // Nên là URL thực
              alt={course.courseName}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" // Thêm hiệu ứng hover
            />
            <div className="absolute top-2 right-2 bg-background/80 text-foreground rounded px-2 py-1 text-xs font-medium shadow">
              ${course.originalPrice.toFixed(2)}
            </div>
            <Badge
              variant={
                course.statusId === 'PUBLISHED'
                  ? 'default'
                  : course.statusId === 'PENDING'
                  ? 'outline' // Ví dụ, dùng màu khác cho pending
                  : course.statusId === 'REJECTED'
                  ? 'destructive'
                  : 'secondary' // Cho DRAFT
              }
              className="absolute bottom-2 left-2"
            >
              {course.statusId}
            </Badge>
            {course.isFeatured && (
              <Badge className="absolute top-2 left-2 bg-pink-600 hover:bg-pink-700 text-white">
                Featured
              </Badge>
            )}
          </div>
          <CardHeader className="pb-2">
            {' '}
            {/* Giảm padding bottom */}
            <CardTitle className="line-clamp-2 text-lg hover:text-primary transition-colors">
              <Link to={`/courses/${course.slug}`}>{course.courseName}</Link>
            </CardTitle>
            <div className="flex items-center text-xs text-muted-foreground pt-1">
              <span>By {course.instructorName}</span>
              <span className="mx-2">|</span>
              <span className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                {course.averageRating}
              </span>
            </div>
          </CardHeader>
          <CardContent className="text-sm flex-grow">
            {' '}
            {/* flex-grow để content chiếm không gian */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{course.studentCount} students</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {course.categoryName}
              </Badge>
            </div>
            <div className="mt-1">
              <span className="font-medium">Level:</span>{' '}
              {course.levelName.charAt(0).toUpperCase() +
                course.levelName.slice(1)}
            </div>
            {/* <div className="mt-1"> {/* Bỏ revenue nếu không cần thiết ở đây */}
            {/*   <span className="font-medium">Revenue:</span> ${course.revenue.toLocaleString()} */}
            {/* </div> */}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            {' '}
            {/* Thêm border-t pt-4 */}
            {course.instructorAccountId === currentInstructorId ? (
              <Link to={`/instructor/courses/${course.slug}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" /> Manage
                </Button>
              </Link>
            ) : (
              <div /> // Giữ lại để layout ổn định
            )}
            <Link to={`/courses/${course.slug}`}>
              <Button variant="ghost" size="sm">
                Preview <Eye className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}

      {/* Thẻ "Create New Course" có thể không cần thiết nếu đã có nút ở trên cùng
          Hoặc chỉ hiển thị nếu danh sách courses RỖNG HOÀN TOÀN (không có filter nào)
          Hiện tại, logic "No courses found" ở component cha đã bao gồm nút Create.
      */}
    </div>
  );
};

export default InstructorCourses;
