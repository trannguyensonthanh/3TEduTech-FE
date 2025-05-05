import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ArrowLeft, ChevronRight, Settings, User } from "lucide-react";

import SidebarComponent from "@/components/courseLearn/Sidebar";
import LessonContent from "@/components/courseLearn/LessonContent";
import LessonTabs from "@/components/courseLearn/LessonTabs";
import AIAssistantDialog from "@/components/courseLearn/AIAssistantDialog";
import CourseInfoDialog from "@/components/courseLearn/CourseInfoDialog";

// Define proper types for lessons
interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: number;
  text: string;
  explanation: string;
  options: QuizOption[];
}

interface Comment {
  id: number;
  user: {
    name: string;
    avatar?: string;
    isInstructor: boolean;
  };
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

interface Resource {
  id: number;
  title: string;
  type: "pdf" | "doc" | "zip" | "link";
  url: string;
  size?: string;
}

interface BaseLesson {
  id: number;
  title: string;
  duration: string;
  type: "VIDEO" | "TEXT" | "QUIZ";
  completed: boolean;
  isPreview: boolean;
  description?: string;
  resources: Resource[];
  discussions: Comment[];
}

interface VideoLesson extends BaseLesson {
  type: "VIDEO";
  videoUrl?: string;
}

interface TextLesson extends BaseLesson {
  type: "TEXT";
  content: string;
}

interface QuizLesson extends BaseLesson {
  type: "QUIZ";
  questions: QuizQuestion[];
}

type Lesson = VideoLesson | TextLesson | QuizLesson;

interface Section {
  id: number;
  title: string;
  completed: boolean;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  currentSectionId: number;
  currentLessonId: number;
  sections: Section[];
}

// Mock data with proper typing
const mockCourse: Course = {
  id: 1,
  title: "Complete Web Development Bootcamp",
  instructor: "Jane Smith",
  progress: 35,
  completedLessons: 7,
  totalLessons: 20,
  currentSectionId: 2,
  currentLessonId: 5,
  sections: [
    {
      id: 1,
      title: "Introduction to Web Development",
      completed: true,
      lessons: [
        {
          id: 1,
          title: "Welcome to the Course",
          duration: "5:30",
          type: "VIDEO",
          completed: true,
          isPreview: true,
          videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
          description:
            "In this lesson, we'll provide an overview of what you'll learn in this course and how to get the most out of it.",
          resources: [
            {
              id: 1,
              title: "Course Roadmap",
              type: "pdf",
              url: "#",
              size: "1.2 MB",
            },
            {
              id: 2,
              title: "Welcome Notes",
              type: "doc",
              url: "#",
              size: "420 KB",
            },
          ],
          discussions: [
            {
              id: 1,
              user: {
                name: "Alex Johnson",
                avatar: "https://randomuser.me/api/portraits/men/43.jpg",
                isInstructor: false,
              },
              content:
                "Excited to start this course! The introduction was very clear.",
              createdAt: "2 days ago",
              likes: 5,
            },
            {
              id: 2,
              user: {
                name: "Jane Smith",
                avatar: "https://randomuser.me/api/portraits/women/23.jpg",
                isInstructor: true,
              },
              content:
                "Welcome to the course, Alex! I'm glad you found the introduction helpful.",
              createdAt: "1 day ago",
              likes: 2,
            },
          ],
        },
        {
          id: 2,
          title: "How to Get the Most Out of This Course",
          duration: "8:45",
          type: "VIDEO",
          completed: true,
          isPreview: false,
          videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
          description:
            "Learn strategies to make the most of this course and maximize your learning experience.",
          resources: [],
          discussions: [],
        },
        {
          id: 3,
          title: "Setting Up Your Development Environment",
          duration: "15:20",
          type: "VIDEO",
          completed: true,
          isPreview: false,
          videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
          description:
            "In this lesson, we'll walk through the process of setting up your development environment for web development.",
          resources: [
            {
              id: 3,
              title: "Setup Guide",
              type: "pdf",
              url: "#",
              size: "2.1 MB",
            },
          ],
          discussions: [],
        },
      ],
    },
    {
      id: 2,
      title: "HTML Fundamentals",
      completed: false,
      lessons: [
        {
          id: 4,
          title: "HTML Basics",
          duration: "12:10",
          type: "VIDEO",
          completed: true,
          isPreview: false,
          videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
          description:
            "Learn the basics of HTML, including tags, elements, and document structure.",
          resources: [],
          discussions: [],
        },
        {
          id: 5,
          title: "HTML Tags and Elements",
          duration: "18:30",
          type: "VIDEO",
          completed: false,
          isPreview: false,
          videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
          description:
            "Dive deeper into HTML tags and elements, learning how to structure content effectively.",
          resources: [
            {
              id: 4,
              title: "HTML Cheat Sheet",
              type: "pdf",
              url: "#",
              size: "850 KB",
            },
          ],
          discussions: [
            {
              id: 3,
              user: {
                name: "Maria Garcia",
                avatar: "https://randomuser.me/api/portraits/women/42.jpg",
                isInstructor: false,
              },
              content:
                "I'm confused about the difference between <div> and <span>. Could someone explain?",
              createdAt: "12 hours ago",
              likes: 0,
            },
          ],
        },
        {
          id: 6,
          title: "HTML Forms",
          duration: "22:15",
          type: "VIDEO",
          completed: false,
          isPreview: false,
          videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
          description:
            "Learn how to create interactive forms in HTML to collect user input.",
          resources: [],
          discussions: [],
        },
        {
          id: 7,
          title: "HTML Practice Quiz",
          duration: "N/A",
          type: "QUIZ",
          completed: false,
          isPreview: false,
          description: "Test your knowledge of HTML with this practice quiz.",
          questions: [
            {
              id: 1,
              text: "What does HTML stand for?",
              explanation:
                "HTML stands for Hyper Text Markup Language. It is the standard markup language for documents designed to be displayed in a web browser.",
              options: [
                { id: 1, text: "Hyper Text Markup Language", isCorrect: true },
                { id: 2, text: "High Text Machine Language", isCorrect: false },
                {
                  id: 3,
                  text: "Hyper Tabular Markup Language",
                  isCorrect: false,
                },
                { id: 4, text: "None of the above", isCorrect: false },
              ],
            },
            {
              id: 2,
              text: "Which HTML tag is used to define an unordered list?",
              explanation:
                "The <ul> tag defines an unordered (bulleted) list. Use the <ul> tag together with the <li> tag to create unordered lists.",
              options: [
                { id: 5, text: "<ol>", isCorrect: false },
                { id: 6, text: "<li>", isCorrect: false },
                { id: 7, text: "<ul>", isCorrect: true },
                { id: 8, text: "<list>", isCorrect: false },
              ],
            },
          ],
          resources: [],
          discussions: [],
        },
      ],
    },
    {
      id: 3,
      title: "CSS Essentials",
      completed: false,
      lessons: [
        {
          id: 8,
          title: "Introduction to CSS",
          duration: "10:45",
          type: "VIDEO",
          completed: false,
          isPreview: false,
          videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
          description:
            "Learn the basics of CSS and how to use it to style your HTML documents.",
          resources: [],
          discussions: [],
        },
        {
          id: 9,
          title: "CSS Selectors",
          duration: "14:20",
          type: "VIDEO",
          completed: false,
          isPreview: false,
          videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
          description:
            "Master CSS selectors to target specific HTML elements for styling.",
          resources: [],
          discussions: [],
        },
        {
          id: 10,
          title: "CSS Box Model",
          duration: "N/A",
          type: "TEXT",
          completed: false,
          isPreview: false,
          description:
            "Understand the CSS box model and how it affects layout and spacing.",
          content: `
            <h2>The CSS Box Model</h2>
            <p>In CSS, the term "box model" is used when talking about design and layout.</p>
            <p>The CSS box model is essentially a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content.</p>
            <p>The box model allows us to add a border around elements, and to define space between elements.</p>
            <h3>Explanation of the different parts:</h3>
            <ul>
              <li><strong>Content</strong> - The content of the box, where text and images appear</li>
              <li><strong>Padding</strong> - Clears an area around the content. The padding is transparent</li>
              <li><strong>Border</strong> - A border that goes around the padding and content</li>
              <li><strong>Margin</strong> - Clears an area outside the border. The margin is transparent</li>
            </ul>
            <p>The box model allows us to place a border around elements and space elements in relation to other elements.</p>
          `,
          resources: [
            {
              id: 5,
              title: "Box Model Diagram",
              type: "pdf",
              url: "#",
              size: "350 KB",
            },
          ],
          discussions: [],
        },
      ],
    },
  ],
};

const CourseLearningPage = () => {
  const { courseId, sectionId, lessonId } = useParams<{
    courseId: string;
    sectionId: string;
    lessonId: string;
  }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isCourseInfoOpen, setIsCourseInfoOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState<number>(
    parseInt(lessonId || "5", 10)
  );
  const [activeTab, setActiveTab] = useState<
    "description" | "resources" | "discussions"
  >("description");
  const [newComment, setNewComment] = useState("");

  // Find the current lesson and section
  const currentLessonData = mockCourse.sections
    .flatMap((s) => s.lessons)
    .find((l) => l.id === activeLesson);
  const currentSectionData = mockCourse.sections.find((s) =>
    s.lessons.some((l) => l.id === activeLesson)
  );

  // For quiz functionality
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleLessonSelect = (lessonId: number) => {
    setActiveLesson(lessonId);
    setActiveTab("description");
    setQuizSubmitted(false);
    setSelectedAnswers({});
  };

  const handleQuizOptionSelect = (questionId: number, optionId: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId,
    });
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const isQuizOptionCorrect = (questionId: number, optionId: number) => {
    if (!quizSubmitted) return undefined;

    const quizLesson = currentLessonData as QuizLesson;
    if (quizLesson.type !== "QUIZ") return undefined;

    const questions = quizLesson.questions || [];
    const question = questions.find((q) => q.id === questionId);
    if (!question) return undefined;

    const option = question.options.find((o) => o.id === optionId);
    return option?.isCorrect;
  };

