// src/components/courseLearn/LessonContentWrapper.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area'; // Added ScrollArea import
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  PlayCircleIcon,
} from 'lucide-react';
import LessonTabs from './LessonTabs';
import LessonContentRenderer from './LessonContentRenderer';
import { CourseLearningData, Lesson } from '@/types/common.types';
import { QuizAttemptResultResponse } from '@/services/quiz.service';
import { Section } from '@/services/section.service';
// import { useAuth } from '@/contexts/AuthContext'; // Không cần thiết ở đây nếu chỉ lấy instructorId từ course prop

interface LessonContentWrapperProps {
  course: CourseLearningData;
  activeLesson: Lesson | null;
  activeSection: Section | null;
  allLessonsFlat: { lesson: Lesson; sectionId: number | string }[];
  onNavigateLesson: (direction: 'prev' | 'next') => void;
  onMarkCompleteToggle: (
    lessonId: number | string,
    currentCompletionStatus: boolean
  ) => void;
  isMarkingCompletion?: boolean;
  activeTab: 'description' | 'resources' | 'discussions';
  setActiveTab: (tab: 'description' | 'resources' | 'discussions') => void;
  onQuizCompleted: (result: QuizAttemptResultResponse) => void;
  onVideoProgressUpdate: (lessonId: number, position: number) => void;
  // Thêm prop này nếu CourseLearningPage muốn truyền hàm markComplete xuống
  // để LessonContentRenderer (ví dụ: VideoPlayer) có thể tự động đánh dấu hoàn thành
  markLessonCompleted: (payload: {
    lessonId: number;
    isCompleted: boolean;
  }) => void;
  courseInstructorId: number; // Thêm prop này
}

const LessonContentWrapper: React.FC<LessonContentWrapperProps> = ({
  course,
  activeLesson,
  activeSection,
  allLessonsFlat, // Không dùng trực tiếp ở đây nữa, đã có hasPrev/Next
  onNavigateLesson,
  onMarkCompleteToggle,
  isMarkingCompletion,
  activeTab,
  setActiveTab,
  onQuizCompleted,
  onVideoProgressUpdate,
  markLessonCompleted, // Nhận prop

  courseInstructorId, // Nhận prop
}) => {
  // const { user } = useAuth(); // Không cần nếu instructorId được truyền qua props

  if (!activeLesson || !activeSection) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/30 dark:bg-background">
        <PlayCircleIcon className="h-20 w-20 text-muted-foreground opacity-50 mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">
          Select a lesson to begin
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your learning journey starts here. Choose a lesson from the sidebar.
        </p>
      </main>
    );
  }

  // currentLessonIndex, prevLessonItem, nextLessonItem giờ sẽ được quản lý ở CourseLearningPage
  // Thay vào đó, chúng ta sẽ dùng props đơn giản hơn để xác định có nút prev/next không.
  // CourseLearningPage sẽ truyền onNavigateLesson với logic xử lý prev/next đã được tính toán.
  const currentLessonIndex = allLessonsFlat.findIndex(
    (l) => l.lesson.lessonId === activeLesson.lessonId
  );
  const hasPrevLesson = currentLessonIndex > 0;
  const hasNextLesson = currentLessonIndex < allLessonsFlat.length - 1;

  // Lấy trạng thái hoàn thành từ activeLesson (nếu CourseLearningPage đã tính toán) hoặc từ course.userProgress
  const isLessonCompleted =
    course.userProgress?.[activeLesson.lessonId]?.isCompleted || false;

  return (
    <main className="flex-1 flex flex-col bg-muted/20 dark:bg-gray-900/30 overflow-hidden">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b shadow-sm id_main_content_header">
        {' '}
        {/* Đặt id cho header này */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:inline-flex shrink-0"
                asChild
              >
                <Link
                  to={`/courses/${course.slug}`}
                  title="Back to Course Overview"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="min-w-0 flex-1">
                <h1
                  className="text-sm sm:text-base md:text-lg font-semibold truncate"
                  title={activeLesson.lessonName}
                >
                  {activeLesson.lessonName}
                </h1>
                <p
                  className="text-xs text-muted-foreground truncate"
                  title={activeSection.sectionName}
                >
                  Part of: {activeSection.sectionName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateLesson('prev')}
                disabled={!hasPrevLesson || isMarkingCompletion}
                className="h-9 px-2 sm:px-3"
              >
                <ChevronLeft className="h-4 w-4 sm:mr-1" />{' '}
                <span className="hidden sm:inline">Prev</span>
              </Button>

              {isLessonCompleted ? (
                <Button
                  variant="outline" // Đảm bảo variant này tồn tại
                  size="sm"
                  onClick={() =>
                    onMarkCompleteToggle(activeLesson.lessonId, true)
                  } // true = current status is completed
                  disabled={isMarkingCompletion}
                  className="h-9 px-3 whitespace-nowrap"
                >
                  {isMarkingCompletion ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 sm:mr-1" />
                  )}
                  <span className="hidden sm:inline ml-1">Completed</span>
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    onMarkCompleteToggle(activeLesson.lessonId, false)
                  } // false = current status is not completed
                  disabled={isMarkingCompletion}
                  className="h-9 px-3 whitespace-nowrap"
                >
                  {isMarkingCompletion && (
                    <Loader2 className="h-4 w-4 animate-spin sm:mr-1" />
                  )}
                  Mark as Complete
                </Button>
              )}

              <Button
                variant="default"
                size="sm"
                onClick={() => onNavigateLesson('next')}
                // Logic: disable nếu đang xử lý, hoặc là bài cuối và KHÔNG muốn tự động đi đến trang "Finish Course" từ đây
                // Nếu muốn nút "Finish" luôn điều hướng, thì chỉ disable khi isMarkingCompletion
                disabled={
                  isMarkingCompletion ||
                  (!hasNextLesson &&
                    isLessonCompleted &&
                    activeLesson.lessonType !== 'QUIZ')
                } // Nếu là quiz cuối, cho phép click để trigger onQuizCompleted
                className="h-9 px-2 sm:px-3"
              >
                <span className="hidden sm:inline">
                  {hasNextLesson ? 'Next' : 'Finish'}
                </span>
                <ChevronRight className="h-4 w-4 sm:ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow bg-background relative" type="auto">
          <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full">
            <div className="max-w-4xl mx-auto">
              {' '}
              {/* Tăng max-w cho nội dung */}
              <LessonContentRenderer
                lesson={activeLesson}
                courseId={course.courseId}
                onQuizCompleted={onQuizCompleted}
                onVideoProgressUpdate={onVideoProgressUpdate}
                markLessonCompleted={markLessonCompleted} // Truyền xuống
              />
            </div>
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t bg-card z-20 shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_5px_-1px_rgba(0,0,0,0.2)]">
          {' '}
          {/* Cải thiện shadow */}
          <div className="container mx-auto px-0 sm:px-2 md:px-4 max-w-full">
            <LessonTabs
              lesson={activeLesson}
              courseId={course.courseId}
              courseInstructorId={courseInstructorId} // Sử dụng prop đã truyền
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default LessonContentWrapper;
