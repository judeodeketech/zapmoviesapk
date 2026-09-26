export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber?: number;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  watchedProgress?: number; // 0 to 1
  videoUrl?: string;
  trailerKey?: string;
  tmdbId?: string | number;
  imdbId?: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface CastMember {
  name: string;
  role: string;
  avatar?: string;
}

export interface MediaItem {
  id: string;
  tmdbId?: string | number;
  imdbId?: string;
  title: string;
  type: 'movie' | 'series';
  poster: string;
  posterPath?: string;
  backdrop: string;
  backdropPath?: string;
  rating: number; // e.g. 4.9
  views: string; // e.g. "7.9 M"
  year: number;
  releaseDate?: string;
  runtime: string; // e.g. "2h 18m" or "3 Seasons"
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  genres: string[];
  description: string;
  overview?: string;
  director?: string;
  creator?: string;
  cast: CastMember[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  isLatest?: boolean;
  seasons?: Season[];
  videoUrl?: string;
  trailerKey?: string;
  serverSources?: {
    id: string;
    name: string;
    quality: string;
    speed: string;
  }[];
}

export interface ContinueWatchingItem {
  id: string;
  mediaId: string;
  tmdbId?: string | number;
  imdbId?: string;
  title: string;
  type: 'movie' | 'series';
  thumbnail: string;
  progress: number; // 0 to 1
  percentage?: number; // 0 to 100
  currentTime?: number; // in seconds
  duration?: number; // in seconds
  remainingTime: string;
  seasonEpisode?: string; // e.g. "S1 · E3"
  seasonNumber?: number;
  episodeNumber?: number;
  lastWatched?: number; // timestamp
  isCompleted?: boolean;
}

export interface PlaybackRecord {
  mediaId: string;
  title: string;
  type: 'movie' | 'series';
  tmdbId?: string | number;
  imdbId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  currentTime: number; // seconds
  duration: number; // seconds
  progress: number; // 0 to 1
  lastWatched: number; // Date.now()
  isCompleted: boolean;
  thumbnail: string;
}

export type ScreenType =
  | 'splash'
  | 'home'
  | 'search'
  | 'downloads'
  | 'watchlist'
  | 'profile'
  | 'movie_details'
  | 'series_details'
  | 'video_player';

export interface DownloadedItem {
  id: string;
  mediaId: string;
  tmdbId?: string | number;
  imdbId?: string;
  title: string;
  type: 'movie' | 'series';
  thumbnail: string;
  size: string; // e.g. "1.4 GB"
  quality: string; // e.g. "1080p FHD"
  downloadedAt: number; // timestamp
  runtime: string;
  seasonEpisode?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  isCompleted: boolean;
}

export interface NavigationState {
  currentScreen: ScreenType;
  selectedMediaId?: string;
  activeSeason?: number;
  activeEpisodeId?: string;
  history: ScreenType[];
}
