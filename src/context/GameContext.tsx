import React, { createContext, useContext, useEffect, useState } from 'react';
import { sound } from '../audio/soundEngine';
import {
  basePayLLP,
  basePayOff,
  campById,
  campData,
  corpsById,
  dateFromOffset,
  housingById,
  missionData,
  monthlyStoryData,
  ranks,
  shopItems,
  specialCourses,
  specialGovernmentMissions,
  transferCost,
  v8RankMonths,
  v8RankPerf,
  v8RankXP,
} from '../data/gameData';
import {
  AwardItem,
  CareerPath,
  CharacterSlot,
  CharacterState,
  CharacterStore,
  CorpsMissionDefChoice,
  HousingId,
  Mission,
  MissionChoice,
  MonthlyStory,
  MonthlyStoryChoice,
  RandomMission,
  SpecialGovernmentMission,
  SpecialGovernmentMissionChoice,
  TrainingCertificate,
} from '../types/game';

const V8_STORE_KEY = 'wiraDaratCharactersV8';
const V8_LANG_KEY = 'wiraDaratLanguageV8';

export interface AwardNotice {
  kind: string;
  name: string;
  desc: string;
}

interface GameContextType {
  state: CharacterState | null;
  store: CharacterStore;
  language: 'ms' | 'en';
  setLanguage: (lang: 'ms' | 'en') => void;
  soundMuted: boolean;
  toggleMute: () => void;
  sfxVolume: number;
  setSfxVolume: (vol: number) => void;
  ambientActive: boolean;
  toggleAmbient: () => void;
  ambientVolume: number;
  setAmbientVolume: (vol: number) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isHome: boolean;
  setIsHome: (home: boolean) => void;
  toastMsg: string | null;
  showToast: (msg: string) => void;
  awardQueue: AwardNotice[];
  currentAward: AwardNotice | null;
  dismissAward: () => void;
  tutorialOpen: boolean;
  setTutorialOpen: (open: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  activeMission: Mission | null;
  activeStory: MonthlyStory | null;
  activeGovMissionBriefing: SpecialGovernmentMission | null;
  setActiveGovMissionBriefing: (m: SpecialGovernmentMission | null) => void;
  resolveGovernmentMission: (choice: SpecialGovernmentMissionChoice) => void;
  declineGovernmentMission: () => void;
  checkGovernmentMissionEligibility: (m: SpecialGovernmentMission) => { ok: boolean; missing: string[] };
  canDoSecondaryMission: () => { ok: boolean; monthsWait: number };
  canDoPrimaryMission: () => { ok: boolean };
  startNewGame: (name: string, path: CareerPath, initialCorps: string, startingAgeChoice: string) => void;
  selectSlot: (id: string) => void;
  deleteSlot: (id: string) => void;
  advanceMonth: () => void;
  rest: () => void;
  startMission: (id: string) => void;
  resolveMission: (choice: MissionChoice) => void;
  startCorpsMission: () => void;
  resolveCorpsMission: (choice: CorpsMissionDefChoice, isOptional?: boolean) => void;
  startGGKOptional: () => void;
  resolveMonthlyStory: (choice: MonthlyStoryChoice) => void;
  buyItem: (id: string) => void;
  useItem: (id: string) => void;
  enrolCourse: (id: string) => void;
  startRankCourse: () => void;
  setCorpsChoice: (id: string) => void;
  startCorpsTest: () => void;
  startCorpsEntryCourse: () => void;
  applyGGK: () => void;
  runGGKMarch: () => void;
  changeHousing: (id: HousingId) => void;
  requestTransfer: (targetId: string) => void;
  voluntaryRetire: () => void;
  returnToService: () => void;
  getRankName: (rankIdx?: number) => string;
  getNextRankName: () => string | null;
  getRankEligibility: () => { ok: boolean; why: string };
  getMonthlyFees: () => number;
  getTotalPay: () => number;
  hasItem: (id: string) => boolean;
  getCampName: (id: string) => string;
  getCorpsName: (id: string | null) => string;
}

const GameContext = createContext<GameContextType | null>(null);

function createFreshState(
  name: string,
  path: CareerPath,
  initialCorps: string,
  startAge: number,
  campId: string
): CharacterState {
  const d = dateFromOffset(0);
  return {
    version: 9,
    name: name.trim() || 'Rekrut',
    path,
    rank: 0,
    xp: 0,
    months: 0,
    careerMonths: 0,
    age: startAge,
    startingAge: startAge,
    perf: 48,
    discipline: 55,
    health: 100,
    stamina: 90,
    money: 500,
    ap: 5,
    apMax: 20,
    heldSalary: 0,
    feeArrears: 0,
    lastMonthlyFee: 50,
    lastGrossSalary: 0,
    lastNetSalary: 0,
    lastSalary: 0,
    lastSalaryMonth: 0,
    payMonth: 0,
    lastPaidMonth: 0,
    payments: [],
    inventory: {},
    itemExpiry: {},
    specialItemLastBought: {},
    courses: {},
    activeCourse: null,
    rankCourses: {},
    courseFeeArrears: 0,
    courseHistory: [],
    campId,
    transferCount: 0,
    pendingTransfer: null,
    lastTransferAttemptYear: -1,
    lastTransferMonth: -99,
    transferOddsYearIndex: 0,
    transferApprovalOdds: 45 + Math.floor(Math.random() * 35),
    housingId: 'barracks',
    lastHousingBonusMonth: -1,
    housingHistory: [],
    corps: null,
    corpsTarget: initialCorps,
    corpsStage: 'test',
    corpsTestTries: 0,
    corpsRetryAfter: 0,
    corpsEntry: null,
    corpsHistory: [],
    corpsMissions: {},
    monthlyCorpsDue: false,
    ggkStage: 'locked',
    ggkApplication: null,
    ggkRetryAt: 36,
    ggkCourseLeft: 0,
    ggkCourseArrears: 0,
    ggkMonthlyFee: 900,
    ggkServiceMonths: 0,
    ggkPJMAwarded: false,
    isGGK: false,
    preGGKCorps: null,
    preGGKCampId: null,
    ggkMarchDistance: 0,
    ggkOptionalUsedMonth: -1,
    missions: {},
    log: [
      {
        date: d,
        title: 'Hari Pertama Perkhidmatan',
        text: `Anda melapor diri sebagai ${path === 'llp' ? 'Rekrut' : 'Pegawai Kadet'} pada Oktober 2026 di ${campById(campId).name}. Perjalanan kerjaya anda bermula dengan latihan asas ketenteraan.`,
      },
    ],
    medals: [],
    titles: [],
    special: false,
    injuries: 0,
    failedPromotions: 0,
    conflictsSeen: 0,
    conflictHistory: [],
    scene: 'unit',
    ending: false,
    retired: false,
    retirementDue: false,
    endReason: null,
    annualStoryYear: 1,
    annualStoryDeck: [],
    lastOutcome: 'Selamat datang ke WIRA DARAT. Pilih tindakan anda untuk memulakan kerjaya.',
    nextBranchNarrative: '',
    created: new Date().toISOString(),
    v8WelcomePending: true,
    v8TrainingCertificate: null,
    nextRandomMissionMonth: 2 + Math.floor(Math.random() * 3),
    pendingMonthlyMission: null,
    randomMissionHistory: [],
    v91TutorialPending: true,
    v91TutorialSeen: false,
    lastSecondaryMissionMonth: -99,
    lastPrimaryMissionMonth: -99,
    yearlySpecialMissionYear: 1,
    yearlySpecialMissionMonth: 3 + Math.floor(Math.random() * 8),
    activeGovernmentMission: null,
    completedGovernmentMissions: [],
  };
}

function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<CharacterStore>(() => {
    try {
      const raw = localStorage.getItem(V8_STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.slots)) {
          return { activeId: parsed.activeId || null, slots: parsed.slots };
        }
      }
    } catch (_) {}
    return { activeId: null, slots: [] };
  });

  const [language, setLanguageState] = useState<'ms' | 'en'>(() => {
    try {
      const stored = localStorage.getItem(V8_LANG_KEY);
      return stored === 'en' ? 'en' : 'ms';
    } catch (_) {
      return 'ms';
    }
  });

  const [state, setState] = useState<CharacterState | null>(() => {
    if (store.activeId) {
      const slot = store.slots.find((s) => s.id === store.activeId);
      return slot ? slot.state : null;
    }
    return null;
  });

  const [soundMuted, setSoundMuted] = useState<boolean>(() => sound.getMuted());
  const [sfxVolume, setSfxVolumeState] = useState<number>(() => sound.getSfxVolume());
  const [ambientActive, setAmbientActiveState] = useState<boolean>(() => sound.isAmbientActive());
  const [ambientVolume, setAmbientVolumeState] = useState<number>(() => sound.getAmbientVolume());

  const [currentTab, setCurrentTab] = useState<string>('story');
  const [isHome, setIsHome] = useState<boolean>(!store.activeId);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [awardQueue, setAwardQueue] = useState<AwardNotice[]>([]);
  const [currentAward, setCurrentAward] = useState<AwardNotice | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [activeStory, setActiveStory] = useState<MonthlyStory | null>(null);
  const [activeGovMissionBriefing, setActiveGovMissionBriefing] = useState<SpecialGovernmentMission | null>(null);

  const canDoSecondaryMission = (): { ok: boolean; monthsWait: number } => {
    if (!state) return { ok: false, monthsWait: 0 };
    const last = Number.isFinite(state.lastSecondaryMissionMonth) ? state.lastSecondaryMissionMonth : -99;
    const diff = state.months - last;
    return { ok: diff >= 3, monthsWait: Math.max(0, 3 - diff) };
  };

  const canDoPrimaryMission = (): { ok: boolean } => {
    if (!state) return { ok: false };
    return { ok: state.lastPrimaryMissionMonth !== state.months };
  };

  const checkGovernmentMissionEligibility = (m: SpecialGovernmentMission): { ok: boolean; missing: string[] } => {
    if (!state) return { ok: false, missing: ['Tiada watak aktif'] };
    const missing: string[] = [];
    if (state.rank < m.minRank) {
      const minRankName = (ranks[state.path] || ranks.llp)[m.minRank] || `Tahap ${m.minRank + 1}`;
      missing.push(`Pangkat minimum ${minRankName}`);
    }
    if (state.health < m.minHealth) missing.push(`Kesihatan minimum ${m.minHealth}% (Semasa: ${state.health}%)`);
    if (state.stamina < m.minStamina) missing.push(`Stamina minimum ${m.minStamina}% (Semasa: ${state.stamina}%)`);
    if (state.discipline < m.minDiscipline) missing.push(`Disiplin minimum ${m.minDiscipline}% (Semasa: ${state.discipline}%)`);
    if (state.perf < m.minPerf) missing.push(`Prestasi minimum ${m.minPerf}% (Semasa: ${state.perf}%)`);
    if (state.ap < 2) missing.push('AP minimum 2 (Kos Misi)');
    return { ok: missing.length === 0, missing };
  };

  // Sync Audio Engine on user clicks to unlock AudioContext
  useEffect(() => {
    const handleGesture = () => {
      sound.unlock();
    };
    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  // Sync Store to LocalStorage
  const persistStore = (newStore: CharacterStore) => {
    setStore(newStore);
    try {
      localStorage.setItem(V8_STORE_KEY, JSON.stringify(newStore));
    } catch (_) {}
  };

  // Auto-save active state into slot
  const saveState = (newState: CharacterState) => {
    setState(newState);
    if (!store.activeId) return;
    const newSlots = store.slots.map((s) => {
      if (s.id === store.activeId) {
        return {
          ...s,
          name: newState.name || s.name,
          updated: new Date().toISOString(),
          state: newState,
        };
      }
      return s;
    });
    persistStore({ ...store, slots: newSlots });
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 3200);
  };

  const announceAward = (kind: string, name: string, desc: string) => {
    sound.playFanfare();
    const notice: AwardNotice = { kind, name, desc };
    setAwardQueue((prev) => [...prev, notice]);
  };

  useEffect(() => {
    if (!currentAward && awardQueue.length > 0) {
      setCurrentAward(awardQueue[0]);
      setAwardQueue((prev) => prev.slice(1));
    }
  }, [awardQueue, currentAward]);

  const dismissAward = () => {
    sound.playTap();
    setCurrentAward(null);
  };

  const setLanguage = (lang: 'ms' | 'en') => {
    setLanguageState(lang);
    try {
      localStorage.setItem(V8_LANG_KEY, lang);
    } catch (_) {}
  };

  const toggleMute = () => {
    const newMute = !soundMuted;
    setSoundMuted(newMute);
    sound.setMuted(newMute);
    if (!newMute) sound.playTap();
  };

  const setSfxVolume = (vol: number) => {
    setSfxVolumeState(vol);
    sound.setSfxVolume(vol);
  };

  const toggleAmbient = () => {
    const act = sound.toggleAmbient();
    setAmbientActiveState(act);
    sound.playTap();
  };

  const setAmbientVolume = (vol: number) => {
    setAmbientVolumeState(vol);
    sound.setAmbientVolume(vol);
  };

  // Helper functions
  const getRankList = (path: CareerPath = state?.path || 'llp') => ranks[path] || ranks.llp;
  const getRankName = (idx: number = state?.rank || 0) => {
    const list = getRankList();
    const base = list[Math.min(idx, list.length - 1)] || 'Rekrut';
    return state?.isGGK ? `${base} (Komando GGK)` : base;
  };
  const getNextRankName = () => {
    if (!state) return null;
    const list = getRankList();
    return list[state.rank + 1] || null;
  };
  const getCampName = (id: string) => campById(id).name;
  const getCorpsName = (id: string | null) => (id ? corpsById(id)?.name || id : 'Belum diserap');

  const getRankSalary = () => {
    if (!state) return 900;
    const pays = state.path === 'llp' ? basePayLLP : basePayOff;
    return pays[Math.min(state.rank, pays.length - 1)] || 900;
  };

  const getAllowance = () => {
    if (!state) return 0;
    const c = corpsById(state.isGGK ? 'ggk' : state.corps);
    return Math.round(
      (c ? c.allowance : 0) +
        (state.perf >= 80 ? 180 : 0) +
        (state.discipline >= 80 ? 100 : 0)
    );
  };

  const getTotalPay = () => getRankSalary() + getAllowance();

  const getMonthlyFees = () => {
    if (!state) return 50;
    const list =
      state.path === 'llp'
        ? [50, 80, 110, 150, 190, 240, 290, 350]
        : [70, 120, 160, 210, 270, 330, 400, 480, 560, 650, 750];
    const base = list[Math.min(state.rank, list.length - 1)] || 50;
    const corpsF = state.corps ? (corpsById(state.isGGK ? 'ggk' : state.corps)?.fee || 0) : 0;
    const rent = housingById(state.housingId).rent;
    return base + corpsF + rent;
  };

  const hasItem = (id: string): boolean => {
    if (!state) return false;
    const qty = state.inventory[id] || 0;
    if (qty <= 0) return false;
    const it = shopItems.find((x) => x.id === id);
    if (it && it.type === 'gear') {
      const exp = state.itemExpiry[id];
      return Number.isFinite(exp) && state.months < exp;
    }
    return true;
  };

  const getRankEligibility = () => {
    if (!state) return { ok: false, why: 'Tiada watak aktif.' };
    if (state.retired) return { ok: false, why: 'Watak telah bersara.' };
    const list = getRankList();
    if (state.rank >= list.length - 1) return { ok: false, why: 'Pangkat tertinggi telah dicapai.' };
    const target = state.rank + 1;
    const reqMonths = v8RankMonths[state.path]?.[target] ?? target * 12;
    if (state.path === 'llp' && state.rank === 0) {
      return state.months >= 6
        ? { ok: true, why: 'Kelayakan masa Rekrut 6 bulan dipenuhi.' }
        : { ok: false, why: `Rekrut dinaikkan automatik selepas 6 bulan (${state.months}/6 bulan selesai).` };
    }
    const missing: string[] = [];
    if (state.months < reqMonths) missing.push(`tempoh ${reqMonths} bulan`);
    const xpReq = v8RankXP[state.path]?.[target] ?? 0;
    if (state.xp < xpReq) missing.push(`XP ${xpReq}`);
    const perfReq = v8RankPerf[state.path]?.[target] ?? 50;
    if (state.perf < perfReq) missing.push(`prestasi ${perfReq}%`);
    if (!state.corps || state.corpsEntry) missing.push('lulus kemasukan kor');
    const courseKey = `promotion_${target}`;
    if (!state.rankCourses?.[courseKey]) missing.push('kursus kenaikan pangkat');

    return {
      ok: missing.length === 0,
      why: missing.length ? `Belum layak: ${missing.join(', ')}.` : 'Syarat dipenuhi! Kenaikan pangkat automatik.',
    };
  };

  // Character management
  const startNewGame = (
    name: string,
    path: CareerPath,
    initialCorps: string,
    startingAgeChoice: string
  ) => {
    sound.playMarch();
    let startAge = 18;
    if (startingAgeChoice === 'random') {
      startAge = 18 + Math.floor(Math.random() * 13);
    } else {
      startAge = parseInt(startingAgeChoice, 10) || 18;
    }

    const availableCamps = campData.filter((c) => c.corpsIds?.includes(initialCorps));
    const campId =
      availableCamps.length > 0
        ? availableCamps[Math.floor(Math.random() * availableCamps.length)].id
        : campData[0].id;

    const fresh = createFreshState(name, path, initialCorps, startAge, campId);
    const id = 'char-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    const newSlot: CharacterSlot = {
      id,
      name: fresh.name,
      created: fresh.created,
      updated: new Date().toISOString(),
      state: fresh,
    };

    const newSlots = [...store.slots, newSlot].slice(0, 5);
    const newStore: CharacterStore = { activeId: id, slots: newSlots };
    persistStore(newStore);
    setState(fresh);
    setIsHome(false);
    setCurrentTab('story');
    showToast(`Watak ${fresh.name} berjaya dicipta di ${campById(campId).name}!`);
  };

  const selectSlot = (id: string) => {
    sound.playTap();
    const slot = store.slots.find((s) => s.id === id);
    if (!slot) return;
    const newStore = { ...store, activeId: id };
    persistStore(newStore);
    setState(slot.state);
    setIsHome(false);
    setCurrentTab('story');
    showToast(`Menyambung perkhidmatan: ${slot.name}`);
  };

  const deleteSlot = (id: string) => {
    sound.playWarning();
    const newSlots = store.slots.filter((s) => s.id !== id);
    const newActiveId = store.activeId === id ? null : store.activeId;
    const newStore: CharacterStore = { activeId: newActiveId, slots: newSlots };
    persistStore(newStore);
    if (newActiveId === null) {
      setState(null);
      setIsHome(true);
    }
    showToast('Watak telah dipadamkan.');
  };

  // Actions
  const rest = () => {
    if (!state || state.retired) return;
    if (state.ap < 1) {
      sound.playWarning();
      showToast('AP tidak mencukupi. Pemulihan memerlukan 1 AP.');
      return;
    }
    sound.playHeal();
    const newS = { ...state };
    newS.ap -= 1;
    newS.health = clamp(newS.health + 30, 0, 100);
    newS.stamina = clamp(newS.stamina + 30, 0, 100);
    newS.lastOutcome = 'Anda berehat di pangkalan. Kesihatan dan stamina pulih sebanyak 30 mata.';
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Pemulihan & Rehat Pangkalan',
      text: `Berehat menggunakan 1 AP. Kesihatan meningkat ke ${newS.health}%, stamina meningkat ke ${newS.stamina}%.`,
    });
    saveState(newS);
    showToast('Pemulihan selesai (+30 HP, +30 Stamina).');
  };

  const checkAutoPromotion = (s: CharacterState): boolean => {
    if (s.retired) return false;
    let changed = false;

    // Recruit to Private auto-promotion at 6 months
    if (s.path === 'llp' && s.rank === 0 && s.months >= 6) {
      s.rank = 1;
      const weighted = s.perf * 0.45 + s.discipline * 0.25 + s.health * 0.2 + s.stamina * 0.1;
      let grade: 'Cemerlang' | 'Baik' | 'Memuaskan' | 'Tahap Asas' = 'Memuaskan';
      if (weighted >= 78) grade = 'Cemerlang';
      else if (weighted >= 64) grade = 'Baik';
      else if (weighted >= 48) grade = 'Memuaskan';
      else grade = 'Tahap Asas';

      const cert: TrainingCertificate = {
        grade,
        desc: `Menamatkan 6 bulan latihan Rekrut dengan gred ${grade}.`,
        issuedAt: dateFromOffset(s.months),
        serviceMonth: s.months,
        performance: s.perf,
        discipline: s.discipline,
        health: s.health,
        stamina: s.stamina,
      };
      s.v8TrainingCertificate = cert;

      // Release held salary!
      if (s.heldSalary > 0) {
        s.money += s.heldSalary;
        s.log.unshift({
          date: dateFromOffset(s.months),
          title: 'Gaji Rekrut Diberikan Penuh',
          text: `Gaji yang ditahan sepanjang 6 bulan latihan sebanyak RM ${s.heldSalary.toLocaleString('en-MY')} dikreditkan ke baki simpanan anda.`,
        });
        s.heldSalary = 0;
      }

      s.medals.push({
        name: 'Pingat Tamat Latihan',
        desc: `Dianugerahkan setelah melengkapkan latihan asas Rekrut dengan gred ${grade}.`,
        date: dateFromOffset(s.months),
      });
      announceAward('KENAIKAN PANGKAT AUTOMATIK', 'Prebet', `Tahniah! Anda dinaikkan ke pangkat Prebet dengan Sijil ${grade}.`);
      changed = true;
    }

    // Other promotions check
    const list = ranks[s.path] || ranks.llp;
    while (s.rank < list.length - 1) {
      const nextR = s.rank + 1;
      const reqM = v8RankMonths[s.path]?.[nextR] ?? nextR * 12;
      const reqXP = v8RankXP[s.path]?.[nextR] ?? 0;
      const reqPerf = v8RankPerf[s.path]?.[nextR] ?? 50;
      const courseKey = `promotion_${nextR}`;

      if (
        s.months >= reqM &&
        s.xp >= reqXP &&
        s.perf >= reqPerf &&
        s.corps &&
        !s.corpsEntry &&
        s.rankCourses?.[courseKey]
      ) {
        s.rank = nextR;
        const newRankName = list[nextR];
        s.perf = clamp(s.perf + 2, 0, 100);
        s.log.unshift({
          date: dateFromOffset(s.months),
          title: 'Kenaikan Pangkat Automatik',
          text: `Semua syarat masa, XP, prestasi dan kursus wajib dipenuhi. Anda kini berpangkat ${newRankName}.`,
        });
        announceAward('KENAIKAN PANGKAT', newRankName, `Anda telah dinaikkan ke pangkat ${newRankName}!`);
        changed = true;
      } else {
        break;
      }
    }

    return changed;
  };

  const advanceMonth = () => {
    if (!state || state.retired) return;
    if (state.monthlyCorpsDue) {
      sound.playWarning();
      showToast('Selesaikan misi kor wajib bulan ini dahulu sebelum menamatkan bulan.');
      return;
    }
    sound.playMarch();
    const newS = { ...state };
    const prevMonth = newS.months;
    newS.months += 1;
    newS.careerMonths += 1;
    newS.age = Math.min(65, newS.startingAge + Math.floor(newS.months / 12));

    // AP restoration
    const apGain = 5 + (newS.isGGK ? 2 : 0);
    newS.ap = Math.min(20, newS.ap + apGain);

    // Gear expiry check
    shopItems.forEach((it) => {
      if (it.type === 'gear' && (newS.inventory[it.id] || 0) > 0) {
        const exp = newS.itemExpiry[it.id];
        if (Number.isFinite(exp) && exp <= newS.months) {
          newS.inventory[it.id] = 0;
          newS.log.unshift({
            date: dateFromOffset(newS.months),
            title: 'Kelengkapan Luput Tempoh',
            text: `${it.name} telah melepasi had hayat penggunaan. Sila perbaharui di Kedai Barang.`,
          });
        }
      }
    });

    // Monthly stamina and performance attrition
    const staminaDrop = 2 + Math.floor(Math.random() * 4);
    const perfDrop = 1 + Math.floor(Math.random() * 3);
    newS.stamina = clamp(newS.stamina - staminaDrop + (hasItem('boots') ? 10 : 0), 0, 100);
    newS.perf = clamp(newS.perf - perfDrop + (hasItem('watch') ? 1 : 0), 0, 100);
    newS.discipline = clamp(
      newS.discipline + (hasItem('bag') ? 1 : 0) + (hasItem('uniform') ? 1 : 0),
      0,
      100
    );

    // Housing benefits
    const house = housingById(newS.housingId);
    newS.health = clamp(newS.health + house.apply.health, 0, 100);
    newS.stamina = clamp(newS.stamina + house.apply.stamina, 0, 100);
    newS.perf = clamp(newS.perf + house.apply.perf, 0, 100);
    newS.discipline = clamp(newS.discipline + house.apply.discipline, 0, 100);

    // Monthly health risk
    const healthLoss = newS.isGGK ? 4 + Math.floor(Math.random() * 5) : 1 + Math.floor(Math.random() * 3);
    newS.health = clamp(newS.health - healthLoss, 0, 100);
    if (newS.health < 35 && Math.random() < 0.3) {
      newS.injuries += 1;
    }

    // Salary processing
    const isRecruitWithholding = newS.path === 'llp' && newS.rank === 0;
    const gross = getRankSalary() + getAllowance();
    newS.lastGrossSalary = gross;
    const regularBill = getMonthlyFees();
    const totalBill = regularBill + newS.feeArrears;

    if (isRecruitWithholding) {
      newS.heldSalary += gross;
      const paid = Math.min(newS.money, totalBill);
      newS.money -= paid;
      newS.feeArrears = Math.max(0, totalBill - paid);
      newS.lastNetSalary = 0;
      newS.payments.unshift({
        month: newS.months,
        gross,
        fee: regularBill,
        paidFee: paid,
        net: 0,
        arrears: newS.feeArrears,
        date: dateFromOffset(prevMonth),
        withheld: true,
        heldBalance: newS.heldSalary,
      });
      newS.log.unshift({
        date: dateFromOffset(prevMonth),
        title: 'Gaji Kasar Rekrut Ditahan',
        text: `Gaji kasar RM ${gross.toLocaleString('en-MY')} ditahan. Yuran dipotong RM ${paid.toLocaleString('en-MY')}. Jumlah gaji terkumpul ditahan: RM ${newS.heldSalary.toLocaleString('en-MY')}.`,
      });
    } else {
      newS.money += gross;
      const paid = Math.min(newS.money, totalBill);
      newS.money -= paid;
      newS.feeArrears = Math.max(0, totalBill - paid);
      const net = gross - paid;
      newS.lastNetSalary = net;
      newS.payments.unshift({
        month: newS.months,
        gross,
        fee: regularBill,
        paidFee: paid,
        net,
        arrears: newS.feeArrears,
        date: dateFromOffset(prevMonth),
      });
      newS.log.unshift({
        date: dateFromOffset(prevMonth),
        title: 'Gaji Bulanan Diproses',
        text: `Gaji kasar RM ${gross.toLocaleString('en-MY')} dikreditkan. Yuran tetap RM ${paid.toLocaleString('en-MY')} ditolak. Baki bersih: RM ${net.toLocaleString('en-MY')}.`,
      });
    }

    // Tick active courses
    if (newS.activeCourse) {
      const c = newS.activeCourse;
      const due = c.monthlyFee + c.monthlyArrears;
      if (newS.money >= due) {
        newS.money -= due;
        c.monthlyArrears = 0;
        c.monthsLeft -= 1;
        if (c.monthsLeft <= 0) {
          if (c.kind === 'promotion' && c.targetIndex) {
            newS.rankCourses[c.id] = true;
            newS.log.unshift({
              date: dateFromOffset(newS.months),
              title: 'Kursus Kenaikan Pangkat Selesai',
              text: `${c.name} telah tamat! Syarat kursus untuk pangkat seterusnya kini selesai.`,
            });
            announceAward('KURSUS SELESAI', c.name, 'Anda telah berjaya menamatkan kursus wajib kenaikan pangkat.');
          } else {
            newS.courses[c.id] = true;
            const def = specialCourses.find((x) => x.id === c.id);
            if (def) {
              newS.xp += def.xp;
              newS.perf = clamp(newS.perf + def.perf, 0, 100);
              newS.discipline = clamp(newS.discipline + def.discipline, 0, 100);
              newS.health = clamp(newS.health + def.health, 0, 100);
            }
            newS.log.unshift({
              date: dateFromOffset(newS.months),
              title: 'Kursus Khas Selesai',
              text: `${c.name} selesai. Anda menerima sijil kelayakan khas dan peningkatan prestasi.`,
            });
            announceAward('SIJIL KURSUS', c.name, 'Tahniah! Anda telah menamatkan kursus khas.');
          }
          newS.activeCourse = null;
        }
      } else {
        c.monthlyArrears = due;
        newS.perf = clamp(newS.perf - 2, 0, 100);
        newS.log.unshift({
          date: dateFromOffset(newS.months),
          title: 'Yuran Kursus Tertunggak',
          text: `Yuran bulanan ${c.name} gagal dibayar. Kursus tertangguh sehingga yuran dijelaskan.`,
        });
      }
    }

    // Tick corps entry course
    if (newS.corpsEntry) {
      const ce = newS.corpsEntry;
      const due = ce.monthlyFee + ce.monthlyArrears;
      if (newS.money >= due) {
        newS.money -= due;
        ce.monthlyArrears = 0;
        ce.monthsLeft -= 1;
        if (ce.monthsLeft <= 0) {
          const corp = corpsById(ce.corpsId);
          newS.corps = ce.corpsId;
          newS.corpsStage = 'assigned';
          newS.corpsEntry = null;
          newS.log.unshift({
            date: dateFromOffset(newS.months),
            title: 'Diserap Rasmi ke Kor',
            text: `Anda telah tamat kursus kemasukan dan kini secara rasmi menjadi anggota ${corp?.name}.`,
          });
          announceAward('PENEMPATAN KOR', corp?.name || '', 'Latihan kemasukan kor selesai dengan jayanya.');
        }
      } else {
        ce.monthlyArrears = due;
        newS.discipline = clamp(newS.discipline - 2, 0, 100);
      }
    }

    // Tick GGK commando course
    if (newS.ggkStage === 'course') {
      const due = newS.ggkMonthlyFee + newS.ggkCourseArrears;
      if (newS.money >= due) {
        newS.money -= due;
        newS.ggkCourseArrears = 0;
        newS.ggkCourseLeft -= 1;
        if (newS.ggkCourseLeft <= 0) {
          newS.isGGK = true;
          newS.corps = 'ggk';
          newS.corpsStage = 'assigned';
          newS.ggkStage = 'joined';
          newS.log.unshift({
            date: dateFromOffset(newS.months),
            title: 'LULUS KURSUS ASAS KOMANDO GGK',
            text: 'Tahniah! Anda telah dianugerahkan Beret Hijau Gerak Khas dan secara rasmi diserap ke KOR UNIT GERAKAN KHAS.',
          });
          announceAward('BERET HIJAU GGK', 'KOR UNIT GERAKAN KHAS', 'Tahniah! Anda kini seorang Komando Rejimen Gerak Khas!');
        }
      } else {
        newS.ggkCourseArrears = due;
      }
    }

    // Tick pending camp transfer
    if (newS.pendingTransfer) {
      const pt = newS.pendingTransfer;
      pt.monthsLeft -= 1;
      if (pt.monthsLeft <= 0) {
        const approved = pt.requiresHighApproval ? Math.random() * 100 < pt.approvalOdds : true;
        if (approved) {
          newS.campId = pt.targetId;
          newS.transferCount += 1;
          newS.log.unshift({
            date: dateFromOffset(newS.months),
            title: 'Permohonan Perpindahan Diluluskan',
            text: `Anda telah dipindahkan secara rasmi ke ${campById(pt.targetId).name}.`,
          });
          showToast(`Perpindahan ke ${campById(pt.targetId).name} diluluskan!`);
        } else {
          const refund = Math.round(pt.cost * 0.6);
          newS.money += refund;
          newS.log.unshift({
            date: dateFromOffset(newS.months),
            title: 'Perpindahan Ditolak',
            text: `Permohonan perpindahan tidak diluluskan oleh pihak atasan. Bayaran dipulangkan 60% (RM ${refund.toLocaleString('en-MY')}).`,
          });
          showToast('Permohonan perpindahan ditolak.');
        }
        newS.pendingTransfer = null;
      }
    }

    // Tick GGK application
    if (newS.ggkApplication) {
      const ga = newS.ggkApplication;
      ga.monthsLeft -= 1;
      if (ga.monthsLeft <= 0) {
        const passed = Math.random() * 100 < ga.odds;
        if (passed) {
          newS.campId = ga.targetId;
          newS.ggkStage = 'march1';
          newS.ggkMarchDistance = 0;
          newS.log.unshift({
            date: dateFromOffset(newS.months),
            title: 'Saringan Awal GGK Lulus',
            text: `Permohonan pemilihan diluluskan. Anda dipindahkan ke ${campById(ga.targetId).name}. Seterusnya: 2 siri Ujian Perjalanan 80 km (160 km total).`,
          });
          showToast('Saringan GGK lulus! Bersedia untuk ujian ketahanan.');
        } else {
          newS.ggkStage = 'failed';
          newS.ggkRetryAt = newS.months + 12;
          newS.money += Math.round(ga.moveCost * 0.6);
          newS.log.unshift({
            date: dateFromOffset(newS.months),
            title: 'Saringan GGK Ditolak',
            text: 'Permohonan pemilihan GGK tidak berjaya kali ini. Anda boleh mencuba semula selepas 12 bulan.',
          });
          showToast('Permohonan GGK tidak terpilih.');
        }
        newS.ggkApplication = null;
      }
    }

    // Check PJM medal for 36 months in GGK
    if (newS.isGGK) {
      newS.ggkServiceMonths += 1;
      if (newS.ggkServiceMonths >= 36 && !newS.ggkPJMAwarded) {
        newS.ggkPJMAwarded = true;
        newS.medals.push({
          name: 'Pingat Jasa Malaysia (simulasi)',
          desc: 'Dianugerahkan atas perkhidmatan cemerlang selama 36 bulan dalam Rejimen Gerak Khas.',
          date: dateFromOffset(newS.months),
        });
        announceAward('PINGAT SIMULASI', 'Pingat Jasa Malaysia', 'Pengiktirafan 36 bulan perkhidmatan GGK.');
      }
    }

    // Trigger mandatory corps mission requirement
    newS.monthlyCorpsDue = !!newS.corps && !newS.retired;

    // Check mandatory retirement age (65)
    if (newS.age >= 65 && !newS.retired) {
      newS.retired = true;
      newS.ending = true;
      newS.endReason = 'Persaraan wajib umur 65 tahun';
      newS.log.unshift({
        date: dateFromOffset(newS.months),
        title: 'Persaraan Wajib 65 Tahun',
        text: 'Anda telah mencapai umur persaraan wajib tentera. Seluruh rekod dan pencapaian anda diabadikan dalam dewan wira.',
      });
      announceAward('PERSARAAN WAJIB', 'Tamat Perkhidmatan', 'Terima kasih atas segala jasa dan bakti kepada nusa dan bangsa.');
    }

    // Automatic promotion check
    checkAutoPromotion(newS);

    // Pick monthly story dilemma
    const storyIdx = (newS.months - 1) % monthlyStoryData.length;
    const story = monthlyStoryData[storyIdx];
    setActiveStory(story);

    // Generate random duty if due
    if (newS.months >= (newS.nextRandomMissionMonth || 999)) {
      const diff = 1 + Math.floor(Math.random() * 4);
      const randM: RandomMission = {
        month: newS.months,
        difficulty: diff,
        title: `Tugasan Sampingan Sektor ${diff}`,
        desc: 'Tugasan mengejut tambahan di luar jadual rutin.',
        lossXP: diff * 2,
        lossPerf: diff,
        lossHealth: diff + 1,
        lossStamina: diff * 2,
        lossDiscipline: diff,
        reward: diff * 45 + 50,
      };
      newS.pendingMonthlyMission = randM;
      newS.nextRandomMissionMonth = newS.months + 2 + Math.floor(Math.random() * 3);
    }

    // Annual Special Government Mission scheduling & trigger (Risikan, Peperangan, Pengganas)
    // Happens once a year in a random month
    const currentYear = Math.floor((newS.months - 1) / 12) + 1;
    if (newS.yearlySpecialMissionYear !== currentYear) {
      newS.yearlySpecialMissionYear = currentYear;
      // Schedule a random month between 1 and 12 of this simulated year
      const yearStartMonth = (currentYear - 1) * 12 + 1;
      const randomMonthOffset = Math.floor(Math.random() * 12);
      newS.yearlySpecialMissionMonth = yearStartMonth + randomMonthOffset;
      newS.activeGovernmentMission = null;
    }

    if (newS.months === newS.yearlySpecialMissionMonth) {
      const alreadyDoneThisYear = (newS.completedGovernmentMissions || []).some(
        (x) => x.year === currentYear
      );
      if (!alreadyDoneThisYear && !newS.activeGovernmentMission) {
        const selected =
          specialGovernmentMissions[
            Math.floor(Math.random() * specialGovernmentMissions.length)
          ];
        newS.activeGovernmentMission = selected;
        sound.playRadioChirp();
        newS.log.unshift({
          date: dateFromOffset(newS.months),
          title: 'ARAHAN OPERASI KHAS KERAJAAN MALAYSIA',
          text: `Tawaran penugasan berprofil tinggi diterima daripada Majlis Keselamatan Negara: "${selected.title}". Semak kelayakan minimum pada Papan Misi sebelum menerima tawaran.`,
        });
        showToast('Arahan Misi Khas Kerajaan Malaysia diterima!');
      }
    } else if (newS.activeGovernmentMission) {
      // If month advances without taking it, the offer expires
      newS.activeGovernmentMission = null;
    }

    newS.scene = 'monthly';
    saveState(newS);
    setCurrentTab('story');
    showToast(`Bulan ${newS.months} bermula (${dateFromOffset(newS.months)}).`);
  };

  const startMission = (id: string) => {
    if (!state || state.retired) return;
    if (state.monthlyCorpsDue) {
      sound.playWarning();
      showToast('Selesaikan misi kor wajib bulan ini dahulu.');
      return;
    }
    if (state.ap < 2) {
      sound.playWarning();
      showToast('AP tidak mencukupi (perlu 2 AP).');
      return;
    }
    const m = missionData.find((x) => x.id === id);
    if (!m) return;

    // Limit secondary missions to once every 3 months
    if (m.type === 'Misi sampingan') {
      const lastMonth = Number.isFinite(state.lastSecondaryMissionMonth)
        ? state.lastSecondaryMissionMonth
        : -99;
      const diff = state.months - lastMonth;
      if (diff < 3) {
        sound.playWarning();
        showToast(
          `Misi sampingan dihadkan 3 bulan sekali. Sila tunggu ${3 - diff} bulan lagi.`
        );
        return;
      }
    }

    // Limit primary missions to once a month
    if (m.type === 'Misi utama') {
      if (state.lastPrimaryMissionMonth === state.months) {
        sound.playWarning();
        showToast(
          'Misi utama dihadkan 1 kali sebulan. Telah dilaksanakan bulan ini; buka semula bulan depan.'
        );
        return;
      }
    }

    sound.playRadioChirp();
    setActiveMission(m);
  };

  const resolveMission = (choice: MissionChoice) => {
    if (!state || !activeMission) return;
    const newS = { ...state };
    newS.ap -= 2;

    const baseSuccess = [0.95, 0.8, 0.65, 0.45][activeMission.risk] || 0.7;
    const pass = Math.random() < baseSuccess;

    let xp = choice.xp;
    let perf = choice.perf;
    let disc = choice.discipline || 0;
    let health = choice.health || 0;
    let money = choice.money || 0;
    let outcome = choice.out;

    if (pass) {
      sound.playAction();
      if (money > 0) sound.playCash();
      if (choice.award) {
        newS.medals.push({
          name: choice.award,
          desc: `Diterima dalam misi ${activeMission.name}.`,
          date: dateFromOffset(newS.months),
        });
      }
    } else {
      sound.playWarning();
      xp = Math.max(1, Math.round(xp * 0.35));
      perf = Math.min(-1, perf - 2);
      disc = Math.min(-1, disc - 2);
      health = Math.min(-5, health - 6);
      money = Math.round(money * 0.3);
      outcome = `${choice.out} Namun, komplikasi cuaca dan kekeliruan medan melambatkan pergerakan. Hasil tidak sempurna.`;
    }

    // Track mission frequency timestamps
    if (activeMission.type === 'Misi sampingan') {
      newS.lastSecondaryMissionMonth = newS.months;
    } else if (activeMission.type === 'Misi utama') {
      newS.lastPrimaryMissionMonth = newS.months;
    }

    newS.xp += xp;
    newS.perf = clamp(newS.perf + perf, 0, 100);
    newS.discipline = clamp(newS.discipline + disc, 0, 100);
    newS.health = clamp(newS.health + health, 0, 100);
    newS.stamina = clamp(newS.stamina - 15, 0, 100);
    newS.money += money;
    newS.missions[activeMission.id] = (newS.missions[activeMission.id] || 0) + 1;
    newS.lastOutcome = outcome;

    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: `Misi: ${activeMission.name}`,
      text: outcome,
    });

    checkAutoPromotion(newS);
    setActiveMission(null);
    saveState(newS);
    showToast(pass ? 'Misi berjaya diselesaikan!' : 'Misi selesai dengan komplikasi medan.');
  };

  const resolveGovernmentMission = (choice: SpecialGovernmentMissionChoice) => {
    if (!state || !state.activeGovernmentMission) return;
    const govMission = state.activeGovernmentMission;
    const newS = { ...state };
    newS.ap = Math.max(0, newS.ap - 2);

    const pass = Math.random() < 0.62 + choice.chance;
    const outcomeText = pass ? choice.outWin : choice.outFail;

    if (pass) {
      sound.playFanfare();
    } else {
      sound.playWarning();
    }

    // Health reduction & stamina drop
    newS.health = clamp(newS.health - choice.healthLoss, 0, 100);
    newS.stamina = clamp(newS.stamina - choice.staminaLoss, 0, 100);

    // Injury risk trigger
    if (choice.isInjuryRisk || !pass || newS.health < 40) {
      newS.injuries += 1;
    }

    // Monetary bonus for completing the high-profile special mission
    newS.money += govMission.bonusMoney;
    newS.xp += pass ? govMission.bonusXP : Math.round(govMission.bonusXP * 0.6);
    newS.perf = clamp(newS.perf + (pass ? choice.perf : 1), 0, 100);
    newS.discipline = clamp(newS.discipline + (pass ? 3 : 1), 0, 100);

    // High profile Medal from the Government of Malaysia
    const medalDate = dateFromOffset(newS.months);
    if (!newS.medals.some((m) => m.name === govMission.medalName)) {
      newS.medals.unshift({
        name: govMission.medalName,
        desc: govMission.medalDesc,
        date: medalDate,
      });
    }

    const currentYear = Math.floor((newS.months - 1) / 12) + 1;
    newS.completedGovernmentMissions = [
      ...(newS.completedGovernmentMissions || []),
      { year: currentYear, missionId: govMission.id, date: medalDate },
    ];

    newS.lastOutcome = `MISI KHAS KERAJAAN MALAYSIA SELESAI: ${outcomeText}\n\nKerajaan Malaysia mengurniakan "${govMission.medalName}" berserta Bonus Khas RM ${govMission.bonusMoney.toLocaleString('en-MY')} dan +${govMission.bonusXP} XP.`;

    newS.log.unshift({
      date: medalDate,
      title: `Tamat: ${govMission.title}`,
      text: `${outcomeText} Kerajaan Malaysia mengurniakan "${govMission.medalName}" dan bonus tunai RM ${govMission.bonusMoney.toLocaleString('en-MY')}. Kesihatan -${choice.healthLoss}%, Stamina -${choice.staminaLoss}%.`,
    });

    announceAward(
      'PENGHARGAAN KERAJAAN MALAYSIA',
      govMission.medalName,
      `Misi berprofil tinggi selesai! Anda menerima bonus RM ${govMission.bonusMoney.toLocaleString('en-MY')} dan Pingat Kehormat Kebangsaan.`
    );

    newS.activeGovernmentMission = null;
    setActiveGovMissionBriefing(null);
    checkAutoPromotion(newS);
    saveState(newS);
    showToast(`Misi Khas Kerajaan Selesai! Bonus RM ${govMission.bonusMoney.toLocaleString('en-MY')} dikreditkan.`);
  };

  const declineGovernmentMission = () => {
    if (!state) return;
    sound.playTap();
    const newS = { ...state };
    newS.activeGovernmentMission = null;
    setActiveGovMissionBriefing(null);
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Tawaran Misi Khas Ditolak',
      text: 'Anda membuat pertimbangan berhemah untuk tidak mengambil risiko misi berprofil tinggi pada tahun ini.',
    });
    saveState(newS);
    showToast('Tawaran misi khas ditolak.');
  };

  const startCorpsMission = () => {
    if (!state || !state.corps) return;
    sound.playRadioChirp();
    setCurrentTab('story');
  };

  const resolveCorpsMission = (choice: CorpsMissionDefChoice, isOptional: boolean = false) => {
    if (!state) return;
    const newS = { ...state };
    if (!choice.noAP) {
      newS.ap = Math.max(0, newS.ap - 2);
    }
    const pass = !choice.noAP && Math.random() < 0.55 + choice.chance;
    const out = pass ? choice.textWin : choice.textFail;

    if (pass) {
      sound.playAction();
      sound.playCash();
    } else {
      sound.playWarning();
    }

    newS.xp += pass ? choice.xp : Math.round(choice.xp * 0.4);
    newS.perf = clamp(newS.perf + (pass ? choice.perf : -2), 0, 100);
    newS.discipline = clamp(newS.discipline + (pass ? choice.disc : -1), 0, 100);
    newS.health = clamp(newS.health - (pass ? 3 : choice.loss), 0, 100);
    newS.stamina = clamp(newS.stamina - 12, 0, 100);
    newS.money += pass ? choice.money : Math.round(choice.money * 0.25);
    newS.lastOutcome = out;

    if (isOptional) {
      newS.ggkOptionalUsedMonth = newS.months;
    } else {
      newS.monthlyCorpsDue = false;
      newS.corpsMissions[newS.months] = {
        id: newS.corps || 'general',
        success: pass,
        choice: choice.label,
      };
    }

    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: isOptional ? 'Misi Pilihan GGK' : 'Misi Kor Wajib Bulanan',
      text: out,
    });

    checkAutoPromotion(newS);
    saveState(newS);
    showToast(pass ? 'Misi kor selesai dengan jayanya!' : 'Misi kor selesai dengan komplikasi.');
  };

  const startGGKOptional = () => {
    if (!state || !state.isGGK) return;
    if (state.ggkOptionalUsedMonth === state.months) {
      sound.playWarning();
      showToast('Misi pilihan GGK bulan ini sudah digunakan.');
      return;
    }
    sound.playRadioChirp();
    setCurrentTab('story');
  };

  const resolveMonthlyStory = (choice: MonthlyStoryChoice) => {
    if (!state || !activeStory) return;
    sound.playTap();
    const newS = { ...state };
    newS.xp += choice.xp;
    newS.perf = clamp(newS.perf + choice.perf, 0, 100);
    newS.discipline = clamp(newS.discipline + choice.discipline, 0, 100);
    if (choice.health) newS.health = clamp(newS.health + choice.health, 0, 100);
    if (choice.money) newS.money += choice.money;
    newS.lastOutcome = choice.out;

    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: `Kawad & Lapor Diri: ${activeStory.name}`,
      text: choice.out,
    });

    checkAutoPromotion(newS);
    setActiveStory(null);
    newS.scene = 'unit';
    saveState(newS);
  };

  const buyItem = (id: string) => {
    if (!state) return;
    const it = shopItems.find((x) => x.id === id);
    if (!it) return;
    if (state.money < it.price) {
      sound.playWarning();
      showToast('Baki wang tidak mencukupi.');
      return;
    }
    sound.playCash();
    const newS = { ...state };
    newS.money -= it.price;
    newS.inventory[id] = (newS.inventory[id] || 0) + 1;
    if (it.type === 'gear' && it.lifeMonths) {
      newS.itemExpiry[id] = newS.months + it.lifeMonths;
    }
    if (it.restockEvery) {
      newS.specialItemLastBought[id] = newS.months;
    }
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Pembelian Kelengkapan',
      text: `Membeli ${it.name} dengan harga RM ${it.price.toLocaleString('en-MY')}.`,
    });
    saveState(newS);
    showToast(`${it.name} berjaya dibeli.`);
  };

  const useItem = (id: string) => {
    if (!state) return;
    const qty = state.inventory[id] || 0;
    if (qty <= 0) return;
    const newS = { ...state };
    newS.inventory[id] -= 1;

    if (id === 'recovery') {
      sound.playHeal();
      newS.health = clamp(newS.health + 30, 0, 100);
      newS.stamina = clamp(newS.stamina + 30, 0, 100);
      showToast('Kit pemulihan digunakan (+30 HP, +30 Stamina).');
    } else if (id === 'medpouch') {
      sound.playHeal();
      newS.health = clamp(newS.health + 20, 0, 100);
      newS.stamina = clamp(newS.stamina + 10, 0, 100);
      showToast('Pek perubatan digunakan (+20 HP, +10 Stamina).');
    } else if (id === 'meal') {
      sound.playTap();
      newS.stamina = clamp(newS.stamina + 20, 0, 100);
      newS.health = clamp(newS.health + 3, 0, 100);
      showToast('Ransum tempur dimakan (+20 Stamina).');
    } else if (id === 'book') {
      sound.playTap();
      newS.xp += 15;
      newS.perf = clamp(newS.perf + 3, 0, 100);
      showToast('Buku doktrin dipelajari (+15 XP, +3 Prestasi).');
    }

    saveState(newS);
  };

  const enrolCourse = (id: string) => {
    if (!state || state.activeCourse || state.corpsEntry) {
      sound.playWarning();
      showToast('Hanya satu kursus boleh berjalan pada satu-satu masa.');
      return;
    }
    const c = specialCourses.find((x) => x.id === id);
    if (!c) return;
    if (state.money < c.fee) {
      sound.playWarning();
      showToast(`Wang tidak mencukupi untuk yuran pendaftaran (RM ${c.fee}).`);
      return;
    }
    if (state.ap < 2) {
      sound.playWarning();
      showToast('Perlu 2 AP untuk pendaftaran kursus.');
      return;
    }
    sound.playCash();
    const newS = { ...state };
    newS.money -= c.fee;
    newS.ap -= 2;
    newS.activeCourse = {
      kind: 'special',
      id: c.id,
      name: c.name,
      durationMonths: c.durationMonths,
      monthsLeft: c.durationMonths,
      startedAt: newS.months,
      fee: c.fee,
      monthlyFee: c.monthlyFee,
      monthlyArrears: 0,
    };
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Pendaftaran Kursus Khas',
      text: `Mendaftar ${c.name}. Yuran pendaftaran RM ${c.fee} dibayar. Tempoh: ${c.durationMonths} bulan.`,
    });
    saveState(newS);
    showToast(`Pendaftaran ${c.name} berjaya.`);
  };

  const startRankCourse = () => {
    if (!state || state.activeCourse || state.corpsEntry) {
      sound.playWarning();
      showToast('Satu kursus sahaja boleh berjalan pada satu masa.');
      return;
    }
    const target = state.rank + 1;
    const targetName = (ranks[state.path] || ranks.llp)[target];
    if (!targetName) return;

    const fee = 600 + target * 250;
    const monthlyFee = 160 + target * 85;
    const xpCost = 8 + target * 5;
    const staminaCost = 15 + target * 4;
    const duration = 2 + Math.floor(Math.max(0, target - 2) / 2);

    if (state.money < fee || state.xp < xpCost || state.stamina < staminaCost || state.ap < 2) {
      sound.playWarning();
      showToast('Sumber tidak mencukupi untuk memulakan kursus kenaikan pangkat.');
      return;
    }

    sound.playCash();
    const newS = { ...state };
    newS.money -= fee;
    newS.xp -= xpCost;
    newS.stamina -= staminaCost;
    newS.ap -= 2;
    newS.activeCourse = {
      kind: 'promotion',
      id: `promotion_${target}`,
      targetIndex: target,
      name: `Kursus Kelayakan ${targetName}`,
      rankName: targetName,
      durationMonths: duration,
      monthsLeft: duration,
      startedAt: newS.months,
      fee,
      monthlyFee,
      monthlyArrears: 0,
    };
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Kursus Kenaikan Pangkat Bermula',
      text: `Memulakan Kursus Kelayakan ${targetName}. Yuran RM ${fee}, XP -${xpCost}, Stamina -${staminaCost}%.`,
    });
    saveState(newS);
    showToast(`Kursus Kelayakan ${targetName} bermula.`);
  };

  const setCorpsChoice = (id: string) => {
    if (!state || state.corps) return;
    sound.playTap();
    const newS = { ...state };
    newS.corpsTarget = id;
    newS.corpsStage = 'test';
    newS.corpsTestTries = 0;
    saveState(newS);
    showToast(`Kor sasaran ditetapkan: ${corpsById(id)?.name}`);
  };

  const startCorpsTest = () => {
    if (!state || state.corps || !state.corpsTarget) return;
    if (state.ap < 1) {
      sound.playWarning();
      showToast('Ujian kelayakan memerlukan 1 AP.');
      return;
    }
    const newS = { ...state };
    newS.ap -= 1;
    newS.corpsTestTries += 1;

    const chance = clamp(0.5 + (newS.perf - 50) / 200 + (newS.discipline - 50) / 250, 0.3, 0.85);
    const pass = Math.random() < chance;

    if (pass) {
      sound.playFanfare();
      newS.corpsStage = 'course-ready';
      newS.lastOutcome = `LULUS Ujian Kelayakan ${corpsById(newS.corpsTarget)?.name}! Anda layak mendaftar kursus kemasukan rasmi.`;
      newS.log.unshift({
        date: dateFromOffset(newS.months),
        title: 'Ujian Kelayakan Kor Lulus',
        text: `Lulus ujian saringan untuk ${corpsById(newS.corpsTarget)?.name}. Seterusnya: Kursus Kemasukan Kor.`,
      });
      showToast('Tahniah! Anda lulus ujian kelayakan kor.');
    } else {
      sound.playWarning();
      newS.health = clamp(newS.health - 6, 0, 100);
      newS.stamina = clamp(newS.stamina - 15, 0, 100);
      newS.lastOutcome = 'Ujian kelayakan kor gagal kali ini. Tingkatkan kecergasan dan cuba lagi.';
      newS.log.unshift({
        date: dateFromOffset(newS.months),
        title: 'Ujian Kelayakan Kor Gagal',
        text: `Percubaan ke-${newS.corpsTestTries} untuk ${corpsById(newS.corpsTarget)?.name} belum berjaya.`,
      });
      showToast('Ujian belum lulus. Pulihkan stamina dan cuba lagi.');
    }
    saveState(newS);
  };

  const startCorpsEntryCourse = () => {
    if (!state || state.corpsStage !== 'course-ready' || !state.corpsTarget) return;
    const c = corpsById(state.corpsTarget);
    if (!c) return;
    if (state.money < c.entryFee) {
      sound.playWarning();
      showToast(`Wang tidak mencukupi untuk yuran pendaftaran (RM ${c.entryFee}).`);
      return;
    }
    if (state.ap < 2) {
      sound.playWarning();
      showToast('Perlu 2 AP untuk pendaftaran kursus kemasukan.');
      return;
    }
    sound.playCash();
    const newS = { ...state };
    newS.money -= c.entryFee;
    newS.ap -= 2;
    newS.corpsStage = 'entry-course';
    newS.corpsEntry = {
      corpsId: c.id,
      name: `Kursus Kemasukan ${c.short}`,
      monthsLeft: c.duration,
      totalMonths: c.duration,
      monthlyFee: c.entryMonthlyFee,
      monthlyArrears: 0,
      registrationFee: c.entryFee,
      startedAt: newS.months,
    };
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Kursus Kemasukan Kor Bermula',
      text: `Mendaftar Kursus Kemasukan ${c.name}. Yuran pendaftaran RM ${c.entryFee} dijelaskan.`,
    });
    saveState(newS);
    showToast(`Kursus Kemasukan ${c.name} bermula.`);
  };

  const applyGGK = () => {
    if (!state || state.isGGK || state.months < 36) {
      sound.playWarning();
      showToast('GGK hanya dibuka selepas 3 tahun perkhidmatan (36 bulan).');
      return;
    }
    if (state.health < 65 || state.stamina < 75 || state.discipline < 70 || state.perf < 65) {
      sound.playWarning();
      showToast('Syarat kecergasan dan disiplin GGK belum dipenuhi.');
      return;
    }
    const ggkCamps = campData.filter((c) => c.hasGGK);
    const target = ggkCamps[Math.floor(Math.random() * ggkCamps.length)];
    const moveCost = transferCost(state.campId, target.id);
    const adminFee = 1800;

    if (state.money < moveCost + adminFee || state.ap < 3) {
      sound.playWarning();
      showToast('Wang atau AP tidak mencukupi untuk permohonan GGK.');
      return;
    }

    sound.playCash();
    const newS = { ...state };
    newS.money -= moveCost + adminFee;
    newS.ap -= 3;
    newS.ggkStage = 'applying';
    newS.ggkApplication = {
      targetId: target.id,
      monthsLeft: 2,
      moveCost,
      adminFee,
      odds: clamp(55 + Math.round((newS.discipline - 70) * 0.5), 45, 85),
      startedAt: newS.months,
    };
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Permohonan Pemilihan GGK Dihantar',
      text: `Permohonan pemilihan Gerak Khas dihantar untuk pemprosesan ke ${target.name}.`,
    });
    saveState(newS);
    showToast('Permohonan pemilihan GGK sedang diproses.');
  };

  const runGGKMarch = () => {
    if (!state || (state.ggkStage !== 'march1' && state.ggkStage !== 'march2')) return;
    if (state.ap < 3 || state.stamina < 70 || state.health < 60) {
      sound.playWarning();
      showToast('Stamina minimum 70%, Kesihatan 60% dan 3 AP diperlukan untuk ujian perjalanan 80 km.');
      return;
    }
    sound.playMarch();
    const newS = { ...state };
    newS.ap -= 3;
    newS.stamina = clamp(newS.stamina - 45, 0, 100);
    newS.health = clamp(newS.health - 12, 0, 100);

    const chance = clamp(0.55 + (newS.stamina - 70) / 160 + (newS.health - 60) / 240, 0.35, 0.88);
    const pass = Math.random() < chance;

    if (pass) {
      sound.playFanfare();
      newS.ggkMarchDistance += 80;
      if (newS.ggkStage === 'march1') {
        newS.ggkStage = 'march2';
        newS.lastOutcome = 'LULUS Ujian Perjalanan 80 km Pertama! Bersedia untuk fasa 80 km kedua.';
        showToast('Lulus Fasa 80 km Pertama! (80/160 km)');
      } else {
        newS.ggkStage = 'course';
        newS.ggkCourseLeft = 6;
        newS.lastOutcome = 'LULUS Ujian 160 km Penuh! Anda diterima masuk ke Kursus Asas Komando 6 Bulan.';
        showToast('LULUS 160 km! Diterima ke Kursus Asas Komando.');
      }
    } else {
      sound.playWarning();
      newS.ggkStage = 'failed';
      newS.ggkRetryAt = newS.months + 12;
      newS.lastOutcome = 'Ujian perjalanan 80 km gagal akibat keletihan melampau. Anda perlu pulih dan cuba lagi selepas 12 bulan.';
      showToast('Ujian ketahanan gagal.');
    }
    saveState(newS);
  };

  const changeHousing = (id: HousingId) => {
    if (!state || state.retired) return;
    if (id !== 'barracks' && state.rank < 3) {
      sound.playWarning();
      showToast('Sewa luar kem hanya dibuka selepas mencapai pangkat Koperal.');
      return;
    }
    sound.playTap();
    const h = housingById(id);
    const newS = { ...state };
    newS.housingId = id;
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Pertukaran Kediaman',
      text: `Menukar kediaman kepada ${h.name}. Sewa RM ${h.rent}/bulan bermula bulan depan.`,
    });
    saveState(newS);
    showToast(`Kediaman ditukar kepada ${h.name}.`);
  };

  const requestTransfer = (targetId: string) => {
    if (!state || state.retired) return;
    if (state.months < 36) {
      sound.playWarning();
      showToast('Perpindahan kem hanya dibuka selepas 3 tahun perkhidmatan (36 bulan).');
      return;
    }
    if (targetId === state.campId) {
      showToast('Pilih kem yang berbeza.');
      return;
    }
    const cost = transferCost(state.campId, targetId);
    if (state.money < cost) {
      sound.playWarning();
      showToast(`Wang tidak mencukupi untuk kos perpindahan (RM ${cost.toLocaleString('en-MY')}).`);
      return;
    }
    sound.playCash();
    const newS = { ...state };
    newS.money -= cost;
    newS.pendingTransfer = {
      targetId,
      cost,
      monthsLeft: 2,
      processingMonths: 2,
      approvalOdds: newS.transferApprovalOdds,
      requiresHighApproval: true,
      requestedAt: newS.months,
      year: Math.floor(newS.months / 12),
    };
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Permohonan Perpindahan Kem',
      text: `Permohonan perpindahan ke ${campById(targetId).name} dihantar dengan kos RM ${cost.toLocaleString('en-MY')}.`,
    });
    saveState(newS);
    showToast(`Permohonan perpindahan ke ${campById(targetId).name} dihantar.`);
  };

  const voluntaryRetire = () => {
    if (!state || state.retired) return;
    if (state.months < 252) {
      sound.playWarning();
      showToast('Persaraan sukarela hanya layak selepas 21 tahun perkhidmatan (252 bulan).');
      return;
    }
    sound.playFanfare();
    const newS = { ...state };
    newS.retired = true;
    newS.ending = true;
    newS.endReason = 'Persaraan sukarela 21 tahun';
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Persaraan Sukarela 21 Tahun',
      text: `Anda memilih bersara dengan penuh penghormatan selepas ${Math.floor(newS.months / 12)} tahun perkhidmatan setia.`,
    });
    announceAward('PERSARAAN GEMILANG', getRankName(), 'Tahniah atas persaraan terhormat setelah 21 tahun perkhidmatan!');
    saveState(newS);
  };

  const returnToService = () => {
    if (!state || !state.retired || state.endReason !== 'Persaraan sukarela 21 tahun' || state.age >= 60) {
      sound.playWarning();
      showToast('Anda tidak layak memohon kembali berkhidmat.');
      return;
    }
    sound.playMarch();
    const newS = { ...state };
    newS.retired = false;
    newS.ending = false;
    newS.endReason = null;
    newS.log.unshift({
      date: dateFromOffset(newS.months),
      title: 'Kembali Berkhidmat',
      text: 'Permohonan menyambung semula perkhidmatan pada pangkat terakhir diluluskan.',
    });
    saveState(newS);
    showToast('Anda kembali aktif berkhidmat!');
  };

  return (
    <GameContext.Provider
      value={{
        state,
        store,
        language,
        setLanguage,
        soundMuted,
        toggleMute,
        sfxVolume,
        setSfxVolume,
        ambientActive,
        toggleAmbient,
        ambientVolume,
        setAmbientVolume,
        currentTab,
        setCurrentTab,
        isHome,
        setIsHome,
        toastMsg,
        showToast,
        awardQueue,
        currentAward,
        dismissAward,
        tutorialOpen,
        setTutorialOpen,
        settingsOpen,
        setSettingsOpen,
        activeMission,
        activeStory,
        activeGovMissionBriefing,
        setActiveGovMissionBriefing,
        resolveGovernmentMission,
        declineGovernmentMission,
        checkGovernmentMissionEligibility,
        canDoSecondaryMission,
        canDoPrimaryMission,
        startNewGame,
        selectSlot,
        deleteSlot,
        advanceMonth,
        rest,
        startMission,
        resolveMission,
        startCorpsMission,
        resolveCorpsMission,
        startGGKOptional,
        resolveMonthlyStory,
        buyItem,
        useItem,
        enrolCourse,
        startRankCourse,
        setCorpsChoice,
        startCorpsTest,
        startCorpsEntryCourse,
        applyGGK,
        runGGKMarch,
        changeHousing,
        requestTransfer,
        voluntaryRetire,
        returnToService,
        getRankName,
        getNextRankName,
        getRankEligibility,
        getMonthlyFees,
        getTotalPay,
        hasItem,
        getCampName,
        getCorpsName,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
