// src/hooks/queries/notification.queries.ts
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getMyNotifications,
  getMyUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  Notification,
  NotificationListResponse,
  NotificationQueryParams,
  UnreadCountResponse,
} from '@/services/notification.service'; // Điều chỉnh đường dẫn nếu cần

// Query Key Factory
const notificationKeys = {
  all: ['notifications'] as const,
  myLists: (params?: NotificationQueryParams) =>
    [...notificationKeys.all, 'myList', params || {}] as const,
  myUnreadCount: () => [...notificationKeys.all, 'myUnreadCount'] as const,
};

// --- Queries ---

/** Hook lấy danh sách thông báo của user hiện tại */
export const useMyNotifications = (
  params?: NotificationQueryParams,
  options?: Omit<
    UseQueryOptions<NotificationListResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = notificationKeys.myLists(params);
  return useQuery<NotificationListResponse, Error>({
    queryKey: queryKey,
    queryFn: () => getMyNotifications(params),
    staleTime: 1000 * 30, // 30 seconds to keep data fresh
    // Có thể set staleTime ngắn hơn để cập nhật thường xuyên
    // staleTime: 1000 * 30, // 30 giây
    ...options,
  });
};

/** Hook lấy số lượng thông báo chưa đọc */
export const useMyUnreadNotificationCount = (
  options?: Omit<
    UseQueryOptions<UnreadCountResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = notificationKeys.myUnreadCount();
  return useQuery<UnreadCountResponse, Error>({
    queryKey: queryKey,
    queryFn: getMyUnreadNotificationCount,
    // staleTime có thể ngắn hơn hoặc dùng refetchInterval nếu cần real-time hơn (khi chưa có websocket)
    // refetchInterval: 1000 * 60, // Fetch lại mỗi phút
    ...options,
  });
};

// --- Mutations ---

/** Hook đánh dấu một thông báo là đã đọc */
export const useMarkNotificationAsRead = (
  options?: UseMutationOptions<{ message: string }, Error, number>
) => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, number>({
    // Input là notificationId
    mutationFn: markNotificationAsRead,
    onSuccess: (data, notificationId) => {
      // Cập nhật cache danh sách: tìm notification đó và set isRead = true
      queryClient.setQueryData(
        notificationKeys.myLists(),
        (oldData: NotificationListResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            notifications: oldData.notifications.map((n) =>
              n.NotificationID === notificationId ? { ...n, IsRead: true } : n
            ),
          };
        }
      );
      // Cập nhật cache unread count (giảm đi 1)
      queryClient.setQueryData(
        notificationKeys.myUnreadCount(),
        (oldCount: UnreadCountResponse | undefined) => {
          if (oldCount === undefined) return oldCount;
          return { unreadCount: Math.max(0, oldCount.unreadCount - 1) };
        }
      );
      console.log(`Notification ${notificationId} marked as read.`);
      // Không cần toast ở đây?
    },
    onError: (error) => {
      console.error('Mark notification as read failed:', error.message);
    },
    ...options,
  });
};

/** Hook đánh dấu tất cả thông báo là đã đọc */
export const useMarkAllNotificationsAsRead = (
  options?: UseMutationOptions<
    { message: string; markedCount: number },
    Error,
    void
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<{ message: string; markedCount: number }, Error, void>({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: (data) => {
      // Invalidate toàn bộ cache list notification
      queryClient.invalidateQueries({ queryKey: notificationKeys.myLists() });
      // Set unread count về 0
      queryClient.setQueryData(notificationKeys.myUnreadCount(), {
        unreadCount: 0,
      });
      console.log(`${data.markedCount} notifications marked as read.`);
      // toast.success(data.message);
    },
    onError: (error) => {
      console.error('Mark all notifications as read failed:', error.message);
      // toast.error(error.message || 'Đánh dấu tất cả là đã đọc thất bại.');
    },
    ...options,
  });
};
