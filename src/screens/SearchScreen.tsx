import React, { useState, useEffect, useMemo } from 'react';
import { MediaItem } from '../types';
import { MovieCard } from '../components/cards/MovieCard';
import { SeriesCard } from '../components/cards/SeriesCard';
import { Search as SearchIcon, X, Film, Tv, Loader2 } from 'lucide-react';
import { GENRE_CATEGORIES } from '../data/mockData';
import { searchTMDB } from '../services/tmdb';

interface SearchScreenProps {
  mediaList: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  mediaList,
  onSelectMedia
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'movie' | 'series'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [tmdbSearchResults, setTmdbSearchResults] = useState<MediaItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Live debounced TMDB Search
  useEffect(() => {
    if (!query.trim()) {
      setTmdbSearchResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await searchTMDB(query);
        setTmdbSearchResults(results);
      } catch (err) {
        console.error('Failed to search TMDB:', err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  // Combine and filter results
  const displayItems = useMemo(() => {
    const sourceList = tmdbSearchResults !== null ? tmdbSearchResults : mediaList;

    return sourceList.filter((item) => {
      if (selectedFilter !== 'all' && item.type !== selectedFilter) {
        return false;
      }
      if (selectedGenre && !item.genres.includes(selectedGenre)) {
        return false;
      }
      return true;
    });
  }, [tmdbSearchResults, mediaList, selectedFilter, selectedGenre]);

  return (
    <div className="w-full min-h-screen pb-24 bg-[#08080a] text-slate-100 select-none">
      {/* Top Search Header - Blended smoothly */}
      <div className="sticky top-0 z-30 px-5 pt-3 pb-2.5 bg-[#08080a]/95 backdrop-blur-md">
        <h1 className="text-xl font-display font-bold text-white mb-2.5">Search & Explore</h1>

        {/* Large Android Search Input */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400">
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-[#F5B301]" />
            ) : (
              <SearchIcon size={18} />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search TMDB movies, series, actors, titles..."
            className="w-full h-12 pl-10 pr-10 rounded-2xl bg-[#12121b] ring-1 ring-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5B301] transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setTmdbSearchResults(null);
              }}
              className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Tabs: All, Movies, TV Series */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              selectedFilter === 'all'
                ? 'bg-[#F5B301] text-slate-950 font-bold shadow-sm'
                : 'bg-white/[0.05] text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('movie')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              selectedFilter === 'movie'
                ? 'bg-[#F5B301] text-slate-950 font-bold shadow-sm'
                : 'bg-white/[0.05] text-slate-400 hover:text-white'
            }`}
          >
            <Film size={12} />
            <span>Movies</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('series')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              selectedFilter === 'series'
                ? 'bg-[#F5B301] text-slate-950 font-bold shadow-sm'
                : 'bg-white/[0.05] text-slate-400 hover:text-white'
            }`}
          >
            <Tv size={12} />
            <span>TV Series</span>
          </button>
        </div>

        {/* Genre Chips Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-scroll pt-2 pb-1">
          <button
            type="button"
            onClick={() => setSelectedGenre(null)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors ${
              selectedGenre === null
                ? 'bg-white/20 text-white font-semibold'
                : 'bg-white/[0.05] text-slate-400 hover:text-white'
            }`}
          >
            All Genres
          </button>
          {GENRE_CATEGORIES.filter((g) => !['All', 'Trending', 'Movies', 'TV Series'].includes(g)).map(
            (genre) => {
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(isSelected ? null : genre)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-amber-500/20 text-[#F5B301] ring-1 ring-[#F5B301]/40'
                      : 'bg-white/[0.05] text-slate-400 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Search Content Body */}
      <div className="px-5 pt-3">
        {/* Results Count Header */}
        <div className="flex items-center justify-between mb-3.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-white font-mono">{displayItems.length}</strong> titles
              {query && <span> for &ldquo;{query}&rdquo;</span>}
            </span>
            {tmdbSearchResults && (
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md">
                TMDB Live
              </span>
            )}
          </div>
          {(query || selectedGenre || selectedFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setTmdbSearchResults(null);
                setSelectedGenre(null);
                setSelectedFilter('all');
              }}
              className="text-[#F5B301] hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Grid of Results - Perfectly Aligned, Zero Overlap */}
        {displayItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pb-12">
            {displayItems.map((item) =>
              item.type === 'movie' ? (
                <MovieCard
                  key={item.id}
                  movie={item}
                  onClick={onSelectMedia}
                  size="lg"
                  className="w-full max-w-full"
                />
              ) : (
                <SeriesCard
                  key={item.id}
                  series={item}
                  onClick={onSelectMedia}
                  size="lg"
                  className="w-full max-w-full"
                />
              )
            )}
          </div>
        ) : (
          /* Empty Search State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center text-slate-500 mb-3 ring-1 ring-white/10">
              <SearchIcon size={28} />
            </div>
            <h3 className="text-base font-bold text-white">No results found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo; on TMDB. Try searching another movie, series, or actor.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-xs">
              {['Avatar', 'Spider-Man', 'Breaking Bad', 'Interstellar', 'Squid Game'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/10 text-xs text-amber-300 ring-1 ring-white/10 cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
