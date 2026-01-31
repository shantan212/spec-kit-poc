type SortOption = 'name_asc' | 'price_asc';

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export default function SortSelect({ value, onChange }: Props) {
  return (
    <div className="sort-select">
      <label htmlFor="sort-select">Sort by:</label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="Sort products"
      >
        <option value="name_asc">Name (A→Z)</option>
        <option value="price_asc">Price (Low→High)</option>
      </select>
    </div>
  );
}
