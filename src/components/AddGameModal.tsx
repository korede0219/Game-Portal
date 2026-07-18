import { useState, FormEvent } from 'react';
import { Game } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { playHoverSound, playSelectSound } from '../lib/audio';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: Omit<Game, 'id' | 'playtime' | 'lastPlayed' | 'dateAdded'>) => void;
}

const presets = [
  { name: 'Cosmic Purple', gradient: 'from-blue-600 to-purple-800' },
  { name: 'Neon Coral', gradient: 'from-pink-500 to-orange-500' },
  { name: 'Abyssal Dark', gradient: 'from-gray-800 to-black' },
  { name: 'Cyber Emerald', gradient: 'from-green-600 to-emerald-900' },
  { name: 'Solaris Fire', gradient: 'from-yellow-500 to-red-600' },
  { name: 'Aqua Trench', gradient: 'from-blue-400 to-blue-900' },
  { name: 'Quantum Cyan', gradient: 'from-cyan-400 to-blue-600' },
  { name: 'Midnight Amethyst', gradient: 'from-indigo-900 to-purple-900' },
];

export function AddGameModal({ isOpen, onClose, onAddGame }: AddGameModalProps) {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [developer, setDeveloper] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(presets[0].gradient);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddGame({
      name: name.trim(),
      coverGradient: selectedGradient,
      isFavorite: false,
      genre: genre.trim() || 'Indie Game',
      developer: developer.trim() || 'Independent Creator',
      description: description.trim() || 'No description provided. Immerse yourself in this freshly added experience.'
    });

    // Reset fields
    setName('');
    setGenre('');
    setDeveloper('');
    setSelectedGradient(presets[0].gradient);
    setDescription('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playSelectSound();
              onClose();
            }}
          >
            {/* Modal Box */}
            <motion.div
              className="w-full max-w-md bg-[#0e0d16] border border-white/[0.04] rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] bg-white/[0.01]">
                <h3 className="text-white font-semibold text-base flex items-center gap-2">
                  <Plus size={18} className="text-[#a684ff]" />
                  <span>Add New Game</span>
                </h3>
                <button 
                  onClick={() => {
                    playSelectSound();
                    onClose();
                  }}
                  onMouseEnter={playHoverSound}
                  className="text-[#8a8a95] hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Game Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#6a6a75] uppercase tracking-wider font-bold block">Game Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elden Ring"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-[#a684ff]/40 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none placeholder-[#6a6a75] transition-all"
                  />
                </div>

                {/* Genre & Developer Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#6a6a75] uppercase tracking-wider font-bold block">Genre</label>
                    <input
                      type="text"
                      placeholder="e.g. Action RPG"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-[#a684ff]/40 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none placeholder-[#6a6a75] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#6a6a75] uppercase tracking-wider font-bold block">Developer</label>
                    <input
                      type="text"
                      placeholder="e.g. FromSoftware"
                      value={developer}
                      onChange={(e) => setDeveloper(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-[#a684ff]/40 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none placeholder-[#6a6a75] transition-all"
                    />
                  </div>
                </div>

                {/* Cover Gradient Presets */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#6a6a75] uppercase tracking-wider font-bold block">Select Cover Theme</label>
                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((p) => {
                      const isSelected = selectedGradient === p.gradient;
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => {
                            playSelectSound();
                            setSelectedGradient(p.gradient);
                          }}
                          onMouseEnter={playHoverSound}
                          title={p.name}
                          className={`h-12 rounded-lg bg-gradient-to-br ${p.gradient} relative focus:outline-none cursor-pointer border-2 transition-all ${
                            isSelected ? 'border-[#a684ff] shadow-[0_0_10px_rgba(166,132,255,0.4)] scale-105' : 'border-transparent'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-[#6a6a75] uppercase tracking-wider font-bold block">Description / Synopsis</label>
                  <textarea
                    placeholder="Enter short game synopsis..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-[#a684ff]/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none placeholder-[#6a6a75] transition-all resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      onClose();
                    }}
                    onMouseEnter={playHoverSound}
                    className="w-1/2 border border-white/10 text-white bg-white/[0.02] py-2.5 rounded-lg font-semibold text-xs hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={playSelectSound}
                    onMouseEnter={playHoverSound}
                    className="w-1/2 bg-[#a684ff] text-[#0d0b1a] py-2.5 rounded-lg font-bold text-xs hover:brightness-110 active:scale-[0.98] transition-all hover:shadow-[0_0_15px_rgba(166,132,255,0.35)] cursor-pointer"
                  >
                    Add Game
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

