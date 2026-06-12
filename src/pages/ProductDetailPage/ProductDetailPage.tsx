import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { QuantityPicker } from '../../components/QuantityPicker';
import { VariantSelector } from '../../components/VariantSelector';
import {
  getDefaultVariant,
  getSizeOptionsForColor,
  getVariant,
} from '../../data/variants';
import { SIZES } from '../../data/constants';
import { useProduct } from '../../hooks/useProduct';
import { useCart } from '../../stores/CartContext';
import type { Size } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import styles from './ProductDetailPage.module.scss';

function isValidSize(value: string | null): value is Size {
  return value !== null && SIZES.includes(value as Size);
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : null;
  const { product, loading, error, refetch } = useProduct(productId);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const resolvedVariant = useMemo(() => {
    if (!product) return null;

    const defaults = getDefaultVariant(product);
    const colorParam = searchParams.get('color');
    const sizeParam = searchParams.get('size');

    const colorId = product.colors.some((color) => color.id === colorParam)
      ? (colorParam as string)
      : defaults.colorId;

    const sizesForColor = getSizeOptionsForColor(product, colorId);
    const preferredSize = isValidSize(sizeParam) ? sizeParam : defaults.size;
    const sizeOption = sizesForColor.find((option) => option.size === preferredSize);
    const size =
      sizeOption && sizeOption.status !== 'sold-out'
        ? sizeOption.size
        : sizesForColor.find((option) => option.status !== 'sold-out')?.size ??
          sizesForColor[0]?.size ??
          defaults.size;

    return {
      colorId,
      size,
      variant: getVariant(product, colorId, size),
      sizes: sizesForColor,
    };
  }, [product, searchParams]);

  useEffect(() => {
    if (!product || !resolvedVariant) return;

    const colorParam = searchParams.get('color');
    const sizeParam = searchParams.get('size');

    if (
      colorParam === resolvedVariant.colorId &&
      sizeParam === resolvedVariant.size
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set('color', resolvedVariant.colorId);
    params.set('size', resolvedVariant.size);
    setSearchParams(params, { replace: true });
  }, [product, resolvedVariant, searchParams, setSearchParams]);

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
  }, [product?.id, resolvedVariant?.colorId, resolvedVariant?.size]);

  const updateVariant = useCallback(
    (colorId: string, size: Size) => {
      const params = new URLSearchParams(searchParams);
      params.set('color', colorId);
      params.set('size', size);
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleColorChange = (colorId: string) => {
    if (!product || !resolvedVariant) return;

    const sizesForColor = getSizeOptionsForColor(product, colorId);
    const currentSizeStillValid = sizesForColor.find(
      (option) =>
        option.size === resolvedVariant.size && option.status !== 'sold-out',
    );
    const fallbackSize =
      sizesForColor.find((option) => option.status !== 'sold-out')?.size ??
      sizesForColor[0]?.size ??
      'M';

    updateVariant(colorId, currentSizeStillValid?.size ?? fallbackSize);
  };

  const handleSizeChange = (size: Size) => {
    if (!resolvedVariant) return;
    updateVariant(resolvedVariant.colorId, size);
  };

  const handleAddToCart = () => {
    if (!product || !resolvedVariant?.variant) return;

    addToCart({
      product,
      colorId: resolvedVariant.colorId,
      size: resolvedVariant.size,
      quantity,
    });
  };

  if (loading) {
    return <LoadingSpinner label="Loading product" />;
  }

  if (error || !product || !resolvedVariant) {
    return (
      <ErrorMessage
        message={error ?? 'Product not found.'}
        onRetry={() => (productId ? refetch() : navigate('/'))}
      />
    );
  }

  const { variant, sizes, colorId, size } = resolvedVariant;
  const isSoldOut = variant?.status === 'sold-out';
  const maxQuantity = Math.max(variant?.stock ?? 0, 1);
  const activeImage = product.thumbnails[activeImageIndex] ?? product.image;

  return (
    <div className={styles.page}>
      <div className={styles.gallery}>
        <div className={styles.mainImageWrap}>
          <img
            src={activeImage}
            alt={product.name}
            className={styles.mainImage}
          />
        </div>

        <div className={styles.thumbnails} role="tablist" aria-label="Product images">
          {product.thumbnails.map((thumbnail, index) => (
            <button
              key={thumbnail}
              type="button"
              role="tab"
              aria-selected={activeImageIndex === index}
              className={`${styles.thumbnailButton} ${activeImageIndex === index ? styles.active : ''}`}
              onClick={() => setActiveImageIndex(index)}
            >
              <img src={thumbnail} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.details}>
        <p className={styles.brand}>{product.brand}</p>
        <h1 className={styles.name}>{product.name}</h1>

        <div className={styles.priceRow}>
          {product.originalPrice && (
            <span className={styles.originalPrice}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>

        <p className={styles.description}>{product.description}</p>

        <VariantSelector
          colors={product.colors}
          sizes={sizes}
          selectedColorId={colorId}
          selectedSize={size}
          onColorChange={handleColorChange}
          onSizeChange={handleSizeChange}
        />

        <QuantityPicker
          value={quantity}
          max={maxQuantity}
          disabled={isSoldOut}
          onChange={setQuantity}
        />

        <button
          type="button"
          className={styles.addToCart}
          onClick={handleAddToCart}
          disabled={isSoldOut}
        >
          {isSoldOut ? 'Sold out' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
