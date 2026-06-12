import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../data/constants';
import { enrichProduct } from '../data/variants';
import type { ApiProduct, Product } from '../types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Unable to load products. Please try again.');
        }

        const data = (await response.json()) as ApiProduct[];
        setProducts(data.map(enrichProduct));
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Something went wrong while loading products.',
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [reloadToken]);

  return {
    products,
    loading,
    error,
    refetch: () => setReloadToken((token) => token + 1),
  };
}
