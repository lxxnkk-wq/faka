import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShieldCheck, ChevronDown, Filter, Search } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { FeaturedProductCard } from '../components/FeaturedProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import { api } from '../utils/api';
import { PublicProduct, Category, Product } from '../types';
import { mapPublicProductToProduct } from '../utils/mapper';
import { useSite } from '../contexts/SiteContext';

export const ProductListPage = ({ activeCategory, setActiveCategory, searchQuery, addToCart }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const { config, locale } = useSite();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          api.get<Category[]>('/public/categories'),
          api.get<PublicProduct[]>('/public/products')
        ]);
        
        const mappedProducts = productsRes.data.map(p => 
          mapPublicProductToProduct(p, categoriesRes.data, locale)
        );
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const isShowingFeaturedSection = activeCategory === "All Products" && searchQuery === "";
  const featuredProducts = products.filter(p => p.isFeatured);
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All Products" || p.category === activeCategory;
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
      {activeCategory === "All Products" && searchQuery === "" && (
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
