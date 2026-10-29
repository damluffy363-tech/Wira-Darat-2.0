import React from 'react';
import {
  Settings,
  Volume2,
  VolumeX,
  Radio,
  Globe,
  Keyboard,
  X,
  RotateCcw,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../audio/soundEngine';

export const SettingsModal: React.FC = () => {
  const {
    settingsOpen,
    setSettingsOpen,
    language,
    setLanguage,
    soundMuted,
    toggleMute,
    sfxVolume,
    setSfxVolume,
    ambientActive,
    toggleAmbient,
    ambientVolume,
    setAmbientVolume,
    state,
    deleteSlot,
    store,
    showToast,
  } = useGame();

  if (!settingsOpen) return null;

  const handleClose = () => {
    sound.playTap();
    setSettingsOpen(false);
  };

  const handleTestSfx = () => {
    sound.playRadioChirp();
  };

  const handleTestFanfare = () => {
    sound.playFanfare();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-gradient-to-br from-[#192b1e] via-[#121f15] to-[#18291c] border-2 border-[#597547] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-xs text-[#e2ecdf]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#344833] bg-[#1d3122] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 font-bold text-sm text-[#f1f5ec]">
            <Settings className="w-4 h-4 text-[#dfce88]" />
            <span>
              {language === 'en' ? 'Audio & System Settings' : 'Tetapan Audio & Sistem'}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-[#2c4430] text-[#a5b99f] hover:text-[#f2f7ec] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Audio Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-[#dfce88] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Sound & Audio Synthesizer' : 'Kesan Bunyi & Audio'}</span>
            </h4>

            {/* Mute toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#121f15] border border-[#2e422d]">
              <div>
                <span className="font-bold text-[#f1f5ec] block text-sm">
                  {language === 'en' ? 'Master Sound' : 'Kesan Bunyi (SFX)'}
                </span>
                <span className="text-[11px] text-[#8fa28b]">
                  {language === 'en' ? 'Procedural Web Audio tactical sounds' : 'Bunyi taktikal radio, langkah kawad, dan letupan'}
                </span>
              </div>

              <button
                onClick={toggleMute}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold transition-all cursor-pointer ${
                  soundMuted
                    ? 'bg-[#3b211f] border-[#81453c] text-[#e89083]'
                    : 'bg-[#293d2b] border-[#5e7c53] text-[#e3edd9]'
                }`}
              >
                {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{soundMuted ? 'Muted' : 'Aktif'}</span>
              </button>
            </div>

            {/* SFX Volume slider */}
            <div className="p-3 rounded-xl bg-[#121f15] border border-[#2e422d] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#8da088]">{language === 'en' ? 'SFX Volume' : 'Kekuatan Bunyi SFX'}</span>
                <span className="font-bold text-[#dfce88]">{Math.round(sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                className="w-full accent-[#dfce88] cursor-pointer"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleTestSfx}
                  className="px-2.5 py-1 rounded bg-[#203122] hover:bg-[#2b422e] border border-[#435b3f] text-[10px] font-mono text-[#d6dfd2] cursor-pointer"
                >
                  Uji Radio Chirp
                </button>
                <button
                  onClick={handleTestFanfare}
                  className="px-2.5 py-1 rounded bg-[#203122] hover:bg-[#2b422e] border border-[#435b3f] text-[10px] font-mono text-[#dfce88] cursor-pointer"
                >
                  Uji Fanfare Bugle
                </button>
              </div>
            </div>

            {/* Ambient Drone Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#121f15] border border-[#2e422d]">
              <div>
                <span className="font-bold text-[#f1f5ec] block text-sm">
                  {language === 'en' ? 'Command Post Ambient Drone' : 'Bunyi Atmosfera Markas'}
                </span>
                <span className="text-[11px] text-[#8fa28b]">
                  {language === 'en' ? 'Subtle low-frequency tactical operations room hum' : 'Dengungan frekuensi rendah atmosfera bilik operasi'}
                </span>
              </div>

              <button
                onClick={toggleAmbient}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold transition-all cursor-pointer ${
                  ambientActive && !soundMuted
                    ? 'bg-[#2b3e23] border-[#728f4d] text-[#e0efd3]'
                    : 'bg-[#182319] border-[#374935] text-[#788975]'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>{ambientActive && !soundMuted ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Ambient Volume slider */}
            {ambientActive && !soundMuted && (
              <div className="p-3 rounded-xl bg-[#121f15] border border-[#2e422d] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8da088]">{language === 'en' ? 'Ambient Volume' : 'Kekuatan Bunyi Atmosfera'}</span>
                  <span className="font-bold text-[#dfce88]">{Math.round(ambientVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#82bc67] cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Language Selection Section */}
          <div className="space-y-2 pt-2 border-t border-[#293d29]">
            <h4 className="text-xs font-mono text-[#dfce88] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Interface Language' : 'Bahasa Paparan'}</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  sound.playTap();
                  setLanguage('ms');
                }}
                className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                  language === 'ms'
                    ? 'bg-[#2f462f] border-[#7f9e61] text-[#f2f7ed] shadow-md'
                    : 'bg-[#121f15] border-[#2e422d] text-[#93a68f] hover:text-[#e4eee0]'
                }`}
              >
                Bahasa Melayu
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  setLanguage('en');
                }}
                className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#2f462f] border-[#7f9e61] text-[#f2f7ed] shadow-md'
                    : 'bg-[#121f15] border-[#2e422d] text-[#93a68f] hover:text-[#e4eee0]'
                }`}
              >
                English (US/UK)
              </button>
            </div>
          </div>

          {/* Laptop / Desktop Keyboard Shortcuts Reference */}
          <div className="space-y-2 pt-2 border-t border-[#293d29]">
            <h4 className="text-xs font-mono text-[#dfce88] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Desktop / Laptop Hotkeys' : 'Pintasan Papan Kekunci Laptop'}</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#cad6c5] bg-[#101b12] p-3 rounded-xl border border-[#293a27]">
              <div><b className="text-[#dfce88]">[1] - [8]</b> : Tukar Tab</div>
              <div><b className="text-[#dfce88]">[Space]</b> : Tamatkan Bulan</div>
              <div><b className="text-[#dfce88]">[R]</b> : Berehat di Kem</div>
              <div><b className="text-[#dfce88]">[Esc]</b> : Tutup Dialog</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#344833] bg-[#132116] flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-[#dfce88] hover:bg-[#ebd994] text-[#121c13] font-black text-xs cursor-pointer shadow"
          >
            {language === 'en' ? 'Close & Save' : 'Tutup & Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};
