import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import AI3DAssistant from "@/components/chatbot/AI3DAssistant";

interface AIAssistantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle?: string;
}

const AIAssistantDialog: React.FC<AIAssistantDialogProps> = ({
  isOpen,
  onClose,
  lessonTitle,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">AI Course Assistant</h2>
          </div>
        </DialogHeader>
        <div className="max-h-[calc(90vh-60px)] overflow-hidden">
          <AI3DAssistant
            isOpen={true}
            onClose={onClose}
            initialMessage={`How can I help you understand more about ${
              lessonTitle || "this lesson"
            }?`}
            lessonContext={lessonTitle || ""}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistantDialog;
