/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFieldArray, useForm } from 'react-hook-form';
import { UserProfile } from '@/services/user.service';

interface SocialLink {
  platform: string;
  url: string;
}

type UserRole = 'NU' | 'GV' | 'AD' | 'SA';
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'PENDING_VERIFICATION';
type Gender = 'MALE' | 'FEMALE' | null;

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  courses: number;
  gender?: Gender;
  birthDate?: string;
  phoneNumber?: string;
  location?: string;
  // Instructor fields
  professionalTitle?: string;
  bio?: string;
  aboutMe?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankAccountHolderName?: string;
  skills?: string[];
  socialLinks?: SocialLink[];
}

interface UserEditDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userData: any) => void;
}

const UserEditDialog = ({
  user,
  open,
  onOpenChange,
  onSave,
}: UserEditDialogProps) => {
  const [formRole, setFormRole] = useState<UserRole>('NU');

  const form = useForm({
    defaultValues: {
      FullName: '', // Tên thuộc tính đã đổi từ `fullName` sang `FullName`
      Email: '',
      RoleID: 'NU', // Đổi từ `role` sang `RoleID`
      Status: 'ACTIVE',
      Gender: '', // Đổi từ `gender` sang `Gender`
      BirthDate: '', // Đổi từ `birthDate` sang `BirthDate`
      PhoneNumber: '', // Đổi từ `phoneNumber` sang `PhoneNumber`
      Location: '', // Đổi từ `location` sang `Location`
      // Instructor fields
      ProfessionalTitle: '', // Đổi từ `professionalTitle` sang `ProfessionalTitle`
      Bio: '',
      AboutMe: '', // Đổi từ `aboutMe` sang `AboutMe`
      BankAccountNumber: '',
      BankName: '',
      BankAccountHolderName: '',
      Skills: '', // Đổi từ `skills` sang `Skills`
      SocialLinks: [],
    },
  });
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'SocialLinks', // Tên mảng trong form
  });
  // Update form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        FullName: user.FullName, // Đổi từ `user.name` sang `user.FullName`
        Email: user.Email,
        RoleID: user.RoleID, // Đổi từ `user.role` sang `user.RoleID`
        Status: user.Status,
        Gender: user.Gender || '', // Đổi từ `user.gender` sang `user.Gender`
        BirthDate: user.BirthDate || '', // Đổi từ `user.birthDate` sang `user.BirthDate`
        PhoneNumber: user.PhoneNumber || '', // Đổi từ `user.phoneNumber` sang `user.PhoneNumber`
        Location: user.Location || '', // Đổi từ `user.location` sang `user.Location`
        // Instructor fields
        ProfessionalTitle: user.ProfessionalTitle || '', // Đổi từ `user.professionalTitle` sang `user.ProfessionalTitle`
        Bio: user.Bio || '',
        AboutMe: user.AboutMe || '', // Đổi từ `user.aboutMe` sang `user.AboutMe`
        BankAccountNumber: user.BankAccountNumber || '',
        BankName: user.BankName || '',
        BankAccountHolderName: user.BankAccountHolderName || '',
        Skills: user.Skills, // Đổi từ `user.skills` sang `user.Skills`
        SocialLinks: user.SocialLinks || [],
      });

      setFormRole(user.RoleID as UserRole); // Đổi từ `user.role` sang `user.RoleID`
    }
  }, [user, form]);
  const handleAddSocialLink = () => {
    append({ platform: '', url: '' }); // Thêm một liên kết trống
  };
  const handleSubmit = (data: any) => {
    onSave({
      ...data,
      id: user?.AccountID,
      createdAt: user?.CreatedAt,
      courses: user?.Courses || 0,
    });
    onOpenChange(false);
  };

  // Handle role change to show/hide instructor fields
  const handleRoleChange = (role: UserRole) => {
    form.setValue('RoleID', role);
    setFormRole(role);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information for {user?.FullName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            <Tabs defaultValue="basic" className="w-full">
              <TabsList
                className={`grid w-full ${
                  formRole === 'GV' ? 'grid-cols-2' : 'grid-cols-1'
                }`}
              >
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                {formRole === 'GV' && (
                  <TabsTrigger value="instructor">
                    Instructor Details
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="FullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="RoleID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            handleRoleChange(value as UserRole)
                          }
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="STUDENT">Student</SelectItem>
                            <SelectItem value="INSTRUCTOR">
                              Instructor
                            </SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="SUPER_ADMIN">
                              Super Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This determines what permissions the user will have.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                            <SelectItem value="BANNED">Banned</SelectItem>
                            <SelectItem value="PENDING_VERIFICATION">
                              Pending Verification
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="Gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="BirthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="PhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {formRole === 'GV' && (
                <TabsContent value="instructor" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="ProfessionalTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Web Developer, Data Scientist, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Bio</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Short professional description"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief professional description (shown in instructor
                          cards)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="AboutMe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About Me</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Detailed professional background and experience"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description shown on the instructor profile
                          page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="Skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="JavaScript, React, Node.js, etc. (comma separated)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter skills separated by commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Social Links</h3>
                    <div className="space-y-4 ">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-12 gap-4 items-center"
                        >
                          <FormField
                            control={control}
                            name={`SocialLinks.${index}.platform`}
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>Platform</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., LinkedIn, GitHub"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name={`SocialLinks.${index}.url`}
                            render={({ field }) => (
                              <FormItem className="col-span-8">
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., https://linkedin.com/in/username"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="button"
                            variant="destructive"
                            className="col-span-2 mt-8"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddSocialLink}
                      className=" mt-4"
                    >
                      Add Social Link
                    </Button>
                  </div>

                  {/* <div className="space-y-2">
                    <h3 className="text-sm font-medium">Payment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Bank name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bankAccountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Bank account number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bankAccountHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Holder Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Name as it appears on the account"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}
                </TabsContent>
              )}
            </Tabs>

            <DialogFooter className="pt-4">
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
