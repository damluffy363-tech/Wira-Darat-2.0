import React from 'react';
import { Award, Trophy, Star, ChevronRight } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const AwardModal: React.FC = () => {
  const { currentAward, dismissAward, language } = useGame();

  if (!currentAward) return null;

  const isTitle = currentAward.kind.includes('GELARAN');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-gradient-to-br from-[#243522] via-[#1a271b] to-[#142116] border-2 border-[#dfce88] rounded-2xl max-w-md w-full p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(223,206,136,0.25)] space-y-4">
        {/* Animated Badge Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#dfce88] to-[#998845] text-[#121c13] flex items-center justify-center text-4xl shadow-lg border border-[#fbf2c2] animate-bounce">
          {isTitle ? <Trophy className="w-10 h-10" /> : <Award className="w-10 h-10" />}
        </div>

        <div>
          <span className="text-[11px] font-mono text-[#dfce88] uppercase tracking-widest font-bold block mb-1">
            {currentAward.kind}
          </span>
          <h3 className="text-2xl font-black text-[#f1f6ec]">
            {currentAward.name}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#cbd8c6] leading-relaxed max-w-sm mx-auto">
          {currentAward.desc}
        </p>

        <div className="pt-3">
          <button
            onClick={dismissAward}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#dfce88] to-[#c7b66d] hover:from-[#ebd994] hover:to-[#d2c178] text-[#121c13] font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{language === 'en' ? 'Honor & Continue Service' : 'Terima Kasih, Teruskan Perkhidmatan'}</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
