import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Terminal,
  Tag,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, setIsCustomRequestOpen, settings } = useStore();

  const slides = [
    {
      title: "PREMIUM DIGITAL ASSETS",
      headlinePrefix: "Genuine digital activations",
      headlineHighlight: "engineered for creators & teams.",
      tagline: "Official individual links & private accounts. Up to 80% off retail pricing with 100% replacement warranty.",
      badge: ">_ VERIFIED DIRECTORY • 2026 EDITION",
      highlightTitle: "YouTube & Netflix 4K",
      categoryTarget: 'entertainment' as const,
      terminalCmd: "subprime activate --target youtube-12m",
      terminalStatus: "status: official link dispatched",
    },
    {
      title: "APPLIED AI & DEV TOOLKIT",
      headlinePrefix: "Super Grok, Perplexity Pro,",
      headlineHighlight: "Bolt & Lovable AI systems.",
      tagline: "High-throughput AI generators, model access, and workflow tools with activation on your personal email.",
      badge: ">_ AI & DEVELOPER PIPELINE",
      highlightTitle: "AI & Developer Suite",
      categoryTarget: 'ai_dev' as const,
      terminalCmd: "subprime activate --ai perplexity-pro",
      terminalStatus: "status: claude-3.5 + gpt-4o online",
    },
    {
      title: "CAREER & PRODUCTIVITY MATRIX",
      headlinePrefix: "LinkedIn Premium & Microsoft 365",
      headlineHighlight: "with private cloud storage.",
      tagline: "InMail credits, full LinkedIn Learning library, and 1TB OneDrive cloud for up to 5 concurrent devices.",
      badge: ">_ ENTERPRISE CAREER HUB",
      highlightTitle: "Career Accelerators",
      categoryTarget: 'career_productivity' as const,
      terminalCmd: "subprime activate --career linkedin-biz",
      terminalStatus: "status: 12-month voucher ready",
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="relative mb-8 rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#0c0f17] via-[#090b12] to-[#08090d] shadow-2xl p-5 sm:p-8 lg:p-10">
      
      {/* Decorative Aurora Glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Hero Column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Cyberpunk Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{slide.badge}</span>
          </div>

          {/* Main Headline in Space Grotesk */}
          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
            <span>{slide.headlinePrefix} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              {slide.headlineHighlight}
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm sm:leading-relaxed max-w-xl font-normal">
            {slide.tagline}
          </p>

          {/* Feature Specs in JetBrains Mono */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 font-mono text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Genuine Activations
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> Activation on Your Email
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fast Delivery
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedCategory(slide.categoryTarget)}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center gap-2 transition cursor-pointer"
            >
              <span>Explore {slide.highlightTitle}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCustomRequestOpen(true)}
              className="bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/10 flex items-center gap-2 transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-orange-400" />
              <span>Custom Request</span>
            </button>
          </div>

        </div>

        {/* Right Hero Column: Terminal Widget & Reddit Handoff */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Floating Live Terminal Widget */}
          <div className="bg-[#090c14]/90 backdrop-blur-xl border border-white/[0.09] rounded-2xl p-4 shadow-2xl font-mono text-xs text-slate-300 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-[10px] text-slate-500 tracking-wider">subprime-terminal</span>
            </div>
            
            <div className="space-y-1.5 text-[11px] leading-relaxed">
              <div className="text-slate-400">
                <span className="text-cyan-400">~/subprime</span> {slide.terminalCmd}
              </div>
              <div className="text-emerald-400 font-bold">
                {slide.terminalStatus}
              </div>
              <div className="text-slate-500 text-[10px]">
                activation target: your-personal-email@domain.com
              </div>
            </div>
          </div>

          {/* Reddit Direct Contact Box */}
          <div className="bg-gradient-to-br from-orange-500/10 via-[#101422] to-amber-500/10 border border-orange-500/30 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-wider text-orange-400 uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> REDDIT ACTIVATIONS
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                u/{settings.redditUsername}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              All payment methods and custom activations arranged directly on Reddit. Add items to cart or message for instant quote!
            </p>

            <a
              href={`https://www.reddit.com/user/${settings.redditUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>DM on Reddit (u/{settings.redditUsername})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-2 pt-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1 rounded-full transition-all cursor-pointer ${
              i === currentSlide ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>

    </div>
  );
};
