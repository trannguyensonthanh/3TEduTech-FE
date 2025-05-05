import { useState } from "react";
import InstructorLayout from "@/components/layout/InstructorLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  BarChart2,
  DollarSign,
  Download,
  Plus,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Calendar,
  FileText,
  Check,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@radix-ui/react-label";
import { Icons } from "@/components/common/Icons";

// Mock data for earnings
const mockEarningsSummary = {
  totalEarnings: 12485.75,
  pendingPayouts: 1250.5,
  lifetimeStudents: 3245,
  monthlyTrends: [
    { month: "Jan", earnings: 1200, students: 95 },
    { month: "Feb", earnings: 1450, students: 112 },
    { month: "Mar", earnings: 1950, students: 128 },
    { month: "Apr", earnings: 2100, students: 145 },
    { month: "May", earnings: 1850, students: 131 },
    { month: "Jun", earnings: 1600, students: 120 },
  ],
  courseSales: [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      sales: 145,
      revenue: 2900,
      enrollmentRate: 75,
      thumbnail: "https://via.placeholder.com/150?text=Web+Dev",
    },
    {
      id: 2,
      title: "Advanced JavaScript Masterclass",
      sales: 98,
      revenue: 1960,
      enrollmentRate: 62,
      thumbnail: "https://via.placeholder.com/150?text=JavaScript",
    },
    {
      id: 3,
      title: "Python for Data Science",
      sales: 122,
      revenue: 2440,
      enrollmentRate: 80,
      thumbnail: "https://via.placeholder.com/150?text=Python",
    },
    {
      id: 4,
      title: "Mobile App Development with React Native",
      sales: 76,
      revenue: 1520,
      enrollmentRate: 54,
      thumbnail: "https://via.placeholder.com/150?text=React+Native",
    },
  ],
  recentTransactions: [
    {
      id: 1,
      date: "2025-04-15",
      amount: 350.25,
      status: "Paid",
      description: "Monthly payout",
      method: "PayPal",
    },
    {
      id: 2,
      date: "2025-03-15",
      amount: 420.75,
      status: "Paid",
      description: "Monthly payout",
      method: "PayPal",
    },
    {
      id: 3,
      date: "2025-02-15",
      amount: 315.5,
      status: "Paid",
      description: "Monthly payout",
      method: "Bank Account",
    },
    {
      id: 4,
      date: "2025-01-15",
      amount: 390.2,
      status: "Paid",
      description: "Monthly payout",
      method: "Bank Account",
    },
  ],
  paymentMethods: [
    {
      id: 1,
      type: "PayPal",
      email: "instructor@example.com",
      isDefault: true,
    },
    {
      id: 2,
      type: "Bank Account",
      accountName: "John Doe",
      accountNumber: "****6789",
      isDefault: false,
      bankName: "Vietcombank",
    },
  ],
};

// Formatted number with + sign for positive values
const formatTrend = (value: number) => {
  return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
};

