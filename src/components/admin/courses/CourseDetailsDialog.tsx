import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Clock,
  ExternalLink,
  Eye,
  File,
  FileText,
  Layers,
  Star,
  Video,
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  slug: string;
  instructor: string;
  instructorId: number;
  category: string;
  price: number;
  status: string;
  rating: string;
  students: number;
  createdAt: string;
  description: string;
  thumbnailUrl: string;
  promoVideoUrl: string;
  curriculum: Array<{
    id: number;
    title: string;
    lessons: Array<{
      id: number;
      title: string;
      duration: string;
      type: string;
      isPreview: boolean;
      videoUrl?: string;
      content?: string;
      questions?: Array<any>;
    }>;
  }>;
}

interface CourseDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  onViewLesson: (lessonId: number, courseId: number) => void;
}

const CourseDetailsDialog: React.FC<CourseDetailsDialogProps> = ({
  open,
  onOpenChange,
  course,
  onViewLesson,
}) => {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Course Details</DialogTitle>
          <DialogDescription>
            Detailed information about the course.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            <div className="rounded-lg overflow-hidden">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-auto object-cover"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold">{course.title}</h2>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div>By {course.instructor}</div>
                <div>Created on {course.createdAt}</div>
                <div
                  className={`flex items-center ${
                    course.status === 'PUBLISHED'
                      ? 'text-green-500'
                      : course.status === 'PENDING'
                      ? 'text-yellow-500'
                      : course.status === 'REJECTED'
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  <span
                    className={`mr-1 h-2 w-2 rounded-full ${
                      course.status === 'PUBLISHED'
                        ? 'bg-green-500'
                        : course.status === 'PENDING'
                        ? 'bg-yellow-500'
                        : course.status === 'REJECTED'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  ></span>
                  {course.status}
                </div>
              </div>
            </div>

            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Course Info</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 pt-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{course.category}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Price</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>${course.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{course.rating}/5</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Enrolled Students
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{course.students.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4 pt-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Course Curriculum
                  </h3>
                  <div className="space-y-4">
                    {course.curriculum.map((section) => (
                      <Card key={section.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center space-x-2">
                            <Layers className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-base">
                              {section.title}
                            </CardTitle>
                          </div>
                          <CardDescription>
                            {section.lessons.length} lessons &bull;{' '}
                            {section.lessons.reduce((total, lesson) => {
                              if (lesson.duration.includes(':')) {
                                const [mins, secs] = lesson.duration
                                  .split(':')
                                  .map(Number);
                                return total + mins * 60 + secs;
                              }
                              return total;
                            }, 0) / 60}{' '}
                            min
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-1">
                          <div className="space-y-2">
                            {section.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="border rounded-md p-3 flex justify-between items-center"
                              >
                                <div className="flex items-center space-x-3">
                                  {lesson.type === 'VIDEO' && (
                                    <Video className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  {lesson.type === 'TEXT' && (
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  {lesson.type === 'QUIZ' && (
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  {!lesson.type && (
                                    <File className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <div>
                                    <p className="font-medium">
                                      {lesson.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {lesson.duration} •{' '}
                                      {lesson.type || 'LESSON'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {lesson.isPreview && (
                                    <div className="text-xs px-2 py-1 bg-secondary rounded-full">
                                      Preview
                                    </div>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      onViewLesson(lesson.id, course.id)
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Statistics</CardTitle>
                    <CardDescription>
                      Performance metrics for this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Enrollments:
                        </span>
                        <span className="font-medium">
                          {course.students.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Average Rating:
                        </span>
                        <span className="font-medium">{course.rating}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Revenue:
                        </span>
                        <span className="font-medium">
                          $
                          {(
                            course.students *
                            course.price *
                            0.7
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Completion Rate:
                        </span>
                        <span className="font-medium">
                          {Math.floor(Math.random() * 30) + 50}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Average Time to Complete:
                        </span>
                        <span className="font-medium">
                          {Math.floor(Math.random() * 20) + 10} days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        <DialogFooter className="space-x-2">
          <Button
            variant="outline"
            onClick={() => window.open(`/courses/${course.slug}`, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" /> Preview Course
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailsDialog;
