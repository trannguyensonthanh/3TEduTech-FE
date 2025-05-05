import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserProfile } from '@/services/user.service';

interface SocialLink {
  platform: string;
  url: string;
}

type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN';
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

interface UserViewDialogProps {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserViewDialog = ({ user, open, onOpenChange }: UserViewDialogProps) => {
  const isInstructor = user.RoleID === 'GV';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about {user.FullName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-shrink-0 h-24 w-24 bg-muted rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.FullName?.charAt(0)}
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold flex flex-col sm:flex-row sm:items-center gap-2">
                  {user.FullName}
                  <Badge
                    className={
                      user.RoleID === 'SA'
                        ? 'bg-red-500 text-white'
                        : user.RoleID === 'AD'
                        ? 'bg-blue-500 text-white'
                        : user.RoleID === 'GV'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-500 text-white'
                    }
                  >
                    {user.RoleID}
                  </Badge>
                </h2>
                <p className="text-muted-foreground">{user.Email}</p>
                {isInstructor && user.ProfessionalTitle && (
                  <p className="font-medium">{user.ProfessionalTitle}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={
                      user.Status === 'ACTIVE'
                        ? 'bg-green-500 text-white'
                        : user.Status === 'INACTIVE'
                        ? 'bg-yellow-500 text-white'
                        : user.Status === 'BANNED'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-400 text-white'
                    }
                  >
                    {user.Status}
                  </Badge>
                  {user.Courses > 0 && (
                    <Badge variant="outline">
                      {user.Courses} {user.Courses === 1 ? 'Course' : 'Courses'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList
                className={`grid w-full ${
                  isInstructor ? 'grid-cols-2' : 'grid-cols-1'
                } mb-4`}
              >
                <TabsTrigger value="profile">Profile</TabsTrigger>
                {isInstructor && (
                  <TabsTrigger value="instructor">
                    Instructor Details
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      User ID
                    </h3>
                    <p>{user.AccountID}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Joined Date
                    </h3>
                    <p>{user.CreatedAt}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Email
                    </h3>
                    <p>{user.Email}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </h3>
                    <p>{user.PhoneNumber || '-'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Gender
                    </h3>
                    <p>{user.Gender || '-'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Birth Date
                    </h3>
                    <p>{user.BirthDate || '-'}</p>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Location
                    </h3>
                    <p>{user.Location || '-'}</p>
                  </div>
                </div>
              </TabsContent>

              {isInstructor && (
                <TabsContent value="instructor" className="space-y-6">
                  {user.Bio && (
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Bio
                      </h3>
                      <p>{user.Bio}</p>
                    </div>
                  )}

                  {user.AboutMe && (
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        About Me
                      </h3>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: user.AboutMe }}
                      />
                    </div>
                  )}

                  {user.Skills.split(',') &&
                    user.Skills.split(',').length > 0 && (
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {user.Skills.split(',').map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {user.SocialLinks && user.SocialLinks.length > 0 && (
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Social Links
                      </h3>
                      <ul className="space-y-1">
                        {user.SocialLinks.map(
                          (link, index) =>
                            link.url && (
                              <li key={index}>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {link.platform}
                                </a>
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  {/* <div className="space-y-3">
                    <h3 className="font-medium">Payment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Bank Name
                        </h3>
                        <p>{user.bankName || '-'}</p>
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Account Holder
                        </h3>
                        <p>{user.bankAccountHolderName || '-'}</p>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Account Number
                        </h3>
                        <p>
                          {user.bankAccountNumber
                            ? '••••••' + user.bankAccountNumber.slice(-4)
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div> */}
                </TabsContent>
              )}
            </Tabs>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserViewDialog;
