import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildCartRedditDmUrl, formatCartForRedditClipboard } from '../services/emailService';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotal, 
    cartCount,
    settings,
    setIsCheckoutOpen,
    currentUser,
    setIsUserAuthOpen,
    setAuthRedirectReason 
  } = useStore();

  const [copied, setCopied] = useState(false);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      setAuthRedirectReason('Please sign in or create an account first to complete your order. Your activations, invoice, and warranties will be saved under your email.');
      setIsUserAuthOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCopyCart = () => {
    const text = formatCartForRedditClipboard(cart, settings);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const directCartRedditUrl = buildCartRedditDmUrl(
    settings.redditUsername,
    cart,
    settings
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0c0f18] border-l border-white/[0.08] shadow-2xl flex flex-col text-slate-100">
          
          {/* Cart Header */}
          <div className="p-4 bg-[#080a12] border-b border-white/[0.08] flex items-center justify-between shadow">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
              <h2 className="font-display font-bold text-base tracking-tight text-white">
                Your Order ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Payment & Conversation on Reddit Banner */}
          <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border-b border-orange-500/20 px-4 py-3 flex items-start gap-2.5 text-xs text-orange-200">
            <MessageSquare className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Reddit Payment & Activation:</span>
              <p className="text-[11px] text-orange-200/90 mt-0.5 leading-relaxed">
                Connect directly with seller <strong className="font-mono text-white">u/{settings.redditUsername}</strong> on Reddit to finalize payment (Crypto, PayPal, etc.) and receive immediate activation.
              </p>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 mx-auto bg-white/[0.04] rounded-2xl border border-white/[0.08] flex items-center justify-center text-slate-500">
                  <ShoppingCart className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">Your Cart is empty</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Select subscriptions to chat and order via Reddit!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs py-2.5 px-6 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition"
                >
                  Browse Plans
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex gap-3 items-start">
                  
                  {/* Item Details */}
                  <div className="flex-1 space-y-1">
                    <h4 className="font-display font-bold text-sm text-white leading-snug">
                      {item.product.title}
                    </h4>

                    <div className="inline-block text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-md">
                      Plan: {item.selectedPlan.label}
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.product.activationType === 'email' && 'Activation on your email'}
                      {item.product.activationType === 'link' && 'Official activation link'}
                      {item.product.activationType === 'account' && 'Private account credentials'}
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center border border-white/[0.1] rounded-xl bg-white/[0.02]">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 hover:bg-white/[0.08] text-slate-400 hover:text-white transition rounded-l-xl"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 hover:bg-white/[0.08] text-slate-400 hover:text-white transition rounded-r-xl"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Price in Monospace */}
                  <div className="text-right">
                    <span className="font-mono font-black text-sm text-cyan-300">
                      {item.selectedPlan.contactForPrice
                        ? 'Quote'
                        : `${settings.currencySymbol}${(item.selectedPlan.price * item.quantity).toFixed(2)}`}
                    </span>
                    {item.quantity > 1 && !item.selectedPlan.contactForPrice && (
                      <div className="text-[10px] font-mono text-slate-500">
                        {settings.currencySymbol}{item.selectedPlan.price} each
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-[#080a12] border-t border-white/[0.08] space-y-2.5">
              
              {/* Subtotal */}
              <div className="flex items-center justify-between pb-1 font-mono">
                <span className="text-xs text-slate-400">Total ({cartCount} items):</span>
                <span className="text-2xl font-black text-white">
                  {settings.currencySymbol}{cartTotal.toFixed(2)}
                </span>
              </div>

              {/* Login Required Notice */}
              {!currentUser && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-300 flex items-center gap-1.5 text-[11px]">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Login required to complete order
                  </span>
                  <button
                    onClick={() => {
                      setAuthRedirectReason('Please sign in or create an account first to complete your order.');
                      setIsUserAuthOpen(true);
                    }}
                    className="text-black bg-cyan-400 hover:bg-cyan-300 font-bold px-2 py-0.5 rounded-lg text-[10px] transition cursor-pointer"
                  >
                    Sign In First
                  </button>
                </div>
              )}

              {/* Step 1 Primary Action: Checkout & Pay via Reddit DM */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>{currentUser ? 'Checkout & Pay via Reddit DM' : 'Sign In & Checkout via Reddit'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Direct 1-Click Instant Reddit DM */}
              <a
                href={directCartRedditUrl}
                onClick={(e) => {
                  if (!currentUser) {
                    e.preventDefault();
                    setAuthRedirectReason('Please sign in or create an account before messaging the seller with your cart.');
                    setIsUserAuthOpen(true);
                  }
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white/[0.05] hover:bg-white/[0.09] text-white border border-white/10 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant 1-Click Reddit DM (Pre-Filled)</span>
              </a>

              {/* Copy formatted cart summary */}
              <button
                onClick={handleCopyCart}
                className="w-full bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 border border-white/[0.06] font-mono text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Cart Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Cart Text to Paste into Reddit Chat</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition pt-1 font-mono"
              >
                &gt;_ continue browsing
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