  const calculateQuizScore = () => {
    if (
      !quizSubmitted ||
      !currentLessonData ||
      currentLessonData.type !== "QUIZ"
    )
      return 0;

    const quizLesson = currentLessonData as QuizLesson;
    const totalQuestions = quizLesson.questions.length;
    if (totalQuestions === 0) return 0;

    let correctAnswers = 0;

    quizLesson.questions.forEach((question) => {
      const selectedOptionId = selectedAnswers[question.id];
      if (selectedOptionId) {
        const selectedOption = question.options.find(
          (o) => o.id === selectedOptionId
        );
        if (selectedOption?.isCorrect) {
          correctAnswers++;
        }
      }
    });

    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim() || !currentLessonData) return;

    // In a real application, you would call an API to save the comment
    // For now, we'll just log it
    console.log("New comment submitted:", newComment);

    // Clear the comment input
    setNewComment("");
  };

  // Calculate the previous and next lessons
  let prevLesson = null;
  let nextLesson = null;

  if (currentLessonData && currentSectionData) {
    // Find current lesson index within section
    const currentLessonIndex = currentSectionData.lessons.findIndex(
      (l) => l.id === currentLessonData.id
    );

    // Previous lesson (either in same section or last lesson of previous section)
    if (currentLessonIndex > 0) {
      // Previous lesson in same section
      prevLesson = {
        sectionId: currentSectionData.id,
        lessonId: currentSectionData.lessons[currentLessonIndex - 1].id,
      };
    } else {
      // Last lesson of previous section (if there is one)
      const currentSectionIndex = mockCourse.sections.findIndex(
        (s) => s.id === currentSectionData.id
      );
      if (currentSectionIndex > 0) {
        const prevSection = mockCourse.sections[currentSectionIndex - 1];
        prevLesson = {
          sectionId: prevSection.id,
          lessonId: prevSection.lessons[prevSection.lessons.length - 1].id,
        };
      }
    }

    // Next lesson (either in same section or first lesson of next section)
    if (currentLessonIndex < currentSectionData.lessons.length - 1) {
      // Next lesson in same section
      nextLesson = {
        sectionId: currentSectionData.id,
        lessonId: currentSectionData.lessons[currentLessonIndex + 1].id,
      };
    } else {
      // First lesson of next section (if there is one)
      const currentSectionIndex = mockCourse.sections.findIndex(
        (s) => s.id === currentSectionData.id
      );
      if (currentSectionIndex < mockCourse.sections.length - 1) {
        const nextSection = mockCourse.sections[currentSectionIndex + 1];
        nextLesson = {
          sectionId: nextSection.id,
          lessonId: nextSection.lessons[0].id,
        };
      }
    }
  }

  return (
    <SidebarProvider className="block">
      <div className="flex min-h-screen">
        <SidebarComponent
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          mockCourse={mockCourse}
          activeLesson={activeLesson}
          handleLessonSelect={handleLessonSelect}
          setIsCourseInfoOpen={setIsCourseInfoOpen}
          setIsChatbotOpen={setIsChatbotOpen}
        />

        <div className="flex-1 flex flex-col p-3">
          <header className="border-b bg-background p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2" asChild>
                  <Link to="/courses">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <h1 className="font-bold text-xl">{mockCourse.title}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {mockCourse.instructor}
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 flex flex-col">
            {currentLessonData && currentSectionData && (
              <>
                <div className="border-b bg-background">
                  <div className="container mx-auto">
                    <div className="flex items-center p-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold">
                          {currentLessonData.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {currentSectionData.title} •{" "}
                          {currentLessonData.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {prevLesson && (
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              to={`/courses/${courseId}/sections/${prevLesson.sectionId}/lessons/${prevLesson.lessonId}`}
                            >
                              <ArrowLeft className="h-4 w-4 mr-1" />
                              Previous
                            </Link>
                          </Button>
                        )}
                        {nextLesson && (
                          <Button size="sm" asChild>
                            <Link
                              to={`/courses/${courseId}/sections/${nextLesson.sectionId}/lessons/${nextLesson.lessonId}`}
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-6">
                      {currentLessonData && (
                        <LessonContent
                          lesson={currentLessonData}
                          selectedAnswers={selectedAnswers}
                          quizSubmitted={quizSubmitted}
                          onQuizOptionSelect={handleQuizOptionSelect}
                          onQuizSubmit={handleQuizSubmit}
                          isQuizOptionCorrect={isQuizOptionCorrect}
                          calculateQuizScore={calculateQuizScore}
                        />
                      )}

                      <div className="flex justify-between items-center mt-6 !mb-6">
                        <div>
                          {prevLesson && (
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                to={`/courses/${courseId}/sections/${prevLesson.sectionId}/lessons/${prevLesson.lessonId}`}
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Previous Lesson
                              </Link>
                            </Button>
                          )}
                        </div>
                        <div>
                          {nextLesson && (
                            <Button size="sm" asChild>
                              <Link
                                to={`/courses/${courseId}/sections/${nextLesson.sectionId}/lessons/${nextLesson.lessonId}`}
                              >
                                Next Lesson
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      {currentLessonData && (
                        <LessonTabs
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                          lesson={currentLessonData}
                          newComment={newComment}
                          setNewComment={setNewComment}
                          handleCommentSubmit={handleCommentSubmit}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AIAssistantDialog
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        lessonTitle={currentLessonData?.title}
      />

      <CourseInfoDialog
        isOpen={isCourseInfoOpen}
        onClose={() => setIsCourseInfoOpen(false)}
        course={mockCourse}
      />
    </SidebarProvider>
  );
};

export default CourseLearningPage;
