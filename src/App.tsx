/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useParams,
  useLocation,
  Navigate
} from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  CreditCard,
  LayoutGrid,
  History,
  HelpCircle,
  Headphones,
  TrendingUp,
  Star,
  Bell,
  User,
  ArrowUpRight,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Lock,
  Twitter,
  Instagram,
  Wallet,
  Key,
  Settings,
  LogOut,
  Activity,
  Shield,
  Copy,
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';

// --- Types ---
interface Product {
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
  accessLevel: 'all' | 'member';
}

interface CartItem extends Product {
  quantity: number;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderUpdate {
  date: string;
  status: string;
  note: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'completed' | 'processing' | 'cancelled';
  statusDescription?: string;
  estimatedDelivery?: string;
  items: OrderItem[];
  timeline?: OrderUpdate[];
}

interface UserProfile {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContextType {
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`px-6 py-3 rounded-full text-[10px] font-black tracking-widest uppercase shadow-2xl flex items-center gap-3 pointer-events-auto ${
                toast.type === 'error' ? 'bg-red-500 text-white' : 
                toast.type === 'info' ? 'bg-blue-500 text-white' : 
                'bg-brand text-surface'
              }`}
            >
              {toast.type === 'error' ? <ShieldCheck size={14} /> : <CheckCircle2 size={14} />}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    setUser(data);
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Signup failed');
    setUser(data);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/login';
  };

