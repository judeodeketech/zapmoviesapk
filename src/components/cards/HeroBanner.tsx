import React, { useState, useEffect } from 'react';
import { MediaItem } from '../../types';
import { Play, Plus, Check, Info } from 'lucide-react';
import { RatingBadge } from '../common/RatingBadge';

interface HeroBannerProps {
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onDetails: (item: MediaItem) => void;
  onToggleWatchlist?: (item: MediaItem) => void;
  isInWatchlist?: (id: string) => boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  items,
  onPlay,
  onDetails,
  onToggleWatchlist,
  isInWatchlist
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance hero carousel gently every 7 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items.length) return null;
  const currentItem = items[currentIndex];
  const inWatchlist = isInWatchlist ? isInWatchlist(currentItem.id) : false;

  return (
    <div className="relative px-4 pt-1 pb-3">
      {/* Hero Card Container - Seamless, zero robotic border */}
      <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-950 shadow-[0_16px_40px_rgba(0,0,0,0.85)] group">
        {/* Backdrop Image */}
        <img
          src={currentItem.backdrop}
          alt={currentItem.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
        />

        {/* Cinematic Multi-stop Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a]/65 via-transparent to-black/35 pointer-events-none" />

        {/* Central Play Pulse Trigger */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-[#F5B301] text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(245,179,1,0.6)] backdrop-blur-sm transform transition-all group-hover:scale-110">
            <Play size={26} className="fill-slate-950 ml-1" />
          </div>
        </div>

        {/* Top Badges - Organic rounded pill, zero robotic border lines */}
        <div className="absolute top-3.5 inset-x-4 flex items-center justify-between">
          <div className="bg-black/65 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#F5B301] shadow-[0_0_6px_#F5B301] animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-wider text-amber-300 uppercase">
              Zap Spotlight
            </span>
          </div>
          <div className="bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md">
            <RatingBadge rating={currentItem.rating} size="sm" />
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="absolute bottom-0 inset-x-0 p-4.5 flex flex-col justify-end">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-1 font-medium">
            <span>{currentItem.year}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="capitalize">{currentItem.type}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>{currentItem.genres.slice(0, 2).join(', ')}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
            {currentItem.title}
          </h1>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2.5 mt-3">
            <button
              type="button"
              onClick={() => onPlay(currentItem)}
              className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#FFC72C] via-[#F5B301] to-[#E69E00] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(245,179,1,0.4)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play size={14} className="fill-slate-950" />
              <span>Watch Now</span>
            </button>

            {onToggleWatchlist && (
              <button
                type="button"
                onClick={() => onToggleWatchlist(currentItem)}
                aria-label={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                className="h-10 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white backdrop-blur-md text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
              >
                {inWatchlist ? (
                  <>
                    <Check size={14} className="text-[#F5B301]" />
                    <span className="hidden sm:inline text-amber-300">Added</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span className="hidden sm:inline">Watchlist</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => onDetails(currentItem)}
              aria-label="More details"
              className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/15 text-white backdrop-blur-md flex items-center justify-center active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Info size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Dots */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-[#F5B301]'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
