import { useEffect, useRef } from 'react';
import { Game } from '../types';
import { motion } from 'motion/react';
import { playHoverSound, playSelectSound } from '../lib/audio';

interface GameTileProps {
  key?: string | number;
  game: Game;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const gradients = [
  'from-[#3c1e75] via-[#211242] to-[#0a0614]', // Classic Violet
  'from-[#2a207d] via-[#171247] to-[#050414]', // Blue-Violet
  'from-[#4c1d63] via-[#291038] to-[#0b0414]', // Magenta-Violet
  'from-[#581c5c] via-[#311033] to-[#0c0414]', // Plum Violet
  'from-[#1e1b4b] via-[#100e2b] to-[#040412]', // Dark Indigo
  'from-[#2e1065] via-[#1c0a3d] to-[#070312]', // Amethyst Violet
  'from-[#4c0519] via-[#31020f] to-[#0b0005]', // Crimson Violet
  'from-[#03346e] via-[#12224d] to-[#040b1e]', // Navy Blue-Violet
];

export function GameTile({ game, isSelected, onSelect, index }: GameTileProps) {
  const gradientClass = gradients[index % gradients.length];
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && tileRef.current) {
      const isInRecents = tileRef.current.closest('#recents-row-container') !== null;
      if (isInRecents) {
        tileRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      } else {
        tileRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [isSelected]);

  return (
    <motion.div
      ref={tileRef}
      className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer p-0.5
        ${isSelected 
          ? 'ring-2 ring-[#a684ff] shadow-[0_0_20px_rgba(166,132,255,0.6)] z-10' 
          : 'border border-white/[0.04] hover:border-[#a684ff]/40 hover:shadow-[0_0_15px_rgba(166,132,255,0.25)]'
        }
      `}
      onClick={() => {
        playSelectSound();
        onSelect();
      }}
      onMouseEnter={playHoverSound}
      animate={{
        scale: isSelected ? 1.06 : 1,
      }}
      whileHover={{
        scale: isSelected ? 1.08 : 1.04,
      }}
      transition={isSelected ? {
        type: "spring",
        stiffness: 380,
        damping: 14,
        mass: 0.9
      } : {
        type: "tween",
        ease: [0.22, 1, 0.36, 1],
        duration: 0.25
      }}
    >
      <div className={`relative w-full h-full bg-gradient-to-br ${gradientClass} flex items-end p-4 transition-colors duration-500`}>
        {/* Subtle inner top-edge highlight to catch 3D lighting */}
        <div className="absolute inset-0 rounded-lg pointer-events-none border-t border-white/[0.08] mix-blend-overlay" />
        
        {/* Cinematic dark vignette for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        {/* Outer subtle boundary glow overlay */}
        <div className="absolute inset-0 rounded-lg pointer-events-none border border-white/[0.02]" />

        <h3 className="relative z-10 text-white font-medium text-base tracking-tight leading-snug drop-shadow-md">
          {game.name}
        </h3>
      </div>
    </motion.div>
  );
}

