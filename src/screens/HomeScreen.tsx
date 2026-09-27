import React, { useState, useEffect } from 'react';
import { MediaItem, ContinueWatchingItem, ScreenType } from '../types';
import { ZapLogo } from '../components/common/ZapLogo';
import { HeroBanner } from '../components/cards/HeroBanner';
import { ContinueWatchingCard } from '../components/cards/ContinueWatchingCard';
import { MovieCard } from '../components/cards/MovieCard';
import { SeriesCard } from '../components/cards/SeriesCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { Bell, Loader2 } from 'lucide-react';
import { fetchMediaByCategory } from '../services/tmdb';
import { AdBanner } from '../components/ads/AdBanner';

interface HomeScreenProps {
  mediaList: MediaItem[];
  continueWatchingList: ContinueWatchingItem[];
  trendingMovies?: MediaItem[];
  trendingSeries?: MediaItem[];
  popularMovies?: MediaItem[];
  popularSeries?: MediaItem[];
  latestReleases?: MediaItem[];
  sciFiCollection?: MediaItem[];
  actionCollection?: MediaItem[];
  topRatedMovies?: MediaItem[];
  topRatedSeries?: MediaItem[];
  animationCollection?: MediaItem[];
  comedyCollection?: MediaItem[];
  horrorCollection?: MediaItem[];
  kDramaCollection?: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  onPlayMedia: (item: MediaItem) => void;
  onResumeWatching: (item: ContinueWatchingItem) => void;
  onToggleWatchlist: (item: MediaItem) => void;
  isInWatchlist: (id: string) => boolean;
  onNavigate: (screen: ScreenType) => void;
  onShare?: (item: MediaItem) => void;
}

