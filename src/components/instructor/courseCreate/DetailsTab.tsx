import React from 'react';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Controller, UseFormReturn } from 'react-hook-form';
import TiptapEditor from '@/components/editor/TiptapEditor';

interface DetailsTabProps {
  form: UseFormReturn<{
    courseName?: string;
    slug?: string;
    shortDescription?: string;
    fullDescription?: string;
    originalPrice?: number;
    discountedPrice?: number;
    categoryId?: number;
    levelId?: number;
    language?: string;
    requirements?: string;
    learningOutcomes?: string;
  }>;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ form }) => {
  const { control } = form;

  // Helper component để tránh lặp code cho TiptapEditor FormField
  const TiptapFormField = ({ name, label, description }) => (
    <FormField
      control={control}
      name={name}
      render={(
        { fieldState } // field không cần ở đây vì Controller sẽ cung cấp
      ) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Controller
              name={name}
              control={control}
              render={({ field: controllerField }) => (
                <TiptapEditor
                  initialContent={controllerField.value || ''}
                  onContentChange={(htmlContent) => {
                    controllerField.onChange(htmlContent);
                  }}
                  // onBlur={controllerField.onBlur} // Optional
                />
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
  return (
    <Form {...form}>
      <form className="space-y-6">
        <TiptapFormField
          name="fullDescription"
          label="Full Description"
          description="Provide a detailed description of your course. You can use rich text formatting."
        />

        <TiptapFormField
          name="requirements"
          label="Requirements"
          description="List any prerequisites or required knowledge students need before taking this course."
        />

        <TiptapFormField
          name="learningOutcomes"
          label="Learning Outcomes"
          description="List key skills and knowledge students will gain from your course."
        />
      </form>
    </Form>
  );
};

export default DetailsTab;
