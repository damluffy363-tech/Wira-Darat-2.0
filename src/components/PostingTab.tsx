import React, { useState } from 'react';
import {
  MapPin,
  Home,
  Navigation,
  Compass,
  Search,
  Building,
  CheckCircle2,
  Clock,
  Coins,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import {
  availableCorpsForCamp,
  campById,
  campData,
  corpsById,
  housingById,
  housingCatalog,
  transferCost,
} from '../data/gameData';
import { HousingId } from '../types/game';
import { sound } from '../audio/soundEngine';

export const PostingTab: React.FC = () => {
  const { state, requestTransfer, changeHousing, language, showToast } = useGame();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTargetCamp, setSelectedTargetCamp] = useState<string>('');

  if (!state) return null;

  const currentCamp = campById(state.campId);
  const currentHouse = housingById(state.housingId);
  const canRentOutside = state.rank >= 3; // Corporal rank unlock
  const canTransfer = state.months >= 36 && !state.pendingTransfer && !state.retired;

  const targetCampId = selectedTargetCamp || campData.find((c) => c.id !== state.campId)?.id || '';
  const calculatedTransferCost = targetCampId ? transferCost(state.campId, targetCampId) : 3000;

  const handleTransferRequest = () => {
    if (!targetCampId) return;
    if (state.months < 36) {
      sound.playWarning();
      showToast('Perpindahan kem hanya dibuka selepas 3 tahun perkhidmatan (36 bulan).');
      return;
    }
    if (state.money < calculatedTransferCost) {
      sound.playWarning();
      showToast(`Baki wang tidak mencukupi untuk kos perpindahan (RM ${calculatedTransferCost.toLocaleString('en-MY')}).`);
      return;
    }
    requestTransfer(targetCampId);
  };

  const filteredCamps = campData.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Current Base & Posting Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88] mb-2">
            <MapPin className="w-4 h-4" />
            <span>PENEMPATAN KEM SEMASA</span>
          </div>

          <h2 className="text-2xl font-black text-[#f1f4eb] mb-1">{currentCamp.name}</h2>
          <div className="text-xs text-[#a4b89e] mb-4">
            {currentCamp.city}, {currentCamp.state} · GPS: <span className="font-mono text-[#cad8c5]">{currentCamp.lat}°N, {currentCamp.lon}°E</span>
          </div>

          <p className="text-xs text-[#cad5c3] leading-relaxed mb-4">
            Peranan rasmi: <b>{currentCamp.role}</b>
          </p>

          <div className="bg-[#101b12] border border-[#2b3d2a] p-3.5 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#869982]">Unit GGK di Pangkalan:</span>
              <b className={currentCamp.hasGGK ? 'text-[#84c473]' : 'text-[#a2b59d]'}>
                {currentCamp.hasGGK ? 'Ada Pangkalan GGK' : 'Tiada Pangkalan GGK'}
              </b>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-[#869982] shrink-0">Kor yang Tersedia:</span>
              <div className="text-right text-[#dfce88] font-mono text-[11px] flex flex-wrap justify-end gap-1">
                {availableCorpsForCamp(currentCamp).map((id) => (
                  <span key={id} className="px-1.5 py-0.5 rounded bg-[#1c2a1e] border border-[#3b4e39]">
                    {corpsById(id)?.short}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Application Box */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88] mb-2">
              <Navigation className="w-4 h-4" />
              <span>PERMOHONAN PERPINDAHAN KEM</span>
            </div>

            <h3 className="text-lg font-bold text-[#f1f5ec] mb-1">
              Pertukaran Stesen Penempatan
            </h3>
            <p className="text-xs text-[#9eb09a] leading-relaxed mb-4">
              Perpindahan hanya boleh dipohon selepas 3 tahun perkhidmatan (36 bulan). Kos perpindahan dikira berdasarkan formula jarak geografi sebenar antara kem (RM 3,000–RM 25,000).
            </p>

            {state.pendingTransfer ? (
              <div className="p-4 rounded-xl bg-[#292215] border border-[#715c32] text-xs text-[#e1d3ae] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#f1edd3]">
                  <Clock className="w-4 h-4 text-[#dfce88]" />
                  <span>Permohonan Dalam Penilaian Pegawai Atasan</span>
                </div>
                <p>
                  Destinasi: <b>{campById(state.pendingTransfer.targetId).name}</b>. Baki pemprosesan: <b>{state.pendingTransfer.monthsLeft} bulan</b>.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#cbd6c5] font-bold mb-1">Pilih Kem Destinasi:</label>
                  <select
                    value={targetCampId}
                    onChange={(e) => setSelectedTargetCamp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1610] border border-[#3b4e38] text-[#edf4e8] focus:outline-none"
                  >
                    {campData
                      .filter((c) => c.id !== state.campId && (!state.isGGK || c.hasGGK))
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.city}, {c.state} {c.hasGGK ? '· GGK' : ''}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs font-mono bg-[#101b12] p-3 rounded-lg border border-[#2c3d2a]">
                  <span className="text-[#849a80]">Anggaran Kos Perpindahan:</span>
                  <span className="font-bold text-[#dfce88] text-sm">
                    RM {calculatedTransferCost.toLocaleString('en-MY')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {!state.pendingTransfer && (
            <button
              onClick={handleTransferRequest}
              disabled={!canTransfer}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                canTransfer
                  ? 'bg-[#3b5539] hover:bg-[#486745] text-[#f2f7ed] border-[#6b8964] shadow-md active:scale-95'
                  : 'bg-[#1b251c] text-[#637562] border-[#314230] cursor-not-allowed'
              }`}
            >
              <span>Hantar Permohonan Rasmi</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#dfce88]" />
            </button>
          )}
        </div>
      </div>

      {/* Housing & Rental System */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88]">
            <Home className="w-4 h-4" />
            <span>PENGURUSAN TEMPAT TINGGAL & SEWA</span>
          </div>

          <span className="text-xs font-mono text-[#a4b89f] bg-[#101b12] px-2.5 py-1 rounded-lg border border-[#2d3e2b]">
            Kediaman Semasa: <b>{currentHouse.name}</b> (RM {currentHouse.rent}/bln)
          </span>
        </div>

        <p className="text-xs text-[#95a890] mb-5">
          Tinggal di kem adalah percuma. Menyewa kediaman di luar kem memerlukan sekurang-kurangnya pangkat Koperal dan dikenakan sewa bulanan automatik, tetapi memberikan bonus kecergasan dan pemulihan stamina yang lebih pantas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {housingCatalog.map((h) => {
            const isSelected = state.housingId === h.id;
            const isLocked = h.id !== 'barracks' && !canRentOutside;

            return (
              <div
                key={h.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                  isSelected
                    ? 'bg-[#253926] border-[#819d67] shadow-md text-[#f0f6ec]'
                    : isLocked
                    ? 'bg-[#111c13] border-[#293928] opacity-70 text-[#71846f]'
                    : 'bg-[#142217] border-[#384e36] hover:border-[#6f8957] text-[#c9d8c4]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-[#dfce88]">
                      {h.rent === 0 ? 'Percuma (RM 0)' : `RM ${h.rent}/bln`}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-[#3a5238] text-[#e0efd9] px-1.5 py-0.5 rounded font-bold">
                        PILIHAN AKTIF
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-[#f1f5ec] mb-1">{h.name}</h4>
                  <p className="text-xs text-[#a2b59d] mb-2 leading-relaxed">{h.desc}</p>

                  <div className="text-[11px] font-mono text-[#82bc67] bg-[#101b12] p-2 rounded-lg border border-[#283827]">
                    Bonus: {h.bonus}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2a3c28]">
                  {isSelected ? (
                    <div className="py-2 text-center text-xs font-bold text-[#84c473] flex items-center justify-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sedang Didiami</span>
                    </div>
                  ) : isLocked ? (
                    <div className="py-2 text-center text-[11px] font-mono text-[#b3756c] bg-[#271b19] border border-[#56332e] rounded-lg">
                      Perlu Pangkat Koperal
                    </div>
                  ) : (
                    <button
                      onClick={() => changeHousing(h.id)}
                      className="w-full py-2 px-3 rounded-lg bg-[#304832] hover:bg-[#3d5c3f] text-[#f2f7ed] font-bold text-xs border border-[#587954] cursor-pointer active:scale-95"
                    >
                      Pilih Tempat Tinggal Ini
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 44 Camps Directory with Search */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#eff4ea]">Direktori Kem Tentera Darat</h3>
            <p className="text-xs text-[#95a890]">
              Senarai pangkalan, markas formasi dan depoh latihan di seluruh Malaysia.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#7d9279]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari kem / bandar / negeri..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#101b12] border border-[#324530] text-xs text-[#edf4e8] focus:border-[#7c995f] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
          {filteredCamps.map((c) => {
            const isCurrent = c.id === state.campId;
            return (
              <div
                key={c.id}
                className={`p-3 rounded-xl border text-xs flex flex-col justify-between gap-2 ${
                  isCurrent
                    ? 'bg-[#223523] border-[#728f58] text-[#f2f8ee]'
                    : 'bg-[#121d15] border-[#2d3e2b] text-[#cad8c5]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-sm text-[#f1f5ec] truncate">{c.name}</span>
                    {isCurrent && (
                      <span className="text-[9px] bg-[#3a5337] text-[#e0efd9] px-1.5 py-0.5 rounded font-mono shrink-0">
                        SEMASA
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8ea28a] block">
                    {c.city}, {c.state} {c.hasGGK && '· GGK'}
                  </span>
                  <p className="text-[11px] text-[#a9bca5] mt-1 line-clamp-2">{c.role}</p>
                </div>

                <div className="text-[10px] font-mono text-[#dfce88] pt-2 border-t border-[#273826] flex items-center justify-between">
                  <span>GPS: {c.lat}°, {c.lon}°</span>
                  <span>{availableCorpsForCamp(c).length} Kor Tersedia</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
