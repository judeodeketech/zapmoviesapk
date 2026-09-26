import React, { useState } from 'react';
import { Smartphone, Monitor, Code2, RotateCw } from 'lucide-react';
import { AndroidStatusBar } from '../navigation/AndroidStatusBar';
import { AndroidGestureBar } from '../navigation/AndroidGestureBar';

interface PhoneFrameProps {
  children: React.ReactNode;
  onOpenCodeInspector: () => void;
  isLandscape?: boolean;
  onToggleLandscape?: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  onOpenCodeInspector,
  isLandscape = false,
  onToggleLandscape
}) => {
  const [deviceMode, setDeviceMode] = useState<'phone' | 'fullscreen'>('phone');

  return (
    <div className="w-full min-h-screen bg-[#050508] flex flex-col items-center justify-start text-slate-100">
      {/* Top Studio Control Bar for previewing on desktop */}
      <header className="w-full bg-[#0a0a0f] border-b border-white/10 px-4 py-2.5 flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5B301] shadow-[0_0_8px_#F5B301]" />
            <span className="text-xs font-bold tracking-tight text-white uppercase">
              ZapMovies Android Preview
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-slate-400 border-l border-white/10 pl-3">
            Jetpack Compose UI & Design Language
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Kotlin Code Inspector Button */}
          <button
            type="button"
            onClick={onOpenCodeInspector}
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-[#F5B301]/40 text-[#F5B301] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Code2 size={14} />
            <span className="hidden sm:inline">Kotlin Compose Code</span>
            <span className="sm:hidden">Compose</span>
          </button>

          {/* Mode Switch: Phone Frame vs Full Web */}
          <div className="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => setDeviceMode('phone')}
              title="Android Phone Mockup"
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
                deviceMode === 'phone'
                  ? 'bg-[#F5B301] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span className="hidden md:inline">Phone Frame</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('fullscreen')}
              title="Responsive Edge-to-Edge"
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
                deviceMode === 'fullscreen'
                  ? 'bg-[#F5B301] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor size={14} />
              <span className="hidden md:inline">Full Width</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        {deviceMode === 'phone' ? (
          /* Pixel 9 Pro Style Device Mockup */
          <div className="relative w-full max-w-[420px] aspect-[9/19.5] max-h-[890px] h-full bg-black rounded-[44px] p-2.5 shadow-[0_25px_80px_rgba(0,0,0,0.9),_0_0_50px_rgba(245,179,1,0.08)] ring-1 ring-white/15 border-4 border-[#24242d] flex flex-col overflow-hidden transition-all duration-300">
            {/* Inner Screen Bezel */}
            <div className="relative flex-1 w-full h-full bg-[#08080a] rounded-[36px] overflow-hidden flex flex-col">
              {/* Android System Status Bar */}
              <AndroidStatusBar />

              {/* Screen Content Scrollable Area */}
              <div className="flex-1 w-full overflow-y-auto no-scrollbar touch-scroll relative">
                {children}
              </div>

              {/* Android Gesture Pill Navigation */}
              <AndroidGestureBar />
            </div>
          </div>
        ) : (
          /* Full Width Responsive View */
          <div className="w-full max-w-2xl min-h-screen bg-[#08080a] border-x border-white/5 flex flex-col relative overflow-hidden shadow-2xl">
            <AndroidStatusBar />
            <div className="flex-1 w-full overflow-y-auto no-scrollbar touch-scroll">
              {children}
            </div>
            <AndroidGestureBar />
          </div>
        )}
      </main>
    </div>
  );
};
