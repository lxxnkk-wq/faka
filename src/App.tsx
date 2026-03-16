/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate
} from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { SiteProvider, useSite } from './contexts/SiteContext';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CartSidebar } from './components/CartSidebar';
import { MobileMenu } from './components/MobileMenu';
import { ScrollToTop, ScrollToTopButton } from './components/ScrollToTop';

// Pages
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetail';
import { CheckoutPage } from './pages/Checkout';
import { OrderHistoryPage } from './pages/OrderHistory';
import { OrderLookupPage } from './pages/OrderLookup';
import { UserDashboard } from './pages/Dashboard';
import { NewsPage, NewsDetailPage } from './pages/News';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { ForgotPasswordPage } from './pages/ForgotPassword';

const AppContent = () => {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { cart, addToCart, removeFromCart, updateQuantity, cartCount, cartBump } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { config, loading: siteLoading, error: siteError } = useSite();

  if (authLoading || siteLoading) {
    return <div className="min-h-screen bg-surface flex items-center justify-center text-brand font-serif italic">Loading Nova...</div>;
  }

  if (siteError) {
    return <div className="min-h-screen bg-surface flex items-center justify-center text-red-500 font-serif italic">Error: {siteError}</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-surface text-white font-sans selection:bg-brand selection:text-surface flex">
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        <main className="flex-1 relative flex flex-col min-h-screen overflow-x-hidden">
          <Header 
            cartCount={cartCount} 
            onOpenCart={() => setCartOpen(true)} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cartBump={cartBump}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <div className="flex-1 pt-20">
            <AnimatePresence mode="wait">
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
                <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
                <Route path="/orders" element={user ? <OrderHistoryPage /> : <Navigate to="/login" />} />
                <Route path="/lookup" element={<OrderLookupPage />} />
                <Route path="/dashboard/*" element={user ? <UserDashboard /> : <Navigate to="/login" />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
                <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />
                <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>

        <ScrollToTopButton />

        <MobileMenu 
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

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
};

export default function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </SiteProvider>
  );
}
