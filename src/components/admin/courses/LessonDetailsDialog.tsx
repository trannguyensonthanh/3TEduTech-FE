import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Play } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: string;
  isPreview: boolean;
  videoUrl?: string;
  content?: string;
  questions?: Array<{
    id: number;
    text: string;
    explanation: string;
    options: Array<{
      id: number;
      text: string;
      isCorrect: boolean;
    }>;
  }>;
  resources?: Array<{
    id: number;
    title: string;
    type: string;
  }>;
  sectionTitle: string;
}

interface LessonDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson | null;
}

const LessonDetailsDialog: React.FC<LessonDetailsDialogProps> = ({
  open,
  onOpenChange,
  lesson,
}) => {
  if (!lesson) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{lesson.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {lesson.type === 'VIDEO' && (
            <div>
              <h3 className="text-lg font-medium mb-2">Video Content</h3>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                {lesson.videoUrl ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    className="rounded-md"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-center">
                    <Play className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No video URL provided
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                Duration: {lesson.duration}
              </div>
            </div>
          )}

          {lesson.type === 'TEXT' && (
            <div>
              <h3 className="text-lg font-medium mb-2">Text Content</h3>
              <div className="border rounded-md p-4 prose max-w-none">
                {lesson.content ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  ></div>
                ) : (
                  <p className="text-muted-foreground">No content provided.</p>
                )}
              </div>
            </div>
          )}

          {lesson.type === 'QUIZ' && (
            <div>
              <h3 className="text-lg font-medium mb-2">Quiz Content</h3>
              {lesson.questions && lesson.questions.length > 0 ? (
                <div className="space-y-4">
                  {lesson.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">
                        Question {index + 1}: {question.text}
                      </h4>
                      <div className="space-y-2 ml-4">
                        {question.options.map((option) => (
                          <div key={option.id} className="flex items-center">
                            <div
                              className={`h-4 w-4 rounded-full mr-2 ${
                                option.isCorrect
                                  ? 'bg-green-500'
                                  : 'border border-gray-300'
                              }`}
                            ></div>
                            <span>{option.text}</span>
                            {option.isCorrect && (
                              <span className="text-green-500 ml-2 text-sm">
                                (Correct)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="mt-2 text-sm bg-muted p-2 rounded-md">
                          <span className="font-medium">Explanation:</span>{' '}
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No quiz questions provided.
                </p>
              )}
            </div>
          )}

          {lesson.resources && lesson.resources.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Resources</h3>
              <div className="space-y-2">
                {lesson.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center p-2 border rounded-md"
                  >
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{resource.title}</span>
                    <Badge variant="outline" className="ml-2">
                      {resource.type.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonDetailsDialog;
