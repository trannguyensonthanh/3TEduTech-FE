import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // Import Form components

// Schema validation cho section
const sectionFormSchema = z.object({
  SectionName: z.string().min(1, 'Section name is required').max(255),
  Description: z.string().max(4000).optional().nullable(),
});

type SectionFormData = z.infer<typeof sectionFormSchema>;

interface SectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SectionFormData) => void; // Callback trả về dữ liệu form
  initialData?: { SectionName: string; Description?: string | null } | null;
  isEditing: boolean;
}

const SectionDialog: React.FC<SectionDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  isEditing,
}) => {
  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      SectionName: '',
      Description: null,
    },
  });

  // Reset form khi mở dialog hoặc initialData thay đổi
  useEffect(() => {
    if (open) {
      form.reset(initialData || { SectionName: '', Description: null });
    }
  }, [open, initialData, form]);

  const handleDialogSubmit = (data: SectionFormData) => {
    onSave(data); // Gọi callback onSave từ CourseCreation
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Section' : 'Add New Section'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the section details.'
              : 'Enter the name and optional description.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleDialogSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="SectionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Introduction" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What this section covers..."
                      {...field}
                      value={field.value ?? ''}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? 'Update Section' : 'Add Section'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionDialog;
