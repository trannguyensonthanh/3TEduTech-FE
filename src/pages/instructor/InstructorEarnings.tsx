import { useState } from "react";
import InstructorLayout from "@/components/layout/InstructorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  BanIcon,
  CalendarIcon,
  Check,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Filter,
  HelpCircle,
  Plus,
  Search,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
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
import { Icons } from "@/components/common/Icons";

// Mock data for demonstration
const mockEarningsData = [
  { month: "Jan", earnings: 1200 },
  { month: "Feb", earnings: 1900 },
  { month: "Mar", earnings: 1600 },
  { month: "Apr", earnings: 2100 },
  { month: "May", earnings: 1800 },
  { month: "Jun", earnings: 2400 },
  { month: "Jul", earnings: 2800 },
  { month: "Aug", earnings: 3100 },
  { month: "Sep", earnings: 2700 },
  { month: "Oct", earnings: 3200 },
  { month: "Nov", earnings: 3800 },
  { month: "Dec", earnings: 4200 },
];

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

const paymentMethods = [
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
];

const mockCourseEarnings = [
  { name: "Course 1: Web Development", earnings: 12450, percentage: 30 },
  { name: "Course 2: Python Basics", earnings: 8700, percentage: 25 },
  { name: "Course 3: Data Science", earnings: 6900, percentage: 20 },
  { name: "Course 4: Mobile App Dev", earnings: 4800, percentage: 14 },
  { name: "Course 5: UI/UX Design", earnings: 3750, percentage: 11 },
];

const mockTransactions = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  type: Math.random() > 0.2 ? "PAYMENT" : "PAYOUT",
  amount:
    Math.random() > 0.2
      ? Math.floor(Math.random() * 200) + 9.99
      : Math.floor(Math.random() * 2000) + 100,
  date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split("T")[0],
  courseName:
    Math.random() > 0.2
      ? `Course ${Math.floor(Math.random() * 5) + 1}: Learn Something Amazing`
      : null,
  studentName:
    Math.random() > 0.2
      ? `Student ${Math.floor(Math.random() * 100) + 1}`
      : null,
  status:
    Math.random() > 0.1
      ? "COMPLETED"
      : ["PENDING", "PROCESSING", "FAILED"][Math.floor(Math.random() * 3)],
  transactionId: `TRX${Math.floor(Math.random() * 1000000)}`,
  paymentMethod:
    Math.random() > 0.2
      ? ["CREDIT_CARD", "PAYPAL", "BANK_TRANSFER"][
          Math.floor(Math.random() * 3)
        ]
      : "BANK_TRANSFER",
}));

const mockPayoutRequests = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  amount: Math.floor(Math.random() * 3000) + 1000,
  requestDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split("T")[0],
  status: ["PENDING", "PROCESSING", "COMPLETED", "REJECTED"][
    Math.floor(Math.random() * 4)
  ],
  processedDate:
    Math.random() > 0.5
      ? new Date(Date.now() - Math.floor(Math.random() * 5000000000))
          .toISOString()
          .split("T")[0]
      : null,
  notes:
    Math.random() > 0.7
      ? "Please process this payment as soon as possible."
      : null,
  adminNotes:
    Math.random() > 0.8 ? "Payment processed via bank transfer." : null,
}));