  const updateProfile = async (name: string) => {
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Update failed');
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Mock Data ---
const CATEGORIES = [
  { name: "全部商品", count: 128 },
  { name: "软件激活", count: 42 },
  { name: "游戏点卡", count: 35 },
  { name: "会员充值", count: 28 },
  { name: "社交账号", count: 15 },
  { name: "开发工具", count: 8 }
];

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'NordVPN Ultra Premium',
    description: 'The pinnacle of digital privacy. 6000+ servers with military-grade encryption.',
    price: 199.00,
    category: '软件激活',
    stock: 128,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    rating: 4.9,
    label: 'EDITOR\'S CHOICE',
    deliveryType: 'auto',
    accessLevel: 'all'
  },
  {
    id: '2',
    name: 'Steam Global $100',
    description: 'Instant digital delivery. Unlock thousands of titles worldwide.',
    price: 680.00,
    category: '游戏点卡',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    deliveryType: 'auto',
    accessLevel: 'all'
  },
  {
    id: '3',
    name: 'ChatGPT Plus Enterprise',
    description: 'Unleash the full power of GPT-4 with priority access and advanced tools.',
    price: 158.00,
    category: '会员充值',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 5.0,
    label: 'MOST POPULAR',
    deliveryType: 'manual',
    accessLevel: 'member'
  },
  {
    id: '4',
    name: 'JetBrains Master Suite',
    description: 'The complete collection of professional IDEs for elite developers.',
    price: 88.00,
    category: '开发工具',
    stock: 89,
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    deliveryType: 'auto',
    accessLevel: 'all'
  },
  {
    id: '5',
    name: 'Netflix 4K UHD Private',
    description: 'Exclusive 4K streaming experience. Private profile, zero interruptions.',
    price: 25.00,
    category: '会员充值',
    stock: 230,
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    deliveryType: 'manual',
    accessLevel: 'all'
  },
  {
    id: '6',
    name: 'Adobe Creative Cloud',
    description: 'The industry standard for creative professionals. 20+ apps included.',
    price: 299.00,
    category: '软件激活',
    stock: 5,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    deliveryType: 'manual',
    accessLevel: 'member'
  },
  {
    id: '7',
    name: 'Spotify Premium Family',
    description: 'Ad-free music for the whole family. High-fidelity sound quality.',
    price: 15.00,
    category: '会员充值',
    stock: 0,
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    deliveryType: 'auto',
    accessLevel: 'all'
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8842',
    date: '2026-03-05T14:20:00Z',
    total: 357.00,
    status: 'completed',
    statusDescription: 'All digital keys have been successfully delivered to your vault.',
    estimatedDelivery: '2026-03-05T14:21:00Z',
    items: [
      { id: '1', name: 'NordVPN Ultra Premium', price: 199.00, quantity: 1, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
      { id: '3', name: 'ChatGPT Plus Enterprise', price: 158.00, quantity: 1, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80' }
    ],
    timeline: [
      { date: '2026-03-05T14:20:00Z', status: 'Order Placed', note: 'Transaction initiated via secure gateway.' },
      { date: '2026-03-05T14:20:30Z', status: 'Processing', note: 'Verifying digital assets and generating unique keys.' },
      { date: '2026-03-05T14:21:00Z', status: 'Completed', note: 'Keys delivered to the customer archive.' }
    ]
  },
  {
    id: 'ORD-2026-9120',
    date: '2026-02-28T09:15:00Z',
    total: 88.00,
    status: 'completed',
    statusDescription: 'Archive entry finalized. Professional suite activated.',
    estimatedDelivery: '2026-02-28T09:16:00Z',
    items: [
      { id: '4', name: 'JetBrains Master Suite', price: 88.00, quantity: 1, image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80' }
    ],
    timeline: [
      { date: '2026-02-28T09:15:00Z', status: 'Order Placed', note: 'Acquisition started.' },
      { date: '2026-02-28T09:16:00Z', status: 'Completed', note: 'Master Suite keys issued.' }
    ]
  }
];

// --- Components ---

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-28 right-8 w-12 h-12 bg-surface/80 backdrop-blur-md border border-white/10 text-brand rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center z-[55] hover:bg-brand hover:text-surface transition-all group"
          aria-label="Scroll to top"
        >
          <ArrowUpRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const Sidebar = ({ activeCategory, setActiveCategory }: any) => {
  return (
    <aside className="hidden lg:flex flex-col w-20 xl:w-64 h-screen sticky top-0 sidebar-luxury py-12 px-4 xl:px-8">
      <Link to="/" className="flex items-center justify-center xl:justify-start gap-3 mb-20">
        <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center">
          <Zap className="text-surface fill-surface" size={20} />
        </div>
        <span className="hidden xl:block text-xl font-serif font-bold tracking-tight italic">Nova.</span>
      </Link>

      <nav className="flex-grow space-y-12">
        <div className="space-y-6">
          <p className="hidden xl:block text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Collections</p>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`w-full flex items-center justify-center xl:justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all group whitespace-nowrap ${
                  activeCategory === cat.name 
                  ? 'bg-white/5 text-brand' 
                  : 'text-white/40 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-1 h-1 rounded-full transition-all ${activeCategory === cat.name ? 'bg-brand scale-100' : 'bg-transparent scale-0'}`} />
                  <span className="hidden xl:block whitespace-nowrap">{cat.name}</span>
                </span>
                <span className="hidden xl:block text-[10px] opacity-30 ml-4">{cat.count}</span>
                <LayoutGrid size={18} className="xl:hidden" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <p className="hidden xl:block text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Support</p>
          <div className="space-y-4 flex flex-col items-center xl:items-start">
            <Link to="/lookup" className="text-white/40 hover:text-brand transition-colors whitespace-nowrap flex items-center gap-3">
              <Search size={20} />
              <span className="hidden xl:block text-xs">Track Order</span>
            </Link>
            <Link to="/orders" className="text-white/40 hover:text-brand transition-colors whitespace-nowrap flex items-center gap-3">
              <History size={20} />
              <span className="hidden xl:block text-xs">Order History</span>
            </Link>
            <button className="text-white/40 hover:text-brand transition-colors whitespace-nowrap flex items-center gap-3">
              <HelpCircle size={20} />
              <span className="hidden xl:block text-xs">Concierge</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-8 border-t border-white/5 flex justify-center xl:justify-start">
        <button className="w-10 h-10 xl:w-full xl:h-auto xl:py-3 rounded-full xl:rounded-xl bg-white/5 flex items-center justify-center gap-3 text-white/40 hover:text-white transition-all">
          <User size={18} />
          <span className="hidden xl:block text-xs font-bold">Account</span>
        </button>
      </div>
    </aside>
  );
};

const Header = ({ cartCount, onOpenCart, searchQuery, setSearchQuery, cartBump }: any) => {
  const { scrollY, scrollYProgress } = useScroll();
  const { user } = useAuth();
  
  // Dynamic header styles based on scroll
  const headerPadding = useTransform(scrollY, [0, 100], ['1.5rem', '0.75rem']);
  const headerBg = useTransform(
    scrollY, 
    [0, 100], 
    ['rgba(10, 10, 10, 0.8)', 'rgba(10, 10, 10, 0.95)']
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.15)']
  );

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.header 
      style={{ 
        paddingTop: headerPadding, 
        paddingBottom: headerPadding,
        backgroundColor: headerBg,
        borderBottomColor: headerBorder
      }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 md:px-16 backdrop-blur-xl border-b"
    >
      <motion.div 
        className="absolute top-0 left-0 right-0 h-[1px] bg-brand origin-left z-[110]"
        style={{ scaleX }}
      />
      <div className="flex items-center gap-12">
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          <Link to="/" className="hover:text-brand transition-colors">Boutique</Link>
          <Link to="/news" className="hover:text-brand transition-colors">Journal</Link>
          <a href="#" className="hover:text-brand transition-colors">Archive</a>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="SEARCH CATALOGUE" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-b border-white/10 pl-8 pr-4 py-2 text-[10px] font-bold tracking-widest focus:outline-none focus:border-brand transition-all w-48"
          />
        </div>
        <button 
          onClick={onOpenCart}
          className="relative text-white/60 hover:text-white transition-colors"
        >
          <motion.div
            animate={cartBump ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ShoppingCart size={20} />
          </motion.div>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-brand text-[8px] font-black flex items-center justify-center rounded-full text-surface">
              {cartCount}
            </span>
          )}
        </button>
        {user ? (
          <Link to="/dashboard" className="flex items-center gap-3 px-6 py-2.5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest hover:bg-white hover:text-black transition-all">
            <span className="text-brand uppercase">{user.name || 'Collector'}</span>
          </Link>
        ) : (
          <Link to="/login" className="px-6 py-2.5 bg-brand text-black rounded-full text-[10px] font-black tracking-widest hover:bg-white transition-all">
            LOGIN
          </Link>
        )}
      </div>
    </motion.header>
  );
};

const ProductCard = ({ product, addToCart }: { product: Product, addToCart: (p: Product) => void, key?: any }) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-50px" }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
      animate={isAdding ? { 
        scale: [1, 0.98, 1.02, 1],
        borderColor: ['rgba(255,255,255,0.05)', 'rgba(212,175,55,0.5)', 'rgba(255,255,255,0.05)']
      } : {}}
      transition={{ 
        duration: 0.8, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      className={`group relative flex flex-col bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-brand/30 transition-all duration-700 overflow-hidden ${isOutOfStock ? 'opacity-60 grayscale-[0.5]' : ''}`}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block">
          {/* Image Container with Refined Hover */}
          <div className="relative aspect-square overflow-hidden bg-neutral-900">
            <img 
              src={product.image} 
              alt={product.name} 
              className={`w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-out ${isOutOfStock ? 'grayscale' : ''}`}
              referrerPolicy="no-referrer"
            />
            
            {/* Sold Out Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                <span className="text-[10px] font-black tracking-[0.4em] text-white/40 border border-white/10 px-4 py-2 uppercase">Sold Out</span>
              </div>
            )}

            {/* Subtle Inner Shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none" />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              {product.label ? (
                <span className="text-[7px] font-black tracking-[0.2em] text-brand bg-surface/90 backdrop-blur-md px-2 py-1 border border-brand/20 uppercase">
                  {product.label}
                </span>
              ) : <div />}
              
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-sm border border-white/5">
                <Star size={8} className="text-brand fill-brand" />
                <span className="text-[8px] font-bold text-white/70">{product.rating}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Quick Add Button */}
        {!isOutOfStock && (
          <motion.button 
            onClick={handleAddToCart}
            animate={isAdding ? { 
              backgroundColor: ['#D4AF37', '#FFFFFF', '#D4AF37'],
              scale: 1.1
            } : {}}
            className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl z-10 ${
              isAdding ? 'text-brand' : 'bg-brand text-surface shadow-brand/20'
            }`}
          >
            {isAdding ? <CheckCircle2 size={16} /> : <ShoppingCart size={16} />}
          </motion.button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold text-brand/60 uppercase tracking-[0.2em]">{product.category}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className={`text-[7px] font-black uppercase tracking-widest ${product.deliveryType === 'auto' ? 'text-emerald-500/80' : 'text-amber-500/80'}`}>
                  {product.deliveryType === 'auto' ? '自动发货' : '人工发货'}
                </span>
              </div>
              <h3 className="text-sm font-serif italic leading-tight group-hover:text-white transition-colors line-clamp-1">{product.name}</h3>
            </div>
          </div>
        </Link>

        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-4">
          {/* Stock Scarcity Bar for Low Stock */}
          {isLowStock && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Limited Availability</span>
                <span className="text-[8px] font-bold text-amber-500">{product.stock} Left</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(product.stock / 10) * 100}%` }}
                  className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                />
              </div>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Pricing</span>
              <p className={`text-base font-display font-light transition-all ${isOutOfStock ? 'text-white/20' : 'group-hover:gold-gradient'}`}>
                ¥{product.price.toLocaleString()}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Status</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold uppercase tracking-tighter ${
                  isOutOfStock ? 'text-red-500/50' : 
                  isLowStock ? 'text-amber-500/80' : 
                  'text-emerald-500/80'
                }`}>
                  {isOutOfStock ? 'Sold Out' : isLowStock ? 'Low Stock' : 'Available'}
                </span>
                <div className={`w-1 h-1 rounded-full ${
                  isOutOfStock ? 'bg-red-500/30' : 
                  isLowStock ? 'bg-amber-500 animate-pulse' : 
                  'bg-emerald-500'
                }`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Corner Accent */}
      {!isOutOfStock && (
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/0 group-hover:border-brand/40 transition-all duration-700" />
      )}
    </motion.div>
  );
};

const FeaturedProductCard = ({ product, addToCart }: { product: Product, addToCart: (p: Product) => void, key?: any }) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 60, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      animate={isAdding ? { 
        scale: [1, 0.99, 1.01, 1],
        backgroundColor: ['rgba(212,175,55,0.03)', 'rgba(212,175,55,0.1)', 'rgba(212,175,55,0.03)']
      } : {}}
      transition={{ 
        duration: 1.2, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      className={`group relative grid grid-cols-1 md:grid-cols-2 bg-brand/[0.03] border border-brand/20 hover:border-brand/50 transition-all duration-700 overflow-hidden ${isOutOfStock ? 'opacity-70 grayscale-[0.3]' : ''}`}
    >
      {/* Image Side */}
      <div className="relative aspect-square md:aspect-auto overflow-hidden bg-neutral-900">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ${isOutOfStock ? 'grayscale' : ''}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/80 to-transparent md:hidden" />
        
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="text-sm font-black tracking-[0.6em] text-white/60 border-y border-white/10 py-4 uppercase">Sold Out</span>
          </div>
        )}
      </div>

      {/* Content Side */}
      <div className="p-8 md:p-12 flex flex-col justify-center relative">
        {/* Label & Status */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[10px] font-black tracking-[0.4em] text-brand bg-brand/10 px-4 py-2 border border-brand/30 uppercase">
            {product.label || 'FEATURED'}
          </span>
          {isLowStock && (
            <span className="text-[9px] font-bold text-amber-500 animate-pulse uppercase tracking-widest">
              Only {product.stock} Left
            </span>
          )}
        </div>

        <h3 className="text-3xl md:text-4xl font-serif italic mb-4 leading-tight">{product.name}</h3>
        <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-md">
          {product.description}
        </p>

        <div className="flex items-center gap-8 mb-10">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Premium Price</span>
            <p className={`text-2xl font-display font-light ${isOutOfStock ? 'text-white/20' : 'gold-gradient'}`}>¥{product.price.toLocaleString()}</p>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Rating</span>
            <div className="flex items-center gap-2">
              <Star size={14} className="text-brand fill-brand" />
              <span className="text-lg font-display font-medium">{product.rating}</span>
            </div>
          </div>
        </div>

        {!isOutOfStock ? (
          <motion.button 
            onClick={handleAddToCart}
            animate={isAdding ? { 
              backgroundColor: ['#D4AF37', '#FFFFFF', '#D4AF37'],
              scale: 1.02
            } : {}}
            className={`w-full md:w-max px-10 py-4 text-[10px] font-black tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 ${
              isAdding ? 'text-brand' : 'bg-brand text-surface hover:bg-white'
            }`}
          >
            {isAdding ? <CheckCircle2 size={16} /> : <ShoppingCart size={16} />}
            {isAdding ? 'Added to Collection' : 'Acquire Now'}
          </motion.button>
        ) : (
          <button disabled className="w-full md:w-max px-10 py-4 bg-white/5 text-white/20 text-[10px] font-black tracking-[0.3em] uppercase cursor-not-allowed">
            Currently Unavailable
          </button>
        )}

        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <TrendingUp size={120} className="text-brand" />
        </div>
      </div>
    </motion.div>
  );
};

// --- Pages ---

const NEWS_ARTICLES = [
  {
    id: '1',
    title: 'Nova Collective 2026 春季系列发布',
    date: '2026-03-10',
    excerpt: '探索我们最新的数字艺术与软件工具系列，专为追求卓越的创意人士打造。',
    content: `
      <p>Nova Collective 荣幸地宣布推出其 2026 年春季系列。这一季，我们专注于将尖端技术与永恒的设计美学相结合，为数字时代的创意人士提供前所未有的工具和资产。</p>
      <p>从全新的数字艺术许可证到经过优化的专业软件激活码，春季系列涵盖了我们最受欢迎的所有类别。我们的团队花费了数月时间与全球顶尖的开发者和艺术家合作，确保每一件上架的商品都符合 Nova Collective 的严苛标准。</p>
      <h3>核心亮点</h3>
      <ul>
        <li><strong>独家艺术资产：</strong> 与国际知名数字艺术家合作推出的限量版作品。</li>
        <li><strong>增强版安全工具：</strong> 针对 2026 年最新网络环境优化的安全软件。</li>
        <li><strong>会员专属权益：</strong> Nova Collective 会员将享有优先购买权和专属折扣。</li>
      </ul>
      <p>我们相信，数字资产不仅仅是工具，更是个人表达和专业成就的基石。欢迎访问我们的精品店，探索春季系列的完整魅力。</p>
    `,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    category: '品牌动态',
    author: {
      name: 'Sarah Jenkins',
      role: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    }
  },
  {
    id: '2',
    title: '数字资产安全：如何保护您的收藏',
    date: '2026-03-05',
    excerpt: '在数字时代，安全至关重要。了解保护您的数字许可证和私钥的最佳实践。',
    content: `
      <p>随着数字资产价值的不断攀升，安全已成为每一位收藏家和专业人士的首要任务。在 Nova Collective，我们不仅提供高质量的资产，更致力于帮助您保护它们。</p>
      <p>以下是一些保护您数字收藏的关键步骤：</p>
      <h3>1. 使用硬件安全模块</h3>
      <p>对于极其珍贵的数字许可证和私钥，离线存储是抵御在线威胁的最有效手段。考虑使用经过认证的硬件安全模块（HSM）来管理您的核心资产。</p>
      <h3>2. 启用多因素身份验证 (MFA)</h3>
      <p>永远不要仅仅依赖密码。在所有相关平台上启用 MFA，特别是那些涉及高价值交易或敏感信息的平台。</p>
      <h3>3. 定期审计您的资产</h3>
      <p>定期检查您的数字资产清单，确保所有许可证都是最新的，并且您对所有访问权限都有完全的控制。Nova Collective 的订单追踪系统可以帮助您轻松完成这一过程。</p>
      <p>安全是一个持续的过程，而非一劳永逸的任务。保持警惕，利用最新的安全技术，让您的数字收藏在未来数年内依然安全无虞。</p>
    `,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    category: '安全指南',
    author: {
      name: 'Marcus Thorne',
      role: 'Security Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
    }
  },
  {
    id: '3',
    title: '专访：数字艺术家 Leo Chen',
    date: '2026-02-28',
    excerpt: '深入了解 Nova Collective 背后最具影响力的艺术家之一的创作过程。',
    content: `
      <p>Leo Chen 是当代数字艺术领域最受瞩目的名字之一。他的作品以其深邃的哲学思考和精湛的技术表现力著称。今天，我们有幸邀请到 Leo 谈谈他的创作灵感和对数字艺术未来的看法。</p>
      <p>“对我来说，数字媒介提供了一种传统媒介无法比拟的自由度，” Leo 在他位于上海的工作室中说道，“它允许我实时探索光影与几何的无限可能。”</p>
      <h3>关于灵感</h3>
      <p>Leo 的作品往往源于对自然界微观结构的观察。他将这些有机的形态转化为复杂的数字算法，创造出既陌生又亲切的视觉景观。</p>
      <h3>关于 Nova Collective</h3>
      <p>“Nova Collective 为艺术家提供了一个非常纯粹的平台，” Leo 表示，“在这里，作品的质量始终是第一位的。这种对卓越的追求与我的创作理念不谋而合。”</p>
      <p>Leo 的最新系列现已在 Nova Collective 独家发售。通过这些作品，您可以一窥这位视觉大师眼中的未来世界。</p>
    `,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    category: '人物专访',
    author: {
      name: 'Elena Rossi',
      role: 'Art Critic',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
    }
  }
];

const NewsPage = () => {
  return (
    <div className="px-8 md:px-16 pb-32">
      <header className="mb-24">
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[9px] font-black tracking-[0.5em] text-brand uppercase mb-6"
        >
          JOURNAL — INSIGHTS & UPDATES
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif font-bold italic leading-[0.9] mb-10"
        >
          News & <br /> <span className="gold-gradient">Information.</span>
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {NEWS_ARTICLES.map((article, index) => (
          <Link key={article.id} to={`/news/${article.id}`}>
            <motion.article 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-neutral-900 mb-6">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[8px] font-black tracking-widest text-surface bg-brand px-3 py-1 uppercase">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{article.date}</p>
                <h2 className="text-xl font-serif italic group-hover:text-brand transition-colors">{article.title}</h2>
                <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{article.excerpt}</p>
                <div className="pt-4">
                  <span className="text-[9px] font-black tracking-[0.3em] text-white/60 uppercase group-hover:text-white transition-colors flex items-center gap-2">
                    Read Article <ArrowUpRight size={12} />
                  </span>
                </div>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </div>
  );
};

const NewsDetailPage = () => {
  const { id } = useParams();
  const article = NEWS_ARTICLES.find(a => a.id === id);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <h2 className="text-2xl font-serif italic mb-4">Article Not Found</h2>
        <Link to="/news" className="text-brand text-xs font-bold tracking-widest uppercase">Return to Journal</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-8 md:px-16 pb-32"
    >
      <div className="mb-12">
        <Link to="/news" className="text-[10px] font-bold text-white/30 hover:text-brand uppercase tracking-widest flex items-center gap-2">
          <ArrowLeft size={14} /> Back to Journal
        </Link>
      </div>

      <article className="max-w-4xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] font-black tracking-[0.4em] text-brand bg-brand/10 px-4 py-2 border border-brand/30 uppercase">
              {article.category}
            </span>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{article.date}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold italic leading-tight mb-12">{article.title}</h1>
          
          <div className="flex items-center gap-6 pb-12 border-b border-white/5">
            <img 
              src={article.author.avatar} 
              alt={article.author.name} 
              className="w-12 h-12 rounded-full object-cover border border-white/10"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-widest">{article.author.name}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">{article.author.role}</p>
            </div>
          </div>
        </header>

        <div className="relative aspect-video overflow-hidden bg-neutral-900 mb-16">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none" />
        </div>

        <div 
          className="prose prose-invert prose-brand max-w-none 
            prose-p:text-white/60 prose-p:leading-relaxed prose-p:text-lg
            prose-headings:font-serif prose-headings:italic prose-headings:font-bold
            prose-strong:text-brand prose-ul:text-white/60"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <footer className="mt-24 pt-12 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Share this article</span>
              <div className="flex items-center gap-4">
                <a href="#" className="text-white/40 hover:text-brand transition-colors"><Twitter size={16} /></a>
                <a href="#" className="text-white/40 hover:text-brand transition-colors"><Instagram size={16} /></a>
                <a href="#" className="text-white/40 hover:text-brand transition-colors"><Globe size={16} /></a>
              </div>
            </div>
            <button className="text-[10px] font-black tracking-[0.4em] text-brand uppercase hover:text-white transition-colors flex items-center gap-2">
              Next Article <ArrowUpRight size={14} />
            </button>
          </div>
        </footer>
      </article>
    </motion.div>
  );
};

// --- Dashboard Components ---

const DashboardOverview = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: '账户余额', value: '¥ 12,480.00', icon: Wallet, color: 'text-brand' },
        { label: '累计订单', value: '42', icon: ShoppingCart, color: 'text-white' },
        { label: 'API 调用 (本月)', value: '1,204', icon: Activity, color: 'text-white' },
      ].map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/5 border border-white/10 p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <stat.icon size={20} className="text-white/20" />
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Live</span>
          </div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
          <p className={`text-2xl font-serif italic ${stat.color}`}>{stat.value}</p>
        </motion.div>
      ))}
    </div>

    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest">近期活动</h3>
        <button className="text-[10px] font-bold text-brand uppercase tracking-widest">查看全部</button>
      </div>
      <div className="divide-y divide-white/5">
        {[
          { type: '购买', desc: '订阅更新: NordVPN Ultra', date: '2 小时前', amount: '- ¥ 199.00' },
          { type: '充值', desc: '钱包充值: 支付宝', date: '昨天', amount: '+ ¥ 1,000.00' },
          { type: 'API', desc: '生成新 API 密钥: Production', date: '2 天前', amount: '系统' },
        ].map((item, i) => (
          <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">
                {item.type[0]}
              </div>
              <div>
                <p className="text-xs font-medium text-white/80">{item.desc}</p>
                <p className="text-[10px] text-white/20 uppercase tracking-widest">{item.date}</p>
              </div>
            </div>
            <p className={`text-xs font-mono ${item.amount.startsWith('+') ? 'text-emerald-400' : 'text-white/60'}`}>
              {item.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DashboardOrders = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-serif italic">我的订单</h2>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest hover:bg-white/10 transition-all">全部</button>
        <button className="px-4 py-2 text-[10px] font-bold text-white/40 tracking-widest uppercase">进行中</button>
        <button className="px-4 py-2 text-[10px] font-bold text-white/40 tracking-widest uppercase">已完成</button>
      </div>
    </div>
    
    <div className="space-y-4">
      {MOCK_ORDERS.map((order) => (
        <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-neutral-900 rounded-xl overflow-hidden border border-white/5">
              <img src={order.items[0].image} className="w-full h-full object-cover opacity-60" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">{order.id}</p>
              <h3 className="text-lg font-serif italic mb-1">{order.items[0].name}{order.items.length > 1 ? ` 等 ${order.items.length} 件商品` : ''}</h3>
              <p className="text-[10px] text-white/20 uppercase tracking-widest">
                {new Date(order.date).toLocaleDateString()} • 
                {order.estimatedDelivery ? ` 预计送达: ${new Date(order.estimatedDelivery).toLocaleDateString()}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs font-bold text-white mb-1">¥ {order.total.toLocaleString()}</p>
              <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                order.status === 'processing' ? 'bg-amber-500/10 text-amber-500' :
                'bg-red-500/10 text-red-500'
              }`}>{order.status}</span>
            </div>
            <Link to="/orders" className="p-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all">
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardWallet = () => (
  <div className="space-y-8">
    <div className="bg-brand p-10 rounded-3xl text-surface relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-2 opacity-60">Available Balance</p>
        <h2 className="text-5xl font-serif font-bold italic mb-8">¥ 12,480.00</h2>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-surface text-white rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all">立即充值</button>
          <button className="px-8 py-3 border border-surface/20 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-surface/10 transition-all">提现</button>
        </div>
      </div>
      <Wallet className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-6">支付方式</h3>
        <div className="space-y-4">
          <div className="p-4 border border-white/10 rounded-xl flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
              <p className="text-xs font-medium">**** 4242</p>
            </div>
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">默认</span>
          </div>
          <button className="w-full p-4 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-white/40 hover:text-white hover:border-white/30 transition-all">
            <Plus size={14} /> 添加新方式
          </button>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-6">财务概览</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">本月支出</span>
            <span className="text-xs font-mono">¥ 2,450.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">本月充值</span>
            <span className="text-xs font-mono">¥ 5,000.00</span>
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs font-bold">待处理退款</span>
            <span className="text-xs font-mono text-brand">¥ 0.00</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DashboardAPI = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-serif italic mb-2">API 对接</h2>
        <p className="text-xs text-white/40">管理您的 API 密钥并集成 Nova Collective 服务。</p>
      </div>
      <button className="px-6 py-3 bg-brand text-surface rounded-full text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-all">创建新密钥</button>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.02]">
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">名称</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">密钥</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">最后使用</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">状态</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {[
            { name: 'Production App', key: 'nova_live_••••••••••••••••', last: '2 分钟前', status: 'Active' },
            { name: 'Staging Environment', key: 'nova_test_••••••••••••••••', last: '3 天前', status: 'Active' },
          ].map((key, i) => (
            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
              <td className="px-6 py-4 text-xs font-medium">{key.name}</td>
              <td className="px-6 py-4 font-mono text-[10px] text-white/40">{key.key}</td>
              <td className="px-6 py-4 text-[10px] text-white/20 uppercase">{key.last}</td>
              <td className="px-6 py-4">
                <span className="text-[8px] font-black px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded uppercase tracking-widest">{key.status}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  <button className="p-2 text-white/20 hover:text-white transition-colors"><Copy size={14} /></button>
                  <button className="p-2 text-white/20 hover:text-brand transition-colors"><RefreshCw size={14} /></button>
                  <button className="p-2 text-white/20 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: 'API 文档', desc: '查看完整的 REST API 参考指南', icon: HelpCircle },
        { title: 'Webhooks', desc: '配置实时事件通知', icon: Activity },
        { title: 'SDK 下载', desc: '获取官方 Node.js 和 Python SDK', icon: Zap },
      ].map((item, i) => (
        <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brand/50 transition-all cursor-pointer group">
          <item.icon size={20} className="text-brand mb-4" />
          <h4 className="text-sm font-bold uppercase tracking-widest mb-2 group-hover:text-brand transition-colors">{item.title}</h4>
          <p className="text-[10px] text-white/40 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const DashboardSecurity = () => (
  <div className="space-y-8">
    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
          <Shield size={24} />
        </div>
        <div>
          <h3 className="text-lg font-serif italic">安全中心</h3>
          <p className="text-xs text-white/40">保护您的账户免受未经授权的访问。</p>
        </div>
      </div>

      <div className="space-y-6">
        {[
          { title: '双重身份验证 (2FA)', desc: '使用身份验证器应用为您的账户添加额外安全层。', status: '未启用', action: '立即设置', active: false },
          { title: '登录密码', desc: '定期更改您的密码以保持账户安全。', status: '上次更改: 30 天前', action: '修改密码', active: true },
          { title: '安全问题', desc: '在找回账户时作为额外的验证方式。', status: '已设置', action: '更新', active: true },
        ].map((item, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-white/5 rounded-xl">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-sm font-bold uppercase tracking-widest">{item.title}</h4>
                {item.active ? (
                  <CheckCircle2 size={12} className="text-emerald-500" />
                ) : (
                  <span className="text-[8px] font-black px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded uppercase">推荐</span>
                )}
              </div>
              <p className="text-xs text-white/40">{item.desc}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.status}</span>
              <button className="px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                {item.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-6">最近登录记录</h3>
      <div className="space-y-4">
        {[
          { device: 'Chrome on macOS', location: 'Shanghai, China', ip: '192.168.1.1', time: '当前在线' },
          { device: 'Safari on iPhone', location: 'Beijing, China', ip: '110.24.56.12', time: '2 小时前' },
        ].map((log, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-xs font-medium">{log.device}</p>
                <p className="text-[10px] text-white/20 uppercase tracking-widest">{log.location} • {log.ip}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${log.time === '当前在线' ? 'text-brand' : 'text-white/20'}`}>
              {log.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DashboardProfile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      addToast('Name cannot be empty', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(name);
      addToast('Profile updated successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-brand/10 border-2 border-brand/20 flex items-center justify-center text-brand font-serif italic text-3xl overflow-hidden">
            {user?.name?.charAt(0) || user?.email?.charAt(0)}
          </div>
          <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-white">
            Change
          </button>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-serif italic mb-1">{user?.name || 'Nova Collector'}</h3>
          <p className="text-xs text-white/40 uppercase tracking-widest mb-4">{user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-3 py-1 bg-brand/10 text-brand text-[9px] font-black uppercase tracking-widest rounded-full">Premium Member</span>
            <span className="px-3 py-1 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-full">Verified Identity</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-8">Identity Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Public Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-brand transition-all"
                placeholder="Enter your name"
              />
              <p className="text-[9px] text-white/20 mt-2 uppercase tracking-widest italic">This is how you will appear in the Nova archive.</p>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email || ''}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm opacity-50 cursor-not-allowed"
              />
              <p className="text-[9px] text-white/20 mt-2 uppercase tracking-widest italic">Primary contact for digital key delivery.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Preferred Language</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-brand transition-all appearance-none">
                <option value="zh">简体中文 (Simplified Chinese)</option>
                <option value="en">English (US)</option>
                <option value="jp">日本語 (Japanese)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3">Timezone</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-brand transition-all appearance-none">
                <option value="Asia/Shanghai">Asia/Shanghai (GMT+8)</option>
                <option value="UTC">UTC (Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-10 py-4 bg-brand text-surface rounded-full text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all disabled:opacity-50 shadow-xl shadow-brand/10"
          >
            {saving ? 'Synchronizing...' : 'Update Identity'}
          </button>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 mb-4">Danger Zone</h3>
        <p className="text-xs text-white/40 mb-8 leading-relaxed">Once you delete your identity, all digital keys, order history, and wallet balance will be permanently purged from the Nova archive.</p>
        <button className="px-8 py-4 border border-red-500/30 text-red-500 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all">
          Purge Identity
        </button>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  
  const tabs = [
    { id: 'overview', label: '概览', icon: LayoutGrid },
    { id: 'orders', label: '我的订单', icon: ShoppingCart },
    { id: 'wallet', label: '我的钱包', icon: Wallet },
    { id: 'api', label: 'API 对接', icon: Key },
    { id: 'security', label: '安全中心', icon: Shield },
    { id: 'profile', label: '个人资料', icon: User },
  ];

  return (
    <div className="px-8 md:px-16 pb-32">
      <header className="mb-16">
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[9px] font-black tracking-[0.5em] text-brand uppercase mb-6"
        >
          USER DASHBOARD — CONTROL CENTER
        </motion.p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold italic leading-[0.9]"
          >
            Welcome, <br /> <span className="gold-gradient">{user?.name || 'Collector'}.</span>
          </motion.h1>
            <div className="flex items-center gap-6 pb-2">
            <div className="text-right">
              <p className="text-xs font-bold text-white uppercase tracking-widest">{user?.name || 'Premium Member'}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">{user?.email}</p>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-brand p-1">
              <div className="w-full h-full rounded-full bg-brand/20 flex items-center justify-center text-brand font-serif italic text-xl">
                {user?.name?.charAt(0) || user?.email?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand text-surface shadow-lg shadow-brand/20' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          <div className="pt-8">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut size={18} />
              退出登录
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && <DashboardOverview />}
              {activeTab === 'orders' && <DashboardOrders />}
              {activeTab === 'wallet' && <DashboardWallet />}
              {activeTab === 'api' && <DashboardAPI />}
              {activeTab === 'security' && <DashboardSecurity />}
              {activeTab === 'profile' && <DashboardProfile />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- Components ---

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
);

const ProductSkeleton = () => (
  <div className="flex flex-col gap-4 border border-white/5 p-4">
    <Skeleton className="aspect-square w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <div className="flex justify-between items-center mt-4">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

const ProductListPage = ({ activeCategory, setActiveCategory, searchQuery, addToCart }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");

  // Simulate initial loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const isShowingFeaturedSection = activeCategory === "全部商品" && searchQuery === "";
  const featuredProducts = PRODUCTS.filter(p => p.isFeatured);
  
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === "全部商品" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Exclude featured products from the main grid if they are already highlighted in the featured section
    if (isShowingFeaturedSection && p.isFeatured) return false;
    
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "featured") {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    }
    return 0;
  });

  return (
    <div className="px-8 md:px-16 pb-32">
      {/* Hero Section */}
      <section className="mb-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 relative z-10">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[9px] font-black tracking-[0.5em] text-brand uppercase mb-6"
            >
              EST. 2026 — DIGITAL CURATION
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl xl:text-8xl font-serif font-bold italic leading-[0.9] mb-10"
            >
              The Art of <br />
              <span className="gold-gradient">Digital Goods.</span>
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-10"
            >
              <p className="text-xs text-white/30 leading-relaxed max-w-[280px]">
                Precision-sourced digital assets for the elite professional. 
                Instant delivery. Absolute security.
              </p>
              <button 
                onClick={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-3 text-[9px] font-black tracking-[0.3em] uppercase"
              >
                <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand group-hover:border-brand transition-all">
                  <ArrowRight size={14} className="group-hover:text-surface" />
                </span>
                Collections
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Bento Grid */}
      <section className="mb-32">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-2xl font-serif italic">Featured Collections</h2>
          <div className="h-[1px] flex-grow bg-white/5" />
          <span className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">Curated Excellence</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 h-auto md:h-[600px]">
          {/* Large Main Feature */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="md:col-span-2 lg:col-span-3 md:row-span-2 relative group overflow-hidden rounded-3xl border border-white/5"
          >
            <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="text-[8px] font-black tracking-[0.3em] text-brand uppercase mb-2 block">Premium Access</span>
              <h3 className="text-3xl font-serif italic mb-4">Software <br />Master Suite</h3>
              <button className="px-6 py-2 border border-white/20 rounded-full text-[9px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all">Explore</button>
            </div>
          </motion.div>

          {/* Medium Feature 1 */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="md:col-span-2 lg:col-span-3 relative group overflow-hidden rounded-3xl border border-white/5"
          >
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute inset-y-0 left-8 flex flex-col justify-center">
              <span className="text-[8px] font-black tracking-[0.3em] text-brand uppercase mb-2 block">Gaming</span>
              <h3 className="text-xl font-serif italic">Digital <br />Vault</h3>
            </div>
          </motion.div>

          {/* Small Feature 1 */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="md:col-span-1 lg:col-span-1 relative group overflow-hidden rounded-3xl border border-white/5"
          >
            <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/10 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <ShieldCheck className="text-brand mb-3" size={24} />
              <h3 className="text-[10px] font-bold uppercase tracking-widest">Verified <br />Secure</h3>
            </div>
          </motion.div>

          {/* Small Feature 2 */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="md:col-span-1 lg:col-span-2 relative group overflow-hidden rounded-3xl border border-white/5"
          >
            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-sm font-serif italic">Global Network</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      {activeCategory === "全部商品" && searchQuery === "" && (
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-2xl font-serif italic">Featured Selection</h2>
            <div className="h-[1px] flex-grow bg-white/5" />
            <span className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">Curated Excellence</span>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {isLoading ? (
              [1, 2].map(i => (
                <div key={i} className="h-64 glass-panel rounded-3xl animate-pulse" />
              ))
            ) : (
              featuredProducts.map(product => (
                <FeaturedProductCard key={product.id} product={product} addToCart={addToCart} />
              ))
            )}
          </div>
        </section>
      )}

      {/* Compact Grid Header */}
      <motion.section 
        id="catalogue"
        key={activeCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8"
      >
        <div className="flex items-baseline gap-6">
          <h2 className="text-3xl font-serif italic">{activeCategory}</h2>
          <span className="text-[10px] font-bold text-white/20 tracking-widest uppercase">
            {isLoading ? "SCANNING DATABASE..." : `${filteredProducts.length} ITEMS AVAILABLE`}
          </span>
        </div>
        <div className="flex gap-3 relative">
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full pl-5 pr-10 py-2.5 text-[9px] font-black tracking-widest focus:outline-none focus:border-brand transition-all appearance-none cursor-pointer uppercase"
            >
              <option value="featured" className="bg-neutral-900">Sort: Featured</option>
              <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
              <option value="price-high" className="bg-neutral-900">Price: High to Low</option>
              <option value="rating" className="bg-neutral-900">Rating: Highest</option>
            </select>
            <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-full text-[9px] font-black tracking-widest hover:border-brand transition-all uppercase">
            <Filter size={12} /> Filter
          </button>
        </div>
      </motion.section>

      {/* Product Grid */}
      <motion.section 
        layout
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 min-h-[400px]"
      >
        <AnimatePresence mode='popLayout'>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-center"
            >
              <Search size={48} className="text-white/10 mb-6" />
              <h3 className="text-xl font-serif italic mb-2">No items found</h3>
              <p className="text-xs text-white/20 uppercase tracking-widest">Try adjusting your search or category</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Luxury CTA */}
      <section className="mt-40 py-24 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif italic mb-6">Join the <br /> <span className="gold-gradient">Nova Collective.</span></h2>
            <p className="text-xs text-white/30 leading-relaxed max-w-md">Access the world's most sought-after digital assets with absolute confidence and 24/7 support.</p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <button className="px-10 py-4 bg-brand text-surface rounded-full font-black text-[9px] tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-2xl shadow-brand/20">
              Apply for Access
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductDetailPage = ({ addToCart }: { addToCart: (product: Product) => void }) => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <h2 className="text-2xl font-serif italic mb-4">Product Not Found</h2>
        <Link to="/" className="text-brand text-xs font-bold tracking-widest uppercase">Return to Boutique</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-8 md:px-16 pb-32"
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-4 mb-12 text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
        <Link to="/" className="hover:text-white transition-colors">Boutique</Link>
        <ChevronRight size={10} />
        <span className="text-white/40">{product.category}</span>
        <ChevronRight size={10} />
        <span className="text-brand">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Gallery Side */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-[4/5] bg-neutral-900 overflow-hidden border border-white/5"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
                <span className="text-2xl font-black tracking-[0.5em] text-white/40 border-y border-white/10 py-8 uppercase">Sold Out</span>
              </div>
            )}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none" />
          </motion.div>

          {/* Secondary Images (Mock) */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-white/5 border border-white/5 hover:border-brand/30 transition-all cursor-pointer overflow-hidden">
                <img 
                  src={product.image} 
                  alt={`${product.name} view ${i}`} 
                  className="w-full h-full object-cover opacity-30 hover:opacity-60 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info Side */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="sticky top-32">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-black tracking-[0.4em] text-brand bg-brand/10 px-4 py-2 border border-brand/30 uppercase">
                {product.label || 'PREMIUM ASSET'}
              </span>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-sm border border-white/5">
                <div className={`w-1.5 h-1.5 rounded-full ${product.deliveryType === 'auto' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                  {product.deliveryType === 'auto' ? '自动发货' : '人工发货'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-sm border border-white/5">
                <User size={10} className={product.accessLevel === 'member' ? 'text-brand' : 'text-white/30'} />
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                  {product.accessLevel === 'member' ? '会员专享' : '游客可购'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-sm border border-white/5">
                <Star size={10} className="text-brand fill-brand" />
                <span className="text-[10px] font-bold text-white/70">{product.rating}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif italic mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-3xl font-display font-light gold-gradient">¥{product.price.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Incl. Digital License</span>
            </div>

            <p className="text-sm text-white/40 leading-relaxed mb-10">
              {product.description}
              <br /><br />
              This premium digital asset is sourced through verified channels, ensuring absolute authenticity and immediate activation. Part of the Nova Collective's curated selection for high-end digital experiences.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="flex items-start gap-3">
                <Zap size={16} className="text-brand mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Instant Access</p>
                  <p className="text-[9px] text-white/30">Immediate digital delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="text-brand mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Verified Safe</p>
                  <p className="text-[9px] text-white/30">100% Secure activation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={16} className="text-brand mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Global Use</p>
                  <p className="text-[9px] text-white/30">No regional restrictions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock size={16} className="text-brand mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Private Key</p>
                  <p className="text-[9px] text-white/30">Exclusive ownership</p>
                </div>
              </div>
            </div>

            {/* Purchase Action */}
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className={isOutOfStock ? 'text-red-500/50' : isLowStock ? 'text-amber-500' : 'text-emerald-500'}>
                    {isOutOfStock ? 'Currently Unavailable' : isLowStock ? 'Limited Stock Remaining' : 'In Stock & Ready'}
                  </span>
                  <span className="text-white/20">{product.stock} Units</span>
                </div>
                {!isOutOfStock && (
                  <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                      className={`h-full ${isLowStock ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                )}
              </div>

              {!isOutOfStock ? (
                <motion.button 
                  onClick={handleAddToCart}
                  animate={isAdding ? { 
                    backgroundColor: ['#D4AF37', '#FFFFFF', '#D4AF37'],
                    scale: 1.02
                  } : {}}
                  className={`w-full py-5 text-xs font-black tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 shadow-2xl shadow-brand/20 ${
                    isAdding ? 'text-brand' : 'bg-brand text-surface hover:bg-white'
                  }`}
                >
                  {isAdding ? <CheckCircle2 size={18} /> : <ShoppingCart size={18} />}
                  {isAdding ? 'Added to Collection' : 'Acquire Asset'}
                </motion.button>
              ) : (
                <button disabled className="w-full py-5 bg-white/5 text-white/20 text-xs font-black tracking-[0.4em] uppercase cursor-not-allowed">
                  Sold Out
                </button>
              )}

              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="flex items-center gap-2 text-[8px] font-bold text-white/20 uppercase tracking-widest">
                  <CreditCard size={12} /> Secure Payment
                </div>
                <div className="flex items-center gap-2 text-[8px] font-bold text-white/20 uppercase tracking-widest">
                  <Headphones size={12} /> 24/7 Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="mt-40">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-2xl font-serif italic">Related Curations</h2>
          <div className="h-[1px] flex-grow bg-white/5" />
          <Link to="/" className="text-[9px] font-black tracking-[0.4em] text-brand uppercase hover:text-white transition-colors">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} />
          ))}
        </div>
      </section>
    </motion.div>
  );
};

