import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, User, Star, Zap, ShieldCheck, Globe, Lock, CheckCircle2, ShoppingCart, CreditCard, Headphones } from 'lucide-react';
import { Product, PublicProduct, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { api } from '../utils/api';
import { mapPublicProductToProduct } from '../utils/mapper';
import { useSite } from '../contexts/SiteContext';

export const ProductDetailPage = ({ addToCart }: { addToCart: (product: Product) => void }) => {
  const { id } = useParams();
  const { config, locale } = useSite();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const [productRes, categoriesRes, allProductsRes] = await Promise.all([
          api.get<PublicProduct>(`/public/products/${id}`),
          api.get<Category[]>('/public/categories'),
          api.get<PublicProduct[]>('/public/products')
        ]);
        
        const mappedProduct = mapPublicProductToProduct(productRes.data, categoriesRes.data, locale);
        setProduct(mappedProduct);

        const mappedRelated = allProductsRes.data
          .filter(p => p.slug !== id)
          .slice(0, 4)
          .map(p => mapPublicProductToProduct(p, categoriesRes.data, locale));
        setRelatedProducts(mappedRelated);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, locale]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <h2 className="text-2xl font-serif italic mb-4 animate-pulse">Loading Asset...</h2>
      </div>
    );
  }

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
                  {product.deliveryType === 'auto' ? 'Auto Delivery' : 'Manual Delivery'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-sm border border-white/5">
                <User size={10} className={product.accessLevel === 'member' ? 'text-brand' : 'text-white/30'} />
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                  {product.accessLevel === 'member' ? 'Members Only' : 'Guest Purchase'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-sm border border-white/5">
                <Star size={10} className="text-brand fill-brand" />
                <span className="text-[10px] font-bold text-white/70">{product.rating}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif italic mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-3xl font-display font-light gold-gradient">{config?.currency || '¥'}{product.price.toLocaleString()}</span>
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
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} />
          ))}
        </div>
      </section>
    </motion.div>
  );
};
