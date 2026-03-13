import { PublicProduct, Product, Category, Post, LocalizedString } from '../types';

export const getLocalizedString = (localized: LocalizedString, currentLang: string = 'en-US'): string => {
  if (!localized) return '';
  return localized[currentLang] || localized['zh-CN'] || localized['en-US'] || Object.values(localized)[0] || '';
};

export const mapPublicProductToProduct = (p: PublicProduct, categories: Category[], currentLang: string = 'en-US'): Product => {
  const category = categories.find(c => c.id === p.category_id);
  const categoryName = category ? getLocalizedString(category.name, currentLang) : 'Uncategorized';

  return {
    id: p.slug, // Using slug as ID for routing
    name: getLocalizedString(p.title, currentLang),
    description: getLocalizedString(p.description, currentLang),
    price: parseFloat(p.price_amount),
    category: categoryName,
    stock: p.fulfillment_type === 'manual' ? p.manual_stock_available : p.auto_stock_available,
    image: p.images?.[0] || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80',
    isFeatured: p.tags?.includes('热门') || p.tags?.includes('Featured'),
    rating: 5.0, // Mock rating as API doesn't provide it
    label: p.tags?.[0],
    deliveryType: p.fulfillment_type,
    accessLevel: p.purchase_type,
  };
};
