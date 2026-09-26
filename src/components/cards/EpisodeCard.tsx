import React, { useState } from 'react';
import { Episode } from '../../types';
import { Play, Download, CheckCircle2, Loader2 } from 'lucide-react';

interface EpisodeCardProps {
  episode: Episode;
  isActive?: boolean;
  onPlay: (episode: Episode) => void;
  onDownload?: (episode: Episode) => void;
  isDownloaded?: boolean;
  className?: string;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  isActive = false,
  onPlay,
  onDownload,
  isDownloaded = false,
  className = ''
}) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloaded || downloading) return;
    setDownloading(true);

    let current = 15;
    const interval = setInterval(() => {
      current += 25;
      if (current >= 100) {
        clearInterval(interval);
        setDownloading(false);
        if (onDownload) onDownload(episode);
      } else {
        setProgress(current);
      }
    }, 350);
  };

  return (
    <div
      onClick={() => onPlay(episode)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onPlay(episode)}
      className={`group flex items-center justify-between gap-3 p-2.5 rounded-2xl cursor-pointer select-none transition-all duration-200 active:scale-[0.98] ${
        isActive
          ? 'bg-amber-500/10 ring-1 ring-[#F5B301]/40'
          : 'bg-[#111118] hover:bg-[#161622] shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
      } ${className}`}
    >
      {/* Thumbnail with duration */}
      <div className="relative w-28 sm:w-32 aspect-video shrink-0 rounded-xl overflow-hidden bg-slate-900 shadow-md">
        <img
          src={episode.thumbnail}
          alt={episode.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors flex items-center justify-center">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
              isActive
                ? 'bg-[#F5B301] text-slate-950 shadow-md shadow-[#F5B301]/50'
                : 'bg-black/70 text-[#F5B301]'
            }`}
          >
            <Play size={13} className="fill-current ml-0.5" />
          </div>
        </div>

        {/* Runtime tag */}
        <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-300">
          {episode.duration}
        </div>

        {/* Progress bar if partially watched */}
        {episode.watchedProgress !== undefined && episode.watchedProgress > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-black/60">
            <div
              className="h-full bg-[#F5B301]"
              style={{ width: `${Math.round(episode.watchedProgress * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Episode Details */}
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-1.5">
          <h4
            className={`text-xs font-bold truncate transition-colors ${
              isActive ? 'text-[#F5B301]' : 'text-slate-100 group-hover:text-[#F5B301]'
            }`}
          >
            {episode.episodeNumber}. {episode.title}
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed font-normal">
          {episode.description}
        </p>
      </div>

      {/* Download Action Button for TV Episode */}
      <button
        type="button"
        onClick={handleDownloadClick}
        disabled={isDownloaded || downloading}
        aria-label={`Download Episode ${episode.episodeNumber}`}
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
          isDownloaded
            ? 'bg-amber-500/15 text-[#F5B301]'
            : downloading
            ? 'bg-white/10 text-amber-300'
            : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10'
        }`}
      >
        {isDownloaded ? (
          <CheckCircle2 size={16} className="text-[#F5B301]" />
        ) : downloading ? (
          <div className="flex flex-col items-center">
            <Loader2 size={14} className="animate-spin text-[#F5B301]" />
            <span className="text-[8px] font-mono font-bold text-amber-300">{progress}%</span>
          </div>
        ) : (
          <Download size={15} />
        )}
      </button>
    </div>
  );
};
