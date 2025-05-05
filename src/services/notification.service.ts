// src/services/notification.service.ts
import apiHelper from './apiHelper';

export interface Notification {
  NotificationID: number;
  RecipientAccountID: number;
  Type: string; // NotificationType Enum (vd: 'COURSE_APPROVED', 'NEW_REPLY', ...)
  Message: string;
  RelatedEntityType?: string | null;
  RelatedEntityID?: string | null; // Có thể là number hoặc string tùy entity
  IsRead: boolean;
  CreatedAt: string; // ISO Date string
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  isRead?: boolean; // true | false | undefined (lấy cả hai)
}

export interface UnreadCountResponse {
  unreadCount: number;
}

/** Lấy danh sách thông báo của user hiện tại */
export const getMyNotifications = async (
  params?: NotificationQueryParams
): Promise<NotificationListResponse> => {
  return apiHelper.get('/notifications', undefined, params);
};

/** Lấy số lượng thông báo chưa đọc */
export const getMyUnreadNotificationCount =
  async (): Promise<UnreadCountResponse> => {
    return apiHelper.get('/notifications/unread-count');
  };

/** Đánh dấu một thông báo là đã đọc */
export const markNotificationAsRead = async (
  notificationId: number
): Promise<{ message: string }> => {
  return apiHelper.patch(`/notifications/${notificationId}/read`);
};

/** Đánh dấu tất cả thông báo là đã đọc */
export const markAllNotificationsAsRead = async (): Promise<{
  message: string;
  markedCount: number;
}> => {
  return apiHelper.post('/notifications/mark-all-read');
};
