export interface SiteConfig {
  languages: string[];
  currency: string;
  contact: {
    telegram?: string;
    whatsapp?: string;
  };
  site_name: string;
  scripts: any[];
  payment_channels: {
    id: number;
    name: string;
    provider_type: string;
    channel_type: string;
    interaction_mode: string;
    fee_rate: string;
  }[];
  captcha: {
    provider: string;
    scenes: Record<string, boolean>;
    turnstile?: {
      site_key: string;
    };
  };
  telegram_auth: {
    enabled: boolean;
    bot_username: string;
  };
}

export type LocalizedString = Record<string, string>;

export interface Category {
  id: number;
  slug: string;
  name: LocalizedString;
  sort_order: number;
  created_at: string;
}

export interface PublicProduct {
  id: number;
  category_id: number;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  content: LocalizedString;
  price_amount: string;
  images: string[];
  tags: string[];
  purchase_type: 'guest' | 'member';
  fulfillment_type: 'manual' | 'auto';
  manual_form_schema: { fields: any[] };
  manual_stock_total: number;
  manual_stock_locked: number;
  manual_stock_sold: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  manual_stock_available: number;
  auto_stock_available: number;
  stock_status: 'unlimited' | 'in_stock' | 'low_stock' | 'out_of_stock';
  is_sold_out: boolean;
}

export interface Post {
  id: number;
  slug: string;
  type: 'blog' | 'notice';
  title: LocalizedString;
  summary: LocalizedString;
  content: LocalizedString;
  thumbnail: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface PublicOrder {
  trade_no: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  total_amount: string;
  created_at: string;
  product: {
    title: LocalizedString;
    images: string[];
  };
  quantity: number;
  deliverables?: {
    content: string;
  }[];
}

// Legacy types (to be migrated/removed later)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  isFeatured?: boolean;
  rating: number;
  label?: string;
  deliveryType: 'auto' | 'manual';
  accessLevel: 'guest' | 'member';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderUpdate {
  date: string;
  status: string;
  note: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'completed' | 'processing' | 'cancelled';
  statusDescription?: string;
  estimatedDelivery?: string;
  items: OrderItem[];
  timeline?: OrderUpdate[];
}

export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  email_verified_at: string;
  locale: string;
  email_change_mode: string;
  password_change_mode: string;
  balance: string;
}

export interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
}
