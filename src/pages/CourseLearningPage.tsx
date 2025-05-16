/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/CourseLearningPage.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SidebarComponent from '@/components/courseLearn/Sidebar';
import LessonContentWrapper from '@/components/courseLearn/LessonContentWrapper';
import AIAssistantDialog from '@/components/courseLearn/AIAssistantDialog';
import CourseInfoDialog from '@/components/courseLearn/CourseInfoDialog';
import {
  courseKeys,
  useCourseDetailBySlug,
} from '@/hooks/queries/course.queries'; // Đảm bảo hook này trả về userProgress
import { useAuth } from '@/contexts/AuthContext';
import { CourseLearningData } from '@/types/common.types'; // UserLessonProgressMap
import {
  Loader2,
  AlertTriangle,
  XCircle,
  Info as InfoIcon,
} from 'lucide-react'; // Đổi tên Info
import { useToast } from '@/hooks/use-toast';
import {
  progressKeys,
  useMarkLessonCompletion,
  useUpdateLastWatchedPosition,
} from '@/hooks/queries/progress.queries';
import { useQueryClient } from '@tanstack/react-query';
import FullScreenLoader from '@/components/common/FullScreenLoader';
import Layout from '@/components/layout/Layout'; // Import Layout
import { LessonProgress } from '@/services/progress.service';
import { QuizAttemptResultResponse } from '@/services/quiz.service';
import { parse } from 'path';

// --- Constants ---
const VIDEO_PROGRESS_UPDATE_DEBOUNCE_TIME = 15000; // 15 giây

