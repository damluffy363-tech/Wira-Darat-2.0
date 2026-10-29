import React from 'react';
import {
  Compass,
  AlertTriangle,
  Heart,
  Zap,
  Shield,
  Activity,
  Award,
  ChevronRight,
  Clock,
  Coins,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { corpsById, corpsMissionDefs, dateFromOffset, missionData } from '../data/gameData';
import { sound } from '../audio/soundEngine';

export const StoryTab: React.FC = () => {
  const {
    state,
    rest,
    startMission,
    resolveMission,
    activeMission,
    activeStory,
    activeGovMissionBriefing,
    setActiveGovMissionBriefing,
    resolveGovernmentMission,
    declineGovernmentMission,
    checkGovernmentMissionEligibility,
    canDoSecondaryMission,
    canDoPrimaryMission,
    resolveMonthlyStory,
    startCorpsMission,
    resolveCorpsMission,
    startGGKOptional,
    language,
    showToast,
  } = useGame();

  if (!state) return null;

  const currentCorps = corpsById(state.isGGK ? 'ggk' : state.corps);
  const corpsDef = state.corps ? corpsMissionDefs[state.isGGK ? 'ggk' : state.corps] || corpsMissionDefs.ramd : null;
  const govElig = state.activeGovernmentMission
    ? checkGovernmentMissionEligibility(state.activeGovernmentMission)
    : null;

  return (
    <div className="space-y-6">
      {/* Narrative Headline / Scene Box */}
      <div className="bg-gradient-to-br from-[#1c2c20] to-[#131f17] border border-[#3e533d] rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="flex items-center justify-between gap-3 text-xs text-[#95aa90] font-mono mb-2">
          <span className="flex items-center gap-1.5 text-[#dfce88] font-bold">
            <Compass className="w-4 h-4" />
            LATIHAN MEDAN & ARAHAN TUGAS
          </span>
          <span>{dateFromOffset(state.months)}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-[#f1f3e8] mb-3">
          {state.months <= 6 && state.path === 'llp' && state.rank === 0
            ? `Fasa Latihan Rekrut (Bulan ${state.months}/6)`
            : state.isGGK
            ? 'Pusat Operasi Khas Komando GGK'
            : `Pangkalan ${corpsById(state.corps)?.short || 'Latihan Asas'}`}
        </h2>

        <p className="text-sm text-[#cbd7c5] leading-relaxed mb-5">
          {state.lastOutcome}
        </p>

        {/* Quick Recovery Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#314430]">
          <button
            onClick={() => {
              if (state.ap < 1) {
                sound.playWarning();
                showToast('AP tidak mencukupi untuk rehat.');
              } else {
                rest();
              }
            }}
            disabled={state.ap < 1 || state.retired}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              state.ap < 1 || state.retired
                ? 'bg-[#1b261e] border-[#364835] text-[#697968] cursor-not-allowed'
                : 'bg-[#293d2c] hover:bg-[#344e37] border-[#5a7653] text-[#e3edd9] active:scale-95'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#92c578]" />
            <span>Berehat di Kem (+30 HP, +30 Stamina)</span>
            <span className="font-mono text-[10px] text-[#e2d593] bg-[#1a271c] px-1.5 py-0.5 rounded">
              Kos 1 AP
            </span>
          </button>

          <span className="text-[11px] text-[#8e9f8a]">
            AP Simpanan: <b>{state.ap}/20</b>
          </span>
        </div>
      </div>

      {/* Mandatory Monthly Corps Mission Banner (Blocking next month) */}
      {state.monthlyCorpsDue && corpsDef && (
        <div className="bg-gradient-to-r from-[#342918] via-[#2a2215] to-[#1c2419] border-2 border-[#b5954e] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#4f3d1e] text-[#f5dfa8] font-bold text-[10px] font-mono uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ARAHAN MISI KOR WAJIB BULAN INI</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#faecd1]">
                {corpsDef.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#d5cbaf] leading-relaxed">
                {corpsDef.desc}
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-[#e6d8a7] pt-1">
                <span>Kos: <b>2 AP</b></span>
                <span>Elaun Risiko: <b>RM {currentCorps?.allowance || 0}/bln</b></span>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <span className="text-[10px] text-[#d6b772] block mb-1 text-center md:text-right font-mono">
                Wajib sebelum bulan seterusnya
              </span>
              <div className="space-y-2">
                {corpsDef.choices.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => resolveCorpsMission(ch, false)}
                    className="w-full text-left p-3 rounded-xl bg-[#261f13] hover:bg-[#382d1c] border border-[#786134] text-[#ebdcc0] text-xs font-semibold flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-98"
                  >
                    <div>
                      <span className="block font-bold">{ch.label}</span>
                      <span className="text-[10px] text-[#bc9e60] block font-mono">
                        {ch.tone}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#dec78d] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Special Optional GGK Mission for Commandos */}
      {state.isGGK && (
        <div className="bg-[#1b261d] border border-[#5d7348] rounded-2xl p-5 shadow-md flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] font-mono text-[#a8be95] uppercase font-bold">
              KOR UNIT GERAKAN KHAS (GGK)
            </div>
            <h4 className="text-base font-bold text-[#eff5eb]">
              Misi Pilihan Khas Komando GGK
            </h4>
            <p className="text-xs text-[#a9bca5] max-w-xl">
              Tugasan khas berisiko ekstrem di sebalik garisan hadapan. Terhad 1 misi setiap bulan; ganjaran tinggi berserta risiko kecederaan.
            </p>
          </div>
          <button
            onClick={startGGKOptional}
            disabled={state.ggkOptionalUsedMonth === state.months || state.ap < 2}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all cursor-pointer ${
              state.ggkOptionalUsedMonth === state.months || state.ap < 2
                ? 'bg-[#1e261f] border-[#394838] text-[#788877] cursor-not-allowed'
                : 'bg-[#5b322a] hover:bg-[#703d33] border-[#a45d52] text-[#fdece9] active:scale-95 shadow-md'
            }`}
          >
            <span>{state.ggkOptionalUsedMonth === state.months ? 'Telah Dilaksanakan Bulan Ini' : 'Mulakan Misi GGK (2 AP)'}</span>
          </button>
        </div>
      )}

      {/* Annual High-Profile Special Government Mission Offer (Once a Year, Random Month) */}
      {state.activeGovernmentMission && (
        <div className="bg-gradient-to-br from-[#2a1b18] via-[#201815] to-[#171f18] border-2 border-[#df8c7d] rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#5a241e] border border-[#a84d41] text-[#fbebe8] font-bold text-xs font-mono tracking-wider">
                <Shield className="w-4 h-4 text-[#e5c66b]" />
                <span>{state.activeGovernmentMission.subtitle}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#fdf4f2] leading-tight">
                {state.activeGovernmentMission.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#e0cfcc] leading-relaxed">
                {state.activeGovernmentMission.desc}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-[#ecd4cf] pt-2">
                <div className="bg-[#171211] p-2 rounded-lg border border-[#3e2522]">
                  <span className="text-[10px] text-[#b48d88] block">SYARAT MINIMUM</span>
                  <b>Kesihatan {state.activeGovernmentMission.minHealth}% · Stamina {state.activeGovernmentMission.minStamina}%</b>
                </div>
                <div className="bg-[#171211] p-2 rounded-lg border border-[#3e2522]">
                  <span className="text-[10px] text-[#b48d88] block">DISIPLIN & PRESTASI</span>
                  <b>Disiplin {state.activeGovernmentMission.minDiscipline}% · Prestasi {state.activeGovernmentMission.minPerf}%</b>
                </div>
                <div className="bg-[#171211] p-2 rounded-lg border border-[#3e2522] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#dfce88] block">GANJARAN KERAJAAN</span>
                  <b className="text-[#84c473]">+RM {state.activeGovernmentMission.bonusMoney.toLocaleString('en-MY')} · {state.activeGovernmentMission.medalName}</b>
                </div>
              </div>

              {/* Eligibility Check Display */}
              {govElig && (
                govElig.ok ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#86c476] bg-[#1a2e1d] px-3 py-1.5 rounded-lg border border-[#446b43] mt-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span><b>Status:</b> Syarat minimum dipenuhi! Anda disyorkan menyertai operasi khas ini.</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-[#e58c7d] bg-[#291715] p-3 rounded-lg border border-[#6d3029] mt-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <b>Belum Melepasi Had Minimum:</b>
                      <ul className="list-disc list-inside mt-0.5 text-[11px] text-[#e0a8a0]">
                        {govElig.missing.map((mis, idx) => (
                          <li key={idx}>{mis}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col gap-2.5 shrink-0 w-full lg:w-auto">
              <button
                onClick={() => {
                  sound.playRadioChirp();
                  setActiveGovMissionBriefing(state.activeGovernmentMission || null);
                }}
                disabled={!govElig?.ok}
                className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-lg ${
                  govElig?.ok
                    ? 'bg-gradient-to-r from-[#e58c7d] to-[#d66f5d] hover:from-[#f09a8c] hover:to-[#df7a69] text-[#1b1211] border-[#fcd3cc] active:scale-95'
                    : 'bg-[#2b1f1d] text-[#7d5e5b] border-[#4f3633] cursor-not-allowed'
                }`}
              >
                <span>Terima & Buka Taklimat Khas (2 AP)</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={declineGovernmentMission}
                className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#2c1d1a] text-[#b39591] border border-[#543632] text-xs font-semibold cursor-pointer text-center"
              >
                Tolak Tawaran Misi Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regular Mission Board */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#eff3e8]">Papan Misi Operasi & Latihan</h3>
            <p className="text-xs text-[#90a28b]">
              Misi utama dihadkan <b>1 kali sebulan</b>; misi sampingan dihadkan <b>3 bulan sekali</b>.
            </p>
          </div>
          <span className="text-xs font-mono text-[#dcd7a6] bg-[#1c2c1e] px-2.5 py-1 rounded-lg border border-[#3e533c]">
            Kos Misi: 2 AP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {missionData.map((m) => {
            const isRankLocked = state.rank < m.min;
            const isHealthLocked = state.health < 35;
            const isPrepLocked = m.id === 'special' && !state.courses?.specialprep;
            const isGGKBlocked = state.isGGK && m.id !== 'fitness';
            const isAPLocked = state.ap < 2;
            const isCorpsLocked = state.monthlyCorpsDue;

            // Frequency limits:
            const lastSecondary = Number.isFinite(state.lastSecondaryMissionMonth)
              ? state.lastSecondaryMissionMonth
              : -99;
            const secondaryDiff = state.months - lastSecondary;
            const isSecondaryCooldown = m.type === 'Misi sampingan' && secondaryDiff < 3;
            const secondaryWait = Math.max(0, 3 - secondaryDiff);

            const isPrimaryLimit =
              m.type === 'Misi utama' && state.lastPrimaryMissionMonth === state.months;

            const isLocked =
              isRankLocked ||
              isHealthLocked ||
              isPrepLocked ||
              isGGKBlocked ||
              isAPLocked ||
              isCorpsLocked ||
              isSecondaryCooldown ||
              isPrimaryLimit ||
              state.retired;

            let lockReason = '';
            if (state.retired) lockReason = 'Perkhidmatan tamat';
            else if (isCorpsLocked) lockReason = 'Selesaikan misi kor wajib dahulu';
            else if (isSecondaryCooldown)
              lockReason = `Dihadkan 3 bulan sekali. Sedia dalam ${secondaryWait} bln (Bulan ${lastSecondary + 3})`;
            else if (isPrimaryLimit)
              lockReason = 'Dihadkan 1x sebulan. Telah selesai bulan ini (buka bulan depan)';
            else if (isGGKBlocked) lockReason = 'Anggota GGK menggunakan misi khas komando';
            else if (isRankLocked) lockReason = `Perlu pangkat tahap ${m.min + 1}`;
            else if (isHealthLocked) lockReason = 'Kesihatan minimum 35%';
            else if (isPrepLocked) lockReason = 'Perlu Kursus Persediaan Khas';
            else if (isAPLocked) lockReason = 'Perlu 2 AP';

            const riskLabels = ['Sangat Rendah', 'Rendah', 'Sederhana', 'Tinggi'];
            const riskColors = ['text-[#84c172]', 'text-[#9fcc8b]', 'text-[#dfc26e]', 'text-[#df7867]'];

            return (
              <div
                key={m.id}
                className={`bg-gradient-to-br from-[#18281d] to-[#111c13] border rounded-xl p-4 flex flex-col justify-between gap-3 transition-all ${
                  isLocked
                    ? 'border-[#303f2e] opacity-75'
                    : 'border-[#435940] hover:border-[#869f68] shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                    <span className="text-[#a4b89f] font-semibold">
                      {m.type === 'Misi sampingan'
                        ? 'Misi Sampingan (3 Bln Sekali)'
                        : m.type === 'Misi utama'
                        ? 'Misi Utama (1x Sebulan)'
                        : m.type}
                    </span>
                    <span className={`font-bold ${riskColors[m.risk] || 'text-[#dfc26e]'}`}>
                      Risiko: {riskLabels[m.risk] || 'Sederhana'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#f1f5ec] mb-1.5">{m.name}</h4>
                  <p className="text-xs text-[#aebda9] leading-relaxed mb-3">{m.desc}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#293828]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#cad8c4]">
                    <span>Ganjaran Asas: <b className="text-[#dfce88]">+{m.xp} XP</b></span>
                    <span>Disertai: {state.missions[m.id] || 0}x</span>
                  </div>

                  {isLocked ? (
                    <div className="text-[10px] text-[#b47a72] bg-[#271b19] border border-[#5c3732] px-2.5 py-1.5 rounded text-center font-medium">
                      {lockReason}
                    </div>
                  ) : (
                    <button
                      onClick={() => startMission(m.id)}
                      className="w-full py-2 px-3 rounded-lg bg-[#304832] hover:bg-[#3d5c3f] text-[#f2f7ed] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#587954] cursor-pointer active:scale-95 transition-all shadow"
                    >
                      <span>Buka Taklimat Misi (2 AP)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#dfce88]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Mission Modal */}
      {activeMission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17271c] border border-[#576f4e] rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30432f] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#dfce88] uppercase tracking-wider block font-bold">
                  {activeMission.type} · RISIKO TAHAP {activeMission.risk + 1}
                </span>
                <h3 className="text-xl font-black text-[#f2f6ee]">
                  {activeMission.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playTap();
                  activeMission && startMission('');
                }}
                className="text-[#96a992] hover:text-[#eaf0e6] text-sm p-1.5"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#cad7c5] leading-relaxed">
              {activeMission.desc}
            </p>

            <div className="bg-[#101b13] border border-[#2e402d] rounded-xl p-3 text-xs text-[#aabda6]">
              Pilih pendekatan taktikal anda. Keputusan akan mengubah pengalaman (XP), prestasi, disiplin dan imbuhan wang.
            </div>

            <div className="space-y-2.5 pt-2">
              {activeMission.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => resolveMission(c)}
                  className="w-full text-left p-3.5 rounded-xl bg-[#203123] hover:bg-[#2b422e] border border-[#496246] text-[#eaf1e6] text-xs transition-all cursor-pointer active:scale-98 flex items-center justify-between gap-3 group"
                >
                  <div>
                    <span className="block font-bold text-sm text-[#f1f5ec] group-hover:text-[#dfce88]">
                      {c.label}
                    </span>
                    <span className="text-[11px] text-[#9ab095] block mt-0.5 font-mono">
                      Pendekatan: <b className="text-[#cad7c5]">{c.tone}</b>
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#dfce88] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Story Dilemma Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a291e] border-2 border-[#7e9962] rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="border-b border-[#3b4e39] pb-3">
              <span className="text-[10px] font-mono text-[#dfce88] uppercase tracking-wider block font-bold">
                KAWAD & LAPOR DIRI BULANAN · {dateFromOffset(state.months)}
              </span>
              <h3 className="text-xl font-black text-[#f2f6ee]">
                {activeStory.name}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#d4decf] leading-relaxed">
              {activeStory.desc}
            </p>

            <div className="text-[11px] text-[#c0cfae] bg-[#121e15] p-3 rounded-lg border border-[#30412e]">
              Kehadiran kawad bulanan ini adalah wajib. Setiap pilihan membentuk rekod pertimbangan dan kredibiliti perkhidmatan anda.
            </div>

            <div className="space-y-2.5 pt-2">
              {activeStory.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => resolveMonthlyStory(c)}
                  className="w-full text-left p-3.5 rounded-xl bg-[#243727] hover:bg-[#304934] border border-[#516b4e] text-[#f2f6ee] text-xs transition-all cursor-pointer active:scale-98 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="block font-bold text-sm text-[#edf4e9]">
                      {c.label}
                    </span>
                    <span className="text-[11px] text-[#a4b89e] block mt-0.5 font-mono">
                      Nada tindakan: <b>{c.tone}</b>
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#dfce88] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Annual High-Profile Special Government Mission Decision Modal */}
      {activeGovMissionBriefing && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#1c1413] border-2 border-[#df8c7d] rounded-2xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl space-y-4 my-auto relative">
            <div className="flex items-center justify-between border-b border-[#4d2d28] pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#4f1f1a] text-[#ffdcd6] font-mono text-[10px] uppercase tracking-wider font-bold mb-1">
                  <Shield className="w-3.5 h-3.5 text-[#e5c66b]" />
                  <span>MISI BERPROFIL TINGGI KERAJAAN MALAYSIA</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#fff2ef]">
                  {activeGovMissionBriefing.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playTap();
                  setActiveGovMissionBriefing(null);
                }}
                className="text-[#b58c87] hover:text-[#fff2ef] p-1.5 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#ecd9d6] leading-relaxed">
              {activeGovMissionBriefing.desc}
            </p>

            {/* Warning Callout */}
            <div className="bg-[#2c1714] border border-[#7d362c] rounded-xl p-3 sm:p-3.5 flex items-start gap-3 text-xs text-[#f6cecb]">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
              <div>
                <b className="text-[#ffb3a7] block text-xs uppercase tracking-wide">
                  AMARAN RISIKO KESIHATAN & KECEDERAAN MEDAN:
                </b>
                <span className="leading-relaxed text-[11px] text-[#e8c0bb]">
                  Misi berprofil tinggi ini beroperasi di zon kritikal. Risiko kecederaan fizikal kekal serta pengurangan kesihatan/stamina yang ketara adalah benar. Kejayaan operasi akan diiktiraf dengan pingat rasmi Kerajaan Malaysia.
                </span>
              </div>
            </div>

            {/* Reward Summary */}
            <div className="bg-[#161f17] border border-[#395938] rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#9db49a] block">BONUS KERAJAAN</span>
                <b className="text-[#84c473]">+RM {activeGovMissionBriefing.bonusMoney.toLocaleString('en-MY')}</b>
              </div>
              <div>
                <span className="text-[10px] text-[#9db49a] block">NILAI XP</span>
                <b className="text-[#dfce88]">+{activeGovMissionBriefing.bonusXP} XP</b>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#9db49a] block">PINGAT PENGHARGAAN</span>
                <b className="text-[#e8be66] truncate block">{activeGovMissionBriefing.medalName}</b>
              </div>
            </div>

            {/* Choices */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-[#f5dfdb] block uppercase font-mono tracking-wider">
                PILIH PENDEKATAN STRATEGIK ANDA (KOS 2 AP):
              </span>
              {activeGovMissionBriefing.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => resolveGovernmentMission(c)}
                  className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-[#291b19] to-[#201514] hover:from-[#3a2522] hover:to-[#2e1d1b] border border-[#6b3f39] hover:border-[#df8c7d] text-[#fff2ef] transition-all cursor-pointer active:scale-98 flex flex-col gap-2 group shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black text-sm text-[#ffded8] group-hover:text-[#ffd6b0]">
                      {c.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#482521] text-[#fcd3cc] font-bold border border-[#783e36]">
                      {c.tone}
                    </span>
                  </div>
                  {c.desc && (
                    <p className="text-xs text-[#dec1bc] leading-relaxed">
                      {c.desc}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#d6b7b2] pt-1 border-t border-[#462c28]">
                    <span className="text-[#f87171]">Kesihatan: -{c.healthLoss}%</span>
                    <span className="text-[#fb923c]">Stamina: -{c.staminaLoss}%</span>
                    {c.isInjuryRisk && (
                      <span className="text-[#f87171] font-bold">⚠️ Risiko Kecederaan Tinggi</span>
                    )}
                    <span className="text-[#86efac]">Peluang Kejayaan: +{Math.round(c.chance * 100)}%</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  sound.playTap();
                  setActiveGovMissionBriefing(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#2b1c1a] hover:bg-[#382522] text-[#cbb0ab] border border-[#5a3a35] text-xs font-semibold cursor-pointer"
              >
                Tangguhkan Keputusan (Kembali)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
