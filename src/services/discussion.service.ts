// src/services/discussion.service.ts
import apiHelper from './apiHelper';

export interface Thread {
  ThreadID: number;
  CourseID: number;
  LessonID?: number | null;
  Title: string;
  CreatedByAccountID: number;
  CreatedAt: string; // ISO Date string
  UpdatedAt: string; // Thời gian post cuối cùng hoặc thời gian tạo thread
  // Thông tin join
  CreatorFullName?: string;
  CreatorAvatar?: string | null;
  PostCount?: number;
}

export interface Post {
  PostID: number;
  ThreadID: number;
  ParentPostID?: number | null;
  AccountID: number;
  PostText: string;
  IsInstructorPost: boolean;
  CreatedAt: string; // ISO Date string
  UpdatedAt: string; // ISO Date string
  // Thông tin join
  AuthorFullName?: string;
  AuthorAvatar?: string | null;
}

export interface ThreadListResponse {
  threads: Thread[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ThreadQueryParams {
  courseId?: number;
  lessonId?: number;
  page?: number;
  limit?: number;
  sortBy?: string; // 'CreatedAt:desc', 'UpdatedAt:desc'
}

export interface PostQueryParams {
  threadId: number; // Required when getting posts
  page?: number;
  limit?: number;
}

export interface CreateThreadData {
  courseId: number;
  lessonId?: number;
  title: string;
}

export interface UpdateThreadData {
  title: string;
}

export interface CreatePostData {
  // threadId lấy từ URL
  text: string;
  parentPostId?: number;
}

export interface UpdatePostData {
  text: string;
}

// --- Thread APIs ---

/** Tạo thread mới */
export const createDiscussionThread = async (
  data: CreateThreadData
): Promise<Thread> => {
  // Endpoint này đứng riêng, cần courseId/lessonId trong body
  return apiHelper.post('/discussion-threads', data);
};

/** Lấy danh sách threads */
export const getDiscussionThreads = async (
  params: ThreadQueryParams
): Promise<ThreadListResponse> => {
  // Endpoint này đứng riêng, filter qua query params
  return apiHelper.get('/discussion-threads', undefined, params);
};

/** Cập nhật tiêu đề thread */
export const updateDiscussionThread = async (
  threadId: number,
  data: UpdateThreadData
): Promise<Thread> => {
  return apiHelper.patch(`/discussion-threads/${threadId}`, data);
};

/** Xóa thread */
export const deleteDiscussionThread = async (
  threadId: number
): Promise<void> => {
  await apiHelper.delete(`/discussion-threads/${threadId}`);
};

// --- Post APIs ---

/** Tạo post mới */
export const createDiscussionPost = async (
  threadId: number,
  data: CreatePostData
): Promise<Post> => {
  // Endpoint này lồng trong thread
  return apiHelper.post(`/discussion-threads/${threadId}/posts`, data);
};

/** Lấy danh sách posts của thread */
export const getDiscussionPosts = async (
  params: PostQueryParams
): Promise<PostListResponse> => {
  // Endpoint này đứng riêng, filter qua query params
  const { threadId, ...restParams } = params;
  return apiHelper.get('/discussion-posts', undefined, {
    threadId,
    ...restParams,
  });
};

/** Cập nhật post */
export const updateDiscussionPost = async (
  postId: number,
  data: UpdatePostData
): Promise<Post> => {
  return apiHelper.patch(`/discussion-posts/${postId}`, data);
};

/** Xóa post */
export const deleteDiscussionPost = async (postId: number): Promise<void> => {
  await apiHelper.delete(`/discussion-posts/${postId}`);
};
