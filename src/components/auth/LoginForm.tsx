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
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/hooks/queries/auth.queries';
import { LoginCredentials } from '@/services/auth.service';
import LoginWithGoogle from '@/components/auth/LoginWithGoogle';
import LoginWithFacebook from '@/components/auth/LoginWithFacebook';
import EmailCollectionModal from '@/components/auth/EmailCollectionModal';
interface LoginFormProps {
  onSuccess: () => void;
}
// Define schema using zod
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Use React Query's useLoginMutation
  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      toast({
        title: 'Successfully logged in',
        description: `Welcome back, ${data.user.fullName}!`,
      });
      onSuccess();
      // Redirect to dashboard
      window.location.href = '/';
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description:
          error.message || 'Invalid email or password. Please try again.',
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data as LoginCredentials);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                disabled={loginMutation.isPending}
              />
            )}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-sm text-brand-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...field}
                disabled={loginMutation.isPending}
              />
            )}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link
            to="/"
            className="text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector('[data-value="signup"]')
                ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }}
          >
            Sign up
          </Link>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Want to become an instructor?{' '}
          </span>
          <Link
            to="/instructor/register"
            className="text-primary hover:underline"
          >
            Apply here
          </Link>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <LoginWithGoogle />
          <LoginWithFacebook />
        </div>
      </form>
      {/* Email Collection Modal */}
    </>
  );
};

export default LoginForm;
