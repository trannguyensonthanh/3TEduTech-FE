/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import InstructorLayout from '@/components/layout/InstructorLayout';
import AI3DAssistant from '@/components/chatbot/AI3DAssistant';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Course, Lesson, QuizLesson, Section } from '@/types/course';
import CourseSectionCard from '@/components/courses/CourseSectionCard';
import AddSectionForm from '@/components/courses/AddSectionForm';
import CourseDetailsForm from '@/components/courses/CourseDetailsForm';
import EditSectionDialog from '@/components/dialogs/EditSectionDialog';
import EditLessonDialog from '@/components/dialogs/EditLessonDialog';
import AddResourceDialog from '@/components/dialogs/AddResourceDialog';
import PublishCourseDialog from '@/components/dialogs/PublishCourseDialog';
import CourseSettingsForm from '@/components/courses/CourseSettingsForm';

// Mock data
const mockCourse: Course = {
  id: 1,
  title: 'Complete 3D Modeling Masterclass',
  subtitle: 'Learn professional 3D modeling techniques from scratch',
  description:
    "This comprehensive course will take you from beginner to professional in 3D modeling. You'll learn industry-standard tools and techniques used by professionals.",
  category: '3D Design',
  level: 'intermediate',
  price: 89.99,
  coverImage: '/course-cover.jpg',
  isPublished: false,
  sections: [
    {
      id: 1,
      title: 'Introduction to 3D Modeling',
      description:
        "Get familiar with the basics of 3D modeling and the software we'll be using.",
      isPublished: true,
      lessons: [
        {
          id: 1,
          title: 'Welcome to the Course',
          description: "An overview of what you'll learn in this course.",
          duration: '05:22',
          type: 'VIDEO',
          videoUrl: 'https://example.com/video1.mp4',
          isPublished: true,
          isPreview: true,
          resources: [
            {
              id: 1,
              title: 'Course Outline PDF',
              type: 'pdf',
              url: '/resources/course-outline.pdf',
            },
          ],
        },
        {
          id: 2,
          title: 'Setting Up Your Workspace',
          description:
            'Learn how to set up your software and workspace for optimal productivity.',
          duration: '12:45',
          type: 'VIDEO',
          videoUrl: 'https://example.com/video2.mp4',
          isPublished: true,
          isPreview: false,
          resources: [],
        },
        {
          id: 3,
          title: '3D Modeling Fundamentals',
          description: 'Understanding the core concepts of 3D modeling.',
          duration: 'N/A',
          type: 'TEXT',
          content:
            '<h2>Introduction to 3D Modeling</h2><p>This lesson covers the basic principles...</p>',
          isPublished: true,
          isPreview: false,
          resources: [],
        },
        {
          id: 4,
          title: 'Basic Concepts Quiz',
          description: 'Test your knowledge of 3D modeling basics.',
          duration: 'N/A',
          type: 'QUIZ',
          questions: [
            {
              id: 1,
              text: 'What is a polygon in 3D modeling?',
              explanation:
                'A polygon is a shape made up of three or more points connected by lines.',
              options: [
                { id: 1, text: 'A circular shape', isCorrect: false },
                {
                  id: 2,
                  text: 'A shape made of connected points',
                  isCorrect: true,
                },
                { id: 3, text: 'A type of 3D printer', isCorrect: false },
                { id: 4, text: 'A color palette', isCorrect: false },
              ],
            },
          ],
          isPublished: false,
          isPreview: false,
          resources: [],
        },
      ],
    },
    {
      id: 2,
      title: 'Basic Modeling Techniques',
      description: 'Learn the fundamental techniques for creating 3D models.',
      isPublished: false,
      lessons: [
        {
          id: 5,
          title: 'Understanding Primitives',
          description:
            'Learn about primitive shapes and how to use them as building blocks.',
          duration: '18:30',
          type: 'VIDEO',
          videoUrl: 'https://example.com/video3.mp4',
          isPublished: false,
          isPreview: false,
          resources: [
            {
              id: 2,
              title: 'Primitives Cheat Sheet',
              type: 'pdf',
              url: '/resources/primitives-cheatsheet.pdf',
            },
          ],
        },
        {
          id: 6,
          title: 'Extrusion and Boolean Operations',
          description:
            'Learn how to use extrusion and boolean operations to create complex shapes.',
          duration: '22:15',
          type: 'VIDEO',
          videoUrl: 'https://example.com/video4.mp4',
          isPublished: false,
          isPreview: false,
          resources: [],
        },
      ],
    },
  ],
};

