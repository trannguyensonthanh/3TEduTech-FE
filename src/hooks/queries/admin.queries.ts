// src/hooks/queries/admin.queries.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  getAdminDashboardOverview,
  AdminDashboardData,
} from '@/services/admin.service';

export const adminKeys = {
  dashboardOverview: ['admin', 'dashboard', 'overview'] as const,
};

export const useAdminDashboardOverview = (
  options?: Omit<
    UseQueryOptions<AdminDashboardData, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<AdminDashboardData, Error>({
    queryKey: adminKeys.dashboardOverview,
    queryFn: getAdminDashboardOverview,
    staleTime: 1000 * 60 * 5, // Cache dữ liệu dashboard trong 5 phút
    ...options,
  });
};