const InstructorEarnings_v2 = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [paymentMethodsOpen, setPaymentMethodsOpen] = useState(false);
  const [addPaymentMethodOpen, setAddPaymentMethodOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(
    mockEarningsSummary.paymentMethods
  );

  const handleDownloadStatement = () => {
    toast({
      title: "Statement downloaded",
      description: "Your earnings statement has been downloaded.",
    });
  };

  const handleSetDefaultPaymentMethod = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    });
  };

  const handleRemovePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    toast({
      title: "Payment method removed",
      description: "Your payment method has been removed.",
    });
  };

  return (
    <InstructorLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Earnings & Payouts
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your revenue and manage payment methods.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPaymentMethodsOpen(true)}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Payment Methods
            </Button>
            <Button onClick={handleDownloadStatement}>
              <Download className="mr-2 h-4 w-4" /> Download Statement
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-950">
            <CardHeader className="pb-2">
              <CardDescription>Total Earnings</CardDescription>
              <div className="flex items-end justify-between">
                <CardTitle className="text-3xl">
                  ${mockEarningsSummary.totalEarnings.toLocaleString()}
                </CardTitle>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>12.5%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">vs previous month</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-950">
            <CardHeader className="pb-2">
              <CardDescription>Pending Payout</CardDescription>
              <div className="flex items-end justify-between">
                <CardTitle className="text-3xl">
                  ${mockEarningsSummary.pendingPayouts.toLocaleString()}
                </CardTitle>
                <div className="flex items-center text-amber-500 text-sm font-medium">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Next: May 15</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Available for withdrawal
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-950">
            <CardHeader className="pb-2">
              <CardDescription>Total Students</CardDescription>
              <div className="flex items-end justify-between">
                <CardTitle className="text-3xl">
                  {mockEarningsSummary.lifetimeStudents.toLocaleString()}
                </CardTitle>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>8.2%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">vs previous month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="overview"
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <Card className="bg-white dark:bg-gray-950">
                <CardHeader>
                  <CardTitle className="text-xl">Monthly Revenue</CardTitle>
                  <CardDescription>
                    Your course sales over the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-end space-x-2">
                    {mockEarningsSummary.monthlyTrends.map((month, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className="bg-primary/80 hover:bg-primary rounded-t-md w-full transition-all duration-200"
                          style={{
                            height: `${
                              (month.earnings /
                                Math.max(
                                  ...mockEarningsSummary.monthlyTrends.map(
                                    (m) => m.earnings
                                  )
                                )) *
                              180
                            }px`,
                          }}
                        ></div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {month.month}
                        </div>
                        <div className="font-medium">${month.earnings}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Courses */}
              <Card className="bg-white dark:bg-gray-950">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-xl">Top Courses</CardTitle>
                    <CardDescription>
                      Your best performing courses
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="space-y-4">
                    {mockEarningsSummary.courseSales
                      .slice(0, 3)
                      .map((course) => (
                        <div
                          key={course.id}
                          className="flex items-start p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-12 h-12 rounded object-cover mr-4"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {course.title}
                            </p>
                            <div className="flex justify-between text-sm mt-1">
                              <div className="flex items-center text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                <span>{course.sales} students</span>
                              </div>
                              <span className="font-semibold">
                                ${course.revenue}
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Enrollment Rate</span>
                                <span>{course.enrollmentRate}%</span>
                              </div>
                              <Progress
                                value={course.enrollmentRate}
                                className="h-1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Button variant="outline" className="w-full" size="sm">
                    View All Courses
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="bg-white dark:bg-gray-950">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Payment Methods</CardTitle>
                  <CardDescription>Manage your payout methods</CardDescription>
                </div>
                <Button onClick={() => setPaymentMethodsOpen(true)}>
                  <CreditCard className="mr-2 h-4 w-4" /> Manage Methods
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between border p-4 rounded-md bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{method.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.type === "PayPal"
                              ? method.email
                              : `${method.accountName} - ${method.bankName}`}
                          </p>
                        </div>
                      </div>
                      {method.isDefault && (
                        <Badge className="bg-primary">Default</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-white dark:bg-gray-950">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Course Sales</CardTitle>
                    <CardDescription>
                      Recent purchases of your courses
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search transactions..."
                      className="max-w-xs"
                    />
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://ui-avatars.com/api/?name=Student+${
                                  i + 1
                                }`}
                              />
                              <AvatarFallback>S{i + 1}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                Student {i + 1}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                student{i + 1}@example.com
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">
                            {mockEarningsSummary.courseSales[i % 4].title}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {new Date().toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date().toLocaleTimeString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/80">Completed</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="text-sm font-medium">
                            ${(Math.random() * 50 + 10).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            After platform fee
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts" className="space-y-6">
            <Card className="bg-white dark:bg-gray-950">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Payout History</CardTitle>
                    <CardDescription>
                      Record of all your received payouts
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEarningsSummary.recentTransactions.map(
                      (transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">
                                {new Date(
                                  transaction.date
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Monthly payout
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                              TXN-{10000 + transaction.id}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {transaction.method === "PayPal" ? (
                                <Icons.paypal className="h-4 w-4 mr-2 text-blue-500" />
                              ) : (
                                <CreditCard className="h-4 w-4 mr-2" />
                              )}
                              <span>{transaction.method}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/80">
                              <Check className="h-3 w-3 mr-1" />
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <p className="text-sm font-medium">
                              ${transaction.amount.toFixed(2)}
                            </p>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <Card className="bg-white dark:bg-gray-950">
              <CardHeader>
                <CardTitle className="text-xl">Request Withdrawal</CardTitle>
                <CardDescription>
                  Withdraw your available balance to your preferred payment
                  method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-6 bg-muted/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Available for withdrawal
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Amount that you can withdraw now
                      </p>
                    </div>
                    <div className="text-3xl font-bold">
                      ${mockEarningsSummary.pendingPayouts.toFixed(2)}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Withdrawal amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount to withdraw"
                        min={1}
                        max={mockEarningsSummary.pendingPayouts}
                        defaultValue={mockEarningsSummary.pendingPayouts}
                      />
                      <p className="text-sm text-muted-foreground">
                        Minimum withdrawal amount: $50.00
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Payment method</Label>
                      <Select
                        defaultValue={paymentMethods
                          .find((m) => m.isDefault)
                          ?.id.toString()}
                      >
                        <SelectTrigger id="payment-method">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem
                              key={method.id}
                              value={method.id.toString()}
                            >
                              {method.type} {method.isDefault && " (Default)"} -
                              {method.type === "PayPal"
                                ? ` ${method.email}`
                                : ` ${method.accountName} - ${method.bankName}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="w-full mt-6">Request Withdrawal</Button>
                </div>

                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Recent Withdrawal Requests
                  </h3>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{new Date().toLocaleDateString()}</TableCell>
                        <TableCell>$350.00</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-500/80">Processing</Badge>
                        </TableCell>
                        <TableCell>PayPal</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {new Date(
                            Date.now() - 30 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>$420.75</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/80">Completed</Badge>
                        </TableCell>
                        <TableCell>PayPal</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Methods Dialog */}
      <Dialog open={paymentMethodsOpen} onOpenChange={setPaymentMethodsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Methods</DialogTitle>
            <DialogDescription>
              Manage the payment methods used to receive your course earnings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between border p-4 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{method.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.type === "PayPal"
                        ? method.email
                        : `${method.accountName} (${method.accountNumber})`}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefaultPaymentMethod(method.id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemovePaymentMethod(method.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                setAddPaymentMethodOpen(true);
                setPaymentMethodsOpen(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Payment Method
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={() => setPaymentMethodsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <AddPaymentMethodDialog
        open={addPaymentMethodOpen}
        onOpenChange={setAddPaymentMethodOpen}
        onSuccess={(newMethod) => {
          setPaymentMethods([...paymentMethods, newMethod]);
          setAddPaymentMethodOpen(false);
          setPaymentMethodsOpen(true);
          toast({
            title: "Payment method added",
            description: "Your new payment method has been added successfully.",
          });
        }}
      />
    </InstructorLayout>
  );
};

// Add Payment Method Dialog Component
const AddPaymentMethodDialog = ({ open, onOpenChange, onSuccess }) => {
  const [methodType, setMethodType] = useState("PayPal");
  const form = useForm({
    defaultValues: {
      email: "",
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      bankName: "",
    },
  });

  const handleSubmit = (data) => {
    const newId = Math.floor(Math.random() * 1000) + 10;

    if (methodType === "PayPal") {
      onSuccess({
        id: newId,
        type: "PayPal",
        email: data.email,
        isDefault: false,
      });
    } else {
      onSuccess({
        id: newId,
        type: "Bank Account",
        accountName: data.accountName,
        accountNumber: `****${data.accountNumber.slice(-4)}`,
        bankName: data.bankName,
        isDefault: false,
      });
    }

    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new payment method to receive your course earnings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <FormLabel>Payment Method Type</FormLabel>
              <Select value={methodType} onValueChange={setMethodType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Bank Account">Bank Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {methodType === "PayPal" ? (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PayPal Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the email address associated with your PayPal
                      account.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Bank of America" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <DialogFooter className="mt-6">
              <Button type="submit">Add Payment Method</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorEarnings_v2;
