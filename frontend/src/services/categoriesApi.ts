import { apiGet } from './apiClient';

export type Category = {
  id: string;
  name: string;
};

export async function getCategories(): Promise<Category[]> {
  return apiGet<Category[]>('/api/v1/categories');
}
