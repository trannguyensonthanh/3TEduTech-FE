
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, Edit, EyeIcon, MoreHorizontal, Search, Star, Trash, X } from 'lucide-react';

// Mock data for demonstration
const mockInstructors = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  displayName: `Instructor ${i + 1}`,
  email: `instructor${i + 1}@example.com`,
  professionalTitle: ['Professor', 'Senior Developer', 'Industry Expert', 'Consultant'][Math.floor(Math.random() * 4)],
  coursesCount: Math.floor(Math.random() * 15),
  studentsCount: Math.floor(Math.random() * 5000),
  totalEarnings: Math.floor(Math.random() * 100000),
  averageRating: (Math.random() * 3 + 2).toFixed(1),
  status: ['ACTIVE', 'INACTIVE', 'PENDING_APPROVAL'][Math.floor(Math.random() * 3)],
  joinedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
}));

const InstructorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [viewInstructorId, setViewInstructorId] = useState<number | null>(null);
  
  const itemsPerPage = 10;
  
  // Filter instructors based on search and filters
  const filteredInstructors = mockInstructors.filter(instructor => {
    const matchesSearch = instructor.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? instructor.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Paginate instructors
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInstructors = filteredInstructors.slice(startIndex, startIndex + itemsPerPage);
  
  // Get details of the currently viewed instructor
  const viewedInstructor = viewInstructorId 
    ? mockInstructors.find(instructor => instructor.id === viewInstructorId) 
    : null;
  
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Instructor Management</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedStatus || 'Filter by Status'} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus('ACTIVE')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus('INACTIVE')}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus('PENDING_APPROVAL')}>
                Pending Approval
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {viewedInstructor ? (
          // Instructor Details View
          <div className="space-y-6">
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setViewInstructorId(null)}>
                Back to List
              </Button>
              <div className="space-x-2">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                {viewedInstructor.status !== 'ACTIVE' ? (
                  <Button variant="default">
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
                ) : (
                  <Button variant="destructive">
                    <X className="mr-2 h-4 w-4" /> Deactivate
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Instructor Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold">{viewedInstructor.displayName.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-bold">{viewedInstructor.displayName}</h3>
                    <p className="text-muted-foreground">{viewedInstructor.professionalTitle}</p>
                    <Badge 
                      className={
                        viewedInstructor.status === 'ACTIVE' ? 'bg-green-500' : 
                        viewedInstructor.status === 'PENDING_APPROVAL' ? 'bg-yellow-500' : 'bg-red-500'
                      }
                    >
                      {viewedInstructor.status}
                    </Badge>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{viewedInstructor.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined:</span>
                      <span>{viewedInstructor.joinedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {viewedInstructor.averageRating}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted rounded-md p-4 text-center">
                      <h4 className="text-xl font-bold">{viewedInstructor.coursesCount}</h4>
                      <p className="text-sm text-muted-foreground">Courses</p>
                    </div>
                    <div className="bg-muted rounded-md p-4 text-center">
                      <h4 className="text-xl font-bold">{viewedInstructor.studentsCount}</h4>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </div>
                    <div className="bg-muted rounded-md p-4 text-center">
                      <h4 className="text-xl font-bold">${viewedInstructor.totalEarnings.toLocaleString()}</h4>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Courses</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: Math.min(5, viewedInstructor.coursesCount) }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">Course {i + 1}</TableCell>
                            <TableCell>{Math.floor(Math.random() * 1000)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                {(Math.random() * 3 + 2).toFixed(1)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge>
                                {['PUBLISHED', 'DRAFT', 'PENDING'][Math.floor(Math.random() * 3)]}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Payout Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Bank Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bank Name:</span>
                          <span>Example Bank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Number:</span>
                          <span>XXXX-XXXX-XXXX-1234</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Holder:</span>
                          <span>{viewedInstructor.displayName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Balance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current Balance:</span>
                          <span className="font-bold">${Math.floor(Math.random() * 10000).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pending Withdrawal:</span>
                          <span>${Math.floor(Math.random() * 1000).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lifetime Earnings:</span>
                          <span>${viewedInstructor.totalEarnings.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Instructors List View
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInstructors.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell>{instructor.id}</TableCell>
                    <TableCell className="font-medium">{instructor.displayName}</TableCell>
                    <TableCell>{instructor.email}</TableCell>
                    <TableCell>{instructor.coursesCount}</TableCell>
                    <TableCell>{instructor.studentsCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {instructor.averageRating}
                      </div>
                    </TableCell>
                    <TableCell>${instructor.totalEarnings.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          instructor.status === 'ACTIVE' ? 'bg-green-500' : 
                          instructor.status === 'PENDING_APPROVAL' ? 'bg-yellow-500' : 'bg-red-500'
                        }
                      >
                        {instructor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{instructor.joinedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setViewInstructorId(instructor.id)}>
                            <EyeIcon className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {instructor.status !== 'ACTIVE' ? (
                            <DropdownMenuItem>
                              <Check className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <X className="mr-2 h-4 w-4" /> Deactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {!viewedInstructor && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNumber = currentPage <= 3 
                  ? i + 1 
                  : currentPage >= totalPages - 2 
                    ? totalPages - 4 + i 
                    : currentPage - 2 + i;
                
                if (pageNumber <= 0 || pageNumber > totalPages) return null;
                
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </AdminLayout>
  );
};

export default InstructorManagement;
