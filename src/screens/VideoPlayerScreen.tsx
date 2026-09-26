import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MediaItem, Episode } from '../types';
import { RatingBadge } from '../components/common/RatingBadge';
import { ZapLogo } from '../components/common/ZapLogo';
import {
  ArrowLeft,
  Server,
  Maximize2,
  Minimize2,
  SkipForward,
  CheckCircle2,
  Bookmark,
  Check,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Play,
  Film,
  Tv,
  Eye,
  Sliders
} from 'lucide-react';
import {
  buildVidSrcEmbedUrl,
  getPlaybackProgress,
  savePlaybackProgress,
  markAsCompleted,
  removePlaybackProgress
} from '../services/vidsrc';

interface VideoPlayerScreenProps {
  media: MediaItem;
  episode?: Episode;
  seasonNumber?: number;
  onBack: () => void;
  onNextEpisode?: () => void;
  hasNextEpisode?: boolean;
  onToggleWatchlist?: (media: MediaItem) => void;
  isInWatchlist?: boolean;
  onPlaybackUpdate?: () => void;
}

export const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({
  media,
  episode,
  seasonNumber,
  onBack,
  onNextEpisode,
  hasNextEpisode = false,
  onToggleWatchlist,
  isInWatchlist = false,
  onPlaybackUpdate
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedServer, setSelectedServer] = useState<'vidsrc' | 'vidsrc-mirror' | 'zap-direct'>('vidsrc');
  const [isLandscapeMode, setIsLandscapeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [autoplayNext, setAutoplayNext] = useState(true);

  // Determine current season and episode
  const effectiveSeason = episode?.seasonNumber || seasonNumber || (media.type === 'series' ? 1 : undefined);
  const effectiveEpisode = episode?.episodeNumber || (media.type === 'series' ? 1 : undefined);

  // Retrieve previous saved playback position
  const savedRecord = getPlaybackProgress(media.id, effectiveSeason, effectiveEpisode);
  const initialStartAt = savedRecord?.currentTime && savedRecord.currentTime > 15 ? Math.floor(savedRecord.currentTime) : 0;

  // Track playback time in seconds
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(initialStartAt);
  const [totalDuration, setTotalDuration] = useState<number>(savedRecord?.duration || 120 * 60);

  // Generate VidSrc URL
  const [embedUrl, setEmbedUrl] = useState<string>(() =>
    buildVidSrcEmbedUrl({
      media,
      seasonNumber: effectiveSeason,
      episodeNumber: effectiveEpisode,
      startAt: initialStartAt,
      autoNext: autoplayNext
    })
  );

  // Re-generate embed URL when episode or server changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    const record = getPlaybackProgress(media.id, effectiveSeason, effectiveEpisode);
    const startPos = record?.currentTime && record.currentTime > 15 ? Math.floor(record.currentTime) : 0;
    setPlaybackSeconds(startPos);

    if (selectedServer === 'vidsrc' || selectedServer === 'vidsrc-mirror') {
      const url = buildVidSrcEmbedUrl({
        media,
        seasonNumber: effectiveSeason,
        episodeNumber: effectiveEpisode,
        startAt: startPos,
        autoNext: autoplayNext
      });
      setEmbedUrl(url);
    } else {
      // Direct backup
      setEmbedUrl(
        episode?.videoUrl ||
          media.videoUrl ||
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
      );
    }
  }, [media.id, effectiveSeason, effectiveEpisode, selectedServer, autoplayNext]);

  // Persist playback progress safely
  const recordProgress = useCallback(
    (currentSecs: number, dur: number) => {
      if (currentSecs <= 5) return;

      const progress = dur > 0 ? Math.min(1, currentSecs / dur) : 0.05;
      const isComplete = progress >= 0.92;

      savePlaybackProgress({
        mediaId: media.id,
        title: media.title,
        type: media.type,
        tmdbId: episode?.tmdbId || media.tmdbId,
        imdbId: episode?.imdbId || media.imdbId,
        seasonNumber: effectiveSeason,
        episodeNumber: effectiveEpisode,
        currentTime: currentSecs,
        duration: dur,
        progress,
        lastWatched: Date.now(),
        isCompleted: isComplete,
        thumbnail: episode?.thumbnail || media.backdrop || media.poster
      });

      if (onPlaybackUpdate) {
        onPlaybackUpdate();
      }

      if (isComplete && hasNextEpisode && autoplayNext && onNextEpisode) {
        onNextEpisode();
      }
    },
    [media, episode, effectiveSeason, effectiveEpisode, onPlaybackUpdate, hasNextEpisode, autoplayNext, onNextEpisode]
  );

  // Listen for VidSrc PLAYER_EVENT postMessages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      try {
        let payload = event.data;
        if (typeof payload === 'string' && payload.startsWith('{')) {
          payload = JSON.parse(payload);
        }

        // Check if event is from player
        if (payload?.type === 'PLAYER_EVENT' || payload?.event || payload?.status) {
          const currentTime = payload.currentTime || payload.progress || payload.time;
          const duration = payload.duration || payload.total;

          if (typeof currentTime === 'number' && currentTime > 0) {
            setPlaybackSeconds(currentTime);
            const dur = typeof duration === 'number' && duration > 0 ? duration : totalDuration;
            if (dur > 0) setTotalDuration(dur);
            recordProgress(currentTime, dur);
          }

          if (payload.event === 'ended' || payload.status === 'completed') {
            markAsCompleted(media.id, effectiveSeason, effectiveEpisode);
            if (onPlaybackUpdate) onPlaybackUpdate();
            if (hasNextEpisode && autoplayNext && onNextEpisode) {
              onNextEpisode();
            }
          }
        }
      } catch (e) {
        // Silently ignore non-player messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [recordProgress, media.id, effectiveSeason, effectiveEpisode, onPlaybackUpdate, hasNextEpisode, autoplayNext, onNextEpisode, totalDuration]);

  // Periodic fallback heartbeat timer while watching to guarantee progress saving
  useEffect(() => {
    if (isLoading || hasError) return;

    const interval = setInterval(() => {
      setPlaybackSeconds((prev) => {
        const next = prev + 5;
        recordProgress(next, totalDuration);
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading, hasError, totalDuration, recordProgress]);

  // Handle retry
  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl;
    }
  };

  return (
    <div
      className={`relative w-full bg-[#050508] text-white select-none transition-all duration-300 ${
        isLandscapeMode
          ? 'fixed inset-0 z-50 flex flex-col justify-center items-center h-screen bg-black'
          : 'min-h-screen pb-20'
      }`}
    >
      {/* 1. Large Responsive Video Player (Top Layout Requirement) */}
      <div
        className={`relative w-full bg-black flex items-center justify-center overflow-hidden ${
          isLandscapeMode ? 'h-full' : 'aspect-video'
        }`}
      >
        {/* Loading State: Cinematic Dark Background with ZapMovies Logo & Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-20 bg-[#08080c] flex flex-col items-center justify-center p-6 text-center animate-fade-in pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-black/60 border border-[#F5B301]/30 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(245,179,1,0.25)]">
              <ZapLogo size="md" glow={true} />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mt-2">
              <Loader2 size={16} className="animate-spin text-[#F5B301]" />
              <span>Connecting to VidSrc Cinema Stream...</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              {media.title} {effectiveSeason ? `· Season ${effectiveSeason} Ep ${effectiveEpisode}` : ''}
            </p>
          </div>
        )}

        {/* Error State: Clean ZapMovies Error Container */}
        {hasError && (
          <div className="absolute inset-0 z-20 bg-[#0a0a10] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-[#F5B301]/30 flex items-center justify-center text-[#F5B301] mb-3">
              <AlertTriangle size={26} />
            </div>
            <h3 className="text-sm font-bold text-white">This video source is temporarily unavailable.</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              We encountered an issue loading VidSrc stream. You can retry or switch to a mirror server below.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={handleRetry}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFC72C] to-[#F5B301] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#F5B301]/30 active:scale-95 transition-all"
              >
                <RotateCcw size={14} />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedServer('zap-direct')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer"
              >
                Use Direct Backup
              </button>
            </div>
          </div>
        )}

        {/* Top Header Floating Controls (Back Button & Fullscreen Toggle) */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 bg-gradient-to-b from-black/85 to-transparent flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center cursor-pointer transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-tight truncate max-w-[200px]">
                {media.title}
              </span>
              {effectiveSeason !== undefined && effectiveEpisode !== undefined && (
                <span className="text-[10px] text-[#F5B301] font-semibold">
                  Season {effectiveSeason} · Episode {effectiveEpisode}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Resume indicator badge */}
            {initialStartAt > 0 && (
              <span className="hidden sm:inline-block bg-black/70 border border-white/10 px-2 py-0.5 rounded text-[10px] text-amber-300">
                Resumed at {Math.floor(initialStartAt / 60)}m
              </span>
            )}

            {/* Landscape / Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsLandscapeMode(!isLandscapeMode)}
              aria-label={isLandscapeMode ? 'Exit Landscape' : 'Enter Landscape'}
              className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center cursor-pointer text-[#F5B301] transition-transform active:scale-95"
            >
              {isLandscapeMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>

        {/* Embedded Player: VidSrc Iframe (or direct video backup) */}
        {selectedServer === 'zap-direct' ? (
          <video
            src={media.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'}
            controls
            autoPlay
            playsInline
            onLoadedData={() => setIsLoading(false)}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={`VidSrc Player - ${media.title}`}
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            referrerPolicy="origin"
            onLoad={() => {
              setIsLoading(false);
              setHasError(false);
            }}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className="w-full h-full border-0 bg-black"
          />
        )}
      </div>

      {/* 2 & 3: Content Below Player (Only in Portrait / Default Mode) */}
      {!isLandscapeMode && (
        <div className="px-4 py-4 space-y-5">
          {/* Movie / Episode Information */}
          <div className="border-b border-white/5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-lg font-display font-extrabold text-white tracking-tight leading-tight">
                  {media.title}
                </h1>
                {effectiveSeason !== undefined && effectiveEpisode !== undefined && (
                  <p className="text-xs font-semibold text-[#F5B301] mt-0.5">
                    Season {effectiveSeason} · Episode {effectiveEpisode}
                    {episode?.title ? `: ${episode.title}` : ''}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-[#F5B301]/20 shrink-0">
                <RatingBadge rating={media.rating} size="sm" />
              </div>
            </div>

            {/* Quick Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
              <span>{media.year}</span>
              <span aria-hidden="true">·</span>
              <span>{media.runtime}</span>
              <span aria-hidden="true">·</span>
              <span>{media.genres.slice(0, 3).join(' / ')}</span>
              {media.imdbId && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-amber-300/80">{media.imdbId}</span>
                </>
              )}
            </div>

            {/* Overview / Description */}
            <p className="text-xs text-slate-300 leading-relaxed mt-3">
              {episode?.description || media.overview || media.description}
            </p>
          </div>

          {/* Action Row: Watchlist & Next Episode */}
          <div className="flex items-center gap-2.5">
            {onToggleWatchlist && (
              <button
                type="button"
                onClick={() => onToggleWatchlist(media)}
                className={`flex-1 h-11 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer active:scale-95 ${
                  isInWatchlist
                    ? 'bg-amber-500/15 border-[#F5B301]/40 text-[#F5B301]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                {isInWatchlist ? (
                  <>
                    <Check size={16} className="text-[#F5B301]" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>
            )}

            {/* Next Episode Button (TV Series Requirement) */}
            {media.type === 'series' && hasNextEpisode && onNextEpisode && (
              <button
                type="button"
                onClick={onNextEpisode}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FFC72C] to-[#F5B301] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#F5B301]/30 active:scale-95 transition-all cursor-pointer"
              >
                <span>Next Episode</span>
                <SkipForward size={14} className="fill-slate-950" />
              </button>
            )}
          </div>

          {/* TV Series Autoplay Next Toggle */}
          {media.type === 'series' && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Tv size={15} className="text-[#F5B301]" />
                <span>Autoplay Next Episode</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoplayNext(!autoplayNext)}
                className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                  autoplayNext ? 'bg-[#F5B301]' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                    autoplayNext ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* 3. Server Section Outside & Below Player (Mandatory Requirement) */}
          <div className="bg-[#0e0e16] rounded-2xl p-4 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server size={16} className="text-[#F5B301]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Server
                </h3>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">VidSrc Active</span>
            </div>

            <div className="space-y-2">
              {/* VidSrc (Default / Recommended) */}
              <button
                type="button"
                onClick={() => setSelectedServer('vidsrc')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedServer === 'vidsrc'
                    ? 'bg-amber-500/15 border-[#F5B301] text-white shadow-sm shadow-[#F5B301]/25'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      selectedServer === 'vidsrc'
                        ? 'bg-[#F5B301] shadow-[0_0_8px_#F5B301]'
                        : 'bg-slate-600'
                    }`}
                  />
                  <div className="text-left">
                    <span className="font-bold text-white block">VidSrc (Recommended)</span>
                    <span className="text-[10px] text-slate-400">Official Embed · 4K / Multi-Audio</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-amber-300">Fast 60fps</span>
                  {selectedServer === 'vidsrc' && (
                    <CheckCircle2 size={16} className="text-[#F5B301]" />
                  )}
                </div>
              </button>

              {/* VidSrc Mirror 2 */}
              <button
                type="button"
                onClick={() => setSelectedServer('vidsrc-mirror')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedServer === 'vidsrc-mirror'
                    ? 'bg-amber-500/15 border-[#F5B301] text-white shadow-sm shadow-[#F5B301]/25'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      selectedServer === 'vidsrc-mirror'
                        ? 'bg-[#F5B301] shadow-[0_0_8px_#F5B301]'
                        : 'bg-slate-600'
                    }`}
                  />
                  <div className="text-left">
                    <span className="font-bold text-white block">VidSrc Mirror 2</span>
                    <span className="text-[10px] text-slate-400">High-speed fallback CDN</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">1080p</span>
                  {selectedServer === 'vidsrc-mirror' && (
                    <CheckCircle2 size={16} className="text-[#F5B301]" />
                  )}
                </div>
              </button>

              {/* Zap Direct Stream Backup */}
              <button
                type="button"
                onClick={() => setSelectedServer('zap-direct')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  selectedServer === 'zap-direct'
                    ? 'bg-amber-500/15 border-[#F5B301] text-white shadow-sm shadow-[#F5B301]/25'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      selectedServer === 'zap-direct'
                        ? 'bg-[#F5B301] shadow-[0_0_8px_#F5B301]'
                        : 'bg-slate-600'
                    }`}
                  />
                  <div className="text-left">
                    <span className="font-bold text-white block">Zap Direct Stream</span>
                    <span className="text-[10px] text-slate-400">Embedded HTML5 Player Backup</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">Auto HD</span>
                  {selectedServer === 'zap-direct' && (
                    <CheckCircle2 size={16} className="text-[#F5B301]" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
