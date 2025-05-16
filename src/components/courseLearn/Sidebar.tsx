// src/components/courseLearn/SidebarComponent.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react'; // Added useEffect, useState, useRef
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  PlayCircle as PlayIcon,
  Lock,
  FileText,
  Video,
  BookOpen,
  MessageSquare,
  Info,
  Menu,
  X as CloseIcon,
  ArrowLeft,
  Loader2, // Added ArrowLeft, Loader2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator'; // Added Separator
import { CourseLearningData } from '@/types/common.types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson } from '@/types/common.types';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'; // Avatar không được sử dụng

interface SidebarComponentProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  courseData: CourseLearningData | null;
  activeLessonId: number | string | null;
  onLessonSelect: (
    lessonId: number | string,
    sectionId: number | string
  ) => void;
  onToggleCourseInfo: () => void;
  onToggleAIAssistant: () => void;
}

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  courseData,
  activeLessonId,
  onLessonSelect,
  onToggleCourseInfo,
  onToggleAIAssistant,
}) => {
  const [expandedSections, setExpandedSections] = useState<
    Set<number | string>
  >(new Set());
  const activeLessonRef = useRef<HTMLButtonElement>(null);
  const { userData: user } = useAuth(); // Assuming useAuth is a custom hook to get user data
  // Effect to auto-expand section containing the active lesson
  useEffect(() => {
    if (courseData && activeLessonId) {
      const activeSection = courseData.sections.find((section) =>
        section.lessons.some((lesson) => lesson.lessonId === activeLessonId)
      );
      if (activeSection && !expandedSections.has(activeSection.sectionId)) {
        setExpandedSections((prev) =>
          new Set(prev).add(activeSection.sectionId)
        );
      }
    }
  }, [activeLessonId, courseData, expandedSections]); // expandedSections in dep array is fine with the check

  // Effect to scroll to the active lesson
  useEffect(() => {
    if (isSidebarOpen && activeLessonRef.current) {
      activeLessonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest', // 'center' or 'nearest' are good options
      });
    }
  }, [activeLessonId, isSidebarOpen, expandedSections]); // Also trigger on expandedSections change, as lesson might become visible

  const toggleSectionExpand = (sectionId: number | string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Calculate progress (ensure userProgress exists and is an object)
  const { completedLessonsCount = 0, totalLessonsInCourse = 0 } =
    useMemo(() => {
      if (!courseData || !courseData.sections)
        return { completedLessonsCount: 0, totalLessonsInCourse: 0 };
      return courseData.sections.reduce(
        (acc, section) => {
          acc.totalLessonsInCourse += section.lessons.length;
          // Check if lesson.isCompleted is directly available, otherwise use userProgress
          acc.completedLessonsCount += section.lessons.filter(
            (l) =>
              courseData.userProgress &&
              courseData.userProgress[l.lessonId]?.isCompleted
          ).length;
          return acc;
        },
        { completedLessonsCount: 0, totalLessonsInCourse: 0 }
      );
    }, [courseData]);

  if (!courseData) {
    return (
      <aside
        className={cn(
          'border-r bg-background flex flex-col transition-all duration-300 ease-in-out h-screen sticky top-0',
          isSidebarOpen ? 'w-72 md:w-80 lg:w-96' : 'w-0 md:w-16 overflow-hidden'
        )}
      >
        <div className="p-3 md:p-4 h-16 border-b flex items-center justify-between shrink-0">
          {isSidebarOpen && (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(!isSidebarOpen && 'mx-auto')}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        {/* Optional: Skeleton for closed sidebar icons */}
      </aside>
    );
  }

  const overallProgress =
    totalLessonsInCourse > 0
      ? (completedLessonsCount / totalLessonsInCourse) * 100
      : 0;

  const getLessonIcon = (lessonType: Lesson['lessonType']) => {
    if (lessonType === 'VIDEO')
      return <Video size={16} className="text-blue-500 shrink-0" />;
    if (lessonType === 'TEXT')
      return <FileText size={16} className="text-green-500 shrink-0" />;
    if (lessonType === 'QUIZ')
      return <BookOpen size={16} className="text-purple-500 shrink-0" />;
    return <div className="w-4 h-4 bg-gray-300 rounded-sm shrink-0"></div>;
  };

  return (
    <aside
      className={cn(
        'border-r bg-background flex flex-col transition-all duration-300 ease-in-out h-screen sticky top-0',
        isSidebarOpen ? 'w-72 md:w-80 lg:w-96' : 'w-0 md:w-16 overflow-hidden'
      )}
    >
      <div className="h-16 border-b flex items-center justify-between shrink-0 px-3 md:px-4">
        {isSidebarOpen && (
          <Link
            to="/my-courses"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={18} />
            <span
              className="text-sm font-medium truncate"
              title={courseData.courseName}
            >
              Back to Learning
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            isSidebarOpen && 'ml-auto',
            !isSidebarOpen && 'mx-auto'
          )}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {isSidebarOpen ? (
        <>
          <div className="p-4 border-b">
            <div className="flex justify-between items-center text-xs mb-1 text-muted-foreground">
              <span>Your Progress</span>
              <span className="font-semibold text-primary">
                {overallProgress.toFixed(0)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1.5">
              {completedLessonsCount} of {totalLessonsInCourse} lessons
              completed
            </p>
          </div>

          <ScrollArea className="flex-grow">
            <div className="py-2 px-1 md:px-2">
              {courseData.sections
                .sort((a, b) => a.sectionOrder - b.sectionOrder)
                .map((section) => {
                  const sectionLessonsCount = section.lessons.length;
                  const sectionCompletedLessons = section.lessons.filter(
                    (l) =>
                      courseData.userProgress &&
                      courseData.userProgress[l.lessonId]?.isCompleted
                  ).length;
                  const sectionIsCompleted =
                    sectionLessonsCount > 0 &&
                    sectionCompletedLessons === sectionLessonsCount;

                  return (
                    <div key={section.sectionId} className="mb-1">
                      <button
                        className="w-full flex items-center justify-between p-2.5 text-left rounded-md hover:bg-muted dark:hover:bg-muted/50 transition-colors"
                        onClick={() => toggleSectionExpand(section.sectionId)}
                        aria-expanded={expandedSections.has(section.sectionId)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Layers
                            size={16}
                            className="text-muted-foreground shrink-0"
                          />
                          <span
                            className="text-sm font-medium truncate flex-1"
                            title={section.sectionName}
                          >
                            {section.sectionName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xxs text-muted-foreground">
                            {sectionCompletedLessons}/{sectionLessonsCount}
                          </span>
                          {sectionIsCompleted && (
                            <CheckCircle size={14} className="text-green-500" />
                          )}
                          {expandedSections.has(section.sectionId) ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </div>
                      </button>

                      {expandedSections.has(section.sectionId) && (
                        <div className="pl-4 mt-1 space-y-0.5">
                          {section.lessons
                            .sort((a, b) => a.lessonOrder - b.lessonOrder)
                            .map((lesson) => {
                              const isLessonActive =
                                activeLessonId === lesson.lessonId;
                              // Ưu tiên lesson.isCompleted nếu nó được truyền từ CourseLearningPage, nếu không thì fallback về userProgress
                              const isLessonCompleted =
                                courseData.userProgress &&
                                courseData.userProgress[lesson.lessonId]
                                  ?.isCompleted;
                              const canAccess =
                                lesson.isFreePreview ||
                                courseData.isEnrolled ||
                                user?.role === 'SA' ||
                                user?.role === 'AD'; // Admin và các vai trò SA, AD có thể truy cập

                              return (
                                <button
                                  key={lesson.lessonId}
                                  ref={isLessonActive ? activeLessonRef : null} // Gán ref cho lesson đang active
                                  disabled={!canAccess}
                                  onClick={() =>
                                    canAccess &&
                                    onLessonSelect(
                                      lesson.lessonId,
                                      section.sectionId
                                    )
                                  }
                                  className={cn(
                                    'w-full flex items-center justify-between p-2 text-left rounded-md text-xs transition-colors',
                                    isLessonActive
                                      ? 'bg-primary/10 text-primary font-semibold'
                                      : 'hover:bg-muted/50 dark:hover:bg-muted/20 text-muted-foreground hover:text-foreground',
                                    !canAccess &&
                                      'opacity-60 cursor-not-allowed'
                                  )}
                                  title={
                                    canAccess
                                      ? lesson.lessonName
                                      : courseData.isEnrolled
                                      ? 'Content locked'
                                      : 'Enroll to access'
                                  }
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {getLessonIcon(lesson.lessonType)}
                                    <span className="truncate flex-1">
                                      {lesson.lessonName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {lesson.isFreePreview &&
                                      !courseData.isEnrolled &&
                                      !courseData.isEnrolled &&
                                      (user?.role === 'SA' ||
                                        user?.role === 'AD') && (
                                        <Badge
                                          variant="outline"
                                          className="px-1 py-0 text-[10px] h-4 leading-none"
                                        >
                                          Preview
                                        </Badge>
                                      )}
                                    {isLessonCompleted ? (
                                      <CheckCircle
                                        size={14}
                                        className="text-green-500"
                                      />
                                    ) : !canAccess ? (
                                      <Lock size={12} />
                                    ) : isLessonActive ? (
                                      <PlayIcon
                                        size={14}
                                        className="text-primary fill-current"
                                      />
                                    ) : null}
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </ScrollArea>

          <div className="p-3 border-t mt-auto shrink-0">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCourseInfo}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <Info size={16} className="mr-2" /> Course Info
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleAIAssistant}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <MessageSquare size={16} className="mr-2" /> AI Assistant
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-start pt-4 space-y-4 h-full">
          <Link
            to="/my-courses"
            className="p-2 rounded-md hover:bg-muted block"
            title="Back to My Learning"
          >
            <ArrowLeft size={20} />
          </Link>
          <Separator orientation="horizontal" className="w-3/4" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCourseInfo}
            title="Course Info"
            className="h-10 w-10 rounded-lg"
          >
            <Info size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleAIAssistant}
            title="AI Assistant"
            className="h-10 w-10 rounded-lg"
          >
            <MessageSquare size={20} />
          </Button>
        </div>
      )}
    </aside>
  );
};

export default SidebarComponent;
