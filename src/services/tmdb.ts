import { MediaItem, Season, Episode, CastMember, ContinueWatchingItem } from '../types';

export const TMDB_API_KEY =
  (import.meta.env.VITE_TMDB_API_KEY as string) ||
  '87f56df86185e5f758dbbceba2c174e5';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_POSTER = 'https://image.tmdb.org/t/p/w500';
const IMG_BACKDROP = 'https://image.tmdb.org/t/p/w1280';
const IMG_PROFILE = 'https://image.tmdb.org/t/p/w185';

const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics'
};

// In-memory cache to prevent redundant network calls
const cache = new Map<string, any>();

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    ...params
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
  if (cache.has(url)) {
    return cache.get(url);
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`TMDB error ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    cache.set(url, data);
    return data;
  } catch (error) {
    console.error(`TMDB fetch failed for ${endpoint}:`, error);
    throw error;
  }
}

// Convert TMDB Movie Object to MediaItem
export function transformTMDBMovie(item: any, isFeatured = false): MediaItem {
  const posterPath = item.poster_path
    ? `${IMG_POSTER}${item.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';

  const backdropPath = item.backdrop_path
    ? `${IMG_BACKDROP}${item.backdrop_path}`
    : posterPath;

  const year = item.release_date
    ? new Date(item.release_date).getFullYear()
    : 2025;

  const genres =
    item.genres?.map((g: any) => g.name) ||
    item.genre_ids?.map((id: number) => GENRE_MAP[id] || 'Cinema').filter(Boolean) ||
    ['Feature'];

  // Format vote average to 5-star scale (e.g., 8.4 -> 4.2 or standard 4.8)
  const rawRating = item.vote_average || 7.5;
  const rating = Number(Math.min(5.0, Math.max(3.5, rawRating / 2 + 0.8)).toFixed(1));

  const voteCount = item.vote_count || 1200;
  const views =
    voteCount > 1000
      ? `${(voteCount / 1000).toFixed(1)} M`
      : `${voteCount} K`;

  return {
    id: `tmdb-movie-${item.id}`,
    tmdbId: item.id,
    imdbId: item.imdb_id,
    title: item.title || item.original_title || 'Untitled Movie',
    type: 'movie',
    poster: posterPath,
    posterPath: item.poster_path,
    backdrop: backdropPath,
    backdropPath: item.backdrop_path,
    rating,
    views,
    year,
    releaseDate: item.release_date,
    runtime: item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : '2h 05m',
    genres: genres.length > 0 ? genres : ['Action', 'Thriller'],
    description: item.overview || 'An intense cinematic experience curated for ZapMovies.',
    overview: item.overview,
    director: item.director,
    cast: item.cast || [],
    isFeatured,
    isTrending: true,
    isPopular: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    serverSources: [
      { id: 'vidsrc', name: 'VidSrc Ultra (Recommended)', quality: '4K Multi-Audio', speed: 'Ultra Fast' },
      { id: 'vidsrc-mirror', name: 'VidSrc Mirror 2', quality: '1080p 60fps', speed: 'High Speed' },
      { id: 'zap-direct', name: 'Zap Direct Stream', quality: '1080p Auto', speed: 'Fast' }
    ]
  };
}

// Convert TMDB TV Series Object to MediaItem
export function transformTMDBSeries(item: any, isFeatured = false): MediaItem {
  const posterPath = item.poster_path
    ? `${IMG_POSTER}${item.poster_path}`
    : 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=500&q=80';

  const backdropPath = item.backdrop_path
    ? `${IMG_BACKDROP}${item.backdrop_path}`
    : posterPath;

  const year = item.first_air_date
    ? new Date(item.first_air_date).getFullYear()
    : 2025;

  const genres =
    item.genres?.map((g: any) => g.name) ||
    item.genre_ids?.map((id: number) => GENRE_MAP[id] || 'Drama').filter(Boolean) ||
    ['TV Series'];

  const rawRating = item.vote_average || 8.0;
  const rating = Number(Math.min(5.0, Math.max(3.8, rawRating / 2 + 0.8)).toFixed(1));

  const voteCount = item.vote_count || 1500;
  const views =
    voteCount > 1000
      ? `${(voteCount / 1000).toFixed(1)} M`
      : `${voteCount} K`;

  const seasonCount = item.number_of_seasons || 1;

  return {
    id: `tmdb-tv-${item.id}`,
    tmdbId: item.id,
    imdbId: item.imdb_id,
    title: item.name || item.original_name || 'Untitled Series',
    type: 'series',
    poster: posterPath,
    posterPath: item.poster_path,
    backdrop: backdropPath,
    backdropPath: item.backdrop_path,
    rating,
    views,
    year,
    releaseDate: item.first_air_date,
    runtime: `${seasonCount} Season${seasonCount > 1 ? 's' : ''}`,
    numberOfSeasons: seasonCount,
    numberOfEpisodes: item.number_of_episodes,
    genres: genres.length > 0 ? genres : ['Drama', 'Mystery'],
    description: item.overview || 'Stream all episodes in pure 4K cinema quality on ZapMovies.',
    overview: item.overview,
    creator: item.created_by?.[0]?.name,
    cast: item.cast || [],
    isFeatured,
    isTrending: true,
    isPopular: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    serverSources: [
      { id: 'vidsrc', name: 'VidSrc Ultra (Recommended)', quality: '4K Multi-Audio', speed: 'Ultra Fast' },
      { id: 'vidsrc-mirror', name: 'VidSrc Mirror 2', quality: '1080p 60fps', speed: 'High Speed' },
      { id: 'zap-direct', name: 'Zap Direct Stream', quality: '1080p Auto', speed: 'Fast' }
    ]
  };
}

// Fetch Detailed Info (Cast, Director, Trailer, Seasons) for Movie or TV
export async function fetchFullMediaDetails(
  mediaId: string,
  type: 'movie' | 'series'
): Promise<Partial<MediaItem>> {
  const numericId = mediaId.replace(/^tmdb-(movie|tv)-/, '');

  try {
    if (type === 'movie') {
      const data = await fetchFromTMDB(`/movie/${numericId}`, {
        append_to_response: 'credits,videos,recommendations,similar,external_ids'
      });

      const director = data.credits?.crew?.find(
        (c: any) => c.job === 'Director'
      )?.name;

      const cast: CastMember[] = (data.credits?.cast || []).slice(0, 8).map((c: any) => ({
        name: c.name,
        role: c.character || 'Supporting',
        avatar: c.profile_path ? `${IMG_PROFILE}${c.profile_path}` : undefined
      }));

      // Find official YouTube trailer
      const trailer = data.videos?.results?.find(
        (v: any) =>
          v.site === 'YouTube' &&
          (v.type === 'Trailer' || v.type === 'Teaser')
      );

      const imdbId = data.imdb_id || data.external_ids?.imdb_id;

      return {
        tmdbId: data.id,
        imdbId,
        runtime: data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : undefined,
        genres: data.genres?.map((g: any) => g.name) || undefined,
        description: data.overview || undefined,
        overview: data.overview,
        director,
        cast,
        trailerKey: trailer?.key
      };
    } else {
      // TV Series
      const data = await fetchFromTMDB(`/tv/${numericId}`, {
        append_to_response: 'credits,videos,recommendations,similar,external_ids'
      });

      const creator = data.created_by?.[0]?.name;
      const cast: CastMember[] = (data.credits?.cast || []).slice(0, 8).map((c: any) => ({
        name: c.name,
        role: c.character || 'Cast',
        avatar: c.profile_path ? `${IMG_PROFILE}${c.profile_path}` : undefined
      }));

      const trailer = data.videos?.results?.find(
        (v: any) =>
          v.site === 'YouTube' &&
          (v.type === 'Trailer' || v.type === 'Teaser')
      );

      const imdbId = data.external_ids?.imdb_id;

      // Fetch Season 1 Episodes
      let seasons: Season[] = [];
      try {
        const season1Data = await fetchFromTMDB(`/tv/${numericId}/season/1`);
        if (season1Data?.episodes) {
          const episodes: Episode[] = season1Data.episodes.slice(0, 10).map((ep: any) => ({
            id: `ep-${ep.id}`,
            tmdbId: ep.id,
            episodeNumber: ep.episode_number,
            seasonNumber: 1,
            title: ep.name || `Episode ${ep.episode_number}`,
            duration: ep.runtime ? `${ep.runtime} min` : '48 min',
            thumbnail: ep.still_path
              ? `${IMG_BACKDROP}${ep.still_path}`
              : data.backdrop_path
              ? `${IMG_BACKDROP}${data.backdrop_path}`
              : 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=500&q=80',
            description: ep.overview || 'No synopsis provided for this episode.',
            watchedProgress: ep.episode_number === 1 ? 0.7 : 0,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          }));

          seasons = [
            {
              seasonNumber: 1,
              title: 'Season 1',
              episodes
            }
          ];

          // If there are more seasons, populate placeholders
          if (data.number_of_seasons > 1) {
            for (let s = 2; s <= Math.min(data.number_of_seasons, 4); s++) {
              seasons.push({
                seasonNumber: s,
                title: `Season ${s}`,
                episodes: [
                  {
                    id: `ep-s${s}-1`,
                    episodeNumber: 1,
                    seasonNumber: s,
                    title: `Season ${s} Premiere`,
                    duration: '52 min',
                    thumbnail: data.backdrop_path ? `${IMG_BACKDROP}${data.backdrop_path}` : '',
                    description: `The epic continuation of ${data.name}.`,
                    watchedProgress: 0,
                    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
                  }
                ]
              });
            }
          }
        }
      } catch (err) {
        console.warn('Could not load season episodes from TMDB:', err);
      }

      return {
        tmdbId: data.id,
        imdbId,
        runtime: `${data.number_of_seasons || 1} Season${(data.number_of_seasons || 1) > 1 ? 's' : ''}`,
        numberOfSeasons: data.number_of_seasons,
        numberOfEpisodes: data.number_of_episodes,
        genres: data.genres?.map((g: any) => g.name) || undefined,
        description: data.overview || undefined,
        overview: data.overview,
        creator,
        cast,
        seasons: seasons.length > 0 ? seasons : undefined,
        trailerKey: trailer?.key
      };
    }
  } catch (error) {
    console.error('Failed to load full media details:', error);
    return {};
  }
}

// Fetch Category Carousels from TMDB
export async function fetchAllTMDBFeeds(): Promise<{
  allMedia: MediaItem[];
  trendingMovies: MediaItem[];
  trendingSeries: MediaItem[];
  popularMovies: MediaItem[];
  popularSeries: MediaItem[];
  latestReleases: MediaItem[];
  sciFiMovies: MediaItem[];
  actionMovies: MediaItem[];
  topRatedMovies: MediaItem[];
  topRatedSeries: MediaItem[];
  animationMovies: MediaItem[];
  comedyMovies: MediaItem[];
  horrorMovies: MediaItem[];
  kDramaSeries: MediaItem[];
}> {
  try {
    const [
      trendingMoviesRes,
      trendingTvRes,
      popularMoviesRes,
      popularTvRes,
      nowPlayingRes,
      sciFiRes,
      actionRes,
      topRatedMovieRes,
      topRatedTvRes,
      animationRes,
      comedyRes,
      horrorRes,
      kDramaRes
    ] = await Promise.all([
      fetchFromTMDB('/trending/movie/week'),
      fetchFromTMDB('/trending/tv/week'),
      fetchFromTMDB('/movie/popular'),
      fetchFromTMDB('/tv/popular'),
      fetchFromTMDB('/movie/now_playing'),
      fetchFromTMDB('/discover/movie', { with_genres: '878', sort_by: 'popularity.desc' }),
      fetchFromTMDB('/discover/movie', { with_genres: '28', sort_by: 'popularity.desc' }),
      fetchFromTMDB('/movie/top_rated'),
      fetchFromTMDB('/tv/top_rated'),
      fetchFromTMDB('/discover/movie', { with_genres: '16', sort_by: 'popularity.desc' }),
      fetchFromTMDB('/discover/movie', { with_genres: '35', sort_by: 'popularity.desc' }),
      fetchFromTMDB('/discover/movie', { with_genres: '27', sort_by: 'popularity.desc' }),
      fetchFromTMDB('/discover/tv', { with_original_language: 'ko', sort_by: 'popularity.desc' })
    ]);

    const trendingMovies = (trendingMoviesRes.results || []).slice(0, 10).map((m: any, idx: number) =>
      transformTMDBMovie(m, idx < 2)
    );

    const trendingSeries = (trendingTvRes.results || []).slice(0, 10).map((s: any, idx: number) =>
      transformTMDBSeries(s, idx === 0)
    );

    const popularMovies = (popularMoviesRes.results || []).slice(0, 10).map((m: any) =>
      transformTMDBMovie(m)
    );

    const popularSeries = (popularTvRes.results || []).slice(0, 10).map((s: any) =>
      transformTMDBSeries(s)
    );

    const latestReleases = (nowPlayingRes.results || []).slice(0, 10).map((m: any) => {
      const item = transformTMDBMovie(m);
      item.isLatest = true;
      return item;
    });

    const sciFiMovies = (sciFiRes.results || []).slice(0, 10).map((m: any) =>
      transformTMDBMovie(m)
    );

    const actionMovies = (actionRes.results || []).slice(0, 10).map((m: any) =>
      transformTMDBMovie(m)
    );

    const topRatedMovies = (topRatedMovieRes.results || []).slice(0, 10).map((m: any) =>
      transformTMDBMovie(m)
    );

    const topRatedSeries = (topRatedTvRes.results || []).slice(0, 10).map((s: any) =>
      transformTMDBSeries(s)
    );

    const animationMovies = (animationRes.results || []).slice(0, 10).map((m: any) =>
      transformTMDBMovie(m)
    );

    const comedyMovies = (comedyRes.results || []).slice(0, 10).map((m: any) =>
      transformTMDBMovie(m)
    );

    const horrorMovies = (horrorRes.results || []).slice(0, 10).map((m: any) =>
      transformTMDBMovie(m)
    );

    const kDramaSeries = (kDramaRes.results || []).slice(0, 10).map((s: any) =>
      transformTMDBSeries(s)
    );

    // Combine all media and deduplicate by id
    const map = new Map<string, MediaItem>();
    [
      ...trendingMovies,
      ...trendingSeries,
      ...popularMovies,
      ...popularSeries,
      ...latestReleases,
      ...sciFiMovies,
      ...actionMovies,
      ...topRatedMovies,
      ...topRatedSeries,
      ...animationMovies,
      ...comedyMovies,
      ...horrorMovies,
      ...kDramaSeries
    ].forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    });

    return {
      allMedia: Array.from(map.values()),
      trendingMovies,
      trendingSeries,
      popularMovies,
      popularSeries,
      latestReleases,
      sciFiMovies,
      actionMovies,
      topRatedMovies,
      topRatedSeries,
      animationMovies,
      comedyMovies,
      horrorMovies,
      kDramaSeries
    };
  } catch (error) {
    console.error('Failed to load TMDB feeds:', error);
    throw error;
  }
}

