import React from 'react';
import {
  Flag,
  Shield,
  Award,
  Zap,
  Heart,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Footprints,
  Compass,
  Clock,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { availableCorpsForCamp, campById, corpsById, dateFromOffset } from '../data/gameData';
import { sound } from '../audio/soundEngine';

export const CorpsTab: React.FC = () => {
  const {
    state,
    setCorpsChoice,
    startCorpsTest,
    startCorpsEntryCourse,
    applyGGK,
    runGGKMarch,
    startCorpsMission,
    language,
    showToast,
  } = useGame();

  if (!state) return null;

  const currentCamp = campById(state.campId);
  const currentCorps = corpsById(state.isGGK ? 'ggk' : state.corps);
  const targetCorps = corpsById(state.corpsTarget);
  const availableCorpsList = availableCorpsForCamp(currentCamp);

  // GGK Requirements
  const meetsGGKTime = state.months >= 36;
  const meetsGGKStats =
    state.health >= 65 && state.stamina >= 75 && state.discipline >= 70 && state.perf >= 65;
  const canApplyGGK =
    !state.isGGK &&
    meetsGGKTime &&
    meetsGGKStats &&
    !state.ggkApplication &&
    state.ggkStage !== 'march1' &&
    state.ggkStage !== 'march2' &&
    state.ggkStage !== 'course' &&
    !state.activeCourse &&
    !state.corpsEntry &&
    state.ap >= 3 &&
    state.money >= 4500 &&
    !state.retired;

  const canRunMarch =
    (state.ggkStage === 'march1' || state.ggkStage === 'march2') &&
    state.ap >= 3 &&
    state.stamina >= 70 &&
    state.health >= 60 &&
    !state.retired;

  return (
    <div className="space-y-6">
      {/* Official Corps Section */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88]">
            <Flag className="w-4 h-4" />
            <span>KOR PERKHIDMATAN TENTERA DARAT</span>
          </div>

          <span className="text-xs font-mono text-[#8fa28b] bg-[#101b12] px-2.5 py-1 rounded-lg border border-[#2e402d]">
            Penempatan: {currentCamp.name}
          </span>
        </div>

        {state.isGGK ? (
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#293d25] to-[#1e2f1f] border-2 border-[#819d67] flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-black text-[#e8f3e3]">
                <Flame className="w-4 h-4 text-[#dfce88]" />
                <span>KOR UNIT GERAKAN KHAS (GGK)</span>
              </div>
              <p className="text-xs text-[#cad7c4]">
                Anda telah ditauliahkan Beret Hijau Komando Gerak Khas. Bertugas di bawah panji pasukan elit operasi khas darat.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-[#dfce88] pt-1">
                <span>Elaun Khas: <b>RM 1,200/bln</b></span>
                <span>Bonus AP: <b>+2 AP setiap bulan</b></span>
              </div>
            </div>
            <span className="px-3 py-1 rounded bg-[#101c13] text-[#a4d48c] border border-[#486b47] font-bold text-xs">
              Komando Beret Hijau
            </span>
          </div>
        ) : state.corps ? (
          <div className="p-4 rounded-xl bg-[#142317] border border-[#445d41] flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <span className="text-sm font-bold text-[#eef4ea] block">
                {currentCorps?.name} ({currentCorps?.short})
              </span>
              <p className="text-xs text-[#a9bba4] max-w-xl">{currentCorps?.desc}</p>
              <div className="flex items-center gap-4 text-xs font-mono text-[#cad8c5] pt-1">
                <span>Kategori: <b>{currentCorps?.category}</b></span>
                <span>Elaun Risiko: <b className="text-[#82bc67]">RM {currentCorps?.allowance}/bln</b></span>
                <span>Yuran Kor: <b>RM {currentCorps?.fee}/bln</b></span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                startCorpsMission();
              }}
              className="px-4 py-2 rounded-xl bg-[#304832] hover:bg-[#3d5c3f] text-[#f2f7ed] font-bold text-xs flex items-center gap-2 border border-[#587954] cursor-pointer"
            >
              <span>{state.monthlyCorpsDue ? 'Jalani Misi Kor Wajib' : 'Lihat Rekod Kor'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#dfce88]" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#292215] border border-[#6b5832] text-xs text-[#dfd0a9]">
              <b>Status Calon:</b> Anda belum diserap ke mana-mana kor secara rasmi. Anda mesti lulus ujian saringan kemasukan kor (1 AP) dan menamatkan kursus kemasukan kor terlebih dahulu.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Corps selection */}
              <div className="bg-[#121c14] border border-[#2b3c2a] p-4 rounded-xl space-y-3 text-xs">
                <label className="block text-[#cfdac9] font-bold">
                  Pilih Kor Tersedia di {currentCamp.name}:
                </label>
                <select
                  value={state.corpsTarget || ''}
                  onChange={(e) => setCorpsChoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e1610] border border-[#3b4e38] text-[#edf4e8] focus:outline-none"
                >
                  {availableCorpsList.map((id) => (
                    <option key={id} value={id}>
                      {corpsById(id)?.name} ({corpsById(id)?.category})
                    </option>
                  ))}
                </select>

                <p className="text-[11px] text-[#8fa28b] leading-relaxed">
                  {targetCorps?.desc}
                </p>

                <div className="text-[11px] font-mono text-[#cad8c5] pt-1">
                  Yuran Kemasukan: <b>RM {targetCorps?.entryFee}</b> · Tempoh: <b>{targetCorps?.duration} bulan</b>
                </div>
              </div>

              {/* Action Stage */}
              <div className="bg-[#121c14] border border-[#2b3c2a] p-4 rounded-xl flex flex-col justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#7d9078] font-mono uppercase block mb-1">
                    Tahap Kelayakan Semasa
                  </span>
                  <div className="font-bold text-sm text-[#f1f5ec] mb-1">
                    {state.corpsEntry
                      ? `Sedang Menjalani Kursus Kemasukan (${state.corpsEntry.monthsLeft} bln lagi)`
                      : state.corpsStage === 'course-ready'
                      ? 'Ujian Lulus · Menunggu Pendaftaran Kursus'
                      : 'Menunggu Ujian Saringan Awal'}
                  </div>
                  <p className="text-[11px] text-[#a1b39c]">
                    {state.corpsStage === 'course-ready'
                      ? 'Anda telah lulus ujian awal. Daftar kursus kemasukan kor untuk memulakan penyerapan rasmi.'
                      : 'Duduki ujian kemasukan untuk menguji kesesuaian fizikal dan mental anda dalam kor ini.'}
                  </p>
                </div>

                <div>
                  {state.corpsEntry ? (
                    <div className="text-center py-2 text-[#82bc67] font-bold font-mono">
                      Kursus Dalam Proses ({state.corpsEntry.monthsLeft} bln lagi)
                    </div>
                  ) : state.corpsStage === 'course-ready' ? (
                    <button
                      onClick={startCorpsEntryCourse}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#304832] hover:bg-[#3d5c3f] text-[#f2f7ed] font-bold text-xs flex items-center justify-center gap-2 border border-[#587954] cursor-pointer active:scale-95 shadow"
                    >
                      <span>Daftar Kursus Kemasukan (RM {targetCorps?.entryFee})</span>
                    </button>
                  ) : (
                    <button
                      onClick={startCorpsTest}
                      disabled={state.ap < 1 || state.health < 40 || state.stamina < 45}
                      className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        state.ap < 1 || state.health < 40 || state.stamina < 45
                          ? 'bg-[#1b251c] text-[#637562] border-[#314230] cursor-not-allowed'
                          : 'bg-[#3b5539] hover:bg-[#486745] text-[#f2f7ed] border-[#6b8964] active:scale-95 shadow'
                      }`}
                    >
                      <span>Duduki Ujian Saringan (1 AP)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GGK Special Warfare Command Section */}
      <div className="bg-gradient-to-br from-[#1d271e] to-[#141d15] border-2 border-[#546d4a] rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88]">
            <Flame className="w-4 h-4 text-[#e58c7d]" />
            <span>LALUAN PEMILIHAN REJIMEN GERAK KHAS (GGK)</span>
          </div>

          <span className="text-xs font-mono text-[#cad8c5] bg-[#142016] px-2.5 py-1 rounded-lg border border-[#3b503a]">
            {state.isGGK ? 'Status: ANGGOTA KOMANDO' : 'Kelayakan Minimum: 3 Tahun'}
          </span>
        </div>

        <p className="text-xs text-[#cad5c3] leading-relaxed">
          Laluan pasukan elit Rejimen Gerak Khas (GGK) memerlukan dedikasi dan ketahanan ekstrem. Permohonan hanya dibuka selepas 3 tahun perkhidmatan (36 bulan), melalui saringan kelulusan pangkalan, 2 siri Ujian Perjalanan 80 km (160 km total), dan Kursus Asas Komando 6 bulan di PULPAK Kem Sungai Udang.
        </p>

        {/* GGK Progress Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div
            className={`p-3 rounded-xl border ${
              state.isGGK || ['march1', 'march2', 'course'].includes(state.ggkStage)
                ? 'bg-[#223523] border-[#557751] text-[#e3edd9]'
                : meetsGGKTime
                ? 'bg-[#18271c] border-[#394f37] text-[#cad8c4]'
                : 'bg-[#121c14] border-[#273826] text-[#6d806a]'
            }`}
          >
            <span className="text-[10px] font-mono block text-[#7d9078] mb-0.5">FASA 1</span>
            <div className="font-bold mb-1">Syarat 3 Tahun (36 Bln)</div>
            <span className="text-[11px] font-mono text-[#dfce88]">
              {state.months >= 36 ? '✓ Dipenuhi' : `${state.months}/36 Bulan`}
            </span>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              state.isGGK || state.ggkStage === 'course'
                ? 'bg-[#223523] border-[#557751] text-[#e3edd9]'
                : state.ggkStage === 'march2'
                ? 'bg-[#2e3b21] border-[#728549] text-[#e3edd9]'
                : 'bg-[#121c14] border-[#273826] text-[#6d806a]'
            }`}
          >
            <span className="text-[10px] font-mono block text-[#7d9078] mb-0.5">FASA 2</span>
            <div className="font-bold mb-1">Ujian 160 km (2x 80 km)</div>
            <span className="text-[11px] font-mono text-[#dfce88]">
              {state.ggkMarchDistance}/160 km
            </span>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              state.isGGK
                ? 'bg-[#223523] border-[#557751] text-[#e3edd9]'
                : state.ggkStage === 'course'
                ? 'bg-[#2e3b21] border-[#728549] text-[#e3edd9]'
                : 'bg-[#121c14] border-[#273826] text-[#6d806a]'
            }`}
          >
            <span className="text-[10px] font-mono block text-[#7d9078] mb-0.5">FASA 3</span>
            <div className="font-bold mb-1">Kursus Asas Komando</div>
            <span className="text-[11px] font-mono text-[#dfce88]">
              {state.isGGK ? '✓ Lulus 6 Bulan' : state.ggkStage === 'course' ? `${6 - state.ggkCourseLeft}/6 Bulan` : '6 Bulan'}
            </span>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              state.isGGK
                ? 'bg-[#2a4027] border-[#81a66d] text-[#eef6ea]'
                : 'bg-[#121c14] border-[#273826] text-[#6d806a]'
            }`}
          >
            <span className="text-[10px] font-mono block text-[#7d9078] mb-0.5">FASA 4</span>
            <div className="font-bold mb-1">Beret Hijau GGK</div>
            <span className="text-[11px] font-mono text-[#82bc67]">
              {state.isGGK ? '✓ Ditauliahkan' : 'Belum Layak'}
            </span>
          </div>
        </div>

        {/* GGK Interactive Action Area */}
        <div className="pt-2">
          {state.isGGK ? (
            <div className="p-4 rounded-xl bg-[#152317] border border-[#3b5338] flex items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-[#f1f5ec] block text-sm">
                  Pingat Jasa Malaysia (PJM) Simulasi
                </span>
                <span className="text-[#a4b89f] block">
                  Perkhidmatan aktif dalam GGK: {state.ggkServiceMonths}/36 bulan. Dianugerahkan pingat khas selepas 3 tahun berkhidmat.
                </span>
              </div>
              <div className="text-right font-mono text-sm font-bold text-[#dfce88]">
                {state.ggkPJMAwarded ? '✓ Dianugerahkan' : `${state.ggkServiceMonths}/36 bln`}
              </div>
            </div>
          ) : state.ggkStage === 'course' ? (
            <div className="p-4 rounded-xl bg-[#2b2718] border border-[#6f5e36] text-xs space-y-2">
              <div className="font-bold text-sm text-[#f1edd2] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#dfce88]" />
                <span>Kursus Asas Komando Sedang Berjalan ({state.ggkCourseLeft} bulan lagi)</span>
              </div>
              <p className="text-[#d8ceb0]">
                Setiap bulan menguji daya ketahanan fizikal dan mental dengan risiko penyingkiran jika kesihatan merosot teruk. Yuran RM {state.ggkMonthlyFee}/bulan.
              </p>
            </div>
          ) : state.ggkStage === 'march1' || state.ggkStage === 'march2' ? (
            <div className="p-4 rounded-xl bg-[#263121] border border-[#5d7348] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-sm text-[#f1f5ec] flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-[#dfce88]" />
                  <span>
                    {state.ggkStage === 'march1'
                      ? 'Ujian Perjalanan 80 km Pertama'
                      : 'Ujian Perjalanan 80 km Kedua'}
                  </span>
                </div>
                <span className="text-[#a4b89f] block mt-1">
                  Syarat: Stamina ≥70%, Kesihatan ≥60%, Kos: 3 AP. Memerlukan ketahanan tinggi.
                </span>
              </div>

              <button
                onClick={runGGKMarch}
                disabled={!canRunMarch}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                  canRunMarch
                    ? 'bg-[#3b5539] hover:bg-[#486745] text-[#f2f7ed] border-[#6b8964] shadow-md active:scale-95'
                    : 'bg-[#1b251c] text-[#637562] border-[#314230] cursor-not-allowed'
                }`}
              >
                <span>Jalani Ujian 80 km (3 AP)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#dfce88]" />
              </button>
            </div>
          ) : state.ggkApplication ? (
            <div className="p-4 rounded-xl bg-[#282518] border border-[#6b5832] text-xs">
              <span className="font-bold text-sm text-[#dfce88] block mb-1">
                Permohonan Pemilihan GGK Sedang Diproses
              </span>
              <span className="text-[#c6bc9a]">
                Baki pemprosesan pangkalan: {state.ggkApplication.monthsLeft} bulan. Keputusan akan dikeluarkan selepas kitaran bulanan selesai.
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="text-xs text-[#95a890]">
                {meetsGGKTime
                  ? meetsGGKStats
                    ? 'Anda memenuhi semua syarat saringan fizikal dan masa untuk memohon pemilihan GGK.'
                    : 'Syarat kecergasan belum cukup: Kesihatan ≥65%, Stamina ≥75%, Disiplin ≥70%, Prestasi ≥65%.'
                  : `GGK dibuka selepas 3 tahun perkhidmatan (${36 - state.months} bulan lagi).`}
              </div>

              <button
                onClick={applyGGK}
                disabled={!canApplyGGK}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                  canApplyGGK
                    ? 'bg-[#405a38] hover:bg-[#4f6e45] text-[#f2f7ed] border-[#729364] shadow-md active:scale-95'
                    : 'bg-[#1c271e] text-[#637761] border-[#304130] cursor-not-allowed'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#dfce88]" />
                <span>Mohon Pemilihan GGK (3 AP, RM 4,500+)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
