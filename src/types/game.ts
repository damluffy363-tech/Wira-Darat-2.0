export type CareerPath = 'llp' | 'pegawai';

export type HousingId = 'barracks' | 'terrace' | 'apartment' | 'condo';

export interface HousingOption {
  id: HousingId;
  name: string;
  nameEn: string;
  rent: number;
  bonus: string;
  bonusEn: string;
  desc: string;
  descEn: string;
  apply: {
    health: number;
    stamina: number;
    perf: number;
    discipline: number;
  };
}

export interface Camp {
  id: string;
  name: string;
  city: string;
  state: string;
  role: string;
  roleEn: string;
  lat: number;
  lon: number;
  hasGGK?: boolean;
  corpsIds?: string[];
}

export interface Corps {
  id: string;
  name: string;
  short: string;
  category: 'Tempur' | 'Bantuan Tempur' | 'Bantuan Perkhidmatan' | 'Unit Khas';
  categoryEn: string;
  desc: string;
  descEn: string;
  risk: number; // 1 to 5
  allowance: number;
  fee: number;
  entryFee: number;
  entryMonthlyFee: number;
  duration: number; // months
}

export interface ShopItem {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  type: 'gear' | 'consumable';
  lifeMonths?: number;
  restockEvery?: number;
  desc: string;
  descEn: string;
  effect: string;
  effectEn: string;
}

export interface SpecialCourse {
  id: string;
  name: string;
  nameEn: string;
  fee: number;
  monthlyFee: number;
  min: number; // min rank index
  durationMonths: number;
  desc: string;
  descEn: string;
  xp: number;
  perf: number;
  discipline: number;
  health: number;
  award: string;
}

export interface MissionChoice {
  label: string;
  labelEn?: string;
  tone: string;
  toneEn?: string;
  out: string;
  outEn?: string;
  xp: number;
  perf: number;
  discipline?: number;
  health?: number;
  money?: number;
  award?: string;
  special?: boolean;
}

export interface Mission {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  typeEn: string;
  min: number;
  xp: number;
  risk: number; // 0: very low, 1: low, 2: med, 3: high
  desc: string;
  descEn: string;
  choices: MissionChoice[];
}

export interface MonthlyStoryChoice {
  label: string;
  labelEn?: string;
  tone: string;
  toneEn?: string;
  out: string;
  outEn?: string;
  xp: number;
  perf: number;
  discipline: number;
  health?: number;
  money?: number;
  award?: string;
  __randomMission?: boolean;
}

export interface MonthlyStory {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  descEn: string;
  choices: MonthlyStoryChoice[];
}

export interface CorpsMissionDefChoice {
  label: string;
  labelEn?: string;
  tone: string;
  toneEn?: string;
  chance: number;
  textWin: string;
  textWinEn?: string;
  textFail: string;
  textFailEn?: string;
  xp: number;
  perf: number;
  disc: number;
  money: number;
  loss: number;
  noAP?: boolean;
}

export interface CorpsMissionDef {
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  choices: CorpsMissionDefChoice[];
}

export interface PaymentRecord {
  month: number;
  gross: number;
  fee: number;
  paidFee: number;
  net: number;
  arrears: number;
  date: string;
  withheld?: boolean;
  heldBalance?: number;
}

export interface LogEntry {
  date: string;
  title: string;
  text: string;
}

export interface AwardItem {
  name: string;
  desc: string;
  date: string;
}

export interface RandomMission {
  month: number;
  difficulty: number;
  title: string;
  desc: string;
  lossXP: number;
  lossPerf: number;
  lossHealth: number;
  lossStamina: number;
  lossDiscipline: number;
  reward: number;
}

export interface SpecialGovernmentMissionChoice {
  label: string;
  labelEn?: string;
  desc?: string;
  descEn?: string;
  tone: string;
  toneEn?: string;
  chance: number;
  outWin: string;
  outWinEn?: string;
  outFail: string;
  outFailEn?: string;
  xp: number;
  perf: number;
  healthLoss: number;
  staminaLoss: number;
  isInjuryRisk?: boolean;
}

export interface SpecialGovernmentMission {
  id: string;
  type: 'risikan' | 'peperangan' | 'pengganas';
  title: string;
  titleEn: string;
  subtitle: string;
  desc: string;
  descEn: string;
  minRank: number;
  minHealth: number;
  minStamina: number;
  minDiscipline: number;
  minPerf: number;
  bonusMoney: number;
  bonusXP: number;
  medalName: string;
  medalDesc: string;
  choices: SpecialGovernmentMissionChoice[];
}

export interface TrainingCertificate {
  grade: 'Cemerlang' | 'Baik' | 'Memuaskan' | 'Tahap Asas';
  desc: string;
  issuedAt: string;
  serviceMonth: number;
  performance: number;
  discipline: number;
  health: number;
  stamina: number;
}

