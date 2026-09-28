import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Mail, 
  MessageSquare, 
  User, 
  Check, 
  Sparkles,
  Loader2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerOrderDetails } from '../types';
import { buildRedditDmUrl } from '../services/emailService';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    settings, 
    placeOrder,
    currentUser,
    setIsUserAuthOpen,
    setAuthRedirectReason 
  } = useStore();

  const [formData, setFormData] = useState<CustomerOrderDetails>(() => ({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    redditUsername: '',
    telegramOrWhatsapp: '',
    activationEmailOrAccount: currentUser?.email || '',
    notes: '',
  }));

  React.useEffect(() => {
    if (currentUser && isCheckoutOpen) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        email: prev.email || currentUser.email,
        activationEmailOrAccount: prev.activationEmailOrAccount || currentUser.email
      }));
    }
  }, [currentUser, isCheckoutOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCheckoutOpen) return null;

  // Strict check: User MUST be logged in to checkout or place order
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95">
        <div className="bg-[#0c0f18] text-slate-100 rounded-3xl shadow-2xl max-w-md w-full border border-white/[0.09] p-7 text-center space-y-4">
          <div className="w-14 h-14 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              &gt;_ AUTHENTICATION REQUIRED
            </span>
            <h3 className="font-display font-extrabold text-xl text-white mt-1">
              Please Sign In First
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono leading-relaxed">
              You must be logged in to place an order. Your digital subscription activation, order receipt, and warranty will be linked to your account.
            </p>
          </div>
          <button
            onClick={() => {
              setAuthRedirectReason('Please sign in or create an account to complete your order and receive activation.');
              setIsUserAuthOpen(true);
            }}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Sign In / Create Account to Continue</span>
          </button>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-full text-xs font-mono text-slate-500 hover:text-slate-300 py-1 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      setErrorMsg('Login required: Please sign in or create an account first.');
      setAuthRedirectReason('Please sign in or create an account to place an order.');
      setIsUserAuthOpen(true);
      return;
    }

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMsg('Please enter your name and valid delivery email.');
      return;
    }

    try {
      setIsSubmitting(true);
      const createdOrder = await placeOrder(formData);
      
      // Auto-open Reddit DM in a new tab for instant payment conversation!
      const dmUrl = buildRedditDmUrl(settings.redditUsername, createdOrder, settings);
      window.open(dmUrl, '_blank');
    } catch (err) {
      console.error('Order error:', err);
      setErrorMsg('Failed to process order. Please message directly on Reddit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0c0f18] text-slate-100 rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-white/[0.09] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#080a12] p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base tracking-tight text-white leading-tight">
                Reddit Order & Payment Handoff
              </h2>
              <span className="text-[11px] font-mono text-cyan-400">
                Direct activation with u/{settings.redditUsername}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-orange-500/10 border-b border-orange-500/20 px-5 py-3 text-xs text-orange-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-white">Direct Reddit Payment Flow:</strong>
            <p className="text-orange-200/90 text-[11px] mt-0.5 leading-relaxed font-sans">
              Enter your email below. When you confirm, we will notify the seller at <strong>{settings.sellerEmail}</strong> and immediately open a <strong>Reddit DM with your items pre-filled</strong> so you can pay (Crypto, PayPal, etc.) and get activated right on Reddit!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl font-mono">
              {errorMsg}
            </div>
          )}

          {/* Customer Details */}
          <div className="space-y-4">
            <div className="border-b border-white/[0.06] pb-2 flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <span>01 //</span> Your Details for Activation & Support
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Delivery Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Your Reddit Username (Recommended)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-orange-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="u/YourUsername"
                    value={formData.redditUsername}
                    onChange={(e) => setFormData({ ...formData, redditUsername: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Telegram or WhatsApp (Optional)
                </label>
                <input
                  type="text"
                  placeholder="@handle or phone number"
                  value={formData.telegramOrWhatsapp}
                  onChange={(e) => setFormData({ ...formData, telegramOrWhatsapp: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Account Email for Activation (If different from delivery email)
              </label>
              <input
                type="text"
                placeholder="e.g. Canva, Coursera or YouTube account email"
                value={formData.activationEmailOrAccount}
                onChange={(e) => setFormData({ ...formData, activationEmailOrAccount: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Preferred Payment Method / Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Prefer Crypto (USDT/SOL/BTC), PayPal, or UPI"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#080a12] p-4 rounded-xl border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs font-mono">
              <span className="text-slate-400 uppercase">Cart Items ({cart.length})</span>
              <span className="text-cyan-400">Seller: u/{settings.redditUsername}</span>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto divide-y divide-white/[0.04]">
              {cart.map((item) => (
                <div key={item.cartItemId} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-medium">{item.product.title}</span>
                    <span className="text-slate-500 font-mono ml-1">({item.selectedPlan.label}) x{item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-300">
                    {item.selectedPlan.contactForPrice
                      ? 'Quote'
                      : `${settings.currencySymbol}${(item.selectedPlan.price * item.quantity).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.08] pt-2.5 flex items-center justify-between font-mono">
              <span className="text-xs text-slate-400">Total Due on Reddit:</span>
              <span className="text-xl font-black text-white">
                {settings.currencySymbol}{cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-mono text-slate-400 hover:text-white rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Routing to Reddit...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Confirm Order & Open Reddit DM</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
