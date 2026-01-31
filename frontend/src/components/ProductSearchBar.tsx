type Props = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export default function ProductSearchBar({ value, onChange, onClear }: Props) {
  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search products by name"
      />
      {value && (
        <button type="button" onClick={onClear} aria-label="Clear search">
          Clear
        </button>
      )}
    </div>
  );
}
