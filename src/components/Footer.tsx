import React from 'react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  ArrowUp, 
  Lock, 
  Zap, 
  CheckCircle2,
  SlidersHorizontal 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setIsAdminOpen, setIsCustomRequestOpen, isDeveloperMode, logoutDeveloper } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 bg-[#0a0d14]/90 backdrop-blur-xl text-white border-t border-white/[0.08] relative z-10">
      
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white py-3 text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border-b border-white/[0.05]"
      >
        <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
        <span>&gt;_ back to top</span>
      </button>

      {/* Main Footer Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs text-slate-400">
        
        {/* Column 1: Genuine Activations */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Guarantees & Standards
          </h4>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Genuine Activations
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Activation on your own email
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Full Term Replacement Warranty
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Details Changeable where applicable
            </li>
            <li className="flex items-center gap-2 text-amber-300">
              <Zap className="w-3.5 h-3.5" /> Fast Delivery
            </li>
          </ul>
        </div>

        {/* Column 2: Reddit & Custom Orders */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            Reddit Direct Handoff
          </h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Looking for a subscription not listed? Message directly on Reddit for instant custom quotes, payment instructions & delivery.
          </p>
          <a
            href={`https://www.reddit.com/user/${settings.redditUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-mono font-bold hover:underline"
          >
            <MessageSquare className="w-4 h-4" />
            <span>u/{settings.redditUsername}</span>
          </a>
          <div>
            <button
              onClick={() => setIsCustomRequestOpen(true)}
              className="text-xs text-cyan-400 hover:underline font-mono"
            >
              &gt;_ submit custom request →
            </button>
          </div>
        </div>

        {/* Column 3: Security & Verification */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            Privacy & Security
          </h4>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Official activation links without sharing passwords. Private accounts with zero unauthorized screen limits.
          </p>
          <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Order Processing</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Order Dispatch: {settings.sellerEmail}</span>
          </div>
        </div>

        {/* Column 4: Buyer Assurance (or Developer Administration if logged in) */}
        {isDeveloperMode ? (
          <div className="space-y-3 bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 font-mono">
            <h4 className="font-bold text-xs text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              Developer Active
            </h4>
            <p className="text-slate-300 leading-relaxed text-[10px]">
              Logged in as developer. Toggle stock, add products, or edit email settings.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Open Dev Portal</span>
              </button>
              <button
                onClick={logoutDeveloper}
                className="text-[10px] text-slate-400 hover:text-white underline text-center cursor-pointer"
              >
                Lock / Exit Dev Mode
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Verified Store
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Every order is backed by direct communication with our verified Reddit store representative and guaranteed replacement.
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-300 font-mono">
              <li>• Rapid Reddit chat response</li>
              <li>• Encrypted customer privacy</li>
              <li>• Direct activation assistance</li>
            </ul>
          </div>
        )}

      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/[0.06] py-6 text-center text-[11px] font-mono text-slate-500 space-y-1">
        <p className="font-medium text-slate-400">
          © {new Date().getFullYear()} SubPrime Digital. Engineered with high-fidelity activations.
        </p>
        <p className="text-slate-600 flex items-center justify-center gap-2">
          <span>Official digital subscription provisioning. All rights reserved.</span>
          <span>•</span>
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="text-slate-600 hover:text-slate-400 underline transition cursor-pointer"
          >
            Developer Portal
          </button>
        </p>
      </div>

    </footer>
  );
};
