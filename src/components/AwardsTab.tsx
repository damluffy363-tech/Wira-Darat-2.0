import React from 'react';
import { Award, Star, Medal, Calendar, Shield } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const AwardsTab: React.FC = () => {
  const { state, language } = useGame();

  if (!state) return null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88] mb-1">
            <Award className="w-4 h-4" />
            <span>PINGAT, BINTANG & GELARAN SIMULASI</span>
          </div>
          <h2 className="text-xl font-black text-[#f1f4eb]">Dewan Kehormatan & Anugerah Tentera</h2>
          <p className="text-xs text-[#95a890] mt-1 max-w-xl">
            Pengiktirafan fiksyen ini dianugerahkan berdasarkan integriti membuat keputusan berisiko, konsistensi kawad, kecergasan, dan ketahanan dalam unit operasi khas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#101b12] border border-[#2d3e2b] px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-[#7d9078] font-mono block">PINGAT</span>
            <span className="text-lg font-bold font-mono text-[#dfce88]">
              {state.medals.length}
            </span>
          </div>
          <div className="bg-[#101b12] border border-[#2d3e2b] px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-[#7d9078] font-mono block">GELARAN</span>
            <span className="text-lg font-bold font-mono text-[#82bc67]">
              {state.titles.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medals List */}
        <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#f1f5ec]">
            <Medal className="w-4 h-4 text-[#dfce88]" />
            <span>Pingat & Lencana Simulasi ({state.medals.length})</span>
          </div>

          {state.medals.length === 0 ? (
            <p className="text-xs text-[#879a83] py-6 text-center">
              Belum ada pingat yang dianugerahkan. Sertai misi, tunjukkan prestasi berdisiplin dan tamatkan latihan asas untuk mula mengumpul pingat.
            </p>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {state.medals.map((m, i) => {
                const isGovMedal =
                  m.name.includes('Perisikan Negara') ||
                  m.name.includes('Gagah Berani') ||
                  m.name.includes('Ops Daulat') ||
                  m.desc.includes('Kerajaan Malaysia');

                return (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl text-xs space-y-1.5 transition-all ${
                      isGovMedal
                        ? 'bg-gradient-to-br from-[#271816] via-[#1d1413] to-[#141b14] border-2 border-[#df8c7d] shadow-md'
                        : 'bg-[#121e15] border border-[#2e402d] hover:border-[#6f8957]'
                    }`}
                  >
                    {isGovMedal && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#4a1c17] text-[#ffd6cf] font-mono text-[9px] uppercase font-bold tracking-wider border border-[#78342c]">
                        <span>★ PINGAT KEHORMAT KERAJAAN MALAYSIA (PROFIL TINGGI)</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold text-sm flex items-center gap-1.5 ${
                          isGovMedal ? 'text-[#ffdcd6]' : 'text-[#f2f7ed]'
                        }`}
                      >
                        <span className={isGovMedal ? 'text-[#f59e0b]' : 'text-[#dfce88]'}>✦</span>
                        <span>{m.name}</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#8b9e87]">{m.date}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isGovMedal ? 'text-[#e2cbc8]' : 'text-[#a9bba5]'}`}>
                      {m.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Titles List */}
        <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#f1f5ec]">
            <Star className="w-4 h-4 text-[#dfce88]" />
            <span>Gelaran & Pengiktirafan Khas ({state.titles.length})</span>
          </div>

          {state.titles.length === 0 ? (
            <p className="text-xs text-[#879a83] py-6 text-center">
              Gelaran khas dianugerahkan apabila anda mencapai pencapaian tertentu seperti perkhidmatan berpanjangan atau lulus saringan unit elit.
            </p>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {state.titles.map((t, i) => (
                <div
                  key={i}
                  className="bg-[#121e15] border border-[#2e402d] p-3.5 rounded-xl text-xs space-y-1 hover:border-[#6f8957] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#f2f7ed] text-sm flex items-center gap-1.5">
                      <span className="text-[#82bc67]">★</span>
                      <span>{t.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#7d9078]">{t.date}</span>
                  </div>
                  <p className="text-xs text-[#a9bba5] leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
