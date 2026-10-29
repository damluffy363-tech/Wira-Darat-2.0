import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopBar } from './components/TopBar';
import { GlobalPlayerBar } from './components/GlobalPlayerBar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { StoryTab } from './components/StoryTab';
import { ProfileTab } from './components/ProfileTab';
import { CareerTab } from './components/CareerTab';
import { ShopTab } from './components/ShopTab';
import { CoursesTab } from './components/CoursesTab';
import { CorpsTab } from './components/CorpsTab';
import { PostingTab } from './components/PostingTab';
import { AwardsTab } from './components/AwardsTab';
import { TutorialModal } from './components/TutorialModal';
import { SettingsModal } from './components/SettingsModal';
import { AwardModal } from './components/AwardModal';
import { sound } from './audio/soundEngine';

const GameMain: React.FC = () => {
  const {
    state,
    isHome,
    currentTab,
    setCurrentTab,
    toastMsg,
    advanceMonth,
    rest,
    language,
    tutorialOpen,
    setTutorialOpen,
    settingsOpen,
    setSettingsOpen,
    activeMission,
    activeStory,
  } = useGame();

  // Desktop keyboard hotkeys listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys if typing in input or textarea
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (tutorialOpen || settingsOpen || activeMission || activeStory) {
        return;
      }

      if (e.key === '1') {
        sound.playTap();
        setCurrentTab('story');
      } else if (e.key === '2') {
        sound.playTap();
        setCurrentTab('profile');
      } else if (e.key === '3') {
        sound.playTap();
        setCurrentTab('career');
      } else if (e.key === '4') {
        sound.playTap();
        setCurrentTab('shop');
      } else if (e.key === '5') {
        sound.playTap();
        setCurrentTab('courses');
      } else if (e.key === '6') {
        sound.playTap();
        setCurrentTab('corps');
      } else if (e.key === '7') {
        sound.playTap();
        setCurrentTab('posting');
      } else if (e.key === '8') {
        sound.playTap();
        setCurrentTab('awards');
      } else if (e.key === 'r' || e.key === 'R') {
        if (state && !state.retired && state.ap >= 1) {
          rest();
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (state && !state.retired && !state.monthlyCorpsDue) {
          advanceMonth();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    state,
    tutorialOpen,
    settingsOpen,
    activeMission,
    activeStory,
    setCurrentTab,
    rest,
    advanceMonth,
  ]);

  const desktopTabs = [
    { id: 'story', label: language === 'en' ? 'Missions & Story' : 'Cerita & Misi', key: '1' },
    { id: 'profile', label: language === 'en' ? 'Service Record' : 'Fail Perkhidmatan', key: '2' },
    { id: 'career', label: language === 'en' ? 'Career & Pay' : 'Kerjaya & Pangkat', key: '3' },
    { id: 'shop', label: language === 'en' ? 'Equipment Armory' : 'Kedai Barang', key: '4' },
    { id: 'courses', label: language === 'en' ? 'Special Courses' : 'Kursus Khas', key: '5' },
    { id: 'corps', label: language === 'en' ? 'Corps & GGK' : 'Kor & Unit Khas', key: '6' },
    { id: 'posting', label: language === 'en' ? 'Bases & Housing' : 'Kem & Kediaman', key: '7' },
    { id: 'awards', label: language === 'en' ? 'Medals & Titles' : 'Pingat & Gelaran', key: '8' },
  ];

  const handleTabClick = (tabId: string) => {
    sound.playTap();
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c140d] text-[#e5ece1]">
      {/* Top Tactical Bar */}
      <TopBar />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-12">
        {isHome || !state ? (
          <HomeScreen />
        ) : (
          <div className="max-w-[1480px] mx-auto px-3 sm:px-6 pt-3 sm:pt-5">
            {/* Sticky Player Vital HUD */}
            <GlobalPlayerBar />

            {/* Desktop Horizontal Tab Bar */}
            <div className="hidden md:flex items-center gap-1.5 overflow-x-auto pb-1 mb-5 scrollbar-thin">
              {desktopTabs.map((t) => {
                const isActive = currentTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTabClick(t.id)}
                    className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2c402d] to-[#223523] text-[#f2f7ed] border border-[#78965d] shadow-md'
                        : 'bg-[#152317] hover:bg-[#1f3222] text-[#93a78f] border border-[#314430] hover:text-[#e4efe0]'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className="hidden lg:inline text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0f1a11] text-[#7d9078] border border-[#263725]">
                      {t.key}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab Body View */}
            <div className="min-h-[500px]">
              {currentTab === 'story' && <StoryTab />}
              {currentTab === 'profile' && <ProfileTab />}
              {currentTab === 'career' && <CareerTab />}
              {currentTab === 'shop' && <ShopTab />}
              {currentTab === 'courses' && <CoursesTab />}
              {currentTab === 'corps' && <CorpsTab />}
              {currentTab === 'posting' && <PostingTab />}
              {currentTab === 'awards' && <AwardsTab />}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Thumb Navigation */}
      <BottomNav activeTab={currentTab} onTabChange={handleTabClick} />

      {/* Floating System Modals */}
      <TutorialModal />
      <SettingsModal />
      <AwardModal />

      {/* Global Floating Toast */}
      {toastMsg && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#1d2d1f]/95 border border-[#6b8956] text-[#edf4e8] text-xs font-bold shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2 max-w-[90vw] text-center">
          <span className="w-2 h-2 rounded-full bg-[#dfce88] animate-pulse shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameMain />
    </GameProvider>
  );
}