interface CourseContentProps {
  course: Course;
  activeSectionId: number | null;
  setActiveSectionId: (id: number | null) => void;
  onAddLesson: (
    sectionId: number,
    lessonTitle: string,
    lessonDescription: string,
    lessonType: 'VIDEO' | 'TEXT' | 'QUIZ'
  ) => void;
  onDeleteSection: (sectionId: number) => void;
  onToggleSectionPublish: (sectionId: number) => void;
  onEditSection: (section: Section) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: number) => void;
  onToggleLessonPublish: (lessonId: number) => void;
  onToggleLessonPreview: (lessonId: number) => void;
  onAddResource: (lessonId: number) => void;
  onAddSection: (title: string, description: string) => void;
  completionPercentage: number;
  publishedLessons: number;
  totalLessons: number;
  isPublished: boolean;
  setIsPublishDialogOpen: (open: boolean) => void;
}

const CourseContent: React.FC<CourseContentProps> = ({
  course,
  activeSectionId,
  setActiveSectionId,
  onAddLesson,
  onDeleteSection,
  onToggleSectionPublish,
  onEditSection,
  onEditLesson,
  onDeleteLesson,
  onToggleLessonPublish,
  onToggleLessonPreview,
  onAddResource,
  onAddSection,
  completionPercentage,
  publishedLessons,
  totalLessons,
  isPublished,
  setIsPublishDialogOpen,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Structure</CardTitle>
        <CardDescription>
          Organize your course into sections and lessons
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Course Progress</h3>
              <p className="text-sm text-muted-foreground">
                {publishedLessons} of {totalLessons} lessons published
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Progress value={completionPercentage} className="w-[200px]" />
              <span className="text-sm font-medium">
                {completionPercentage}%
              </span>
            </div>
          </div>

          {completionPercentage < 100 && !isPublished && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Your course is not yet complete. Publish all lessons before
                publishing the course.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-6">
          {course.sections.map((section) => (
            <CourseSectionCard
              key={section.id}
              section={section}
              activeSectionId={activeSectionId}
              setActiveSectionId={setActiveSectionId}
              onAddLesson={onAddLesson}
              onDeleteSection={onDeleteSection}
              onToggleSectionPublish={onToggleSectionPublish}
              onEditSection={onEditSection}
              onEditLesson={onEditLesson}
              onDeleteLesson={onDeleteLesson}
              onToggleLessonPublish={onToggleLessonPublish}
              onToggleLessonPreview={onToggleLessonPreview}
              onAddResource={onAddResource}
            />
          ))}

          <div className="mt-6">
            <AddSectionForm onAddSection={onAddSection} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CourseEdit = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course>(mockCourse);
  const [activeTab, setActiveTab] = useState('content');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // State for adding sections/lessons
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);

  // State for edit dialogs
  const [isEditSectionDialogOpen, setIsEditSectionDialogOpen] = useState(false);
  const [isEditLessonDialogOpen, setIsEditLessonDialogOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const [editSectionDescription, setEditSectionDescription] = useState('');
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonDescription, setEditLessonDescription] = useState('');
  const [editLessonDuration, setEditLessonDuration] = useState('');
  const [editLessonType, setEditLessonType] = useState<
    'VIDEO' | 'TEXT' | 'QUIZ'
  >('VIDEO');
  const [editLessonVideoUrl, setEditLessonVideoUrl] = useState('');
  const [editLessonContent, setEditLessonContent] = useState('');
  const [editLessonQuestions, setEditLessonQuestions] = useState<any[]>([]);

  // State for resource management
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [resourceLessonId, setResourceLessonId] = useState<number | null>(null);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceType, setNewResourceType] = useState<
    'pdf' | 'doc' | 'zip' | 'link'
  >('pdf');
  const [newResourceUrl, setNewResourceUrl] = useState('');

  // State for publish confirmation
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  // Calculate course statistics
  const totalSections = course.sections.length;
  const totalLessons = course.sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );
  const publishedLessons = course.sections.reduce(
    (acc, section) =>
      acc + section.lessons.filter((lesson) => lesson.isPublished).length,
    0
  );
  const completionPercentage =
    totalLessons > 0 ? Math.round((publishedLessons / totalLessons) * 100) : 0;

  // Handler functions
  const handleAddSection = (title: string, description: string) => {
    if (!title.trim()) return;

    const newSection: Section = {
      id: Date.now(),
      title,
      description,
      lessons: [],
      isPublished: false,
    };

    setCourse((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const handleAddLesson = (
    sectionId: number,
    lessonTitle: string,
    lessonDescription: string,
    lessonType: 'VIDEO' | 'TEXT' | 'QUIZ'
  ) => {
    if (!lessonTitle.trim()) return;

    let newLesson: Lesson;

    if (lessonType === 'VIDEO') {
      newLesson = {
        id: Date.now(),
        title: lessonTitle,
        description: lessonDescription,
        duration: '00:00',
        type: 'VIDEO',
        videoUrl: '',
        isPublished: false,
        isPreview: false,
        resources: [],
      };
    } else if (lessonType === 'TEXT') {
      newLesson = {
        id: Date.now(),
        title: lessonTitle,
        description: lessonDescription,
        duration: 'N/A',
        type: 'TEXT',
        content: '',
        isPublished: false,
        isPreview: false,
        resources: [],
      };
    } else {
      newLesson = {
        id: Date.now(),
        title: lessonTitle,
        description: lessonDescription,
        duration: 'N/A',
        type: 'QUIZ',
        questions: [],
        isPublished: false,
        isPreview: false,
        resources: [],
      };
    }

    setCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, lessons: [...section.lessons, newLesson] }
          : section
      ),
    }));
  };

  const handleEditSection = () => {
    if (!editingSectionId || !editSectionTitle.trim()) return;

    setCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === editingSectionId
          ? {
              ...section,
              title: editSectionTitle,
              description: editSectionDescription,
            }
          : section
      ),
    }));

    setIsEditSectionDialogOpen(false);
    setEditingSectionId(null);
    setEditSectionTitle('');
    setEditSectionDescription('');
  };

  const handleEditLesson = () => {
    if (!editingLessonId || !editLessonTitle.trim()) return;

    let updatedLesson: Lesson;

    if (editLessonType === 'VIDEO') {
      updatedLesson = {
        id: editingLessonId,
        title: editLessonTitle,
        description: editLessonDescription,
        duration: editLessonDuration,
        type: 'VIDEO',
        videoUrl: editLessonVideoUrl,
        isPublished: false,
        isPreview: false,
        resources: [],
      };
    } else if (editLessonType === 'TEXT') {
      updatedLesson = {
        id: editingLessonId,
        title: editLessonTitle,
        description: editLessonDescription,
        duration: 'N/A',
        type: 'TEXT',
        content: editLessonContent,
        isPublished: false,
        isPreview: false,
        resources: [],
      };
    } else {
      updatedLesson = {
        id: editingLessonId,
        title: editLessonTitle,
        description: editLessonDescription,
        duration: 'N/A',
        type: 'QUIZ',
        questions: editLessonQuestions,
        isPublished: false,
        isPreview: false,
        resources: [],
      };
    }

    setCourse((prev) => {
      const updatedCourse = { ...prev };

      // Find the lesson and preserve its isPublished and isPreview state and resources
      let foundLesson: Lesson | undefined;

      for (const section of updatedCourse.sections) {
        const lesson = section.lessons.find((l) => l.id === editingLessonId);
        if (lesson) {
          foundLesson = lesson;
          break;
        }
      }

      if (foundLesson) {
        updatedLesson.isPublished = foundLesson.isPublished;
        updatedLesson.isPreview = foundLesson.isPreview;
        updatedLesson.resources = foundLesson.resources;
      }

      // Update the lesson in the course
      return {
        ...updatedCourse,
        sections: updatedCourse.sections.map((section) => ({
          ...section,
          lessons: section.lessons.map((lesson) =>
            lesson.id === editingLessonId ? updatedLesson : lesson
          ),
        })),
      };
    });

    setIsEditLessonDialogOpen(false);
    setEditingLessonId(null);
    setEditLessonTitle('');
    setEditLessonDescription('');
    setEditLessonDuration('');
    setEditLessonVideoUrl('');
    setEditLessonContent('');
    setEditLessonQuestions([]);
    setEditLessonType('VIDEO');
  };

  const handleDeleteSection = (sectionId: number) => {
    setCourse((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }));
  };

  const handleDeleteLesson = (lessonId: number) => {
    setCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
      })),
    }));
  };

  const handleToggleLessonPreview = (lessonId: number) => {
    setCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, isPreview: !lesson.isPreview }
            : lesson
        ),
      })),
    }));
  };

  const handleToggleSectionPublish = (sectionId: number) => {
    setCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, isPublished: !section.isPublished }
          : section
      ),
    }));
  };

  const handleToggleLessonPublish = (lessonId: number) => {
    setCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, isPublished: !lesson.isPublished }
            : lesson
        ),
      })),
    }));
  };

  const openEditSectionDialog = (section: Section) => {
    setEditingSectionId(section.id);
    setEditSectionTitle(section.title);
    setEditSectionDescription(section.description);
    setIsEditSectionDialogOpen(true);
  };

  const openEditLessonDialog = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setEditLessonTitle(lesson.title);
    setEditLessonDescription(lesson.description || '');
    setEditLessonType(lesson.type);

    if (lesson.type === 'VIDEO') {
      setEditLessonDuration(lesson.duration);
      setEditLessonVideoUrl((lesson as any).videoUrl || '');
    } else if (lesson.type === 'TEXT') {
      setEditLessonContent((lesson as any).content || '');
    } else if (lesson.type === 'QUIZ') {
      setEditLessonQuestions([...(lesson as QuizLesson).questions]);
    }

    setIsEditLessonDialogOpen(true);
  };

  const handleAddResource = () => {
    if (!resourceLessonId || !newResourceTitle.trim() || !newResourceUrl.trim())
      return;

    const newResource = {
      id: Date.now(),
      title: newResourceTitle,
      type: newResourceType,
      url: newResourceUrl,
    };

    setCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) =>
          lesson.id === resourceLessonId
            ? { ...lesson, resources: [...lesson.resources, newResource] }
            : lesson
        ),
      })),
    }));

    setIsAddResourceDialogOpen(false);
    setResourceLessonId(null);
    setNewResourceTitle('');
    setNewResourceType('pdf');
    setNewResourceUrl('');
  };

  const handleDeleteResource = (lessonId: number, resourceId: number) => {
    setCourse((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) =>
          lesson.id === lessonId
            ? {
                ...lesson,
                resources: lesson.resources.filter(
                  (resource) => resource.id !== resourceId
                ),
              }
            : lesson
        ),
      })),
    }));
  };

  const handlePublishCourse = () => {
    setCourse((prev) => ({
      ...prev,
      isPublished: true,
    }));
    setIsPublishDialogOpen(false);
  };

  const handleUpdateCourseDetails = (
    field: keyof Course,
    value: string | number
  ) => {
    setCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <InstructorLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Course</h1>
            <p className="text-muted-foreground">
              Update your course content and settings
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
            >
              {isAIAssistantOpen ? 'Close' : 'Open'} AI Assistant
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/instructor/courses/${courseId}`)}
            >
              Preview Course
            </Button>
            <Button
              onClick={() => setIsPublishDialogOpen(true)}
              disabled={course.isPublished}
            >
              {course.isPublished ? 'Published' : 'Publish Course'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="settings">Settings & Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <CourseContent
              course={course}
              activeSectionId={activeSectionId}
              setActiveSectionId={setActiveSectionId}
              onAddLesson={handleAddLesson}
              onDeleteSection={handleDeleteSection}
              onToggleSectionPublish={handleToggleSectionPublish}
              onEditSection={openEditSectionDialog}
              onEditLesson={openEditLessonDialog}
              onDeleteLesson={handleDeleteLesson}
              onToggleLessonPublish={handleToggleLessonPublish}
              onToggleLessonPreview={handleToggleLessonPreview}
              onAddResource={(lessonId) => {
                setResourceLessonId(lessonId);
                setIsAddResourceDialogOpen(true);
              }}
              onAddSection={handleAddSection}
              completionPercentage={completionPercentage}
              publishedLessons={publishedLessons}
              totalLessons={totalLessons}
              isPublished={course.isPublished}
              setIsPublishDialogOpen={setIsPublishDialogOpen}
            />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Update your course information and description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourseDetailsForm
                  course={course}
                  onUpdateCourseDetails={handleUpdateCourseDetails}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings & Pricing</CardTitle>
                <CardDescription>
                  Configure course settings and pricing options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CourseSettingsForm
                  course={course}
                  onUpdateCourseDetails={handleUpdateCourseDetails}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <EditSectionDialog
        isOpen={isEditSectionDialogOpen}
        onClose={() => setIsEditSectionDialogOpen(false)}
        editSectionTitle={editSectionTitle}
        setEditSectionTitle={setEditSectionTitle}
        editSectionDescription={editSectionDescription}
        setEditSectionDescription={setEditSectionDescription}
        onSave={handleEditSection}
      />

      <EditLessonDialog
        isOpen={isEditLessonDialogOpen}
        onClose={() => setIsEditLessonDialogOpen(false)}
        editLessonTitle={editLessonTitle}
        setEditLessonTitle={setEditLessonTitle}
        editLessonDescription={editLessonDescription}
        setEditLessonDescription={setEditLessonDescription}
        editLessonType={editLessonType}
        setEditLessonType={setEditLessonType}
        editLessonDuration={editLessonDuration}
        setEditLessonDuration={setEditLessonDuration}
        editLessonVideoUrl={editLessonVideoUrl}
        setEditLessonVideoUrl={setEditLessonVideoUrl}
        editLessonContent={editLessonContent}
        setEditLessonContent={setEditLessonContent}
        editLessonQuestions={editLessonQuestions}
        setEditLessonQuestions={setEditLessonQuestions}
        onSave={handleEditLesson}
      />

      <AddResourceDialog
        isOpen={isAddResourceDialogOpen}
        onClose={() => setIsAddResourceDialogOpen(false)}
        resourceTitle={newResourceTitle}
        setResourceTitle={setNewResourceTitle}
        resourceType={newResourceType}
        setResourceType={setNewResourceType}
        resourceUrl={newResourceUrl}
        setResourceUrl={setNewResourceUrl}
        onAddResource={handleAddResource}
      />

      <PublishCourseDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onPublish={handlePublishCourse}
        completionPercentage={completionPercentage}
      />

      {/* AI Assistant */}
      {isAIAssistantOpen && (
        <AI3DAssistant
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          initialMessage="How can I help you with your course creation today?"
        />
      )}
    </InstructorLayout>
  );
};

export default CourseEdit;
