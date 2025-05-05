/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/user.service.ts
import apiHelper from './apiHelper';

// --- Kiểu dữ liệu (Ví dụ) ---
export interface UserProfile {
  AccountID: number; // ID tài khoản
  Email: string; // Email của người dùng
  RoleID: string; // Vai trò của người dùng (e.g., 'ADMIN', 'INSTRUCTOR', 'STUDENT')
  Status: string; // Trạng thái tài khoản (e.g., 'ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION')
  FullName: string; // Họ và tên đầy đủ
  AvatarUrl?: string | null; // URL ảnh đại diện (có thể null)
  Gender?: 'MALE' | 'FEMALE' | 'OTHER' | null; // Giới tính
  BirthDate?: string | null; // Ngày sinh (YYYY-MM-DD)
  PhoneNumber?: string | null; // Số điện thoại
  Location?: string | null; // Địa chỉ hoặc vị trí
  ProfessionalTitle?: string | null; // Chức danh chuyên môn
  Bio?: string | null; // Tiểu sử ngắn
  AboutMe?: string | null; // Thông tin chi tiết về bản thân
  BankAccountNumber?: string | null; // Số tài khoản ngân hàng
  BankName?: string | null; // Tên ngân hàng
  BankAccountHolderName?: string | null; // Tên chủ tài khoản ngân hàng
  Skills?: any; // Danh sách kỹ năng
  SocialLinks?: any; // Danh sách liên kết mạng xã hội
  CreatedAt?: string; // Thời gian tạo tài khoản
  UpdatedAt?: string; // Thời gian cập nhật tài khoản
  Courses?: number; // Số lượng khóa học đã tạo (nếu là giảng viên)
}

// Định nghĩa kiểu cho liên kết mạng xã hội
export interface SocialLink {
  platform: 'LINKEDIN' | 'GITHUB' | 'TWITTER' | 'FACEBOOK' | 'OTHER'; // Nền tảng mạng xã hội
  url: string; // URL liên kết
}

export interface UpdateUserProfileData {
  fullName?: string;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  birthDate?: string | null; // YYYY-MM-DD
  phoneNumber?: string | null;
  headline?: string | null;
  location?: string | null;
}

export interface UserListResponse {
  users: UserProfile[]; // Danh sách user với thông tin cơ bản
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

// --- Các hàm gọi API ---

/** Lấy profile của user đang đăng nhập */
export const getMyProfile = async (): Promise<UserProfile> => {
  return apiHelper.get('/users/me');
};

/** Cập nhật profile của user đang đăng nhập */
export const updateMyProfile = async (
  data: UpdateUserProfileData
): Promise<UserProfile> => {
  return apiHelper.patch('/users/me', data);
};

// --- Admin APIs ---

/** Admin: Lấy danh sách users */
export const getUsers = async (
  params: UserQueryParams
): Promise<UserListResponse> => {
  return apiHelper.get('/users', undefined, params); // Truyền params vào hàm get
};

/** Admin: Lấy chi tiết user */
export const getUserById = async (userId: number): Promise<UserProfile> => {
  return apiHelper.get(`/users/${userId}`);
};

/** Admin: Cập nhật status user */
export const updateUserStatus = async (
  userId: number,
  status: string
): Promise<{ message: string }> => {
  return apiHelper.patch(`/users/${userId}/status`, { status });
};

/** Admin: Cập nhật role user */
export const updateUserRole = async (
  userId: number,
  roleId: string
): Promise<{ message: string }> => {
  return apiHelper.patch(`/users/${userId}/role`, { roleId });
};
