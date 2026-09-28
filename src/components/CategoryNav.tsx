import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/defaultProducts';
import { 
  Grid, 
  Film, 
  Cpu, 
  GraduationCap, 
  Briefcase, 
  Shield, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { CategoryId } from '../types';

const ICON_MAP: Record<string, React.ReactNode> = {
  Grid: <Grid className="w-3.5 h-3.5" />,
  Film: <Film className="w-3.5 h-3.5 text-rose-400" />,
  Cpu: <Cpu className="w-3.5 h-3.5 text-cyan-400" />,
  GraduationCap: <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />,
  Briefcase: <Briefcase className="w-3.5 h-3.5 text-blue-400" />,
  Shield: <Shield className="w-3.5 h-3.5 text-amber-400" />,
};

export const CategoryNav: React.FC = () => {
  const { selectedCategory, setSelectedCategory, products, setIsCustomRequestOpen } = useStore();

  const getProductCount = (catId: CategoryId) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <nav aria-label="Product categories" className="bg-[#08090d]/80 backdrop-blur-md border-b border-white/[0.06] sticky top-[73px] z-30 shadow-lg">
      <div className="max-w-[1500px] mx-auto px-3 sm:px-5 py-2 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
        
        {CATEGORIES.map((cat, idx) => {
          const isActive = selectedCategory === cat.id;
          const count = getProductCount(cat.id);
          const indexFormatted = String(idx + 1).padStart(2, '0');

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]'
                  : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/15'
              }`}
            >
              <span>{ICON_MAP[cat.icon] || <Sparkles className="w-3.5 h-3.5" />}</span>
              <span className="font-sans">{cat.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/[0.05] text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Custom Unlisted Sub Request Pill */}
        <button
          onClick={() => setIsCustomRequestOpen(true)}
          className="ml-auto hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 whitespace-nowrap transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
          <span>&gt;_ custom request</span>
        </button>

      </div>
    </nav>
  );
};
