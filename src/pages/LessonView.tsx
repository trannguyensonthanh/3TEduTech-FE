// trang này nên được cook nhma thôi để đó tham khảo sau
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/common/Icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AI3DAssistant from "@/components/chatbot/AI3DAssistant";

// Define types for lessons with all required properties
interface LessonNote {
  id: number;
  timestamp: string;
  content: string;
}

interface LessonResource {
  id: number;
  title: string;
  type: string;
  url: string;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  current: boolean;
  videoUrl?: string;
  content?: string;
  resources?: LessonResource[];
  notes?: LessonNote[];
}

interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  slug: string;
  title: string;
  sections: Section[];
}

// Mock course data
const coursesData: Course[] = [
  {
    id: 1,
    slug: "complete-python-bootcamp",
    title: "Complete Python Bootcamp: From Zero to Hero",
    sections: [
      {
        id: 1,
        title: "Getting Started with Python",
        lessons: [
          {
            id: 1,
            title: "Introduction to the Course",
            duration: "5:23",
            completed: true,
            current: false,
            videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
            content:
              "Welcome to the course! In this lesson, we will go over the course structure and what you will learn.",
            resources: [
              { id: 1, title: "Course Overview Slides", type: "pdf", url: "#" },
            ],
            notes: [],
          },
          {
            id: 2,
            title: "Introduction to Python Variables",
            duration: "15:20",
            completed: false,
            current: true,
            videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
            content: `
              <h2>What are Variables?</h2>
              <p>In programming, a variable is a named location in memory that stores a value. In Python, variables are created when you assign a value to them.</p>
              
              <pre><code>
          # This is how you create a variable in Python
          name = "John Doe"
          age = 30
          is_student = True
              </code></pre>
              
              <h2>Variable Naming Rules</h2>
              <p>When naming variables in Python, you need to follow these rules:</p>
              <ul>
                <li>Variable names can contain letters, numbers, and underscores</li>
                <li>Variable names must start with a letter or underscore</li>
                <li>Variable names cannot start with a number</li>
                <li>Variable names are case-sensitive (age, Age, and AGE are three different variables)</li>
                <li>Variable names cannot be Python keywords (like if, for, while, etc.)</li>
              </ul>
              
              <h2>Variable Types in Python</h2>
              <p>Python has several built-in types:</p>
              <ul>
                <li><strong>Numeric Types:</strong> int, float, complex</li>
                <li><strong>Text Type:</strong> str</li>
                <li><strong>Boolean Type:</strong> bool</li>
                <li><strong>Sequence Types:</strong> list, tuple, range</li>
                <li><strong>Mapping Type:</strong> dict</li>
                <li><strong>Set Types:</strong> set, frozenset</li>
              </ul>
              
              <h2>Type Conversion</h2>
              <p>You can convert between types using built-in functions:</p>
              
              <pre><code>
          # Converting between types
          x = 10      # int
          y = float(x)  # Convert to float: 10.0
          z = str(x)    # Convert to string: "10"
              </code></pre>
              
              <h2>Practice Exercises</h2>
              <p>Try these exercises to test your understanding of variables:</p>
              <ol>
                <li>Create variables for your name, age, and whether you're a student</li>
                <li>Print each variable</li>
                <li>Convert your age to a string and concatenate it with your name</li>
                <li>Create a list of your favorite colors</li>
              </ol>
            `,
            resources: [
              { id: 1, title: "Lesson Slides", type: "pdf", url: "#" },
              { id: 2, title: "Example Code", type: "zip", url: "#" },
              { id: 3, title: "Practice Exercises", type: "pdf", url: "#" },
            ],
            notes: [
              {
                id: 1,
                timestamp: "2:30",
                content: "Important point about variable naming conventions.",
              },
              {
                id: 2,
                timestamp: "8:45",
                content:
                  "Remember the difference between mutable and immutable types.",
              },
            ],
          },
          // Add a default lesson with all required properties
          {
            id: 3,
            title: "Python Data Structures",
            duration: "25:10",
            completed: false,
            current: false,
            videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
            content:
              "Learn about Python data structures like lists, dictionaries, and sets.",
            resources: [],
            notes: [],
          },
        ],
      },
      {
        id: 2,
        title: "Python Basics",
        lessons: [
          {
            id: 6,
            title: "Numbers and Math Operations",
            duration: "15:20",
            completed: false,
            current: false,
            videoUrl: "https://www.youtube.com/embed/1QXOd2ZQs-Q",
            content:
              "Learn about numbers and mathematical operations in Python.",
            resources: [],
            notes: [],
          },
          // More lessons...
        ],
      },
      // More sections...
    ],
  },
];

