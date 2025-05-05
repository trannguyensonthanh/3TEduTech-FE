import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/common/Icons";
import { Badge } from "@/components/ui/badge";

interface EnrolledCourse {
  id: number;
  title: string;
  slug: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  lastAccessed?: {
    lessonId: number;
    lessonTitle: string;
    sectionId: number;
  };
  completedLessons: number;
  totalLessons: number;
  category: string;
  level: string;
  dateEnrolled: string;
}

interface Certificate {
  id: number;
  courseId: number;
  courseTitle: string;
  issueDate: string;
  status: "issued" | "pending" | "eligible";
}

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        // Mock data
        const mockCourses: EnrolledCourse[] = [
          {
            id: 1,
            title: "Complete Web Development Bootcamp 2023",
            slug: "web-development-bootcamp",
            instructor: "Dr. Angela Yu",
            thumbnail:
              "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D",
            progress: 68,
            lastAccessed: {
              lessonId: 24,
              lessonTitle: "CSS Grid Layout",
              sectionId: 3,
            },
            completedLessons: 32,
            totalLessons: 47,
            category: "Web Development",
            level: "All Levels",
            dateEnrolled: "2023-09-15",
          },
          {
            id: 2,
            title: "Python for Data Science and Machine Learning",
            slug: "python-data-science",
            instructor: "Jose Portilla",
            thumbnail:
              "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHl0aG9uJTIwcHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D",
            progress: 25,
            lastAccessed: {
              lessonId: 12,
              lessonTitle: "NumPy Arrays",
              sectionId: 2,
            },
            completedLessons: 12,
            totalLessons: 48,
            category: "Data Science",
            level: "Intermediate",
            dateEnrolled: "2023-10-22",
          },
          {
            id: 3,
            title: "React - The Complete Guide 2023",
            slug: "react-complete-guide",
            instructor: "Maximilian Schwarzmüller",
            thumbnail:
              "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhY3R8ZW58MHx8MHx8fDA%3D",
            progress: 100,
            completedLessons: 42,
            totalLessons: 42,
            category: "Web Development",
            level: "Intermediate",
            dateEnrolled: "2023-08-05",
          },
        ];

        const mockCertificates: Certificate[] = [
          {
            id: 1,
            courseId: 3,
            courseTitle: "React - The Complete Guide 2023",
            issueDate: "2023-09-15",
            status: "issued",
          },
          {
            id: 2,
            courseId: 1,
            courseTitle: "Complete Web Development Bootcamp 2023",
            issueDate: "",
            status: "eligible",
          },
        ];

        setEnrolledCourses(mockCourses);
        setCertificates(mockCertificates);
        setLoading(false);
      }, 1500);
    };

    fetchEnrolledCourses();
  }, []);

  const getStatusBadge = (progress: number) => {
    if (progress === 100) {
      return <Badge className="bg-green-600">Completed</Badge>;
    } else if (progress > 0) {
      return <Badge className="bg-amber-600">In Progress</Badge>;
    } else {
      return <Badge className="bg-slate-600">Not Started</Badge>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 flex justify-center">
          <Icons.spinner className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Learning</h1>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Icons.bookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                <h2 className="text-2xl font-semibold">No courses yet</h2>
                <p className="text-muted-foreground">
                  You haven't enrolled in any courses yet.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button asChild>
                          <Link to={`/courses/${course.slug}`}>
                            View Course
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg line-clamp-1">
                            {course.title}
                          </CardTitle>
                          <CardDescription>
                            by {course.instructor}
                          </CardDescription>
                        </div>
                        {getStatusBadge(course.progress)}
                      </div>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-medium">
                            {course.progress}%
                          </span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          {course.completedLessons} of {course.totalLessons}{" "}
                          lessons completed
                        </div>
                      </div>

                      {course.lastAccessed && (
                        <div className="mt-4 bg-muted rounded-md p-3">
                          <div className="text-sm font-medium">
                            Continue Learning:
                          </div>
                          <Link
                            to={`/courses/${course.slug}/sections/${course.lastAccessed.sectionId}/lessons/${course.lastAccessed.lessonId}`}
                            className="text-sm text-brand-600 hover:text-brand-700 flex items-center mt-1"
                          >
                            {course.lastAccessed.lessonTitle}
                            <Icons.arrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter>
                      <Button
                        asChild
                        variant={course.lastAccessed ? "default" : "outline"}
                        className="w-full"
                      >
                        {course.lastAccessed ? (
                          <Link
                            to={`/courses/${course.slug}/sections/${course.lastAccessed.sectionId}/lessons/${course.lastAccessed.lessonId}`}
                          >
                            Continue Learning
                          </Link>
                        ) : (
                          <Link to={`/courses/${course.slug}`}>
                            Start Course
                          </Link>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            {certificates.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Icons.certificate className="h-12 w-12 mx-auto text-muted-foreground" />
                <h2 className="text-2xl font-semibold">No certificates yet</h2>
                <p className="text-muted-foreground">
                  Complete a course to earn a certificate of completion.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/my-courses">Go to My Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {certificates.map((certificate) => (
                  <Card key={certificate.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Icons.certificate className="h-5 w-5 mr-2 text-primary" />
                        <span className="line-clamp-1">
                          {certificate.courseTitle}
                        </span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Status:
                        </span>
                        {certificate.status === "issued" && (
                          <Badge className="bg-green-600">Issued</Badge>
                        )}
                        {certificate.status === "pending" && (
                          <Badge variant="outline">Processing</Badge>
                        )}
                        {certificate.status === "eligible" && (
                          <Badge variant="outline" className="bg-amber-600">
                            Eligible
                          </Badge>
                        )}
                      </div>

                      {certificate.issueDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Issue Date:
                          </span>
                          <span>{certificate.issueDate}</span>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter>
                      {certificate.status === "issued" && (
                        <div className="flex space-x-2 w-full">
                          <Button variant="outline" className="flex-1">
                            <Icons.download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Icons.share className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      )}

                      {certificate.status === "eligible" && (
                        <Button className="w-full">Generate Certificate</Button>
                      )}

                      {certificate.status === "pending" && (
                        <Button disabled className="w-full">
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyCourses;