// Fetch Real TMDB Categories dynamically
export async function fetchMediaByCategory(category: string): Promise<MediaItem[]> {
  try {
    switch (category) {
      case 'TV Shows': {
        const res = await fetchFromTMDB('/tv/popular');
        return (res.results || []).slice(0, 18).map((s: any) => transformTMDBSeries(s));
      }
      case 'Movies': {
        const res = await fetchFromTMDB('/movie/popular');
        return (res.results || []).slice(0, 18).map((m: any) => transformTMDBMovie(m));
      }
      case 'Trending': {
        const res = await fetchFromTMDB('/trending/all/week');
        return (res.results || []).slice(0, 18).map((item: any) =>
          item.media_type === 'tv' ? transformTMDBSeries(item) : transformTMDBMovie(item)
        );
      }
      case 'Top Rated': {
        const res = await fetchFromTMDB('/movie/top_rated');
        return (res.results || []).slice(0, 18).map((m: any) => transformTMDBMovie(m));
      }
      case 'Action': {
        const res = await fetchFromTMDB('/discover/movie', { with_genres: '28', sort_by: 'popularity.desc' });
        return (res.results || []).slice(0, 18).map((m: any) => transformTMDBMovie(m));
      }
      case 'Sci-Fi': {
        const res = await fetchFromTMDB('/discover/movie', { with_genres: '878', sort_by: 'popularity.desc' });
        return (res.results || []).slice(0, 18).map((m: any) => transformTMDBMovie(m));
      }
      case 'Animation': {
        const res = await fetchFromTMDB('/discover/movie', { with_genres: '16', sort_by: 'popularity.desc' });
        return (res.results || []).slice(0, 18).map((m: any) => transformTMDBMovie(m));
      }
      case 'Comedy': {
        const res = await fetchFromTMDB('/discover/movie', { with_genres: '35', sort_by: 'popularity.desc' });
        return (res.results || []).slice(0, 18).map((m: any) => transformTMDBMovie(m));
      }
      case 'Horror': {
        const res = await fetchFromTMDB('/discover/movie', { with_genres: '27', sort_by: 'popularity.desc' });
        return (res.results || []).slice(0, 18).map((m: any) => transformTMDBMovie(m));
      }
      case 'Thriller': {
        const res = await fetchFromTMDB('/discover/movie', { with_genres: '53', sort_by: 'popularity.desc' });
        return (res.results || []).slice(0, 18).map((m: any) => transformTMDBMovie(m));
      }
      default: {
        const res = await fetchFromTMDB('/trending/all/day');
        return (res.results || []).slice(0, 18).map((item: any) =>
          item.media_type === 'tv' ? transformTMDBSeries(item) : transformTMDBMovie(item)
        );
      }
    }
  } catch (err) {
    console.error(`Failed to fetch media for category ${category}:`, err);
    return [];
  }
}

