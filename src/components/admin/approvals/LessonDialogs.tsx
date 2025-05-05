/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface VideoPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: any;
}

export const VideoPreviewDialog: React.FC<VideoPreviewDialogProps> = ({
  open,
  onOpenChange,
  lesson,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{lesson?.title}</DialogTitle>
        </DialogHeader>

        <div className="aspect-video bg-black rounded-md overflow-hidden">
          {lesson && (
            <iframe
              src={lesson.videoUrl.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allowFullScreen
              title={lesson.title}
            ></iframe>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface TextContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: any;
}

export const TextContentDialog: React.FC<TextContentDialogProps> = ({
  open,
  onOpenChange,
  lesson,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{lesson?.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="prose prose-sm max-w-none">
            {lesson && (
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

interface QuizContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: any;
}

export const QuizContentDialog: React.FC<QuizContentDialogProps> = ({
  open,
  onOpenChange,
  lesson,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{lesson?.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-6">
            {lesson?.questions.map((question, index) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary">{index + 1}</Badge>
                  <h3 className="font-medium">{question.question}</h3>
                </div>

                <div className="space-y-2 pl-8">
                  {question.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`p-2 border rounded-md ${
                        option === question.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {option === question.correctAnswer && (
                          <Badge className="bg-green-500">
                            <Check className="h-3 w-3" />
                          </Badge>
                        )}
                        <span>{option}</span>
                      </div>
                      {option === question.correctAnswer && (
                        <p className="text-xs text-green-600 mt-1 pl-6">
                          Correct answer
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
