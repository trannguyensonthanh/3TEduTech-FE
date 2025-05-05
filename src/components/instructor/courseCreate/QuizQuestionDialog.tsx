import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';

interface QuizQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  questionData: {
    questionText: string;
    explanation: string;
    options: { optionText: string; isCorrectAnswer: boolean }[];
  };
  setQuestionData: (data: {
    questionText: string;
    explanation: string;
    options: { optionText: string; isCorrectAnswer: boolean }[];
  }) => void;
  currentQuestionId: number | null;
  handleOptionChange: (index: number, value: string) => void;
  handleCorrectAnswerChange: (index: number) => void;
}

const QuizQuestionDialog: React.FC<QuizQuestionDialogProps> = ({
  open,
  onClose,
  onSave,
  questionData,
  setQuestionData,
  currentQuestionId,
  handleOptionChange,
  handleCorrectAnswerChange,
}) => {
  // Thêm một tùy chọn mới
  const handleAddOption = () => {
    setQuestionData({
      ...questionData,
      options: [
        ...questionData.options,
        { optionText: '', isCorrectAnswer: false },
      ],
    });
  };

  // Xóa một tùy chọn
  const handleRemoveOption = (index: number) => {
    setQuestionData({
      ...questionData,
      options: questionData.options.filter((_, i) => i !== index),
    });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {currentQuestionId ? 'Edit Question' : 'Add New Question'}
          </DialogTitle>
          <DialogDescription>
            {currentQuestionId
              ? 'Update question details below.'
              : 'Enter the details for your quiz question.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea
              id="question-text"
              placeholder="Enter your question here..."
              value={questionData.questionText}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  questionText: e.target.value,
                })
              }
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-explanation">Explanation (Optional)</Label>
            <Textarea
              id="question-explanation"
              placeholder="Provide an explanation for the correct answer..."
              value={questionData.explanation}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  explanation: e.target.value,
                })
              }
              className="min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground">
              This will be shown to students after they answer the question.
            </p>
          </div>

          <div className="space-y-3">
            <Label>Answer Options</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Provide at least two options and mark correct answers. Use the
              checkboxes to indicate correct answers.
            </p>
            {questionData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`option-${index}-correct`}
                  checked={option.isCorrectAnswer}
                  onChange={() => handleCorrectAnswerChange(index)}
                  className="rounded border-gray-300"
                />
                <Input
                  value={option.optionText}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" onClick={handleAddOption}>
              Add Option
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={
              !questionData.questionText.trim() ||
              questionData.options.filter((o) => o.optionText.trim() !== '')
                .length < 2
            }
          >
            {currentQuestionId ? 'Update Question' : 'Add Question'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuizQuestionDialog;
