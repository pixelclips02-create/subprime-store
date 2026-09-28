import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Sparkles, 
  HelpCircle, 
  ExternalLink, 
  Send, 
  Check 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildRedditCustomRequestUrl } from '../services/emailService';

export const CustomRequestModal: React.FC = () => {
  const { isCustomRequestOpen, setIsCustomRequestOpen, settings } = useStore();

  const [subName, setSubName] = useState('');
  const [duration, setDuration] = useState('12 Months');
  const [targetBudget, setTargetBudget] = useState('');
  const [contactHandle, setContactHandle] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isCustomRequestOpen) return null;

  const redditUrl = buildRedditCustomRequestUrl(
    settings.redditUsername,
    `${subName} (${duration})`,
    targetBudget,
    contactHandle
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsCustomRequestOpen(false);
      setSubName('');
      setTargetBudget('');
      setContactHandle('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95">
      <div className="bg-[#0c0f18] text-slate-100 rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-white/[0.09] space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white leading-tight">
                Request Any Subscription
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Can't find what you need? We activate almost any tool!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomRequestOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="font-display font-bold text-white text-base">Request Received</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto font-mono">
              Checking availability. We will message you back shortly!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Quick Direct Reddit DM Banner */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3 text-xs text-orange-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Fastest Response via Reddit DM:</span>
                <p className="text-orange-200/90 text-[11px] mt-0.5 font-sans">
                  Message directly to <strong className="font-mono text-white">u/{settings.redditUsername}</strong> for real-time pricing and instant activation.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Subscription Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Disney+, Midjourney, Apple Music, Claude Pro"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Preferred Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#080a12] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white outline-none"
                >
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months (Yearly)</option>
                  <option value="Lifetime">Lifetime / Custom</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Target Budget (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. $15 or best price"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Your Reddit Username or Email *
              </label>
              <input
                type="text"
                required
                placeholder="u/YourUsername or your@email.com"
                value={contactHandle}
                onChange={(e) => setContactHandle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/60 rounded-xl focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 space-y-2">
              <a
                href={subName ? redditUrl : `https://www.reddit.com/user/${settings.redditUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.35)] transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>DM on Reddit with Request (1-Click)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="submit"
                className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-mono font-bold py-2.5 px-4 rounded-xl text-xs transition border border-white/[0.06]"
              >
                &gt;_ submit request here
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
