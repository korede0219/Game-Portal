import { useEffect, useState } from 'react';
import { Game } from '../types';
import { NavTabs } from './NavTabs';
import { motion, AnimatePresence } from 'motion/react';
import { playHoverSound, playLaunchSound, playSelectSound } from '../lib/audio';

interface HeroBannerProps {
  featuredGames: Game[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  onPlay: (game: Game) => void;
  onDetails: (game: Game) => void;
  isGamepadConnected?: boolean;
  onOpenAddModal?: () => void;
}

export function HeroBanner({ 
  featuredGames, 
  activeTab, 
  setActiveTab, 
  searchValue, 
  onSearchChange,
  onPlay,
  onDetails,
  isGamepadConnected,
  onOpenAddModal
}: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredGames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
    }, 7000); // Crossfade every 7 seconds
    return () => clearInterval(interval);
  }, [featuredGames]);

  const hasGames = featuredGames.length > 0;
  const currentGame: Game = hasGames ? (featuredGames[currentIndex] || featuredGames[0]) : {
    id: 'placeholder',
    name: 'Console Dashboard',
    coverGradient: 'from-violet-950 to-slate-900',
    description: 'Install your favorite titles to populate your games library catalog.',
    genre: 'Launcher',
    developer: 'Standard System',
    playtime: 0,
    lastPlayed: 0,
    dateAdded: Date.now(),
    isFavorite: false
  };

  return (
    <div className="relative h-[340px] bg-[#0d0b1a] overflow-hidden border-b border-white/[0.02]">
      {/* Background Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGame.id}
          className={`absolute inset-0 bg-gradient-to-br ${currentGame.coverGradient} opacity-35`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Persistent Violet Ambient Gradient Top-Right */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[rgba(166,132,255,0.18)] rounded-full blur-[150px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute -top-10 -right-10 w-[300px] h-[300px] bg-[rgba(139,92,246,0.22)] rounded-full blur-[90px] pointer-events-none" />

      {/* Noise Overlay for analog texture */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none bg-repeat z-10" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Dynamic Overlay Dark Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/60 to-transparent pointer-events-none z-10" />

      <NavTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        searchValue={searchValue} 
        onSearchChange={onSearchChange} 
        isGamepadConnected={isGamepadConnected}
      />
      
      <div className="flex flex-col justify-end h-full px-8 pb-24 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGame.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <span className="text-[#6a6a75] text-[11px] font-bold uppercase tracking-[1.5px] mb-1.5 block">
              {hasGames ? 'jump back in' : 'welcome to portal'}
            </span>
            <h1 
              className="text-white text-[42px] font-semibold tracking-tight leading-none mb-5 select-none"
              style={{ 
                textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 25px rgba(166,132,255,0.45)' 
              }}
            >
              {currentGame.name}
            </h1>
            <div className="flex gap-3">
              {hasGames ? (
                <>
                  <button 
                    onClick={() => {
                      playLaunchSound();
                      onPlay(currentGame);
                    }}
                    onMouseEnter={playHoverSound}
                    className="bg-[#a684ff] text-[#0d0b1a] px-7 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 hover:shadow-[0_0_20px_rgba(166,132,255,0.45)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                  >
                    Play
                  </button>
                  <button 
                    onClick={() => {
                      playSelectSound();
                      onDetails(currentGame);
                    }}
                    onMouseEnter={playHoverSound}
                    className="border border-white/10 text-white bg-white/[0.02] px-7 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-300 cursor-pointer"
                  >
                    Details
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    playSelectSound();
                    if (onOpenAddModal) onOpenAddModal();
                  }}
                  onMouseEnter={playHoverSound}
                  className="bg-[#a684ff] text-[#0d0b1a] px-7 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 hover:shadow-[0_0_20px_rgba(166,132,255,0.45)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                >
                  Add Your First Game
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
