export type LocalizedString = Record<string, string>;

export interface SiteConfig {
  languages: string[];
  currency: string;
  contact: {
    telegram?: string;
    whatsapp?: string;
  };
  site_name?: string;
  scripts: unknown[];
  payment_channels: {
    id: number;
    name: string;
    provider_type: string;
    channel_type: string;
    interaction_mode: string;
    fee_rate: string;
    fixed_fee?: string;
  }[];
  captcha: {
    provider: string;
    scenes: {
      login?: boolean;
      guest_create_order?: boolean;
      register_send_code?: boolean;
      reset_send_code?: boolean;
      gift_card_redeem?: boolean;
    };
    turnstile?: {
      site_key: string;
    };
  };
  telegram_auth: {
    enabled: boolean;
    bot_username: string;
  };
}

export interface Category {
  id: number;
  slug: string;
  name: LocalizedString;
  sort_order?: number;
  created_at?: string;
}

export interface PublicProduct {
  id: number;
  category_id: number;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  content?: LocalizedString | null;
  price_amount: string;
  images: string[];
  tags: string[];
  purchase_type: 'guest' | 'member';
  fulfillment_type: 'manual' | 'auto';
  manual_form_schema?: { fields?: unknown[] } | null;
  manual_stock_total: number;
  manual_stock_locked: number;
  manual_stock_sold: number;
  auto_stock_available: number;
  manual_stock_available: number;
  stock_status: 'unlimited' | 'in_stock' | 'low_stock' | 'out_of_stock';
  is_sold_out: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  slug: string;
  type: 'blog' | 'notice';
  title: LocalizedString;
  summary: LocalizedString;
  content: LocalizedString;
  thumbnail?: string;
  is_published: boolean;
  published_at?: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  productId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  stockStatus: PublicProduct['stock_status'];
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

export interface ApiOrderItem {
  id: number;
  product_id: number;
  title: LocalizedString;
  quantity: number;
  unit_price: string;
  total_price: string;
  fulfillment_type: string;
}

export interface ApiFulfillment {
  type: string;
  status: string;
  payload?: unknown;
  logistics_json?: unknown;
  delivered_at?: string | null;
}

export interface ApiOrder {
  id: number;
  order_no: string;
  status: string;
  total_amount: string;
  created_at: string;
  items?: ApiOrderItem[];
  fulfillment?: ApiFulfillment | null;
}

export interface OrderLineItem {
  id: string;
  title: string;
  image: string;
  quantity: number;
  totalAmount: string;
}

export interface OrderDeliverable {
  content: string;
}

export interface OrderSummary {
  orderNo: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  items: OrderLineItem[];
  deliverables: OrderDeliverable[];
}

export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  email_verified_at?: string | null;
  locale?: string;
  email_change_mode?: string;
  password_change_mode?: string;
}

export interface WalletAccountData {
  id?: number;
  user_id?: number;
  balance: string;
  created_at?: string;
  updated_at?: string;
}

export interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
}
