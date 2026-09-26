import React from 'react';
import { ContinueWatchingItem } from '../../types';
import { Play } from 'lucide-react';

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
  onResume: (item: ContinueWatchingItem) => void;
  className?: string;
}

export const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({
  item,
  onResume,
  className = ''
}) => {
  return (
    <div
      onClick={() => onResume(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onResume(item)}
      className={`group relative flex flex-col shrink-0 w-60 min-w-[240px] max-w-[240px] cursor-pointer select-none transition-transform duration-200 active:scale-[0.97] ${className}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#111118] ring-1 ring-white/[0.06] shadow-[0_8px_20px_rgba(0,0,0,0.6)] group-hover:ring-[#F5B301]/40 transition-all duration-300">
        <img
          src={item.thumbnail}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/25 to-black/20 pointer-events-none" />

        {/* Centered Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md ring-1 ring-white/15 text-[#F5B301] flex items-center justify-center group-hover:bg-[#F5B301] group-hover:text-slate-950 group-hover:ring-[#F5B301] group-hover:scale-110 shadow-lg transition-all duration-200">
            <Play size={18} className="fill-current ml-0.5" />
          </div>
        </div>

        {/* Remaining Time Tag */}
        <div className="absolute top-2 right-2 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-medium text-slate-300 ring-1 ring-white/10">
          {item.remainingTime}
        </div>

        {/* Golden Progress Bar at the bottom of the card */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/70 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFC72C] to-[#F5B301] shadow-[0_0_8px_rgba(245,179,1,0.8)] transition-all duration-300"
            style={{ width: `${Math.round(item.progress * 100)}%` }}
          />
        </div>
      </div>

      {/* Title & Info */}
      <div className="mt-2 px-1 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-[#F5B301] transition-colors">
            {item.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 font-medium">
            {item.seasonEpisode && (
              <>
                <span className="text-amber-400/90 font-semibold">{item.seasonEpisode}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
              </>
            )}
            <span className="text-[#F5B301] font-mono">
              {item.percentage !== undefined ? item.percentage : Math.round(item.progress * 100)}% watched
            </span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onResume(item);
          }}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#F5B301] hover:text-slate-950 text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Play size={9} className="fill-current" />
          <span>Continue</span>
        </button>
      </div>
    </div>
  );
};
