import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/common/Icons';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <Button>
            <Icons.save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="integration">Integrations</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>
                  Configure basic information about your learning platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" defaultValue="EduPlatform" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-url">Site URL</Label>
                    <Input id="site-url" defaultValue="https://eduplatform.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea 
                    id="site-description" 
                    rows={3} 
                    defaultValue="The leading online learning platform for programming, design, and more."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@eduplatform.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      <SelectItem value="cet">Central European Time (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>
                  Configure default settings for courses across the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="course-comments">Course Comments</Label>
                    <p className="text-muted-foreground text-sm">
                      Allow users to comment on courses
                    </p>
                  </div>
                  <Switch id="course-comments" defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="course-reviews">Course Reviews</Label>
                    <p className="text-muted-foreground text-sm">
                      Allow users to review courses
                    </p>
                  </div>
                  <Switch id="course-reviews" defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="course-approval">Course Approval Required</Label>
                    <p className="text-muted-foreground text-sm">
                      Require admin approval before publishing courses
                    </p>
                  </div>
                  <Switch id="course-approval" defaultChecked={true} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission-rate">Platform Commission Rate (%)</Label>
                  <Input id="commission-rate" type="number" defaultValue="30" min="0" max="100" />
                  <p className="text-xs text-muted-foreground">
                    Percentage of course revenue retained by the platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Favicon</CardTitle>
                <CardDescription>
                  Upload your platform's logo and favicon.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="block">Site Logo</Label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded border">
                      <span className="text-gray-400 text-2xl">Logo</span>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline">
                        <Icons.upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Recommended: PNG or SVG, 200x50 pixels
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label className="block">Favicon</Label>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded border">
                      <span className="text-gray-400">Icon</span>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline">
                        <Icons.upload className="mr-2 h-4 w-4" />
                        Upload Favicon
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Recommended: ICO or PNG, 32x32 pixels
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Colors & Theme</CardTitle>
                <CardDescription>
                  Customize your platform's appearance with brand colors.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input id="primary-color" type="color" defaultValue="#4f46e5" className="w-12 h-10" />
                      <Input defaultValue="#4f46e5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input id="secondary-color" type="color" defaultValue="#10b981" className="w-12 h-10" />
                      <Input defaultValue="#10b981" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme-mode">Default Theme Mode</Label>
                  <Select defaultValue="light">
                    <SelectTrigger id="theme-mode">
                      <SelectValue placeholder="Select theme mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <Textarea 
                    id="custom-css" 
                    rows={5} 
                    placeholder=":root { --custom-variable: value; }"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Advanced: Add custom CSS to further customize your site's appearance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>
                  Configure email service for sending notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-provider">Email Service</Label>
                  <Select defaultValue="smtp">
                    <SelectTrigger id="email-provider">
                      <SelectValue placeholder="Select email provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smtp">SMTP</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" defaultValue="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">SMTP Username</Label>
                    <Input id="smtp-user" defaultValue="user@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input id="smtp-password" type="password" defaultValue="password" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-from">From Email</Label>
                  <Input id="email-from" defaultValue="noreply@eduplatform.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-name">From Name</Label>
                  <Input id="email-name" defaultValue="EduPlatform" />
                </div>
                
                <Button variant="secondary">
                  <Icons.mail className="mr-2 h-4 w-4" />
                  Send Test Email
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Configure the email templates sent to users.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-select">Select Template</Label>
                  <Select defaultValue="welcome">
                    <SelectTrigger id="template-select">
                      <SelectValue placeholder="Select template to edit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="reset">Password Reset</SelectItem>
                      <SelectItem value="verification">Email Verification</SelectItem>
                      <SelectItem value="course-purchase">Course Purchase</SelectItem>
                      <SelectItem value="instructor-approval">Instructor Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-subject">Email Subject</Label>
                  <Input id="template-subject" defaultValue="Welcome to EduPlatform!" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-content">Email Content</Label>
                  <Textarea 
                    id="template-content" 
                    rows={10} 
                    defaultValue={`<h1>Welcome to EduPlatform!</h1>
<p>Dear {{name}},</p>
<p>Thank you for joining EduPlatform. We're excited to have you as part of our community.</p>
<p>Get started by exploring our courses and finding the perfect learning path for you.</p>
<p>Best regards,<br>The EduPlatform Team</p>`}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use &#123;&#123;variable&#125;&#125; for dynamic content. Available variables: &#123;&#123;name&#125;&#125;, &#123;&#123;email&#125;&#125;, &#123;&#123;link&#125;&#125;
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Template</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>
                  Manage your platform's API keys and integrations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex justify-between">
                    <span>API Access</span>
                    <Switch defaultChecked={true} />
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable API access to your platform.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      type="text"
                      value="sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz12345abcdefghijklmnopqrstuvw"
                      className="font-mono text-sm"
                      disabled
                    />
                    <Button variant="outline">
                      <Icons.copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your API key grants full access to your account. Keep it secure.
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">
                    <Icons.refresh className="mr-2 h-4 w-4" />
                    Regenerate Key
                  </Button>
                  <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                    <Icons.trash className="mr-2 h-4 w-4" />
                    Revoke Key
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Integrations</CardTitle>
                <CardDescription>
                  Connect your platform with third-party services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icons.google className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Google Analytics</h4>
                      <p className="text-sm text-muted-foreground">Track user activity and engagement</p>
                    </div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="pl-14">
                  <div className="space-y-2">
                    <Label htmlFor="ga-id">Tracking ID</Label>
                    <Input id="ga-id" defaultValue="UA-123456789-1" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icons.facebook className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Facebook Pixel</h4>
                      <p className="text-sm text-muted-foreground">Track conversions from Facebook ads</p>
                    </div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icons.user className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Zendesk</h4>
                      <p className="text-sm text-muted-foreground">Customer support and helpdesk</p>
                    </div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icons.mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Mailchimp</h4>
                      <p className="text-sm text-muted-foreground">Email marketing automation</p>
                    </div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="pl-14">
                  <div className="space-y-2">
                    <Label htmlFor="mailchimp-key">API Key</Label>
                    <Input id="mailchimp-key" type="password" defaultValue="abcdef12345-us20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway</CardTitle>
                <CardDescription>
                  Configure your payment processing service.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-provider">Payment Provider</Label>
                  <Select defaultValue="stripe">
                    <SelectTrigger id="payment-provider">
                      <SelectValue placeholder="Select payment provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-public">Stripe Public Key</Label>
                    <Input id="stripe-public" defaultValue="pk_test_51AbCdEf..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                    <Input id="stripe-secret" type="password" defaultValue="sk_test_51AbCdEf..." />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="test-mode" defaultChecked={true} />
                  <Label htmlFor="test-mode">Test Mode</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input 
                    id="webhook-url" 
                    defaultValue="https://eduplatform.com/api/webhooks/stripe"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Add this URL to your Stripe dashboard webhooks section.
                  </p>
                </div>
                
                <Button variant="outline">
                  <Icons.checkCircle className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Currency & Pricing</CardTitle>
                <CardDescription>
                  Configure currency settings for your platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger id="default-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="jpy">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency-position">Currency Symbol Position</Label>
                    <Select defaultValue="before">
                      <SelectTrigger id="currency-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="before">Before amount ($99.99)</SelectItem>
                        <SelectItem value="after">After amount (99.99$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="thousand-separator">Thousand Separator</Label>
                  <Select defaultValue="comma">
                    <SelectTrigger id="thousand-separator">
                      <SelectValue placeholder="Select separator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comma">Comma (1,000.00)</SelectItem>
                      <SelectItem value="dot">Dot (1.000,00)</SelectItem>
                      <SelectItem value="space">Space (1 000.00)</SelectItem>
                      <SelectItem value="none">None (1000.00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="decimal-separator">Decimal Separator</Label>
                  <Select defaultValue="dot">
                    <SelectTrigger id="decimal-separator">
                      <SelectValue placeholder="Select separator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dot">Dot (1,000.00)</SelectItem>
                      <SelectItem value="comma">Comma (1.000,00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="decimal-places">Decimal Places</Label>
                  <Select defaultValue="2">
                    <SelectTrigger id="decimal-places">
                      <SelectValue placeholder="Select decimal places" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security options for your platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-muted-foreground text-sm">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch id="two-factor" defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="login-attempts">Login Attempt Limits</Label>
                    <p className="text-muted-foreground text-sm">
                      Lock accounts after multiple failed attempts
                    </p>
                  </div>
                  <Switch id="login-attempts" defaultChecked={true} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-attempts">Maximum Login Attempts</Label>
                  <Input id="max-attempts" type="number" min="1" defaultValue="5" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lockout-duration">Account Lockout Duration (minutes)</Label>
                  <Input id="lockout-duration" type="number" min="1" defaultValue="30" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger id="password-policy">
                      <SelectValue placeholder="Select password policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (min. 8 characters)</SelectItem>
                      <SelectItem value="medium">Medium (min. 8 chars, letters and numbers)</SelectItem>
                      <SelectItem value="strong">Strong (min. 10 chars, mixed case, numbers, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="password-expiry">Password Expiry</Label>
                    <p className="text-muted-foreground text-sm">
                      Force users to change password periodically
                    </p>
                  </div>
                  <Switch id="password-expiry" defaultChecked={false} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" min="5" defaultValue="60" />
                  <p className="text-xs text-muted-foreground">
                    Time of inactivity after which users will be logged out.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Security</CardTitle>
                <CardDescription>
                  Manage content security and moderation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="content-moderation">Content Moderation</Label>
                    <p className="text-muted-foreground text-sm">
                      Automatically scan uploaded content
                    </p>
                  </div>
                  <Switch id="content-moderation" defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="comment-moderation">Comment Moderation</Label>
                    <p className="text-muted-foreground text-sm">
                      Require approval for user comments
                    </p>
                  </div>
                  <Switch id="comment-moderation" defaultChecked={false} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowed-file-types">Allowed File Types</Label>
                  <Textarea 
                    id="allowed-file-types" 
                    rows={3} 
                    defaultValue="jpg, jpeg, png, gif, pdf, doc, docx, ppt, pptx, xls, xlsx, mp4, mp3, zip"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of allowed file extensions for uploads.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-upload-size">Maximum Upload Size (MB)</Label>
                  <Input id="max-upload-size" type="number" min="1" defaultValue="100" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
