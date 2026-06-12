export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

export type StockStatus = 'available' | 'low' | 'sold-out';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface SizeOption {
  size: Size;
  stock: number;
  status: StockStatus;
}

export interface ProductVariant {
  colorId: string;
  size: Size;
  stock: number;
  status: StockStatus;
}

export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  thumbnails: string[];
  colors: ColorOption[];
  sizes: SizeOption[];
  variants: ProductVariant[];
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  brand: string;
  image: string;
  colorId: string;
  colorName: string;
  size: Size;
  unitPrice: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type AddToCartPayload = {
  product: Product;
  colorId: string;
  size: Size;
  quantity: number;
};
