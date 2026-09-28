import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  ShieldCheck, 
  SlidersHorizontal, 
  MessageSquare, 
  ExternalLink,
  Terminal,
  Zap,
  Sparkles,
  User
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/defaultProducts';
import { CategoryId } from '../types';

export const Navbar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    cartCount, 
    setIsCartOpen,
    setIsAdminOpen,
    setIsCustomRequestOpen,
    settings,
    isDeveloperMode,
    currentUser,
    setIsUserAuthOpen
  } = useStore();

  const [tempSearch, setTempSearch] = useState(searchQuery);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(tempSearch);
  };

  const handleLogoClick = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    // Triple-click secret trigger for owner to open Developer PIN prompt
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setIsAdminOpen(true);
        return 0;
      }
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0d14]/85 backdrop-blur-xl border-b border-white/[0.08] text-white shadow-2xl transition-all">
      {/* Top Main Navigation Bar */}
      <div className="max-w-[1500px] mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand / Logo (Previous Iconic SubPrime with ⚡) */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded-lg group transition select-none shrink-0"
          title="SubPrime Digital Store"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-300 flex items-center justify-center font-black text-black text-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.7)] group-hover:scale-105 transition-all">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight leading-none text-white flex items-center">
              Sub<span className="text-amber-400">Prime</span>
            </span>
            <span className="text-[9px] font-mono text-slate-400 font-semibold tracking-widest uppercase">DIGITAL STORE</span>
          </div>
        </div>

        {/* Live System Telemetry Badge (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] text-slate-400">&gt;_ system: <strong className="text-emerald-400 font-semibold">online</strong></span>
        </div>

        {/* Dark Tech Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center h-10 max-w-2xl mx-1 sm:mx-2">
          <div className="relative flex-1 flex rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.1] focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20 transition shadow-inner">
            
            {/* Category Dropdown Selector inside Search */}
            <div className="hidden sm:flex bg-white/[0.04] border-r border-white/[0.08] items-center px-2.5">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CategoryId)}
                aria-label="Filter products by category"
                className="bg-transparent text-xs text-slate-300 font-medium outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-[#0e111a] text-slate-200">All Categories</option>
                {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#0e111a] text-slate-200">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Input field */}
            <input
              type="text"
              placeholder="Search Netflix, YouTube, VPNs, Canva, Grok, Bolt, LinkedIn..."
              value={tempSearch}
              onChange={(e) => {
                setTempSearch(e.target.value);
                setSearchQuery(e.target.value);
              }}
              className="flex-1 px-3.5 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none bg-transparent"
            />

            {/* Cyan Neon Search Button */}
            <button
              type="submit"
              aria-label="Search subscriptions"
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-3.5 sm:px-4 flex items-center justify-center transition cursor-pointer font-bold"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Reddit Custom Request Button */}
          <button
            onClick={() => setIsCustomRequestOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 transition shadow-[0_0_15px_rgba(249,115,22,0.15)] cursor-pointer"
            title="Need a subscription not listed? Message on Reddit"
          >
            <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden md:inline font-bold">Custom Request</span>
          </button>

          {/* DEVELOPER / ADMIN PORTAL BUTTON (Visible ONLY to store owner) */}
          {isDeveloperMode && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 transition shadow-[0_0_20px_rgba(99,102,241,0.25)] animate-pulse"
              title="Developer Mode Active (Only you see this)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-300" />
              <span className="font-mono font-bold flex items-center gap-1">
                DEV
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </span>
            </button>
          )}

          {/* Customer User Account / Sign In */}
          <button
            onClick={() => setIsUserAuthOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/30 transition text-slate-200 cursor-pointer"
            title={currentUser ? `Signed in as ${currentUser.email}` : "Sign In or Register"}
          >
            {currentUser ? (
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-black font-black text-xs flex items-center justify-center shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User className="w-4 h-4 text-cyan-400" />
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[9px] font-mono text-slate-400 leading-tight">
                {currentUser ? `HELLO, ${(currentUser.name || currentUser.email.split('@')[0]).toUpperCase()}` : 'HELLO, SIGN IN'}
              </span>
              <span className="font-bold text-xs leading-tight text-white">
                {currentUser ? 'My Account' : 'Account'}
              </span>
            </div>
          </button>

          {/* Cart Button with Glow Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/30 transition relative cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-slate-200" />
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-mono font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                {cartCount}
              </span>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[10px] font-mono text-slate-400 leading-tight">CART</span>
              <span className="font-bold text-xs leading-tight text-cyan-300">Checkout</span>
            </div>
          </button>
        </div>

      </div>

      {/* Terminal Telemetry Subnav Ribbon */}
      <div className="bg-[#08090d]/90 px-3 sm:px-5 py-1.5 text-xs text-slate-400 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none border-t border-white/[0.05]">
        <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            100% Genuine Activations
          </span>
          <span className="text-slate-600">•</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
            ✉️ Activation on Your Own Email
          </span>
          <span className="hidden md:inline-block text-slate-600">•</span>
          <span className="hidden md:inline-flex items-center gap-1 text-cyan-300 font-medium">
            ⚡ Official Links • Zero Sharing
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono pl-4">
          <span className="text-slate-500 hidden sm:inline">Support:</span>
          <a
            href={`https://www.reddit.com/user/${settings.redditUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 hover:underline"
          >
            <MessageSquare className="w-3 h-3 text-orange-500" />
            <span>u/{settings.redditUsername}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