// Real official TMDB categories for top category tabs
const CATEGORY_TABS = [
  'Home',
  'Trending',
  'Movies',
  'TV Shows',
  'Top Rated',
  'Action',
  'Sci-Fi',
  'Animation',
  'Comedy',
  'Horror'
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  mediaList,
  continueWatchingList,
  trendingMovies: propTrendingMovies,
  trendingSeries: propTrendingSeries,
  popularMovies: propPopularMovies,
  popularSeries: propPopularSeries,
  latestReleases: propLatestReleases,
  sciFiCollection: propSciFi,
  actionCollection: propAction,
  topRatedMovies: propTopRatedMovies,
  topRatedSeries: propTopRatedSeries,
  animationCollection: propAnimation,
  comedyCollection: propComedy,
  horrorCollection: propHorror,
  kDramaCollection: propKDrama,
  onSelectMedia,
  onPlayMedia,
  onResumeWatching,
  onToggleWatchlist,
  isInWatchlist,
  onNavigate,
  onShare
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Home');
  const [categoryMedia, setCategoryMedia] = useState<MediaItem[] | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  // Dynamic TMDB Category Fetching when a tab or "See All" is clicked
  useEffect(() => {
    if (selectedCategory === 'Home') {
      setCategoryMedia(null);
      return;
    }

    let isMounted = true;
    setIsCategoryLoading(true);

    fetchMediaByCategory(selectedCategory)
      .then((items) => {
        if (isMounted) {
          setCategoryMedia(items);
        }
      })
      .catch((err) => {
        console.error('Failed to load category:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsCategoryLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  // Fallbacks if props not passed
  const featuredItems = mediaList.filter((m) => m.isFeatured);
  const trendingMovies = propTrendingMovies || mediaList.filter((m) => m.type === 'movie' && m.isTrending);
  const trendingSeries = propTrendingSeries || mediaList.filter((m) => m.type === 'series' && m.isTrending);
  const popularMovies = propPopularMovies || mediaList.filter((m) => m.type === 'movie' && m.isPopular);
  const popularSeries = propPopularSeries || mediaList.filter((m) => m.type === 'series' && m.isPopular);
  const latestReleases = propLatestReleases || mediaList.filter((m) => m.isLatest || m.year >= 2025);
  const sciFiCollection = propSciFi || mediaList.filter((m) => m.genres.includes('Sci-Fi'));
  const actionCollection = propAction || mediaList.filter((m) => m.genres.includes('Action'));
  const topRatedMovies = propTopRatedMovies || mediaList.filter((m) => m.type === 'movie' && m.rating >= 4.7);
  const topRatedSeries = propTopRatedSeries || mediaList.filter((m) => m.type === 'series' && m.rating >= 4.7);
  const animationCollection = propAnimation || mediaList.filter((m) => m.genres.includes('Animation'));
  const comedyCollection = propComedy || mediaList.filter((m) => m.genres.includes('Comedy'));
  const horrorCollection = propHorror || mediaList.filter((m) => m.genres.includes('Horror'));
  const kDramaCollection = propKDrama || mediaList.filter((m) => m.type === 'series' && m.genres.includes('Drama'));

  const isFiltered = selectedCategory !== 'Home';

  return (
    <div className="w-full min-h-screen pb-20 bg-[#08080a] text-slate-100 select-none">
      {/* Top App Header - Seamlessly blended into background */}
      <header className="sticky top-0 z-30 px-5 py-3 bg-[#08080a]/90 backdrop-blur-xl flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2.5">
          <ZapLogo size="md" />
          <div className="flex flex-col">
            <span className="font-display font-black text-base tracking-tight text-white leading-none">
              ZAP<span className="text-[#F5B301]">MOVIES</span>
            </span>
            <span className="text-[9px] font-bold text-amber-400/90 tracking-wider uppercase mt-0.5">
              Stream 4K
            </span>
          </div>
        </div>

        {/* Right Actions: Notifications & User Avatar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Bell size={16} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            aria-label="Profile"
            className="relative cursor-pointer transition-transform hover:scale-105"
          >
            <div className="w-8 h-8 rounded-full ring-2 ring-[#F5B301] p-0.5 overflow-hidden bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                alt="User Profile"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#F5B301] border-2 border-[#08080a] rounded-full" />
          </button>
        </div>
      </header>

      {/* Category Navigation Bar (Real TMDB Categories) */}
      <nav aria-label="Media Categories" className="px-5 py-2 overflow-x-auto no-scrollbar touch-scroll flex items-center gap-2">
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedCategory(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-[#F5B301] text-slate-950 shadow-[0_2px_12px_rgba(245,179,1,0.35)] font-bold'
                  : 'bg-white/[0.05] text-slate-400 hover:text-slate-200 hover:bg-white/[0.09]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* Filtered View if non-Home tab is clicked (Clean Grid - Zero Overlapping) */}
      {isFiltered ? (
        <section className="px-5 pt-4">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader
              title={`${selectedCategory} (${categoryMedia ? categoryMedia.length : 'Loading...'})`}
            />
            <button
              type="button"
              onClick={() => setSelectedCategory('Home')}
              className="text-xs text-[#F5B301] font-semibold hover:underline cursor-pointer"
            >
              Back to Home
            </button>
          </div>

          {isCategoryLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-[#F5B301] mb-2" />
              <span className="text-xs text-slate-400">Loading TMDB {selectedCategory}...</span>
            </div>
          ) : categoryMedia && categoryMedia.length > 0 ? (
            <>
              {/* Category Top Ad Zone */}
              <div className="my-1.5 flex justify-center">
                <AdBanner
                  zoneKey="383e5798db5ea984cad6739ec47ed810"
                  width={320}
                  height={50}
                />
              </div>

              {/* Locked 2/3 column grid where cards CANNOT overlap */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pb-14">
                {categoryMedia.map((item) =>
                  item.type === 'movie' ? (
                    <MovieCard
                      key={item.id}
                      movie={item}
                      onClick={onSelectMedia}
                      isGrid={true}
                      className="w-full min-w-0"
                    />
                  ) : (
                    <SeriesCard
                      key={item.id}
                      series={item}
                      onClick={onSelectMedia}
                      isGrid={true}
                      className="w-full min-w-0"
                    />
                  )
                )}
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-xs text-slate-500">
              No titles currently available for {selectedCategory}.
            </div>
          )}
        </section>
      ) : (
        /* Full Main Home View */
        <>
          {/* Hero Banner Carousel (Top TMDB Spotlight) */}
          <HeroBanner
            items={featuredItems.length ? featuredItems.slice(0, 5) : mediaList.slice(0, 3)}
            onPlay={onPlayMedia}
            onDetails={onSelectMedia}
            onToggleWatchlist={onToggleWatchlist}
            isInWatchlist={isInWatchlist}
            onShare={onShare}
          />

          {/* Continue Watching Section (Real TMDB Data, Explicit Percentage & Continue Button) */}
          {continueWatchingList.length > 0 && (
            <section className="mt-6">
              <SectionHeader
                title="Continue Watching"
                onSeeAll={() => onNavigate('watchlist')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {continueWatchingList.map((item) => (
                  <ContinueWatchingCard
                    key={item.id}
                    item={item}
                    onResume={onResumeWatching}
                  />
                ))}
              </div>
            </section>
          )}

          {/* High-Visibility Ad Banner 1 (468x60) */}
          <div className="px-3 my-2 flex justify-center">
            <AdBanner
              zoneKey="4b4e471c9bb70321a89ff1db782c427e"
              width={468}
              height={60}
            />
          </div>

          {/* Trending Series Carousel with See All */}
          {trendingSeries.length > 0 && (
            <section className="mt-7">
              <SectionHeader
                title="Trending Series"
                onSeeAll={() => setSelectedCategory('TV Shows')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {trendingSeries.map((series) => (
                  <SeriesCard
                    key={series.id}
                    series={series}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Trending Movies Carousel with See All */}
          {trendingMovies.length > 0 && (
            <section className="mt-7">
              <SectionHeader
                title="Trending Movies"
                onSeeAll={() => setSelectedCategory('Movies')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {trendingMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* High-Visibility Ad Banner 2 (320x50) */}
          <div className="px-3 my-2 flex justify-center">
            <AdBanner
              zoneKey="383e5798db5ea984cad6739ec47ed810"
              width={320}
              height={50}
            />
          </div>

          {/* Top Rated Movies with See All */}
          {topRatedMovies.length > 0 && (
            <section className="mt-7">
              <SectionHeader
                title="Top Rated Movies"
                onSeeAll={() => setSelectedCategory('Top Rated')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {topRatedMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Popular TV Series with See All */}
          {popularSeries.length > 0 && (
            <section className="mt-7">
              <SectionHeader
                title="Popular TV Series"
                onSeeAll={() => setSelectedCategory('TV Shows')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {popularSeries.map((series) => (
                  <SeriesCard
                    key={series.id}
                    series={series}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* High-Visibility Ad Banner 3 (468x60) */}
          <div className="px-3 my-2 flex justify-center">
            <AdBanner
              zoneKey="4b4e471c9bb70321a89ff1db782c427e"
              width={468}
              height={60}
            />
          </div>

          {/* Popular Blockbusters with See All */}
          {popularMovies.length > 0 && (
            <section className="mt-7">
              <SectionHeader
                title="Popular Blockbusters"
                onSeeAll={() => setSelectedCategory('Movies')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {popularMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Action & Adrenaline with See All */}
          {actionCollection.length > 0 && (
            <section className="mt-7">
              <SectionHeader
                title="Action & Adrenaline"
                onSeeAll={() => setSelectedCategory('Action')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {actionCollection.map((item) => (
                  <MovieCard
                    key={item.id}
                    movie={item}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Sci-Fi & Cyberpunk with See All */}
          {sciFiCollection.length > 0 && (
            <section className="mt-7">
              <SectionHeader
                title="Sci-Fi & Cyberpunk"
                onSeeAll={() => setSelectedCategory('Sci-Fi')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {sciFiCollection.map((item) => (
                  <MovieCard
                    key={item.id}
                    movie={item}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* K-Dramas & Asian Drama with See All */}
          {kDramaCollection.length > 0 && (
            <section className="mt-7">
              <SectionHeader
                title="K-Dramas & Asian Series"
                onSeeAll={() => setSelectedCategory('TV Shows')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {kDramaCollection.map((series) => (
                  <SeriesCard
                    key={series.id}
                    series={series}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Animation & Anime with See All */}
          {animationCollection.length > 0 && (
            <section className="mt-7">
              <SectionHeader
                title="Animation & Anime"
                onSeeAll={() => setSelectedCategory('Animation')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {animationCollection.map((item) => (
                  <MovieCard
                    key={item.id}
                    movie={item}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Comedy Hits with See All */}
          {comedyCollection.length > 0 && (
            <section className="mt-7">
              <SectionHeader
                title="Comedy Hits"
                onSeeAll={() => setSelectedCategory('Comedy')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {comedyCollection.map((item) => (
                  <MovieCard
                    key={item.id}
                    movie={item}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Horror & Thriller with See All */}
          {horrorCollection.length > 0 && (
            <section className="mt-7 mb-4">
              <SectionHeader
                title="Horror & Thriller"
                onSeeAll={() => setSelectedCategory('Horror')}
              />
              <div className="px-5 flex items-center gap-3.5 overflow-x-auto no-scrollbar touch-scroll pb-2">
                {horrorCollection.map((item) => (
                  <MovieCard
                    key={item.id}
                    movie={item}
                    onClick={onSelectMedia}
                    size="md"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Footer Credit */}
          <footer className="mt-10 mb-6 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              ZapMovies Android Version
            </span>
          </footer>
        </>
      )}
    </div>
  );
};
