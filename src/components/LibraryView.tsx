import { Game } from '../types';
import { GameTile } from './GameTile';
import { motion, AnimatePresence } from 'motion/react';
import { Grid, Heart, SlidersHorizontal, Plus, BookOpen } from 'lucide-react';
import { playHoverSound, playSelectSound, playFavoriteSound } from '../lib/audio';

interface LibraryViewProps {
  games: Game[];
  processedGames: Game[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchValue: string;
  onOpenAddModal: () => void;
  sortBy: 'name' | 'recentlyPlayed' | 'dateAdded';
  setSortBy: (sortBy: 'name' | 'recentlyPlayed' | 'dateAdded') => void;
  filterFavorites: boolean;
  setFilterFavorites: (fav: boolean) => void;
}

export function LibraryView({ 
  games, 
  processedGames,
  selectedId, 
  onSelect, 
  searchValue, 
  onOpenAddModal,
  sortBy,
  setSortBy,
  filterFavorites,
  setFilterFavorites
}: LibraryViewProps) {

  return (
    <div className="max-w-6xl mx-auto px-8 mt-14 space-y-8">
      {/* Filters/Actions Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Favorites Filter */}
          <button
            onClick={() => {
              playFavoriteSound();
              setFilterFavorites(!filterFavorites);
            }}
            onMouseEnter={playHoverSound}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
              filterFavorites 
                ? 'bg-[#a684ff] text-[#0d0b1a] shadow-[0_0_12px_rgba(166,132,255,0.4)]' 
                : 'bg-white/[0.03] text-[#8a8a95] hover:text-white border border-white/[0.04]'
            }`}
          >
            <Heart size={12} className={filterFavorites ? 'fill-current' : ''} />
            <span>Favorites</span>
          </button>

          {/* Divider */}
          <div className="h-4 w-[1px] bg-white/[0.06] hidden sm:block" />

          {/* Sort trigger drop down or selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={12} className="text-[#6a6a75]" />
            <select
              value={sortBy}
              onChange={(e) => {
                playSelectSound();
                setSortBy(e.target.value as any);
              }}
              onMouseEnter={playHoverSound}
              className="bg-transparent border-none text-[#8a8a95] hover:text-white text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer"
            >
              <option value="name" className="bg-[#0e0d16] text-[#8a8a95]">Sort: Alphabetical</option>
              <option value="recentlyPlayed" className="bg-[#0e0d16] text-[#8a8a95]">Sort: Recent Playtime</option>
              <option value="dateAdded" className="bg-[#0e0d16] text-[#8a8a95]">Sort: Date Added</option>
            </select>
          </div>
        </div>

        {/* Add game action */}
        <button
          onClick={() => {
            playSelectSound();
            onOpenAddModal();
          }}
          onMouseEnter={playHoverSound}
          className="bg-white/[0.04] hover:bg-[#a684ff] hover:text-[#0d0b1a] text-white border border-white/[0.06] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(166,132,255,0.3)]"
        >
          <Plus size={14} />
          <span>Add Game</span>
        </button>
      </div>

      {/* Grid view */}
      <AnimatePresence mode="popLayout">
        {processedGames.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6 mt-6"
          >
            {processedGames.map((game, idx) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <GameTile
                  game={game}
                  isSelected={selectedId === game.id}
                  onSelect={() => onSelect(game.id)}
                  index={idx}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty / fallback state */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/[0.01] border border-dashed border-white/[0.04] rounded-2xl p-8"
          >
            <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-[#8a8a95]">
              <BookOpen size={20} />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-white font-semibold text-base">No Games Discovered</h3>
              <p className="text-xs text-[#6a6a75]">
                {filterFavorites 
                  ? "You haven't favorited any games yet. Click a game tile to open details and tap the star to save favorites."
                  : "We couldn't find matches for your search. Try adjusting spelling or add a brand new game directly!"}
              </p>
            </div>
            {!filterFavorites && (
              <button
                onClick={() => {
                  playSelectSound();
                  onOpenAddModal();
                }}
                onMouseEnter={playHoverSound}
                className="bg-[#a684ff] text-[#0d0b1a] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(166,132,255,0.4)]"
              >
                <Plus size={14} />
                <span>Create New Game</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

