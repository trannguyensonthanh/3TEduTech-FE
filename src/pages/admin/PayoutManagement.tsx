
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, Check, Clock, DollarSign, Download, Eye, MoreHorizontal, Search, X } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

// Mock data for demonstration
const mockPayouts = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  instructorName: `Instructor ${Math.floor(Math.random() * 10) + 1}`,
  amount: Math.floor(Math.random() * 10000) + 100,
  currency: 'USD',
  method: ['BANK_TRANSFER', 'PAYPAL', 'CRYPTO'][Math.floor(Math.random() * 3)],
  status: ['PENDING', 'PROCESSING', 'PAID', 'FAILED'][Math.floor(Math.random() * 4)],
  requestedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
  processedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString().split('T')[0] : null,
  note: Math.random() > 0.7 ? 'Please process my payment as soon as possible.' : null,
  adminNote: Math.random() > 0.8 ? 'Payment processed via bank transfer.' : null,
}));

const PayoutManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPayout, setSelectedPayout] = useState<number | null>(null);
  const [adminNote, setAdminNote] = useState('');
  
  const itemsPerPage = 10;
  
  // Filter payouts based on search and tab
  const filteredPayouts = mockPayouts.filter(payout => {
    const matchesSearch = payout.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || payout.status.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesTab;
  });
  
  // Paginate payouts
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayouts = filteredPayouts.slice(startIndex, startIndex + itemsPerPage);
  
  // Get selected payout details
  const selectedPayoutDetails = selectedPayout 
    ? mockPayouts.find(payout => payout.id === selectedPayout) 
    : null;
  
  // Handle approve payout
  const handleApprovePayout = () => {
    console.log('Approving payout', selectedPayout, 'with note:', adminNote);
    setSelectedPayout(null);
    setAdminNote('');
  };
  
  // Handle reject payout
  const handleRejectPayout = () => {
    console.log('Rejecting payout', selectedPayout, 'with note:', adminNote);
    setSelectedPayout(null);
    setAdminNote('');
  };
  
  // Calculate summary statistics
  const pendingAmount = mockPayouts.reduce((sum, payout) => sum + (payout.status === 'PENDING' ? payout.amount : 0), 0);
  const processingAmount = mockPayouts.reduce((sum, payout) => sum + (payout.status === 'PROCESSING' ? payout.amount : 0), 0);
  const paidAmount = mockPayouts.reduce((sum, payout) => sum + (payout.status === 'PAID' ? payout.amount : 0), 0);
  
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Instructor Payout Management</h1>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
        
        {selectedPayoutDetails ? (
          <div className="space-y-6">
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedPayout(null)}>
                Back to List
              </Button>
              
              {selectedPayoutDetails.status === 'PENDING' && (
                <div className="space-x-2">
                  <Button variant="outline" className="text-destructive" onClick={handleRejectPayout}>
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button variant="default" onClick={handleApprovePayout}>
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Payout Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">Payout #{selectedPayoutDetails.id}</h3>
                    <Badge 
                      className={
                        selectedPayoutDetails.status === 'PAID' ? 'bg-green-500' : 
                        selectedPayoutDetails.status === 'FAILED' ? 'bg-red-500' : 
                        selectedPayoutDetails.status === 'PROCESSING' ? 'bg-blue-500' : 'bg-yellow-500'
                      }
                    >
                      {selectedPayoutDetails.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Instructor</h4>
                      <p className="text-lg">{selectedPayoutDetails.instructorName}</p>
                      <p className="text-sm text-muted-foreground">
                        instructor{selectedPayoutDetails.id % 10 + 1}@example.com
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Amount</h4>
                      <p className="text-lg font-bold">${selectedPayoutDetails.amount.toFixed(2)} {selectedPayoutDetails.currency}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Requested Date</h4>
                      <p>{selectedPayoutDetails.requestedAt}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Processed Date</h4>
                      <p>{selectedPayoutDetails.processedAt || 'Not processed yet'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Payment Method</h4>
                    <p>{selectedPayoutDetails.method.replace('_', ' ')}</p>
                  </div>
                  
                  {selectedPayoutDetails.note && (
                    <div>
                      <h4 className="font-medium">Instructor Note</h4>
                      <p className="p-3 bg-muted rounded-md">
                        {selectedPayoutDetails.note}
                      </p>
                    </div>
                  )}
                  
                  {selectedPayoutDetails.adminNote && (
                    <div>
                      <h4 className="font-medium">Admin Note</h4>
                      <p className="p-3 bg-muted rounded-md">
                        {selectedPayoutDetails.adminNote}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Bank Information</h4>
                    <div className="space-y-2 p-3 bg-muted rounded-md">
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
                        <span>{selectedPayoutDetails.instructorName}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedPayoutDetails.status === 'PENDING' && (
                    <div>
                      <h4 className="font-medium mb-2">Admin Notes</h4>
                      <Textarea 
                        placeholder="Add notes about this payout..."
                        className="min-h-[100px]"
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This note will be visible to the instructor.
                      </p>
                      
                      <div className="mt-4 space-y-2">
                        <Button className="w-full" onClick={handleApprovePayout}>
                          <Check className="mr-2 h-4 w-4" /> Approve Payout
                        </Button>
                        <Button variant="outline" className="w-full text-destructive" onClick={handleRejectPayout}>
                          <X className="mr-2 h-4 w-4" /> Reject Payout
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Processing</CardTitle>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${processingAmount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Being processed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${paidAmount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Successfully processed</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by instructor name..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Filter by Method <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSearchTerm('')}>
                    All Methods
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchTerm('BANK_TRANSFER')}>
                    Bank Transfer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchTerm('PAYPAL')}>
                    PayPal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchTerm('CRYPTO')}>
                    Cryptocurrency
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Tabs defaultValue="pending" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Processed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{payout.id}</TableCell>
                      <TableCell className="font-medium">{payout.instructorName}</TableCell>
                      <TableCell>${payout.amount.toFixed(2)} {payout.currency}</TableCell>
                      <TableCell>{payout.method.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            payout.status === 'PAID' ? 'bg-green-500' : 
                            payout.status === 'FAILED' ? 'bg-red-500' : 
                            payout.status === 'PROCESSING' ? 'bg-blue-500' : 'bg-yellow-500'
                          }
                        >
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payout.requestedAt}</TableCell>
                      <TableCell>{payout.processedAt || '-'}</TableCell>
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
                            <DropdownMenuItem onClick={() => setSelectedPayout(payout.id)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            {payout.status === 'PENDING' && (
                              <>
                                <DropdownMenuItem>
                                  <Check className="mr-2 h-4 w-4" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <X className="mr-2 h-4 w-4" /> Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {payout.status === 'PROCESSING' && (
                              <DropdownMenuItem>
                                <Check className="mr-2 h-4 w-4" /> Mark as Paid
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" /> Download Receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
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
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default PayoutManagement;
