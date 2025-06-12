// src/components/courseLearn/LessonContentRenderer.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/common/Icons';

// Components
import QuizPlayer from './QuizPlayer';
import UnifiedVideoPlayer from './UnifiedVideoPlayer';

// Types
import { Lesson } from '@/types/common.types';
import { QuizAttemptResultResponse } from '@/services/quiz.service';

interface LessonContentRendererProps {
  lesson: Lesson;
  onQuizCompleted: (result: QuizAttemptResultResponse) => void;
  onVideoProgressUpdate: (lessonId: number | string, position: number) => void;
  onVideoEnded: (lessonId: number | string) => void;
}

const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({
  lesson,
  onQuizCompleted,
  onVideoProgressUpdate,
  onVideoEnded,
}) => {
  const { t } = useTranslation();

  // --- Render VIDEO ---
  if (lesson.lessonType === 'VIDEO') {
    return (
      <div className='bg-black rounded-lg overflow-hidden shadow-2xl animate-fadeIn'>
        <UnifiedVideoPlayer
          lesson={lesson}
          onTimeUpdate={(currentTime) =>
            onVideoProgressUpdate(lesson.lessonId!, currentTime)
          }
          onEnded={() => onVideoEnded(lesson.lessonId!)}
        />
      </div>
    );
  }

  // --- Render TEXT ---
  if (lesson.lessonType === 'TEXT') {
    return (
      <Card className='shadow-lg animate-fadeIn border-none bg-transparent sm:bg-card sm:border'>
        <CardContent className='p-0 sm:p-6'>
          <article className='prose prose-sm sm:prose-base dark:prose-invert max-w-none lg:prose-lg xl:prose-xl mx-auto py-1 leading-relaxed'>
            {lesson.textContent ? (
              <div dangerouslySetInnerHTML={{ __html: lesson.textContent }} />
            ) : (
              <div className='text-center py-10 text-muted-foreground'>
                <Icons.fileText className='h-12 w-12 mx-auto mb-3 opacity-40' />
                <p className='italic'>
                  {t('lessonContentRenderer.textNoContent')}
                </p>
              </div>
            )}
          </article>
        </CardContent>
      </Card>
    );
  }

  // --- Render QUIZ ---
  if (lesson.lessonType === 'QUIZ') {
    return (
      <div className='animate-fadeIn max-w-2xl mx-auto'>
        <QuizPlayer
          lessonId={lesson.lessonId!}
          lessonName={lesson.lessonName}
          onQuizComplete={onQuizCompleted}
        />
      </div>
    );
  }

  // --- Fallback ---
  return (
    <div className='p-8 text-center text-muted-foreground animate-fadeIn min-h-[300px] flex items-center justify-center'>
      {t('lessonContentRenderer.unsupportedType')}
    </div>
  );
};

export default LessonContentRenderer;
