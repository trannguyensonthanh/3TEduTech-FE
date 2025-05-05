
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/common/Icons';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock promotions data - in a real application, this would come from an API
const promotionsData = [
  { 
    id: 1, 
    name: 'Summer Sale', 
    code: 'SUMMER23', 
    discountType: 'percentage', 
    discountValue: 30, 
    startDate: '2023-06-01', 
    endDate: '2023-08-31', 
    status: 'active',
    usageLimit: 500,
    usageCount: 283,
    applicableCourses: 'all'
  },
  { 
    id: 2, 
    name: 'New Student', 
    code: 'NEWSTUDENT', 
    discountType: 'percentage', 
    discountValue: 15, 
    startDate: '2023-01-01', 
    endDate: '2023-12-31', 
    status: 'active',
    usageLimit: 1000,
    usageCount: 687,
    applicableCourses: 'all'
  },
  { 
    id: 3, 
    name: 'Programming Bundle', 
    code: 'CODEMASTER', 
    discountType: 'fixed', 
    discountValue: 49.99, 
    startDate: '2023-05-15', 
    endDate: '2023-07-15', 
    status: 'expired',
    usageLimit: 200,
    usageCount: 176,
    applicableCourses: 'category:programming'
  },
  { 
    id: 4, 
    name: 'Back to School', 
    code: 'BACKTOSCHOOL', 
    discountType: 'percentage', 
    discountValue: 25, 
    startDate: '2023-08-15', 
    endDate: '2023-09-30', 
    status: 'scheduled',
    usageLimit: 300,
    usageCount: 0,
    applicableCourses: 'all'
  },
  { 
    id: 5, 
    name: 'Design Courses', 
    code: 'DESIGN25', 
    discountType: 'percentage', 
    discountValue: 25, 
    startDate: '2023-04-01', 
    endDate: '2023-04-30', 
    status: 'expired',
    usageLimit: 100,
    usageCount: 83,
    applicableCourses: 'category:design'
  }
];

const PromotionsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  
  // Filter promotions based on search query
  const filteredPromotions = promotionsData.filter(promotion => 
    promotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promotion.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit promotion
  const handleEditPromotion = (promotion: any) => {
    setSelectedPromotion(promotion);
    setIsEditDialogOpen(true);
  };

  // Stats for dashboard
  const activePromotions = promotionsData.filter(p => p.status === 'active').length;
  const scheduledPromotions = promotionsData.filter(p => p.status === 'scheduled').length;
  const expiredPromotions = promotionsData.filter(p => p.status === 'expired').length;

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Scheduled</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Promotions Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icons.plus className="mr-2 h-4 w-4" />
                Create Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Promotion</DialogTitle>
                <DialogDescription>
                  Set up a new promotional discount for your courses.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Promotion Name</Label>
                  <Input id="name" placeholder="e.g., Summer Sale" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input id="code" placeholder="e.g., SUMMER23" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discount-type">Discount Type</Label>
                    <select 
                      id="discount-type" 
                      className="rounded-md border border-input bg-transparent px-3 py-2"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discount-value">Discount Value</Label>
                    <Input id="discount-value" type="number" min="0" placeholder="e.g., 20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="usage-limit">Usage Limit</Label>
                  <Input id="usage-limit" type="number" min="0" placeholder="e.g., 100 (0 for unlimited)" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="applicable-courses">Applicable Courses</Label>
                  <select 
                    id="applicable-courses" 
                    className="rounded-md border border-input bg-transparent px-3 py-2"
                  >
                    <option value="all">All Courses</option>
                    <option value="category:programming">Programming Courses</option>
                    <option value="category:design">Design Courses</option>
                    <option value="specific">Specific Courses</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Internal notes about this promotion"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Promotion</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Promotion</DialogTitle>
                <DialogDescription>
                  Update the details for this promotional discount.
                </DialogDescription>
              </DialogHeader>
              {selectedPromotion && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Promotion Name</Label>
                    <Input id="edit-name" defaultValue={selectedPromotion.name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-code">Coupon Code</Label>
                    <Input id="edit-code" defaultValue={selectedPromotion.code} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-discount-type">Discount Type</Label>
                      <select 
                        id="edit-discount-type" 
                        className="rounded-md border border-input bg-transparent px-3 py-2"
                        defaultValue={selectedPromotion.discountType}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-discount-value">Discount Value</Label>
                      <Input 
                        id="edit-discount-value" 
                        type="number"
                        min="0" 
                        defaultValue={selectedPromotion.discountValue}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-start-date">Start Date</Label>
                      <Input 
                        id="edit-start-date" 
                        type="date"
                        defaultValue={selectedPromotion.startDate} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-end-date">End Date</Label>
                      <Input 
                        id="edit-end-date" 
                        type="date"
                        defaultValue={selectedPromotion.endDate} 
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-usage-limit">Usage Limit</Label>
                    <Input 
                      id="edit-usage-limit" 
                      type="number" 
                      min="0" 
                      defaultValue={selectedPromotion.usageLimit}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <select 
                      id="edit-status" 
                      className="rounded-md border border-input bg-transparent px-3 py-2"
                      defaultValue={selectedPromotion.status}
                    >
                      <option value="active">Active</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
              <Icons.tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePromotions}</div>
              <p className="text-xs text-muted-foreground">
                Currently running promotional discounts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Promotions</CardTitle>
              <Icons.clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledPromotions}</div>
              <p className="text-xs text-muted-foreground">
                Upcoming promotional campaigns
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired Promotions</CardTitle>
              <Icons.x className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiredPromotions}</div>
              <p className="text-xs text-muted-foreground">
                Past promotional campaigns
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search promotions by name or code..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.length > 0 ? (
                filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">{promotion.name}</TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {promotion.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      {promotion.discountType === 'percentage' 
                        ? `${promotion.discountValue}%` 
                        : `$${promotion.discountValue.toFixed(2)}`
                      }
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{promotion.startDate}</div>
                        <div className="text-muted-foreground">to {promotion.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {promotion.usageCount} / {promotion.usageLimit === 0 ? '∞' : promotion.usageLimit}
                        {promotion.usageLimit > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-brand-500 h-1.5 rounded-full" 
                              style={{ width: `${Math.min(100, (promotion.usageCount / promotion.usageLimit) * 100)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditPromotion(promotion)}
                        >
                          <Icons.edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Icons.trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No promotions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PromotionsManagement;
