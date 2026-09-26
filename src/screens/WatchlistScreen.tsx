import React, { useState } from 'react';
import { MediaItem } from '../types';
import { RatingBadge } from '../components/common/RatingBadge';
import { Bookmark, Play, Trash2, Film, Tv, Sparkles } from 'lucide-react';

interface WatchlistScreenProps {
  watchlistItems: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  onPlayMedia: (item: MediaItem) => void;
  onRemoveFromWatchlist: (item: MediaItem) => void;
  onExplore: () => void;
}

export const WatchlistScreen: React.FC<WatchlistScreenProps> = ({
  watchlistItems,
  onSelectMedia,
  onPlayMedia,
  onRemoveFromWatchlist,
  onExplore
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'movie' | 'series'>('all');

  const filteredItems = watchlistItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  return (
    <div className="w-full min-h-screen pb-24 bg-[#08080a] text-slate-100 select-none">
      {/* Top Header - Smooth Blending */}
      <div className="sticky top-0 z-30 px-5 pt-3 pb-3 bg-[#08080a]/95 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Bookmark size={20} className="text-[#F5B301] fill-[#F5B301]" />
            <span>My Watchlist</span>
          </h1>
          <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full ring-1 ring-[#F5B301]/20">
            {watchlistItems.length} saved
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeFilter === 'all'
                ? 'bg-[#F5B301] text-slate-950 font-bold shadow-sm'
                : 'bg-white/[0.05] text-slate-400 hover:text-white'
            }`}
          >
            All ({watchlistItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('movie')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeFilter === 'movie'
                ? 'bg-[#F5B301] text-slate-950 font-bold shadow-sm'
                : 'bg-white/[0.05] text-slate-400 hover:text-white'
            }`}
          >
            <Film size={12} />
            <span>Movies ({watchlistItems.filter((i) => i.type === 'movie').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('series')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeFilter === 'series'
                ? 'bg-[#F5B301] text-slate-950 font-bold shadow-sm'
                : 'bg-white/[0.05] text-slate-400 hover:text-white'
            }`}
          >
            <Tv size={12} />
            <span>Series ({watchlistItems.filter((i) => i.type === 'series').length})</span>
          </button>
        </div>
      </div>

      {/* Watchlist Body Grid - Zero Overlap */}
      <div className="px-5 pt-1">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pb-12">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#111118] shadow-[0_6px_20px_rgba(0,0,0,0.6)] min-w-0 w-full"
              >
                {/* Poster Thumbnail */}
                <div
                  className="relative aspect-[2/3] w-full cursor-pointer overflow-hidden"
                  onClick={() => onSelectMedia(item)}
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-black/30 pointer-events-none" />

                  {/* Rating Top-Right */}
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-lg shadow-sm">
                    <RatingBadge rating={item.rating} size="sm" />
                  </div>

                  {/* Type Tag Top-Left */}
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] font-bold text-amber-300 capitalize">
                    {item.type}
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayMedia(item);
                      }}
                      className="w-10 h-10 rounded-full bg-[#F5B301] text-slate-950 flex items-center justify-center shadow-lg shadow-[#F5B301]/50 cursor-pointer transform scale-90 group-hover:scale-100 transition-transform"
                    >
                      <Play size={18} className="fill-slate-950 ml-0.5" />
                    </button>
                  </div>

                  {/* Bottom Title */}
                  <div className="absolute bottom-0 inset-x-0 p-2.5">
                    <h3 className="text-xs font-semibold text-white truncate drop-shadow-sm group-hover:text-[#F5B301] transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span>{item.year}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="truncate">{item.genres[0] || 'Feature'}</span>
                    </div>
                  </div>
                </div>

                {/* Remove Card Action Bar */}
                <div className="p-2 bg-[#0d0d14] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onPlayMedia(item)}
                    className="text-[11px] font-bold text-[#F5B301] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Play size={10} className="fill-[#F5B301]" />
                    <span>Watch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveFromWatchlist(item)}
                    aria-label={`Remove ${item.title}`}
                    className="p-1 rounded-md text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Watchlist State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-[#F5B301] mb-4">
              <Bookmark size={28} />
            </div>
            <h3 className="text-base font-bold text-white">Your watchlist is empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Explore trending blockbuster movies and award-winning series to save them for later offline viewing.
            </p>
            <button
              type="button"
              onClick={onExplore}
              className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC72C] via-[#F5B301] to-[#E69E00] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#F5B301]/30 cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles size={14} />
              <span>Explore Trending Movies</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