const EmptyState = ({ icon: Icon, title, description, actionText, onAction }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center py-20 px-8"
  >
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-brand/20 blur-[40px] rounded-full" />
      <div className="relative w-24 h-24 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-brand/40">
        <Icon size={40} strokeWidth={1} />
      </div>
    </div>
    <h3 className="text-2xl md:text-3xl font-serif italic mb-4">{title}</h3>
    <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-[0.3em] max-w-xs leading-relaxed mb-10">
      {description}
    </p>
    {actionText && (
      <button 
        onClick={onAction}
        className="px-10 py-4 bg-brand text-surface text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all shadow-2xl shadow-brand/20"
      >
        {actionText}
      </button>
    )}
  </motion.div>
);

const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }: any) => {
  const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-white/5 z-[70] flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ShoppingCart size={20} className="text-brand" />
                <h2 className="text-xl font-serif italic">Your Collection</h2>
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <EmptyState 
                    icon={ShoppingCart}
                    title="Your Vault is Empty"
                    description="The collection awaits its next masterpiece. Begin your acquisition journey today."
                    actionText="Browse Catalogue"
                    onAction={onClose}
                  />
                </div>
              ) : (
                cart.map((item: any) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-20 h-24 bg-neutral-900 overflow-hidden border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60" />
                    </div>
                    <div className="flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-serif italic">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/20 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-xs font-display font-light text-brand mb-4">¥{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center border border-white/10 rounded-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-white/40 hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-[10px] font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-white/40 hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Total Value</span>
                  <span className="text-2xl font-display font-light gold-gradient">¥{total.toLocaleString()}</span>
                </div>
                <Link 
                  to="/checkout" 
                  onClick={onClose}
                  className="w-full py-4 bg-brand text-surface text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand/20"
                >
                  Proceed to Checkout
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const CheckoutPage = ({ cart }: { cart: CartItem[] }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fee = subtotal > 0 ? 5 : 0;
  const total = subtotal + fee;

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    if (!captchaVerified) {
      alert('Please complete the human verification.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Order placed successfully! Redirecting to confirmation...');
      window.location.href = '/lookup';
    }, 2000);
  };

  return (
    <div className="px-8 md:px-16 py-24 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Secure Checkout</h1>
        <p className="text-xs text-white/30 uppercase tracking-[0.3em]">Nova Collective — Verified Transaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-brand">01. Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="email" placeholder="EMAIL ADDRESS FOR DELIVERY" className="w-full bg-transparent border-b border-white/10 py-3 text-xs focus:outline-none focus:border-brand transition-colors" />
                <input type="text" placeholder="FULL NAME" className="w-full bg-transparent border-b border-white/10 py-3 text-xs focus:outline-none focus:border-brand transition-colors" />
              </div>
              <div className="pt-4">
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-4">Set an inquiry password to track your order as a guest</p>
                <input type="password" placeholder="ORDER INQUIRY PASSWORD" className="w-full md:w-1/2 bg-transparent border-b border-white/10 py-3 text-xs focus:outline-none focus:border-brand transition-colors" />
              </div>
            </div>

          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand">02. Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-6 border border-brand bg-brand/5 rounded-xl flex items-center gap-4 group text-left">
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <CreditCard size={24} className="text-brand" />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase">Credit Card</p>
                  <p className="text-[9px] text-white/30">Visa, Mastercard, AMEX</p>
                </div>
              </button>
              <button className="p-6 border border-white/10 hover:border-brand transition-all rounded-xl flex items-center gap-4 group text-left">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand/10">
                  <Globe size={24} className="text-white/20 group-hover:text-brand" />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase">Crypto Assets</p>
                  <p className="text-[9px] text-white/30">BTC, ETH, USDT</p>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand">03. Verification</h2>
            <LuxuryCaptcha onVerify={setCaptchaVerified} />
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand">04. Review Collection</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-6 p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                  <div className="w-16 h-16 bg-neutral-900 rounded overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-serif italic">{item.name}</h3>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">{item.category} — Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-display font-light">¥{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-32 bg-white/[0.02] border border-white/5 p-8 md:p-10 rounded-2xl space-y-8">
            <h2 className="text-sm font-bold uppercase tracking-widest">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-white/40 uppercase tracking-widest">Subtotal</span>
                <span className="font-display">¥{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40 uppercase tracking-widest">Processing Fee</span>
                <span className="font-display">¥{fee.toLocaleString()}</span>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Value</span>
                  <p className="text-[8px] text-white/20 mt-1 uppercase">Inclusive of all digital taxes</p>
                </div>
                <span className="text-3xl font-display font-light gold-gradient">¥{total.toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isProcessing || !captchaVerified}
              className="w-full py-5 bg-brand text-surface text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all shadow-2xl shadow-brand/20 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Complete Acquisition'}
            </button>
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-[8px] font-bold text-white/20 uppercase tracking-widest">
                <Lock size={12} /> SSL Encrypted Transaction
              </div>
              <div className="flex items-center gap-2 text-[8px] font-bold text-white/20 uppercase tracking-widest">
                <CheckCircle2 size={12} className="text-emerald-500" /> Instant Digital Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LuxuryCaptcha = ({ onVerify }: { onVerify: (valid: boolean) => void }) => {
  const [sliderPos, setSliderPos] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const targetPos = 85; // Target position percentage

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderPos(val);
    if (Math.abs(val - targetPos) < 5) {
      setIsVerified(true);
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Human Verification</p>
        {isVerified && <span className="text-[9px] font-bold text-brand uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={10} /> Verified</span>}
      </div>
      <div className="relative h-12 bg-black/40 rounded-full border border-white/5 flex items-center px-2">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-[8px] font-bold text-white/10 uppercase tracking-[0.3em]">Slide to the Golden Mark</p>
        </div>
        <div 
          className="absolute h-8 w-1 bg-brand/30 rounded-full" 
          style={{ left: `${targetPos}%` }}
        />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderPos} 
          onChange={handleSliderChange}
          className="w-full appearance-none bg-transparent cursor-pointer relative z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand/20 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface"
        />
      </div>
    </div>
  );
};

const OrderLookupPage = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<Order | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const { addToast } = useToast();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) {
      addToast('Please complete the human verification.', 'info');
      return;
    }
    setSearching(true);
    
    try {
      const response = await fetch('/api/order-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        addToast('Order located successfully', 'success');
      } else {
        setResult(null);
        addToast(data.error || 'No order found with these credentials.', 'error');
      }
    } catch (error) {
      console.error('Lookup error:', error);
      addToast('A security or network error occurred.', 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setRecoverySent(true);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-8 md:px-16 pb-32 max-w-4xl mx-auto"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Track Order</h1>
        <p className="text-xs text-white/30 uppercase tracking-[0.3em]">Guest Inquiry — Nova Collective</p>
      </div>

      {!result ? (
        <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-3xl">
          {!showRecovery ? (
            <form onSubmit={handleLookup} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Order ID</label>
                  <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g., ORD-2026-8842" 
                    className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email used for checkout" 
                      className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Order Password</label>
                      <button 
                        type="button"
                        onClick={() => setShowRecovery(true)}
                        className="text-[8px] font-bold text-brand hover:underline uppercase tracking-widest"
                      >
                        Forgot?
                      </button>
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your inquiry password" 
                      className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-white/10 uppercase tracking-widest text-center">Provide your Order ID and either your email or password to verify.</p>
              </div>

              <LuxuryCaptcha onVerify={setCaptchaVerified} />

              <button 
                type="submit"
                disabled={searching || !captchaVerified}
                className="w-full py-5 bg-brand text-surface text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all disabled:opacity-50 shadow-xl shadow-brand/10"
              >
                {searching ? 'Verifying Archive...' : 'Locate Order'}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setShowRecovery(false)} className="text-white/40 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-serif italic">Password Recovery</h2>
              </div>
              
              {!recoverySent ? (
                <form onSubmit={handleRecovery} className="space-y-6">
                  <p className="text-xs text-white/40 leading-relaxed">Enter the email address associated with your order. We will send a secure link to reset your inquiry password.</p>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Recovery Email</label>
                    <input 
                      type="email" 
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="Enter your email" 
                      className="w-full bg-transparent border-b border-white/10 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={searching}
                    className="w-full py-5 bg-brand text-surface text-[10px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all disabled:opacity-50"
                  >
                    {searching ? 'Sending Link...' : 'Send Recovery Link'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} className="text-brand" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif italic mb-2">Recovery Link Sent</h3>
                    <p className="text-xs text-white/30 leading-relaxed">If an order exists for <span className="text-white">{recoveryEmail}</span>, you will receive a reset link shortly.</p>
                  </div>
                  <button 
                    onClick={() => setShowRecovery(false)}
                    className="text-[10px] font-bold text-brand hover:underline uppercase tracking-widest"
                  >
                    Return to Lookup
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-widest leading-relaxed">
              Members can view their full history in the <Link to="/orders" className="text-brand hover:underline">Personal Archive</Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <button onClick={() => setResult(null)} className="text-[10px] font-bold text-white/40 hover:text-brand uppercase tracking-widest flex items-center gap-2">
              <ArrowLeft size={14} /> Back to Search
            </button>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Order Verified</span>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between gap-8">
              <div className="flex flex-wrap gap-12">
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Order ID</span>
                  <span className="text-xs font-mono text-white/60">{result.id}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Status</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{result.status}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Total Value</span>
                  <span className="text-xs font-display gold-gradient">¥{result.total.toLocaleString()}</span>
                </div>
                {result.estimatedDelivery && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Est. Delivery</span>
                    <span className="text-xs text-brand">{new Date(result.estimatedDelivery).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {result.timeline && (
              <div className="p-8 border-b border-white/5 bg-black/20">
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-8">Order Timeline</h3>
                <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                  {result.timeline.map((update, idx) => (
                    <div key={idx} className="relative pl-8 group">
                      <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-surface z-10 transition-colors ${
                        idx === result.timeline!.length - 1 ? 'bg-brand' : 'bg-white/10 group-hover:bg-brand/50'
                      }`} />
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                        <h4 className="text-xs font-bold text-white/80 uppercase tracking-widest">{update.status}</h4>
                        <span className="text-[9px] font-mono text-white/20">{new Date(update.date).toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-white/40 mt-1 leading-relaxed italic">{update.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="p-8 space-y-6">
              {result.items.map(item => (
                <div key={item.id} className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-neutral-900 rounded border border-white/5 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-serif italic">{item.name}</h4>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Qty: {item.quantity} — ¥{item.price.toLocaleString()}</p>
                  </div>
                  <button className="px-4 py-2 bg-brand/10 text-brand text-[9px] font-black uppercase tracking-widest rounded hover:bg-brand hover:text-surface transition-all">
                    Get Key
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back, Collector', 'success');
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto py-20 px-6"
    >
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12">
        <h1 className="text-3xl font-serif italic mb-8">Access Archive</h1>
        {error && <p className="text-red-500 text-xs mb-6 uppercase tracking-widest">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-brand text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Authorize Access'}
          </button>
        </form>
        <p className="mt-8 text-center text-[10px] text-white/40 uppercase tracking-widest">
          New to Nova? <Link to="/signup" className="text-brand hover:underline">Create Identity</Link>
        </p>
      </div>
    </motion.div>
  );
};

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password, name);
      addToast('Identity created successfully', 'success');
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto py-20 px-6"
    >
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12">
        <h1 className="text-3xl font-serif italic mb-8">Create Identity</h1>
        {error && <p className="text-red-500 text-xs mb-6 uppercase tracking-widest">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-brand text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? 'Initializing...' : 'Initialize Identity'}
          </button>
        </form>
        <p className="mt-8 text-center text-[10px] text-white/40 uppercase tracking-widest">
          Already have an identity? <Link to="/login" className="text-brand hover:underline">Access Archive</Link>
        </p>
      </div>
    </motion.div>
  );
};
const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Fetch orders error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  if (loading) {
    return (
      <div className="px-8 md:px-16 py-40 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Accessing Archives...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-8 md:px-16 py-40">
        <EmptyState 
          icon={Lock}
          title="Archive Locked"
          description="Please authorize your identity to access your personal acquisition history."
          actionText="Authorize Access"
          onAction={() => window.location.href = '/login'}
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-8 md:px-16 pb-32"
    >
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Order History</h1>
        <p className="text-xs text-white/30 uppercase tracking-[0.3em]">Your Digital Archive — Nova Collective</p>
      </div>

      <div className="space-y-8">
        {orders.length > 0 ? (
          orders.map((order) => {
            const isExpanded = expandedOrders.includes(order.id);
            
            return (
              <div key={order.id} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex flex-wrap gap-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Order ID</span>
                      <span className="text-xs font-mono text-white/60">{order.id}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Date</span>
                      <span className="text-xs text-white/60">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Total Amount</span>
                      <span className="text-xs font-display gold-gradient">¥{order.total.toLocaleString()}</span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Est. Delivery</span>
                        <span className="text-xs text-brand">{new Date(order.estimatedDelivery).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      order.status === 'completed' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                      order.status === 'processing' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                      'border-red-500/20 text-red-500 bg-red-500/5'
                    }`}>
                      {order.status}
                    </span>
                    <button 
                      onClick={() => toggleOrder(order.id)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold tracking-widest uppercase transition-all flex items-center gap-2"
                    >
                      {isExpanded ? 'Hide Details' : 'View Details'}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={14} />
                      </motion.div>
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      {order.statusDescription && (
                        <div className="px-6 md:px-8 py-4 bg-white/[0.01] border-b border-white/5">
                          <p className="text-[10px] text-white/40 italic leading-relaxed">
                            <span className="text-brand not-italic font-bold uppercase mr-2 tracking-widest">Update:</span>
                            {order.statusDescription}
                          </p>
                        </div>
                      )}

                      {order.timeline && (
                        <div className="px-6 md:px-8 py-8 border-b border-white/5 bg-black/10">
                          <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-6">Order Timeline</h3>
                          <div className="space-y-6 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                            {order.timeline.map((update, idx) => (
                              <div key={idx} className="relative pl-6 group">
                                <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border border-surface z-10 transition-colors ${
                                  idx === order.timeline!.length - 1 ? 'bg-brand' : 'bg-white/10'
                                }`} />
                                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
                                  <h4 className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{update.status}</h4>
                                  <span className="text-[8px] font-mono text-white/10">{new Date(update.date).toLocaleString()}</span>
                                </div>
                                <p className="text-[9px] text-white/30 mt-1 leading-relaxed italic">{update.note}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-6 md:p-8 bg-black/20">
                        <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-6">Acquired Items</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-neutral-900 rounded border border-white/5 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60" />
                              </div>
                              <div>
                                <h4 className="text-[11px] font-serif italic">{item.name}</h4>
                                <p className="text-[9px] text-white/20 uppercase tracking-widest">Qty: {item.quantity} — ¥{item.price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
            <EmptyState 
              icon={History}
              title="No Archives Found"
              description="Your acquisition history is currently empty. Every great collection begins with a single choice."
              actionText="Start Exploring"
              onAction={() => window.location.href = '/'}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Main App ---

const menuVariants = {
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  closed: {
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const menuItemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    opacity: 0,
    x: -20,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("全部商品");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartBump, setCartBump] = useState(false);
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    addToast(`${product.name} added to collection`, 'success');
    setCartBump(true);
    setTimeout(() => setCartBump(false), 300);
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  return (
    <Router>
      <ScrollToTop />
      <ScrollToTopButton />
      <div className="flex min-h-screen selection:bg-brand selection:text-surface">
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        
        <main className="flex-grow flex flex-col pt-32">
          <Header 
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
            onOpenCart={() => setCartOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cartBump={cartBump}
          />

          <Routes>
            <Route path="/" element={
              <ProductListPage 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
                searchQuery={searchQuery}
                addToCart={addToCart}
              />
            } />
            <Route path="/product/:id" element={<ProductDetailPage addToCart={addToCart} />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/dashboard" element={user ? <UserDashboard /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/lookup" element={<OrderLookupPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
          </Routes>

          {/* Minimal Footer */}
          <footer className="px-8 md:px-16 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[9px] font-bold text-white/20 tracking-[0.3em] uppercase">
            <div className="flex items-center gap-8">
              <p>© 2026 Nova Collective</p>
              <a href="#" className="hover:text-brand transition-colors">Instagram</a>
              <a href="#" className="hover:text-brand transition-colors">Twitter</a>
            </div>
            <div className="flex gap-12">
              <a href="#" className="hover:text-brand transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand transition-colors">Accessibility</a>
            </div>
          </footer>
        </main>

        {/* Mobile Nav Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed bottom-8 right-8 w-14 h-14 bg-brand text-surface rounded-full shadow-2xl flex items-center justify-center z-50"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 lg:hidden"
              />
              <motion.aside
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed left-0 top-0 h-full w-[85%] max-w-sm bg-surface border-r border-white/5 z-50 lg:hidden p-8 flex flex-col overflow-y-auto"
              >
                <motion.div variants={menuItemVariants} className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                      <Zap className="text-surface fill-surface" size={16} />
                    </div>
                    <span className="text-lg font-serif font-bold italic">Nova.</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </motion.div>

                <nav className="space-y-10">
                  <motion.div variants={menuItemVariants} className="space-y-6">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Collections</p>
                    <div className="flex flex-col gap-1">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => {
                            setActiveCategory(cat.name);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center justify-between px-4 py-4 rounded-xl text-xs font-bold transition-all group ${
                            activeCategory === cat.name 
                            ? 'bg-brand text-surface' 
                            : 'text-white/40 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <LayoutGrid size={16} className={activeCategory === cat.name ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'} />
                            <span>{cat.name}</span>
                          </div>
                          <span className={`text-[10px] font-black ${activeCategory === cat.name ? 'opacity-60' : 'opacity-20'}`}>{cat.count}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={menuItemVariants} className="space-y-6">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Account & Support</p>
                    <div className="flex flex-col gap-1">
                      <Link 
                        to="/lookup" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-xs font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all group"
                      >
                        <Search size={18} className="opacity-30 group-hover:opacity-100" />
                        <span>Track Order</span>
                        <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-30 transition-all" />
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-xs font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all group"
                      >
                        <History size={18} className="opacity-30 group-hover:opacity-100" />
                        <span>Order History</span>
                        <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-30 transition-all" />
                      </Link>
                      <button className="flex items-center gap-4 px-4 py-4 rounded-xl text-xs font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all group">
                        <HelpCircle size={18} className="opacity-30 group-hover:opacity-100" />
                        <span>Concierge Support</span>
                        <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-30 transition-all" />
                      </button>
                    </div>
                  </motion.div>
                </nav>

                <motion.div variants={menuItemVariants} className="mt-auto pt-8 border-t border-white/5">
                  {user ? (
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-serif italic">
                          {user.name?.charAt(0) || user.email.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Logged in as</span>
                          <span className="text-xs font-bold">{user.name || 'Nova Collector'}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="p-2 text-white/20 hover:text-red-500 transition-colors"
                      >
                        <LogOut size={16} />
                      </button>
                    </div>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-4 bg-brand text-black rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2"
                    >
                      <User size={16} />
                      Authorize Access
                    </Link>
                  )}
                </motion.div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <CartSidebar 
          isOpen={cartOpen} 
          onClose={() => setCartOpen(false)} 
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      </div>
    </Router>
  );
}
