import { useState, useEffect, useMemo, useRef } from 'react';
import { HeroBanner } from './components/HeroBanner';
import { GameGrid } from './components/GameGrid';
import { GameTile } from './components/GameTile';
import { GameDetails } from './components/GameDetails';
import { AddGameModal } from './components/AddGameModal';
import { ToastNotification } from './components/ToastNotification';
import { LibraryView } from './components/LibraryView';
import { SettingsView } from './components/SettingsView';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { games as initialGames } from './data';
import { Game } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { playHoverSound, playSelectSound, playFavoriteSound, playLaunchSound, playTabSound } from './lib/audio';

const LOCAL_STORAGE_KEY = 'console_game_dashboard_data';

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailGameId, setDetailGameId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Library filters lifted for gamepad visibility
  const [librarySortBy, setLibrarySortBy] = useState<'name' | 'recentlyPlayed' | 'dateAdded'>('name');
  const [libraryFilterFavorites, setLibraryFilterFavorites] = useState<boolean>(false);

  // Gamepad states & refs
  const [isGamepadConnected, setIsGamepadConnected] = useState<boolean>(false);

  // Modals / notification states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'favorite' | 'info' | null>(null);

  // Initialize and load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGames(parsed);
        } else {
          setGames(initialGames);
        }
      } catch (e) {
        setGames(initialGames);
      }
    } else {
      setGames(initialGames);
    }

    // Simulate premium console boot/fetch loading skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Sync to local storage
  const saveGames = (newGames: Game[]) => {
    setGames(newGames);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newGames));
  };

  // Set default selected tile once games are loaded
  useEffect(() => {
    if (games.length > 0 && !selectedId) {
      setSelectedId(games[0].id);
    }
  }, [games, selectedId]);

  // Helper to show custom notification toast
  const triggerToast = (message: string, type: 'success' | 'favorite' | 'info') => {
    setToastMessage(message);
    setToastType(type);
  };

  // Handle simulation of launching/playing a game
  const handlePlayGame = (game: Game) => {
    playLaunchSound();
    const randomMinutes = Math.floor(Math.random() * 35) + 10; // add 10-45 minutes
    const updated = games.map(g => {
      if (g.id === game.id) {
        return {
          ...g,
          playtime: g.playtime + randomMinutes,
          lastPlayed: Date.now()
        };
      }
      return g;
    });
    saveGames(updated);
    triggerToast(`Launching ${game.name}... Added ${randomMinutes}m playtime!`, 'success');
  };

  // Toggle favorite state
  const handleToggleFavorite = (id: string) => {
    const game = games.find(g => g.id === id);
    if (!game) return;

    playFavoriteSound();
    const updated = games.map(g => {
      if (g.id === id) {
        return { ...g, isFavorite: !g.isFavorite };
      }
      return g;
    });
    saveGames(updated);
    triggerToast(
      !game.isFavorite ? `Added ${game.name} to Favorites!` : `Removed ${game.name} from Favorites`, 
      'favorite'
    );
  };

  // Create a new game tile
  const handleAddGame = (newGameData: Omit<Game, 'id' | 'playtime' | 'lastPlayed' | 'dateAdded'>) => {
    const newGame: Game = {
      ...newGameData,
      id: Date.now().toString(),
      playtime: 0,
      lastPlayed: 0,
      dateAdded: Date.now()
    };
    const updated = [newGame, ...games];
    saveGames(updated);
    setSelectedId(newGame.id);
    triggerToast(`Successfully installed ${newGame.name}!`, 'success');
  };

  // Uninstall/delete a game tile
  const handleUninstallGame = (id: string) => {
    const target = games.find(g => g.id === id);
    const updated = games.filter(g => g.id !== id);
    saveGames(updated);
    if (selectedId === id) {
      setSelectedId(updated[0]?.id || null);
    }
    triggerToast(`Successfully uninstalled ${target?.name || 'game'}`, 'success');
  };

  // Recently played list: sort by lastPlayed desc (only if played), fallback to first 4
  const recentGames = useMemo(() => {
    const played = games.filter(g => g.lastPlayed > 0);
    if (played.length > 0) {
      return [...played].sort((a, b) => b.lastPlayed - a.lastPlayed).slice(0, 4);
    }
    return games.slice(0, 4);
  }, [games]);

  // Rest of the library games (not in recent list, or everything else)
  const libraryGames = useMemo(() => {
    const recentIds = new Set(recentGames.map(g => g.id));
    return games.filter(g => !recentIds.has(g.id));
  }, [games, recentGames]);

  // Selected details target
  const detailGame = games.find(g => g.id === detailGameId) || null;

  // Filter list for search if searchQuery is active
  const filteredHomeGames = useMemo(() => {
    if (!searchQuery.trim()) return libraryGames;
    const q = searchQuery.toLowerCase().trim();
    return games.filter(g => g.name.toLowerCase().includes(q) || (g.genre && g.genre.toLowerCase().includes(q)));
  }, [games, libraryGames, searchQuery]);

  // Compute processedLibraryGames inside parent for navigation access
  const processedLibraryGames = useMemo(() => {
    let list = [...games];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(g => g.name.toLowerCase().includes(q) || (g.genre && g.genre.toLowerCase().includes(q)));
    }

    if (libraryFilterFavorites) {
      list = list.filter(g => g.isFavorite);
    }

    list.sort((a, b) => {
      if (librarySortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (librarySortBy === 'recentlyPlayed') {
        return b.lastPlayed - a.lastPlayed;
      } else if (librarySortBy === 'dateAdded') {
        return b.dateAdded - a.dateAdded;
      }
      return 0;
    });

    return list;
  }, [games, searchQuery, librarySortBy, libraryFilterFavorites]);

  // Gamepad/Key Navigation: helper to estimate grid columns dynamically
  const getGridColumns = () => {
    const width = window.innerWidth;
    if (width >= 1200) return 6;
    if (width >= 992) return 5;
    if (width >= 768) return 4;
    if (width >= 480) return 3;
    return 2;
  };

  // State reference to avoid stale closures in RAF loop
  const stateRef = useRef({
    activeTab,
    selectedId,
    detailGameId,
    isAddModalOpen,
    isLoading,
    games,
    filteredHomeGames,
    recentGames,
    processedLibraryGames,
  });

  // Keep stateRef up to date on every render
  useEffect(() => {
    stateRef.current = {
      activeTab,
      selectedId,
      detailGameId,
      isAddModalOpen,
      isLoading,
      games,
      filteredHomeGames,
      recentGames,
      processedLibraryGames,
    };
  });

  // Automatically scroll window to top when selection is in the top section
  useEffect(() => {
    if (!selectedId) return;

    if (activeTab === 'Home') {
      const idx = [...recentGames, ...filteredHomeGames].findIndex(g => g.id === selectedId);
      if (idx !== -1 && idx < recentGames.length) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (activeTab === 'Library') {
      const idx = processedLibraryGames.findIndex(g => g.id === selectedId);
      const cols = getGridColumns();
      if (idx !== -1 && idx < cols) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [selectedId, activeTab, recentGames, filteredHomeGames, processedLibraryGames]);

  const handleTabChange = (nextTab: string) => {
    playTabSound();
    setActiveTab(nextTab);
  };

  // Unified selection movement logic for keyboard arrows & gamepad sticks/D-pad
  const moveSelection = (direction: 'up' | 'down' | 'left' | 'right') => {
    const state = stateRef.current;
    
    // Determine the active list of games on the screen
    let visibleGames: Game[] = [];
    if (state.activeTab === 'Home') {
      visibleGames = [...state.recentGames, ...state.filteredHomeGames];
    } else if (state.activeTab === 'Library') {
      visibleGames = state.processedLibraryGames;
    }

    if (visibleGames.length === 0) return;

    const currentIndex = visibleGames.findIndex(g => g.id === state.selectedId);
    const cols = getGridColumns();

    if (currentIndex === -1) {
      // Default select the first visible item
      playHoverSound();
      setSelectedId(visibleGames[0].id);
      return;
    }

    const selectIndex = (index: number) => {
      if (index >= 0 && index < visibleGames.length) {
        playHoverSound();
        setSelectedId(visibleGames[index].id);
      }
    };

    if (state.activeTab === 'Home') {
      const R = state.recentGames.length;
      const G = state.filteredHomeGames.length;

      if (direction === 'left') {
        if (currentIndex > 0) selectIndex(currentIndex - 1);
      } else if (direction === 'right') {
        if (currentIndex < R + G - 1) selectIndex(currentIndex + 1);
      } else if (direction === 'down') {
        if (currentIndex < R) {
          // Down from Recents to Home Library Grid
          if (G > 0) {
            selectIndex(Math.min(R + currentIndex, R + G - 1));
          }
        } else {
          // Down within Grid
          if (currentIndex + cols < R + G) {
            selectIndex(currentIndex + cols);
          }
        }
      } else if (direction === 'up') {
        if (currentIndex >= R) {
          if (currentIndex - cols >= R) {
            selectIndex(currentIndex - cols);
          } else {
            // Up from first row of Grid into Recents row
            if (R > 0) {
              selectIndex(Math.min(currentIndex - R, R - 1));
            }
          }
        }
      }
    } else if (state.activeTab === 'Library') {
      const L = visibleGames.length;

      if (direction === 'left') {
        if (currentIndex > 0) selectIndex(currentIndex - 1);
      } else if (direction === 'right') {
        if (currentIndex < L - 1) selectIndex(currentIndex + 1);
      } else if (direction === 'up') {
        if (currentIndex - cols >= 0) selectIndex(currentIndex - cols);
      } else if (direction === 'down') {
        if (currentIndex + cols < L) selectIndex(currentIndex + cols);
      }
    }
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;

      // Handle Escape for modals/details
      if (e.key === 'Escape') {
        if (isAddModalOpen) {
          playSelectSound();
          setIsAddModalOpen(false);
          e.preventDefault();
        } else if (detailGameId) {
          playSelectSound();
          setDetailGameId(null);
          e.preventDefault();
        }
        return;
      }

      // Handle Enter for selection / detail interactions
      if (e.key === 'Enter') {
        if (detailGameId) {
          const game = games.find(g => g.id === detailGameId);
          if (game) {
            handlePlayGame(game);
            setDetailGameId(null);
          }
          e.preventDefault();
        } else if (isAddModalOpen) {
          // Let standard inputs submit
        } else if (selectedId) {
          playSelectSound();
          setDetailGameId(selectedId);
          e.preventDefault();
        }
        return;
      }

      // Selection movement keys (disabled if modal/details are open)
      if (isAddModalOpen || detailGameId) return;

      if (e.key === 'ArrowRight') {
        moveSelection('right');
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        moveSelection('left');
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        moveSelection('up');
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        moveSelection('down');
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, games, isAddModalOpen, detailGameId, isLoading]);

  // Controller connection alerts
  useEffect(() => {
    const handleConnect = (e: GamepadEvent) => {
      setIsGamepadConnected(true);
      triggerToast(`Controller connected: ${e.gamepad.id.slice(0, 20)}...`, 'success');
      playSelectSound();
    };
    
    const handleDisconnect = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const anyConnected = Array.from(gamepads).some(gp => gp !== null);
      setIsGamepadConnected(anyConnected);
      triggerToast(`Controller disconnected`, 'info');
      playHoverSound();
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    // Initial check
    if (navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      const anyConnected = Array.from(gamepads).some(gp => gp !== null);
      if (anyConnected) {
        setIsGamepadConnected(true);
      }
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
    };
  }, []);

  // Gamepad API loop hooks & state
  const prevButtonsRef = useRef<boolean[]>(new Array(16).fill(false));
  const lastStickMoveTimeRef = useRef<number>(0);
  const stickActiveDirectionRef = useRef<'up' | 'down' | 'left' | 'right' | null>(null);

  useEffect(() => {
    let animFrameId: number;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = Array.from(gamepads).find(g => g !== null);

      if (gp) {
        const state = stateRef.current;
        const now = performance.now();

        // 1. Right analog stick (dedicated continuous scrolling with deadzone)
        if (gp.axes.length >= 4) {
          const rStickY = gp.axes[3];
          const rStickX = gp.axes[2];

          if (Math.abs(rStickY) > 0.15) {
            // Speed scales with stick tilt
            const scrollSpeed = rStickY * 16;
            window.scrollBy({
              top: scrollSpeed,
              behavior: 'auto'
            });
          }

          if (Math.abs(rStickX) > 0.15) {
            const scrollSpeedX = rStickX * 16;
            const recentsEl = document.getElementById('recents-row-container');
            if (recentsEl) {
              recentsEl.scrollBy({
                left: scrollSpeedX,
                behavior: 'auto'
              });
            }
          }
        }

        // 2. Left analog stick (movement past 0.2 deadzone, 200ms repeat delay)
        const stickX = gp.axes[0];
        const stickY = gp.axes[1];
        const deadzone = 0.2;

        let activeStickDir: 'up' | 'down' | 'left' | 'right' | null = null;
        if (Math.abs(stickX) > Math.abs(stickY)) {
          if (stickX > deadzone) activeStickDir = 'right';
          else if (stickX < -deadzone) activeStickDir = 'left';
        } else {
          if (stickY > deadzone) activeStickDir = 'down';
          else if (stickY < -deadzone) activeStickDir = 'up';
        }

        if (activeStickDir) {
          const isNewDirection = activeStickDir !== stickActiveDirectionRef.current;
          const isTimeElapsed = now - lastStickMoveTimeRef.current >= 200;

          if (isNewDirection || isTimeElapsed) {
            if (!state.isAddModalOpen && !state.detailGameId) {
              moveSelection(activeStickDir);
            }
            lastStickMoveTimeRef.current = now;
            stickActiveDirectionRef.current = activeStickDir;
          }
        } else {
          stickActiveDirectionRef.current = null;
        }

        // 2. Buttons triggers
        const buttons = gp.buttons;
        const prevButtons = prevButtonsRef.current;

        const isPressed = (index: number) => {
          if (index >= buttons.length) return false;
          const b = buttons[index];
          return typeof b === 'object' ? b.pressed : b === 1.0;
        };

        const wasJustPressed = (index: number) => {
          return isPressed(index) && !prevButtons[index];
        };

        // BUTTON 0 = A → Select/Launch
        if (wasJustPressed(0)) {
          if (state.detailGameId) {
            const game = state.games.find(g => g.id === state.detailGameId);
            if (game) {
              handlePlayGame(game);
              setDetailGameId(null);
            }
          } else if (state.isAddModalOpen) {
            // let standard form elements work
          } else if (state.selectedId) {
            playSelectSound();
            setDetailGameId(state.selectedId);
          }
        }

        // BUTTON 1 = B → Go Back/Close
        if (wasJustPressed(1)) {
          if (state.isAddModalOpen) {
            setIsAddModalOpen(false);
            playSelectSound();
          } else if (state.detailGameId) {
            setDetailGameId(null);
            playSelectSound();
          }
        }

        // BUTTON 2 = X → Toggle Favorite
        if (wasJustPressed(2)) {
          if (!state.isAddModalOpen && !state.detailGameId && state.selectedId) {
            handleToggleFavorite(state.selectedId);
          }
        }

        // BUTTON 3 = Y → Open "add game" Modal
        if (wasJustPressed(3)) {
          if (!state.isAddModalOpen && !state.detailGameId) {
            playSelectSound();
            setIsAddModalOpen(true);
          }
        }

        // BUTTON 4 = LB → Previous Tab
        if (wasJustPressed(4)) {
          const tabs = ['Home', 'Library', 'Settings'];
          const idx = tabs.indexOf(state.activeTab);
          const prevTab = tabs[(idx - 1 + tabs.length) % tabs.length];
          handleTabChange(prevTab);
        }

        // BUTTON 5 = RB → Next Tab
        if (wasJustPressed(5)) {
          const tabs = ['Home', 'Library', 'Settings'];
          const idx = tabs.indexOf(state.activeTab);
          const nextTab = tabs[(idx + 1) % tabs.length];
          handleTabChange(nextTab);
        }

        // BUTTON 8 = Back/View → Open Settings
        if (wasJustPressed(8)) {
          handleTabChange('Settings');
        }

        // BUTTON 9 = Start/Menu → Trigger toast overlay
        if (wasJustPressed(9)) {
          playSelectSound();
          triggerToast("Xbox 360 controller mode is active!", "success");
        }

        // BUTTON 12 = D-pad Up
        if (wasJustPressed(12)) {
          if (!state.isAddModalOpen && !state.detailGameId) {
            moveSelection('up');
          }
        }

        // BUTTON 13 = D-pad Down
        if (wasJustPressed(13)) {
          if (!state.isAddModalOpen && !state.detailGameId) {
            moveSelection('down');
          }
        }

        // BUTTON 14 = D-pad Left
        if (wasJustPressed(14)) {
          if (!state.isAddModalOpen && !state.detailGameId) {
            moveSelection('left');
          }
        }

        // BUTTON 15 = D-pad Right
        if (wasJustPressed(15)) {
          if (!state.isAddModalOpen && !state.detailGameId) {
            moveSelection('right');
          }
        }

        // Save states for next animation frame comparison
        prevButtonsRef.current = buttons.map((_, idx) => isPressed(idx));
      }

      animFrameId = requestAnimationFrame(pollGamepad);
    };

    animFrameId = requestAnimationFrame(pollGamepad);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0d] pb-24 text-white relative overflow-x-hidden">
      {/* Toast alert system */}
      <ToastNotification 
        message={toastMessage} 
        type={toastType} 
        onClear={() => {
          setToastMessage(null);
          setToastType(null);
        }} 
      />

      {/* Slide-over details pane */}
      <GameDetails
        game={detailGame}
        isOpen={!!detailGameId}
        onClose={() => setDetailGameId(null)}
        onToggleFavorite={handleToggleFavorite}
        onPlay={handlePlayGame}
        onUninstall={handleUninstallGame}
      />

      {/* Add game configuration Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      {/* Universal Hero Banner / Navigation */}
      <HeroBanner 
        featuredGames={games.slice(0, 3)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onPlay={handlePlayGame}
        onDetails={(game) => setDetailGameId(game.id)}
        isGamepadConnected={isGamepadConnected}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* View Switcher with slide/fade transitions */}
      <AnimatePresence mode="wait">
        {activeTab === 'Home' && (
          <motion.div
            key="home-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Recently Played Section (Overlapping Hero) */}
            <div className="px-8 -mt-8 relative z-20">
              <h2 className="text-[#6a6a75] text-[11px] font-bold uppercase tracking-[1.5px] mb-4">
                Recently Played
              </h2>
              <div id="recents-row-container" className="flex gap-6 overflow-x-auto scrollbar-none pb-2">
                {recentGames.map((game, idx) => (
                  <div key={game.id} className="w-[145px] flex-shrink-0">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                    >
                      <GameTile 
                        game={game} 
                        isSelected={selectedId === game.id} 
                        onSelect={() => {
                          setSelectedId(game.id);
                          setDetailGameId(game.id); // Open details modal on click
                        }}
                        index={idx}
                      />
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Home Game Grid */}
            <div onClick={() => selectedId && setDetailGameId(selectedId)}>
              <GameGrid 
                title="Your Library" 
                games={filteredHomeGames} 
                selectedId={selectedId} 
                onSelect={setSelectedId}
                indexOffset={recentGames.length}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'Library' && (
          <motion.div
            key="library-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <LibraryView
              games={games}
              processedGames={processedLibraryGames}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                setDetailGameId(id); // Instant click to open details
              }}
              searchValue={searchQuery}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              sortBy={librarySortBy}
              setSortBy={setLibrarySortBy}
              filterFavorites={libraryFilterFavorites}
              setFilterFavorites={setLibraryFilterFavorites}
            />
          </motion.div>
        )}

        {activeTab === 'Settings' && (
          <motion.div
            key="settings-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <SettingsView 
              onNotify={(msg, type) => triggerToast(msg, type)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
