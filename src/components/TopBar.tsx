import React from 'react';
import {
  Volume2,
  VolumeX,
  Radio,
  HelpCircle,
  Home,
  Settings,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../audio/soundEngine';

export const TopBar: React.FC = () => {
  const {
    state,
    isHome,
    setIsHome,
    language,
    soundMuted,
    toggleMute,
    ambientActive,
    toggleAmbient,
    setTutorialOpen,
    setSettingsOpen,
    getRankName,
  } = useGame();

  const handleHomeClick = () => {
    sound.playTap();
    setIsHome(true);
  };

  const handleTutorialClick = () => {
    sound.playTap();
    setTutorialOpen(true);
  };

  const handleSettingsClick = () => {
    sound.playTap();
    setSettingsOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c140d]/95 backdrop-blur-md border-b border-[#3b4e39] shadow-lg">
      <div className="max-w-[1480px] mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            title="Ke Halaman Utama"
          >
            {/* Tactical Military Insignia */}
            <div className="w-9 h-10 sm:w-10 sm:h-11 flex-none drop-shadow-md">
              <svg viewBox="0 0 52 58" className="w-full h-full" aria-hidden="true">
                <path
                  d="M26 3 46 10v18c0 13-7 22-20 28C13 50 6 41 6 28V10Z"
                  fill="#213423"
                  stroke="#c5cf96"
                  strokeWidth="2.2"
                />
                <path
                  d="M26 13 30 24 42 24 32 31 36 43 26 36 16 43 20 31 10 24 22 24Z"
                  fill="#dfcd83"
                />
                <path
                  d="M11 47h9M32 47h9"
                  stroke="#dfcd83"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-sm sm:text-base tracking-wider text-[#f1f0dc] leading-tight">
                <span>WIRA DARAT</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2b3d2c] border border-[#607551] text-[#e0d393]">
                  v9.2
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#98aa8e] uppercase">
                {language === 'en' ? 'ARMY CAREER SIMULATION' : 'SIMULASI KERJAYA TENTERA DARAT'}
              </div>
            </div>
          </button>
        </div>

        {/* Center Zone: Active soldier tag on desktop */}
        {state && !isHome && (
          <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-[#162319] border border-[#3c5039] rounded-lg text-xs text-[#d2dcce]">
            <span className="w-2 h-2 rounded-full bg-[#82bc67] animate-pulse" />
            <span>
              {state.name} <span className="text-[#849a7a]">·</span> <b className="text-[#e2d599]">{getRankName()}</b>
            </span>
            <span className="text-[#849a7a]">·</span>
            <span className="text-[#a5b99f] font-mono text-[11px]">
              {state.path === 'llp' ? 'LLP' : 'PEGAWAI'}
            </span>
          </div>
        )}

        {/* Action Controls: Audio, Tutorial, Language, Home */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleAmbient}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              ambientActive && !soundMuted
                ? 'bg-[#293b2a] border-[#819661] text-[#e3d79b] shadow-[0_0_12px_rgba(129,150,97,0.35)]'
                : 'bg-[#152218] border-[#374934] text-[#8ea08b] hover:text-[#e0e8db]'
            }`}
            title={
              ambientActive
                ? language === 'en'
                  ? 'Ambient drone: Active'
                  : 'Bunyi atmosfera: Aktif'
                : language === 'en'
                ? 'Ambient drone: Off'
                : 'Bunyi atmosfera: Mati'
            }
          >
            <Radio className="w-4 h-4" />
            <span className="hidden md:inline text-[11px] font-semibold">
              {ambientActive && !soundMuted ? 'Radio ON' : 'Radio'}
            </span>
          </button>

          {/* Master Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
              soundMuted
                ? 'bg-[#3b2320] border-[#8b4f44] text-[#e89d8f]'
                : 'bg-[#1b2b1d] border-[#4b6045] text-[#dce5d4] hover:border-[#8da06e]'
            }`}
            title={soundMuted ? 'Bunyi ditutup (Muted)' : 'Bunyi aktif (Unmuted)'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Tutorial Button */}
          <button
            onClick={handleTutorialClick}
            className="p-2 sm:px-2.5 sm:py-2 rounded-lg bg-[#1a291d] border border-[#485c42] text-[#d6dfce] hover:border-[#869966] text-xs flex items-center gap-1.5 cursor-pointer"
            title="Panduan Tutorial Lapangan"
          >
            <HelpCircle className="w-4 h-4 text-[#d9ce93]" />
            <span className="hidden sm:inline font-semibold">
              {language === 'en' ? 'Field Guide' : 'Panduan'}
            </span>
          </button>

          {/* Home Button */}
          {!isHome && (
            <button
              onClick={handleHomeClick}
              className="p-2 sm:px-2.5 sm:py-2 rounded-lg bg-[#273827] border border-[#5c7250] text-[#e6ede0] hover:bg-[#344a34] text-xs flex items-center gap-1.5 cursor-pointer font-bold"
              title="Kembali ke Halaman Utama"
            >
              <Home className="w-4 h-4 text-[#e0d393]" />
              <span className="hidden sm:inline">
                {language === 'en' ? 'Home' : 'Utama'}
              </span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={handleSettingsClick}
            className="p-2 rounded-lg bg-[#142017] border border-[#3a4d36] text-[#b3c2ae] hover:text-[#f0f4ea] text-xs cursor-pointer"
            title="Tetapan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
