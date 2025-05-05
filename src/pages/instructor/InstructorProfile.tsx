
import { useState } from 'react';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/common/Icons';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const InstructorProfile = () => {
  const [profileImage, setProfileImage] = useState<string>('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80');
  
  // Mock profile data
  const profile = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    bio: 'Senior Software Engineer with 15+ years of experience teaching Python programming. I specialize in making complex programming concepts accessible to beginners and helping intermediate developers level up their skills.',
    website: 'https://johnsmith.com',
    twitter: 'johnsmith',
    linkedin: 'johnsmith',
    github: 'johnsmith',
    expertise: ['Python', 'Web Development', 'Machine Learning', 'Data Science'],
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    education: [
      {
        degree: 'Master of Computer Science',
        institution: 'Stanford University',
        year: '2008'
      },
      {
        degree: 'Bachelor of Science in Computer Engineering',
        institution: 'MIT',
        year: '2006'
      }
    ],
    experience: [
      {
        position: 'Senior Software Engineer',
        company: 'Tech Solutions Inc.',
        period: '2015 - Present'
      },
      {
        position: 'Lead Developer',
        company: 'InnovateTech',
        period: '2010 - 2015'
      }
    ]
  };

  return (
    <InstructorLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <Button>
            <Icons.save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Upload a professional photo for your instructor profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Icons.upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 400x400 square JPG, PNG, or GIF, under 2MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                  Basic details that will be visible to students.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={profile.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={profile.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={profile.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={profile.location} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" type="url" defaultValue={profile.website} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      rows={5} 
                      defaultValue={profile.bio}
                      placeholder="Tell students about yourself, your experience, and teaching style"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be displayed on your instructor profile and course pages.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="professional" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expertise</CardTitle>
                <CardDescription>
                  Add your areas of expertise to help students understand your strengths.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.expertise.map((skill, index) => (
                    <div key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center">
                      <span>{skill}</span>
                      <button className="ml-2 rounded-full hover:bg-gray-200 p-1">
                        <Icons.x className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add a new skill or expertise" />
                  <Button variant="outline">Add</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>
                  Add your educational background to establish credibility.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}, {edu.year}</p>
                      </div>
                      <button className="text-muted-foreground hover:text-gray-900">
                        <Icons.trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <Button variant="outline">
                  <Icons.plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Showcase your professional experience to build trust.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}, {exp.period}</p>
                      </div>
                      <button className="text-muted-foreground hover:text-gray-900">
                        <Icons.trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <Button variant="outline">
                  <Icons.plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Connect your social profiles to broaden your reach.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Icons.twitter className="h-5 w-5 text-blue-400" />
                    <div className="flex-1">
                      <Input 
                        placeholder="Twitter username" 
                        defaultValue={profile.twitter}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Icons.linkedin className="h-5 w-5 text-blue-700" />
                    <div className="flex-1">
                      <Input 
                        placeholder="LinkedIn username" 
                        defaultValue={profile.linkedin}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Icons.github className="h-5 w-5" />
                    <div className="flex-1">
                      <Input 
                        placeholder="GitHub username" 
                        defaultValue={profile.github}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Icons.youtube className="h-5 w-5 text-red-600" />
                    <div className="flex-1">
                      <Input 
                        placeholder="YouTube channel"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Control what notifications you receive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Course Comments</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when students comment on your courses.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Course Reviews</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when students leave reviews.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Course Enrollments</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when new students enroll.
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about platform updates and promotions.
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </InstructorLayout>
  );
};

export default InstructorProfile;
