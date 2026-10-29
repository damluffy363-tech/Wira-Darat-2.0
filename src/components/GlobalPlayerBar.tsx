import React from 'react';
import {
  Calendar,
  Zap,
  Heart,
  Activity,
  MapPin,
  Coins,
  Shield,
  Home as HomeIcon,
  FastForward,
  Award,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { dateFromOffset, housingById, campById, corpsById } from '../data/gameData';
import { sound } from '../audio/soundEngine';

export const GlobalPlayerBar: React.FC = () => {
  const {
    state,
    getRankName,
    advanceMonth,
    voluntaryRetire,
    setCurrentTab,
    language,
    showToast,
  } = useGame();

  if (!state) return null;

  const camp = campById(state.campId);
  const house = housingById(state.housingId);
  const corp = corpsById(state.isGGK ? 'ggk' : state.corps);
  const canRetire = state.months >= 252 || state.age >= 65;
  const isRecruitWithheld = state.path === 'llp' && state.rank === 0;

  const handleAdvance = () => {
    if (state.retired) {
      showToast('Perkhidmatan telah tamat.');
      return;
    }
    if (state.monthlyCorpsDue) {
      sound.playWarning();
      showToast('Selesaikan misi kor wajib bulan ini dahulu.');
      return;
    }
    advanceMonth();
  };

  const handleRetireClick = () => {
    sound.playTap();
    if (!canRetire) {
      sound.playWarning();
      showToast(
        language === 'en'
          ? `Retirement unlocks after 21 years of service (${252 - state.months} months remaining).`
          : `Persaraan dibuka selepas 21 tahun perkhidmatan (${252 - state.months} bulan lagi).`
      );
      return;
    }
    if (window.confirm(language === 'en' ? 'Confirm voluntary retirement after 21 years of service?' : 'Sahkan persaraan sukarela selepas 21 tahun perkhidmatan?')) {
      voluntaryRetire();
    }
  };

  return (
    <div className="bg-[#111e14]/95 backdrop-blur-md border border-[#485c43] rounded-xl p-2.5 sm:p-3 shadow-md mb-4 text-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Soldier Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:flex lg:flex-wrap items-center gap-2 flex-1">
          {/* Soldier & Rank */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1a281e] border border-[#3b4e39] rounded-lg">
            <Shield className="w-3.5 h-3.5 text-[#dfd08c] shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#93a68d] block font-mono uppercase">
                {language === 'en' ? 'Rank' : 'Pangkat'}
              </span>
              <span className="font-bold text-[#f0f4ea] truncate block">
                {getRankName()}
              </span>
            </div>
          </div>

          {/* Corps */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1a281e] border border-[#3b4e39] rounded-lg">
            <span className="text-[#dfd08c] font-black text-xs shrink-0">⚑</span>
            <div className="truncate">
              <span className="text-[10px] text-[#93a68d] block font-mono uppercase">
                {language === 'en' ? 'Corps' : 'Kor'}
              </span>
              <span className="font-bold text-[#e1dfb0] truncate block">
                {state.isGGK ? 'GGK Komando' : corp?.short || (state.corpsTarget ? `${state.corpsTarget.toUpperCase()} (Calon)` : 'Belum diserap')}
              </span>
            </div>
          </div>

          {/* Date & Service Months */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1a281e] border border-[#3b4e39] rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-[#a4c58f] shrink-0" />
            <div>
              <span className="text-[10px] text-[#93a68d] block font-mono uppercase">
                {dateFromOffset(state.months)}
              </span>
              <span className="font-mono text-[#cad8c5] font-bold">
                {state.months} {language === 'en' ? 'mo' : 'bln'} ({Math.floor(state.months / 12)}y)
              </span>
            </div>
          </div>

          {/* Action Points (AP) */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1a281e] border border-[#3b4e39] rounded-lg">
            <Zap className="w-3.5 h-3.5 text-[#e5c66b] shrink-0" />
            <div>
              <span className="text-[10px] text-[#93a68d] block font-mono uppercase">
                AP
              </span>
              <span className="font-mono font-bold text-[#f5ebd2] tabular-nums">
                {state.ap}/{state.apMax}
                {state.isGGK && <span className="text-[#8bc777] text-[10px] ml-1">(+2)</span>}
              </span>
            </div>
          </div>

          {/* Health HP */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1a281e] border border-[#3b4e39] rounded-lg">
            <Heart
              className={`w-3.5 h-3.5 shrink-0 ${
                state.health < 40 ? 'text-[#e58c7d]' : 'text-[#9fd287]'
              }`}
            />
            <div className="w-16 sm:w-20">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#93a68d]">HP</span>
                <span
                  className={`font-bold tabular-nums ${
                    state.health < 40 ? 'text-[#e58c7d]' : 'text-[#f0f4ea]'
                  }`}
                >
                  {state.health}%
                </span>
              </div>
              <div className="h-1.5 bg-[#0e1710] rounded-full overflow-hidden mt-0.5 border border-[#304031]">
                <div
                  className={`h-full rounded-full transition-all ${
                    state.health < 40 ? 'bg-[#d87c6c]' : 'bg-[#98cf7e]'
                  }`}
                  style={{ width: `${state.health}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stamina */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1a281e] border border-[#3b4e39] rounded-lg">
            <Activity className="w-3.5 h-3.5 text-[#a3c9e6] shrink-0" />
            <div className="w-16 sm:w-20">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#93a68d]">STAM</span>
                <span className="font-bold text-[#f0f4ea] tabular-nums">
                  {state.stamina}%
                </span>
              </div>
              <div className="h-1.5 bg-[#0e1710] rounded-full overflow-hidden mt-0.5 border border-[#304031]">
                <div
                  className="h-full bg-[#82b4dc] rounded-full transition-all"
                  style={{ width: `${state.stamina}%` }}
                />
              </div>
            </div>
          </div>

          {/* Money & Balance */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#1a281e] border border-[#3b4e39] rounded-lg">
            <Coins className="w-3.5 h-3.5 text-[#dfd08c] shrink-0" />
            <div>
              <span className="text-[10px] text-[#93a68d] block font-mono uppercase">
                {language === 'en' ? 'Funds' : 'Baki'}
              </span>
              <span className="font-mono font-bold text-[#e8dc9b] tabular-nums">
                RM {state.money.toLocaleString('en-MY')}
              </span>
            </div>
          </div>

          {/* Camp Location */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 bg-[#1a281e] border border-[#3b4e39] rounded-lg truncate max-w-[190px]">
            <MapPin className="w-3.5 h-3.5 text-[#9cb690] shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#93a68d] block font-mono uppercase">
                {language === 'en' ? 'Base' : 'Kem'}
              </span>
              <span className="text-[#d8e2d4] font-semibold truncate block" title={camp.name}>
                {camp.name}
              </span>
            </div>
          </div>

          {/* Housing */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 bg-[#1a281e] border border-[#3b4e39] rounded-lg truncate max-w-[160px]">
            <HomeIcon className="w-3.5 h-3.5 text-[#b3caa9] shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#93a68d] block font-mono uppercase">
                {language === 'en' ? 'Lodging' : 'Kediaman'}
              </span>
              <span className="text-[#d8e2d4] truncate block" title={house.name}>
                {house.name}
              </span>
            </div>
          </div>
        </div>

        {/* Global Turn Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#324531]">
          {/* Voluntary / Mandatory Retirement Button */}
          <button
            onClick={handleRetireClick}
            disabled={state.retired}
            className={`px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${
              state.retired
                ? 'bg-[#291b1a] text-[#8e6863] border border-[#533733] cursor-not-allowed'
                : canRetire
                ? 'bg-[#5c2d27] hover:bg-[#72372f] text-[#fbebe8] border border-[#a85f54] shadow-md'
                : 'bg-[#221817] text-[#9e7670] border border-[#48302d] opacity-70'
            }`}
            title={
              canRetire
                ? 'Persaraan layak'
                : `Dibuka selepas 21 tahun perkhidmatan (${252 - state.months} bulan lagi)`
            }
          >
            <Award className="w-3.5 h-3.5" />
            <span>{state.retired ? 'Telah Bersara' : 'Bersara'}</span>
          </button>

          {/* Advance Month Button */}
          <button
            onClick={handleAdvance}
            disabled={state.retired}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-black tracking-wide flex items-center justify-center gap-2 text-xs transition-all cursor-pointer ${
              state.retired
                ? 'bg-[#202d22] text-[#697d6a] border border-[#354836] cursor-not-allowed'
                : state.monthlyCorpsDue
                ? 'bg-[#3b321c] text-[#dfcd8d] border border-[#83703f] animate-pulse hover:bg-[#483d23]'
                : 'bg-gradient-to-r from-[#395337] to-[#2b412a] hover:from-[#456342] hover:to-[#354f34] text-[#f2f7ed] border border-[#6b8964] shadow-md active:scale-95'
            }`}
            title="Selesaikan aktiviti bulan semasa dan gerakkan masa ke bulan berikutnya"
          >
            <FastForward className="w-3.5 h-3.5 text-[#dfd08c]" />
            <span className="whitespace-nowrap">
              {language === 'en' ? 'End Month' : 'Tamatkan Bulan'}
            </span>
          </button>
        </div>
      </div>

      {/* Notice Banner if recruit salary withheld or corps mission pending */}
      {isRecruitWithheld && (
        <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-[#2b2518] border border-[#6f5e36] text-[#e3d7a8] text-[11px] flex items-center justify-between gap-2">
          <span>
            ℹ <b>Gaji Rekrut Ditahan:</b> RM {state.heldSalary.toLocaleString('en-MY')} terkumpul. Akan dikreditkan secara automatik apabila anda dinaikkan ke Prebet pada bulan ke-6.
          </span>
          <span className="text-[#aebaa0] shrink-0">
            {6 - state.months} bulan latihan berbaki
          </span>
        </div>
      )}

      {state.monthlyCorpsDue && (
        <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-[#3a2c1b] border border-[#916e3c] text-[#f1ddb0] text-[11px] flex items-center justify-between gap-2 animate-pulse">
          <span>
            ⚠️ <b>Arahan Menunggu:</b> Selesaikan Misi Kor Wajib bulanan pada tab Cerita & Misi sebelum masa boleh bergerak ke bulan seterusnya.
          </span>
        </div>
      )}

      {state.activeGovernmentMission && (
        <div
          onClick={() => {
            sound.playRadioChirp();
            setCurrentTab('story');
          }}
          className="mt-2 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#3b1c18] via-[#2f1714] to-[#251310] border border-[#df7665] text-[#ffded8] text-[11px] flex items-center justify-between gap-2 cursor-pointer hover:border-[#fca595] transition-all shadow"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[#e5c66b] font-bold">🎖️ TAWARAN OPERASI KHAS KERAJAAN:</span>
            <span className="truncate">{state.activeGovernmentMission.title}</span>
          </div>
          <span className="text-[#fce3df] font-mono font-bold shrink-0 underline text-[10px]">
            Buka Taklimat Misi →
          </span>
        </div>
      )}
    </div>
  );
};
