import { MediaItem, ContinueWatchingItem } from '../types';

import heroCyberpunk from '../assets/images/zapmovies_hero_cyberpunk_1790444977434.jpg';
import posterDetective from '../assets/images/zapmovies_poster_detective_1790444988755.jpg';
import posterApocalypse from '../assets/images/zapmovies_poster_apocalypse_1790445000104.jpg';
import backdropOdyssey from '../assets/images/zapmovies_backdrop_odyssey_1790445010399.jpg';

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'cyber-chronicles',
    title: 'Cyber Chronicles: 2099',
    type: 'series',
    poster: posterDetective,
    backdrop: heroCyberpunk,
    rating: 4.9,
    views: '8.4 M',
    year: 2025,
    runtime: '2 Seasons',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    description:
      'In a hyper-dense subterranean metropolis beneath Neo-Veridia, an enigmatic rogue operative uncovers a global mainframe conspiracy orchestrating the city\'s simulated reality.',
    creator: 'Lucian Vance',
    cast: [
      { name: 'Elena Rostova', role: 'Vesper Kaine' },
      { name: 'Marcus Thorne', role: 'Detective Jax' },
      { name: 'Sora Tanaka', role: 'The Architect' },
      { name: 'Kaelen Cross', role: 'Commander Vance' }
    ],
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    serverSources: [
      { id: 'server-1', name: 'Zap Cloud Alpha', quality: '4K HDR', speed: '58 Mbps' },
      { id: 'server-2', name: 'Neon Stream HD', quality: '1080p 60fps', speed: '32 Mbps' },
      { id: 'server-3', name: 'Global CDN Backup', quality: '1080p Auto', speed: '24 Mbps' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Dark Substrate',
        episodes: [
          {
            id: 'cc-s1-e1',
            episodeNumber: 1,
            title: 'Protocol Zero',
            duration: '52 min',
            thumbnail: heroCyberpunk,
            description: 'Vesper receives an encrypted memory chip that breaches the city boundary firewall.',
            watchedProgress: 0.9,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          },
          {
            id: 'cc-s1-e2',
            episodeNumber: 2,
            title: 'Ghost Signals',
            duration: '48 min',
            thumbnail: posterDetective,
            description: 'Jax navigates the neon underbelly of District 9 while evading high-altitude drone surveillance.',
            watchedProgress: 0.45,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          },
          {
            id: 'cc-s1-e3',
            episodeNumber: 3,
            title: 'Synthetic Echoes',
            duration: '54 min',
            thumbnail: backdropOdyssey,
            description: 'An underground insurgent broadcast exposes a lethal glitch inside the cybernetic grid.',
            watchedProgress: 0,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          },
          {
            id: 'cc-s1-e4',
            episodeNumber: 4,
            title: 'Terminal Descent',
            duration: '58 min',
            thumbnail: posterApocalypse,
            description: 'The squad launches a high-stakes extraction mission into the forbidden central reactor.',
            watchedProgress: 0,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          }
        ]
      },
      {
        seasonNumber: 2,
        title: 'Season 2: Infinite Horizon',
        episodes: [
          {
            id: 'cc-s2-e1',
            episodeNumber: 1,
            title: 'Rebirth Cycle',
            duration: '55 min',
            thumbnail: heroCyberpunk,
            description: 'Emerging onto the surface world, the team encounters an automated wasteland army.',
            watchedProgress: 0,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'deep-odyssey',
    title: 'Deep Odyssey: Event Horizon',
    type: 'movie',
    poster: posterApocalypse,
    backdrop: backdropOdyssey,
    rating: 4.8,
    views: '6.7 M',
    year: 2024,
    runtime: '2h 28m',
    genres: ['Sci-Fi', 'Adventure', 'Mystery'],
    description:
      'A deep space reconnaissance vessel embarks on a forbidden voyage through a gravitational fracture at the edge of the galaxy, where physical time folds into psychological reality.',
    director: 'Aria Sterling',
    cast: [
      { name: 'David Caine', role: 'Captain Noah Reed' },
      { name: 'Mira Jensen', role: 'Dr. Sarah Lin' },
      { name: 'Oskar Brandt', role: 'Chief Engineer Cole' }
    ],
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isLatest: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    serverSources: [
      { id: 'server-1', name: 'Zap Master 4K', quality: '4K Dolby Vision', speed: '65 Mbps' },
      { id: 'server-2', name: 'Fast Ultra HD', quality: '1080p 60fps', speed: '35 Mbps' },
      { id: 'server-3', name: 'Edge Server C', quality: '720p Mobile', speed: '15 Mbps' }
    ]
  },
  {
    id: 'the-noir-district',
    title: 'Shadows of Crimson City',
    type: 'movie',
    poster: posterDetective,
    backdrop: posterDetective,
    rating: 4.7,
    views: '7.1 M',
    year: 2025,
    runtime: '2h 12m',
    genres: ['Crime', 'Thriller', 'Mystery'],
    description:
      'A battle-hardened private investigator navigates corruption and gilded crime families when an aristocratic heiress disappears on the rain-drenched eve of an election.',
    director: 'Christian Laurent',
    cast: [
      { name: 'Goran Vance', role: 'Vincent Malloy' },
      { name: 'Sylvia Reyes', role: 'Isolde Laurent' },
      { name: 'Julian Drake', role: 'Commissioner Cross' }
    ],
    isTrending: true,
    isPopular: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    serverSources: [
      { id: 'server-1', name: 'Zap Prime Stream', quality: '4K Cinema', speed: '48 Mbps' },
      { id: 'server-2', name: 'High Speed CDN', quality: '1080p HD', speed: '28 Mbps' }
    ]
  },
  {
    id: 'apex-predator',
    title: 'Wasteland: Iron Kingdom',
    type: 'series',
    poster: posterApocalypse,
    backdrop: posterApocalypse,
    rating: 4.9,
    views: '9.2 M',
    year: 2024,
    runtime: '3 Seasons',
    genres: ['Action', 'Drama', 'Survival'],
    description:
      'In a scorched future where clean water is currency, rival clans clash over the last functioning geothermal citadel, led by a renegade warlord seeking atonement.',
    creator: 'Torin MacLeod',
    cast: [
      { name: 'Bram Mercer', role: 'Karkas' },
      { name: 'Astrid Lind', role: 'Rhea' },
      { name: 'Jaxon Holt', role: 'The Chancellor' }
    ],
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    serverSources: [
      { id: 'server-1', name: 'Zap Direct 4K', quality: '4K Ultra', speed: '55 Mbps' },
      { id: 'server-2', name: 'Fast Edge CDN', quality: '1080p', speed: '30 Mbps' }
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Dust & Blood',
        episodes: [
          {
            id: 'wk-s1-e1',
            episodeNumber: 1,
            title: 'The Great Convoy',
            duration: '61 min',
            thumbnail: posterApocalypse,
            description: 'The Iron Clan begins their grueling trek across the Salt Dunes as raiders circle.',
            watchedProgress: 0.8,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'wk-s1-e2',
            episodeNumber: 2,
            title: 'Citadel Gate',
            duration: '54 min',
            thumbnail: heroCyberpunk,
            description: 'Rhea sneaks inside the geothermal valve room during a desert storm.',
            watchedProgress: 0.2,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'tokyo-driftwood',
    title: 'Neon Velocity: Midnight Run',
    type: 'movie',
    poster: heroCyberpunk,
    backdrop: heroCyberpunk,
    rating: 4.6,
    views: '5.3 M',
    year: 2025,
    runtime: '1h 56m',
    genres: ['Action', 'Racing', 'Crime'],
    description:
      'High-stakes street racers using heavily modified electric hypercars compete in an underground tournament across the neon-illuminated expressways of Tokyo.',
    director: 'Kenji Takahashi',
    cast: [
      { name: 'Ren Sato', role: 'Kai' },
      { name: 'Chloe Dubois', role: 'Vee' }
    ],
    isPopular: true,
    isLatest: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'abyssal-secrets',
    title: 'The Abyssal Trench',
    type: 'series',
    poster: backdropOdyssey,
    backdrop: backdropOdyssey,
    rating: 4.7,
    views: '4.8 M',
    year: 2024,
    runtime: '1 Season',
    genres: ['Thriller', 'Horror', 'Mystery'],
    description:
      'Researchers aboard an experimental deep-sea benthic station discover that an ancient biosphere deep below the ocean crust has awakened to their sonar probes.',
    creator: 'Dr. Helen Vance',
    cast: [
      { name: 'Dr. Aaron Meyer', role: 'Commander Aris' },
      { name: 'Sonya Petrova', role: 'Chief Diver Leyla' }
    ],
    isLatest: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Deep Dark',
        episodes: [
          {
            id: 'at-s1-e1',
            episodeNumber: 1,
            title: 'Descent to 11,000m',
            duration: '49 min',
            thumbnail: backdropOdyssey,
            description: 'The Triton IV capsule descends past the sunlight zone into total darkness.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'ghost-dynasty',
    title: 'Dynasty of the Golden Blade',
    type: 'movie',
    poster: posterDetective,
    backdrop: posterDetective,
    rating: 4.8,
    views: '6.2 M',
    year: 2024,
    runtime: '2h 05m',
    genres: ['Action', 'Martial Arts', 'Historical'],
    description:
      'A banished swordsmith must forge five legendary weapons to protect the Imperial capital from shadow assassins wielding forgotten alchemical martial arts.',
    director: 'Wu Chang-Feng',
    cast: [
      { name: 'Li Wei', role: 'Master Shen' },
      { name: 'Mei Ling', role: 'Princess Yan' }
    ],
    isTrending: true,
    isPopular: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
  }
];

export const MOCK_CONTINUE_WATCHING: ContinueWatchingItem[] = [
  {
    id: 'cw-1',
    mediaId: 'cyber-chronicles',
    title: 'Cyber Chronicles: 2099',
    type: 'series',
    thumbnail: heroCyberpunk,
    progress: 0.68,
    remainingTime: '18 min left',
    seasonEpisode: 'S1 · E2'
  },
  {
    id: 'cw-2',
    mediaId: 'deep-odyssey',
    title: 'Deep Odyssey',
    type: 'movie',
    thumbnail: backdropOdyssey,
    progress: 0.42,
    remainingTime: '1h 14m left'
  },
  {
    id: 'cw-3',
    mediaId: 'apex-predator',
    title: 'Wasteland: Iron Kingdom',
    type: 'series',
    thumbnail: posterApocalypse,
    progress: 0.85,
    remainingTime: '8 min left',
    seasonEpisode: 'S1 · E1'
  }
];

export const GENRE_CATEGORIES = [
  'All',
  'Trending',
  'Movies',
  'TV Series',
  'Sci-Fi',
  'Action',
  'Thriller',
  'Crime',
  'Adventure',
  'Mystery',
  'Anime'
];
