import { useState } from "react";
import { Link } from "react-router-dom";
import InstructorLayout from "@/components/layout/InstructorLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Edit, Eye, Plus, Search, Star, Users } from "lucide-react";

// Mock data for demonstration
const mockCourses = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: `Course ${i + 1}: Learn Something Amazing`,
  slug: `course-${i + 1}-learn-something-amazing`,
  thumbnail: `https://funix.edu.vn/wp-content/uploads/2023/02/cung-cap-đay-đu-kien-thuc-va-ky-nang-co-ban.jpg`,
  students: Math.floor(Math.random() * 5000),
  rating: (Math.random() * 3 + 2).toFixed(1),
  revenue: Math.floor(Math.random() * 10000),
  price: Math.floor(Math.random() * 150) + 9.99,
  status: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"][i % 4],
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split("T")[0],
}));

const InstructorCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter courses based on search and active tab
  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      course.status.toLowerCase() === activeTab.toLowerCase();

    return matchesSearch && matchesTab;
  });

  return (
    <InstructorLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <Link to="/instructor/courses/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Course
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search your courses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs
            defaultValue="all"
            className="w-full md:w-auto"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-4 md:grid-cols-4 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <CoursesGrid courses={filteredCourses} />
            </TabsContent>

            <TabsContent value="published" className="mt-6">
              <CoursesGrid
                courses={filteredCourses.filter(
                  (course) => course.status === "PUBLISHED"
                )}
              />
            </TabsContent>

            <TabsContent value="draft" className="mt-6">
              <CoursesGrid
                courses={filteredCourses.filter(
                  (course) => course.status === "DRAFT"
                )}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <CoursesGrid
                courses={filteredCourses.filter(
                  (course) => course.status === "PENDING"
                )}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </InstructorLayout>
  );
};

// Extracted component for courses grid
const CoursesGrid = ({ courses }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id}>
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-2 right-2 bg-background/80 text-foreground rounded px-2 py-1 text-xs font-medium">
              ${course.price.toFixed(2)}
            </div>
            <div
              className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                course.status === "PUBLISHED"
                  ? "bg-green-500/90 text-white"
                  : course.status === "PENDING"
                  ? "bg-yellow-500/90 text-white"
                  : course.status === "REJECTED"
                  ? "bg-red-500/90 text-white"
                  : "bg-gray-500/90 text-white"
              }`}
            >
              {course.status}
            </div>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-2 text-base">
              {course.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{course.students} students</span>
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className="font-medium">Revenue:</span> $
              {course.revenue.toLocaleString()}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link to={`/instructor/courses/${course.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </Link>
            <Link to={`/courses/${course.slug}`}>
              <Button variant="ghost" size="sm">
                <Eye className="mr-2 h-4 w-4" /> Preview
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}

      {/* Create New Course Card */}
      <Card className="flex flex-col items-center justify-center border-dashed text-center h-full min-h-[300px]">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Book className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Create a New Course</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your knowledge with students from around the world
          </p>
        </CardContent>
        <CardFooter>
          <Link to="/instructor/courses/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Course
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InstructorCourses;
