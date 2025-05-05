import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/common/Icons";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import FreePreviewModal from "@/components/courses/FreePreviewModal";

// Keep the existing interfaces (Instructor, Lesson, Section, Review, Course)
interface Instructor {
  id: number;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  coursesCount: number;
  studentsCount: number;
  rating: number;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: "video" | "text" | "quiz";
  isFree: boolean;
  videoUrl?: string;
}

interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Review {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
}

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  requirements: string[];
  outcomes: string[];
  level: string;
  category: string;
  language: string;
  thumbnail: string;
  videoUrl: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  totalLessons: number;
  updatedAt: string;
  instructor: Instructor;
  sections: Section[];
  reviews: Review[];
  rating: number;
  reviewCount: number;
  studentsCount: number;
}

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set()
  );
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  // Mock user enrolled state - in a real app, fetch this from user context or API
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Mock API call - would be replaced with real API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock course data
        const mockCourse: Course = {
          id: 1,
          title: "Complete Web Development Bootcamp 2023",
          slug: "web-development-bootcamp",
          description:
            "Learn web development from scratch with HTML, CSS, JavaScript, React, Node and more!",
          longDescription:
            "This comprehensive course will take you from beginner to advanced developer. You'll learn to build responsive websites, create dynamic web applications, work with databases, and deploy your projects to the web. This course is constantly updated with new content.",
          requirements: [
            "No prior programming knowledge needed - we'll teach you everything from scratch",
            "A computer with internet access",
            "Willingness to learn and practice",
          ],
          outcomes: [
            "Build responsive websites with HTML5, CSS3, and JavaScript",
            "Create full-stack web applications with React, Node.js, Express, and MongoDB",
            "Deploy your applications to the cloud",
            "Understand web development fundamentals and best practices",
            "Develop professional problem-solving skills",
            "Work with REST APIs and integrate third-party services",
          ],
          level: "All Levels",
          category: "Web Development",
          language: "English",
          thumbnail:
            "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D",
          videoUrl:
            "https://www.youtube.com/embed/Tn6-PIqc4UM?si=AYalstMZBeGzMUXL",
          price: 94.99,
          discountedPrice: 15.99,
          duration: "65 hours",
          totalLessons: 425,
          updatedAt: "2023-11-15",
          rating: 4.8,
          reviewCount: 24890,
          studentsCount: 105350,
          instructor: {
            id: 1,
            name: "Dr. Angela Yu",
            avatar:
              "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2Zlc3Npb25hbCUyMHdvbWFufGVufDB8fDB8fHww",
            title: "Lead Developer & Instructor",
            bio: "Dr. Angela Yu is a developer and lead instructor at the London App Brewery. She's taught over 1 million students how to code and many have gone on to change their lives by becoming professional developers or starting their own tech startup. Her teaching style is fun and engaging, breaking down complex concepts into digestible bits of information.",
            coursesCount: 12,
            studentsCount: 1500000,
            rating: 4.9,
          },
          sections: [
            {
              id: 1,
              title: "Introduction to Web Development",
              lessons: [
                {
                  id: 1,
                  title: "Course Overview",
                  duration: "5:22",
                  type: "video",
                  isFree: true,
                  videoUrl:
                    "https://www.youtube.com/embed/Tn6-PIqc4UM?si=AYalstMZBeGzMUXL",
                },
                {
                  id: 2,
                  title: "How the Internet Works",
                  duration: "12:45",
                  type: "video",
                  isFree: true,
                },
                {
                  id: 3,
                  title: "Setting Up Your Development Environment",
                  duration: "18:30",
                  type: "video",
                  isFree: false,
                },
              ],
            },
            {
              id: 2,
              title: "HTML Fundamentals",
              lessons: [
                {
                  id: 4,
                  title: "HTML Document Structure",
                  duration: "14:20",
                  type: "video",
                  isFree: false,
                },
                {
                  id: 5,
                  title: "Working with Text Elements",
                  duration: "22:15",
                  type: "video",
                  isFree: false,
                },
                {
                  id: 6,
                  title: "HTML Quiz",
                  duration: "15:00",
                  type: "quiz",
                  isFree: false,
                },
              ],
            },
            {
              id: 3,
              title: "CSS Styling",
              lessons: [
                {
                  id: 7,
                  title: "CSS Syntax and Selectors",
                  duration: "18:45",
                  type: "video",
                  isFree: false,
                },
                {
                  id: 8,
                  title: "Box Model Explained",
                  duration: "20:10",
                  type: "video",
                  isFree: false,
                },
                {
                  id: 9,
                  title: "CSS Layout and Positioning",
                  duration: "25:30",
                  type: "video",
                  isFree: false,
                },
                {
                  id: 10,
                  title: "Flexbox and Grid",
                  duration: "28:15",
                  type: "video",
                  isFree: false,
                },
              ],
            },
          ],
          reviews: [
            {
              id: 1,
              user: {
                name: "Michael Thompson",
                avatar:
                  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww",
              },
              rating: 5,
              comment:
                "This course is absolutely incredible! I started with zero knowledge and now I'm building my own websites. The instructor explains everything clearly and the projects are fun and engaging.",
              date: "2023-10-15",
            },
            {
              id: 2,
              user: {
                name: "Sarah Johnson",
                avatar:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww",
              },
              rating: 4,
              comment:
                "Great course with lots of valuable content. The only reason I'm giving 4 stars is that some sections could use a bit more explanation, but overall it's excellent value for the money.",
              date: "2023-09-22",
            },
            {
              id: 3,
              user: {
                name: "David Clark",
                avatar:
                  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
              },
              rating: 5,
              comment:
                "I've taken several coding courses, and this is by far the best one. The instructor makes complex concepts easy to understand, and the course structure builds your knowledge progressively.",
              date: "2023-08-30",
            },
          ],
        };

        setCourse(mockCourse);

        // Mock check if user is enrolled (would use real API)
        // Just for demonstration - toggle this to test the different UI states
        setIsEnrolled(Math.random() > 0.5);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load course details. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, toast]);

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isFree) {
      // For free lessons, open preview modal
      setPreviewLesson(lesson);
      setIsPreviewModalOpen(true);
    } else if (isEnrolled) {
      // For enrolled users, navigate to course taking page
      navigate(`/learn/${slug}/lessons/${lesson.id}`);
    } else {
      // For non-enrolled users, prompt to buy
      toast({
        title: "Content locked",
        description: "Purchase this course to access this lesson",
        variant: "default",
      });
    }
  };

  const handleAddToCart = () => {
    if (course) {
      addItem({
        id: course.id,
        title: course.title,
        price: course.price,
        discountedPrice: course.discountedPrice,
        instructor: course.instructor.name,
        thumbnail: course.thumbnail,
        slug: course.slug,
      });
    }
  };

  const handleBuyNow = () => {
    if (course) {
      // Add to cart first
      addItem({
        id: course.id,
        title: course.title,
        price: course.price,
        discountedPrice: course.discountedPrice,
        instructor: course.instructor.name,
        thumbnail: course.thumbnail,
        slug: course.slug,
      });

      // Then navigate to checkout
      navigate("/checkout");
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

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Course Not Found</h1>
            <p className="mt-4 text-muted-foreground">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="mt-6">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Course Hero Section */}
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Link
                  to={`/categories/${course.category.toLowerCase()}`}
                  className="text-brand-200 hover:text-brand-100 text-sm"
                >
                  {course.category}
                </Link>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 text-sm">{course.level}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-gray-300 mb-4">{course.description}</p>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icons.star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(course.rating)
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-yellow-400 font-medium">
                    {course.rating.toFixed(1)}
                  </span>
                  <span className="ml-1 text-gray-400">
                    ({course.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>

                <div className="mx-4 h-4 border-r border-gray-600"></div>

                <div className="flex items-center text-gray-300">
                  <Icons.user className="h-4 w-4 mr-1" />
                  <span>{course.studentsCount.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <Link
                  to={`/instructors/${course.instructor.id}`}
                  className="flex items-center group"
                >
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="h-10 w-10 rounded-full object-cover mr-2"
                  />
                  <span className="text-brand-300 group-hover:text-brand-200 transition-colors">
                    {course.instructor.name}
                  </span>
                </Link>

                <div className="mx-4 h-4 border-r border-gray-600"></div>

                <div className="flex items-center text-gray-300">
                  <Icons.clock className="h-4 w-4 mr-1" />
                  <span>Last updated: {course.updatedAt}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-800 rounded-lg overflow-hidden shadow-xl">
                <div className="aspect-video relative">
                  <iframe
                    src={course.videoUrl}
                    title={`Preview of ${course.title}`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="p-6">
                  <div className="flex items-end mb-4">
                    <div className="flex-1">
                      {course.discountedPrice ? (
                        <>
                          <p className="text-3xl font-bold">
                            ${course.discountedPrice}
                          </p>
                          <p className="text-gray-400 line-through">
                            ${course.price}
                          </p>
                        </>
                      ) : (
                        <p className="text-3xl font-bold">${course.price}</p>
                      )}
                    </div>

                    {course.discountedPrice && (
                      <Badge
                        variant="destructive"
                        className="text-base px-2 py-1"
                      >
                        {Math.round(
                          (1 - course.discountedPrice / course.price) * 100
                        )}
                        % OFF
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" size="lg" onClick={handleBuyNow}>
                      Buy Now
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={isInCart(course.id)}
                    >
                      {isInCart(course.id) ? (
                        <>
                          <Icons.check className="mr-2 h-4 w-4" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <Icons.shoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="mt-6 text-sm text-gray-300">
                    <div className="flex justify-between mb-2">
                      <span>Full lifetime access</span>
                      <Icons.check className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Access on mobile and TV</span>
                      <Icons.check className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Certificate of completion</span>
                      <Icons.check className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start">
                    <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2">
                {course.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <div className="prose prose-slate max-w-none dark:prose-invert">
                <p>{course.longDescription}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="curriculum">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Course Content</h2>
                <div className="text-sm text-muted-foreground">
                  {course?.sections.length} sections • {course?.totalLessons}{" "}
                  lessons • {course?.duration} total length
                </div>
              </div>

              {isEnrolled && (
                <div className="mb-6">
                  <Button
                    variant="default"
                    onClick={() => navigate(`/learn/${course?.slug}`)}
                    className="flex items-center"
                  >
                    <Icons.play className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                </div>
              )}

              <div className="border rounded-lg divide-y">
                {course?.sections.map((section) => (
                  <div key={section.id} className="overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center">
                        <Icons.chevronRight
                          className={`h-5 w-5 mr-2 transition-transform ${
                            expandedSections.has(section.id) ? "rotate-90" : ""
                          }`}
                        />
                        <h3 className="font-medium">{section.title}</h3>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {section.lessons.length} lessons
                      </div>
                    </button>

                    {expandedSections.has(section.id) && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t pt-2 mt-2">
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between py-3 px-2 hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
                              onClick={() => handleLessonClick(lesson)}
                            >
                              <div className="flex items-center">
                                {lesson.type === "video" ? (
                                  <Icons.video className="h-4 w-4 mr-3 text-muted-foreground" />
                                ) : lesson.type === "quiz" ? (
                                  <Icons.fileText className="h-4 w-4 mr-3 text-muted-foreground" />
                                ) : (
                                  <Icons.fileText className="h-4 w-4 mr-3 text-muted-foreground" />
                                )}
                                <span>{lesson.title}</span>
                                {lesson.isFree && (
                                  <Badge variant="outline" className="ml-2">
                                    Free
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-2">
                                  {lesson.duration}
                                </span>
                                {lesson.isFree ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-brand-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLessonClick(lesson);
                                    }}
                                  >
                                    <Icons.play className="h-4 w-4 mr-1" />
                                    Preview
                                  </Button>
                                ) : isEnrolled ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(
                                        `/learn/${slug}/lessons/${lesson.id}`
                                      );
                                    }}
                                  >
                                    <Icons.play className="h-4 w-4 mr-1" />
                                    Watch
                                  </Button>
                                ) : (
                                  <Icons.lock className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="instructor">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-semibold">
                    {course.instructor.name}
                  </h2>
                  <p className="text-muted-foreground">
                    {course.instructor.title}
                  </p>

                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <Icons.star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{course.instructor.rating} Instructor Rating</span>
                    </div>
                    <div className="flex items-center">
                      <Icons.user className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>
                        {course.instructor.studentsCount.toLocaleString()}{" "}
                        Students
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Icons.bookOpen className="h-4 w-4 text-muted-foreground mr-1" />
                      <span>{course.instructor.coursesCount} Courses</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none dark:prose-invert">
                <p>{course.instructor.bio}</p>
              </div>

              <Button asChild variant="outline">
                <Link to={`/instructors/${course.instructor.id}`}>
                  View Profile
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Student Reviews</h2>
                <div className="flex items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icons.star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(course.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">
                    {course.rating.toFixed(1)} course rating •{" "}
                    {course.reviewCount.toLocaleString()} reviews
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {course.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-start">
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="h-10 w-10 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{review.user.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex mt-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Icons.star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Free Preview Modal */}
      {previewLesson && (
        <FreePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          lesson={{
            title: previewLesson.title,
            videoUrl: previewLesson.videoUrl,
            type: previewLesson.type,
          }}
        />
      )}
    </Layout>
  );
};

export default CourseDetail;
