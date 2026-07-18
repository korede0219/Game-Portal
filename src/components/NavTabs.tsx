import { Search, Gamepad2 } from 'lucide-react';
import { motion } from 'motion/react';
import { playHoverSound, playTabSound } from '../lib/audio';

interface NavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  isGamepadConnected?: boolean;
}

export function NavTabs({ activeTab, setActiveTab, searchValue, onSearchChange, isGamepadConnected }: NavTabsProps) {
  const tabs = ['Home', 'Library', 'Settings'];
  
  return (
    <div className="flex items-center justify-between w-full pt-6 px-8 relative z-20">
      <div className="flex items-center gap-8 text-white font-semibold text-sm">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                playTabSound();
                setActiveTab(tab);
              }}
              onMouseEnter={playHoverSound}
              className={`relative py-1.5 cursor-pointer transition-colors duration-300 focus:outline-none ${
                isActive ? 'text-[#a684ff] font-semibold' : 'text-[#8a8a95] hover:text-white'
              }`}
            >
              <span className="uppercase tracking-wider text-xs">{tab}</span>
              {isActive && (
                <motion.div
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a684ff] shadow-[0_0_10px_rgba(166,132,255,0.8)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center gap-4">
        {isGamepadConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a684ff]/10 border border-[#a684ff]/20 text-[#a684ff] text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(166,132,255,0.15)] select-none"
            title="Gamepad Connected"
          >
            <Gamepad2 size={13} className="animate-pulse" />
            <span className="hidden sm:inline">Gamepad Active</span>
          </motion.div>
        )}
        
        <div className="relative group">
          <input 
            type="text" 
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search games..." 
            className="bg-white/[0.03] border border-white/[0.06] focus:border-[#a684ff]/40 text-xs text-white rounded-full pl-8 pr-4 py-1.5 w-40 focus:w-52 transition-all duration-300 focus:outline-none placeholder-[#6a6a75]"
          />
          <Search className="text-[#8a8a95] absolute left-2.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#a684ff] transition-colors" size={14} />
        </div>
      </div>
    </div>
  );
}


