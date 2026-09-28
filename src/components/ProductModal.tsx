import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  ExternalLink, 
  Zap, 
  ShoppingCart,
  MessageSquare,
  Ban,
  Edit3
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PlanOption } from '../types';

export const ProductModal: React.FC = () => {
  const { 
    activeQuickViewProduct, 
    setActiveQuickViewProduct, 
    addToCart, 
    settings, 
    setIsCheckoutOpen,
    isDeveloperMode,
    openAdminForProduct
  } = useStore();

  const product = activeQuickViewProduct;

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    product?.plans[0]?.id || ''
  );
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

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
      setActiveQuickViewProduct(null);
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0c0f18] text-slate-100 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/[0.09]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between sticky top-0 bg-[#080a12]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            {product.badge && (
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300">
                {product.badge}
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              // {product.category.replace('_', ' & ')}
            </span>
          </div>

          <button
            onClick={() => setActiveQuickViewProduct(null)}
            className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Main Title & Rating */}
          <div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
              {product.title}
            </h2>
            {product.subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                {product.subtitle}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-500">
                • {product.reviewCount} verified activations
              </span>
            </div>
          </div>

          {/* Stock & Price Box */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                Selected Plan Price:
              </span>
              {selectedPlan?.contactForPrice ? (
                <span className="text-base font-mono font-bold text-orange-400">
                  Contact for Pricing
                </span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-black text-white">
                    {settings.currencySymbol}{selectedPlan?.price}
                  </span>
                  {selectedPlan?.originalPrice && (
                    <span className="text-sm font-mono text-slate-500 line-through">
                      {settings.currencySymbol}{selectedPlan.originalPrice}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="text-right">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 border border-emerald-800/40 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  In Stock • Instant Delivery
                </span>
              ) : (
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/80 border border-rose-800/40 text-rose-300">
                    <Ban className="w-3.5 h-3.5 text-rose-400" />
                    Currently Out of Stock
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Restock available via Reddit inquiry
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Plan Picker */}
          {product.plans.length > 1 && (
            <div>
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-2">
                Choose Plan Duration:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-3 rounded-xl border text-left transition ${
                      (selectedPlanId === plan.id || (!selectedPlanId && product.plans[0].id === plan.id))
                        ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'border-white/[0.08] hover:border-white/20 bg-white/[0.02]'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{plan.label}</div>
                    <div className="text-[11px] font-mono text-cyan-300 mt-0.5">
                      {plan.contactForPrice ? 'Quote' : `${settings.currencySymbol}${plan.price}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              About This Service:
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Features List */}
          <div>
            <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              Features Included:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Activation Details Guarantee */}
          <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-2xl p-4 text-xs text-cyan-200 space-y-1.5 font-mono">
            <div className="font-bold flex items-center gap-1.5 text-cyan-300 text-xs">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Activation & Delivery Policy:
            </div>
            <p className="leading-relaxed text-[11px] text-slate-300 font-sans">
              {product.activationDetails}
            </p>
            <div className="pt-1 flex flex-wrap gap-3 font-medium text-[11px] text-cyan-400">
              <span>✔️ Genuine Activations</span>
              <span>✔️ Replacement Warranty</span>
              <span>✔️ Direct Reddit DM Checkout</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#080a12] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveQuickViewProduct(null)}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/[0.05] transition"
            >
              Close
            </button>

            {isDeveloperMode && (
              <button
                onClick={() => {
                  setActiveQuickViewProduct(null);
                  openAdminForProduct(product);
                }}
                className="px-3 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Edit this product's description, pricing, and plans"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Owner Edit</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {product.inStock ? (
              <>
                <button
                  onClick={handleAddToCart}
                  className={`font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    justAdded 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 hover:border-cyan-500/40'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-cyan-400" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs py-2.5 px-5 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Checkout on Reddit</span>
                </button>
              </>
            ) : (
              <a
                href={`https://www.reddit.com/message/compose/?to=${settings.redditUsername.replace(/^u\//,'')}&subject=Restock%20Inquiry%3A%20${encodeURIComponent(product.title)}&message=Hi%2C%20please%20let%20me%20know%20when%20${encodeURIComponent(product.title)}%20becomes%20available!`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold text-xs py-2.5 px-5 rounded-xl shadow transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-rose-400" />
                <span>DM on Reddit for Restock</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
