import {
  BRAND_BY_CATEGORY,
  COLOR_PALETTE,
  LOW_STOCK_THRESHOLD,
  SIZES,
} from './constants';
import type {
  ApiProduct,
  ColorOption,
  Product,
  ProductVariant,
  Size,
  SizeOption,
  StockStatus,
} from '../types';

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'sold-out';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'available';
}

function getBrand(category: string, productId: number): string {
  const brands = BRAND_BY_CATEGORY[category] ?? BRAND_BY_CATEGORY.default;
  return brands[productId % brands.length];
}

function getColors(productId: number): ColorOption[] {
  const count = 3 + (productId % 2);
  const start = productId % COLOR_PALETTE.length;
  const colors: ColorOption[] = [];

  for (let i = 0; i < count; i += 1) {
    colors.push(COLOR_PALETTE[(start + i) % COLOR_PALETTE.length]);
  }

  return colors;
}

function getVariantStock(productId: number, colorId: string, size: Size): number {
  const seed = hashSeed(`${productId}-${colorId}-${size}`);
  const bucket = seed % 10;

  if (bucket === 0) return 0;
  if (bucket <= 2) return 1 + (seed % LOW_STOCK_THRESHOLD);
  return 4 + (seed % 12);
}

function buildVariants(productId: number, colors: ColorOption[]): ProductVariant[] {
  return colors.flatMap((color) =>
    SIZES.map((size) => {
      const stock = getVariantStock(productId, color.id, size);
      return {
        colorId: color.id,
        size,
        stock,
        status: getStockStatus(stock),
      };
    }),
  );
}

function buildSizes(productId: number, colors: ColorOption[]): SizeOption[] {
  return SIZES.map((size) => {
    const stocks = colors.map((color) => getVariantStock(productId, color.id, size));
    const stock = Math.max(...stocks);
    return {
      size,
      stock,
      status: getStockStatus(stock),
    };
  });
}

function getThumbnails(productId: number, primaryImage: string): string[] {
  return [
    primaryImage,
    `https://picsum.photos/seed/nua-${productId}-1/600/600`,
    `https://picsum.photos/seed/nua-${productId}-2/600/600`,
    `https://picsum.photos/seed/nua-${productId}-3/600/600`,
  ];
}

export function enrichProduct(apiProduct: ApiProduct): Product {
  const colors = getColors(apiProduct.id);
  const variants = buildVariants(apiProduct.id, colors);
  const onSale = apiProduct.id % 3 === 0;

  return {
    id: apiProduct.id,
    name: apiProduct.title,
    brand: getBrand(apiProduct.category, apiProduct.id),
    description: apiProduct.description,
    category: apiProduct.category,
    price: apiProduct.price,
    originalPrice: onSale ? Number((apiProduct.price * 1.25).toFixed(2)) : undefined,
    image: apiProduct.image,
    thumbnails: getThumbnails(apiProduct.id, apiProduct.image),
    colors,
    sizes: buildSizes(apiProduct.id, colors),
    variants,
    rating: apiProduct.rating,
  };
}

export function getVariant(
  product: Product,
  colorId: string,
  size: Size,
): ProductVariant | undefined {
  return product.variants.find(
    (variant) => variant.colorId === colorId && variant.size === size,
  );
}

export function getDefaultVariant(product: Product): { colorId: string; size: Size } {
  const available = product.variants.find((variant) => variant.status !== 'sold-out');

  if (available) {
    return { colorId: available.colorId, size: available.size };
  }

  return {
    colorId: product.colors[0]?.id ?? 'black',
    size: product.sizes[0]?.size ?? 'M',
  };
}

export function getSizeOptionsForColor(
  product: Product,
  colorId: string,
): SizeOption[] {
  return SIZES.map((size) => {
    const variant = getVariant(product, colorId, size);
    const stock = variant?.stock ?? 0;
    return {
      size,
      stock,
      status: getStockStatus(stock),
    };
  });
}

export function createCartItemId(productId: number, colorId: string, size: Size): string {
  return `${productId}-${colorId}-${size}`;
}
