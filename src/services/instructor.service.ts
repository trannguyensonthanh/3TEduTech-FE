// src/services/instructor.service.ts
import apiHelper from './apiHelper';

export interface InstructorProfile {
  // Kết hợp từ UserProfile và InstructorProfile
  AccountID: number;
  Email: string;
  FullName: string;
  AvatarUrl?: string | null;
  CoverImageUrl?: string | null;
  Headline?: string | null;
  Location?: string | null;
  Gender?: string | null;
  BirthDate?: string | null; // ISO Date
  PhoneNumber?: string | null;
  ProfessionalTitle?: string | null;
  Bio?: string | null;
  AboutMe?: string | null;
  // Thông tin bank có thể không trả về ở đây để bảo mật
  // BankAccountNumber?: string | null;
  // BankName?: string | null;
  // BankAccountHolderName?: string | null;
  CreatedAt: string; // Account CreatedAt
  MemberSince?: string; // Alias cho CreatedAt nếu cần
  skills: { SkillID: number; SkillName: string }[];
  socialLinks: { Platform: string; Url: string }[];
}

export interface UpdateInstructorProfileData {
  // Các trường cho phép instructor tự cập nhật
  headline?: string;
  location?: string;
  professionalTitle?: string;
  bio?: string;
  aboutMe?: string;
}

export interface BankInfo {
  bankAccountNumber: string | null;
  bankName: string | null;
  bankAccountHolderName: string | null;
}

export interface UpdateBankInfoData {
  bankAccountNumber: string;
  bankName: string;
  bankAccountHolderName: string;
}

export interface InstructorSkill {
  SkillID: number;
  SkillName: string;
}

export interface SocialLink {
  Platform: string;
  Url: string;
}

export interface DashboardData {
  totalCourses?: number;
  totalStudents?: number;
  lifetimeEarnings?: number; // Có thể không chính xác 100% từ transaction cuối
  availableBalance?: number;
  pendingWithdrawal?: number;
  averageRating?: number | null;
  unreadNotifications?: number;
  // Thêm các số liệu khác nếu cần
}

/** Lấy profile đầy đủ của instructor đang đăng nhập */
export const getMyInstructorProfile = async (): Promise<InstructorProfile> => {
  return apiHelper.get('/instructors/me/profile');
};

/** Instructor cập nhật profile chuyên nghiệp */
export const updateMyInstructorProfile = async (
  data: UpdateInstructorProfileData
): Promise<InstructorProfile> => {
  return apiHelper.patch('/instructors/me/profile', data);
};

/** Instructor cập nhật thông tin ngân hàng */
export const updateMyBankInfo = async (
  data: UpdateBankInfoData
): Promise<BankInfo> => {
  return apiHelper.put('/instructors/me/bank-info', data);
};

/** Instructor lấy danh sách kỹ năng */
export const getMySkills = async (): Promise<{ skills: InstructorSkill[] }> => {
  // Giả sử API GET /me/profile đã trả về skills, nếu không cần tạo API riêng
  const profile = await getMyInstructorProfile();
  return { skills: profile.skills || [] };
  // Hoặc nếu có API riêng: return apiHelper.get('/instructors/me/skills');
};

/** Instructor thêm kỹ năng */
export const addMySkill = async (
  skillId: number
): Promise<{ skills: InstructorSkill[] }> => {
  return apiHelper.post('/instructors/me/skills', { skillId });
};

/** Instructor xóa kỹ năng */
export const removeMySkill = async (
  skillId: number
): Promise<{ skills: InstructorSkill[] }> => {
  return apiHelper.delete(`/instructors/me/skills/${skillId}`);
};

/** Instructor lấy danh sách social links */
export const getMySocialLinks = async (): Promise<{
  socialLinks: SocialLink[];
}> => {
  // Giả sử API GET /me/profile đã trả về social links
  const profile = await getMyInstructorProfile();
  return { socialLinks: profile.socialLinks || [] };
  // Hoặc nếu có API riêng: return apiHelper.get('/instructors/me/social-links');
};

/** Instructor thêm/cập nhật social link */
export const addOrUpdateMySocialLink = async (
  platform: string,
  url: string
): Promise<{ socialLinks: SocialLink[] }> => {
  return apiHelper.put('/instructors/me/social-links', { platform, url });
};

/** Instructor xóa social link */
export const removeMySocialLink = async (
  platform: string
): Promise<{ socialLinks: SocialLink[] }> => {
  return apiHelper.delete(`/instructors/me/social-links/${platform}`);
};

/** Instructor lấy dữ liệu dashboard */
export const getMyDashboardData = async (): Promise<DashboardData> => {
  return apiHelper.get('/instructors/me/dashboard');
};

/** Lấy profile công khai của instructor */
export const getInstructorPublicProfile = async (
  instructorId: number
): Promise<Partial<InstructorProfile>> => {
  // Chỉ trả về các trường public
  return apiHelper.get(`/instructors/${instructorId}/profile`);
};