export interface CharacterState {
  version: number;
  name: string;
  path: CareerPath;
  rank: number;
  xp: number;
  months: number;
  careerMonths: number;
  age: number;
  startingAge: number;
  perf: number;
  discipline: number;
  health: number;
  stamina: number;
  money: number;
  ap: number;
  apMax: number;
  heldSalary: number;
  feeArrears: number;
  lastMonthlyFee: number;
  lastGrossSalary: number;
  lastNetSalary: number;
  lastSalary: number;
  lastSalaryMonth: number;
  payMonth: number;
  lastPaidMonth: number;
  payments: PaymentRecord[];
  inventory: Record<string, number>;
  itemExpiry: Record<string, number>;
  specialItemLastBought: Record<string, number>;
  courses: Record<string, boolean>;
  activeCourse: {
    kind: 'special' | 'promotion';
    id: string;
    targetIndex?: number;
    name: string;
    rankName?: string;
    durationMonths: number;
    monthsLeft: number;
    totalMonths?: number;
    startedAt: number;
    fee: number;
    monthlyFee: number;
    monthlyArrears: number;
    xpCost?: number;
    staminaCost?: number;
    apCost?: number;
  } | null;
  rankCourses: Record<string, boolean>;
  courseFeeArrears: number;
  courseHistory: Array<{
    id: string;
    startedAt: number;
    registrationFee: number;
    monthlyFee: number;
  }>;
  campId: string;
  transferCount: number;
  pendingTransfer: {
    targetId: string;
    cost: number;
    monthsLeft: number;
    processingMonths: number;
    approvalOdds: number;
    requiresHighApproval: boolean;
    requestedAt: number;
    year: number;
  } | null;
  lastTransferAttemptYear: number;
  lastTransferMonth: number;
  transferOddsYearIndex: number;
  transferApprovalOdds: number;
  housingId: HousingId;
  lastHousingBonusMonth: number;
  housingHistory: Array<{
    date: string;
    housingId: string;
    name: string;
    rent: number;
  }>;
  corps: string | null;
  corpsTarget: string | null;
  corpsStage: 'test' | 'course-ready' | 'entry-course' | 'assigned' | 'reassignment';
  corpsTestTries: number;
  corpsRetryAfter: number;
  corpsEntry: {
    corpsId: string;
    name: string;
    monthsLeft: number;
    totalMonths: number;
    monthlyFee: number;
    monthlyArrears: number;
    registrationFee: number;
    startedAt: number;
  } | null;
  corpsHistory: Array<{
    date: string;
    title: string;
    choice: string;
    result?: string;
    outcome?: string;
  }>;
  corpsMissions: Record<number, { id: string; success: boolean; choice: string }>;
  monthlyCorpsDue: boolean;
  currentCorpsMission?: { id: string; month: number } | null;
  ggkStage: 'locked' | 'applying' | 'march1' | 'march2' | 'course' | 'joined' | 'failed';
  ggkApplication: {
    targetId: string;
    monthsLeft: number;
    moveCost: number;
    adminFee: number;
    odds: number;
    startedAt: number;
  } | null;
  ggkRetryAt: number;
  ggkCourseLeft: number;
  ggkCourseMonths?: number;
  ggkCourseArrears: number;
  ggkMonthlyFee: number;
  ggkServiceMonths: number;
  ggkPJMAwarded: boolean;
  isGGK: boolean;
  preGGKCorps: string | null;
  preGGKCampId: string | null;
  ggkMarchDistance: number;
  ggkOptionalUsedMonth: number;
  currentGGKOptional?: CorpsMissionDefChoice | null;
  missions: Record<string, number>;
  log: LogEntry[];
  medals: AwardItem[];
  titles: AwardItem[];
  special: boolean;
  injuries: number;
  failedPromotions: number;
  conflictsSeen: number;
  conflictHistory: Array<{
    month: number;
    title: string;
    choice: string;
    outcome: string;
    date: string;
  }>;
  scene: string;
  ending: boolean;
  retired: boolean;
  retirementDue: boolean;
  endReason: string | null;
  annualStoryYear: number;
  annualStoryDeck: number[];
  lastOutcome: string;
  nextBranchNarrative: string;
  created: string;
  v8WelcomePending?: boolean;
  v8TrainingCertificate?: TrainingCertificate | null;
  nextRandomMissionMonth?: number;
  pendingMonthlyMission?: RandomMission | null;
  randomMissionHistory?: Array<{
    month: number;
    title: string;
    difficulty: number;
    reward: number;
  }>;
  v91TutorialPending?: boolean;
  v91TutorialSeen?: boolean;
  lastSecondaryMissionMonth: number;
  lastPrimaryMissionMonth: number;
  yearlySpecialMissionMonth: number;
  yearlySpecialMissionYear: number;
  activeGovernmentMission?: SpecialGovernmentMission | null;
  completedGovernmentMissions?: Array<{ year: number; missionId: string; date: string }>;
}

export interface CharacterSlot {
  id: string;
  name: string;
  created: string;
  updated: string;
  state: CharacterState;
}

export interface CharacterStore {
  activeId: string | null;
  slots: CharacterSlot[];
}