const InstructorEarnings = () => {
  const { toast } = useToast();
  const [transactionSearchTerm, setTransactionSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethodsOpen, setPaymentMethodsOpen] = useState(false);
  const [addPaymentMethodOpen, setAddPaymentMethodOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(
    mockEarningsSummary.paymentMethods
  );
  const itemsPerPage = 10;

  // Filter transactions based on search and transaction type
  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.courseName
        ?.toLowerCase()
        .includes(transactionSearchTerm.toLowerCase()) ||
      "" ||
      transaction.transactionId
        .toLowerCase()
        .includes(transactionSearchTerm.toLowerCase());

    const matchesType =
      activeTab === "all" ||
      (activeTab === "payments" && transaction.type === "PAYMENT") ||
      (activeTab === "payouts" && transaction.type === "PAYOUT");

    return matchesSearch && matchesType;
  });

  // Paginate transactions
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate summary statistics
  const totalEarnings = mockTransactions
    .filter((t) => t.type === "PAYMENT" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayouts = mockTransactions
    .filter((t) => t.type === "PAYOUT" && t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalEarnings - totalPayouts;

  const pendingPayouts = mockPayoutRequests
    .filter((p) => p.status === "PENDING" || p.status === "PROCESSING")
    .reduce((sum, p) => sum + p.amount, 0);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Withdrawal requested for amount:", withdrawAmount);
    // Here you would handle the actual withdrawal request
    setShowWithdrawDialog(false);
    setWithdrawAmount("");
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Earnings & Finances</h1>
          <div className="space-x-2">
            {/* <Dialog
              open={showWithdrawDialog}
              onOpenChange={setShowWithdrawDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Wallet className="mr-2 h-4 w-4" /> Request Withdrawal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request a Withdrawal</DialogTitle>
                  <DialogDescription>
                    Enter the amount you'd like to withdraw from your balance.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleWithdrawalSubmit}
                  className="space-y-4 py-4"
                >
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Amount (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        className="pl-9"
                        placeholder="Enter amount"
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        min={1}
                        max={currentBalance}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Available balance: ${currentBalance.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Withdrawal Method
                    </label>
                    <Select defaultValue="bank">
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setShowWithdrawDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Request Withdrawal</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog> */}

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download Statement
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Current Balance
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${currentBalance.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for withdrawal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Pending Payouts
              </CardTitle>
              <BanIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${pendingPayouts.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Being processed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Earnings Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payout History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-end justify-between">
              <h2 className="text-xl font-bold">Earnings Summary</h2>
              <Select
                defaultValue={selectedPeriod}
                onValueChange={setSelectedPeriod}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="quarter">Last 3 months</SelectItem>
                  <SelectItem value="year">Last 12 months</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
                <CardDescription>
                  Your earnings over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockEarningsData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`$${value}`, "Earnings"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="earnings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Course</CardTitle>
                  <CardDescription>
                    Earnings breakdown across your courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCourseEarnings.map((course, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex-1 truncate mr-2">
                            <span className="text-sm font-medium">
                              {course.name}
                            </span>
                          </div>
                          <span className="text-sm">
                            ${course.earnings.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${course.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-950">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your payout methods
                    </CardDescription>
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
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Understanding Your Earnings</CardTitle>
                  <CardDescription>
                    How course sales are calculated and distributed
                  </CardDescription>
                </div>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">
                      Revenue Split Example
                    </h3>
                    <div className="w-full bg-muted rounded-full h-4 mb-2">
                      <div className="flex h-full rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full"
                          style={{ width: "70%" }}
                        ></div>
                        <div
                          className="bg-yellow-500 h-full"
                          style={{ width: "30%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                        <span>70% Instructor Revenue</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span>30% Platform Fee</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 bg-muted rounded-md">
                      <h4 className="font-medium mb-1">Payout Schedule</h4>
                      <p className="text-sm text-muted-foreground">
                        Payouts are processed on the 1st and 15th of each month
                        for balances over $50.
                      </p>
                    </div>

                    <div className="p-4 bg-muted rounded-md">
                      <h4 className="font-medium mb-1">Processing Time</h4>
                      <p className="text-sm text-muted-foreground">
                        Payments typically take 3-5 business days to process
                        once requested.
                      </p>
                    </div>

                    <div className="p-4 bg-muted rounded-md">
                      <h4 className="font-medium mb-1">Transaction Fees</h4>
                      <p className="text-sm text-muted-foreground">
                        A small processing fee may apply depending on your
                        withdrawal method.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={transactionSearchTerm}
                  onChange={(e) => setTransactionSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="icon">
                  <CalendarIcon className="h-4 w-4" />
                </Button>

                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="payments">Course Sales</TabsTrigger>
                <TabsTrigger value="payouts">Withdrawals</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.transactionId}
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "PAYMENT"
                              ? "default"
                              : "outline"
                          }
                        >
                          {transaction.type === "PAYMENT"
                            ? "Course Sale"
                            : "Withdrawal"}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={
                          transaction.type === "PAYMENT"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {transaction.type === "PAYMENT" ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.type === "PAYMENT"
                          ? `${transaction.courseName} (${transaction.studentName})`
                          : `${transaction.paymentMethod.replace("_", " ")}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            transaction.status === "COMPLETED"
                              ? "bg-green-500"
                              : transaction.status === "FAILED"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }
                        >
                          {transaction.status}
                        </Badge>
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNumber =
                    currentPage <= 3
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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

export default InstructorEarnings;
