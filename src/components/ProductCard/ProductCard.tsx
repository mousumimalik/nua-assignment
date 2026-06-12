import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { getDefaultVariant } from '../../data/variants';
import { useCart } from '../../stores/CartContext';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const defaultVariant = getDefaultVariant(product);

  const handleQuickAdd = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart({
      product,
      colorId: defaultVariant.colorId,
      size: defaultVariant.size,
      quantity: 1,
    });
  };

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.link}>
        <div className={styles.imageWrap}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        </div>

        <div className={styles.info}>
          <p className={styles.brand}>{product.brand}</p>
          <h2 className={styles.name}>{product.name}</h2>
          <div className={styles.priceRow}>
            {product.originalPrice && (
              <span className={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className={styles.price}>{formatPrice(product.price)}</span>
          </div>
        </div>
      </Link>

      <button type="button" className={styles.quickAdd} onClick={handleQuickAdd}>
        Quick Add
      </button>
    </article>
  );
}
