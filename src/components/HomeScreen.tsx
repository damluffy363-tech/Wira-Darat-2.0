import React, { useState } from 'react';
import {
  UserPlus,
  Play,
  Trash2,
  BookOpen,
  Settings,
  Shield,
  Calendar,
  Coins,
  Award,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { corpsCatalog, dateFromOffset } from '../data/gameData';
import { CareerPath } from '../types/game';
import { sound } from '../audio/soundEngine';

export const HomeScreen: React.FC = () => {
  const {
    store,
    selectSlot,
    deleteSlot,
    startNewGame,
    setTutorialOpen,
    setSettingsOpen,
    language,
    showToast,
  } = useGame();

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('Rekrut Adam');
  const [newPath, setNewPath] = useState<CareerPath>('llp');
  const [newCorps, setNewCorps] = useState<string>('ramd');
  const [newAge, setNewAge] = useState<string>('random');

  const slots = store.slots || [];
  const isFull = slots.length >= 5;

  const handleStartNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFull) {
      showToast('Semua 5 slot watak telah penuh. Sila padam watak lama jika ingin mencipta watak baharu.');
      return;
    }
    sound.playMarch();
    startNewGame(newName, newPath, newCorps, newAge);
    setShowCreateModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    sound.playWarning();
    const promptText =
      language === 'en'
        ? `Permanently delete soldier record "${name}"? This cannot be undone.`
        : `Padamkan rekod watak "${name}" secara kekal? Tindakan ini tidak boleh diundur.`;
    if (window.confirm(promptText)) {
      deleteSlot(id);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-3 sm:px-6 py-6 pb-20">
      {/* Tactical Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-[#4a5f45] bg-gradient-to-br from-[#1b2f21] via-[#142318] to-[#1e3223] p-6 sm:p-10 shadow-xl mb-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          <svg viewBox="0 0 200 200" className="w-full h-full text-[#c5cf96]" fill="currentColor">
            <path d="M100 20 L180 50 L180 120 C180 160 140 185 100 195 C60 185 20 160 20 120 L20 50 Z" opacity="0.3" />
            <polygon points="100,50 115,85 155,85 125,110 135,150 100,125 65,150 75,110 45,85 85,85" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#253926] border border-[#526a4c] text-[#dfd08c] text-xs font-mono tracking-widest uppercase font-bold mb-3">
            <span>MARKAS OPERASI TENTERA DARAT</span>
            <span>·</span>
            <span>SIMULASI 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#f1f3e8] tracking-tight leading-tight mb-3">
            WIRA DARAT
          </h1>
          <p className="text-sm sm:text-base text-[#cad6c5] leading-relaxed mb-6">
            Bermula dari latihan asas Rekrut pada Oktober 2026. Pilih laluan kerjaya, hadapi ujian kelayakan Kor dan Rejimen Gerak Khas (GGK), urus kewangan serta kecergasan, dan cipta rekod perkhidmatan gemilang.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => {
                sound.playTap();
                if (isFull) {
                  showToast('5 slot watak telah penuh.');
                } else {
                  setShowCreateModal(true);
                }
              }}
              disabled={isFull}
              className={`px-5 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                isFull
                  ? 'bg-[#253326] text-[#6d7e6c] border border-[#3e4f3f] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#dfce88] to-[#bfad67] text-[#121c13] hover:from-[#ebd994] hover:to-[#cebd74] border border-[#f2e5a5]'
              }`}
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Watak Baharu ({slots.length}/5)</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setTutorialOpen(true);
              }}
              className="px-4 py-3 rounded-xl bg-[#1b2b1d] hover:bg-[#253927] border border-[#495e43] text-[#dce7d6] font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#dfce88]" />
              <span>Panduan Lapangan</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setSettingsOpen(true);
              }}
              className="p-3 rounded-xl bg-[#172419] hover:bg-[#203222] border border-[#394d34] text-[#b6c6b2] transition-all cursor-pointer"
              title="Tetapan Audio & Bahasa"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Saved Character Slots Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#eff3e8]">Fail Rekod Anggota Tersimpan</h2>
            <p className="text-xs text-[#98aa93]">
              Kemajuan setiap watak disimpan automatik dalam slot pelayar ini.
            </p>
          </div>
          <span className="text-xs font-mono text-[#cad8c5] px-2.5 py-1 bg-[#1a291e] border border-[#3c5039] rounded-lg">
            {slots.length} / 5 Slot
          </span>
        </div>

        {slots.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#44583f] bg-[#121c14] text-[#a9b9a4]">
            <Shield className="w-10 h-10 mx-auto text-[#627a5b] mb-2" />
            <h3 className="font-bold text-[#e1ecd9] text-base mb-1">Tiada Watak Tersimpan</h3>
            <p className="text-xs max-w-md mx-auto mb-4">
              Cipta watak pertama anda untuk memulakan perkhidmatan latihan tentera darat pada Oktober 2026.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#dfce88] hover:bg-[#ebd994] text-[#121c13] rounded-lg font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Cipta Watak Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot, index) => {
              const s = slot.state;
              const rankList = s.path === 'llp' ? ['Rekrut', 'Prebet', 'Lans Koperal', 'Koperal', 'Sarjan', 'Staf Sarjan', 'PW II', 'PW I'] : ['Kadet', 'Lt Muda', 'Lt', 'Kapt', 'Mej', 'Lt Kol', 'Kol', 'Brig Jen', 'Mej Jen', 'Lt Jen', 'Jen'];
              const currentRank = rankList[Math.min(s.rank, rankList.length - 1)];

              return (
                <div
                  key={slot.id}
                  className="bg-gradient-to-br from-[#18271c] to-[#121e15] border border-[#3e523b] rounded-xl p-4 shadow-md hover:border-[#7d925e] transition-all flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8da088] mb-2">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-[#233526] border border-[#445b41] text-[#e0d393]">
                        SLOT {index + 1}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          s.retired
                            ? 'bg-[#3c2522] border border-[#7e433d] text-[#e58c7d]'
                            : 'bg-[#243725] border border-[#526e4d] text-[#a4d48c]'
                        }`}
                      >
                        {s.retired ? 'Bersara' : 'Aktif'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#f2f6ee] truncate mb-1">
                      {s.name}
                    </h3>

                    <div className="text-xs text-[#cad5c3] flex items-center gap-2 mb-3">
                      <span className="font-semibold text-[#e5d898]">
                        {s.isGGK ? `${currentRank} (GGK)` : currentRank}
                      </span>
                      <span>·</span>
                      <span className="text-[#96a992]">
                        {s.path === 'llp' ? 'Lain-Lain Pangkat' : 'Pegawai Kadet'}
                      </span>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono text-[#cad8c5] mb-2">
                      <div className="bg-[#101a12] border border-[#2d3e2b] rounded p-1.5 text-center">
                        <span className="text-[9px] text-[#7d9078] block">TEMPOH</span>
                        <span className="font-bold">{s.months} bln</span>
                      </div>
                      <div className="bg-[#101a12] border border-[#2d3e2b] rounded p-1.5 text-center">
                        <span className="text-[9px] text-[#7d9078] block">XP</span>
                        <span className="font-bold text-[#dfce88]">{s.xp}</span>
                      </div>
                      <div className="bg-[#101a12] border border-[#2d3e2b] rounded p-1.5 text-center">
                        <span className="text-[9px] text-[#7d9078] block">BAKI</span>
                        <span className="font-bold text-[#82bc67]">RM {s.money}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#8ea08a] flex items-center justify-between border-t border-[#2e402b] pt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#7d9078]" />
                        {dateFromOffset(s.months)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#dfce88]" />
                        {s.medals?.length || 0} Pingat
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#2d3e2b]">
                    <button
                      onClick={() => selectSlot(slot.id)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#304730] hover:bg-[#3c593c] text-[#f2f7ed] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#587352] cursor-pointer active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-[#dfce88]" />
                      <span>Pilih Watak</span>
                    </button>

                    <button
                      onClick={() => handleDelete(slot.id, s.name)}
                      className="p-2 rounded-lg bg-[#2b1b1a] hover:bg-[#3e2321] text-[#d67b71] border border-[#5e3834] cursor-pointer"
                      title="Padamkan watak ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17271c] border border-[#4d6346] rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-black text-[#f1f4ea] mb-2 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#dfce88]" />
              <span>Daftar Watak Tentera Baharu</span>
            </h3>
            <p className="text-xs text-[#a7b9a2] mb-5">
              Simulasi bermula pada Oktober 2026. Pilih tetapan watak untuk memulakan kerjaya anda.
            </p>

            <form onSubmit={handleStartNew} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#cfdbc9] font-bold mb-1">
                  Nama Anggota:
                </label>
                <input
                  type="text"
                  required
                  maxLength={28}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Adam / Farhan"
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0e1710] border border-[#3b4e38] text-[#edf4e8] focus:border-[#86a06e] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfdbc9] font-bold mb-1">
                    Laluan Kerjaya:
                  </label>
                  <select
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value as CareerPath)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0e1710] border border-[#3b4e38] text-[#edf4e8] focus:border-[#86a06e] focus:outline-none"
                  >
                    <option value="llp">Lain-Lain Pangkat (LLP)</option>
                    <option value="pegawai">Laluan Pegawai (Kadet)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#cfdbc9] font-bold mb-1">
                    Umur Permulaan:
                  </label>
                  <select
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0e1710] border border-[#3b4e38] text-[#edf4e8] focus:border-[#86a06e] focus:outline-none"
                  >
                    <option value="random">Rawak (18–30 tahun)</option>
                    {Array.from({ length: 13 }, (_, i) => 18 + i).map((a) => (
                      <option key={a} value={a}>
                        {a} tahun
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#cfdbc9] font-bold mb-1">
                  Kor Pilihan Awal:
                </label>
                <select
                  value={newCorps}
                  onChange={(e) => setNewCorps(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0e1710] border border-[#3b4e38] text-[#edf4e8] focus:border-[#86a06e] focus:outline-none"
                >
                  {corpsCatalog
                    .filter((c) => c.id !== 'ggk')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-[#8fa189] mt-1">
                  Penempatan awal akan dipilih daripada kem yang menyokong kor pilihan anda. Ujian kelayakan kor perlu dilalui dalam permainan.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#31422d]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#223124] hover:bg-[#2b3d2d] text-[#c7d5c3] font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#dfce88] hover:bg-[#ebd994] text-[#121c13] font-black cursor-pointer shadow-md"
                >
                  Mulakan Latihan Asas →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
