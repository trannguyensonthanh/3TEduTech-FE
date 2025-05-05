// src/hooks/queries/instructor.queries.ts
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getMyInstructorProfile,
  updateMyInstructorProfile,
  updateMyBankInfo,
  addMySkill,
  removeMySkill,
  addOrUpdateMySocialLink,
  removeMySocialLink,
  getMyDashboardData,
  getInstructorPublicProfile,
  InstructorProfile,
  UpdateInstructorProfileData,
  BankInfo,
  UpdateBankInfoData,
  InstructorSkill,
  SocialLink,
  DashboardData,
} from '@/services/instructor.service';

// Query Key Factory
const instructorKeys = {
  all: ['instructors'] as const,
  myProfile: () => [...instructorKeys.all, 'me', 'profile'] as const,
  myDashboard: () => [...instructorKeys.all, 'me', 'dashboard'] as const,
  publicProfiles: () => [...instructorKeys.all, 'publicProfile'] as const,
  publicProfile: (id: number | undefined) =>
    [...instructorKeys.publicProfiles(), id] as const,
};

// --- Queries ---

/** Hook Instructor lấy profile đầy đủ của mình */
export const useMyInstructorProfile = (
  options?: Omit<
    UseQueryOptions<InstructorProfile, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<InstructorProfile, Error>({
    queryKey: instructorKeys.myProfile(),
    queryFn: getMyInstructorProfile,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    ...options,
  });
};

/** Hook Instructor lấy dữ liệu dashboard */
export const useMyDashboardData = (
  options?: Omit<UseQueryOptions<DashboardData, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<DashboardData, Error>({
    queryKey: instructorKeys.myDashboard(),
    queryFn: getMyDashboardData,
    staleTime: 1000 * 60, // Cache 1 phút
    ...options,
  });
};

/** Hook lấy profile công khai của instructor */
export const useInstructorPublicProfile = (
  instructorId: number | undefined,
  options?: Omit<
    UseQueryOptions<Partial<InstructorProfile>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = instructorKeys.publicProfile(instructorId);
  return useQuery<Partial<InstructorProfile>, Error>({
    queryKey: queryKey,
    queryFn: () => getInstructorPublicProfile(instructorId!),
    enabled: !!instructorId,
    ...options,
  });
};

// --- Mutations ---

/** Hook Instructor cập nhật profile chuyên nghiệp */
export const useUpdateMyInstructorProfile = (
  options?: UseMutationOptions<
    InstructorProfile,
    Error,
    UpdateInstructorProfileData
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<InstructorProfile, Error, UpdateInstructorProfileData>({
    mutationFn: updateMyInstructorProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(instructorKeys.myProfile(), data);
      console.log('Instructor profile updated.');
      // toast.success('Cập nhật hồ sơ giảng viên thành công!');
    },
    onError: (error) => {
      console.error('Instructor profile update failed:', error.message);
      // toast.error(error.message || 'Cập nhật hồ sơ thất bại.');
    },
    ...options,
  });
};

/** Hook Instructor cập nhật thông tin ngân hàng */
export const useUpdateMyBankInfo = (
  options?: UseMutationOptions<BankInfo, Error, UpdateBankInfoData>
) => {
  const queryClient = useQueryClient();
  return useMutation<BankInfo, Error, UpdateBankInfoData>({
    mutationFn: updateMyBankInfo,
    onSuccess: () => {
      // Invalidate my profile để load lại thông tin mới (nếu profile có chứa bank info)
      queryClient.invalidateQueries({ queryKey: instructorKeys.myProfile() });
      console.log('Bank info updated.');
      // toast.success('Cập nhật thông tin ngân hàng thành công!');
    },
    onError: (error) => {
      console.error('Bank info update failed:', error.message);
      // toast.error(error.message || 'Cập nhật thông tin ngân hàng thất bại.');
    },
    ...options,
  });
};

/** Hook Instructor thêm kỹ năng */
export const useAddMySkill = (
  options?: UseMutationOptions<{ skills: InstructorSkill[] }, Error, number>
) => {
  const queryClient = useQueryClient();
  return useMutation<{ skills: InstructorSkill[] }, Error, number>({
    // Input là skillId
    mutationFn: addMySkill,
    onSuccess: (data) => {
      // Cập nhật cache profile với list skills mới
      queryClient.setQueryData(
        instructorKeys.myProfile(),
        (oldData: InstructorProfile | undefined) =>
          oldData ? { ...oldData, skills: data.skills } : undefined
      );
      console.log('Skill added.');
      // toast.success('Thêm kỹ năng thành công!');
    },
    onError: (error) => {
      console.error('Add skill failed:', error.message);
      // toast.error(error.message || 'Thêm kỹ năng thất bại.');
    },
    ...options,
  });
};

/** Hook Instructor xóa kỹ năng */
export const useRemoveMySkill = (
  options?: UseMutationOptions<{ skills: InstructorSkill[] }, Error, number>
) => {
  const queryClient = useQueryClient();
  return useMutation<{ skills: InstructorSkill[] }, Error, number>({
    // Input là skillId
    mutationFn: removeMySkill,
    onSuccess: (data, skillId) => {
      queryClient.setQueryData(
        instructorKeys.myProfile(),
        (oldData: InstructorProfile | undefined) =>
          oldData ? { ...oldData, skills: data.skills } : undefined
      );
      console.log(`Skill ${skillId} removed.`);
      // toast.success('Xóa kỹ năng thành công!');
    },
    onError: (error) => {
      console.error('Remove skill failed:', error.message);
      // toast.error(error.message || 'Xóa kỹ năng thất bại.');
    },
    ...options,
  });
};

/** Hook Instructor thêm/cập nhật social link */
export const useAddOrUpdateMySocialLink = (
  options?: UseMutationOptions<
    { socialLinks: SocialLink[] },
    Error,
    { platform: string; url: string }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation<
    { socialLinks: SocialLink[] },
    Error,
    { platform: string; url: string }
  >({
    mutationFn: ({ platform, url }) => addOrUpdateMySocialLink(platform, url),
    onSuccess: (data) => {
      queryClient.setQueryData(
        instructorKeys.myProfile(),
        (oldData: InstructorProfile | undefined) =>
          oldData ? { ...oldData, socialLinks: data.socialLinks } : undefined
      );
      console.log('Social link added/updated.');
      // toast.success('Cập nhật liên kết thành công!');
    },
    onError: (error) => {
      console.error('Add/Update social link failed:', error.message);
      // toast.error(error.message || 'Cập nhật liên kết thất bại.');
    },
    ...options,
  });
};

/** Hook Instructor xóa social link */
export const useRemoveMySocialLink = (
  options?: UseMutationOptions<{ socialLinks: SocialLink[] }, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation<{ socialLinks: SocialLink[] }, Error, string>({
    // Input là platform
    mutationFn: removeMySocialLink,
    onSuccess: (data, platform) => {
      queryClient.setQueryData(
        instructorKeys.myProfile(),
        (oldData: InstructorProfile | undefined) =>
          oldData ? { ...oldData, socialLinks: data.socialLinks } : undefined
      );
      console.log(`Social link ${platform} removed.`);
      // toast.success('Xóa liên kết thành công!');
    },
    onError: (error) => {
      console.error('Remove social link failed:', error.message);
      // toast.error(error.message || 'Xóa liên kết thất bại.');
    },
    ...options,
  });
};
