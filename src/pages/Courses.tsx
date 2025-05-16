// src/pages/CoursesPage.tsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Layout from '@/components/layout/Layout'; // Layout chung
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Star,
  Clock,
  Filter as FilterIcon,
  Search,
  Loader2,
  XCircle,
  ListRestart,
  ChevronDown,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'; // For mobile filters
import {
  CourseListItem,
  CourseQueryParams,
  CategoryFilterItem,
  LevelFilterItem,
  LanguageFilterItem,
  SORT_OPTIONS,
  SortByValue,
} from '@/types/common.types'; // Import types
import { useCourses } from '@/hooks/queries/course.queries'; // Hook fetch courses

import { useCategories } from '@/hooks/queries/category.queries'; // Giả định có các hook này
import { useLevels } from '@/hooks/queries/level.queries'; // Giả định có các hook này
import { useDebounce } from '@/hooks/useDebounce';
import PaginationControls from '@/components/admin/PaginationControls';
import CourseCard from '@/components/courses/CourseCard'; // Import CourseCard
import { Skeleton } from '@/components/ui/skeleton'; // Skeleton
import CourseCardv2 from '@/components/courses/CourseCardv2';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useLanguages } from '@/hooks/queries/language.queries';

const ITEMS_PER_PAGE = 12;
const MAX_PRICE = 200; // Hoặc lấy động từ API

