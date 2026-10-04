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
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  FileText,
  Phone
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerOrderDetails } from '../types';
import { buildRedditDmUrl } from '../services/emailService';
import { DEFAULT_CHECKOUT_SETTINGS } from '../data/defaultProducts';

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

  const cfg = settings.checkoutSettings || DEFAULT_CHECKOUT_SETTINGS;

  const [formData, setFormData] = useState<CustomerOrderDetails>(() => ({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    redditUsername: '',
    telegramOrWhatsapp: '',
    activationEmailOrAccount: currentUser?.email || '',
    accountPassword: '',
    notes: '',
    customFieldValue: '',
  }));

  const [showPassword, setShowPassword] = useState(false);

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

    if (cfg.fullName?.enabled && cfg.fullName?.required && !formData.fullName.trim()) {
      setErrorMsg(`Please enter your ${cfg.fullName.label || 'Full Name'}.`);
      return;
    }
    if (cfg.deliveryEmail?.enabled && cfg.deliveryEmail?.required && !formData.email.trim()) {
      setErrorMsg(`Please enter a valid ${cfg.deliveryEmail.label || 'Delivery Email'}.`);
      return;
    }
    if (cfg.activationEmail?.enabled && cfg.activationEmail?.required && !formData.activationEmailOrAccount?.trim()) {
      setErrorMsg(`Please enter your ${cfg.activationEmail.label || 'Account Email / ID for Activation'}.`);
      return;
    }
    if (cfg.accountPassword?.enabled && cfg.accountPassword?.required && !formData.accountPassword?.trim()) {
      setErrorMsg(`Please enter your ${cfg.accountPassword.label || 'Existing Account Password / PIN'} so we can access and activate your subscription.`);
      return;
    }
    if (cfg.redditUsername?.enabled && cfg.redditUsername?.required && !formData.redditUsername?.trim()) {
      setErrorMsg(`Please enter your ${cfg.redditUsername.label || 'Reddit Username'}.`);
      return;
    }
    if (cfg.telegramOrWhatsapp?.enabled && cfg.telegramOrWhatsapp?.required && !formData.telegramOrWhatsapp?.trim()) {
      setErrorMsg(`Please enter your ${cfg.telegramOrWhatsapp.label || 'Telegram or WhatsApp handle'}.`);
      return;
    }
    if (cfg.paymentNotes?.enabled && cfg.paymentNotes?.required && !formData.notes?.trim()) {
      setErrorMsg(`Please specify your ${cfg.paymentNotes.label || 'Payment Method / Notes'}.`);
      return;
    }
    if (cfg.customField?.enabled && cfg.customField?.required && !formData.customFieldValue?.trim()) {
      setErrorMsg(`Please fill in ${cfg.customField.label || 'the required order detail'}.`);
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
              {cfg.checkoutNoticeText || 'Enter your details below. When you confirm, we will notify the seller and immediately open a Reddit DM with your items pre-filled so you can pay (Crypto, PayPal, etc.) and get activated right on Reddit!'}
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

            {/* Full Name & Delivery Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cfg.fullName?.enabled && (
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    {cfg.fullName.label || 'Full Name'} {cfg.fullName.required && <span className="text-rose-400 font-bold">*</span>}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required={cfg.fullName.required}
                      placeholder={cfg.fullName.placeholder || 'John Doe'}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                    />
                  </div>
                  {cfg.fullName.helperText && (
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">{cfg.fullName.helperText}</p>
                  )}
                </div>
              )}

              {cfg.deliveryEmail?.enabled && (
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">
                    {cfg.deliveryEmail.label || 'Delivery Email Address'} {cfg.deliveryEmail.required && <span className="text-rose-400 font-bold">*</span>}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required={cfg.deliveryEmail.required}
                      placeholder={cfg.deliveryEmail.placeholder || 'john@example.com'}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                    />
                  </div>
                  {cfg.deliveryEmail.helperText && (
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">{cfg.deliveryEmail.helperText}</p>
                  )}
                </div>
              )}
            </div>

            {/* Account Email for Activation */}
            {cfg.activationEmail?.enabled && (
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  {cfg.activationEmail.label || 'Account Email / ID for Activation'} {cfg.activationEmail.required && <span className="text-rose-400 font-bold">*</span>}
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required={cfg.activationEmail.required}
                    placeholder={cfg.activationEmail.placeholder || 'e.g. Canva, Coursera or YouTube account email'}
                    value={formData.activationEmailOrAccount}
                    onChange={(e) => setFormData({ ...formData, activationEmailOrAccount: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                  />
                </div>
                {cfg.activationEmail.helperText && (
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">{cfg.activationEmail.helperText}</p>
                )}
              </div>
            )}

            {/* Account Password / Access PIN (Special Field for direct account access) */}
            {cfg.accountPassword?.enabled && (
              <div className="p-3.5 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{cfg.accountPassword.label || 'Existing Account Password / Access PIN'}</span>
                    {cfg.accountPassword.required && <span className="text-rose-400 font-bold">*</span>}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={cfg.accountPassword.required}
                    placeholder={cfg.accountPassword.placeholder || 'Account password (if activation requires logging in)'}
                    value={formData.accountPassword || ''}
                    onChange={(e) => setFormData({ ...formData, accountPassword: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-amber-500/30 focus:border-amber-400 rounded-xl focus:ring-1 focus:ring-amber-400/20 text-white placeholder-slate-500 outline-none font-mono"
                  />
                </div>
                <p className="text-[10px] text-amber-200/80 font-mono leading-relaxed">
                  {cfg.accountPassword.helperText || '🔒 Provided exclusively to the seller to log in and activate or upgrade your subscription.'}
                </p>
              </div>
            )}

            {/* Reddit Username & Telegram / WhatsApp */}
            {(cfg.redditUsername?.enabled || cfg.telegramOrWhatsapp?.enabled) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cfg.redditUsername?.enabled && (
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      {cfg.redditUsername.label || 'Your Reddit Username'} {cfg.redditUsername.required && <span className="text-rose-400 font-bold">*</span>}
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-orange-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required={cfg.redditUsername.required}
                        placeholder={cfg.redditUsername.placeholder || 'u/YourUsername'}
                        value={formData.redditUsername}
                        onChange={(e) => setFormData({ ...formData, redditUsername: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                      />
                    </div>
                    {cfg.redditUsername.helperText && (
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{cfg.redditUsername.helperText}</p>
                    )}
                  </div>
                )}

                {cfg.telegramOrWhatsapp?.enabled && (
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">
                      {cfg.telegramOrWhatsapp.label || 'Telegram or WhatsApp'} {cfg.telegramOrWhatsapp.required && <span className="text-rose-400 font-bold">*</span>}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required={cfg.telegramOrWhatsapp.required}
                        placeholder={cfg.telegramOrWhatsapp.placeholder || '@handle or phone number'}
                        value={formData.telegramOrWhatsapp}
                        onChange={(e) => setFormData({ ...formData, telegramOrWhatsapp: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                      />
                    </div>
                    {cfg.telegramOrWhatsapp.helperText && (
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{cfg.telegramOrWhatsapp.helperText}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Custom Requirement Field */}
            {cfg.customField?.enabled && (
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  {cfg.customField.label || 'Additional Order Requirement'} {cfg.customField.required && <span className="text-rose-400 font-bold">*</span>}
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required={cfg.customField.required}
                    placeholder={cfg.customField.placeholder || 'Enter requested detail...'}
                    value={formData.customFieldValue || ''}
                    onChange={(e) => setFormData({ ...formData, customFieldValue: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                  />
                </div>
                {cfg.customField.helperText && (
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">{cfg.customField.helperText}</p>
                )}
              </div>
            )}

            {/* Payment Method / Notes */}
            {cfg.paymentNotes?.enabled && (
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  {cfg.paymentNotes.label || 'Preferred Payment Method / Notes'} {cfg.paymentNotes.required && <span className="text-rose-400 font-bold">*</span>}
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required={cfg.paymentNotes.required}
                    placeholder={cfg.paymentNotes.placeholder || 'e.g. Prefer Crypto (USDT/SOL/BTC), PayPal, or UPI'}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                  />
                </div>
                {cfg.paymentNotes.helperText && (
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">{cfg.paymentNotes.helperText}</p>
                )}
              </div>
            )}
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