const LessonView = () => {
  const { courseId, sectionId, lessonId } = useParams<{
    courseId: string;
    sectionId: string;
    lessonId: string;
  }>();
  const [activeTab, setActiveTab] = useState("content");
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Find course, section, and lesson
  const course = coursesData.find((c) => c.slug === courseId);

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="text-center py-16">
            <Icons.bookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Course not found</h3>
            <p className="text-muted-foreground mb-4">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="outline" asChild>
              <Link to="/courses">Browse All Courses</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const section = course.sections.find(
    (s) => s.id === parseInt(sectionId || "0", 10)
  );

  if (!section) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="text-center py-16">
            <Icons.bookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Section not found</h3>
            <p className="text-muted-foreground mb-4">
              The section you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="outline" asChild>
              <Link to={`/courses/${courseId}`}>Return to Course</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const lesson = section.lessons.find(
    (l) => l.id === parseInt(lessonId || "0", 10)
  );

  if (!lesson) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="text-center py-16">
            <Icons.bookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Lesson not found</h3>
            <p className="text-muted-foreground mb-4">
              The lesson you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="outline" asChild>
              <Link to={`/courses/${courseId}/sections/${sectionId}`}>
                Return to Section
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate the previous and next lessons
  let prevLesson = null;
  let nextLesson = null;

  // Find the current lesson index within the section
  const currentLessonIndex = section.lessons.findIndex(
    (l) => l.id === lesson.id
  );

  if (currentLessonIndex > 0) {
    // Previous lesson in the same section
    prevLesson = {
      section: section,
      lesson: section.lessons[currentLessonIndex - 1],
    };
  } else if (course.sections.findIndex((s) => s.id === section.id) > 0) {
    // Last lesson of the previous section
    const prevSectionIndex =
      course.sections.findIndex((s) => s.id === section.id) - 1;
    const prevSection = course.sections[prevSectionIndex];
    prevLesson = {
      section: prevSection,
      lesson: prevSection.lessons[prevSection.lessons.length - 1],
    };
  }

  if (currentLessonIndex < section.lessons.length - 1) {
    // Next lesson in the same section
    nextLesson = {
      section: section,
      lesson: section.lessons[currentLessonIndex + 1],
    };
  } else if (
    course.sections.findIndex((s) => s.id === section.id) <
    course.sections.length - 1
  ) {
    // First lesson of the next section
    const nextSectionIndex =
      course.sections.findIndex((s) => s.id === section.id) + 1;
    const nextSection = course.sections[nextSectionIndex];
    nextLesson = {
      section: nextSection,
      lesson: nextSection.lessons[0],
    };
  }

  // Calculate course progress - for demo just use a fixed percentage
  const courseProgress = 15;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="text-sm mb-2">
              <span className="text-gray-500">Course: </span>
              <Link
                to={`/courses/${courseId}`}
                className="text-brand-500 hover:underline"
              >
                {course.title}
              </Link>
              <span className="text-gray-500"> / Section: </span>
              <Link
                to={`/courses/${courseId}/sections/${sectionId}`}
                className="text-brand-500 hover:underline"
              >
                {section.title}
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {lesson.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                  <iframe
                    src={lesson.videoUrl}
                    title={lesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm">
                        <Icons.check className="mr-2 h-4 w-4" />
                        Mark as Complete
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icons.clock className="mr-2 h-4 w-4" />
                        {lesson.duration}
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      {prevLesson && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={`/courses/${courseId}/sections/${prevLesson.section.id}/lessons/${prevLesson.lesson.id}`}
                          >
                            <Icons.arrowLeft className="mr-2 h-4 w-4" />
                            Previous
                          </Link>
                        </Button>
                      )}
                      {nextLesson && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={`/courses/${courseId}/sections/${nextLesson.section.id}/lessons/${nextLesson.lesson.id}`}
                          >
                            Next
                            <Icons.arrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  <Tabs
                    defaultValue="content"
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content">
                      <div
                        className="prose prose-blue max-w-none"
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                      ></div>

                      <div className="mt-8 flex justify-between items-center">
                        <div>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setIsAIAssistantOpen(!isAIAssistantOpen)
                            }
                          >
                            <Icons.search className="mr-2 h-4 w-4" />
                            {isAIAssistantOpen
                              ? "Hide AI Assistant"
                              : "Ask AI Assistant"}
                          </Button>
                        </div>

                        <div className="flex space-x-2">
                          {prevLesson && (
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                to={`/courses/${courseId}/sections/${prevLesson.section.id}/lessons/${prevLesson.lesson.id}`}
                              >
                                <Icons.arrowLeft className="mr-2 h-4 w-4" />
                                Previous Lesson
                              </Link>
                            </Button>
                          )}
                          {nextLesson && (
                            <Button size="sm" asChild>
                              <Link
                                to={`/courses/${courseId}/sections/${nextLesson.section.id}/lessons/${nextLesson.lesson.id}`}
                              >
                                Next Lesson
                                <Icons.arrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="resources">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          Lesson Resources
                        </h3>
                        {lesson.resources && lesson.resources.length > 0 ? (
                          lesson.resources.map((resource) => (
                            <Card key={resource.id}>
                              <CardHeader className="py-4">
                                <CardTitle className="text-lg flex items-center">
                                  {resource.type === "pdf" && (
                                    <Icons.file className="mr-2 h-5 w-5 text-red-500" />
                                  )}
                                  {resource.type === "zip" && (
                                    <Icons.file className="mr-2 h-5 w-5 text-blue-500" />
                                  )}
                                  {resource.title}
                                </CardTitle>
                                <CardDescription>
                                  {resource.type.toUpperCase()} file
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <Button variant="outline" asChild>
                                  <a href={resource.url} download>
                                    Download
                                  </a>
                                </Button>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <p className="text-muted-foreground">
                            No resources available for this lesson.
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="notes">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-semibold text-gray-900">
                            My Notes
                          </h3>
                          <Button size="sm" variant="outline">
                            <Icons.plus className="mr-2 h-4 w-4" />
                            Add Note
                          </Button>
                        </div>

                        {lesson.notes && lesson.notes.length > 0 ? (
                          <div className="space-y-4">
                            {lesson.notes.map((note) => (
                              <div
                                key={note.id}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                    {note.timestamp}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <Icons.trash className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </div>
                                <p className="text-gray-700">{note.content}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <Icons.file className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                              No notes yet
                            </h4>
                            <p className="text-gray-500 mb-4">
                              Add notes while watching the lesson to highlight
                              important points.
                            </p>
                            <Button variant="outline">
                              <Icons.plus className="mr-2 h-4 w-4" />
                              Add Your First Note
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Course Progress
                </h3>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Your progress</span>
                    <span className="font-medium text-gray-900">
                      {courseProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-brand-500 h-2.5 rounded-full"
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 mb-3">
                  Course Curriculum
                </h4>
                <div className="max-h-[400px] overflow-y-auto pr-2">
                  <Accordion
                    type="multiple"
                    defaultValue={course.sections.map(
                      (section) => `section-${section.id}`
                    )}
                    className="w-full space-y-3"
                  >
                    {course.sections.map((currSection) => (
                      <AccordionItem
                        key={currSection.id}
                        value={`section-${currSection.id}`}
                        className="border rounded-md overflow-hidden bg-gray-50"
                      >
                        <AccordionTrigger className="px-4 py-3 text-left hover:no-underline">
                          <span className="font-medium text-gray-900">
                            {currSection.title}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 py-0">
                          <ul className="divide-y">
                            {currSection.lessons.map((currLesson) => (
                              <li
                                key={currLesson.id}
                                className={`px-4 py-3 flex justify-between items-center ${
                                  currSection.id ===
                                    parseInt(sectionId || "0", 10) &&
                                  currLesson.id ===
                                    parseInt(lessonId || "0", 10)
                                    ? "bg-brand-50 border-l-4 border-brand-500"
                                    : ""
                                }`}
                              >
                                <Link
                                  to={`/courses/${courseId}/sections/${currSection.id}/lessons/${currLesson.id}`}
                                  className="flex items-center flex-1"
                                >
                                  <div className="flex items-center">
                                    {currLesson.completed ? (
                                      <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center mr-3">
                                        <Icons.check className="h-3 w-3 text-white" />
                                      </div>
                                    ) : currSection.id ===
                                        parseInt(sectionId || "0", 10) &&
                                      currLesson.id ===
                                        parseInt(lessonId || "0", 10) ? (
                                      <div className="w-5 h-5 border-2 border-brand-500 rounded-full mr-3"></div>
                                    ) : (
                                      <div className="w-5 h-5 border border-gray-300 rounded-full mr-3"></div>
                                    )}
                                    <span
                                      className={`text-sm ${
                                        currSection.id ===
                                          parseInt(sectionId || "0", 10) &&
                                        currLesson.id ===
                                          parseInt(lessonId || "0", 10)
                                          ? "font-medium text-brand-700"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {currLesson.title}
                                    </span>
                                  </div>
                                </Link>
                                <span className="text-xs text-gray-500">
                                  {currLesson.duration}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button className="w-full" variant="outline">
                    <Icons.search className="mr-2 h-4 w-4" />
                    Ask Questions in Community
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AI3DAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        lessonContext="Python variables"
      />
    </Layout>
  );
};

export default LessonView;