const CourseFiltersSidebar: React.FC<{
  filters: Omit<CourseQueryParams, 'page' | 'limit' | 'sortBy' | 'searchTerm'>;
  onFilterChange: <K extends keyof CourseQueryParams>(
    key: K,
    value: CourseQueryParams[K]
  ) => void;
  onResetFilters: () => void;
  categories?: CategoryFilterItem[];
  levels?: LevelFilterItem[];
  languages?: LanguageFilterItem[];
  isLoadingFilters: boolean;
}> = ({
  filters,
  onFilterChange,
  onResetFilters,
  categories = [],
  levels = [],
  languages = [],
  isLoadingFilters,
}) => {
  const handlePriceChange = (newRange: number[]) => {
    onFilterChange('minPrice', newRange[0] > 0 ? newRange[0] : null);
    onFilterChange('maxPrice', newRange[1] < MAX_PRICE ? newRange[1] : null);
  };

  const handleCheckboxChange = (
    filterKey: 'isFree' | 'isFeatured',
    checked: boolean | 'indeterminate'
  ) => {
    onFilterChange(
      filterKey,
      checked === true ? true : checked === false ? false : null
    );
  };

  const renderFilterSkeleton = (count = 3) => (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );

  return (
    <div className="rounded-lg border p-4 lg:p-6 space-y-6 bg-card shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="text-xs"
        >
          <ListRestart size={14} className="mr-1" /> Reset
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['category', 'level', 'price']}
        className="w-full"
      >
        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Category
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            {isLoadingFilters ? (
              renderFilterSkeleton()
            ) : (
              <Select
                value={filters.categoryId?.toString() || 'all'}
                onValueChange={(value) =>
                  onFilterChange(
                    'categoryId',
                    value === 'all' ? null : Number(value)
                  )
                }
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.categoryId}
                      value={cat.categoryId.toString()}
                    >
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Level Filter */}
        <AccordionItem value="level">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Level
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            {isLoadingFilters ? (
              renderFilterSkeleton()
            ) : (
              <Select
                value={filters.levelId?.toString() || 'all'}
                onValueChange={(value) =>
                  onFilterChange(
                    'levelId',
                    value === 'all' ? null : Number(value)
                  )
                }
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem
                      key={level.levelId}
                      value={level.levelId.toString()}
                    >
                      {level.levelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pt-3 space-y-3">
            <Slider
              defaultValue={[0, MAX_PRICE]}
              max={MAX_PRICE}
              step={5} // Bước nhảy giá
              value={[filters.minPrice || 0, filters.maxPrice || MAX_PRICE]}
              onValueChange={(value) =>
                handlePriceChange(value as [number, number])
              }
              className="my-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${filters.minPrice || 0}</span>
              <span>${filters.maxPrice || MAX_PRICE}</span>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="free-courses-filter"
                checked={filters.isFree === true}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('isFree', checked)
                }
              />
              <Label
                htmlFor="free-courses-filter"
                className="text-sm font-normal"
              >
                Only Free Courses
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Language Filter */}
        <AccordionItem value="language">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Language
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            {isLoadingFilters ? (
              renderFilterSkeleton()
            ) : (
              <Select
                value={filters.language || 'all'}
                onValueChange={(value) =>
                  onFilterChange('language', value === 'all' ? null : value)
                }
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.languageCode}
                      value={lang.languageCode}
                    >
                      {lang.languageName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Rating Filter */}
        <AccordionItem value="rating">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Rating
          </AccordionTrigger>
          <AccordionContent className="pt-2 space-y-1">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.minRating === rating}
                  onCheckedChange={(checked) =>
                    onFilterChange('minRating', checked ? rating : null)
                  }
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center text-sm font-normal"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`mr-0.5 ${
                        i < rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-muted stroke-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="ml-1">& Up</span>
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Featured Filter */}
        <AccordionItem value="featured">
          <AccordionTrigger className="py-3 text-sm font-medium">
            Others
          </AccordionTrigger>
          <AccordionContent className="pt-2 space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured-courses-filter"
                checked={filters.isFeatured === 1}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('isFeatured', checked)
                }
              />
              <Label
                htmlFor="featured-courses-filter"
                className="text-sm font-normal"
              >
                Featured Courses
              </Label>
            </div>
            {/* Thêm các checkbox khác cho hasCertificate, hasAssignments nếu backend hỗ trợ */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const CoursesPage: React.FC = () => {
  const [filterState, setFilterState] = useState<
    Omit<CourseQueryParams, 'page' | 'limit' | 'sortBy' | 'searchTerm'>
  >({
    categoryId: null,
    levelId: null,
    language: null,
    minPrice: 0,
    maxPrice: MAX_PRICE,
    minRating: null,
    isFree: null,
    isFeatured: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortByValue>(SORT_OPTIONS[0].value);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: { categories = [] } = {}, isLoading: isLoadingCategories } =
    useCategories?.() || {};
  const { data: { levels = [] } = {}, isLoading: isLoadingLevels } =
    useLevels?.() || {};
  const { data: { languages = [] } = {}, isLoading: isLoadingLanguages } =
    useLanguages?.() || {};

  const queryParams: CourseQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      searchTerm: debouncedSearchTerm || undefined,
      sortBy: sortBy,
      ...filterState, // Spread các filter khác vào
    }),
    [currentPage, debouncedSearchTerm, sortBy, filterState]
  );

  const {
    data: courseData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useCourses(queryParams, {
    placeholderData: (prevData) => prevData,
  });

  const courses = courseData?.courses || [];
  const totalItems = courseData?.total || 0;
  const totalPages =
    courseData?.totalPages || Math.ceil(totalItems / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi filter hoặc search term thay đổi
  }, [debouncedSearchTerm, filterState, sortBy]);

  const handleFilterChange = useCallback(
    <K extends keyof CourseQueryParams>(
      key: K,
      value: CourseQueryParams[K]
    ) => {
      setFilterState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilterState({
      categoryId: null,
      levelId: null,
      language: null,
      minPrice: 0,
      maxPrice: MAX_PRICE,
      minRating: null,
      isFree: null,
      isFeatured: null,
    });
    // Không reset searchTerm và sortBy ở đây
  }, []);

  const renderCourseGridSkeleton = (count = ITEMS_PER_PAGE) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={`course-skeleton-${index}`} className="flex flex-col">
          <Skeleton className="aspect-video w-full rounded-t-lg" />
          <CardHeader className="p-3 md:p-4 pb-2">
            <Skeleton className="h-4 w-1/3 mb-1" />
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-1 flex-grow">
            <Skeleton className="h-3 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
          <CardFooter className="p-3 md:p-4 pt-2 border-t mt-auto">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/4 ml-auto" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto py-6 md:py-8 px-4">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
            Explore Our Courses
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover thousands of courses to help you learn new skills, advance
            your career, or explore your hobbies.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar - Sử dụng Sheet cho mobile */}
          <div className="lg:w-1/4 lg:sticky lg:top-20 self-start">
            {' '}
            {/* Sticky cho sidebar */}
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <Sheet
                open={showMobileFilters}
                onOpenChange={setShowMobileFilters}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                  >
                    <FilterIcon className="mr-2 h-4 w-4" /> Apply Filters
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[350px] p-0"
                >
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Filter Courses</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-120px)]">
                    {' '}
                    {/* Điều chỉnh chiều cao */}
                    <div className="p-4">
                      <CourseFiltersSidebar
                        filters={filterState}
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                        categories={categories || []}
                        levels={levels || []}
                        languages={languages || []}
                        isLoadingFilters={
                          isLoadingCategories ||
                          isLoadingLevels ||
                          isLoadingLanguages
                        }
                      />
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block">
              <CourseFiltersSidebar
                filters={filterState}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                categories={categories || []}
                levels={levels || []}
                languages={languages || []}
                isLoadingFilters={
                  isLoadingCategories || isLoadingLevels || isLoadingLanguages
                }
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4">
            {/* Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses, instructors..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {isFetching && searchTerm && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto min-w-[180px] justify-between"
                  >
                    Sort by:{' '}
                    {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ||
                      'Select'}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[220px] p-0">
                  {SORT_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={sortBy === opt.value ? 'default' : 'ghost'}
                      className="w-full justify-start px-3 py-2 rounded-none text-sm"
                      onClick={() => {
                        setSortBy(opt.value as SortByValue);
                        const RopoverTrigger = document.querySelector(
                          '[data-state="open"]'
                        );
                        if (RopoverTrigger)
                          (RopoverTrigger as HTMLElement).click();
                      }}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {/* Results Count */}
            {!isLoading && !isError && (
              <div className="mb-4 text-sm text-muted-foreground">
                Showing <span className="font-semibold">{courses.length}</span>{' '}
                of <span className="font-semibold">{totalItems}</span> results
              </div>
            )}

            {/* Course Grid or Skeletons or Error Message */}
            {isLoading && !courseData ? ( // Chỉ hiển thị skeleton khi tải lần đầu và chưa có data cũ
              renderCourseGridSkeleton()
            ) : isError ? (
              <div className="text-center py-10 text-red-500 bg-red-50 border border-red-200 rounded-md p-4">
                <XCircle className="mx-auto h-10 w-10 mb-2" />
                <p className="font-medium">Could not load courses</p>
                <p className="text-sm">
                  {error?.message || 'An unexpected error occurred.'}
                </p>
                {/* Có thể thêm nút retry */}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {courses.map((course) => (
                  <CourseCardv2 key={course.courseId} course={course} />
                ))}
              </div>
            ) : (
              !isFetching && ( // Chỉ hiển thị "No courses" nếu không đang fetch
                <div className="text-center py-20 col-span-full">
                  <Search className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-xl font-semibold">No Courses Found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )
            )}

            {/* Pagination */}
            {totalPages > 1 && !isError && (
              <div className="flex justify-center mt-8 md:mt-10">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  isDisabled={isFetching}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoursesPage;
