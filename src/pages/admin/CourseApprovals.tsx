import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import CourseDetailView from '@/components/admin/approvals/CourseDetailView';
import ApprovalsList from '@/components/admin/approvals/ApprovalsList';
import {
  VideoPreviewDialog,
  TextContentDialog,
  QuizContentDialog,
} from '@/components/admin/approvals/LessonDialogs';

// Mock data for demonstration
const mockApprovals = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  courseName: `Course ${i + 1}: Learn Something Amazing`,
  slug: `course-${i + 1}-learn-something-amazing`,
  instructorName: `Instructor ${Math.floor(i / 3) + 1}`,
  submittedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split('T')[0],
  type: ['NEW_COURSE', 'COURSE_UPDATE'][Math.floor(Math.random() * 2)],
  status: ['PENDING', 'APPROVED', 'REJECTED'][Math.floor(Math.random() * 3)],
  notes: Math.random() > 0.5 ? 'Please review this course for approval.' : null,
  categoryName: ['Programming', 'Design', 'Business', 'Marketing'][
    Math.floor(Math.random() * 4)
  ],
  price: Math.floor(Math.random() * 150) + 9.99,
  lessons: Math.floor(Math.random() * 30) + 5,
  totalDuration: Math.floor(Math.random() * 20) + 2 + ' hours',
  hasFreePreview: Math.random() > 0.4,
  thumbnailUrl: `https://via.placeholder.com/640x360?text=Course+${i + 1}`,
  curriculum: [
    {
      id: 1,
      title: 'Section 1: Introduction',
      lessons: [
        {
          id: 1,
          title: 'Welcome to the Course',
          duration: '05:30',
          type: 'VIDEO',
          isPreview: true,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
        {
          id: 2,
          title: 'Course Overview',
          duration: '10:15',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
        {
          id: 3,
          title: 'Course Content Overview',
          duration: 'N/A',
          type: 'TEXT',
          isPreview: false,
          content:
            '<p>In this course, you will learn about:</p><ul><li>Basic concepts</li><li>Advanced techniques</li><li>Best practices</li></ul>',
        },
      ],
    },
    {
      id: 2,
      title: 'Section 2: Getting Started',
      lessons: [
        {
          id: 4,
          title: 'Setting Up Your Environment',
          duration: '15:45',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
        {
          id: 5,
          title: 'Basic Concepts',
          duration: '12:30',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
        {
          id: 6,
          title: 'First Quiz',
          duration: 'N/A',
          type: 'QUIZ',
          isPreview: false,
          questions: [
            {
              id: 1,
              question: 'Which of the following is NOT a JavaScript data type?',
              options: ['String', 'Number', 'Boolean', 'Float'],
              correctAnswer: 'Float',
            },
            {
              id: 2,
              question: 'What does HTML stand for?',
              options: [
                'Hyper Text Markup Language',
                'High Tech Machine Learning',
                'Hybrid Text Mining Language',
                'Home Tool Markup Language',
              ],
              correctAnswer: 'Hyper Text Markup Language',
            },
          ],
        },
        {
          id: 7,
          title: 'Your First Project',
          duration: '20:15',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
      ],
    },
    {
      id: 3,
      title: 'Section 3: Advanced Topics',
      lessons: [
        {
          id: 8,
          title: 'Advanced Techniques',
          duration: '18:20',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
        {
          id: 9,
          title: 'Important Concepts',
          duration: 'N/A',
          type: 'TEXT',
          isPreview: false,
          content:
            '<h3>Key Concepts to Remember</h3><p>Here are some important points to keep in mind when working on your projects:</p><ul><li>Always back up your work</li><li>Test frequently</li><li>Document your code</li></ul>',
        },
        {
          id: 10,
          title: 'Best Practices',
          duration: '14:10',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
        {
          id: 11,
          title: 'Final Quiz',
          duration: 'N/A',
          type: 'QUIZ',
          isPreview: false,
          questions: [
            {
              id: 1,
              question: 'Which of the following is a benefit of using React?',
              options: [
                'Virtual DOM for better performance',
                'Only works with NoSQL databases',
                'Requires manual DOM manipulation',
                'Cannot be used for single page applications',
              ],
              correctAnswer: 'Virtual DOM for better performance',
            },
            {
              id: 2,
              question: 'What does CSS stand for?',
              options: [
                'Creative Style Sheets',
                'Computer Style Sheets',
                'Cascading Style Sheets',
                'Colorful Style Sheets',
              ],
              correctAnswer: 'Cascading Style Sheets',
            },
            {
              id: 3,
              question: 'Which of these is NOT a CSS box model component?',
              options: ['Border', 'Margin', 'Padding', 'Element'],
              correctAnswer: 'Element',
            },
          ],
        },
        {
          id: 12,
          title: 'Final Project',
          duration: '25:30',
          type: 'VIDEO',
          isPreview: false,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
      ],
    },
  ],
}));

const CourseApprovals = () => {
  const { toast } = useToast();
  const [selectedApproval, setSelectedApproval] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // State for expanded sections in curriculum
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  // State for viewing lesson content
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [currentPreviewLesson, setCurrentPreviewLesson] = useState(null);
  const [currentTextLesson, setCurrentTextLesson] = useState(null);
  const [currentQuizLesson, setCurrentQuizLesson] = useState(null);

  // Get selected approval details
  const selectedApprovalDetails = selectedApproval
    ? mockApprovals.find((approval) => approval.id === selectedApproval)
    : null;

  const handleApprove = () => {
    // Here you would handle the approval logic
    console.log(
      'Approving course',
      selectedApproval,
      'with notes:',
      adminNotes
    );

    toast({
      title: 'Course approved',
      description: 'The course has been approved and published.',
    });

    setSelectedApproval(null);
    setAdminNotes('');
  };

  const handleReject = () => {
    // Here you would handle the rejection logic
    console.log(
      'Rejecting course',
      selectedApproval,
      'with notes:',
      adminNotes
    );

    toast({
      title: 'Course rejected',
      description: 'The course has been rejected with feedback.',
    });

    setSelectedApproval(null);
    setAdminNotes('');
  };

  const toggleSectionExpand = (sectionId: number) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  const handlePreviewLesson = (lesson) => {
    setCurrentPreviewLesson(lesson);
    setPreviewDialogOpen(true);
  };

  const handleViewTextLesson = (lesson) => {
    setCurrentTextLesson(lesson);
    setTextDialogOpen(true);
  };

  const handleViewQuizLesson = (lesson) => {
    setCurrentQuizLesson(lesson);
    setQuizDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Course Approval Requests</h1>
        </div>

        {selectedApprovalDetails ? (
          <CourseDetailView
            courseDetails={selectedApprovalDetails}
            expandedSections={expandedSections}
            toggleSectionExpand={toggleSectionExpand}
            onPreviewLesson={handlePreviewLesson}
            onViewTextLesson={handleViewTextLesson}
            onViewQuizLesson={handleViewQuizLesson}
            onBack={() => setSelectedApproval(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            adminNotes={adminNotes}
            setAdminNotes={setAdminNotes}
          />
        ) : (
          <ApprovalsList
            approvals={mockApprovals}
            onReview={setSelectedApproval}
          />
        )}
      </div>

      {/* Lesson Content Dialogs */}
      <VideoPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        lesson={currentPreviewLesson}
      />

      <TextContentDialog
        open={textDialogOpen}
        onOpenChange={setTextDialogOpen}
        lesson={currentTextLesson}
      />

      <QuizContentDialog
        open={quizDialogOpen}
        onOpenChange={setQuizDialogOpen}
        lesson={currentQuizLesson}
      />
    </AdminLayout>
  );
};

export default CourseApprovals;
