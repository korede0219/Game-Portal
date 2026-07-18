import { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Monitor, Laptop, Keyboard, Info, Bell } from 'lucide-react';
import { playHoverSound, playSelectSound, playTabSound } from '../lib/audio';

interface SettingsViewProps {
  onNotify: (msg: string, type: 'success' | 'favorite' | 'info') => void;
}

const swatches = [
  { name: 'Ultra Violet', color: '#a684ff', bg: 'bg-[#a684ff]' },
  { name: 'Neon Pink', color: '#ec4899', bg: 'bg-pink-500' },
  { name: 'Quantum Cyan', color: '#06b6d4', bg: 'bg-cyan-500' },
  { name: 'Cyber Lime', color: '#84cc16', bg: 'bg-lime-500' },
  { name: 'Solar Orange', color: '#f97316', bg: 'bg-orange-500' },
];

export function SettingsView({ onNotify }: SettingsViewProps) {
  const [selectedAccent, setSelectedAccent] = useState('#a684ff');
  const [launchOnStartup, setLaunchOnStartup] = useState(true);
  const [showPlaytime, setShowPlaytime] = useState(true);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [lowLatencyAudio, setLowLatencyAudio] = useState(false);
  const [discordRichPresence, setDiscordRichPresence] = useState(true);

  const handleAccentChange = (swatch: typeof swatches[0]) => {
    playSelectSound();
    setSelectedAccent(swatch.color);
    onNotify(`Accent color updated to ${swatch.name}!`, 'info');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-8 mt-14 space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="border-b border-white/[0.04] pb-4">
        <h2 className="text-white text-3xl font-extrabold tracking-tight">System Settings</h2>
        <p className="text-sm text-[#8a8a95] mt-1">Configure client performance settings and visual dashboard preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column navigation */}
        <div className="space-y-1">
          <button 
            onClick={playTabSound}
            onMouseEnter={playHoverSound}
            className="w-full text-left px-4 py-2.5 rounded-lg bg-white/[0.03] text-white border border-white/[0.04] text-xs font-bold uppercase tracking-wider flex items-center gap-3"
          >
            <Monitor size={14} className="text-[#a684ff]" />
            <span>General</span>
          </button>
          <button 
            onClick={playTabSound}
            onMouseEnter={playHoverSound}
            className="w-full text-left px-4 py-2.5 rounded-lg text-[#8a8a95] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors"
          >
            <Laptop size={14} />
            <span>Hardware & Performance</span>
          </button>
          <button 
            onClick={playTabSound}
            onMouseEnter={playHoverSound}
            className="w-full text-left px-4 py-2.5 rounded-lg text-[#8a8a95] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors"
          >
            <Keyboard size={14} />
            <span>Controller Bindings</span>
          </button>
          <button 
            onClick={playTabSound}
            onMouseEnter={playHoverSound}
            className="w-full text-left px-4 py-2.5 rounded-lg text-[#8a8a95] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors"
          >
            <Bell size={14} />
            <span>Notifications</span>
          </button>
        </div>

        {/* Right column settings body */}
        <div className="md:col-span-2 space-y-8">
          {/* Accent Color picker */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold flex items-center gap-2">
              <Palette size={16} className="text-[#a684ff]" />
              <span>Dashboard Accent Theme</span>
            </h3>
            <div className="p-5 bg-white/[0.02] border border-white/[0.04] rounded-xl space-y-4">
              <p className="text-xs text-[#8a8a95]">Select your primary theme color for buttons, borders, and ambient light glows.</p>
              <div className="flex gap-4 items-center">
                {swatches.map((swatch) => {
                  const isSelected = selectedAccent === swatch.color;
                  return (
                    <button
                      key={swatch.name}
                      onClick={() => handleAccentChange(swatch)}
                      onMouseEnter={playHoverSound}
                      className={`w-8 h-8 rounded-full ${swatch.bg} relative focus:outline-none cursor-pointer flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0d]' : ''
                      }`}
                      title={swatch.name}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Toggles list */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold flex items-center gap-2">
              <Palette size={16} className="text-[#a684ff]" />
              <span>Behavioral Preferences</span>
            </h3>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl divide-y divide-white/[0.04]">
              {/* Option 1 */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="text-xs font-bold text-white tracking-wide uppercase">Launch on system startup</div>
                  <div className="text-[11px] text-[#6a6a75] mt-0.5">Automatically open the portal when your system starts up.</div>
                </div>
                <button
                  onClick={() => {
                    playSelectSound();
                    setLaunchOnStartup(!launchOnStartup);
                    onNotify(`Startup launch preference updated!`, 'info');
                  }}
                  onMouseEnter={playHoverSound}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    launchOnStartup ? 'bg-[#a684ff]' : 'bg-white/10'
                  }`}
                >
                  <div className={`bg-[#0d0b1a] w-4 h-4 rounded-full shadow-md transform duration-200 ${
                    launchOnStartup ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Option 2 */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="text-xs font-bold text-white tracking-wide uppercase">Show cumulative playtime</div>
                  <div className="text-[11px] text-[#6a6a75] mt-0.5">Display accumulated gameplay hours directly on launcher tiles.</div>
                </div>
                <button
                  onClick={() => {
                    playSelectSound();
                    setShowPlaytime(!showPlaytime);
                    onNotify(`Playtime visibility setting updated!`, 'info');
                  }}
                  onMouseEnter={playHoverSound}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    showPlaytime ? 'bg-[#a684ff]' : 'bg-white/10'
                  }`}
                >
                  <div className={`bg-[#0d0b1a] w-4 h-4 rounded-full shadow-md transform duration-200 ${
                    showPlaytime ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Option 3 */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="text-xs font-bold text-white tracking-wide uppercase">Enable Hardware Acceleration</div>
                  <div className="text-[11px] text-[#6a6a75] mt-0.5">Utilize system GPU to render dynamic blur filters and glow fields.</div>
                </div>
                <button
                  onClick={() => {
                    playSelectSound();
                    setHardwareAcceleration(!hardwareAcceleration);
                    onNotify(`Hardware acceleration state toggled!`, 'info');
                  }}
                  onMouseEnter={playHoverSound}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    hardwareAcceleration ? 'bg-[#a684ff]' : 'bg-white/10'
                  }`}
                >
                  <div className={`bg-[#0d0b1a] w-4 h-4 rounded-full shadow-md transform duration-200 ${
                    hardwareAcceleration ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Option 4 */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="text-xs font-bold text-white tracking-wide uppercase">Discord Rich Presence Integration</div>
                  <div className="text-[11px] text-[#6a6a75] mt-0.5">Broadcast current game titles and active playtime to Discord.</div>
                </div>
                <button
                  onClick={() => {
                    playSelectSound();
                    setDiscordRichPresence(!discordRichPresence);
                    onNotify(`Discord presence preferences saved!`, 'info');
                  }}
                  onMouseEnter={playHoverSound}
                  className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    discordRichPresence ? 'bg-[#a684ff]' : 'bg-white/10'
                  }`}
                >
                  <div className={`bg-[#0d0b1a] w-4 h-4 rounded-full shadow-md transform duration-200 ${
                    discordRichPresence ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom informational banner */}
          <div className="flex gap-3 bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 text-[#8a8a95] text-xs">
            <Info size={16} className="text-[#a684ff] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              These client settings are saved locally to standard persistent memory and will migrate to your unified cloud sync profile once online synchronization is initialized.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

