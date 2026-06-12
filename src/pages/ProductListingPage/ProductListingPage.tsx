import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ProductGrid } from '../../components/ProductGrid';
import { useProducts } from '../../hooks/useProducts';
import styles from './ProductListingPage.module.scss';

export function ProductListingPage() {
  const { products, loading, error, refetch } = useProducts();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Curated essentials</p>
        <h1 className={styles.title}>Shop all products</h1>
        <p className={styles.subtitle}>
          Discover our full collection — add favourites straight to your cart or explore the details.
        </p>
      </header>

      {loading && <LoadingSpinner label="Loading products" />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && <ProductGrid products={products} />}
    </div>
  );
}
