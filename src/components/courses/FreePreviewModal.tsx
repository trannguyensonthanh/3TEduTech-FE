import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Icons } from "@/components/common/Icons";

interface FreePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    title: string;
    videoUrl?: string;
    type: "video" | "text" | "quiz";
    content?: string;
  };
}

const FreePreviewModal = ({
  isOpen,
  onClose,
  lesson,
}: FreePreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Icons.play className="mr-2 h-5 w-5 text-brand-500" />
            Free Preview: {lesson.title}
          </DialogTitle>
          <DialogDescription>
            Watch this free lesson to see if this course is right for you
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {lesson.type === "video" && lesson.videoUrl ? (
            <div className="aspect-video relative rounded-md overflow-hidden">
              <iframe
                src={lesson.videoUrl}
                title={`Preview of ${lesson.title}`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : lesson.type === "text" && lesson.content ? (
            <div
              className="prose prose-slate max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <Icons.fileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Preview content is not available for this lesson type.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreePreviewModal;
