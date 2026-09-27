import React, { useState } from 'react';
import { MediaItem } from '../types';
import { RatingBadge } from '../components/common/RatingBadge';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { MovieCard } from '../components/cards/MovieCard';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  Play,
  Eye,
  Download,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';

interface MovieDetailsScreenProps {
  movie: MediaItem;
  recommendedMovies: MediaItem[];
  onBack: () => void;
  onPlay: (movie: MediaItem) => void;
  onSelectMovie: (movie: MediaItem) => void;
  onToggleWatchlist: (movie: MediaItem) => void;
  isInWatchlist: boolean;
  onDownloadMovie?: (movie: MediaItem) => void;
  isDownloaded?: boolean;
  onShare?: (movie: MediaItem) => void;
}

export const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({
  movie,
  recommendedMovies,
  onBack,
  onPlay,
  onSelectMovie,
  onToggleWatchlist,
  isInWatchlist,
  onDownloadMovie,
  isDownloaded = false,
  onShare
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = () => {
    if (isDownloaded || downloading) return;
    setDownloading(true);
    let prog = 10;
    const interval = setInterval(() => {
      prog += 25;
      if (prog >= 100) {
        clearInterval(interval);
        setDownloading(false);
        if (onDownloadMovie) onDownloadMovie(movie);
      } else {
        setDownloadProgress(prog);
      }
    }, 400);
  };

  return (
    <div className="relative w-full min-h-screen pb-28 bg-[#08080a] text-slate-100 select-none">
      {/* Top Floating App Bar */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 flex items-center justify-between pointer-events-auto">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md ring-1 ring-white/10 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleWatchlist(movie)}
            aria-label={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
              isInWatchlist
                ? 'bg-[#F5B301] text-slate-950 shadow-md shadow-[#F5B301]/40 ring-1 ring-[#F5B301]'
                : 'bg-black/60 text-white ring-1 ring-white/10 hover:bg-black/80'
            }`}
          >
            {isInWatchlist ? <Check size={18} /> : <Bookmark size={18} />}
          </button>
          <button
            type="button"
            onClick={() => onShare ? onShare(movie) : undefined}
            aria-label="Share movie"
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md ring-1 ring-white/10 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer active:scale-95"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Cinematic Top Backdrop Banner with Smooth Fade Scrim */}
      <div className="relative aspect-[16/11] w-full bg-slate-950 overflow-hidden">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />

        {/* Multi-tier Gradient to completely blend with background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Center Play Trigger */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onPlay(movie)}
            aria-label="Play Movie"
            className="w-16 h-16 rounded-full bg-[#F5B301] text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(245,179,1,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <Play size={28} className="fill-slate-950 ml-1" />
          </button>
        </div>
      </div>

      {/* Main Details Body - Zero overlap with backdrop */}
      <div className="px-5 pt-2 relative z-10">
        {/* Title & Stats */}
        <div className="flex flex-col">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {movie.title}
          </h1>

          {/* Quick Metrics Bar: Views & Rating */}
          <div className="flex items-center gap-3 text-xs mt-2 text-slate-300">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Eye size={13} className="text-slate-400" />
              <span>{movie.views} views</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg ring-1 ring-[#F5B301]/20">
              <RatingBadge rating={movie.rating} size="sm" />
            </div>
            <div className="px-1.5 py-0.5 rounded bg-white/5 ring-1 ring-white/10 text-[10px] font-bold text-slate-200 uppercase tracking-wider">
              4K Ultra HD
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-slate-400 font-medium">
            <span>{movie.year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{movie.runtime}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{movie.genres.join(' / ')}</span>
            {movie.director && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Dir. {movie.director}</span>
              </>
            )}
          </div>
        </div>

        {/* Synopsis Description */}
        <div className="mt-4 pt-2">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {movie.description}
          </p>
        </div>

        {/* Key Action Buttons: Watch Now, Watchlist, Share */}
        <div className="flex items-center gap-2.5 mt-5">
          <div className="flex-1">
            <PrimaryButton
              label="Watch Now"
              icon={<Play size={16} className="fill-slate-950" />}
              size="md"
              fullWidth
              onClick={() => onPlay(movie)}
            />
          </div>

          <button
            type="button"
            onClick={() => onToggleWatchlist(movie)}
            className={`h-12 px-4 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-semibold backdrop-blur-md ring-1 transition-all cursor-pointer active:scale-[0.98] ${
              isInWatchlist
                ? 'bg-amber-500/15 ring-[#F5B301]/40 text-[#F5B301]'
                : 'bg-white/5 ring-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isInWatchlist ? (
              <>
                <Check size={16} />
                <span className="hidden sm:inline">Saved</span>
              </>
            ) : (
              <>
                <Bookmark size={16} />
                <span className="hidden sm:inline">Watchlist</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onShare ? onShare(movie) : undefined}
            className="h-12 px-4 rounded-2xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-white flex items-center justify-center gap-1.5 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer active:scale-[0.98]"
          >
            <Share2 size={16} className="text-[#F5B301]" />
            <span>Share</span>
          </button>
        </div>

        {/* Offline Download Action Card */}
        <div className="mt-3 p-3 rounded-2xl bg-[#111118] ring-1 ring-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Download size={16} className="text-[#F5B301]" />
            <div>
              <span className="text-xs font-bold text-white block">Download for Offline</span>
              <span className="text-[10px] text-slate-400">1.4 GB · 1080p FHD Quality</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloaded || downloading}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDownloaded
                ? 'bg-amber-500/15 text-[#F5B301]'
                : downloading
                ? 'bg-white/10 text-amber-300'
                : 'bg-[#F5B301] text-slate-950 hover:bg-amber-400'
            }`}
          >
            {isDownloaded ? (
              <>
                <CheckCircle2 size={13} />
                <span>Downloaded</span>
              </>
            ) : downloading ? (
              <>
                <Loader2 size={13} className="animate-spin text-[#F5B301]" />
                <span>{downloadProgress}%</span>
              </>
            ) : (
              <>
                <Download size={13} />
                <span>Download</span>
              </>
            )}
          </button>
        </div>

        {/* Cast Members */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Cast & Crew
            </h3>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar touch-scroll pb-1">
              {movie.cast.map((actor, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center shrink-0 min-w-[76px] max-w-[76px] text-center"
                >
                  <div className="w-13 h-13 rounded-full bg-slate-800 ring-1 ring-white/10 flex items-center justify-center text-xs font-bold text-amber-300 mb-1.5 shadow-md overflow-hidden">
                    {actor.avatar ? (
                      <img src={actor.avatar} alt={actor.name} className="w-full h-full object-cover" />
                    ) : (
                      actor.name.split(' ').map((n) => n[0]).join('')
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-200 line-clamp-1 w-full">
                    {actor.name}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-1 w-full">{actor.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Movies Section - Locked width cards with zero overlap */}
        {recommendedMovies.length > 0 && (
          <div className="mt-7">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-[#F5B301]" />
              <span>Recommended Movies</span>
            </h3>
            <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
              {recommendedMovies.map((rec) => (
                <MovieCard
                  key={rec.id}
                  movie={rec}
                  onClick={onSelectMovie}
                  size="md"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Watch Bar */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#08080a] via-[#08080a]/95 to-transparent z-40 max-w-md mx-auto">
        <PrimaryButton
          label="Watch Now"
          icon={<Play size={18} className="fill-slate-950" />}
          size="lg"
          fullWidth
          onClick={() => onPlay(movie)}
        />
      </div>
    </div>
  );
};
