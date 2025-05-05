
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Star, Users } from 'lucide-react';

// Mock data for instructors
const mockInstructors = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Instructor ${i + 1}`,
  avatar: `https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${i + 1}.jpg`,
  specialization: ['Web Development', 'Data Science', 'Digital Marketing', 'UI/UX Design'][i % 4],
  rating: (4 + Math.random()).toFixed(1),
  students: Math.floor(Math.random() * 10000),
  courses: Math.floor(Math.random() * 20) + 1,
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies lacinia, nunc nisl aliquet nunc, quis aliquam nisl nunc sit amet nisl.',
}));

const Instructors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const filteredInstructors = mockInstructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || instructor.specialization === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Expert Instructors</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn from industry experts who are passionate about teaching and have years of real-world experience.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search instructors..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
              <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <Card key={instructor.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-[3/2] relative overflow-hidden">
                  <img 
                    src={instructor.avatar} 
                    alt={instructor.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CardTitle className="text-xl mb-2">{instructor.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-3">{instructor.specialization}</p>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{instructor.rating}/5</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-muted-foreground mr-1" />
                    <span>{instructor.students.toLocaleString()} students</span>
                  </div>
                  <div>
                    <span>{instructor.courses} courses</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/instructors/${instructor.id}`} className="w-full">
                  <Button variant="outline" className="w-full">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Instructors;