const CourseLearningPage: React.FC = () => {
  const {
    courseSlug,
    sectionId: sectionIdFromUrl,
    lessonId: lessonIdFromUrl,
  } = useParams<{
    courseSlug: string;
    sectionId?: string;
    lessonId?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userData: user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isCourseInfoOpen, setIsCourseInfoOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<number | string | null>(
    null
  );
  const [activeSectionId, setActiveSectionId] = useState<
    number | string | null
  >(null);
  const [activeTabInLesson, setActiveTabInLesson] = useState<
    'description' | 'resources' | 'discussions'
  >('description');

  const {
    data: courseData,
    isLoading: isLoadingCourseDetail,
    isError: isCourseDetailError,
    error: courseDetailErrorObj,
    refetch: refetchCourseDetail,
  } = useCourseDetailBySlug(courseSlug!, {
    // Thêm ! cho courseSlug vì nó là required param
    enabled: !!user && !!courseSlug,
    staleTime: 1000 * 60 * 2, // 2 phút
    refetchOnWindowFocus: true,
  });

  const { mutate: markCompleteMutate, isPending: isMarkingCompletion } =
    useMarkLessonCompletion({
      onSuccess: (updatedProgressData, variables) => {
        toast({
          title: `Lesson ${
            variables.isCompleted ? 'Completed' : 'Marked Incomplete'
          }`,
          description: `Progress for "${
            activeLessonData?.lesson.lessonName || 'this lesson'
          }" has been updated.`,
          variant: variables.isCompleted ? 'default' : 'destructive',
        });
        queryClient.setQueryData(
          courseKeys.detailBySlug(courseSlug!),
          (oldData: CourseLearningData | undefined) => {
            if (!oldData) return oldData;
            const newProgress: LessonProgress = {
              ...(oldData.userProgress || {}),
              [variables.lessonId]: {
                isCompleted: variables.isCompleted,
                lastWatchedPosition:
                  updatedProgressData.lastWatchedPosition ??
                  oldData.userProgress?.[variables.lessonId]
                    ?.lastWatchedPosition ??
                  0,
                progressPercentage: variables.isCompleted ? 100 : 0,
              },
            };
            return { ...oldData, userProgress: newProgress };
          }
        );
        if (currentCourse?.courseId) {
          queryClient.invalidateQueries({
            queryKey: progressKeys.courseProgress(currentCourse.courseId),
          });
        }

        // Tự động chuyển bài nếu là TEXT lesson và vừa được đánh dấu hoàn thành
        if (
          variables.isCompleted &&
          activeLessonData?.lesson.lessonType === 'TEXT'
        ) {
          handleNavigateToLessonDirection('next');
        }
      },
      onError: (error: any) => {
        toast({
          title: 'Update Progress Failed',
          description: error.message,
          variant: 'destructive',
        });
      },
    });

  const lastPositionUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate: updatePositionMutate } = useUpdateLastWatchedPosition({
    onSuccess: (updatedProgressData, variables) => {
      // Cập nhật cache lạc quan cho lastWatchedPosition và progressPercentage
      queryClient.setQueryData(
        courseKeys.detailBySlug(courseSlug!),
        (oldData: CourseLearningData | undefined) => {
          if (!oldData || !oldData.userProgress) return oldData;
          const lessonProgress = oldData.userProgress[variables.lessonId] || {
            isCompleted: false,
            lastWatchedPosition: 0,
            progressPercentage: 0,
          };
          const newProgress: LessonProgress = {
            ...oldData.userProgress,
            [variables.lessonId]: {
              ...lessonProgress,
              lastWatchedPosition: variables.position,
              progressPercentage: lessonProgress.isCompleted ? 100 : 0,
            },
          };
          return { ...oldData, userProgress: newProgress };
        }
      );
    },
    onError: (error: any) =>
      console.warn('Failed to update video position:', error.message),
  });

  const currentCourse = useMemo(
    () => courseData as CourseLearningData | null,
    [courseData]
  );

  const allLessonsFlat = useMemo(() => {
    if (!currentCourse?.sections) return [];

    return currentCourse.sections
      .sort((a, b) => a.sectionOrder - b.sectionOrder)
      .flatMap((section) =>
        section.lessons
          .sort((a, b) => a.lessonOrder - b.lessonOrder)
          .map((lesson) => ({
            sectionId: section.sectionId,
            lesson: {
              ...lesson,
              isCompleted:
                !!currentCourse.userProgress?.[lesson.lessonId]?.isCompleted,
              lastPositionWatched:
                lesson.lessonType === 'VIDEO'
                  ? currentCourse.userProgress?.[lesson.lessonId]
                      ?.lastWatchedPosition || 0
                  : undefined,
            },
          }))
      );
  }, [currentCourse]);

  const activeLessonData = useMemo(() => {
    return (
      allLessonsFlat.find((item) => item.lesson.lessonId === activeLessonId) ||
      null
    );
  }, [activeLessonId, allLessonsFlat]);

  const activeSectionData = useMemo(() => {
    if (!activeSectionId || !currentCourse?.sections) return null;
    return (
      currentCourse.sections.find((s) => s.sectionId === activeSectionId) ||
      null
    );
  }, [activeSectionId, currentCourse?.sections]);

  const currentLessonOverallIndex = useMemo(() => {
    return allLessonsFlat.findIndex(
      (item) => item.lesson.lessonId === activeLessonId
    );
  }, [activeLessonId, allLessonsFlat]);

  useEffect(() => {
    if (
      currentCourse &&
      allLessonsFlat.length > 0 &&
      user &&
      !isLoadingCourseDetail
    ) {
      // const parsedLessonId = lessonIdFromUrl
      //   ? parseInt(lessonIdFromUrl, 10)
      //   : null;
      // const parsedSectionId = sectionIdFromUrl
      //   ? parseInt(sectionIdFromUrl, 10)
      //   : null;

      const lessonFromUrl = allLessonsFlat.find(
        (l) =>
          l.lesson.lessonId === lessonIdFromUrl &&
          l.sectionId === sectionIdFromUrl
      );
      console.log('lessonFromUrl', allLessonsFlat, lessonFromUrl);

      if (lessonFromUrl) {
        if (
          activeLessonId !== lessonFromUrl.lesson.lessonId ||
          activeSectionId !== lessonFromUrl.sectionId
        ) {
          setActiveLessonId(lessonFromUrl.lesson.lessonId);
          setActiveSectionId(lessonFromUrl.sectionId);
          console.log(
            `[Init Lesson] Set from URL: S${lessonFromUrl.sectionId}/L${lessonFromUrl.lesson.lessonId}`
          );
        }
      } else {
        // Tìm lesson chưa hoàn thành đầu tiên hoặc lesson đầu tiên của khóa học
        let lessonToDisplay = allLessonsFlat.find(
          (item) => !item.lesson.isCompleted
        );
        if (!lessonToDisplay && allLessonsFlat.length > 0) {
          lessonToDisplay = allLessonsFlat[0];
        }

        if (lessonToDisplay) {
          const newPath = `/learn/${courseSlug}/sections/${lessonToDisplay.sectionId}/lessons/${lessonToDisplay.lesson.lessonId}`;
          if (location.pathname !== newPath) {
            console.log(
              `[Init Lesson] Navigating to first/default lesson: ${newPath}`
            );
            navigate(newPath, { replace: true });
            // State (activeLessonId, activeSectionId) sẽ được cập nhật bởi effect này khi URL thay đổi
          } else if (
            activeLessonId !== lessonToDisplay.lesson.lessonId ||
            activeSectionId !== lessonToDisplay.sectionId
          ) {
            // URL đã đúng nhưng state React chưa khớp, cập nhật state
            setActiveLessonId(lessonToDisplay.lesson.lessonId);
            setActiveSectionId(lessonToDisplay.sectionId);
          }
        } else if (allLessonsFlat.length === 0) {
          console.warn('[Init Lesson] No lessons in this course.');
          // Thông báo sẽ hiển thị ở phần render
        }
      }
    }
  }, [
    currentCourse,
    allLessonsFlat,
    lessonIdFromUrl,
    sectionIdFromUrl,
    navigate,
    courseSlug,
    location.pathname,
    user,
    isLoadingCourseDetail,
    activeLessonId,
    activeSectionId, // Thêm để tránh loop nếu URL đúng nhưng state sai
  ]);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLessonSelect = useCallback(
    (lessonId: number, sectionId: number) => {
      if (activeLessonId !== lessonId || activeSectionId !== sectionId) {
        setActiveLessonId(lessonId);
        setActiveSectionId(sectionId);
        setActiveTabInLesson('description');
        navigate(
          `/learn/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`
        );
      }
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    },
    [activeLessonId, activeSectionId, navigate, courseSlug]
  );

  const handleMarkCompleteToggle = useCallback(
    (lessonIdToToggle: number | string, currentIsCompleted: boolean) => {
      if (isMarkingCompletion) return;
      markCompleteMutate({
        lessonId: Number(lessonIdToToggle),
        isCompleted: !currentIsCompleted,
      });
    },
    [isMarkingCompletion, markCompleteMutate]
  );

  const handleNavigateToLessonDirection = useCallback(
    (direction: 'prev' | 'next') => {
      if (currentLessonOverallIndex === -1) return; // Chưa có bài active
      console.log('direction', direction);
      let targetItem = null;
      if (direction === 'prev' && currentLessonOverallIndex > 0) {
        targetItem = allLessonsFlat[currentLessonOverallIndex - 1];
      } else if (direction === 'next') {
        console.log('currentLessonOverallIndex', currentLessonOverallIndex);
        console.log('allLessonsFlat', allLessonsFlat);
        if (currentLessonOverallIndex < allLessonsFlat.length - 1) {
          targetItem = allLessonsFlat[currentLessonOverallIndex + 1];
          if (
            activeLessonData &&
            !activeLessonData.lesson.isCompleted &&
            !isMarkingCompletion
          ) {
            markCompleteMutate({
              lessonId: Number(activeLessonData.lesson.lessonId),
              isCompleted: true,
            });
          }
        } else {
          // Bài cuối cùng
          if (
            activeLessonData &&
            !activeLessonData.lesson.isCompleted &&
            !isMarkingCompletion
          ) {
            markCompleteMutate({
              lessonId: Number(activeLessonData.lesson.lessonId),
              isCompleted: true,
            });
          }
          toast({
            title: 'Course Finished!',
            description: 'Congratulations on completing all lessons!',
            duration: 5000,
            action: (
              <Button asChild variant="link">
                <Link to={`/courses/${courseSlug}/reviews`}>
                  Leave a Review
                </Link>
              </Button>
            ),
          });
          // navigate(`/courses/${courseSlug}/completed`); // Hoặc trang tổng kết khóa học
          return;
        }
      }

      if (targetItem) {
        handleLessonSelect(
          Number(targetItem.lesson.lessonId),
          Number(targetItem.sectionId)
        );
      }
    },
    [
      currentLessonOverallIndex,
      allLessonsFlat,
      activeLessonData,
      isMarkingCompletion,
      markCompleteMutate,
      handleLessonSelect,
      courseSlug,
      toast,
    ]
  );

  const handleQuizCompleted = useCallback(
    (result: QuizAttemptResultResponse) => {
      // Cập nhật lại thông tin khóa học (bao gồm userProgress)
      // API markCompleteMutate nên trả về userProgress mới nhất, hoặc ta cần refetch
      queryClient.invalidateQueries({
        queryKey: courseKeys.detailBySlug(courseSlug!),
      });

      const isPassed =
        result.attempt.isPassed ??
        (result.attempt.score !== null &&
          result.attempt.score >= (result.attempt?.score ?? 70));

      if (isPassed && activeLessonId === result.attempt.lessonId) {
        // Đánh dấu hoàn thành nếu chưa (onSuccess của markCompleteMutate sẽ handle toast và cập nhật UI)
        if (!activeLessonData?.lesson.isCompleted) {
          markCompleteMutate({ lessonId: activeLessonId, isCompleted: true });
        }
        toast({
          title: `Quiz Score: ${result.attempt.score?.toFixed(0)}%`,
          description: 'Great job! Moving to the next lesson.',
          duration: 4000,
        });
        setTimeout(() => handleNavigateToLessonDirection('next'), 5000); // Delay để user đọc toast
      } else if (activeLessonId === result.attempt.lessonId) {
        toast({
          title: `Quiz Score: ${result.attempt.score?.toFixed(0)}%`,
          description: `Passing score: ${
            result.attempt?.score ?? 70
          }%. Keep practicing!`,
          variant: 'default',
        });
      }
    },
    [
      activeLessonId,
      markCompleteMutate,
      handleNavigateToLessonDirection,
      toast,
      courseSlug,
      queryClient,
      activeLessonData?.lesson.isCompleted,
    ]
  );

  const handleVideoProgressUpdate = useCallback(
    (lessonId: number, position: number) => {
      if (lastPositionUpdateRef.current)
        clearTimeout(lastPositionUpdateRef.current);
      lastPositionUpdateRef.current = setTimeout(() => {
        if (user) updatePositionMutate({ lessonId, position });
      }, VIDEO_PROGRESS_UPDATE_DEBOUNCE_TIME);
    },
    [updatePositionMutate, user]
  );

  const handleVideoEnded = useCallback(
    (lessonId: number) => {
      if (
        activeLessonData &&
        lessonId === activeLessonData.lesson.lessonId &&
        !activeLessonData.lesson.isCompleted &&
        !isMarkingCompletion
      ) {
        markCompleteMutate({ lessonId, isCompleted: true });
      }
    },
    [activeLessonData, isMarkingCompletion, markCompleteMutate]
  );

  // --- Render Logic ---
  if (isLoadingCourseDetail && !currentCourse) {
    // Chờ auth và course detail ban đầu
    return <FullScreenLoader />;
  }
  if (!user) {
    // User chưa đăng nhập
    return (
      <Layout>
        <div className="container mx-auto p-12 text-center">
          <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-xl">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
            <h1 className="text-2xl font-bold">Authentication Required</h1>
            <p className="mt-2 text-muted-foreground">
              Please{' '}
              <Link
                to={`/login?redirect=${location.pathname}${location.search}`}
                className="text-primary hover:underline font-semibold"
              >
                log in
              </Link>{' '}
              to access this course.
            </p>
          </div>
        </div>
      </Layout>
    );
  }
  if (isCourseDetailError || !currentCourse) {
    // Lỗi load khóa học hoặc không có data
    return (
      <Layout>
        <div className="container mx-auto p-12 text-center">
          <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-xl">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold">Error Loading Course</h1>
            <p className="mt-2 text-muted-foreground">
              {(courseDetailErrorObj as Error)?.message ||
                'Could not load course details.'}
            </p>
            <Button asChild className="mt-6">
              <Link to="/my-courses">Back to My Learning</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  // Điều kiện truy cập: enrolled HOẶC admin HOẶC khóa học free
  const canAccessCourse =
    currentCourse.isEnrolled ||
    user.isAdmin ||
    (currentCourse.originalPrice === 0 && currentCourse.discountedPrice === 0);
  if (!canAccessCourse) {
    // Không có quyền truy cập
    return (
      <Layout>
        <div className="container mx-auto p-12 text-center">
          <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-xl">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="mt-2 text-muted-foreground">
              You are not enrolled in this course or it requires purchase.
            </p>
            <Button asChild className="mt-6">
              <Link to={`/courses/${currentCourse.slug}`}>
                Go to Course Page
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  if (allLessonsFlat.length === 0 && !isLoadingCourseDetail) {
    // Khóa học không có bài giảng
    return (
      <Layout>
        <div className="container mx-auto p-12 text-center">
          <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-xl">
            <InfoIcon className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <h1 className="text-2xl font-bold">Content Coming Soon</h1>
            <p className="mt-2 text-muted-foreground">
              This course doesn't have any lessons yet. Please check back later.
            </p>
            <Button asChild className="mt-6">
              <Link to="/my-courses">Back to My Learning</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  if (!activeLessonData || !activeSectionData) {
    // Chưa xác định được bài học active (ví dụ URL sai, logic init lỗi)
    return <FullScreenLoader />; // Hoặc một UI lỗi khác
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/10 dark:bg-background">
      <SidebarComponent
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={currentCourse}
        activeLessonId={activeLessonId}
        onLessonSelect={handleLessonSelect}
        onToggleCourseInfo={() => setIsCourseInfoOpen((prev) => !prev)}
        onToggleAIAssistant={() => setIsAIAssistantOpen((prev) => !prev)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <LessonContentWrapper
          course={currentCourse}
          activeLesson={activeLessonData?.lesson}
          activeSection={activeSectionData}
          allLessonsFlat={allLessonsFlat} // Vẫn cần để tính hasPrev/Next trong Wrapper
          onNavigateLesson={handleNavigateToLessonDirection}
          onMarkCompleteToggle={(lessonId, currentStatus) =>
            handleMarkCompleteToggle(lessonId, currentStatus)
          }
          isMarkingCompletion={isMarkingCompletion}
          activeTab={activeTabInLesson}
          setActiveTab={setActiveTabInLesson}
          onQuizCompleted={handleQuizCompleted}
          onVideoProgressUpdate={handleVideoProgressUpdate}
          // onVideoEnded={handleVideoEnded} // Thêm callback onVideoEnded
          markLessonCompleted={markCompleteMutate} // Truyền hàm markCompleteMutate
          courseInstructorId={currentCourse.instructorAccountId} // Truyền instructorId
        />
      </main>

      {/* Dialogs */}
      {user && (
        <AIAssistantDialog
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          lessonContext={{
            lessonId: activeLessonData?.lesson.lessonId,
            lessonName: activeLessonData?.lesson.lessonName,
            lessonContent:
              activeLessonData?.lesson.textContent ||
              activeLessonData?.lesson.description,
          }}
          courseContext={{
            courseId: currentCourse.courseId,
            courseName: currentCourse.courseName,
          }}
        />
      )}
      {/* <CourseInfoDialog
        isOpen={isCourseInfoOpen}
        onClose={() => setIsCourseInfoOpen(false)}
        course={currentCourse}
      /> */}
    </div>
  );
};

export default CourseLearningPage;
