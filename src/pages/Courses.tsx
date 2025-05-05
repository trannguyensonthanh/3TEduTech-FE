
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, ChevronDown, Filter, Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data for courses
const mockCourses = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  title: `Course ${i + 1}: The Complete Guide to Something Amazing`,
  slug: `course-${i + 1}-complete-guide-something-amazing`,
  instructor: `Instructor ${Math.floor(i / 3) + 1}`,
  instructorId: Math.floor(i / 3) + 1,
  thumbnail: `https://via.placeholder.com/640x360?text=Course+${i + 1}`,
  category: ['Web Development', 'Data Science', 'Digital Marketing', 'UI/UX Design'][i % 4],
  subcategory: ['Frontend', 'Backend', 'Machine Learning', 'SEO', 'Analytics'][i % 5],
  level: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'][i % 4],
  language: ['English', 'Spanish', 'French', 'German'][i % 4],
  price: Math.random() > 0.2 ? Math.floor(Math.random() * 150) + 9.99 : 0,
  discount: Math.random() > 0.7 ? Math.floor(Math.random() * 70) + 10 : 0,
  duration: `${Math.floor(Math.random() * 20) + 5} hours`,
  rating: (4 + Math.random()).toFixed(1),
  ratingCount: Math.floor(Math.random() * 5000),
  students: Math.floor(Math.random() * 10000),
  lessons: Math.floor(Math.random() * 50) + 10,
  lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
  featured: Math.random() > 0.8,
  bestSeller: Math.random() > 0.8,
  hasAssignments: Math.random() > 0.5,
  hasCertificate: Math.random() > 0.3,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nunc nisl aliquet nunc, quis aliquam nisl nunc sit amet nisl.',
}));

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'popularity':
        return b.students - a.students;
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating);
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover thousands of courses to help you learn new skills, advance your career, or explore your hobbies.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar - visible on larger screens */}
          <div className={`w-full lg:w-1/4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">Filters</h3>
              
              <Accordion type="single" collapsible defaultValue="category" className="space-y-4">
                <AccordionItem value="category" className="border-none">
                  <AccordionTrigger className="py-2 px-0">Category</AccordionTrigger>
                  <AccordionContent>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                        <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="level" className="border-none">
                  <AccordionTrigger className="py-2 px-0">Level</AccordionTrigger>
                  <AccordionContent>
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price" className="border-none">
                  <AccordionTrigger className="py-2 px-0">Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0, 200]}
                        max={200}
                        step={1}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="free-courses" />
                        <Label htmlFor="free-courses">Free Courses</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="features" className="border-none">
                  <AccordionTrigger className="py-2 px-0">Features</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="certificate" />
                        <Label htmlFor="certificate">Certificate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="assignments" />
                        <Label htmlFor="assignments">Assignments</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="coding-exercises" />
                        <Label htmlFor="coding-exercises">Coding Exercises</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="language" className="border-none">
                  <AccordionTrigger className="py-2 px-0">Language</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="english" defaultChecked />
                        <Label htmlFor="english">English</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="spanish" />
                        <Label htmlFor="spanish">Spanish</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="french" />
                        <Label htmlFor="french">French</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="german" />
                        <Label htmlFor="german">German</Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button variant="outline" className="w-full mt-6">
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="w-full lg:w-3/4">
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button 
                variant="outline"
                className="lg:hidden w-full md:w-auto flex items-center justify-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    Sort by: {sortBy.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[200px] p-0">
                  <div className="p-0">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-3 py-2 rounded-none"
                      onClick={() => setSortBy('popularity')}
                    >
                      Most Popular
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-3 py-2 rounded-none"
                      onClick={() => setSortBy('rating')}
                    >
                      Highest Rated
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-3 py-2 rounded-none"
                      onClick={() => setSortBy('newest')}
                    >
                      Newest
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-3 py-2 rounded-none"
                      onClick={() => setSortBy('price-low')}
                    >
                      Price: Low to High
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-3 py-2 rounded-none"
                      onClick={() => setSortBy('price-high')}
                    >
                      Price: High to Low
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredCourses.length}</span> results
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link to={`/courses/${course.slug}`} key={course.id} className="block">
                  <div className="rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      
                      {course.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white rounded-md px-2 py-1 text-xs font-medium">
                          {course.discount}% OFF
                        </div>
                      )}
                      
                      {course.featured && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs font-medium">
                          Featured
                        </div>
                      )}
                      
                      {course.bestSeller && !course.featured && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white rounded-md px-2 py-1 text-xs font-medium">
                          Bestseller
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{course.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({course.ratingCount})</span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold mb-1 line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">By {course.instructor}</p>
                      
                      <div className="flex items-center text-xs text-muted-foreground mb-3">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{course.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{course.lessons} lessons</span>
                        <span className="mx-2">•</span>
                        <span>{course.level}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          {course.price === 0 ? (
                            <span className="font-semibold text-green-600">Free</span>
                          ) : (
                            <div>
                              {course.discount > 0 ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">${(course.price * (1 - course.discount / 100)).toFixed(2)}</span>
                                  <span className="text-muted-foreground text-sm line-through">${course.price.toFixed(2)}</span>
                                </div>
                              ) : (
                                <span className="font-semibold">${course.price.toFixed(2)}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <span className="text-xs text-muted-foreground">
                          {course.students.toLocaleString()} students
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
