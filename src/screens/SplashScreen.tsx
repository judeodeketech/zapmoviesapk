import React from 'react';
import { ZapLogo } from '../components/common/ZapLogo';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Play } from 'lucide-react';
import { MOCK_MEDIA } from '../data/mockData';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col justify-between items-center p-6 overflow-hidden bg-[#060609] select-none">
      {/* Tilted / Isometric Movie Posters Background Grid with Smooth Vignette */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4 transform -rotate-6 scale-105">
          {MOCK_MEDIA.slice(0, 12).map((item, idx) => (
            <div
              key={idx}
              className="aspect-[2/3] rounded-2xl overflow-hidden bg-[#101018] ring-1 ring-white/10 shadow-2xl"
            >
              <img
                src={item.poster}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-75"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark Vignette Overlays that Blend Seamlessly */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_15%,_#060609_80%] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060609] via-transparent to-[#060609] pointer-events-none" />

      {/* Golden Ambient Glow Behind Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F5B301]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Brand Pill */}
      <div className="relative z-10 pt-3 flex items-center gap-1.5 text-[11px] text-amber-400 font-bold tracking-widest uppercase bg-black/40 px-3 py-1 rounded-full ring-1 ring-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F5B301]" />
        <span>Android Jetpack Edition</span>
      </div>

      {/* Center Cinematic Logo Section */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto">
        <div className="transform transition-transform hover:scale-105 duration-300">
          <ZapLogo size="xl" glow={true} />
        </div>

        <div className="mt-6 flex flex-col items-center">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-xl">
            ZAP<span className="text-[#F5B301]">MOVIES</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xs font-normal leading-relaxed">
            Unlimited blockbusters, trending series, and originals. Stream in pure 4K cinema quality.
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 w-full max-w-xs flex flex-col gap-3 pb-4">
        <PrimaryButton
          label="Start Streaming"
          icon={<Play size={18} className="fill-slate-950" />}
          size="lg"
          fullWidth
          onClick={onEnter}
        />
        <div className="text-center">
          <span className="text-[10px] text-slate-500 font-medium">
            ZapMovies Android Version
          </span>
        </div>
      </div>
    </div>
  );
};
