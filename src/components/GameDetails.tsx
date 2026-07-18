import { Game } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Play, Trash2, Calendar, Clock, Disc } from 'lucide-react';
import { playHoverSound, playSelectSound, playFavoriteSound, playLaunchSound } from '../lib/audio';

interface GameDetailsProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onPlay: (game: Game) => void;
  onUninstall: (id: string) => void;
}

export function GameDetails({ 
  game, 
  isOpen, 
  onClose, 
  onToggleFavorite, 
  onPlay, 
  onUninstall 
}: GameDetailsProps) {
  if (!game) return null;

  // Format playtime
  const hours = Math.floor(game.playtime / 60);
  const minutes = game.playtime % 60;
  const playtimeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  // Format last played date
  const lastPlayedString = game.lastPlayed > 0 
    ? new Date(game.lastPlayed).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Never';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur and Fade */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playSelectSound();
              onClose();
            }}
          />

          {/* Slide-in Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0e0d16] border-l border-white/[0.04] shadow-2xl z-50 overflow-y-auto flex flex-col justify-between"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header / Big Graphic Area */}
            <div>
              <div className={`relative h-[240px] bg-gradient-to-br ${game.coverGradient} flex items-end p-6 overflow-hidden`}>
                <div className="absolute inset-0 rounded-lg pointer-events-none border-b border-white/[0.1] mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d16] via-transparent to-black/30 pointer-events-none" />
                
                {/* Close Button */}
                <button 
                  onClick={() => {
                    playSelectSound();
                    onClose();
                  }}
                  onMouseEnter={playHoverSound}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-colors focus:outline-none cursor-pointer"
                >
                  <X size={18} />
                </button>

                {/* Favorite Toggle Button */}
                <button 
                  onClick={() => {
                    playFavoriteSound();
                    onToggleFavorite(game.id);
                  }}
                  onMouseEnter={playHoverSound}
                  className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-colors focus:outline-none cursor-pointer"
                >
                  <Star 
                    size={18} 
                    className={game.isFavorite ? 'fill-[#a684ff] text-[#a684ff]' : 'text-white/80'} 
                  />
                </button>

                {/* Name */}
                <div className="relative z-10">
                  <span className="text-[#a684ff] text-xs font-semibold uppercase tracking-wider block mb-1">
                    {game.genre || 'Interactive Title'}
                  </span>
                  <h2 className="text-white text-3xl font-extrabold tracking-tight drop-shadow-md">
                    {game.name}
                  </h2>
                </div>
              </div>

              {/* Game Metadata and Description */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[#8a8a95]" />
                    <div>
                      <div className="text-[10px] text-[#6a6a75] uppercase tracking-wider font-semibold">Playtime</div>
                      <div className="text-sm font-medium text-white">{playtimeString}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-[#8a8a95]" />
                    <div>
                      <div className="text-[10px] text-[#6a6a75] uppercase tracking-wider font-semibold">Last Played</div>
                      <div className="text-sm font-medium text-white">{lastPlayedString}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 col-span-2 pt-2 border-t border-white/[0.03]">
                    <Disc size={16} className="text-[#8a8a95]" />
                    <div>
                      <div className="text-[10px] text-[#6a6a75] uppercase tracking-wider font-semibold">Developer</div>
                      <div className="text-xs font-medium text-white/80">{game.developer || 'Unknown Developer'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] text-[#6a6a75] uppercase tracking-[1.5px] font-bold">About Game</h4>
                  <p className="text-sm text-[#8a8a95] leading-relaxed">
                    {game.description || 'No description provided. Experience immersive gameplay mechanics and premium performance tuning out-of-the-box.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-white/[0.04] bg-white/[0.01] flex flex-col gap-3">
              <button 
                onClick={() => {
                  playLaunchSound();
                  onPlay(game);
                  onClose();
                }}
                onMouseEnter={playHoverSound}
                className="w-full bg-[#a684ff] text-[#0d0b1a] py-3 rounded-xl font-bold text-sm hover:brightness-110 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(166,132,255,0.45)] cursor-pointer"
              >
                <Play size={16} fill="#0d0b1a" />
                <span>Launch Game</span>
              </button>
              
              <button 
                onClick={() => {
                  playSelectSound();
                  onUninstall(game.id);
                  onClose();
                }}
                onMouseEnter={playHoverSound}
                className="w-full bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 hover:border-red-500/30 text-red-400 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Uninstall Game</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

