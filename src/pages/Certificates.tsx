import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Certificate } from "@/components/certificates/Certificate";
import { Icons } from "@/components/common/Icons";
import { format } from "date-fns";
import { File } from "lucide-react";

interface CompletedCourse {
  id: number;
  title: string;
  instructor: string;
  image: string;
  progress: number;
  completionDate: Date;
  certificateId: string;
}

const Certificates = () => {
  const [selectedCertificate, setSelectedCertificate] =
    useState<CompletedCourse | null>(null);
  const [certificateOpen, setCertificateOpen] = useState(false);

  // Mock data for completed courses
  const completedCourses: CompletedCourse[] = [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "Jane Smith",
      image: "https://via.placeholder.com/400x225",
      progress: 100,
      completionDate: new Date(2025, 2, 15),
      certificateId: "CERT-AR-20250315-001",
    },
    {
      id: 2,
      title: "TypeScript Masterclass",
      instructor: "John Doe",
      image: "https://via.placeholder.com/400x225",
      progress: 100,
      completionDate: new Date(2025, 1, 22),
      certificateId: "CERT-TM-20250222-002",
    },
    {
      id: 3,
      title: "UX/UI Design Fundamentals",
      instructor: "Sarah Johnson",
      image: "https://via.placeholder.com/400x225",
      progress: 100,
      completionDate: new Date(2025, 0, 10),
      certificateId: "CERT-UX-20250110-003",
    },
  ];

  const inProgressCourses: CompletedCourse[] = [
    {
      id: 4,
      title: "Data Science & Machine Learning",
      instructor: "Michael Brown",
      image: "https://via.placeholder.com/400x225",
      progress: 75,
      completionDate: new Date(),
      certificateId: "",
    },
    {
      id: 5,
      title: "Cloud Computing Masterclass",
      instructor: "Alex Chen",
      image: "https://via.placeholder.com/400x225",
      progress: 45,
      completionDate: new Date(),
      certificateId: "",
    },
  ];

  const viewCertificate = (course: CompletedCourse) => {
    setSelectedCertificate(course);
    setCertificateOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Chứng nhận của tôi</h1>
          <p className="text-muted-foreground">
            Xem và tải xuống chứng nhận hoàn thành khóa học của bạn
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="completed" className="mb-8">
            <TabsList className="mb-8">
              <TabsTrigger value="completed">
                Đã hoàn thành ({completedCourses.length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                Đang học ({inProgressCourses.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onViewCertificate={() => viewCertificate(course)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="in-progress">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map((course) => (
                  <CourseCard key={course.id} course={course} isInProgress />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Certificate Dialog */}
      {selectedCertificate && (
        <Dialog open={certificateOpen} onOpenChange={setCertificateOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chứng chỉ hoàn thành khóa học</DialogTitle>
              <DialogDescription>
                Chứng chỉ của bạn cho khóa học {selectedCertificate.title}
              </DialogDescription>
            </DialogHeader>

            <Certificate
              studentName="Nguyễn Văn A"
              courseName={selectedCertificate.title}
              instructorName={selectedCertificate.instructor}
              completionDate={format(
                selectedCertificate.completionDate,
                "dd/MM/yyyy"
              )}
              certificateId={selectedCertificate.certificateId}
            />
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

// Course Card Component
interface CourseCardProps {
  course: CompletedCourse;
  isInProgress?: boolean;
  onViewCertificate?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isInProgress = false,
  onViewCertificate,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {!isInProgress && (
          <div className="absolute top-3 right-3">
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Hoàn thành
            </div>
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <CardDescription>Giảng viên: {course.instructor}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {isInProgress ? (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span>Tiến độ</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </>
        ) : (
          <div className="flex items-center text-sm text-muted-foreground">
            <Icons.calendar className="h-4 w-4 mr-1" />
            <span>
              Hoàn thành: {format(course.completionDate, "dd/MM/yyyy")}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {isInProgress ? (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => (window.location.href = `/courses/${course.id}`)}
          >
            Tiếp tục học
          </Button>
        ) : (
          <Button className="w-full" onClick={onViewCertificate}>
            <File className="h-4 w-4 mr-2" />
            Xem chứng chỉ
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Certificates;
