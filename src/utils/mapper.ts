import {
  ApiOrder,
  Category,
  LocalizedString,
  OrderDeliverable,
  OrderLineItem,
  OrderSummary,
  Product,
  PublicProduct,
} from '../types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80';

export const getLocalizedString = (
  localized: LocalizedString | null | undefined,
  currentLang = 'en-US',
): string => {
  if (!localized) return '';
  return (
    localized[currentLang] ||
    localized['zh-CN'] ||
    localized['en-US'] ||
    Object.values(localized)[0] ||
    ''
  );
};

export const mapPublicProductToProduct = (
  product: PublicProduct,
  categories: Category[],
  currentLang = 'en-US',
): Product => {
  const category = categories.find((item) => item.id === product.category_id);
  const categoryName = category ? getLocalizedString(category.name, currentLang) : 'Uncategorized';

  let stock = product.fulfillment_type === 'manual' ? product.manual_stock_available : product.auto_stock_available;
  if (product.stock_status === 'unlimited' || stock < 0) {
    stock = 9999;
  }

  return {
    id: product.slug,
    slug: product.slug,
    productId: product.id,
    name: getLocalizedString(product.title, currentLang),
    description: getLocalizedString(product.description, currentLang),
    price: Number.parseFloat(product.price_amount),
    category: categoryName,
    stock,
    stockStatus: product.stock_status,
    image: product.images?.[0] || FALLBACK_IMAGE,
    isFeatured: product.tags?.includes('Featured') || product.tags?.includes('热门'),
    rating: 5,
    label: product.tags?.[0],
    deliveryType: product.fulfillment_type,
    accessLevel: product.purchase_type,
  };
};

const stringifyDeliverable = (value: unknown): string[] => {
  if (value == null) return [];
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => stringifyDeliverable(item));
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.content === 'string' && record.content.trim()) {
      return [record.content.trim()];
    }
    if (typeof record.text === 'string' && record.text.trim()) {
      return [record.text.trim()];
    }
    if (Array.isArray(record.cards)) {
      return record.cards.flatMap((item) => stringifyDeliverable(item));
    }
    return [JSON.stringify(record, null, 2)];
  }
  return [String(value)];
};

export const mapApiOrderToSummary = (order: ApiOrder, currentLang = 'en-US'): OrderSummary => {
  const items: OrderLineItem[] = (order.items || []).map((item) => ({
    id: String(item.id),
    title: getLocalizedString(item.title, currentLang),
    image: FALLBACK_IMAGE,
    quantity: item.quantity,
    totalAmount: item.total_price,
  }));

  const deliverables: OrderDeliverable[] = [
    ...stringifyDeliverable(order.fulfillment?.payload),
    ...stringifyDeliverable(order.fulfillment?.logistics_json),
  ].map((content) => ({ content }));

  return {
    orderNo: order.order_no,
    status: order.status,
    totalAmount: order.total_amount,
    createdAt: order.created_at,
    items,
    deliverables,
  };
};

export const formatCurrencyAmount = (currency: string | undefined, amount: string | number): string => {
  const numeric = typeof amount === 'number' ? amount : Number.parseFloat(amount || '0');
  const prefix = currency || '';
  return `${prefix}${Number.isFinite(numeric) ? numeric.toLocaleString() : amount}`;
};
