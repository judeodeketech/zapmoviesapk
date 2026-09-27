import React, { useState, useEffect, useCallback } from 'react';
import { MediaItem, ContinueWatchingItem, Episode, ScreenType, DownloadedItem } from './types';
import { MOCK_MEDIA, MOCK_CONTINUE_WATCHING } from './data/mockData';
import { PhoneFrame } from './components/device/PhoneFrame';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { DownloadsScreen } from './screens/DownloadsScreen';
import { MovieDetailsScreen } from './screens/MovieDetailsScreen';
import { SeriesDetailsScreen } from './screens/SeriesDetailsScreen';
import { VideoPlayerScreen } from './screens/VideoPlayerScreen';
import { WatchlistScreen } from './screens/WatchlistScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ComposeCodeModal } from './components/code-export/ComposeCodeModal';
import { ShareModal } from './components/common/ShareModal';
import { StickyBottomAd } from './components/ads/StickyBottomAd';
import { fetchAllTMDBFeeds, fetchFullMediaDetails, fetchRealContinueWatchingInitial } from './services/tmdb';
import { getActiveContinueWatchingList } from './services/vidsrc';

const DOWNLOADS_STORAGE_KEY = 'zapmovies_offline_downloads_v1';
const TMDB_CACHE_KEY = 'zapmovies_tmdb_cache_v2';

