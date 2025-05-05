
import { Button } from "@/components/ui/button";
import { Icons } from '../common/Icons';
import CourseCard, { CourseType } from '../courses/CourseCard';

// Sample featured courses data
const featuredCourses: CourseType[] = [
  {
    id: 1,
    title: 'Complete Python Bootcamp: From Zero to Hero',
    slug: 'complete-python-bootcamp',
    instructor: 'John Smith',
    rating: 4.8,
    reviewCount: 2450,
    price: 99.99,
    discountedPrice: 49.99,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    level: 'Beginner',
    duration: '48 hours',
    lessonCount: 72
  },
  {
    id: 2,
    title: 'Machine Learning A-Z: Hands-On Python & R',
    slug: 'machine-learning-a-z',
    instructor: 'Emily Chen',
    rating: 4.7,
    reviewCount: 1830,
    price: 129.99,
    discountedPrice: 59.99,
    thumbnail: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    level: 'Intermediate',
    duration: '60 hours',
    lessonCount: 85
  },
  {
    id: 3,
    title: 'The Complete Digital Marketing Course',
    slug: 'complete-digital-marketing',
    instructor: 'David Johnson',
    rating: 4.6,
    reviewCount: 1420,
    price: 89.99,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    level: 'All Levels',
    duration: '52 hours',
    lessonCount: 68
  },
  {
    id: 4,
    title: 'UI/UX Design Bootcamp: Adobe XD & Figma',
    slug: 'ui-ux-design-bootcamp',
    instructor: 'Sarah Williams',
    rating: 4.9,
    reviewCount: 950,
    price: 109.99,
    discountedPrice: 54.99,
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    level: 'Beginner',
    duration: '40 hours',
    lessonCount: 60
  }
];

const FeaturedCourses = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
            <p className="mt-2 text-xl text-gray-600">
              Handpicked courses to get you started on your learning journey
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Courses
            <Icons.arrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        
        <div className="mt-10 flex justify-center md:hidden">
          <Button>
            View All Courses
            <Icons.arrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
