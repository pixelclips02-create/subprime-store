import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  MessageSquare, 
  Copy, 
  Check, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { buildRedditDmUrl, buildRedditProfileUrl } from '../services/emailService';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, settings } = useStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (lastPlacedOrder) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  }, [lastPlacedOrder]);

  if (!lastPlacedOrder) return null;

  const redditDmUrl = buildRedditDmUrl(
    settings.redditUsername,
    lastPlacedOrder,
    settings
  );

  const redditProfileUrl = buildRedditProfileUrl(settings.redditUsername);

  const orderTextSummary = `🚀 SubPrime Order #${lastPlacedOrder.orderId}
👤 Name: ${lastPlacedOrder.customer.fullName}
📧 Delivery Email: ${lastPlacedOrder.customer.email}
${lastPlacedOrder.customer.activationEmailOrAccount ? `🔑 Activation Account: ${lastPlacedOrder.customer.activationEmailOrAccount}\n` : ''}
📦 Subscriptions:
${lastPlacedOrder.items.map(i => `• ${i.productTitle} (${i.planLabel}) x${i.quantity} - ${settings.currencySymbol}${i.price}`).join('\n')}

💰 Total: ${settings.currencySymbol}${lastPlacedOrder.totalAmount.toFixed(2)}
${lastPlacedOrder.customer.notes ? `📝 Note: ${lastPlacedOrder.customer.notes}\n` : ''}
Hi! I'm ready to pay on Reddit. Please share your payment details (Crypto/PayPal/etc.) and activation link!`;

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderTextSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95">
      <div className="bg-[#0c0f18] text-slate-100 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-center border border-white/[0.09] space-y-4">
        
        {/* Success Icon with Glow */}
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Title */}
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
            &gt;_ ORDER DISPATCHED TO SELLER
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white mt-2">
            Ready to Pay & Activate on Reddit
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Order Reference: <strong className="text-cyan-300 font-bold">#{lastPlacedOrder.orderId}</strong>
          </p>
        </div>

        {/* Email Notification Status */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-left text-xs text-slate-300 flex items-start gap-2">
          <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-[11px] font-mono">
            <span className="font-bold text-white">Seller Alert Dispatched:</span> A copy was emailed to <span className="text-cyan-300">{settings.sellerEmail}</span>.
          </div>
        </div>

        {/* Primary Reddit Payment Handoff Box */}
        <div className="bg-gradient-to-br from-orange-500/10 via-[#101422] to-amber-500/10 border border-orange-500/30 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-orange-400" />
              Finalize Payment with u/{settings.redditUsername}
            </span>
            <span className="text-[9px] font-mono font-bold bg-orange-500 text-black px-2 py-0.5 rounded-full uppercase">
              Action Required
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Click below to open a direct message with the seller. Your order items, activation email, and total are already pre-filled:
          </p>

          {/* Action 1: Launch Reddit DM (Pre-filled) */}
          <a
            href={redditDmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.35)] transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Pre-Filled Reddit DM Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Action 2: Alternative Reddit Chat Profile Link */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
            <button
              onClick={handleCopyOrder}
              className="py-2 px-3 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-xs font-bold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Order</span>
                </>
              )}
            </button>

            <a
              href={redditProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-xs font-bold text-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-orange-400" />
              <span>Seller Chat</span>
            </a>
          </div>
        </div>

        {/* Items Summary */}
        <div className="bg-[#080a12] rounded-xl p-3 text-left text-xs space-y-1 border border-white/[0.06] font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Customer:</span>
            <strong className="text-white font-sans">{lastPlacedOrder.customer.fullName}</strong>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Delivery:</span>
            <strong className="text-white">{lastPlacedOrder.customer.email}</strong>
          </div>
          <div className="border-t border-white/[0.06] pt-1.5 flex justify-between font-black text-white text-sm">
            <span>Total:</span>
            <span className="text-cyan-300">{settings.currencySymbol}{lastPlacedOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Done / Continue Shopping */}
        <button
          onClick={() => setLastPlacedOrder(null)}
          className="w-full py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl text-xs font-mono font-bold transition border border-white/10"
        >
          &gt;_ close & back to storefront
        </button>

      </div>
    </div>
  );
};
