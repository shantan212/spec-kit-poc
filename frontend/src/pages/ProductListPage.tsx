import { useEffect, useState, useCallback } from 'react';
import ProductList from '../components/ProductList';
import ProductSearchBar from '../components/ProductSearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortSelect from '../components/SortSelect';
import Pagination from '../components/Pagination';
import { getProducts, type Product, type ProductQueryParams } from '../services/productsApi';
import { getCategories, type Category } from '../services/categoriesApi';
import '../styles/productList.css';
import '../styles/productFilters.css';
import '../styles/pagination.css';

type SortOption = 'name_asc' | 'price_asc';

export default function ProductListPage() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty' | 'error' | 'no-results'>('loading');
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const hasFilters = searchQuery.trim() !== '' || selectedCategoryId !== null;

  const loadProducts = useCallback(async () => {
    setStatus('loading');
    try {
      const params: ProductQueryParams = {
        q: searchQuery.trim() || undefined,
        categoryId: selectedCategoryId ?? undefined,
        sort: sortOrder,
        page: currentPage,
        pageSize: 20,
      };
      const data = await getProducts(params);
      const products: Product[] = data.items ?? [];
      setItems(products);
      setTotalPages(data.totalPages);

      if (products.length === 0) {
        setStatus(hasFilters ? 'no-results' : 'empty');
      } else {
        setStatus('ready');
      }
    } catch {
      setStatus('error');
    }
  }, [searchQuery, selectedCategoryId, sortOrder, currentPage, hasFilters]);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOrder(sort);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId(null);
    setCurrentPage(1);
  };

  return (
    <main className="page">
      <header className="header">
        <h1>Available Products</h1>
      </header>

      <div className="filters">
        <ProductSearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={() => handleSearchChange('')}
        />
        <CategoryFilter
          categories={categories}
          selectedId={selectedCategoryId}
          onChange={handleCategoryChange}
        />
        <SortSelect
          value={sortOrder}
          onChange={handleSortChange}
        />
        {hasFilters && (
          <div className="filters-actions">
            <button onClick={handleClearFilters}>Clear All Filters</button>
          </div>
        )}
      </div>

      {status === 'loading' && <div className="state">Loading…</div>}
      {status === 'empty' && <div className="state">No products available.</div>}
      {status === 'no-results' && (
        <div className="no-results">
          <p>No products match your search criteria.</p>
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>
      )}
      {status === 'error' && (
        <div className="state">
          <p>Something went wrong.</p>
          <button onClick={loadProducts}>Retry</button>
        </div>
      )}

      {status === 'ready' && (
        <>
          <ProductList items={items} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </main>
  );
}
