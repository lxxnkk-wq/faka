import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { api } from '../utils/api';
import { Post } from '../types';
import { useSite } from '../contexts/SiteContext';

export const NewsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getLocalizedString } = useSite();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get<Post[]>('/public/posts');
        setPosts(res.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

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

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse text-brand font-serif italic">Loading Journal...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((article, index) => (
            <Link key={article.id} to={`/news/${article.slug}`}>
              <motion.article 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-900 mb-6">
                  <img 
                    src={article.thumbnail || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80'} 
                    alt={getLocalizedString(article.title)} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[8px] font-black tracking-widest text-surface bg-brand px-3 py-1 uppercase">
                      {article.type}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    {new Date(article.published_at).toLocaleDateString()}
                  </p>
                  <h2 className="text-xl font-serif italic group-hover:text-brand transition-colors">
                    {getLocalizedString(article.title)}
                  </h2>
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                    {getLocalizedString(article.summary)}
                  </p>
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
      )}
    </div>
  );
};

export const NewsDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getLocalizedString } = useSite();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get<Post>(`/public/posts/${id}`);
        setArticle(res.data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <h2 className="text-2xl font-serif italic mb-4 animate-pulse">Loading Article...</h2>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <h2 className="text-2xl font-serif italic mb-4">Article Not Found</h2>
        <Link to="/news" className="text-brand text-xs font-bold tracking-widest uppercase">Return to Journal</Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-8 md:px-16 pb-32"
    >
      <Link to="/news" className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-white/40 hover:text-brand transition-colors mb-12">
        <ArrowLeft size={14} /> Back to Journal
      </Link>
      
      <header className="mb-16 text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-[9px] font-black tracking-widest text-surface bg-brand px-3 py-1 uppercase">
            {article.type}
          </span>
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
            {new Date(article.published_at).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif italic leading-tight mb-8">
          {getLocalizedString(article.title)}
        </h1>
        <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-2xl mx-auto italic">
          {getLocalizedString(article.summary)}
        </p>
      </header>

      <div className="aspect-[21/9] w-full bg-neutral-900 mb-16 overflow-hidden rounded-2xl border border-white/5">
        <img 
          src={article.thumbnail || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80'} 
          alt={getLocalizedString(article.title)} 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:italic prose-p:text-white/70 prose-p:leading-relaxed prose-a:text-brand hover:prose-a:text-white transition-colors">
        {(getLocalizedString(article.content) || '').split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="mb-8 text-sm md:text-base font-light tracking-wide">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <span className="text-xs font-serif italic text-brand">NC</span>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40">Written by</p>
            <p className="text-sm font-serif italic">Nova Editorial Team</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand hover:border-brand transition-all">
            <Share2 size={16} />
          </button>
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-brand hover:border-brand transition-all">
            <Bookmark size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
