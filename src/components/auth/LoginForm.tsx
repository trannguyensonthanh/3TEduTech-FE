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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
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
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="login-email">Email Address</Label>
        <div className="relative">
          <Icons.mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                {...field}
                disabled={loginMutation.isPending}
                className={cn(
                  'pl-10 h-11',
                  errors.email &&
                    'border-destructive focus-visible:ring-destructive'
                )}
              />
            )}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Link
            to="/auth/forgot-password"
            onClick={onSuccess}
            className="text-xs font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Icons.lockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...field}
                disabled={loginMutation.isPending}
                className={cn(
                  'pl-10 pr-10 h-11',
                  errors.password &&
                    'border-destructive focus-visible:ring-destructive'
                )}
              />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <Icons.eyeOff className="h-4 w-4" />
            ) : (
              <Icons.eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-semibold"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Icons.logIn className="mr-2 h-5 w-5" />
        )}{' '}
        Sign In
      </Button>

      <div className="text-center text-sm text-muted-foreground pt-1">
        Want to share your knowledge?{' '}
        <Link
          to="/instructor/register" // Đường dẫn đến trang đăng ký giảng viên
          onClick={onSuccess} // Đóng modal AuthModal trước khi điều hướng
          className="font-medium text-primary hover:underline"
        >
          Become an Instructor
        </Link>
      </div>

      <div className="relative pt-2">
        {' '}
        {/* Tăng pt */}
        <Separator />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
          <span className="bg-background px-3 text-xs uppercase text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <LoginWithGoogle />{' '}
        {/* Component này cần được styling lại button bên trong nó */}
        <LoginWithFacebook />{' '}
        {/* Component này cần được styling lại button bên trong nó */}
      </div>
    </form>
  );
};
export default LoginForm;
