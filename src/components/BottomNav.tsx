import React from 'react';
import { Compass, Flag, TrendingUp, ShoppingBag, UserCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../audio/soundEngine';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { state, isHome, language } = useGame();

  if (!state || isHome) return null;

  const handleTab = (tab: string) => {
    sound.playTap();
    onTabChange(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    {
      id: 'story',
      label: language === 'en' ? 'Missions' : 'Misi',
      sub: 'Cerita',
      icon: Compass,
      alert: state.monthlyCorpsDue,
    },
    {
      id: 'corps',
      label: language === 'en' ? 'Corps' : 'Kor',
      sub: 'GGK',
      icon: Flag,
    },
    {
      id: 'career',
      label: language === 'en' ? 'Career' : 'Kerjaya',
      sub: 'Pangkat',
      icon: TrendingUp,
    },
    {
      id: 'shop',
      label: language === 'en' ? 'Armory' : 'Kedai',
      sub: 'Barang',
      icon: ShoppingBag,
    },
    {
      id: 'profile',
      label: language === 'en' ? 'Record' : 'Fail',
      sub: 'Profil',
      icon: UserCheck,
    },
  ];

  return (
    <nav
      aria-label="Navigasi Mudah Alih"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1710]/95 backdrop-blur-md border-t border-[#3d503c] shadow-[0_-8px_20px_rgba(0,0,0,0.5)] pb-[max(env(safe-area-inset-bottom),8px)]"
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'career' && activeTab === 'courses') ||
            (item.id === 'shop' && activeTab === 'posting') ||
            (item.id === 'profile' && activeTab === 'awards');

          return (
            <button
              key={item.id}
              onClick={() => handleTab(item.id)}
              className={`relative flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer rounded-lg active:scale-95 ${
                isActive
                  ? 'text-[#e6dc9f] font-bold'
                  : 'text-[#8b9c88] hover:text-[#cad6c5]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {item.alert && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#e58c7d] animate-ping" />
                )}
                {item.alert && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#d86f5f] border border-[#101810]" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 leading-tight truncate">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 rounded-full bg-[#dfd08c]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
