// src/hooks/queries/user.queries.ts
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getMyProfile,
  updateMyProfile,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  UserProfile,
  UpdateUserProfileData,
  UserListResponse,
  UserQueryParams,
} from '@/services/user.service'; // Import các hàm và kiểu dữ liệu

// Query Key Factory
const userKeys = {
  all: ['users'] as const,
  lists: (params?: UserQueryParams) =>
    [...userKeys.all, 'list', params || {}] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number | 'me' | undefined) =>
    [...userKeys.details(), id] as const,
  profile: ['userProfile'] as const, // Key riêng cho profile của user đang đăng nhập
};

// --- Queries ---

/** Hook để lấy profile user đang đăng nhập */
export const useMyProfile = (
  options?: Omit<UseQueryOptions<UserProfile, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<UserProfile, Error>({
    queryKey: ['userProfile'], // Key duy nhất cho query này
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5, // Dữ liệu profile coi là cũ sau 5 phút
    // Các options khác: enabled, refetchOnWindowFocus,...
    ...options,
  });
};

/** Hook Admin lấy danh sách users */
export const useAdminGetUsers = (
  params: UserQueryParams,
  options?: Omit<
    UseQueryOptions<UserListResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  // Params dùng làm key để query tự động refetch khi params thay đổi
  const queryKey = ['adminUsers', params];
  return useQuery<UserListResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5, // Giữ lại data cũ trong 5 phút khi đang fetch trang mới
    ...options,
  });
};

/** Hook Admin lấy chi tiết user */
export const useAdminGetUserDetail = (
  userId: number | undefined,
  options?: Omit<UseQueryOptions<UserProfile, Error>, 'queryKey' | 'queryFn'>
) => {
  const queryKey = userKeys.detail(userId);
  return useQuery<UserProfile, Error>({
    queryKey: queryKey,
    queryFn: () => getUserById(userId!),
    enabled: !!userId, // Chỉ chạy khi userId có giá trị
    ...options,
  });
};

// --- Mutations ---

/** Hook để cập nhật profile user */
export const useUpdateMyProfile = (
  options?: UseMutationOptions<UserProfile, Error, UpdateUserProfileData>
) => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, UpdateUserProfileData>({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      // Cập nhật cache profile
      queryClient.setQueryData(userKeys.profile, data);
      console.log('Profile updated successfully.');
      // toast.success('Cập nhật hồ sơ thành công!');
    },
    onError: (error) => {
      console.error('Profile update failed:', error.message);
      // toast.error(error.message || 'Cập nhật hồ sơ thất bại.');
    },
    ...options,
  });
};

/** Hook Admin cập nhật status user */
export const useAdminUpdateUserStatus = (
  options?: UseMutationOptions<
    { message: string },
    Error,
    { userId: number; status: string }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    { userId: number; status: string }
  >({
    mutationFn: ({ userId, status }) => updateUserStatus(userId, status),
    onSuccess: (_, variables) => {
      // variables chứa { userId, status }
      // Invalidate cache chi tiết của user đó và cache danh sách user
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      console.log(`User ${variables.userId} status updated.`);
      // toast.success('Cập nhật trạng thái người dùng thành công!');
    },
    onError: (error) => {
      console.error('User status update failed:', error.message);
      // toast.error(error.message || 'Cập nhật trạng thái thất bại.');
    },
    ...options,
  });
};

/** Hook Admin cập nhật role user */
export const useAdminUpdateUserRole = (
  options?: UseMutationOptions<
    { message: string },
    Error,
    { userId: number; roleId: string }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    { userId: number; roleId: string }
  >({
    mutationFn: ({ userId, roleId }) => updateUserRole(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      console.log(`User ${variables.userId} role updated.`);
      // toast.success('Cập nhật vai trò người dùng thành công!');
    },
    onError: (error) => {
      console.error('User role update failed:', error.message);
      // toast.error(error.message || 'Cập nhật vai trò thất bại.');
    },
    ...options,
  });
};

// Thêm các hooks cho các action admin khác nếu cần
