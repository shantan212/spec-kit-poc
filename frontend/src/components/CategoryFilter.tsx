import type { Category } from '../services/categoriesApi';

type Props = {
  categories: Category[];
  selectedId: string | null;
  onChange: (categoryId: string | null) => void;
};

export default function CategoryFilter({ categories, selectedId, onChange }: Props) {
  return (
    <div className="category-filter">
      <label htmlFor="category-select">Category:</label>
      <select
        id="category-select"
        value={selectedId ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
