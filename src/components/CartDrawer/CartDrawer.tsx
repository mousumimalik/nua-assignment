import { useEffect } from 'react';
import { useCart } from '../../stores/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartDrawer.module.scss';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    grandTotal,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />

      <aside
        className={`${styles.drawer} ${isOpen ? styles.open : ''}`}
        aria-hidden={!isOpen}
        aria-label="Shopping cart"
        role="dialog"
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Your Cart</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={closeCart}
            aria-label="Close cart"
          >
            ×
          </button>
        </header>

        <div className={styles.content}>
          {items.length === 0 ? (
            <p className={styles.empty}>Your cart is empty.</p>
          ) : (
            <ul className={styles.list}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <img
                    src={item.image}
                    alt=""
                    className={styles.thumbnail}
                    loading="lazy"
                  />

                  <div className={styles.details}>
                    <p className={styles.brand}>{item.brand}</p>
                    <p className={styles.name}>{item.name}</p>
                    <p className={styles.variant}>
                      {item.colorName} · Size {item.size}
                    </p>
                    <p className={styles.price}>{formatPrice(item.unitPrice)}</p>

                    <div className={styles.actions}>
                      <div className={styles.quantity}>
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className={styles.footer}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
              <span>Grand total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}
