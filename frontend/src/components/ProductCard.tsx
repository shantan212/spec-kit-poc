import type { Product } from '../services/productsApi';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="pl-card" tabIndex={0} aria-label={`Product: ${product.name}`}>
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="pl-card__image"
          loading="lazy"
        />
      ) : (
        <div className="pl-card__image-placeholder" aria-hidden="true">
          No image
        </div>
      )}
      <div className="pl-card__title">{product.name}</div>
      {product.price?.amount != null && (
        <div className="pl-card__meta" aria-label={`Price: ${product.price.amount} ${product.price.currency}`}>
          {product.price.amount} {product.price.currency}
        </div>
      )}
    </article>
  );
}
