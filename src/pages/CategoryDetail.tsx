
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/common/Icons';
import CourseCard from '@/components/courses/CourseCard';
import { useState } from 'react';

// Use the same mock data from Courses.tsx
const coursesData = [
  {
    id: 1,
    title: 'Complete Python Bootcamp: From Zero to Hero',
    slug: 'complete-python-bootcamp',
    instructor: 'John Smith',
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
  // Include more courses with different categoryIds
];

// Categories for reference
const categoriesData = [
  { id: 1, name: 'Programming', coursesCount: 42, imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
  { id: 2, name: 'Design', coursesCount: 38, imageUrl: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
  { id: 4, name: 'Marketing', coursesCount: 25, imageUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
  { id: 5, name: 'Photography', coursesCount: 18, imageUrl: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
  { id: 11, name: 'Finance', coursesCount: 19, imageUrl: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
  { id: 12, name: '3D & Animation', coursesCount: 11, imageUrl: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80' },
];

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Find the category
  const categoryId = parseInt(id || '0', 10);
  const category = categoriesData.find(cat => cat.id === categoryId);
  
  // Filter courses for this category
  const categoryCourses = coursesData
    .filter(course => course.categoryId === categoryId)
    .filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="text-center py-16">
            <Icons.search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Category not found</h3>
            <p className="text-muted-foreground mb-4">
              The category you're looking for doesn't exist or has been removed.
            </p>
            <Button variant="outline" asChild>
              <Link to="/categories">Browse All Categories</Link>
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
            <Link to="/categories" className="text-brand-500 hover:underline flex items-center">
              <Icons.arrowLeft className="h-4 w-4 mr-1" />
              All Categories
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{category.name} Courses</h1>
            <p className="text-muted-foreground">
              Explore our collection of {category.coursesCount} courses in {category.name}.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={`Search ${category.name} courses...`} 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {categoryCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryCourses.map(course => (
                <Link key={course.id} to={`/courses/${course.slug}`}>
                  <CourseCard course={course} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Icons.search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search query or check back later for new courses.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryDetail;
