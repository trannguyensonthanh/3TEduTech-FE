// src/components/instructor/courseCreate/LessonQuizManager.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/common/Icons';
import { toast } from 'sonner';
import QuizQuestionDialog from './QuizQuestionDialog';
import {
  useLessonQuizQuestions,
  useDeleteQuizQuestion,
} from '@/hooks/queries/lesson.queries';
import { QuizQuestion } from '@/services/quiz.service';

interface LessonQuizManagerProps {
  lessonId: number;
  courseId: number;
}

export const LessonQuizManager: React.FC<LessonQuizManagerProps> = ({
  lessonId,
  courseId,
}) => {
  const { data, isLoading, isError, error } = useLessonQuizQuestions(lessonId, {
    enabled: !!lessonId,
  });
  const { mutate: deleteQuestion, isPending: isDeleting } =
    useDeleteQuizQuestion();

  const [isQuizDialogOpen, setQuizDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null
  );

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuizDialogOpen(true);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setQuizDialogOpen(true);
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(
        { lessonId, questionId },
        {
          onSuccess: () => toast.success('Question deleted.'),
          onError: (err) =>
            toast.error(err.message || 'Failed to delete question.'),
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className='p-4 text-center'>
        <Icons.spinner className='h-5 w-5 animate-spin mx-auto' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-4 text-center text-destructive'>{error.message}</div>
    );
  }

  const questions = data?.questions || [];

  return (
    <div className='space-y-4 border rounded-md p-4'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold text-base flex items-center'>
          <Icons.help className='h-5 w-5 mr-2 text-primary' />
          Quiz Questions
        </h3>
        <Button variant='outline' size='sm' onClick={handleAddQuestion}>
          <Icons.plus className='mr-2 h-4 w-4' /> Add Question
        </Button>
      </div>
      <div className='space-y-3'>
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div
              key={q.questionId}
              className='flex items-start justify-between p-3 border rounded bg-background'
            >
              <p className='font-medium text-sm flex-1 mr-2'>
                Q{index + 1}:{' '}
                <span className='font-normal line-clamp-2'>
                  {q.questionText}
                </span>
              </p>
              <div className='flex space-x-1 shrink-0'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7'
                  onClick={() => handleEditQuestion(q)}
                >
                  <Icons.edit className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7'
                  onClick={() => handleDeleteQuestion(q.questionId!)}
                  disabled={isDeleting}
                >
                  <Icons.trash className='h-4 w-4 text-destructive' />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-sm text-center text-muted-foreground py-4'>
            No questions have been added to this quiz yet.
          </p>
        )}
      </div>

      {isQuizDialogOpen && (
        <QuizQuestionDialog
          key={editingQuestion?.questionId || 'new'}
          open={isQuizDialogOpen}
          onClose={() => setQuizDialogOpen(false)}
          initialData={editingQuestion}
          isEditing={!!editingQuestion}
          lessonId={lessonId}
          courseId={courseId}
        />
      )}
    </div>
  );
};
