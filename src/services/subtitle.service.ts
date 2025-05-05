// src/services/subtitle.service.ts
import apiHelper, { fetchWithAuth } from './apiHelper'; // Import fetchWithAuth nếu upload file vtt

// --- Kiểu dữ liệu ---
export interface Subtitle {
  SubtitleID: number;
  LessonID: number;
  LanguageCode: string; // vd: 'vi', 'en'
  LanguageName: string; // vd: 'Tiếng Việt', 'English'
  SubtitleUrl: string; // URL công khai đến file .vtt (hoặc signed URL nếu private)
  // SubtitlePublicId?: string | null; // Nếu lưu private trên Cloudinary
  IsDefault: boolean;
  UploadedAt: string; // ISO Date string
}

export interface AddSubtitleData {
  languageCode: string;
  languageName: string;
  subtitleUrl?: string; // Cần URL nếu không upload file
  // file?: File; // Hoặc gửi file nếu upload trực tiếp
  isDefault?: boolean;
}

// --- Hàm gọi API ---

/**
 * Lấy danh sách phụ đề của một bài học.
 * @param {number} lessonId - ID của bài học.
 * @returns {Promise<{ subtitles: Subtitle[] }>} - Trả về object chứa mảng subtitles.
 */
export const getSubtitles = async (
  lessonId: number
): Promise<{ subtitles: Subtitle[] }> => {
  // API lồng trong lesson
  return apiHelper.get(`/lessons/${lessonId}/subtitles`);
};

/**
 * Instructor/Admin: Thêm phụ đề mới bằng URL.
 * @param {number} lessonId - ID của bài học.
 * @param {AddSubtitleData} data - Thông tin phụ đề (chứa subtitleUrl).
 * @returns {Promise<Subtitle>} - Phụ đề vừa được tạo.
 */
export const addSubtitleByUrl = async (
  lessonId: number,
  data: AddSubtitleData
): Promise<Subtitle> => {
  if (!data.subtitleUrl) {
    throw new Error('Subtitle URL is required when adding by URL.');
  }
  // API lồng trong lesson
  return apiHelper.post(`/lessons/${lessonId}/subtitles`, data);
};

/**
 * (Optional) Instructor/Admin: Thêm phụ đề mới bằng cách Upload file .vtt.
 * @param {number} lessonId - ID của bài học.
 * @param {File} file - File .vtt.
 * @param {string} languageCode - Mã ngôn ngữ.
 * @param {string} languageName - Tên ngôn ngữ.
 * @param {boolean} [isDefault=false] - Có phải là mặc định không.
 * @returns {Promise<Subtitle>} - Phụ đề vừa được tạo.
 */
export const addSubtitleByUpload = async (
  lessonId: number,
  file: File,
  languageCode: string,
  languageName: string,
  isDefault: boolean = false
): Promise<Subtitle> => {
  const formData = new FormData();
  formData.append('subtitleFile', file); // Tên field tùy thuộc vào backend Multer config
  formData.append('languageCode', languageCode);
  formData.append('languageName', languageName);
  formData.append('isDefault', String(isDefault)); // Chuyển boolean thành string

  // Cần API endpoint riêng cho việc upload subtitle
  // Ví dụ: POST /v1/lessons/:lessonId/subtitles/upload
  const API_BASE_URL: string = 'http://localhost:5000/v1'; // Nên lấy từ config
  const url = new URL(`${API_BASE_URL}/lessons/${lessonId}/subtitles/upload`); // *** Endpoint mới (cần tạo ở backend) ***

  return fetchWithAuth(url, {
    method: 'POST',
    body: formData,
    // Không cần Content-Type cho FormData
  });
};

/**
 * Instructor/Admin: Đặt một phụ đề làm mặc định.
 * @param {number} lessonId - ID bài học.
 * @param {number} subtitleId - ID phụ đề cần đặt làm chính.
 * @returns {Promise<{ message: string; subtitles: Subtitle[] }>} - Trả về danh sách phụ đề mới.
 */
export const setPrimarySubtitle = async (
  lessonId: number,
  subtitleId: number
): Promise<{ message: string; subtitles: Subtitle[] }> => {
  // API lồng trong lesson
  return apiHelper.patch(
    `/lessons/${lessonId}/subtitles/${subtitleId}/set-primary`
  );
};

/**
 * Instructor/Admin: Xóa một phụ đề.
 * @param {number} lessonId - ID bài học.
 * @param {number} subtitleId - ID phụ đề cần xóa.
 * @returns {Promise<void>}
 */
export const deleteSubtitle = async (
  lessonId: number,
  subtitleId: number
): Promise<void> => {
  // API lồng trong lesson
  await apiHelper.delete(`/lessons/${lessonId}/subtitles/${subtitleId}`);
};

// Thêm hàm updateSubtitle nếu backend hỗ trợ sửa URL/Name
// export const updateSubtitle = async (lessonId: number, subtitleId: number, data: UpdateSubtitleData): Promise<Subtitle> => { ... }
