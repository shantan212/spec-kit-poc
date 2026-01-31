import { apiGet } from './apiClient';

export type Money = {
  amount: number;
  currency: string;
};

export type CategoryRef = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  descriptionSummary?: string | null;
  imageUrl?: string | null;
  price?: Money | null;
  isAvailable: boolean;
  category?: CategoryRef | null;
};

export type ProductListResponse = {
  items: Product[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type ProductQueryParams = {
  q?: string;
  categoryId?: string;
  sort?: 'name_asc' | 'price_asc';
  page?: number;
  pageSize?: number;
};

export async function getProducts(params?: ProductQueryParams): Promise<ProductListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.q) searchParams.set('q', params.q);
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));

  const query = searchParams.toString();
  const url = query ? `/api/v1/products?${query}` : '/api/v1/products';
  return apiGet<ProductListResponse>(url);
}
