import React, { useMemo, useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { CategoryNav } from './components/CategoryNav';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CustomRequestModal } from './components/CustomRequestModal';
import { ProductModal } from './components/ProductModal';
import { AdminModal } from './components/AdminModal';
import { UserAuthModal } from './components/UserAuthModal';
import { Footer } from './components/Footer';
import { 
  Sparkles, 
  HelpCircle, 
  MessageSquare, 
  Filter, 
  SearchX, 
  SlidersHorizontal,
  ShieldCheck,
  TrendingUp,
  ArrowUpDown,
  ShoppingCart,
  Zap,
  ExternalLink,
  User
} from 'lucide-react';
import { CATEGORIES } from './data/defaultProducts';

const StorefrontContent: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    setIsCustomRequestOpen,
    setIsAdminOpen,
    settings,
    isDeveloperMode,
    cartCount,
    cartTotal,
    setIsCartOpen,
    currentUser,
    setIsUserAuthOpen 
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [stockOnly, setStockOnly] = useState<boolean>(false);

  // Filter products by category, search query, and stock filter
  const displayedProducts = useMemo(() => {
    let list = products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Stock filter
      if (stockOnly && !p.inStock) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesSubtitle = p.subtitle?.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(query));
        const matchesFeatures = p.features.some((f) => f.toLowerCase().includes(query));
        return matchesTitle || matchesSubtitle || matchesDesc || matchesTags || matchesFeatures;
      }

      return true;
    });

    // Sort products
    if (sortBy === 'price_low') {
      list = [...list].sort((a, b) => (a.plans[0]?.price || 0) - (b.plans[0]?.price || 0));
    } else if (sortBy === 'price_high') {
      list = [...list].sort((a, b) => (b.plans[0]?.price || 0) - (a.plans[0]?.price || 0));
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy, stockOnly]);

  const currentCategoryInfo = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090d] text-slate-100 relative overflow-x-hidden">
      
      {/* Ambient Grid & Aurora Glows */}
      <div className="bg-grid"></div>
      <div className="bg-aurora-cyan"></div>
      <div className="bg-aurora-purple"></div>
      <div className="bg-aurora-amber"></div>

      {/* Top Navbar */}
      <Navbar />

      {/* Category Pills Navigation */}
      <CategoryNav />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-3 sm:px-5 py-6 relative z-10">
        
        {/* Hero Announcement & Promotion Banner */}
        {!searchQuery && selectedCategory === 'all' && <HeroBanner />}

        {/* Section Header & Filters */}
        <div className="bg-[#0e111a]/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/[0.08] mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                FEATURED DIRECTORY //
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-full">
                {displayedProducts.length} plans
              </span>
            </div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-0.5">
              {searchQuery ? `Search results for "${searchQuery}"` : currentCategoryInfo?.name || 'All Subscriptions'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentCategoryInfo?.description || 'Genuine digital activations with 100% replacement warranty'}
            </p>
          </div>

          {/* Right Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            
            {/* Filter In-Stock Only */}
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300 select-none bg-white/[0.03] border border-white/[0.06] hover:border-white/15 px-3 py-1.5 rounded-xl transition">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 border-slate-700 bg-slate-900"
              />
              <span className="text-xs font-mono">In-Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-xl text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-xs text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium outline-none cursor-pointer text-white text-xs"
              >
                <option value="featured" className="bg-[#0e111a] text-slate-200">Featured</option>
                <option value="price_low" className="bg-[#0e111a] text-slate-200">Price: Low to High</option>
                <option value="price_high" className="bg-[#0e111a] text-slate-200">Price: High to Low</option>
                <option value="rating" className="bg-[#0e111a] text-slate-200">Highest Rated</option>
              </select>
            </div>

            {/* Developer Fast Access Pill (Visible ONLY to store owner) */}
            {isDeveloperMode && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 px-3 py-1.5 rounded-xl font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                title="Manage stock status & catalog"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                <span>DEV: STOCK</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-[#0e111a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-12 text-center max-w-lg mx-auto my-8 space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-white/[0.04] rounded-2xl border border-white/[0.08] flex items-center justify-center mx-auto text-slate-400">
              <SearchX className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-lg">No matching subscriptions found</h3>
              <p className="text-xs text-slate-400 mt-1">
                We couldn't find any plan matching your query.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setStockOnly(false); }}
                className="w-full sm:w-auto px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white rounded-xl text-xs font-bold transition"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsCustomRequestOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Request on Reddit</span>
              </button>
            </div>
          </div>
        )}

        {/* Unlisted Subscription Cyber Banner at bottom of catalog */}
        <div className="mt-14 bg-gradient-to-r from-[#0c0f1a] via-[#101424] to-[#0d0f17] text-white rounded-3xl p-6 sm:p-10 border border-white/[0.09] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 text-center md:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>CUSTOM ORDERS & DM ACTIVATIONS</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight">
              Looking for a subscription not listed above?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              From specialty developer APIs to niche streaming and AI models, we can provision almost any service. Message us on Reddit with what you need!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 relative z-10">
            <a
              href={`https://www.reddit.com/user/${settings.redditUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(249,115,22,0.35)] transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message on Reddit (u/{settings.redditUsername})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setIsCustomRequestOpen(true)}
              className="bg-white/[0.05] hover:bg-white/[0.1] text-white font-semibold px-5 py-3.5 rounded-2xl text-xs sm:text-sm border border-white/10 transition"
            >
              Fill Request Form
            </button>
          </div>
        </div>

      </main>

      {/* MOBILE STICKY FLOATING ACTION BAR (Mobile Optimization) */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 bg-[#0d101b]/95 backdrop-blur-2xl border border-white/15 p-2 rounded-2xl flex items-center justify-between shadow-2xl z-40 gap-1.5">
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/[0.06] text-white text-xs font-mono font-bold"
        >
          <div className="relative">
            <ShoppingCart className="w-4 h-4 text-cyan-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-cyan-400 text-black text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <button
          onClick={() => setIsUserAuthOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/[0.06] text-white text-xs font-mono font-bold"
        >
          {currentUser ? (
            <div className="w-4 h-4 rounded-full bg-cyan-400 text-black text-[9px] font-black flex items-center justify-center">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User className="w-4 h-4 text-cyan-400" />
          )}
          <span>{currentUser ? 'Account' : 'Sign In'}</span>
        </button>

        <a
          href={`https://www.reddit.com/user/${settings.redditUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold px-2.5 py-2 rounded-xl shadow-md"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Reddit</span>
        </a>
      </div>

      {/* Modals & Slide-overs */}
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <CustomRequestModal />
      <ProductModal />
      <AdminModal />
      <UserAuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
};

export default App;
