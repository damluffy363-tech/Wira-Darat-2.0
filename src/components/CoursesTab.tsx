import React from 'react';
import {
  GraduationCap,
  Clock,
  Coins,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { specialCourses } from '../data/gameData';
import { sound } from '../audio/soundEngine';

export const CoursesTab: React.FC = () => {
  const { state, enrolCourse, language, showToast } = useGame();

  if (!state) return null;

  const activeCourse = state.activeCourse;
  const isSpecialActive = activeCourse && activeCourse.kind === 'special';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88] mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>INSTITUT LATIHAN & KURSUS KELAYAKAN KHAS</span>
          </div>
          <h2 className="text-xl font-black text-[#f1f4eb]">Pusat Pembangunan Kemahiran Ketenteraan</h2>
          <p className="text-xs text-[#95a890] mt-1 max-w-xl">
            Kursus khas mengambil masa beberapa bulan perkhidmatan dan memerlukan yuran pendaftaran serta yuran bulanan. Hanya satu kursus boleh berjalan pada satu-satu masa.
          </p>
        </div>

        <div className="bg-[#101b12] border border-[#2d3e2b] px-4 py-2.5 rounded-xl text-right">
          <span className="text-[10px] text-[#7d9078] font-mono block">DANA SEMASA</span>
          <span className="text-lg font-bold font-mono text-[#e5d898]">
            RM {state.money.toLocaleString('en-MY')}
          </span>
        </div>
      </div>

      {/* Active Course Status Banner */}
      {activeCourse && (
        <div
          className={`p-5 rounded-2xl border ${
            activeCourse.monthlyArrears > 0
              ? 'bg-[#332219] border-[#8a4e3e] text-[#f2ddd7]'
              : 'bg-[#1e2f21] border-[#597852] text-[#e8f1e4]'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-[#dfce88]" />
              <span>Kursus Sedang Berjalan: {activeCourse.name}</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#101c13] border border-[#3b533a] text-[#dfce88]">
              {activeCourse.monthsLeft} Bulan Berbaki
            </span>
          </div>

          <p className="text-xs text-[#cad5c3] leading-relaxed mb-3">
            Kemajuan kursus diproses setiap kali kitaran bulan tamat berserta pemotongan yuran bulanan RM {activeCourse.monthlyFee.toLocaleString('en-MY')}.
          </p>

          {activeCourse.monthlyArrears > 0 && (
            <div className="text-xs text-[#e89083] bg-[#221614] p-2.5 rounded-lg border border-[#5d312a] flex items-center gap-2 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Yuran tertunggak: RM {activeCourse.monthlyArrears.toLocaleString('en-MY')}. Kursus ditangguhkan sehingga tunggakan dibayar.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Special Courses Catalog */}
      <div>
        <h3 className="text-base font-bold text-[#eff4ea] mb-3">Kursus Kelayakan Khas</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialCourses.map((c) => {
            const isCompleted = !!state.courses[c.id];
            const isCurrent = activeCourse?.id === c.id;
            const isRankLocked = state.rank < c.min;
            const canAfford = state.money >= c.fee;
            const hasAP = state.ap >= 2;
            const isBlocked =
              isCompleted || isCurrent || !!activeCourse || isRankLocked || !canAfford || !hasAP || state.retired;

            let statusText = 'Boleh Didaftarkan';
            if (isCompleted) statusText = 'Telah Selesai (Sijil Diperoleh)';
            else if (isCurrent) statusText = `Sedang Berjalan (${activeCourse.monthsLeft} bln lagi)`;
            else if (activeCourse) statusText = 'Satu kursus sahaja pada satu masa';
            else if (isRankLocked) statusText = `Perlu pangkat tahap ${c.min + 1}`;
            else if (!canAfford) statusText = 'Wang pendaftaran tidak cukup';
            else if (!hasAP) statusText = 'Perlu 2 AP';

            return (
              <div
                key={c.id}
                className={`bg-gradient-to-br from-[#18281d] to-[#111c13] border rounded-xl p-4 flex flex-col justify-between gap-3 shadow-md transition-all ${
                  isCompleted
                    ? 'border-[#3f573d] bg-[#142017]'
                    : isCurrent
                    ? 'border-[#7e9962] bg-[#1d2d1f]'
                    : 'border-[#384c36] hover:border-[#6f8a57]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                    <span className="text-[#a4b89f]">{c.durationMonths} Bulan Kursus</span>
                    <span className="font-bold text-[#dfce88]">RM {c.fee}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#f1f5ec] mb-1">{c.name}</h4>
                  <p className="text-xs text-[#a9bba4] leading-relaxed mb-3">{c.desc}</p>

                  <div className="text-[11px] font-mono text-[#cad8c5] bg-[#101b12] p-2.5 rounded-lg border border-[#2b3c2a] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#849980]">Yuran Bulanan:</span>
                      <b>RM {c.monthlyFee}/bln</b>
                    </div>
                    <div className="flex items-center justify-between text-[#82bc67]">
                      <span>Ganjaran Tamat:</span>
                      <b>+{c.xp} XP, +{c.perf} Prestasi, +{c.discipline} Disiplin</b>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#293928]">
                  <div className="text-[10px] text-[#8ea08a] font-mono">{statusText}</div>

                  {isCompleted ? (
                    <div className="py-2 px-3 rounded-lg bg-[#223523] text-[#86c476] border border-[#486b47] text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sijil Telah Dimiliki</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => enrolCourse(c.id)}
                      disabled={isBlocked}
                      className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        isBlocked
                          ? 'bg-[#1a251c] text-[#637562] border-[#314230] cursor-not-allowed'
                          : 'bg-[#334b35] hover:bg-[#405f42] text-[#f2f7ee] border-[#5a7b56] active:scale-95 shadow'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 text-[#dfce88]" />
                      <span>Daftar Kursus (RM {c.fee})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Certificates History */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md">
        <h3 className="text-base font-bold text-[#eff4ea] mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-[#dfce88]" />
          <span>Sijil & Rekod Kelayakan Kursus Selesai</span>
        </h3>

        {Object.keys(state.courses).filter((k) => state.courses[k]).length === 0 ? (
          <p className="text-xs text-[#8da088] py-4 text-center">
            Belum ada kursus khas yang diselesaikan. Mendaftar kursus membantu mempercepatkan kenaikan pangkat dan membuka laluan khas.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specialCourses
              .filter((c) => state.courses[c.id])
              .map((c) => (
                <div
                  key={c.id}
                  className="bg-[#121f15] border border-[#395037] p-3.5 rounded-xl text-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-[#f1f5ec] block text-sm">{c.name}</span>
                    <span className="text-[11px] text-[#dfce88] block mt-0.5">{c.award}</span>
                    <span className="text-[10px] text-[#7d9078] block">Tempoh: {c.durationMonths} bulan latihan</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#82bc67] shrink-0" />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
