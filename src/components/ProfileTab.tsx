import React from 'react';
import {
  UserCheck,
  Shield,
  Heart,
  Activity,
  Award,
  Calendar,
  FileText,
  Clock,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { campById, corpsById, dateFromOffset } from '../data/gameData';

export const ProfileTab: React.FC = () => {
  const { state, getRankName, language } = useGame();

  if (!state) return null;

  const camp = campById(state.campId);
  const corp = corpsById(state.isGGK ? 'ggk' : state.corps);
  const cert = state.v8TrainingCertificate;

  return (
    <div className="space-y-6">
      {/* Soldier Service Record Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88] mb-3">
            <UserCheck className="w-4 h-4" />
            <span>FAIL PERKHIDMATAN ANGGOTA</span>
          </div>

          <h2 className="text-2xl font-black text-[#f1f4eb] mb-1">{state.name}</h2>
          <div className="text-xs text-[#a6b89f] mb-5">
            Laluan: <b>{state.path === 'llp' ? 'Lain-Lain Pangkat (LLP)' : 'Laluan Pegawai (Kadet)'}</b> · ID Anggota: <span className="font-mono text-[#c6d7be]">WD-{state.created.slice(0, 10).replace(/-/g, '')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#101912] border border-[#2b3d2a] p-3 rounded-xl">
              <span className="text-[10px] text-[#7d9078] block font-mono uppercase">Pangkat Semasa</span>
              <span className="text-base font-bold text-[#f2f7ec]">{getRankName()}</span>
            </div>

            <div className="bg-[#101912] border border-[#2b3d2a] p-3 rounded-xl">
              <span className="text-[10px] text-[#7d9078] block font-mono uppercase">Kor Perkhidmatan</span>
              <span className="text-base font-bold text-[#e1dfb0]">
                {state.isGGK ? 'KOR UNIT GERAKAN KHAS (GGK)' : corp?.name || (state.corpsTarget ? `${state.corpsTarget.toUpperCase()} (Calon)` : 'Belum diserap')}
              </span>
            </div>

            <div className="bg-[#101912] border border-[#2b3d2a] p-3 rounded-xl">
              <span className="text-[10px] text-[#7d9078] block font-mono uppercase">Penempatan Kem</span>
              <span className="text-sm font-bold text-[#e0e8db]">{camp.name}</span>
              <span className="text-[10px] text-[#869982] block">{camp.city}, {camp.state}</span>
            </div>

            <div className="bg-[#101912] border border-[#2b3d2a] p-3 rounded-xl">
              <span className="text-[10px] text-[#7d9078] block font-mono uppercase">Umur & Tempoh Perkhidmatan</span>
              <span className="text-sm font-bold text-[#e0e8db]">{state.age} tahun</span>
              <span className="text-[10px] text-[#869982] block">
                {state.months} bulan ({Math.floor(state.months / 12)} tahun lengkap)
              </span>
            </div>

            <div className="bg-[#101912] border border-[#2b3d2a] p-3 rounded-xl">
              <span className="text-[10px] text-[#7d9078] block font-mono uppercase">Jumlah Pengalaman</span>
              <span className="text-sm font-bold text-[#dfce88]">{state.xp} XP</span>
              <span className="text-[10px] text-[#869982] block">
                {Object.values(state.missions || {}).reduce((a, b) => a + b, 0)} misi selesai
              </span>
            </div>

            <div className="bg-[#101912] border border-[#2b3d2a] p-3 rounded-xl">
              <span className="text-[10px] text-[#7d9078] block font-mono uppercase">Status Persaraan</span>
              <span className={`text-sm font-bold ${state.retired ? 'text-[#e58c7d]' : 'text-[#84c473]'}`}>
                {state.retired ? 'Telah Bersara' : 'Anggota Aktif'}
              </span>
              <span className="text-[10px] text-[#869982] block">
                {state.months >= 252 ? 'Layak bersara sukarela' : `${252 - state.months} bulan lagi untuk persaraan 21 tahun`}
              </span>
            </div>
          </div>

          {/* Recruit Training Certificate Badge */}
          {cert && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#292314] to-[#1e2c1c] border border-[#83703d] text-xs">
              <div className="flex items-center gap-2 text-[#e3ce8b] font-bold text-sm mb-1">
                <Award className="w-4 h-4 text-[#dfce88]" />
                <span>SIJIL TAMAT LATIHAN REKRUT — GRED {cert.grade.toUpperCase()}</span>
              </div>
              <p className="text-[#d8decb] text-xs leading-relaxed mb-2">
                {cert.desc}
              </p>
              <div className="text-[10px] text-[#93a68d] font-mono flex items-center justify-between">
                <span>Dikeluarkan: {cert.issuedAt}</span>
                <span>Prestasi Latihan: {cert.performance}% · Disiplin: {cert.discipline}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Condition & Vital Meters */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88]">
            <Activity className="w-4 h-4" />
            <span>KEADAAN ANGGOTA & KECERGASAN</span>
          </div>

          {/* Health Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-[#d2decd]">Kesihatan Simulasi</span>
              <span className="font-mono text-sm text-[#f1f5ec]">{state.health}%</span>
            </div>
            <div className="h-3 bg-[#0e1710] rounded-full overflow-hidden border border-[#2f402e]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  state.health < 40 ? 'bg-[#d87c6c]' : 'bg-[#98cf7e]'
                }`}
                style={{ width: `${state.health}%` }}
              />
            </div>
            <span className="text-[10px] text-[#869982] block mt-1">
              Merosot jika terdedah risiko misi atau cuaca buruk. Boleh dipulihkan melalui Rehat atau Kit Perubatan.
            </span>
          </div>

          {/* Stamina Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-[#d2decd]">Ketahanan Stamina</span>
              <span className="font-mono text-sm text-[#f1f5ec]">{state.stamina}%</span>
            </div>
            <div className="h-3 bg-[#0e1710] rounded-full overflow-hidden border border-[#2f402e]">
              <div
                className="h-full bg-[#82b4dc] rounded-full transition-all duration-300"
                style={{ width: `${state.stamina}%` }}
              />
            </div>
            <span className="text-[10px] text-[#869982] block mt-1">
              Diperlukan untuk ujian GGK dan kursus kenaikan pangkat. Boleh dipulihkan dengan Rehat, Makanan Tambahan, atau Kasut Latihan.
            </span>
          </div>

          {/* Prestasi */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-[#d2decd]">Indeks Prestasi Operasi</span>
              <span className="font-mono text-sm text-[#dfce88]">{state.perf}%</span>
            </div>
            <div className="h-3 bg-[#0e1710] rounded-full overflow-hidden border border-[#2f402e]">
              <div
                className="h-full bg-[#dfce88] rounded-full transition-all duration-300"
                style={{ width: `${state.perf}%` }}
              />
            </div>
            <span className="text-[10px] text-[#869982] block mt-1">
              Syarat kenaikan pangkat. Meningkat melalui kejayaan misi dan buku taktikal.
            </span>
          </div>

          {/* Disiplin */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-[#d2decd]">Rekod Disiplin Tentera</span>
              <span className="font-mono text-sm text-[#84c473]">{state.discipline}%</span>
            </div>
            <div className="h-3 bg-[#0e1710] rounded-full overflow-hidden border border-[#2f402e]">
              <div
                className="h-full bg-[#84c473] rounded-full transition-all duration-300"
                style={{ width: `${state.discipline}%` }}
              />
            </div>
            <span className="text-[10px] text-[#869982] block mt-1">
              Dipupuk melalui keputusan berprinsip, kawad lapor diri, dan pakaian seragam yang kemas.
            </span>
          </div>
        </div>
      </div>

      {/* Complete Operations Log */}
      <div className="bg-gradient-to-br from-[#1b2b1d] to-[#121e15] border border-[#3e533c] rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#dfce88]">
            <FileText className="w-4 h-4" />
            <span>DIARI & LOG OPERASI PERKHIDMATAN</span>
          </div>
          <span className="text-xs text-[#879983] font-mono">
            {state.log.length} Catatan Rekod
          </span>
        </div>

        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 divide-y divide-[#273827]">
          {state.log.map((l, i) => (
            <div key={i} className="pt-3 first:pt-0">
              <div className="flex items-center justify-between text-xs text-[#8ca087] font-mono mb-1">
                <span className="font-bold text-[#dfce88]">{l.title}</span>
                <span className="text-[11px] text-[#788a74]">{l.date}</span>
              </div>
              <p className="text-xs text-[#c6d4bf] leading-relaxed">{l.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
