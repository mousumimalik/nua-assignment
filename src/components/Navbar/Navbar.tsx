import { Link } from 'react-router-dom';
import { useCart } from '../../stores/CartContext';
import styles from './Navbar.module.scss';

export function Navbar() {
  const { itemCount, toggleCart } = useCart();

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          NUA
        </Link>

        <button
          type="button"
          className={styles.cartButton}
          onClick={toggleCart}
          aria-label={`Open cart, ${itemCount} items`}
        >
          <svg
            className={styles.cartIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path d="M6 6h15l-1.5 9h-12z" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M6 6L5 3H2" />
          </svg>
          {itemCount > 0 && (
            <span className={styles.badge} aria-hidden="true">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
