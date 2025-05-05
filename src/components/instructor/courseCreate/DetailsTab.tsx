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
import { UseFormReturn } from 'react-hook-form';

interface DetailsTabProps {
  form: UseFormReturn<{
    courseName: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    originalPrice: string;
    discountedPrice: string;
    categoryId: string;
    levelId: string;
    language: string;
    requirements: string;
    learningOutcomes: string;
  }>;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ form }) => {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="fullDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of your course"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can use HTML formatting for rich text.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What do students need to know before taking this course?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                List any prerequisites or required knowledge.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="learningOutcomes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Outcomes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What will students learn in this course?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                List key skills students will gain from your course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default DetailsTab;
