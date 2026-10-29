import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../audio/soundEngine';

export const TutorialModal: React.FC = () => {
  const { tutorialOpen, setTutorialOpen, language } = useGame();
  const [stepIndex, setStepIndex] = useState<number>(0);

  const stepsMs = [
    {
      icon: '✦',
      tag: 'PANDUAN LAPANGAN · 01',
      title: 'Selamat Datang ke WIRA DARAT',
      lead: 'Kerjaya anda bermula pada Oktober 2026 sebagai seorang Rekrut.',
      body: 'Ini ialah simulasi kerjaya ketenteraan yang digerakkan oleh penceritaan dan keputusan berisiko. Setiap pilihan yang anda ambil akan membentuk rekod disiplin, prestasi operasi, kecergasan stamina, dan status kenaikan pangkat.',
      callout: 'Enam bulan pertama ialah fasa latihan asas Rekrut. Gaji Rekrut ditahan sementara dan akan dilepaskan penuh apabila anda dinaikkan ke Prebet pada bulan ke-6.',
    },
    {
      icon: '⌂',
      tag: 'PANDUAN LAPANGAN · 02',
      title: 'Halaman Utama & 5 Slot Watak',
      lead: 'Urus sehingga lima watak tentera berasingan pada bila-bila masa.',
      body: 'Permainan ini menyokong 5 slot simpanan berasingan. Setiap watak disimpan secara automatik dalam pelayar ini. Watak hanya akan dipadamkan sekiranya anda menekan butang Padam dan mengesahkan tindakan tersebut.',
      callout: 'Anda boleh menukar watak atau memulakan percubaan baharu dari Halaman Utama tanpa kehilangan watak sedia ada.',
    },
    {
      icon: '⌖',
      tag: 'PANDUAN LAPANGAN · 03',
      title: 'Papan Misi, Had Kekerapan & Misi Khas Kerajaan',
      lead: 'Pusat operasi ketenteraan dengan had frekuensi realistik & misi berprofil tinggi.',
      body: 'Untuk memastikan perancangan tempoh perkhidmatan yang realistik: (1) Misi Utama dihadkan kepada SEKALI SEBULAN; (2) Misi Sampingan dihadkan kepada 3 BULAN SEKALI; (3) Sekali setahun pada bulan rawak, anda boleh ditawarkan Misi Khas Berprofil Tinggi Kerajaan Malaysia (Risikan Sulit, Peperangan Hadapan atau Menahan Serangan Pengganas).',
      callout: 'Misi Khas Kerajaan mempunyai had kelayakan minimum yang ketat dan membawa risiko kecederaan/kesihatan fizikal yang tinggi, namun menawarkan bonus wang tunai lumayan, XP besar dan Pingat Kehormat daripada Kerajaan Malaysia.',
    },
    {
      icon: '⚑',
      tag: 'PANDUAN LAPANGAN · 04',
      title: 'Arahan Misi Kor Wajib Bulanan',
      lead: 'Setiap bulan, anda wajib menyelesaikan misi kor unit anda.',
      body: 'Apabila bulan baharu bermula, arahan misi kor wajib akan dipaparkan dengan serlahan khas pada papan misi. Anda mesti menyelesaikan misi kor ini sebelum dibenarkan menamatkan bulan perkhidmatan.',
      callout: 'Jika AP anda tidak mencukupi, anda masih boleh membuat laporan kekurangan AP rasmi bagi mengelakkan perkhidmatan tergantung.',
    },
    {
      icon: '✦',
      tag: 'PANDUAN LAPANGAN · 05',
      title: 'Pangkat, XP & Kenaikan Automatik',
      lead: 'Kenaikan pangkat dalam Wira Darat berlaku secara automatik.',
      body: 'Anda tidak perlu menekan butang kenaikan manual. Sebaik sahaja syarat masa minimum perkhidmatan, sasaran XP, indeks prestasi, kelulusan kor dan kursus kenaikan pangkat dipenuhi, pangkat akan dinaikkan serta-merta!',
      callout: 'Khusus untuk pangkat Rekrut ke Prebet: kenaikan berlaku automatik selepas genap 6 bulan tanpa mengira keputusan ujian latihan.',
    },
    {
      icon: '▦',
      tag: 'PANDUAN LAPANGAN · 06',
      title: 'Kedai Kelengkapan & Ketahanan Alatan',
      lead: 'Beli alatan untuk meningkatkan keupayaan fizikal anda.',
      body: 'Barang kelengkapan seperti Kasut Tempur (+10 stamina/bln), Jam Taktikal (+1 prestasi/bln), dan Beg Galas (+1 disiplin/bln) mempunyai jangka hayat penggunaan (4–8 bulan). Apabila luput, anda perlu memperbaharuinya.',
      callout: 'Peralatan khas seperti Radio Taktikal dan Teropong mempunyai tempoh menunggu stok semula (cooldown) sebelum boleh dibeli lagi.',
    },
    {
      icon: '▣',
      tag: 'PANDUAN LAPANGAN · 07',
      title: 'Kursus Khas & Kursus Pangkat',
      lead: 'Tingkatkan kepakaran melalui institut latihan tentera.',
      body: 'Setiap kursus mengambil masa beberapa bulan perkhidmatan dan mengenakan yuran pendaftaran serta yuran bulanan. Hanya satu kursus boleh berjalan pada satu masa. Kemajuan kursus bergerak setiap kali anda menamatkan bulan.',
      callout: 'Kursus wajib kenaikan pangkat diperlukan untuk membuka pintu pangkat seterusnya. Rancang perbelanjaan agar tidak tertunggak yuran.',
    },
    {
      icon: '⚑',
      tag: 'PANDUAN LAPANGAN · 08',
      title: 'Kor Pilihan & Rejimen Gerak Khas (GGK)',
      lead: 'Pilih cabang kepakaran daripada 16 Kor Tentera Darat atau GGK.',
      body: 'Untuk anggota biasa: duduki ujian saringan kor dan tamatkan kursus kemasukan kor. Bagi laluan komando GGK: ia hanya dibuka selepas 3 tahun perkhidmatan (36 bulan), memerlukan lulus dua ujian 80 km (160 km total), dan Kursus Asas Komando 6 bulan.',
      callout: 'Anggota GGK menerima elaun khas RM 1,200 sebulan, bonus +2 AP bulanan, tetapi menghadapi risiko kesihatan yang lebih tinggi.',
    },
    {
      icon: '⌂',
      tag: 'PANDUAN LAPANGAN · 09',
      title: 'Penempatan Kem, Jarak GPS & Kediaman',
      lead: 'Terokai 44 kem tentera darat di seluruh Semenanjung, Sabah dan Sarawak.',
      body: 'Permohonan pertukaran kem dibuka selepas 3 tahun perkhidmatan. Kos perpindahan dikira mengikut jarak koordinat GPS sebenar antara kem (RM 3,000–RM 25,000).',
      callout: 'Tinggal di kem adalah percuma. Menyewa rumah teres, apartment atau kondominium dibuka selepas mencapai pangkat Koperal.',
    },
    {
      icon: '✪',
      tag: 'PANDUAN LAPANGAN · 10',
      title: 'Pingat, Bintang & Gelaran Kehormat',
      lead: 'Cipta legasi melalui anugerah dan pingat ketenteraan.',
      body: 'Pingat simulasi dianugerahkan berdasarkan kejayaan misi berisiko, integriti, kepimpinan dan latihan berterusan. Perkhidmatan 36 bulan dalam GGK melayakkan anda menerima Pingat Jasa Malaysia (simulasi).',
      callout: 'Tiada pingat yang dianugerahkan semasa 6 bulan pertama fasa Rekrut, kecuali Pingat Tamat Latihan.',
    },
    {
      icon: '◷',
      tag: 'PANDUAN LAPANGAN · 11',
      title: 'Tindakan: "Tamatkan Bulan Ini"',
      lead: 'Butang penamat bulan memajukan masa perkhidmatan anda sebulan ke hadapan.',
      body: 'Apabila ditekan, simulasi akan: (1) Mengkreditkan gaji dan memotong yuran/sewa; (2) Memajukan baki bulan kursus aktif; (3) Memulihkan 5 AP (+2 GGK); (4) Mengira umur dan tahun perkhidmatan; (5) Membuka peristiwa kawad dan lapor diri bulanan baharu.',
      callout: 'Pastikan anda telah menyelesaikan Misi Kor Wajib bulanan sebelum menamatkan bulan.',
    },
    {
      icon: '◎',
      tag: 'PANDUAN LAPANGAN · 12',
      title: 'Persaraan Sukarela 21 Tahun & Wajib 65 Tahun',
      lead: 'Bina kerjaya yang mampan hingga ke puncak persaraan terhormat.',
      body: 'Persaraan sukarela dibuka dengan penuh penghormatan selepas melengkapkan 21 tahun perkhidmatan (252 bulan). Jika umur masih bawah 60 tahun, anda boleh memilih untuk kembali berkhidmat. Persaraan wajib pula berlaku secara automatik pada umur 65 tahun.',
      callout: 'Kunci kejayaan: Urus AP dengan cermat, jangan biarkan kesihatan atau stamina jatuh bawah 40%, dan elakkan tunggakan yuran.',
    },
  ];

  const stepsEn = [
    {
      icon: '✦',
      tag: 'FIELD GUIDE · 01',
      title: 'Welcome to WIRA DARAT',
      lead: 'Your military career starts in October 2026 as a Recruit.',
      body: 'This is a story-driven military career simulation. Every operational decision you make impacts your disciplinary standing, performance index, physical stamina, and career trajectory.',
      callout: 'The first six months are basic Recruit training. Recruit salaries are held in escrow and released in full upon automatic promotion to Private at month six.',
    },
    {
      icon: '⌂',
      tag: 'FIELD GUIDE · 02',
      title: 'Main Hub & 5 Character Save Slots',
      lead: 'Manage up to five distinct soldier records concurrently.',
      body: 'Wira Darat supports 5 separate persistent save slots in your browser. Each character state is saved automatically. A character is only deleted if you explicitly press Delete and confirm.',
      callout: 'You can test different career paths (LLP vs Officer, different corps, GGK) across your saved slots.',
    },
    {
      icon: '⌖',
      tag: 'FIELD GUIDE · 03',
      title: 'Story, Missions & Action Points',
      lead: 'Your tactical headquarters where all decisions take place.',
      body: 'Read mission briefings closely. Regular missions consume 2 AP and stamina. No outcome is 100% risk-free; complications can occur depending on mission hazard ratings.',
      callout: 'Resting at camp consumes 1 AP and restores up to 30 Health and 30 Stamina.',
    },
    {
      icon: '⚑',
      tag: 'FIELD GUIDE · 04',
      title: 'Mandatory Monthly Corps Tasking',
      lead: 'Every month, your assigned unit demands your presence.',
      body: 'When each new month begins, a highlighted mandatory corps mission is assigned. You must complete this tasking before you can advance to subsequent months.',
      callout: 'If your AP is depleted, an official emergency AP-deficiency report can be submitted to prevent duty stalls.',
    },
    {
      icon: '✦',
      tag: 'FIELD GUIDE · 05',
      title: 'Ranks, XP & Automatic Promotions',
      lead: 'Promotions in Wira Darat are processed automatically.',
      body: 'You do not need to click manual rank-up buttons. As soon as service tenure, XP threshold, performance rating, corps qualification, and mandatory rank courses are completed, your promotion is conferred!',
      callout: 'Recruits automatically become Private at 6 months regardless of training exam outcomes.',
    },
    {
      icon: '▦',
      tag: 'FIELD GUIDE · 06',
      title: 'Equipment Store & Gear Lifespans',
      lead: 'Equip your soldier to boost field endurance and discipline.',
      body: 'Gear items like Combat Boots (+10 stamina/mo), Tactical Watch (+1 perf/mo), and Rucksack (+1 disc/mo) have designated durability lifespans (4–8 months). Expired gear must be renewed.',
      callout: 'Specialist gear like Tactical Radios and Recon Binoculars have cooldown intervals between restocks.',
    },
    {
      icon: '▣',
      tag: 'FIELD GUIDE · 07',
      title: 'Specialized Courses & Rank Modules',
      lead: 'Expand military expertise through military training schools.',
      body: 'Each course spans several service months and requires registration plus monthly fees. Only one course can run at any given time. Progress advances as you end each month.',
      callout: 'Mandatory rank qualification courses are required to unlock promotions. Maintain sufficient funds to avoid tuition arrears.',
    },
    {
      icon: '⚑',
      tag: 'FIELD GUIDE · 08',
      title: 'Corps Selection & Special Forces (GGK)',
      lead: 'Specialize across 16 Army Corps or the elite Commando Regiment.',
      body: 'Pass the corps entry test and complete its introductory course to get formally badged. For the elite GGK Commando route: requires 3 years minimum service, passing two 80 km marches (160 km total), and 6-month Commando Basic School.',
      callout: 'Commandos earn RM 1,200 monthly hazard pay, +2 bonus AP each month, but face heightened physical risks.',
    },
    {
      icon: '⌂',
      tag: 'FIELD GUIDE · 09',
      title: 'Bases, GPS Distance Pricing & Housing',
      lead: 'Explore 44 Malaysian military bases across all states.',
      body: 'Base transfer requests unlock after 3 years of service. Relocation costs scale smoothly with real Haversine GPS distances between bases (RM 3,000–RM 25,000).',
      callout: 'Camp barracks are free (RM 0). Off-base rentals (Terrace, Apartment, Condominium) unlock at Corporal rank.',
    },
    {
      icon: '✪',
      tag: 'FIELD GUIDE · 10',
      title: 'Medals, Honors & Citations',
      lead: 'Build an illustrious service record of honorable conduct.',
      body: 'Simulated military decorations are awarded for valor, discipline, leadership, and survival. 36 months of service in GGK awards the Pingat Jasa Malaysia (simulated).',
      callout: 'No non-training medals are awarded during the initial 6-month Recruit phase.',
    },
    {
      icon: '◷',
      tag: 'FIELD GUIDE · 11',
      title: 'The Action: "End This Month"',
      lead: 'The turn-advance button that moves your military timeline forward.',
      body: 'Ending the month processes salary and deductions, ticks course progress, replenishes 5 AP (+2 GGK), calculates annual age and service years, and triggers a new monthly muster story.',
      callout: 'Always resolve the mandatory monthly corps mission before advancing.',
    },
    {
      icon: '◎',
      tag: 'FIELD GUIDE · 12',
      title: 'Retirement: Voluntary at 21y & Mandatory at 65',
      lead: 'Build an enduring military career towards honorable discharge.',
      body: 'Voluntary retirement opens with full honors after 21 service years (252 months). If still under 60, you can choose to return to active service. Mandatory retirement triggers automatically at age 65.',
      callout: 'Key strategy: manage your AP, keep health and stamina above 40%, and maintain a cash buffer for monthly bills.',
    },
  ];

  const steps = language === 'en' ? stepsEn : stepsMs;
  const current = steps[stepIndex] || steps[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!tutorialOpen) return;
      if (e.key === 'Escape') {
        sound.playTap();
        setTutorialOpen(false);
      } else if (e.key === 'ArrowLeft' && stepIndex > 0) {
        sound.playTap();
        setStepIndex((i) => i - 1);
      } else if (e.key === 'ArrowRight' && stepIndex < steps.length - 1) {
        sound.playTap();
        setStepIndex((i) => i + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tutorialOpen, stepIndex, steps.length, setTutorialOpen]);

  if (!tutorialOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-gradient-to-br from-[#192b1e] via-[#121f15] to-[#18291c] border-2 border-[#6d8754] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-xs text-[#e5eee2]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#344833] bg-[#1d3122] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dfce88]" />
            <span className="font-mono text-[11px] font-bold text-[#dfce88] tracking-widest uppercase">
              {language === 'en' ? 'WIRA DARAT FIELD GUIDE' : 'PANDUAN LAPANGAN WIRA DARAT'}
            </span>
          </div>

          <div className="text-xs font-mono font-bold text-[#a6bc9f]">
            {String(stepIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </div>
        </div>

        {/* Step Progress Ticks */}
        <div className="grid grid-cols-12 gap-1 px-5 pt-3 pb-1 bg-[#152518]">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx <= stepIndex ? 'bg-[#dfce88]' : 'bg-[#293c29]'
              }`}
            />
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#385135] to-[#253925] border border-[#6f8957] text-[#dfce88] flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
              {current.icon}
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#98ae8f] uppercase font-bold tracking-wider block">
                {current.tag}
              </span>
              <h3 className="text-xl font-black text-[#f1f5ec] leading-tight mt-0.5">
                {current.title}
              </h3>
              <p className="text-xs text-[#b8c9b2] mt-1 font-medium">{current.lead}</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#cbd8c6] leading-relaxed">
            {current.body}
          </p>

          <div className="p-4 rounded-xl bg-[#23311f] border border-[#5d7348] text-xs text-[#e1ecd9] leading-relaxed">
            <b>{language === 'en' ? 'Field Note:' : 'Nota Lapangan:'}</b> {current.callout}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-5 py-3.5 border-t border-[#344833] bg-[#132116] flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => {
              sound.playTap();
              setTutorialOpen(false);
            }}
            className="px-3.5 py-2 rounded-lg bg-transparent hover:bg-[#203122] border border-[#485e42] text-[#a9bba4] font-semibold text-xs cursor-pointer"
          >
            {language === 'en' ? 'Skip Guide' : 'Langkau Panduan'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playTap();
                setStepIndex((i) => Math.max(0, i - 1));
              }}
              disabled={stepIndex === 0}
              className={`px-3.5 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                stepIndex === 0
                  ? 'bg-[#18251a] text-[#556753] border-[#293a28] cursor-not-allowed'
                  : 'bg-[#253926] hover:bg-[#304a32] text-[#e0eed9] border-[#4c6747]'
              }`}
            >
              {language === 'en' ? '← Back' : '← Kembali'}
            </button>

            <button
              onClick={() => {
                sound.playTap();
                if (stepIndex < steps.length - 1) {
                  setStepIndex((i) => i + 1);
                } else {
                  setTutorialOpen(false);
                }
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#dfce88] to-[#c2b069] text-[#121c13] font-black text-xs border border-[#f1e5a5] shadow-md hover:from-[#ebd994] hover:to-[#cdbc73] cursor-pointer"
            >
              {stepIndex === steps.length - 1
                ? language === 'en'
                  ? 'Finish & Start ✓'
                  : 'Selesai & Mula ✓'
                : language === 'en'
                ? 'Next →'
                : 'Seterusnya →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
