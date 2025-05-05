// src/services/category.service.ts
import apiHelper from './apiHelper';

export interface Category {
  CategoryID: number;
  CategoryName: string;
  Slug: string;
  Description?: string | null;
  IconUrl?: string | null;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface CategoryListData {
  categories: Category[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number; // 0 = all
  search?: string;
}

export interface CreateCategoryData {
  categoryName: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
}

export interface UpdateCategoryData {
  categoryName?: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
}

export const getCategories = async (
  params?: CategoryQueryParams
): Promise<CategoryListData> => {
  return apiHelper.get('/categories', undefined, params);
};

export const createCategory = async (
  data: CreateCategoryData
): Promise<Category> => {
  return apiHelper.post('/categories', data);
};

export const getCategoryById = async (
  categoryId: number
): Promise<Category> => {
  return apiHelper.get(`/categories/${categoryId}`);
};

export const updateCategory = async (
  categoryId: number,
  data: UpdateCategoryData
): Promise<Category> => {
  return apiHelper.patch(`/categories/${categoryId}`, data);
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  // API trả về 204 hoặc 200, hàm del có thể không trả về body
  await apiHelper.delete(`/categories/${categoryId}`);
};
