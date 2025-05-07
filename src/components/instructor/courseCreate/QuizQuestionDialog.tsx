// src/components/instructor/courseCreate/QuizQuestionDialog.tsx
import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Trash, Plus } from 'lucide-react';
import { QuizQuestion, QuizOption } from '@/hooks/useCourseCurriculum'; // Import types
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea
import { toast } from '@/hooks/use-toast';

// Zod Schema for Option within the form
const optionFormSchema = z.object({
  tempId: z.union([z.string(), z.number()]).optional(),
  id: z.number().optional(),
  optionText: z.string().min(0, 'Option text is required').max(500),
  isCorrectAnswer: z.boolean().default(false),
});

// Zod Schema for the Question form
const questionFormSchema = z.object({
  questionText: z.string().min(1, 'Question text is required').max(4000),
  explanation: z.string().max(4000).optional().nullable(),
  options: z
    .array(optionFormSchema)
    .min(2, 'At least two options are required.')
    .refine(
      (options) => options.filter((opt) => opt.isCorrectAnswer).length === 1,
      {
        message: 'Exactly one correct answer must be selected.',
      }
    ),
});

type QuestionFormData = z.infer<typeof questionFormSchema>;

interface QuizQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  // Callback trả về dữ liệu đã validate + các ID gốc nếu có
  onSave: (
    data: QuestionFormData & {
      tempId?: string | number;
      id?: number;
      questionOrder?: number;
    }
  ) => void;
  initialData: QuizQuestion | null; // Dữ liệu gốc khi edit
  isEditing: boolean;
}

const QuizQuestionDialog: React.FC<QuizQuestionDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  isEditing,
}) => {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      questionText: '',
      explanation: null,
      options: [
        { optionText: '', isCorrectAnswer: false },
        { optionText: '', isCorrectAnswer: false },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'options',
    keyName: 'fieldId', // Sử dụng keyName khác với 'id' mặc định để tránh xung đột
  });

  // Reset form khi mở dialog hoặc initialData thay đổi
  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        form.reset({
          questionText: initialData.questionText,
          explanation: initialData.explanation,
          // Map options, gán tempId để quản lý key
          options:
            initialData.options?.map((opt) => ({
              ...opt,
              tempId:
                opt.tempId || opt.id || `option-${Date.now()}-${Math.random()}`,
              isCorrectAnswer: opt.isCorrectAnswer,
              optionText: opt.optionText,
            })) || [],
        });
      } else {
        // Reset về trạng thái mặc định khi thêm mới
        form.reset({
          questionText: '',
          explanation: null,
          options: [
            { optionText: '', isCorrectAnswer: false },
            { optionText: '', isCorrectAnswer: false },
          ],
        });
      }
    }
  }, [open, isEditing, initialData, form]);

  const handleDialogSubmit = (data: QuestionFormData) => {
    const finalData = {
      ...data,
      // Gán lại optionOrder dựa trên index
      options: data.options.map((opt, index) => ({
        ...opt,
        optionOrder: index,
      })),
      // Giữ lại id/tempId/order của question gốc nếu đang edit
      tempId: initialData?.tempId,
      id: initialData?.id,
      questionOrder: initialData?.questionOrder,
    };
    onSave(finalData);
  };

  // Đảm bảo chỉ có 1 checkbox được check
  const handleCorrectChange = (index: number) => {
    const currentOptions = form.getValues('options');
    // Đặt isCorrectAnswer cho cái được click và bỏ check những cái khác
    currentOptions.forEach((opt, i) => {
      form.setValue(`options.${i}.isCorrectAnswer`, i === index, {
        shouldDirty: true,
      });
    });
    form.trigger('options'); // Trigger validation lại cho mảng options
  };

  const handleAddOption = () => {
    append({ optionText: '', isCorrectAnswer: false });
  };

  const handleRemoveOption = (index: number) => {
    if (fields.length <= 2) {
      toast({
        title: 'Cannot Remove',
        description: 'A question must have at least two options.',
        variant: 'destructive',
      });
      return;
    }
    remove(index);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Question' : 'Add New Question'}
          </DialogTitle>
          <DialogDescription>
            Enter the question details and options. Mark the correct answer.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleDialogSubmit)}
            className="space-y-5 py-2 pr-2"
          >
            {' '}
            {/* Thêm padding */}
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your question..."
                      {...field}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain the correct answer (shown after attempt)..."
                      {...field}
                      value={field.value ?? ''}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    This explanation will be shown after the student answers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3 border-t pt-4">
              <Label className="font-medium">Answer Options *</Label>
              <FormField
                control={form.control}
                name="options"
                render={() => <FormMessage />}
              />{' '}
              {/* Lỗi chung của mảng */}
              {fields.map((field, index) => (
                <div
                  key={field.fieldId}
                  className="flex items-center space-x-2"
                >
                  {/* --- Correct Answer Checkbox --- */}
                  <FormField
                    control={form.control}
                    name={`options.${index}.isCorrectAnswer`}
                    render={({ field: checkField }) => (
                      <FormItem className="flex items-center pt-6">
                        {' '}
                        {/* Align checkbox */}
                        <FormControl>
                          <Checkbox
                            checked={checkField.value}
                            onCheckedChange={() => handleCorrectChange(index)} // Gọi hàm xử lý đặc biệt
                            id={`correct-${field.fieldId}`}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={`correct-${field.fieldId}`}
                          className="sr-only"
                        >
                          Correct Answer
                        </FormLabel>{' '}
                        {/* Label ẩn cho accessibility */}
                      </FormItem>
                    )}
                  />
                  {/* --- Option Text Input --- */}
                  <FormField
                    control={form.control}
                    name={`options.${index}.optionText`}
                    render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormLabel
                          htmlFor={`option-text-${field.fieldId}`}
                          className="sr-only"
                        >
                          Option {index + 1}
                        </FormLabel>{' '}
                        {/* Label ẩn */}
                        <FormControl>
                          <Input
                            id={`option-text-${field.fieldId}`}
                            placeholder={`Option ${index + 1}`}
                            {...inputField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* --- Remove Button --- */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    className="mt-6"
                    disabled={fields.length <= 2}
                  >
                    {' '}
                    {/* Disable nếu chỉ còn 2 */}
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {/* --- Add Option Button --- */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Option
              </Button>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                {form.formState.isSubmitting
                  ? 'Saving...'
                  : isEditing
                  ? 'Update Question'
                  : 'Add Question'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizQuestionDialog;
