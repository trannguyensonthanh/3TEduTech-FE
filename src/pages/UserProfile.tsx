import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/common/Icons";
import { useToast } from "@/components/ui/use-toast";

const UserProfile = () => {
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Mock user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww",
    headline: "Software Developer & Lifelong Learner",
    bio: "I am a passionate developer with over 5 years of experience. I love learning new technologies and building web applications.",
    location: "New York, USA",
    birthDate: "1990-05-15",
    gender: "male",
    website: "https://johndoe.com",
    social: {
      linkedin: "johndoe",
      twitter: "johndoe",
      github: "johndoe",
    },
  });

  const handleSaveProfile = () => {
    setIsEditingProfile(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsEditingProfile(false);
    }, 1500);
  };

  const handleUpdatePassword = () => {
    setIsUpdatingPassword(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      setIsUpdatingPassword(false);
    }, 1500);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    toast({
      title: newMode ? "Dark mode enabled" : "Light mode enabled",
      description: `The application theme has been updated.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            <Icons.arrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <h2 className="text-xl font-semibold">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {userData.headline}
                  </p>
                </div>

                <Separator />

                <div className="w-full text-sm space-y-2">
                  <div className="flex items-start">
                    <Icons.mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{userData.email}</span>
                  </div>
                  {userData.phone && (
                    <div className="flex items-start">
                      <Icons.phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{userData.phone}</span>
                    </div>
                  )}
                  {userData.location && (
                    <div className="flex items-start">
                      <Icons.mapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{userData.location}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex space-x-2">
                  {userData.social.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={`https://linkedin.com/in/${userData.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icons.linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {userData.social.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={`https://twitter.com/${userData.social.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icons.twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {userData.social.github && (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={`https://github.com/${userData.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icons.github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal details and public profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={userData.name}
                          onChange={(e) =>
                            setUserData({ ...userData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userData.email}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={userData.phone}
                          onChange={(e) =>
                            setUserData({ ...userData, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={userData.location}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Birth Date</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={userData.birthDate}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              birthDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={userData.gender}
                          onValueChange={(value) =>
                            setUserData({ ...userData, gender: value })
                          }
                        >
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        value={userData.headline}
                        onChange={(e) =>
                          setUserData({ ...userData, headline: e.target.value })
                        }
                        placeholder="e.g. Software Developer & Educator"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={userData.bio}
                        onChange={(e) =>
                          setUserData({ ...userData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={userData.avatar}
                            alt={userData.name}
                          />
                          <AvatarFallback>
                            {userData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" type="button">
                          <Icons.upload className="h-4 w-4 mr-2" />
                          Upload new image
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Social Profiles</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Icons.linkedin className="h-5 w-5 text-muted-foreground" />
                          <Input
                            value={userData.social.linkedin || ""}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                social: {
                                  ...userData.social,
                                  linkedin: e.target.value,
                                },
                              })
                            }
                            placeholder="LinkedIn username"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icons.twitter className="h-5 w-5 text-muted-foreground" />
                          <Input
                            value={userData.social.twitter || ""}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                social: {
                                  ...userData.social,
                                  twitter: e.target.value,
                                },
                              })
                            }
                            placeholder="Twitter username"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icons.github className="h-5 w-5 text-muted-foreground" />
                          <Input
                            value={userData.social.github || ""}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                social: {
                                  ...userData.social,
                                  github: e.target.value,
                                },
                              })
                            }
                            placeholder="GitHub username"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isEditingProfile}
                    >
                      {isEditingProfile ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Icons.save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="account">
                <div className="space-y-6">
                  {/* Change Password */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm New Password
                        </Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={handleUpdatePassword}
                        disabled={isUpdatingPassword}
                      >
                        {isUpdatingPassword ? (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Danger Zone */}
                  <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-destructive">
                        Danger Zone
                      </CardTitle>
                      <CardDescription>
                        Permanently delete your account and all associated data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back.
                        This action cannot be undone.
                      </p>
                      <Button variant="destructive">Delete My Account</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                      Manage your application preferences and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Theme Preference */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Switch between light and dark mode
                        </p>
                      </div>
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={toggleDarkMode}
                      />
                    </div>

                    <Separator />

                    {/* Email Notifications */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Email Notifications
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Course Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive emails about updates to your enrolled
                              courses
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>New Courses</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive emails about new course recommendations
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Promotions</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive emails about discounts and special offers
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
