import type { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import styles from './ProductGrid.module.scss';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
