import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CART_STORAGE_KEY } from '../data/constants';
import { createCartItemId } from '../data/variants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AddToCartPayload, CartItem } from '../types';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  grandTotal: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (payload: AddToCartPayload) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

interface StoredCart {
  items: CartItem[];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [storedCart, setStoredCart] = useLocalStorage<StoredCart>(CART_STORAGE_KEY, {
    items: [],
  });
  const [isOpen, setIsOpen] = useState(false);

  const items = storedCart.items;

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items],
  );

  const grandTotal = subtotal;

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const addToCart = useCallback(
    ({ product, colorId, size, quantity }: AddToCartPayload) => {
      const color = product.colors.find((option) => option.id === colorId);
      const itemId = createCartItemId(product.id, colorId, size);

      setStoredCart((current) => {
        const existing = current.items.find((item) => item.id === itemId);

        if (existing) {
          return {
            items: current.items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          };
        }

        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          colorId,
          colorName: color?.name ?? colorId,
          size,
          unitPrice: product.price,
          quantity,
        };

        return { items: [...current.items, newItem] };
      });

      setIsOpen(true);
    },
    [setStoredCart],
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        setStoredCart((current) => ({
          items: current.items.filter((item) => item.id !== itemId),
        }));
        return;
      }

      setStoredCart((current) => ({
        items: current.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        ),
      }));
    },
    [setStoredCart],
  );

  const removeItem = useCallback(
    (itemId: string) => {
      setStoredCart((current) => ({
        items: current.items.filter((item) => item.id !== itemId),
      }));
    },
    [setStoredCart],
  );

  const clearCart = useCallback(() => {
    setStoredCart({ items: [] });
  }, [setStoredCart]);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      grandTotal,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      isOpen,
      itemCount,
      subtotal,
      grandTotal,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