// Fetch real initial Continue Watching data directly from real TMDB episodes & movies
export async function fetchRealContinueWatchingInitial(): Promise<ContinueWatchingItem[]> {
  try {
    const [tvRes, movieRes] = await Promise.all([
      fetchFromTMDB('/trending/tv/week'),
      fetchFromTMDB('/trending/movie/week')
    ]);

    const topTv = tvRes.results?.[0];
    const topMovie = movieRes.results?.[0];
    const secondTv = tvRes.results?.[1];

    const results: ContinueWatchingItem[] = [];

    // Fetch real episode 1 and 2 for top TV show
    if (topTv) {
      try {
        const season1 = await fetchFromTMDB(`/tv/${topTv.id}/season/1`);
        const ep1 = season1.episodes?.[0];
        const ep2 = season1.episodes?.[1] || ep1;

        if (ep2) {
          const thumb = ep2.still_path
            ? `${IMG_BACKDROP}${ep2.still_path}`
            : topTv.backdrop_path
            ? `${IMG_BACKDROP}${topTv.backdrop_path}`
            : `${IMG_POSTER}${topTv.poster_path}`;

          results.push({
            id: `cw-tmdb-tv-${topTv.id}_s1_e${ep2.episode_number || 2}`,
            mediaId: `tmdb-tv-${topTv.id}`,
            tmdbId: topTv.id,
            title: topTv.name || 'Trending Series',
            type: 'series',
            thumbnail: thumb,
            progress: 0.72,
            percentage: 72,
            currentTime: 35 * 60,
            duration: (ep2.runtime || 50) * 60,
            remainingTime: '14 min left',
            seasonEpisode: `S1 · E${ep2.episode_number || 2}`,
            seasonNumber: 1,
            episodeNumber: ep2.episode_number || 2,
            lastWatched: Date.now() - 3600000
          });
        }
      } catch (e) {
        // Fallback with topTv metadata
        results.push({
          id: `cw-tmdb-tv-${topTv.id}`,
          mediaId: `tmdb-tv-${topTv.id}`,
          tmdbId: topTv.id,
          title: topTv.name,
          type: 'series',
          thumbnail: `${IMG_BACKDROP}${topTv.backdrop_path || topTv.poster_path}`,
          progress: 0.65,
          percentage: 65,
          currentTime: 22 * 60,
          duration: 50 * 60,
          remainingTime: '18 min left',
          seasonEpisode: 'S1 · E2',
          seasonNumber: 1,
          episodeNumber: 2,
          lastWatched: Date.now() - 7200000
        });
      }
    }

    // Add real top movie
    if (topMovie) {
      const thumb = topMovie.backdrop_path
        ? `${IMG_BACKDROP}${topMovie.backdrop_path}`
        : `${IMG_POSTER}${topMovie.poster_path}`;

      results.push({
        id: `cw-tmdb-movie-${topMovie.id}`,
        mediaId: `tmdb-movie-${topMovie.id}`,
        tmdbId: topMovie.id,
        title: topMovie.title,
        type: 'movie',
        thumbnail: thumb,
        progress: 0.48,
        percentage: 48,
        currentTime: 58 * 60,
        duration: 122 * 60,
        remainingTime: '1h 04m left',
        lastWatched: Date.now() - 86400000
      });
    }

    // Add second TV show if available
    if (secondTv) {
      results.push({
        id: `cw-tmdb-tv-${secondTv.id}`,
        mediaId: `tmdb-tv-${secondTv.id}`,
        tmdbId: secondTv.id,
        title: secondTv.name,
        type: 'series',
        thumbnail: `${IMG_BACKDROP}${secondTv.backdrop_path || secondTv.poster_path}`,
        progress: 0.84,
        percentage: 84,
        currentTime: 40 * 60,
        duration: 48 * 60,
        remainingTime: '8 min left',
        seasonEpisode: 'S1 · E1',
        seasonNumber: 1,
        episodeNumber: 1,
        lastWatched: Date.now() - 172800000
      });
    }

    return results;
  } catch (err) {
    console.error('Failed to fetch real continue watching items:', err);
    return [];
  }
}

// Live Search with TMDB Multi-search API
export async function searchTMDB(query: string): Promise<MediaItem[]> {
  if (!query.trim()) return [];

  try {
    const data = await fetchFromTMDB('/search/multi', {
      query: query.trim(),
      include_adult: 'false'
    });

    return (data.results || [])
      .filter((r: any) => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path)
      .slice(0, 18)
      .map((r: any) =>
        r.media_type === 'movie' ? transformTMDBMovie(r) : transformTMDBSeries(r)
      );
  } catch (err) {
    console.error('Error during TMDB search:', err);
    return [];
  }
}
