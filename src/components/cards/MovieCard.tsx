import React from 'react';
import { MediaItem } from '../../types';
import { RatingBadge } from '../common/RatingBadge';
import { Play } from 'lucide-react';

interface MovieCardProps {
  movie: MediaItem;
  onClick: (movie: MediaItem) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isGrid?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onClick,
  size = 'md',
  className = '',
  isGrid = false
}) => {
  // If in grid mode or w-full passed, never restrict min-w/max-w so grid columns NEVER overlap!
  const isGridMode = isGrid || className.includes('w-full');

  const carouselSizes = {
    sm: 'w-28 min-w-[112px] max-w-[112px] shrink-0',
    md: 'w-34 min-w-[136px] max-w-[136px] shrink-0',
    lg: 'w-40 min-w-[160px] max-w-[160px] shrink-0'
  };

  const layoutClass = isGridMode
    ? 'w-full min-w-0 max-w-full'
    : carouselSizes[size];

  return (
    <div
      onClick={() => onClick(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(movie)}
      className={`group relative flex flex-col cursor-pointer select-none transition-transform duration-200 active:scale-[0.97] ${layoutClass} ${className}`}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#111118] shadow-[0_6px_20px_rgba(0,0,0,0.6)] group-hover:shadow-[0_8px_25px_rgba(245,179,1,0.25)] transition-all duration-300">
        <img
          src={movie.poster}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Cinematic Soft Ambient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-black/20 to-transparent pointer-events-none" />

        {/* Floating Rating Top-Right */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-lg shadow-sm">
          <RatingBadge rating={movie.rating} size="sm" />
        </div>

        {/* Play Icon Reveal on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
          <div className="w-10 h-10 rounded-full bg-[#F5B301] text-slate-950 flex items-center justify-center shadow-lg shadow-[#F5B301]/40 transform scale-80 group-hover:scale-100 transition-transform duration-200">
            <Play size={18} className="fill-slate-950 ml-0.5" />
          </div>
        </div>

        {/* Bottom Details Inside Poster */}
        <div className="absolute bottom-0 inset-x-0 p-2.5">
          <h3 className="text-xs font-semibold text-white truncate drop-shadow-sm group-hover:text-[#F5B301] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 font-medium">
            <span>{movie.year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="truncate">{movie.genres[0] || 'Feature'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
