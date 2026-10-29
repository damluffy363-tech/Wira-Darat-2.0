import React from 'react';
import {
  TrendingUp,
  Award,
  Coins,
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import {
  basePayLLP,
  basePayOff,
  corpsById,
  dateFromOffset,
  ranks,
  v8RankMonths,
  v8RankPerf,
  v8RankXP,
} from '../data/gameData';
import { sound } from '../audio/soundEngine';

export const CareerTab: React.FC = () => {
  const {
    state,
    getRankName,
    getNextRankName,
    getRankEligibility,
    getTotalPay,
    getMonthlyFees,
    startRankCourse,
    language,
    showToast,
  } = useGame();

  if (!state) return null;

  const rankList = ranks[state.path] || ranks.llp;
  const targetRank = state.rank + 1;
  const nextRankName = getNextRankName();
  const eligibility = getRankEligibility();

  // Rank course details for next promotion
  const nextRankCourseId = `promotion_${targetRank}`;
  const isCourseDone = !!state.rankCourses?.[nextRankCourseId];
  const isCourseActive = state.activeCourse?.id === nextRankCourseId;

  const courseFee = 600 + targetRank * 250;
  const courseMonthlyFee = 160 + targetRank * 85;
  const courseXpCost = 8 + targetRank * 5;
  const courseStaminaCost = 15 + targetRank * 4;
  const courseDuration = 2 + Math.floor(Math.max(0, targetRank - 2) / 2);

  const canEnrolCourse =
    !state.retired &&
    !state.activeCourse &&
    !isCourseDone &&
    state.money >= courseFee &&
    state.xp >= courseXpCost &&
    state.stamina >= courseStaminaCost &&
    state.ap >= 2 &&
    state.rank > 0; // Recruits don't need a course for Private

  const handleStartCourse = () => {
    if (!canEnrolCourse) {
      sound.playWarning();
      showToast('Syarat untuk memulakan kursus kenaikan pangkat belum cukup.');
      return;
    }
    startRankCourse();
  };

  const isRecruitWithheld = state.path === 'llp' && state.rank === 0;

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Rank Card */}
        <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-5 shadow-md">
          <span className="text-[10px] text-[#7d9078] font-mono uppercase font-bold block mb-1">
            PANGKAT SEMASA
          </span>
          <div className="text-xl font-black text-[#f2f7ec] mb-1">{getRankName()}</div>
          <span className="text-xs text-[#a4b89f] block">
            {state.path === 'llp' ? 'Lain-Lain Pangkat (LLP)' : 'Laluan Pegawai (Kadet)'}
          </span>
          <div className="mt-3 pt-3 border-t border-[#293a28] flex items-center justify-between text-xs font-mono">
            <span className="text-[#8ba086]">Gaji Asas:</span>
            <span className="font-bold text-[#dfce88]">
              RM {(state.path === 'llp' ? basePayLLP : basePayOff)[state.rank]}
            </span>
          </div>
        </div>

        {/* Next Rank & Eligibility */}
        <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-5 shadow-md">
          <span className="text-[10px] text-[#7d9078] font-mono uppercase font-bold block mb-1">
            SASARAN SETERUSNYA
          </span>
          <div className="text-xl font-black text-[#e8dc9b] mb-1">
            {nextRankName || 'Pangkat Maksimum'}
          </div>
          <span className="text-xs text-[#8ca086] block">
            {isRecruitWithheld
              ? 'Automatik selepas 6 bulan latihan'
              : eligibility.ok
              ? 'Semua syarat dipenuhi'
              : 'Belum memenuhi semua syarat'}
          </span>
          <div className="mt-3 pt-3 border-t border-[#293a28] flex items-center justify-between text-xs font-mono">
            <span className="text-[#8ba086]">Status:</span>
            <span
              className={`font-bold ${
                eligibility.ok ? 'text-[#84c473]' : 'text-[#df8c7c]'
              }`}
            >
              {eligibility.ok ? 'Layak Dinaikkan' : 'Menunggu Syarat'}
            </span>
          </div>
        </div>

        {/* Monthly Earnings & Fixed Deductions */}
        <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-5 shadow-md">
          <span className="text-[10px] text-[#7d9078] font-mono uppercase font-bold block mb-1">
            PENDAPATAN & YURAN BULANAN
          </span>
          <div className="text-xl font-black text-[#82bc67] mb-1">
            RM {getTotalPay().toLocaleString('en-MY')}{' '}
            <span className="text-xs font-normal text-[#96a992]">/bulan</span>
          </div>
          <span className="text-xs text-[#8ca086] block">
            Yuran tetap: RM {getMonthlyFees().toLocaleString('en-MY')} · Tertunggak: RM {state.feeArrears}
          </span>
          <div className="mt-3 pt-3 border-t border-[#293a28] flex items-center justify-between text-xs font-mono">
            <span className="text-[#8ba086]">Gaji Bersih:</span>
            <span className="font-bold text-[#dfce88]">
              {isRecruitWithheld ? 'RM 0 (Ditahan)' : `RM ${(getTotalPay() - getMonthlyFees()).toLocaleString('en-MY')}`}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Rank Promotion Course Box */}
      {nextRankName && (
        <div className="bg-gradient-to-br from-[#1c2c20] to-[#132017] border border-[#4d6348] rounded-2xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88] font-bold">
                <BookOpen className="w-4 h-4" />
                <span>KURSUS WAJIB KENAIKAN PANGKAT: KELAYAKAN {nextRankName.toUpperCase()}</span>
              </div>
              <h3 className="text-lg font-bold text-[#f1f5ec]">
                {isRecruitWithheld
                  ? 'Kenaikan Pangkat Prebet adalah Automatik (6 Bulan)'
                  : `Kursus Kelayakan ${nextRankName}`}
              </h3>
              <p className="text-xs text-[#cad5c3] leading-relaxed">
                {isRecruitWithheld
                  ? 'Sebagai Rekrut, anda tidak perlu mendaftar kursus pangkat. Selepas genap 6 bulan perkhidmatan, anda akan dinaikkan ke Prebet secara automatik dan gaji ditahan akan dilepaskan sepenuhnya.'
                  : `Kursus wajib sebelum pangkat ${nextRankName} boleh dianugerahkan. Mengambil masa ${courseDuration} bulan dan menggunakan yuran pendaftaran serta yuran bulanan.`}
              </p>

              {!isRecruitWithheld && (
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#cad8c5] pt-1">
                  <span>Tempoh: <b>{courseDuration} bulan</b></span>
                  <span>Yuran Daftar: <b>RM {courseFee}</b></span>
                  <span>Yuran Bulanan: <b>RM {courseMonthlyFee}</b></span>
                  <span>Kos XP: <b>{courseXpCost}</b></span>
                  <span>Kos Stamina: <b>{courseStaminaCost}%</b></span>
                  <span>Kos AP: <b>2 AP</b></span>
                </div>
              )}
            </div>

            {!isRecruitWithheld && (
              <div className="shrink-0 w-full md:w-auto">
                {isCourseDone ? (
                  <div className="px-4 py-2.5 rounded-xl bg-[#233524] border border-[#526f4f] text-[#86c476] font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Kursus Telah Selesai</span>
                  </div>
                ) : isCourseActive ? (
                  <div className="px-4 py-2.5 rounded-xl bg-[#2b2718] border border-[#6f5e36] text-[#dfcd8d] font-bold text-xs flex items-center gap-2 animate-pulse">
                    <BookOpen className="w-4 h-4" />
                    <span>Sedang Berjalan ({state.activeCourse?.monthsLeft} bln lagi)</span>
                  </div>
                ) : (
                  <button
                    onClick={handleStartCourse}
                    disabled={!canEnrolCourse}
                    className={`w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      canEnrolCourse
                        ? 'bg-[#3b5538] hover:bg-[#486745] text-[#f2f7ed] border-[#6b8964] shadow-md active:scale-95'
                        : 'bg-[#1e2a20] text-[#718570] border-[#364836] cursor-not-allowed'
                    }`}
                  >
                    <span>Daftar Kursus Wajib (RM {courseFee})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#dfce88]" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promotion Track Ladder */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md">
        <h3 className="text-base font-bold text-[#eff4ea] mb-1">
          Laluan & Tangga Kenaikan Pangkat
        </h3>
        <p className="text-xs text-[#95a890] mb-5">
          Kenaikan pangkat dalam simulasi ini diproses secara automatik sebaik sahaja syarat tempoh masa minimum, XP, prestasi, kelulusan kor dan kursus wajib dipenuhi.
        </p>

        <div className="space-y-3">
          {rankList.map((r, i) => {
            const isCompleted = i < state.rank;
            const isCurrent = i === state.rank;
            const reqM = v8RankMonths[state.path]?.[i] ?? i * 12;
            const reqXP = v8RankXP[state.path]?.[i] ?? 0;
            const reqPerf = v8RankPerf[state.path]?.[i] ?? 50;
            const openDate = dateFromOffset(reqM);

            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                  isCurrent
                    ? 'bg-[#293d2b] border-[#7d9b62] text-[#f0f6ec] shadow-md'
                    : isCompleted
                    ? 'bg-[#18271c] border-[#364935] text-[#b9cbb4]'
                    : 'bg-[#111c13] border-[#293928] text-[#798e77]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCurrent
                        ? 'bg-[#dfce88] text-[#121c13]'
                        : isCompleted
                        ? 'bg-[#3b5539] text-[#e0eedb]'
                        : 'bg-[#1b291d] text-[#697d67]'
                    }`}
                  >
                    {isCompleted ? '✓' : isCurrent ? '▶' : i + 1}
                  </div>

                  <div>
                    <div className="font-bold text-sm flex items-center gap-2">
                      <span>{r}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3c543a] text-[#dfce88] border border-[#64845e]">
                          PANGKAT SEMASA
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#8ea28a] block mt-0.5">
                      {i === 0
                        ? 'Pangkat permulaan latihan'
                        : `Syarat masa: minimum ${reqM} bulan (Buka ${openDate}) · XP: ${reqXP} · Prestasi: ${reqPerf}%`}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 text-[11px] font-mono">
                  {isCompleted ? (
                    <span className="text-[#82c473] font-bold">Telah Dicapai</span>
                  ) : isCurrent ? (
                    <span className="text-[#dfce88] font-bold">Sedang Disandang</span>
                  ) : (
                    <span className="text-[#81967d]">Terkunci</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Salary & Payments Ledger */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md">
        <h3 className="text-base font-bold text-[#eff4ea] mb-1">
          Buku Log Penyata Gaji & Yuran
        </h3>
        <p className="text-xs text-[#95a890] mb-4">
          Gaji dikreditkan secara automatik setiap kali kitaran bulan tamat, dan yuran dipotong serentak.
        </p>

        {state.payments.length === 0 ? (
          <p className="text-xs text-[#8da088] py-4 text-center">
            Belum ada rekod transaksi. Selesaikan bulan pertama untuk menerima penyata gaji.
          </p>
        ) : (
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {state.payments.slice(0, 10).map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#142016] border border-[#2d3e2b] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-[#e1ecd9] flex items-center gap-2">
                    <span>Bulan {p.month} ({p.date})</span>
                    {p.withheld && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#3b2a1a] border border-[#78542c] text-[#dfb877]">
                        Gaji Ditahan (Rekrut)
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#879982] block mt-0.5 font-mono">
                    Kasar: RM {p.gross.toLocaleString('en-MY')} · Yuran Ditolak: RM {p.paidFee.toLocaleString('en-MY')}
                    {p.arrears > 0 && ` · Tunggakan: RM ${p.arrears.toLocaleString('en-MY')}`}
                  </span>
                </div>

                <div className="font-mono text-right text-xs">
                  <span className="text-[#8aa085] block text-[10px]">BERSIH TAMBAH</span>
                  <span className="font-bold text-[#dfce88]">
                    {p.withheld ? 'RM 0 (Simpan)' : `+RM ${p.net.toLocaleString('en-MY')}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
