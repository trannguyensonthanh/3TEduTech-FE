
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/common/Icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from '@/components/courses/CourseCard';

// Mock instructor data
const instructorsData = [
  {
    id: 1,
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    title: 'Senior Software Engineer',
    bio: 'Senior Software Engineer with 15+ years of experience teaching Python programming. John specializes in making complex programming concepts accessible to beginners and helping intermediate developers level up their skills.',
    rating: 4.8,
    studentsCount: 50432,
    coursesCount: 12,
    reviewsCount: 12850,
    website: 'https://johnsmith.com',
    social: {
      twitter: 'https://twitter.com/johnsmith',
      linkedin: 'https://linkedin.com/in/johnsmith',
      github: 'https://github.com/johnsmith'
    }
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    title: 'UI/UX Design Lead',
    bio: 'Award-winning UI/UX designer with over 10 years of experience creating beautiful and functional user interfaces. Sarah has worked with Fortune 500 companies and startups alike, bringing her expertise to projects of all sizes.',
    rating: 4.7,
    studentsCount: 38250,
    coursesCount: 8,
    reviewsCount: 9560,
    website: 'https://sarahjohnson.design',
    social: {
      twitter: 'https://twitter.com/sarahjohnson',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      dribbble: 'https://dribbble.com/sarahjohnson'
    }
  }
];

// Mock courses data (filtered by instructor in the component)
const coursesData = [
  {
    id: 1,
    title: 'Complete Python Bootcamp: From Zero to Hero',
    slug: 'complete-python-bootcamp',
    instructor: 'John Smith',
    instructorId: 1,
    rating: 4.8,
    reviewCount: 2450,
    price: 99.99,
    discountedPrice: 49.99,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    level: 'Beginner',
    categoryId: 1,
    category: 'Programming',
    duration: '12 hours',
    lessonCount: 48,
  },
  {
    id: 2,
    title: 'UI/UX Design Masterclass',
    slug: 'ui-ux-design-masterclass',
    instructor: 'Sarah Johnson',
    instructorId: 2,
    rating: 4.7,
    reviewCount: 1823,
    price: 129.99,
    discountedPrice: 69.99,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    level: 'Intermediate',
    categoryId: 2,
    category: 'Design',
    duration: '15 hours',
    lessonCount: 65,
  },
  {
    id: 3,
    title: 'Advanced Python Programming',
    slug: 'advanced-python-programming',
    instructor: 'John Smith',
    instructorId: 1,
    rating: 4.9,
    reviewCount: 1950,
    price: 129.99,
    discountedPrice: 64.99,
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    level: 'Advanced',
    categoryId: 1,
    category: 'Programming',
    duration: '18 hours',
    lessonCount: 56,
  }
];

// Mock reviews data
const reviewsData = [
  {
    id: 1,
    instructorId: 1,
    userName: 'Michael Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    rating: 5,
    date: '2023-09-15',
    course: 'Complete Python Bootcamp',
    content: 'John is an incredible instructor. The way he explains complex concepts in simple terms helped me grasp Python quickly. Highly recommended!'
  },
  {
    id: 2,
    instructorId: 1,
    userName: 'Emma Wilson',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    rating: 4,
    date: '2023-08-22',
    course: 'Advanced Python Programming',
    content: 'Great advanced course that really improved my Python skills. John has a talent for making even the most complicated topics understandable.'
  },
  {
    id: 3,
    instructorId: 2,
    userName: 'David Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    rating: 5,
    date: '2023-09-01',
    course: 'UI/UX Design Masterclass',
    content: 'Sarah is phenomenal! Her course transformed my design skills and helped me land a job in the industry. The projects and feedback were invaluable.'
  }
];

const InstructorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const instructorId = parseInt(id || '0', 10);
  
  // Find instructor
  const instructor = instructorsData.find(i => i.id === instructorId);
  
  // Filter courses and reviews for this instructor
  const instructorCourses = coursesData.filter(course => course.instructorId === instructorId);
  const instructorReviews = reviewsData.filter(review => review.instructorId === instructorId);

  if (!instructor) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="text-center py-16">
            <Icons.user className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Instructor not found</h3>
            <p className="text-muted-foreground mb-4">
              The instructor you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="outline" asChild>
              <Link to="/instructors">Browse All Instructors</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Link to="/instructors" className="text-brand-500 hover:underline flex items-center">
              <Icons.arrowLeft className="h-4 w-4 mr-1" />
              All Instructors
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-1/3 lg:w-1/4 p-6 flex flex-col items-center justify-center">
                <img 
                  src={instructor.avatar} 
                  alt={instructor.name}
                  className="w-40 h-40 rounded-full object-cover mb-4"
                />
                <h1 className="text-2xl font-bold text-center">{instructor.name}</h1>
                <p className="text-muted-foreground text-center">{instructor.title}</p>
                
                <div className="flex items-center justify-center mt-3 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Icons.star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(instructor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {instructor.rating}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full mt-2">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{instructor.coursesCount}</div>
                    <div className="text-xs text-muted-foreground">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{instructor.studentsCount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{instructor.reviewsCount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  {instructor.social.twitter && (
                    <a href={instructor.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-500">
                      <Icons.twitter className="h-5 w-5" />
                    </a>
                  )}
                  {instructor.social.linkedin && (
                    <a href={instructor.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-500">
                      <Icons.user className="h-5 w-5" />
                    </a>
                  )}
                  {instructor.social.github && (
                    <a href={instructor.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-500">
                      <Icons.github className="h-5 w-5" />
                    </a>
                  )}
                  {instructor.website && (
                    <a href={instructor.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-500">
                      <Icons.globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="md:w-2/3 lg:w-3/4 p-6 border-t md:border-t-0 md:border-l">
                <Tabs defaultValue="about">
                  <TabsList className="mb-6">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about">
                    <h2 className="text-xl font-semibold mb-4">About {instructor.name}</h2>
                    <p className="text-gray-700 mb-6">{instructor.bio}</p>
                    
                    <h3 className="text-lg font-medium mb-3">Expertise</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {instructor.id === 1 ? (
                        <>
                          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Python</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Web Development</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Machine Learning</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Data Science</span>
                        </>
                      ) : (
                        <>
                          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">UI Design</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">UX Research</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Figma</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">Web Design</span>
                        </>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-medium mb-3">Experience</h3>
                    <div className="space-y-4">
                      {instructor.id === 1 ? (
                        <>
                          <div>
                            <p className="font-medium">Senior Software Engineer at Tech Solutions Inc.</p>
                            <p className="text-sm text-muted-foreground">2015 - Present</p>
                          </div>
                          <div>
                            <p className="font-medium">Lead Developer at InnovateTech</p>
                            <p className="text-sm text-muted-foreground">2010 - 2015</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="font-medium">UI/UX Design Lead at DesignStudio</p>
                            <p className="text-sm text-muted-foreground">2017 - Present</p>
                          </div>
                          <div>
                            <p className="font-medium">Senior Designer at CreativeWeb</p>
                            <p className="text-sm text-muted-foreground">2013 - 2017</p>
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="courses">
                    <h2 className="text-xl font-semibold mb-4">Courses by {instructor.name}</h2>
                    {instructorCourses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {instructorCourses.map(course => (
                          <Link key={course.id} to={`/courses/${course.slug}`}>
                            <CourseCard course={course} />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No courses available at the moment.</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <h2 className="text-xl font-semibold mb-4">Student Reviews</h2>
                    {instructorReviews.length > 0 ? (
                      <div className="space-y-6">
                        {instructorReviews.map(review => (
                          <div key={review.id} className="border-b pb-6">
                            <div className="flex items-start mb-3">
                              <img 
                                src={review.userAvatar} 
                                alt={review.userName}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium">{review.userName}</h4>
                                  <span className="mx-2 text-gray-300">•</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Icons.star 
                                        key={i} 
                                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {review.course} • {review.date}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No reviews available yet.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InstructorDetail;
