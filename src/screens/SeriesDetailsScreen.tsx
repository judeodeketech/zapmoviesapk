import React, { useState } from 'react';
import { MediaItem, Episode } from '../types';
import { RatingBadge } from '../components/common/RatingBadge';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { EpisodeCard } from '../components/cards/EpisodeCard';
import { SeriesCard } from '../components/cards/SeriesCard';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  Play,
  Eye,
  ChevronDown,
  Sparkles,
  Download,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface SeriesDetailsScreenProps {
  series: MediaItem;
  recommendedSeries: MediaItem[];
  onBack: () => void;
  onPlayEpisode: (series: MediaItem, episode: Episode) => void;
  onSelectSeries: (series: MediaItem) => void;
  onToggleWatchlist: (series: MediaItem) => void;
  isInWatchlist: boolean;
  onDownloadEpisode?: (series: MediaItem, episode: Episode) => void;
  downloadedEpisodeIds?: string[];
  onShare?: (series: MediaItem) => void;
}

export const SeriesDetailsScreen: React.FC<SeriesDetailsScreenProps> = ({
  series,
  recommendedSeries,
  onBack,
  onPlayEpisode,
  onSelectSeries,
  onToggleWatchlist,
  isInWatchlist,
  onDownloadEpisode,
  downloadedEpisodeIds = [],
  onShare
}) => {
  const seasons = series.seasons || [
    {
      seasonNumber: 1,
      title: 'Season 1',
      episodes: [
        {
          id: `${series.id}-s1-e1`,
          episodeNumber: 1,
          seasonNumber: 1,
          title: 'Pilot',
          duration: '52 min',
          thumbnail: series.backdrop,
          description: series.description,
          watchedProgress: 0.6,
          videoUrl: series.videoUrl
        }
      ]
    }
  ];

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(
    seasons[0]?.seasonNumber || 1
  );
  const [downloadingSeason, setDownloadingSeason] = useState(false);
  const [seasonDownloadSuccess, setSeasonDownloadSuccess] = useState(false);

  const activeSeason =
    seasons.find((s) => s.seasonNumber === selectedSeasonNumber) || seasons[0];
  const firstEpisode = activeSeason?.episodes[0];

  const handleDownloadEntireSeason = () => {
    if (downloadingSeason || seasonDownloadSuccess) return;
    setDownloadingSeason(true);

    setTimeout(() => {
      setDownloadingSeason(false);
      setSeasonDownloadSuccess(true);
      if (onDownloadEpisode) {
        activeSeason.episodes.forEach((ep) => {
          onDownloadEpisode(series, { ...ep, seasonNumber: selectedSeasonNumber });
        });
      }
    }, 1200);
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
            onClick={() => onToggleWatchlist(series)}
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
            onClick={() => onShare ? onShare(series) : undefined}
            aria-label="Share series"
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md ring-1 ring-white/10 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer active:scale-95"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Cinematic Top Backdrop Banner */}
      <div className="relative aspect-[16/11] w-full bg-slate-950 overflow-hidden">
        <img
          src={series.backdrop || series.poster}
          alt={series.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Backdrop Center Play Trigger for 1st episode */}
        {firstEpisode && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => onPlayEpisode(series, { ...firstEpisode, seasonNumber: selectedSeasonNumber })}
              aria-label="Play First Episode"
              className="w-16 h-16 rounded-full bg-[#F5B301] text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(245,179,1,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <Play size={28} className="fill-slate-950 ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Main Details Body - Zero overlap with backdrop */}
      <div className="px-5 pt-2 relative z-10">
        {/* Title & Stats */}
        <div className="flex flex-col">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {series.title}
          </h1>

          <div className="flex items-center gap-3 text-xs mt-2 text-slate-300">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Eye size={13} className="text-slate-400" />
              <span>{series.views} views</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg ring-1 ring-[#F5B301]/20">
              <RatingBadge rating={series.rating} size="sm" />
            </div>
            <div className="px-1.5 py-0.5 rounded bg-white/5 ring-1 ring-white/10 text-[10px] font-bold text-slate-200 uppercase tracking-wider">
              {series.runtime}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-slate-400 font-medium">
            <span>{series.year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{series.genres.join(' / ')}</span>
            {series.creator && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Created by {series.creator}</span>
              </>
            )}
          </div>
        </div>

        {/* Synopsis Description */}
        <div className="mt-4 pt-2">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {series.description}
          </p>
        </div>

        {/* Action Buttons: Watch Series, Watchlist, Share */}
        <div className="flex items-center gap-2.5 mt-5">
          {firstEpisode && (
            <button
              type="button"
              onClick={() => onPlayEpisode(series, { ...firstEpisode, seasonNumber: selectedSeasonNumber })}
              className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-[#FFC72C] to-[#F5B301] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#F5B301]/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play size={16} className="fill-slate-950" />
              <span>Watch Now</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onToggleWatchlist(series)}
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
            onClick={() => onShare ? onShare(series) : undefined}
            className="h-12 px-4 rounded-2xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-white flex items-center justify-center gap-1.5 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer active:scale-[0.98]"
          >
            <Share2 size={16} className="text-[#F5B301]" />
            <span>Share</span>
          </button>
        </div>

        {/* Season Download Banner */}
        <div className="mt-5 p-3 rounded-2xl bg-[#111118] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Download size={16} className="text-[#F5B301]" />
            <div>
              <span className="text-xs font-bold text-white block">Download {activeSeason.title}</span>
              <span className="text-[10px] text-slate-400">
                {activeSeason.episodes.length} Episodes · Save for offline viewing
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadEntireSeason}
            disabled={downloadingSeason || seasonDownloadSuccess}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              seasonDownloadSuccess
                ? 'bg-amber-500/15 text-[#F5B301]'
                : downloadingSeason
                ? 'bg-white/10 text-amber-300'
                : 'bg-[#F5B301] text-slate-950 hover:bg-amber-400'
            }`}
          >
            {seasonDownloadSuccess ? (
              <>
                <CheckCircle2 size={13} />
                <span>Downloaded</span>
              </>
            ) : downloadingSeason ? (
              <>
                <Loader2 size={13} className="animate-spin text-[#F5B301]" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download size={13} />
                <span>Get Season</span>
              </>
            )}
          </button>
        </div>

        {/* Season Selector & Episode List Header */}
        <div className="mt-6 pt-2">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Episodes ({activeSeason.episodes.length})
            </h2>

            {/* Season Selector Dropdown */}
            {seasons.length > 1 ? (
              <div className="relative inline-block">
                <select
                  value={selectedSeasonNumber}
                  onChange={(e) => setSelectedSeasonNumber(Number(e.target.value))}
                  className="appearance-none bg-[#14141e] ring-1 ring-white/15 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-amber-300 focus:outline-none focus:ring-[#F5B301] cursor-pointer"
                >
                  {seasons.map((s) => (
                    <option key={s.seasonNumber} value={s.seasonNumber} className="bg-slate-900 text-white">
                      Season {s.seasonNumber}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            ) : (
              <span className="text-xs font-semibold text-[#F5B301]">Season 1</span>
            )}
          </div>

          {/* Episode Cards List with Working Downloads */}
          <div className="flex flex-col gap-3">
            {activeSeason.episodes.map((ep) => {
              const epId = ep.id || `${series.id}-s${selectedSeasonNumber}-e${ep.episodeNumber}`;
              const isDownloaded = downloadedEpisodeIds.includes(epId);

              return (
                <EpisodeCard
                  key={ep.id}
                  episode={ep}
                  onPlay={(episode) =>
                    onPlayEpisode(series, { ...episode, seasonNumber: selectedSeasonNumber })
                  }
                  onDownload={(episode) => {
                    if (onDownloadEpisode) {
                      onDownloadEpisode(series, { ...episode, seasonNumber: selectedSeasonNumber });
                    }
                  }}
                  isDownloaded={isDownloaded}
                />
              );
            })}
          </div>
        </div>

        {/* Cast & Crew */}
        {series.cast && series.cast.length > 0 && (
          <div className="mt-7">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Cast
            </h3>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar touch-scroll pb-1">
              {series.cast.map((actor, idx) => (
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

        {/* Recommended Series - Zero Overlap */}
        {recommendedSeries.length > 0 && (
          <div className="mt-7">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-[#F5B301]" />
              <span>More Like This</span>
            </h3>
            <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
              {recommendedSeries.map((rec) => (
                <SeriesCard
                  key={rec.id}
                  series={rec}
                  onClick={onSelectSeries}
                  size="md"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Watch Button */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#08080a] via-[#08080a]/95 to-transparent z-40 max-w-md mx-auto">
        <PrimaryButton
          label={`Watch ${activeSeason.title} · Ep 1`}
          icon={<Play size={18} className="fill-slate-950" />}
          size="lg"
          fullWidth
          onClick={() => firstEpisode && onPlayEpisode(series, { ...firstEpisode, seasonNumber: selectedSeasonNumber })}
        />
      </div>
    </div>
  );
};
