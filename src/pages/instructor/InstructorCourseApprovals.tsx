
import { useState } from 'react';
import { Link } from 'react-router-dom';
import InstructorLayout from '@/components/layout/InstructorLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, Edit, Eye, FileText } from 'lucide-react';
import { Icons } from '@/components/common/Icons';

// Mock data for course approvals
const mockApprovals = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    slug: 'complete-web-development-bootcamp',
    submitDate: '2025-04-15',
    status: 'PENDING',
    feedback: null,
    courseId: 1,
  },
  {
    id: 2,
    title: 'Advanced React Patterns',
    slug: 'advanced-react-patterns',
    submitDate: '2025-04-10',
    status: 'APPROVED',
    feedback: 'Great course! Approved with no changes needed.',
    courseId: 2,
  },
  {
    id: 3,
    title: 'Python for Data Science',
    slug: 'python-for-data-science',
    submitDate: '2025-04-05',
    status: 'REJECTED',
    feedback: 'Course needs more practical examples and exercises. Please revise the curriculum.',
    courseId: 3,
  },
  {
    id: 4,
    title: 'Mobile App Development with Flutter',
    slug: 'mobile-app-development-with-flutter',
    submitDate: '2025-04-01',
    status: 'PENDING',
    feedback: null,
    courseId: 4,
  },
  {
    id: 5,
    title: 'Machine Learning Fundamentals',
    slug: 'machine-learning-fundamentals',
    submitDate: '2025-03-28',
    status: 'APPROVED',
    feedback: 'Excellent content and structure. Approved.',
    courseId: 5,
  },
  {
    id: 6,
    title: 'UI/UX Design Principles',
    slug: 'ui-ux-design-principles',
    submitDate: '2025-03-25',
    status: 'REJECTED',
    feedback: 'Course content is too basic. Please add more advanced topics and case studies.',
    courseId: 6,
  },
];

const InstructorCourseApprovals = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter approvals based on activeTab
  const filteredApprovals = mockApprovals.filter(approval => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return approval.status === 'PENDING';
    if (activeTab === 'approved') return approval.status === 'APPROVED';
    if (activeTab === 'rejected') return approval.status === 'REJECTED';
    return false;
  });
  
  return (
    <InstructorLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Course Approvals</h1>
          <p className="text-muted-foreground mt-2">
            Track the status of your course approval requests.
          </p>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <ApprovalsList approvals={filteredApprovals} />
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <ApprovalsList approvals={filteredApprovals} />
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            <ApprovalsList approvals={filteredApprovals} />
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-6">
            <ApprovalsList approvals={filteredApprovals} />
          </TabsContent>
        </Tabs>
      </div>
    </InstructorLayout>
  );
};

const ApprovalsList = ({ approvals }) => {
  if (approvals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icons.fileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No approval requests found</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          When you submit a course for approval, it will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-6">
      {approvals.map((approval) => (
        <Card key={approval.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{approval.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Submitted: {approval.submitDate}</span>
                </div>
              </div>
              <Badge
                className={
                  approval.status === 'APPROVED' ? 'bg-green-500' :
                  approval.status === 'REJECTED' ? 'bg-red-500' :
                  'bg-yellow-500'
                }
              >
                {approval.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {approval.feedback && (
              <div className="bg-muted p-3 rounded-md mb-4">
                <p className="text-sm font-medium mb-1">Admin Feedback:</p>
                <p className="text-sm">{approval.feedback}</p>
              </div>
            )}
            
            <div className="flex space-x-3 mt-4">
              {approval.status === 'APPROVED' && (
                <>
                  <Link to={`/courses/${approval.slug}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" /> View Course
                    </Button>
                  </Link>
                  <Link to={`/instructor/courses/${approval.courseId}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" /> Edit Course
                    </Button>
                  </Link>
                </>
              )}
              
              {approval.status === 'REJECTED' && (
                <Link to={`/instructor/courses/${approval.courseId}/edit`}>
                  <Button variant="default" size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Edit & Resubmit
                  </Button>
                </Link>
              )}
              
              {approval.status === 'PENDING' && (
                <div className="flex items-center text-muted-foreground">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Your course is being reviewed</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InstructorCourseApprovals;
