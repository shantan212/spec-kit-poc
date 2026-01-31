import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductListPage from './ProductListPage';

describe('ProductListPage', () => {
  const originalFetch = globalThis.fetch;

  const mockProductsResponse = (items: any[] = []) => ({
    ok: true,
    json: async () => ({ items, page: 1, pageSize: 20, totalItems: items.length, totalPages: items.length > 0 ? 1 : 0 })
  });

  const mockCategoriesResponse = (categories: any[] = []) => ({
    ok: true,
    json: async () => categories
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('renders empty state when API returns zero items', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(mockCategoriesResponse([]))
      .mockResolvedValueOnce(mockProductsResponse([])) as any;

    render(<ProductListPage />);

    expect(await screen.findByText('No products available.')).toBeTruthy();
  });

  it('renders error state when API fails', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(mockCategoriesResponse([]))
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) }) as any;

    render(<ProductListPage />);

    expect(await screen.findByText('Something went wrong.')).toBeTruthy();
  });

  it('renders product list when API returns items', async () => {
    const mockProducts = [
      { id: '1', name: 'Product A', isAvailable: true, price: { amount: 10.99, currency: 'USD' } },
      { id: '2', name: 'Product B', isAvailable: true, price: null }
    ];

    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(mockCategoriesResponse([]))
      .mockResolvedValueOnce(mockProductsResponse(mockProducts)) as any;

    render(<ProductListPage />);

    expect(await screen.findByText('Product A')).toBeTruthy();
    expect(await screen.findByText('Product B')).toBeTruthy();
  });

  it('shows loading state initially', () => {
    globalThis.fetch = vi.fn().mockImplementation(() => new Promise(() => {})) as any;

    render(<ProductListPage />);

    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('retry button reloads data after error', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('categories')) {
        return Promise.resolve(mockCategoriesResponse([]));
      }
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({ ok: false, json: async () => ({}) });
      }
      return Promise.resolve(mockProductsResponse([{ id: '1', name: 'Product A', isAvailable: true }]));
    }) as any;

    render(<ProductListPage />);

    expect(await screen.findByText('Something went wrong.')).toBeTruthy();

    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);

    expect(await screen.findByText('Product A')).toBeTruthy();
  });

  it('renders search input and category filter', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(mockCategoriesResponse([{ id: 'cat1', name: 'Electronics' }]))
      .mockResolvedValueOnce(mockProductsResponse([{ id: '1', name: 'Product A', isAvailable: true }])) as any;

    render(<ProductListPage />);

    expect(await screen.findByPlaceholderText('Search products...')).toBeTruthy();
    expect(await screen.findByLabelText('Filter by category')).toBeTruthy();
  });

  it('shows no-results state when search yields no matches', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('categories')) {
        return Promise.resolve(mockCategoriesResponse([]));
      }
      callCount++;
      if (callCount === 1) {
        return Promise.resolve(mockProductsResponse([{ id: '1', name: 'Product A', isAvailable: true }]));
      }
      return Promise.resolve(mockProductsResponse([]));
    }) as any;

    render(<ProductListPage />);

    await screen.findByText('Product A');

    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No products match your search criteria.')).toBeTruthy();
    });
  });

  it('clears filters when Clear All Filters button is clicked', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('categories')) {
        return Promise.resolve(mockCategoriesResponse([{ id: 'cat1', name: 'Electronics' }]));
      }
      callCount++;
      if (callCount <= 2) {
        return Promise.resolve(mockProductsResponse([{ id: '1', name: 'Product A', isAvailable: true }]));
      }
      return Promise.resolve(mockProductsResponse([]));
    }) as any;

    render(<ProductListPage />);

    await screen.findByText('Product A');

    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('test')).toBeTruthy();
    });

    const clearButton = await screen.findByText('Clear All Filters');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search products...')).toHaveValue('');
    });
  });

  it('renders sort select control', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(mockCategoriesResponse([]))
      .mockResolvedValueOnce(mockProductsResponse([{ id: '1', name: 'Product A', isAvailable: true }])) as any;

    render(<ProductListPage />);

    expect(await screen.findByLabelText('Sort products')).toBeTruthy();
  });

  it('renders pagination when multiple pages exist', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(mockCategoriesResponse([]))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [{ id: '1', name: 'Product A', isAvailable: true }], page: 1, pageSize: 20, totalItems: 50, totalPages: 3 })
      }) as any;

    render(<ProductListPage />);

    expect(await screen.findByText('Page 1 of 3')).toBeTruthy();
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('navigates to next page when Next button is clicked', async () => {
    let callCount = 0;
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('categories')) {
        return Promise.resolve(mockCategoriesResponse([]));
      }
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ items: [{ id: '1', name: 'Product A', isAvailable: true }], page: 1, pageSize: 20, totalItems: 50, totalPages: 3 })
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ items: [{ id: '2', name: 'Product B', isAvailable: true }], page: 2, pageSize: 20, totalItems: 50, totalPages: 3 })
      });
    }) as any;

    render(<ProductListPage />);

    await screen.findByText('Page 1 of 3');

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(await screen.findByText('Page 2 of 3')).toBeTruthy();
  });

  it('preserves sort and filter state when changing pages', async () => {
    let fetchCalls: string[] = [];
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      fetchCalls.push(url);
      if (url.includes('categories')) {
        return Promise.resolve(mockCategoriesResponse([]));
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ items: [{ id: '1', name: 'Product A', isAvailable: true }], page: 1, pageSize: 20, totalItems: 50, totalPages: 3 })
      });
    }) as any;

    render(<ProductListPage />);

    await screen.findByText('Product A');

    const sortSelect = screen.getByLabelText('Sort products');
    fireEvent.change(sortSelect, { target: { value: 'price_asc' } });

    await waitFor(() => {
      const lastCall = fetchCalls[fetchCalls.length - 1];
      expect(lastCall).toContain('sort=price_asc');
    });
  });
});
