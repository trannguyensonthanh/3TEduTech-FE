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
} from '@/components/ui/form';

// Schema validation chuẩn FE camelCase
const sectionFormSchema = z.object({
  sectionName: z.string().min(1, 'Section name is required').max(255),
  description: z.string().max(4000).optional().nullable(),
});

type SectionFormData = z.infer<typeof sectionFormSchema>;

interface SectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SectionFormData) => void;
  initialData?: { sectionName: string; description?: string | null } | null;
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
      sectionName: '',
      description: null,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(initialData || { sectionName: '', description: null });
    }
  }, [open, initialData, form]);

  const handleDialogSubmit = (data: SectionFormData) => {
    onSave(data);
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
              name="sectionName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Section Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Introduction"
                      {...field}
                      className={fieldState.error ? 'border-red-500' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What this section covers..."
                      {...field}
                      value={field.value ?? ''}
                      className={`min-h-[80px] ${
                        fieldState.error ? 'border-red-500' : ''
                      }`}
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
