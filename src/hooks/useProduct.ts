import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../data/constants';
import { enrichProduct } from '../data/variants';
import type { ApiProduct, Product } from '../types';

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProduct(productId: number | null): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(Boolean(productId));
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Product not found.');
        }

        const data = (await response.json()) as ApiProduct;
        setProduct(enrichProduct(data));
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Something went wrong while loading this product.',
        );
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [productId, reloadToken]);

  return {
    product,
    loading,
    error,
    refetch: () => setReloadToken((token) => token + 1),
  };
}
