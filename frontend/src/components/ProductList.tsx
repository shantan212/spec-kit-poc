import type { Product } from '../services/productsApi';
import ProductCard from './ProductCard';

export default function ProductList({ items }: { items: Product[] }) {
  return (
    <section className="pl-grid" aria-label="Product list">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </section>
  );
}
