import type { ColorOption, Size } from '../types';

export const API_BASE_URL = 'https://fakestoreapi.com';

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL'];

export const LOW_STOCK_THRESHOLD = 3;

export const CART_STORAGE_KEY = 'nua-cart';

export const COLOR_PALETTE: ColorOption[] = [
  { id: 'black', name: 'Black', hex: '#1a1a1a' },
  { id: 'navy', name: 'Navy', hex: '#1e3a5f' },
  { id: 'white', name: 'White', hex: '#f5f5f5' },
  { id: 'red', name: 'Red', hex: '#c0392b' },
  { id: 'green', name: 'Forest', hex: '#2d5016' },
  { id: 'beige', name: 'Beige', hex: '#d4c4a8' },
  { id: 'grey', name: 'Grey', hex: '#7f8c8d' },
  { id: 'blue', name: 'Sky', hex: '#3498db' },
];

export const BRAND_BY_CATEGORY: Record<string, string[]> = {
  "men's clothing": ['Urban Edge', 'Northline', 'Forge & Co.'],
  "women's clothing": ['Luna Studio', 'Ember & Silk', 'Field Notes'],
  electronics: ['NovaTech', 'Pulse Audio', 'ClearView'],
  jewelery: ['Aurum', 'Stone & Light', 'Meridian'],
  default: ['NUA Essentials', 'Standard Co.', 'Form Studio'],
};
