import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface BasicInfoTabProps {
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
  mockCategories: { CategoryID: number; CategoryName: string }[];
  mockLevels: { LevelID: number; LevelName: string }[];
  mockLanguages: { id: number; name: string }[];
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  form,
  mockCategories,
  mockLevels,
  mockLanguages,
  handleTitleChange,
}) => {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="courseName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Complete Web Development Bootcamp"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e); // Gọi onChange của React Hook Form
                    handleTitleChange(e); // Gọi logic tùy chỉnh của bạn
                  }}
                />
              </FormControl>
              <FormDescription>
                Give your course an attractive title that clearly explains what
                the course is about.
              </FormDescription>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. complete-web-development-bootcamp"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormDescription>
                The URL slug is automatically generated from your title.
              </FormDescription>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a compelling summary of your course (150-200 characters)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This appears in search results and course cards.
              </FormDescription>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockCategories?.map((category) => (
                      <SelectItem
                        key={category.CategoryID}
                        value={category.CategoryID.toString()}
                      >
                        {category.CategoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="levelId"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockLevels?.map((level) => (
                      <SelectItem
                        key={level.LevelID}
                        value={level.LevelID.toString()}
                      >
                        {level.LevelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockLanguages.map((language) => (
                      <SelectItem key={language.id} value={language.name}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Hiển thị lỗi nếu có */}
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default BasicInfoTab;
