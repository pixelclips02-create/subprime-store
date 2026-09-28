import React, { useState } from 'react';
import { 
  Star, 
  Check, 
  AlertCircle, 
  Mail, 
  ExternalLink, 
  Zap, 
  Info, 
  ShoppingCart,
  MessageSquare,
  ShieldCheck,
  Ban,
  Edit3
} from 'lucide-react';
import { Product, PlanOption } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    settings, 
    setActiveQuickViewProduct, 
    setIsCheckoutOpen,
    toggleStock,
    isDeveloperMode,
    openAdminForProduct
  } = useStore();

  const [selectedPlanId, setSelectedPlanId] = useState<string>(product.plans[0]?.id || '');
  const [justAdded, setJustAdded] = useState(false);
  const selectedPlan: PlanOption | undefined = 
    product.plans.find((p) => p.id === selectedPlanId) || product.plans[0];

  const handleAddToCart = () => {
    if (selectedPlan && product.inStock) {
      addToCart(product, selectedPlan, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    }
  };

  const handleBuyNow = () => {
    if (selectedPlan && product.inStock) {
      addToCart(product, selectedPlan, 1);
      setIsCheckoutOpen(true);
    }
  };

  const discountPercent =
    selectedPlan?.originalPrice && selectedPlan.price
      ? Math.round(((selectedPlan.originalPrice - selectedPlan.price) / selectedPlan.originalPrice) * 100)
      : null;

  return (
    <div className={`rounded-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
      product.inStock 
        ? 'bg-[#101422]/75 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1' 
        : 'bg-[#150d12]/75 backdrop-blur-xl border border-rose-900/40'
    }`}>
      
      {/* Top Badges */}
      <div className="p-4 sm:p-5 pb-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          {product.badge && product.inStock && (
            <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              {product.badge}
            </span>
          )}

          {/* OUT OF STOCK BADGE */}
          {!product.inStock && (
            <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-700/60 text-rose-300 tracking-wider uppercase flex items-center gap-1 shadow-sm">
              <Ban className="w-3 h-3 text-rose-400" /> Out of Stock
            </span>
          )}

          {/* Activation Type Pill */}
          <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md ml-auto flex items-center gap-1">
            {product.activationType === 'email' && <Mail className="w-3 h-3 text-cyan-400" />}
            {product.activationType === 'link' && <ExternalLink className="w-3 h-3 text-indigo-400" />}
            {product.activationType === 'account' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
            <span className="capitalize">{product.activationType}</span>
          </span>
        </div>

        {/* Title and Subtitle */}
        <h3 
          onClick={() => setActiveQuickViewProduct(product)}
          className="font-display font-bold text-white text-base sm:text-lg leading-snug hover:text-cyan-400 cursor-pointer transition"
        >
          {product.title}
        </h3>

        {product.subtitle && (
          <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-sans">
            {product.subtitle}
          </p>
        )}

        {product.description && (
          <p className="text-[11px] text-slate-400/90 line-clamp-2 mt-1.5 font-sans leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Star Rating & Review count */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            ({product.reviewCount})
          </span>
        </div>

        {/* Plan / Duration Selector (if multiple plans) */}
        {product.plans.length > 1 && (
          <div className="mt-3.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Select Duration:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {product.plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`text-xs py-1.5 px-2 rounded-lg border text-left transition ${
                    selectedPlanId === plan.id
                      ? 'border-cyan-500 bg-cyan-950/40 font-bold text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'border-white/[0.08] hover:border-white/20 bg-white/[0.02] text-slate-400'
                  }`}
                >
                  <div className="truncate font-sans">{plan.label}</div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {plan.contactForPrice ? 'Quote' : `${settings.currencySymbol}${plan.price}`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Section in Monospace */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-baseline gap-2">
          {selectedPlan?.contactForPrice ? (
            <div className="text-sm font-mono font-bold text-orange-400 flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>Contact for Pricing</span>
            </div>
          ) : (
            <>
              <div className="flex items-baseline">
                <span className="text-sm font-mono text-cyan-400 mr-0.5">
                  {settings.currencySymbol}
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight">
                  {selectedPlan?.price}
                </span>
              </div>

              {selectedPlan?.originalPrice && (
                <span className="text-xs font-mono text-slate-500 line-through">
                  {settings.currencySymbol}{selectedPlan.originalPrice}
                </span>
              )}

              {discountPercent && discountPercent > 0 && (
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Stock Status Indicator */}
        <div className="mt-2 text-xs">
          {product.inStock ? (
            <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              In Stock • Instant Activation
            </span>
          ) : (
            <div className="space-y-0.5">
              <span className="text-rose-400 font-mono text-[11px] font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Currently Out of Stock
              </span>
              <p className="text-[10px] text-slate-500">
                Priority restock via Reddit DM available
              </p>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <ul className="mt-3 space-y-1.5 text-xs text-slate-300 border-t border-white/[0.06] pt-3">
          {product.features.slice(0, 3).map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1 text-slate-300 text-[11px]">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons & Quick View */}
      <div className="p-4 sm:p-5 pt-3 mt-3 bg-white/[0.02] border-t border-white/[0.06] space-y-2">
        {product.inStock ? (
          <>
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                justAdded 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 hover:border-cyan-500/40'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Buy & Pay via Reddit DM */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs py-2.5 px-3 rounded-xl shadow-[0_0_18px_rgba(249,115,22,0.3)] transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>Checkout on Reddit</span>
            </button>
          </>
        ) : (
          /* OUT OF STOCK - REDDIT RESTOCK BUTTON */
          <div className="space-y-2">
            <a
              href={`https://www.reddit.com/message/compose/?to=${settings.redditUsername.replace(/^u\//,'')}&subject=Restock%20Request%3A%20${encodeURIComponent(product.title)}&message=Hi%2C%20please%20notify%20me%20when%20${encodeURIComponent(product.title)}%20is%20back%20in%20stock!`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-200 font-bold text-xs py-2.5 px-3 rounded-xl shadow transition flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
              <span>DM on Reddit When Restocked</span>
            </a>

            {/* Hidden Dev Quick Toggle (Visible ONLY to owner) */}
            {isDeveloperMode && (
              <button
                onClick={() => toggleStock(product.id)}
                className="w-full text-center text-[10px] text-cyan-400 hover:text-cyan-300 font-mono font-semibold underline cursor-pointer"
                title="Click as Developer to mark back in stock"
              >
                &gt;_ developer: mark in stock
              </button>
            )}
          </div>
        )}

        {/* View Details Modal */}
        <button
          onClick={() => setActiveQuickViewProduct(product)}
          className="w-full text-center text-[11px] text-slate-400 hover:text-cyan-300 font-mono transition py-1 flex items-center justify-center gap-1 cursor-pointer"
        >
          <Info className="w-3 h-3" />
          <span>view specs & activation</span>
        </button>

        {/* Developer / Store Owner Direct Edit Button */}
        {isDeveloperMode && (
          <div className="pt-2 border-t border-cyan-500/20">
            <button
              onClick={() => openAdminForProduct(product)}
              className="w-full bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
              title="Open Developer Portal directly to edit pricing, plans, and description"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Owner Edit (Price & Desc)</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
