/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '../common/Icons';
import { useRegisterMutation } from '@/hooks/queries/auth.queries';

// Define schema using zod
const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    fullName: z
      .string()
      .min(3, 'Full Name must be at least 3 characters')
      .max(150, 'Full Name must not exceed 150 characters'),
    roleId: z.string().default('NU'), // Default roleId is "NU"
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      roleId: 'NU', // Default roleId
    },
  });

  // Use React Query's useRegisterMutation
  const registerMutation = useRegisterMutation({
    onSuccess: (data) => {
      toast({
        title: 'Account created successfully',
        description: data.message || 'Please sign in with your new account.',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description:
          error.message || 'There was an error creating your account.',
      });
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    setIsLoading(true);
    registerMutation.mutate({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      roleId: data.roleId,
    });
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <Input
              id="fullName"
              placeholder="John Doe"
              {...field}
              disabled={isLoading || registerMutation.isPending}
            />
          )}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...field}
              disabled={isLoading || registerMutation.isPending}
            />
          )}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...field}
              disabled={isLoading || registerMutation.isPending}
            />
          )}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...field}
              disabled={isLoading || registerMutation.isPending}
            />
          )}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || registerMutation.isPending}
      >
        {isLoading || registerMutation.isPending ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
};

export default SignupForm;