function getInitialCachedFeeds() {
  try {
    const raw = localStorage.getItem(TMDB_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse cached TMDB feeds:', e);
  }
  return null;
}

export default function App() {
  const cachedFeeds = getInitialCachedFeeds();

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);

  // Media state initialized with cached TMDB data as default, falling back to initial data
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => cachedFeeds?.allMedia || MOCK_MEDIA);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>(() => cachedFeeds?.trendingMovies || []);
  const [trendingSeries, setTrendingSeries] = useState<MediaItem[]>(() => cachedFeeds?.trendingSeries || []);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>(() => cachedFeeds?.popularMovies || []);
  const [popularSeries, setPopularSeries] = useState<MediaItem[]>(() => cachedFeeds?.popularSeries || []);
  const [latestReleases, setLatestReleases] = useState<MediaItem[]>(() => cachedFeeds?.latestReleases || []);
  const [sciFiMovies, setSciFiMovies] = useState<MediaItem[]>(() => cachedFeeds?.sciFiMovies || []);
  const [actionMovies, setActionMovies] = useState<MediaItem[]>(() => cachedFeeds?.actionMovies || []);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>(() => cachedFeeds?.topRatedMovies || []);
  const [topRatedSeries, setTopRatedSeries] = useState<MediaItem[]>(() => cachedFeeds?.topRatedSeries || []);
  const [animationMovies, setAnimationMovies] = useState<MediaItem[]>(() => cachedFeeds?.animationMovies || []);
  const [comedyMovies, setComedyMovies] = useState<MediaItem[]>(() => cachedFeeds?.comedyMovies || []);
  const [horrorMovies, setHorrorMovies] = useState<MediaItem[]>(() => cachedFeeds?.horrorMovies || []);
  const [kDramaSeries, setKDramaSeries] = useState<MediaItem[]>(() => cachedFeeds?.kDramaSeries || []);

  // Watchlist state initialized with first 2 items
  const [watchlist, setWatchlist] = useState<MediaItem[]>([
    MOCK_MEDIA[0],
    MOCK_MEDIA[1]
  ]);

  // Offline Downloads state with persistent storage
  const [downloadedMedia, setDownloadedMedia] = useState<DownloadedItem[]>(() => {
    try {
      const saved = localStorage.getItem(DOWNLOADS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse offline downloads:', e);
    }
    // Initial populated state
    return [
      {
        id: 'dl-1',
        mediaId: 'tmdb-movie-cyber',
        title: 'Cyber Chronicles: 2099',
        type: 'movie',
        thumbnail: MOCK_MEDIA[0].poster,
        size: '1.8 GB',
        quality: '1080p FHD',
        downloadedAt: Date.now() - 86400000,
        runtime: '2h 15m',
        isCompleted: true
      },
      {
        id: 'dl-2',
        mediaId: 'tmdb-series-odyssey',
        title: 'Deep Space Horizon',
        type: 'series',
        thumbnail: MOCK_MEDIA[1].poster,
        size: '850 MB',
        quality: '1080p FHD',
        downloadedAt: Date.now() - 172800000,
        runtime: '54 min',
        seasonEpisode: 'S1 · E1',
        seasonNumber: 1,
        episodeNumber: 1,
        isCompleted: true
      }
    ];
  });

  // Continue watching state - initialized from localStorage if available
  const [continueWatchingList, setContinueWatchingList] = useState<ContinueWatchingItem[]>(() => {
    const saved = getActiveContinueWatchingList();
    return saved.length > 0 ? saved : MOCK_CONTINUE_WATCHING;
  });

  // Refresh continue watching from localStorage
  const refreshContinueWatching = useCallback(() => {
    const activeRecords = getActiveContinueWatchingList();
    if (activeRecords.length > 0) {
      setContinueWatchingList(activeRecords);
    }
  }, []);

  // Jetpack Compose Code Inspector Modal state
  const [isCodeInspectorOpen, setIsCodeInspectorOpen] = useState(false);

  // Share Modal state
  const [shareModalState, setShareModalState] = useState<{
    isOpen: boolean;
    media: MediaItem | null;
    episode: Episode | null;
    seasonNumber?: number;
  }>({
    isOpen: false,
    media: null,
    episode: null,
    seasonNumber: 1
  });

  const handleOpenShare = (media?: MediaItem | null, episode?: Episode | null, seasonNumber?: number) => {
    setShareModalState({
      isOpen: true,
      media: media || selectedMedia,
      episode: episode || selectedEpisode,
      seasonNumber: seasonNumber || selectedSeasonNumber
    });
  };

  const handleCloseShare = () => {
    setShareModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Fetch real TMDB feeds and real Continue Watching data on mount
  useEffect(() => {
    let isMounted = true;
    const loadTMDBData = async () => {
      try {
        const [feeds, realCw] = await Promise.all([
          fetchAllTMDBFeeds(),
          fetchRealContinueWatchingInitial()
        ]);

        if (isMounted) {
          // Cache feeds so on next reload TMDB is immediate default
          try {
            localStorage.setItem(TMDB_CACHE_KEY, JSON.stringify(feeds));
          } catch (e) {
            console.warn(e);
          }

          setMediaList(feeds.allMedia);
          setTrendingMovies(feeds.trendingMovies);
          setTrendingSeries(feeds.trendingSeries);
          setPopularMovies(feeds.popularMovies);
          setPopularSeries(feeds.popularSeries);
          setLatestReleases(feeds.latestReleases);
          setSciFiMovies(feeds.sciFiMovies);
          setActionMovies(feeds.actionMovies);
          setTopRatedMovies(feeds.topRatedMovies);
          setTopRatedSeries(feeds.topRatedSeries);
          setAnimationMovies(feeds.animationMovies);
          setComedyMovies(feeds.comedyMovies);
          setHorrorMovies(feeds.horrorMovies);
          setKDramaSeries(feeds.kDramaSeries);

          // Populate Continue Watching with real items from TMDB if no user records exist yet
          const stored = getActiveContinueWatchingList();
          if (stored.length > 0) {
            setContinueWatchingList(stored);
          } else if (realCw.length > 0) {
            setContinueWatchingList(realCw);
          }

          // Prepopulate watchlist with real trending movie & series
          if (feeds.trendingMovies.length > 0 && feeds.trendingSeries.length > 0) {
            setWatchlist([feeds.trendingMovies[0], feeds.trendingSeries[0]]);
          }

          // Check if user opened a shared deep link like ?watch=tmdb-movie-533535 or &s=1&e=2
          try {
            const urlParams = new URLSearchParams(window.location.search);
            const watchId = urlParams.get('watch');
            if (watchId) {
              const matchedMedia = feeds.allMedia.find((m) => m.id === watchId) || MOCK_MEDIA.find((m) => m.id === watchId);
              if (matchedMedia) {
                setSelectedMedia(matchedMedia);
                const sParam = urlParams.get('s');
                const eParam = urlParams.get('e');
                if (matchedMedia.type === 'series') {
                  const sNum = sParam ? parseInt(sParam, 10) : 1;
                  const eNum = eParam ? parseInt(eParam, 10) : 1;
                  setSelectedSeasonNumber(sNum);
                  const epObj = matchedMedia.seasons
                    ?.find((s) => s.seasonNumber === sNum)
                    ?.episodes.find((e) => e.episodeNumber === eNum);
                  if (epObj) {
                    setSelectedEpisode(epObj);
                  }
                }
                setCurrentScreen('video_player');
              }
            }
          } catch (e) {
            console.debug('Deep link parse error:', e);
          }
        }
      } catch (err) {
        console.warn('Could not load from TMDB, using fallback mock data:', err);
      }
    };

    loadTMDBData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Watchlist helpers
  const isInWatchlist = (id: string) => watchlist.some((item) => item.id === id);

  const handleToggleWatchlist = (media: MediaItem) => {
    if (isInWatchlist(media.id)) {
      setWatchlist((prev) => prev.filter((item) => item.id !== media.id));
    } else {
      setWatchlist((prev) => [media, ...prev]);
    }
  };

  const handleRemoveFromWatchlist = (media: MediaItem) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== media.id));
  };

  // Downloads management
  const handleDownloadMovie = (movie: MediaItem) => {
    const newItem: DownloadedItem = {
      id: `dl-${movie.id}`,
      mediaId: movie.id,
      tmdbId: movie.tmdbId,
      imdbId: movie.imdbId,
      title: movie.title,
      type: movie.type,
      thumbnail: movie.poster,
      size: '1.4 GB',
      quality: '1080p FHD',
      downloadedAt: Date.now(),
      runtime: movie.runtime,
      isCompleted: true
    };

    setDownloadedMedia((prev) => {
      const updated = [newItem, ...prev.filter((d) => d.mediaId !== movie.id)];
      try {
        localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleDeleteDownload = (id: string) => {
    setDownloadedMedia((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleDownloadEpisode = (series: MediaItem, episode: Episode) => {
    const sNum = episode.seasonNumber || selectedSeasonNumber || 1;
    const epNum = episode.episodeNumber || 1;
    const downloadId = `dl-${series.id}-s${sNum}-e${epNum}`;

    const newItem: DownloadedItem = {
      id: downloadId,
      mediaId: series.id,
      tmdbId: episode.tmdbId || series.tmdbId,
      imdbId: episode.imdbId || series.imdbId,
      title: `${series.title}`,
      type: 'series',
      thumbnail: episode.thumbnail || series.backdrop || series.poster,
      size: '520 MB',
      quality: '1080p FHD',
      downloadedAt: Date.now(),
      runtime: episode.duration || '48 min',
      seasonEpisode: `S${sNum} · E${epNum}`,
      seasonNumber: sNum,
      episodeNumber: epNum,
      isCompleted: true
    };

    setDownloadedMedia((prev) => {
      const updated = [newItem, ...prev.filter((d) => d.id !== downloadId)];
      try {
        localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handlePlayDownloaded = (item: DownloadedItem) => {
    const foundMedia = mediaList.find((m) => m.id === item.mediaId) || {
      id: item.mediaId,
      tmdbId: item.tmdbId,
      imdbId: item.imdbId,
      title: item.title,
      type: item.type,
      poster: item.thumbnail,
      backdrop: item.thumbnail,
      rating: 4.9,
      views: '6.4 M',
      year: 2025,
      runtime: item.runtime,
      genres: ['Offline', 'Downloaded'],
      description: 'Playing downloaded video offline in ZapMovies cinema player.',
      cast: []
    };

    setSelectedMedia(foundMedia);
    if (item.type === 'series') {
      setSelectedSeasonNumber(item.seasonNumber || 1);
      setSelectedEpisode({
        id: `ep-${item.id}`,
        episodeNumber: item.episodeNumber || 1,
        seasonNumber: item.seasonNumber || 1,
        title: item.title,
        duration: item.runtime,
        thumbnail: item.thumbnail,
        description: 'Downloaded offline episode.'
      });
    } else {
      setSelectedEpisode(null);
    }
    setCurrentScreen('video_player');
  };

  // Navigation handlers: Asynchronously enrich selected media with full TMDB cast and seasons
  const handleSelectMedia = async (item: MediaItem) => {
    setSelectedMedia(item);
    if (item.type === 'movie') {
      setCurrentScreen('movie_details');
    } else {
      setCurrentScreen('series_details');
    }

    // Fetch full TMDB details (cast, director, seasons, episodes)
    if (item.id.startsWith('tmdb-')) {
      try {
        const fullDetails = await fetchFullMediaDetails(item.id, item.type);
        setSelectedMedia((prev) => (prev && prev.id === item.id ? { ...prev, ...fullDetails } : prev));
        // Also update in main media list
        setMediaList((prevList) =>
          prevList.map((m) => (m.id === item.id ? { ...m, ...fullDetails } : m))
        );
      } catch (err) {
        console.error('Error fetching full media details:', err);
      }
    }
  };

  const handlePlayMedia = (item: MediaItem) => {
    setSelectedMedia(item);
    if (item.type === 'series' && item.seasons?.[0]?.episodes?.[0]) {
      const ep = item.seasons[0].episodes[0];
      setSelectedEpisode(ep);
      setSelectedSeasonNumber(ep.seasonNumber || 1);
    } else {
      setSelectedEpisode(null);
    }
    setCurrentScreen('video_player');
  };

  const handlePlayEpisode = (series: MediaItem, episode: Episode) => {
    setSelectedMedia(series);
    setSelectedEpisode(episode);
    setSelectedSeasonNumber(episode.seasonNumber || 1);
    setCurrentScreen('video_player');
  };

  const handleResumeWatching = (cwItem: ContinueWatchingItem) => {
    const foundMedia = mediaList.find((m) => m.id === cwItem.mediaId) || {
      id: cwItem.mediaId,
      tmdbId: cwItem.tmdbId,
      imdbId: cwItem.imdbId,
      title: cwItem.title,
      type: cwItem.type,
      poster: cwItem.thumbnail,
      backdrop: cwItem.thumbnail,
      rating: 4.8,
      views: '5.2 M',
      year: 2025,
      runtime: cwItem.type === 'series' ? '1 Season' : '2h 05m',
      genres: ['Action', 'Drama'],
      description: 'Resuming playback from ZapMovies continue watching.',
      cast: []
    };

    setSelectedMedia(foundMedia);

    if (cwItem.type === 'series') {
      const sNum = cwItem.seasonNumber || 1;
      const eNum = cwItem.episodeNumber || 1;
      setSelectedSeasonNumber(sNum);

      let targetEpisode = foundMedia.seasons
        ?.find((s) => s.seasonNumber === sNum)
        ?.episodes?.find((e) => e.episodeNumber === eNum);

      if (!targetEpisode) {
        targetEpisode = {
          id: `${foundMedia.id}-s${sNum}-e${eNum}`,
          episodeNumber: eNum,
          seasonNumber: sNum,
          title: `Episode ${eNum}`,
          duration: '48 min',
          thumbnail: cwItem.thumbnail,
          description: foundMedia.description,
          tmdbId: cwItem.tmdbId,
          imdbId: cwItem.imdbId
        };
      }
      setSelectedEpisode(targetEpisode);
    } else {
      setSelectedEpisode(null);
    }

    setCurrentScreen('video_player');
  };

  const handleNextEpisode = () => {
    if (!selectedMedia || !selectedEpisode) return;

    const sNum = selectedEpisode.seasonNumber || selectedSeasonNumber || 1;
    const currentEpNum = selectedEpisode.episodeNumber;

    // Check if season episodes are defined
    const currentSeason = selectedMedia.seasons?.find((s) => s.seasonNumber === sNum);
    if (currentSeason) {
      const nextInSeason = currentSeason.episodes.find((e) => e.episodeNumber === currentEpNum + 1);
      if (nextInSeason) {
        setSelectedEpisode({ ...nextInSeason, seasonNumber: sNum });
        return;
      }

      // Check next season
      const nextSeason = selectedMedia.seasons?.find((s) => s.seasonNumber === sNum + 1);
      if (nextSeason && nextSeason.episodes.length > 0) {
        setSelectedSeasonNumber(sNum + 1);
        setSelectedEpisode({ ...nextSeason.episodes[0], seasonNumber: sNum + 1 });
        return;
      }
    }

    // Default sequential fallback: Episode currentEpNum + 1
    const nextEpNum = currentEpNum + 1;
    setSelectedEpisode({
      id: `${selectedMedia.id}-s${sNum}-e${nextEpNum}`,
      episodeNumber: nextEpNum,
      seasonNumber: sNum,
      title: `Episode ${nextEpNum}`,
      duration: '48 min',
      thumbnail: selectedEpisode.thumbnail || selectedMedia.backdrop,
      description: `Next exciting episode of ${selectedMedia.title}.`,
      tmdbId: selectedMedia.tmdbId,
      imdbId: selectedMedia.imdbId
    });
  };

  const hasNextEpisode = Boolean(
    selectedMedia &&
      selectedMedia.type === 'series' &&
      selectedEpisode
  );

  return (
    <PhoneFrame onOpenCodeInspector={() => setIsCodeInspectorOpen(true)}>
      <div className="relative w-full h-full flex flex-col justify-between">
        {/* Active Screen View */}
        <div className="flex-1 w-full">
          {currentScreen === 'splash' && (
            <SplashScreen onEnter={() => setCurrentScreen('home')} />
          )}

          {currentScreen === 'home' && (
            <HomeScreen
              mediaList={mediaList}
              continueWatchingList={continueWatchingList}
              trendingMovies={trendingMovies}
              trendingSeries={trendingSeries}
              popularMovies={popularMovies}
              popularSeries={popularSeries}
              latestReleases={latestReleases}
              sciFiCollection={sciFiMovies}
              actionCollection={actionMovies}
              topRatedMovies={topRatedMovies}
              topRatedSeries={topRatedSeries}
              animationCollection={animationMovies}
              comedyCollection={comedyMovies}
              horrorCollection={horrorMovies}
              kDramaCollection={kDramaSeries}
              onSelectMedia={handleSelectMedia}
              onPlayMedia={handlePlayMedia}
              onResumeWatching={handleResumeWatching}
              onToggleWatchlist={handleToggleWatchlist}
              isInWatchlist={isInWatchlist}
              onNavigate={setCurrentScreen}
              onShare={handleOpenShare}
            />
          )}

          {currentScreen === 'search' && (
            <SearchScreen
              mediaList={mediaList}
              onSelectMedia={handleSelectMedia}
            />
          )}

          {currentScreen === 'downloads' && (
            <DownloadsScreen
              downloads={downloadedMedia}
              onPlayDownloaded={handlePlayDownloaded}
              onDeleteDownload={handleDeleteDownload}
              onExplore={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'movie_details' && selectedMedia && (
            <MovieDetailsScreen
              movie={selectedMedia}
              recommendedMovies={mediaList.filter(
                (m) => m.type === 'movie' && m.id !== selectedMedia.id
              ).slice(0, 8)}
              onBack={() => setCurrentScreen('home')}
              onPlay={handlePlayMedia}
              onSelectMovie={handleSelectMedia}
              onToggleWatchlist={handleToggleWatchlist}
              isInWatchlist={isInWatchlist(selectedMedia.id)}
              onDownloadMovie={handleDownloadMovie}
              isDownloaded={downloadedMedia.some((d) => d.mediaId === selectedMedia.id)}
              onShare={handleOpenShare}
            />
          )}

          {currentScreen === 'series_details' && selectedMedia && (
            <SeriesDetailsScreen
              series={selectedMedia}
              recommendedSeries={mediaList.filter(
                (m) => m.type === 'series' && m.id !== selectedMedia.id
              ).slice(0, 8)}
              onBack={() => setCurrentScreen('home')}
              onPlayEpisode={handlePlayEpisode}
              onSelectSeries={handleSelectMedia}
              onToggleWatchlist={handleToggleWatchlist}
              isInWatchlist={isInWatchlist(selectedMedia.id)}
              onDownloadEpisode={handleDownloadEpisode}
              downloadedEpisodeIds={downloadedMedia
                .filter((d) => d.mediaId === selectedMedia.id)
                .map((d) => d.id.replace('dl-', ''))}
              onShare={handleOpenShare}
            />
          )}

          {currentScreen === 'video_player' && selectedMedia && (
            <VideoPlayerScreen
              media={selectedMedia}
              episode={selectedEpisode || undefined}
              seasonNumber={selectedSeasonNumber}
              onBack={() => {
                if (selectedMedia.type === 'movie') {
                  setCurrentScreen('movie_details');
                } else {
                  setCurrentScreen('series_details');
                }
              }}
              onNextEpisode={handleNextEpisode}
              hasNextEpisode={hasNextEpisode}
              onToggleWatchlist={handleToggleWatchlist}
              isInWatchlist={isInWatchlist(selectedMedia.id)}
              onPlaybackUpdate={refreshContinueWatching}
              onShare={handleOpenShare}
            />
          )}

          {currentScreen === 'watchlist' && (
            <WatchlistScreen
              watchlistItems={watchlist}
              onSelectMedia={handleSelectMedia}
              onPlayMedia={handlePlayMedia}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              onExplore={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              continueWatchingList={continueWatchingList}
              watchlistCount={watchlist.length}
              onResumeWatching={handleResumeWatching}
              onOpenCodeInspector={() => setIsCodeInspectorOpen(true)}
              onShareApp={() => handleOpenShare(null)}
            />
          )}
        </div>

        {/* Sticky Cancellable Bottom Ad (320x50 Ad Zone) */}
        {currentScreen !== 'splash' && currentScreen !== 'video_player' && (
          <StickyBottomAd />
        )}

        {/* Persistent Bottom Navigation Bar (Home | Search | Downloads | Watchlist | Profile) */}
        <BottomNavigation
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          watchlistCount={watchlist.length}
          downloadsCount={downloadedMedia.length}
        />

        {/* Kotlin Jetpack Compose Code Inspector Modal */}
        <ComposeCodeModal
          isOpen={isCodeInspectorOpen}
          onClose={() => setIsCodeInspectorOpen(false)}
        />

        {/* Global Share Feature Modal */}
        <ShareModal
          isOpen={shareModalState.isOpen}
          onClose={handleCloseShare}
          media={shareModalState.media}
          episode={shareModalState.episode}
          seasonNumber={shareModalState.seasonNumber}
        />
      </div>
    </PhoneFrame>
  );
}
