// src/pages/instructor/components/GeneralInfoForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMyInstructorProfile } from '@/hooks/queries/instructor.queries';
import {
  TGeneralInfoSchema,
  GeneralInfoSchema,
} from '@/lib/validators/instructorProfileValidator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/common/Icons';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useUpdateMyProfile } from '@/hooks/queries/user.queries';

export const GeneralInfoForm = () => {
  const { data: profile, isLoading: isLoadingProfile } =
    useMyInstructorProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile({
    onSuccess: () => {
      toast.success('General information updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update information.');
    },
  });

  const form = useForm<TGeneralInfoSchema>({
    resolver: zodResolver(GeneralInfoSchema),
    defaultValues: {
      fullName: '',
      headline: '',
      phoneNumber: '',
      location: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || '',
        headline: profile.headline || '',
        phoneNumber: profile.phoneNumber || '',
        location: profile.location || '',
      });
    }
  }, [profile, form]);

  const onSubmit = (data: TGeneralInfoSchema) => {
    updateProfile(data);
  };

  if (isLoadingProfile) {
    return (
      <div className='flex items-center justify-center py-16'>
        <Icons.spinner className='mr-2 h-5 w-5 animate-spin text-muted-foreground' />
        <span className='text-muted-foreground text-base'>
          Loading general info...
        </span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>
              Basic details that will be visible to students.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Your full name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='headline'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g. Senior Developer & Instructor'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Your phone number'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g. Ho Chi Minh City, Vietnam'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='sm:col-span-2'>
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input value={profile?.email || ''} disabled />
                  </FormControl>
                </FormItem>
              </div>
            </div>
            <div className='flex justify-end pt-4'>
              <Button type='submit' disabled={isUpdating}>
                {isUpdating && (
                  <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                )}
                Save General Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
