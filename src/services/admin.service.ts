// src/services/admin.service.ts
import apiHelper from './apiHelper';

export interface DashboardStat {
  totalRevenue: { currency: string; amount: number };
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  pendingCourseApprovals: number;
  pendingWithdrawals: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface RecentOrder {
  orderId: number;
  userFullName: string;
  userAvatarUrl: string | null;
  courseName: string;
  amount: number;
  currency: string;
  orderDate: string;
}

export interface TopCourse {
  courseId: number;
  courseName: string;
  revenue: number;
  currency: string;
  slug: string;
}

export interface AdminDashboardData {
  stats: DashboardStat;
  monthlyRevenue: MonthlyRevenue[];
  recentOrders: RecentOrder[];
  topPerformingCourses: TopCourse[];
}

/** Admin: Lấy dữ liệu tổng quan cho Dashboard */
export const getAdminDashboardOverview =
  async (): Promise<AdminDashboardData> => {
    return apiHelper.get('/admin/dashboard/overview');
  };
