import { MediaItem, Episode, PlaybackRecord, ContinueWatchingItem } from '../types';

export const VIDSRC_BASE_URL = 'https://vidsrc.sh';
const STORAGE_KEY = 'zapmovies_playback_records_v1';

export interface VidSrcUrlOptions {
  media: MediaItem;
  seasonNumber?: number;
  episodeNumber?: number;
  startAt?: number; // seconds
  autoNext?: boolean;
}

/**
 * Resolves the primary external ID (IMDb tt... or numeric TMDB ID)
 */
export function resolveExternalId(media: MediaItem, episode?: Episode): string {
  // 1. Episode-specific IMDb or TMDB ID
  if (episode?.imdbId && episode.imdbId.startsWith('tt')) {
    return episode.imdbId;
  }
  if (episode?.tmdbId) {
    return String(episode.tmdbId);
  }

  // 2. Media IMDb ID
  if (media.imdbId && media.imdbId.startsWith('tt')) {
    return media.imdbId;
  }

  // 3. Media TMDB ID
  if (media.tmdbId) {
    return String(media.tmdbId);
  }

  // 4. Extract numeric ID from ZapMovies prefixed slug/id (e.g., "tmdb-movie-1423191" -> "1423191")
  const match = media.id.match(/\d+/);
  if (match) {
    return match[0];
  }

  // Fallback default
  return media.id;
}

/**
 * Builds the VidSrc embed URL according to the exact VidSrc specification
 */
export function buildVidSrcEmbedUrl(options: VidSrcUrlOptions): string {
  const { media, seasonNumber, episodeNumber, startAt, autoNext } = options;
  const externalId = resolveExternalId(media);

  let url = '';
  if (media.type === 'movie') {
    // https://vidsrc.sh/embed/movie/{ID}
    url = `${VIDSRC_BASE_URL}/embed/movie/${externalId}`;
  } else {
    // TV Series
    if (seasonNumber !== undefined && episodeNumber !== undefined) {
      // https://vidsrc.sh/embed/tv/{ID}/{SEASON}/{EPISODE}
      url = `${VIDSRC_BASE_URL}/embed/tv/${externalId}/${seasonNumber}/${episodeNumber}`;
    } else {
      // https://vidsrc.sh/embed/tv/{ID}
      url = `${VIDSRC_BASE_URL}/embed/tv/${externalId}`;
    }
  }

  const queryParams = new URLSearchParams();

  // VidSrc documents startAt as the playback-start position in seconds
  if (startAt && startAt > 10) {
    queryParams.append('startAt', Math.floor(startAt).toString());
  }

  // VidSrc supports autonext=1 for TV playback
  if (media.type === 'series' && autoNext) {
    queryParams.append('autonext', '1');
  }

  const queryString = queryParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Storage key generator guaranteeing separate storage for every TV episode
 */
export function getPlaybackStorageKey(
  mediaId: string,
  seasonNumber?: number,
  episodeNumber?: number
): string {
  if (seasonNumber !== undefined && episodeNumber !== undefined) {
    return `${mediaId}_s${seasonNumber}_e${episodeNumber}`;
  }
  return mediaId;
}

/**
 * Retrieves all stored playback records from localStorage
 */
export function getAllStoredRecords(): Record<string, PlaybackRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse playback records from localStorage:', err);
    return {};
  }
}

/**
 * Saves or updates playback progress in localStorage
 */
export function savePlaybackProgress(record: PlaybackRecord): void {
  try {
    const store = getAllStoredRecords();
    const key = getPlaybackStorageKey(record.mediaId, record.seasonNumber, record.episodeNumber);

    // If progress is greater than 90%, mark as completed
    const isCompleted = record.isCompleted || (record.duration > 0 && record.currentTime / record.duration >= 0.9);

    store[key] = {
      ...record,
      isCompleted,
      lastWatched: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn('Failed to save playback progress to localStorage:', err);
  }
}

/**
 * Gets the playback record for a specific movie or episode
 */
export function getPlaybackProgress(
  mediaId: string,
  seasonNumber?: number,
  episodeNumber?: number
): PlaybackRecord | null {
  const store = getAllStoredRecords();
  const key = getPlaybackStorageKey(mediaId, seasonNumber, episodeNumber);
  return store[key] || null;
}

/**
 * Removes progress for completed items or user deletion
 */
export function removePlaybackProgress(
  mediaId: string,
  seasonNumber?: number,
  episodeNumber?: number
): void {
  try {
    const store = getAllStoredRecords();
    const key = getPlaybackStorageKey(mediaId, seasonNumber, episodeNumber);
    if (store[key]) {
      delete store[key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  } catch (err) {
    console.warn('Failed to remove playback progress:', err);
  }
}

/**
 * Marks an episode or movie as completed, removing from active continue watching
 */
export function markAsCompleted(
  mediaId: string,
  seasonNumber?: number,
  episodeNumber?: number
): void {
  const existing = getPlaybackProgress(mediaId, seasonNumber, episodeNumber);
  if (existing) {
    savePlaybackProgress({
      ...existing,
      isCompleted: true,
      progress: 1.0,
      currentTime: existing.duration || existing.currentTime
    });
  }
}

/**
 * Converts stored playback records into ContinueWatchingItem array
 */
export function getActiveContinueWatchingList(): ContinueWatchingItem[] {
  const store = getAllStoredRecords();
  const records = Object.values(store);

  // Filter out completed items and sort by lastWatched descending
  return records
    .filter((r) => !r.isCompleted && r.progress > 0.02 && r.progress < 0.95)
    .sort((a, b) => b.lastWatched - a.lastWatched)
    .map((r) => {
      const remainingSecs = Math.max(0, (r.duration || 120 * 60) - r.currentTime);
      const remainingMins = Math.round(remainingSecs / 60);
      const remainingTime = remainingMins > 60
        ? `${Math.floor(remainingMins / 60)}h ${remainingMins % 60}m left`
        : `${remainingMins} min left`;

      const seasonEpisode =
        r.seasonNumber !== undefined && r.episodeNumber !== undefined
          ? `S${r.seasonNumber} · E${r.episodeNumber}`
          : undefined;

      const key = getPlaybackStorageKey(r.mediaId, r.seasonNumber, r.episodeNumber);

      return {
        id: `cw-${key}`,
        mediaId: r.mediaId,
        tmdbId: r.tmdbId,
        imdbId: r.imdbId,
        title: r.title,
        type: r.type,
        thumbnail: r.thumbnail,
        progress: Number(r.progress.toFixed(2)),
        percentage: Math.round(r.progress * 100),
        currentTime: r.currentTime,
        duration: r.duration,
        remainingTime,
        seasonEpisode,
        seasonNumber: r.seasonNumber,
        episodeNumber: r.episodeNumber,
        lastWatched: r.lastWatched,
        isCompleted: false
      };
    });
}
