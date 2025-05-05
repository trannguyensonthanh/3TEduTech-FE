import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/common/Icons';
import { useToast } from '@/components/ui/use-toast';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterInstructorData } from '@/services/auth.service';
import { useRegisterInstructorMutation } from '@/hooks/queries/auth.queries';
import { useSkills } from '@/hooks/queries/skill.queries';
import { Skill } from '@/services/skill.service';
// Removed incorrect import of 'watch' from 'fs'
const socialPlatforms = [
  'Facebook',
  'Instagram',
  'Twitter', // hoặc 'X' (tên mới, nhưng 'Twitter' vẫn phổ biến)
  'LinkedIn',
  'YouTube',
  'TikTok',
  'Snapchat',
  'Pinterest',
  'Reddit',
  'WhatsApp',
  'Telegram',
  'WeChat',
  'Discord',
  'GitHub',
  'Threads', // nền tảng mới của Meta cạnh tranh Twitter
  'LINE', // phổ biến ở Nhật, Thái, Đài Loan
  'Messenger', // Facebook Messenger tách riêng
];
// Zod schema definition
const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required').max(50),
  url: z.string().url('Invalid URL').max(500),
});

const registerInstructorSchema = z
  .object({
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters'),
    fullName: z.string().min(1, 'Full name is required').max(150),
    professionalTitle: z.string().max(255).optional().nullable(),
    bio: z.string().max(4000).optional().nullable(),
    skills: z.array(z.string()).optional().nullable(), // Định nghĩa `skills` là một mảng chuỗi
    socialLinks: z.array(socialLinkSchema).optional().nullable(),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type RegisterInstructorFormData = z.infer<typeof registerInstructorSchema>;
const InstructorRegister = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger, // Add this to trigger validation manually
    setValue,
    watch, // Add this to watch field values
  } = useForm<RegisterInstructorFormData>({
    resolver: zodResolver(registerInstructorSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      professionalTitle: '',
      bio: '',
      skills: [],
      socialLinks: [{ platform: '', url: '' }],
      agreedToTerms: false,
    },
  });

  const { data: skillsData, isLoading: isSkillsLoading } = useSkills();

  const validateCurrentStep = async (): Promise<boolean> => {
    // Define fields for each step
    const stepFields: Record<number, (keyof RegisterInstructorFormData)[]> = {
      1: ['fullName', 'email', 'password', 'confirmPassword'], // Fields for step 1
      2: ['professionalTitle', 'bio', 'skills'], // Fields for step 2
      3: ['socialLinks'], // Fields for step 3
    };

    // Trigger validation for fields in the current step
    const fieldsToValidate = stepFields[step];
    const result = await trigger(fieldsToValidate);

    if (!result) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description:
          'Please fix the errors in the current step before proceeding.',
      });
      return false;
    }
    return true;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const registerInstructorMutation = useRegisterInstructorMutation({
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Application Submitted',
        description:
          'Your instructor application has been successfully submitted.',
      });
      setStep(1); // Reset to the first step or navigate to another page if needed
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description:
          error?.message ||
          'An error occurred while submitting your application.',
      });
    },
  });

  const onSubmit: SubmitHandler<RegisterInstructorFormData> = (data) => {
    console.log('Form Data:', data);
    // Lọc bỏ social links rỗng
    const validSocialLinks = data.socialLinks?.filter(
      (link) => link.platform && link.url
    );

    // Chuẩn bị dữ liệu gửi đi (loại bỏ confirmPassword)
    const apiData: RegisterInstructorData = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      professionalTitle: data.professionalTitle || undefined, // Gửi undefined nếu rỗng
      bio: data.bio || undefined,
      skills: data.skills || [], // Gửi mảng rỗng nếu không có kỹ năng nào được chọn
      socialLinks:
        validSocialLinks && validSocialLinks.length > 0
          ? validSocialLinks.map((link) => ({
              platform: link.platform!,
              url: link.url!,
            }))
          : undefined,
    };

    registerInstructorMutation.mutate(apiData);
  };
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Become an Instructor</h1>
          <p className="text-muted-foreground mb-8">
            Share your expertise with students around the world and earn revenue
            from your courses.
          </p>

          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  {/* Step Circle */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-all
            ${
              step === stepNumber
                ? 'border-brand-500 bg-brand-500 text-white'
                : step > stepNumber
                ? 'border-brand-500 text-brand-500'
                : 'border-gray-300 text-gray-400'
            }`}
                  >
                    {step > stepNumber ? (
                      <Icons.check className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>

                  {/* Step Connector */}
                  {stepNumber < 4 && (
                    <div
                      className={`h-1 w-40 mx-3 transition-all
              ${step > stepNumber ? 'bg-brand-500' : 'bg-gray-200'}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step Labels */}
            <div className="flex justify-between mt-4 text-sm">
              <span
                className={`${
                  step >= 1 ? 'text-brand-500 font-medium' : 'text-gray-400'
                }`}
              >
                Account
              </span>
              <span
                className={`${
                  step >= 2 ? 'text-brand-500 font-medium' : 'text-gray-400'
                }`}
              >
                Profile
              </span>
              <span
                className={`${
                  step >= 3 ? 'text-brand-500 font-medium' : 'text-gray-400'
                }`}
              >
                Verification
              </span>
              <span
                className={`${
                  step >= 4 ? 'text-brand-500 font-medium' : 'text-gray-400'
                }`}
              >
                Confirmation
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Account Information</h2>
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    {...register('email')}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <div className="space-y-2">
                  <Label htmlFor="professionalTitle">
                    Professional Title <span className="text-red-500">*</span>{' '}
                  </Label>
                  <Input
                    id="professionalTitle"
                    {...register('professionalTitle')}
                    placeholder="e.g., Software Engineer"
                  />
                  {errors.professionalTitle && (
                    <p className="text-red-500 text-sm">
                      {errors.professionalTitle.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    {...register('bio')}
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm">{errors.bio.message}</p>
                  )}
                </div>

                {/* Skills Selection */}
                <div className="space-y-2">
                  <Label>Skills</Label>
                  {isSkillsLoading ? (
                    <p>Loading skills...</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skillsData.skills?.map((skill: Skill) => (
                        <button
                          key={skill.SkillID} // Sử dụng `id` làm key nếu có
                          type="button"
                          className={`px-4 py-2 rounded-full border ${
                            watch('skills')?.includes(skill.SkillName) // Sử dụng `skill.name` thay vì `skill`
                              ? 'bg-brand-500 text-white border-brand-500'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                          onClick={() => {
                            const currentSkills = watch('skills') || [];
                            if (
                              Array.isArray(currentSkills) &&
                              currentSkills.includes(skill.SkillName)
                            ) {
                              setValue(
                                'skills',
                                currentSkills.filter(
                                  (s: string) => s !== skill.SkillName
                                )
                              );
                            } else {
                              setValue('skills', [
                                ...currentSkills,
                                skill.SkillName,
                              ]);
                            }
                          }}
                        >
                          {skill.SkillName} {/* Hiển thị tên kỹ năng */}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.skills && (
                    <p className="text-red-500 text-sm">
                      {errors.skills.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Social Links</h2>
                <Controller
                  name="socialLinks"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-4">
                      {field.value?.map((link, index) => (
                        <div
                          key={index}
                          className="flex space-x-4 items-center"
                        >
                          {/* Select for Platform */}
                          <Select
                            onValueChange={(value) =>
                              field.onChange(
                                field.value.map((item, i) =>
                                  i === index
                                    ? { ...item, platform: value }
                                    : item
                                )
                              )
                            }
                            value={link.platform}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Select Platform" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {socialPlatforms.map((platform) => (
                                <SelectItem key={platform} value={platform}>
                                  {platform}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Input for URL */}
                          <Input
                            placeholder="URL"
                            value={link.url}
                            onChange={(e) =>
                              field.onChange(
                                field.value.map((item, i) =>
                                  i === index
                                    ? { ...item, url: e.target.value }
                                    : item
                                )
                              )
                            }
                          />

                          {/* Remove Link Button */}
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() =>
                              field.onChange(
                                field.value.filter((_, i) => i !== index)
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ))}

                      {/* Add New Link Button */}
                      <Button
                        type="button"
                        onClick={() =>
                          field.onChange([
                            ...(field.value || []),
                            { platform: '', url: '' },
                          ])
                        }
                      >
                        Add Link
                      </Button>
                    </div>
                  )}
                />
                {errors.socialLinks && (
                  <p className="text-red-500 text-sm">
                    {errors.socialLinks.message}
                  </p>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Terms & Verification</h2>
                <p className="text-muted-foreground mb-6">
                  Final steps to complete your instructor application.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                  <h3 className="font-semibold mb-4">Instructor Agreement</h3>
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <p>
                      By becoming an instructor on 3TEduTech, you agree to our
                      Instructor Terms, which include the following key points:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        You may not use 3TEduTech to distribute or promote
                        offensive, harmful, or illegal content.
                      </li>
                      <li>
                        You are responsible for maintaining the quality of your
                        course content.
                      </li>
                      <li>
                        Revenue sharing: Instructors receive 70% of the net
                        revenue from course sales.
                      </li>
                      <li>
                        Payouts are processed monthly for balances over $50.
                      </li>
                      <li>
                        You grant 3TEduTech a license to use your course content
                        for platform promotion.
                      </li>
                      <li>You maintain ownership of your course content.</li>
                    </ul>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Controller
                      name="agreedToTerms"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="agreedToTerms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <label
                      htmlFor="agreedToTerms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300"
                    >
                      I have read and agree to the{' '}
                      <Link
                        to="/terms"
                        className="text-brand-500 hover:underline"
                      >
                        Instructor Terms
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/privacy"
                        className="text-brand-500 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.agreedToTerms && (
                    <p className="text-red-500 text-sm">
                      {errors.agreedToTerms.message}
                    </p>
                  )}
                </div>

                {/* <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-300">
                    Verification Process
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-4">
                    After submitting your application, our team will review your
                    profile to ensure it meets our quality standards. This
                    process typically takes 2-3 business days.
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Once approved, you will receive an email with instructions
                    to set up your instructor dashboard and start creating your
                    first course.
                  </p>
                </div> */}
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              ) : (
                <Link to="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              )}

              {step < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default InstructorRegister;
