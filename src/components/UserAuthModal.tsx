import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Package, 
  ShieldCheck, 
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const UserAuthModal: React.FC = () => {
  const { 
    isUserAuthOpen, 
    setIsUserAuthOpen, 
    currentUser, 
    loginUser, 
    registerUser, 
    logoutUser,
    userOrders,
    settings,
    setIsAdminOpen,
    authRedirectReason
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isUserAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'login') {
      const res = loginUser(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to sign in.');
      } else {
        setSuccessMsg('Signed in successfully!');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      const res = registerUser(name, email, password);
      if (!res.success) {
        setError(res.error || 'Failed to create account.');
      } else {
        setSuccessMsg('Account created successfully!');
      }
    }
  };

  const handleOpenDeveloperModal = () => {
    setIsUserAuthOpen(false);
    setIsAdminOpen(true);
  };

  // If user is already logged in, show their Account Overview & Order History
  if (currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
        <div className="bg-[#0b0e17] text-white rounded-3xl shadow-2xl max-w-lg w-full border border-white/[0.09] overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-white">
                  {currentUser.name || 'Valued Customer'}
                </h3>
                <p className="text-xs font-mono text-cyan-400">{currentUser.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsUserAuthOpen(false)}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Account Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Quick Status Pill */}
            <div className="p-3.5 bg-cyan-950/30 border border-cyan-800/40 rounded-2xl flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Account Active & Verified
              </span>
              <span className="text-cyan-400 font-semibold">Customer Hub</span>
            </div>

            {/* My Subscriptions / Orders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  Your Orders & Activations
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>

              {userOrders.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <p className="text-xs text-slate-400">No active orders yet.</p>
                  <p className="text-[11px] text-slate-500">
                    Add items to your cart and checkout — your activations and order receipts will be stored here automatically!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2.5 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-white/[0.05] pb-2">
                        <span>ID: <strong className="text-white">{ord.orderId}</strong></span>
                        <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-1">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-slate-300 text-xs">
                            <span>{item.productTitle} ({item.planLabel}) x{item.quantity}</span>
                            <span className="text-cyan-400 font-bold">{settings.currencySymbol}{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[11px]">
                        <span className="inline-flex items-center gap-1.5 text-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                          Activation Pending
                        </span>
                        <span className="font-bold text-white text-xs">
                          Total: {settings.currencySymbol}{ord.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
            <button
              onClick={() => setIsUserAuthOpen(false)}
              className="text-xs font-mono text-slate-400 hover:text-white px-3 py-2 rounded-xl transition"
            >
              Close
            </button>
            <button
              onClick={logoutUser}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in: Show Customer Login / Register form
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in-95">
      <div className="bg-[#0b0e17] text-white rounded-3xl shadow-2xl max-w-md w-full border border-white/[0.09] overflow-hidden flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-300 flex items-center justify-center font-black text-black text-xl shadow-[0_0_15px_rgba(245,158,11,0.35)]">
              ⚡
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                CUSTOMER PORTAL
              </span>
              <h3 className="font-display font-extrabold text-lg text-white">
                {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsUserAuthOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div className="flex border-b border-white/[0.08] bg-white/[0.01]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              mode === 'login'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              mode === 'register'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Login Required Notice for Order Placement */}
        {authRedirectReason && (
          <div className="mx-6 mt-4 p-3.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-amber-200 font-mono shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-sans text-xs">Login Required to Complete Order</strong>
              <span className="text-[11px] leading-relaxed text-amber-200/90">{authRedirectReason}</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-900/60 text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Name Field (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Turner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white/[0.04] border border-white/[0.1] focus:border-cyan-500/60 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white/[0.04] border border-white/[0.1] focus:border-cyan-500/60 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition font-mono"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              {mode === 'login' && (
                <span className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer">
                  Forgot?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-white/[0.04] border border-white/[0.1] focus:border-cyan-500/60 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white/[0.04] border border-white/[0.1] focus:border-cyan-500/60 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition font-mono"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{mode === 'login' ? 'Sign In to SubPrime' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Customer Guarantee Note */}
          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All activations & order histories are automatically synced to this email.</span>
          </div>

        </form>

        {/* DISTINCT DEVELOPER LOGIN LINK (Strictly separate from customer login) */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.01] text-center">
          <button
            type="button"
            onClick={handleOpenDeveloperModal}
            className="text-[11px] font-mono text-slate-500 hover:text-cyan-400 flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span>Store Owner? <strong>Open Developer Portal</strong></span>
          </button>
        </div>

      </div>
    </div>
  );
};
