// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { BarChart2, Book, DollarSign, Users, Bell } from 'lucide-react';
// import InstructorLayout from '@/components/layout/InstructorLayout';

// const InstructorDashboard = () => {
//   const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

//   return (
//     <InstructorLayout>
//       <div className='space-y-4'>
//         <div className='flex justify-between items-center'>
//           <div>
//             <h1 className='text-3xl font-bold'>Instructor Dashboard</h1>
//             <p className='text-muted-foreground'>
//               Welcome to your instructor dashboard.
//             </p>
//           </div>
//         </div>

//         <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
//           <Card>
//             <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
//               <CardTitle className='text-sm font-medium'>
//                 Total Students
//               </CardTitle>
//               <Users className='w-4 h-4 text-muted-foreground' />
//             </CardHeader>
//             <CardContent>
//               <div className='text-2xl font-bold'>1,234</div>
//               <p className='text-xs text-muted-foreground'>+18 this week</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
//               <CardTitle className='text-sm font-medium'>
//                 Total Courses
//               </CardTitle>
//               <Book className='w-4 h-4 text-muted-foreground' />
//             </CardHeader>
//             <CardContent>
//               <div className='text-2xl font-bold'>12</div>
//               <p className='text-xs text-muted-foreground'>+2 this month</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
//               <CardTitle className='text-sm font-medium'>
//                 Total Earnings
//               </CardTitle>
//               <DollarSign className='w-4 h-4 text-muted-foreground' />
//             </CardHeader>
//             <CardContent>
//               <div className='text-2xl font-bold'>$15,679</div>
//               <p className='text-xs text-muted-foreground'>
//                 +12.5% from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
//               <CardTitle className='text-sm font-medium'>Analytics</CardTitle>
//               <BarChart2 className='w-4 h-4 text-muted-foreground' />
//             </CardHeader>
//             <CardContent>
//               <div className='text-2xl font-bold'>89%</div>
//               <p className='text-xs text-muted-foreground'>
//                 Course completion rate
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         <div className='grid gap-4 md:grid-cols-2'>
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Students</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className='space-y-4'>
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <div key={i} className='flex items-center gap-4'>
//                     <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
//                       <Users className='w-5 h-5' />
//                     </div>
//                     <div className='flex-1'>
//                       <p className='text-sm font-medium'>Student #{i}</p>
//                       <p className='text-xs text-muted-foreground'>
//                         Enrolled in Course #{i}
//                       </p>
//                     </div>
//                     <div className='text-sm text-muted-foreground'>
//                       2 mins ago
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Course Performance</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className='space-y-4'>
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <div key={i} className='flex items-center gap-4'>
//                     <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
//                       <Book className='w-5 h-5' />
//                     </div>
//                     <div className='flex-1'>
//                       <p className='text-sm font-medium'>Course #{i}</p>
//                       <div className='w-full h-2 bg-muted rounded-full mt-2'>
//                         <div
//                           className='h-full bg-primary rounded-full'
//                           style={{
//                             width: `${Math.floor(Math.random() * 100)}%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                     <div className='text-sm font-medium'>
//                       {Math.floor(Math.random() * 1000)} students
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </InstructorLayout>
//   );
// };

// export default InstructorDashboard;
