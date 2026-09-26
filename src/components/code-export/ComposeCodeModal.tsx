import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Smartphone, Layers, Terminal } from 'lucide-react';

interface ComposeCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMPOSE_FILES = [
  {
    name: 'ZapComponents.kt',
    description: 'Reusable Jetpack Compose components: MovieCard, ContinueWatchingCard, HeroBanner, PrimaryButton',
    code: `package com.zapmovies.ui.components

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.zapmovies.model.MediaItem
import com.zapmovies.model.ContinueWatchingItem
import com.zapmovies.ui.theme.ZapGold
import com.zapmovies.ui.theme.ZapDarkBg

/**
 * ZapMovies Primary Golden Gradient Button
 */
@Composable
fun ZapPrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: @Composable (() -> Unit)? = null
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .height(52.dp),
        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
        shape = RoundedCornerShape(16.dp),
        contentPadding = PaddingValues()
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(Color(0xFFFFC72C), ZapGold, Color(0xFFE69E00))
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                if (icon != null) {
                    icon()
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text(
                    text = text,
                    color = Color(0xFF0A0A0E),
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

/**
 * Reusable MovieCard Composable with 2:3 aspect ratio and rounded corners
 */
@Composable
fun MovieCard(
    movie: MediaItem,
    onClick: (MediaItem) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .width(144.dp)
            .aspectRatio(2f / 3f)
            .clickable { onClick(movie) },
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF14141C))
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            AsyncImage(
                model = movie.posterUrl,
                contentDescription = movie.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )

            // Dark Scrim Gradient
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.85f)),
                            startY = 150f
                        )
                    )
            )

            // Rating Pill
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = Color.Black.copy(alpha = 0.75f),
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(8.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = "Rating",
                        tint = ZapGold,
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Text(
                        text = String.format("%.1f", movie.rating),
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            // Title & Info at Bottom
            Column(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(10.dp)
            ) {
                Text(
                    text = movie.title,
                    color = Color.White,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = "\${movie.year} · \${movie.genres.firstOrNull() ?: "Feature"}",
                    color = Color.LightGray,
                    fontSize = 10.sp
                )
            }
        }
    }
}

/**
 * Reusable ContinueWatchingCard Composable with gold progress bar
 */
@Composable
fun ContinueWatchingCard(
    item: ContinueWatchingItem,
    onResume: (ContinueWatchingItem) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .width(224.dp)
            .clickable { onResume(item) }
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(16f / 9f)
                .clip(RoundedCornerShape(16.dp))
                .background(Color(0xFF14141C))
        ) {
            AsyncImage(
                model = item.thumbnailUrl,
                contentDescription = item.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )

            // Centered Play Button
            Box(
                modifier = Modifier
                    .size(38.dp)
                    .align(Alignment.Center)
                    .clip(CircleShape)
                    .background(Color.Black.copy(alpha = 0.6f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Play",
                    tint = ZapGold,
                    modifier = Modifier.size(20.dp)
                )
            }

            // Golden Progress Bar
            LinearProgressIndicator(
                progress = { item.progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .align(Alignment.BottomCenter),
                color = ZapGold,
                trackColor = Color.Black.copy(alpha = 0.6f)
            )
        }

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = item.title,
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
        Text(
            text = "\${item.seasonEpisode ?: ""} · \${(item.progress * 100).toInt()}% completed",
            color = Color.Gray,
            fontSize = 11.sp
        )
    }
}
`
  },
  {
    name: 'ZapMoviesTheme.kt',
    description: 'Jetpack Compose color palette, dark cinematic theme & typography',
    code: `package com.zapmovies.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// ZapMovies Golden Theme Palette
val ZapGold = Color(0xFFF5B301)
val ZapGoldBright = Color(0xFFFFC72C)
val ZapGoldDark = Color(0xFFC98A00)

val ZapDarkBg = Color(0xFF08080A)
val ZapSurfaceDark = Color(0xFF101017)
val ZapSurfaceBorder = Color(0x1AFFFFFF)

private val DarkColorScheme = darkColorScheme(
    primary = ZapGold,
    onPrimary = Color(0xFF0A0A0E),
    primaryContainer = Color(0xFF332500),
    onPrimaryContainer = ZapGoldBright,
    secondary = Color(0xFFE5E5EB),
    background = ZapDarkBg,
    surface = ZapSurfaceDark,
    onBackground = Color.White,
    onSurface = Color.White
)

val ZapTypography = Typography(
    titleLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        letterSpacing = 0.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        color = Color(0xFFCACACE)
    )
)

@Composable
fun ZapMoviesTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = ZapTypography,
        content = content
    )
}
`
  },
  {
    name: 'HomeScreen.kt',
    description: 'HomeScreen Composable with HeroBanner, ContinueWatching, and content carousels',
    code: `package com.zapmovies.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.zapmovies.model.MediaItem
import com.zapmovies.model.ContinueWatchingItem
import com.zapmovies.ui.components.*

@Composable
fun HomeScreen(
    mediaList: List<MediaItem>,
    continueWatchingList: List<ContinueWatchingItem>,
    onSelectMedia: (MediaItem) -> Unit,
    onPlayMedia: (MediaItem) -> Unit,
    onResumeWatching: (ContinueWatchingItem) -> Unit
) {
    val featuredMovies = remember(mediaList) { mediaList.filter { it.isFeatured } }
    val trendingSeries = remember(mediaList) { mediaList.filter { it.type == "series" && it.isTrending } }
    val trendingMovies = remember(mediaList) { mediaList.filter { it.type == "movie" && it.isTrending } }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 90.dp)
    ) {
        // App Bar & Top Navigation
        item {
            ZapTopAppBar()
            CategoryTabBar()
        }

        // Hero Spotlight Banner
        item {
            HeroBanner(
                items = featuredMovies,
                onPlay = onPlayMedia,
                onDetails = onSelectMedia
            )
        }

        // Continue Watching Carousel
        if (continueWatchingList.isNotEmpty()) {
            item {
                SectionHeader(title = "Continue Watching")
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    items(continueWatchingList) { item ->
                        ContinueWatchingCard(item = item, onResume = onResumeWatching)
                    }
                }
            }
        }

        // Trending Series Carousel
        item {
            Spacer(modifier = Modifier.height(24.dp))
            SectionHeader(title = "Trending Series", onSeeAll = {})
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(trendingSeries) { series ->
                    MovieCard(movie = series, onClick = onSelectMedia)
                }
            }
        }

        // Trending Movies Carousel
        item {
            Spacer(modifier = Modifier.height(24.dp))
            SectionHeader(title = "Trending Movies", onSeeAll = {})
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(trendingMovies) { movie ->
                    MovieCard(movie = movie, onClick = onSelectMedia)
                }
            }
        }
    }
}
`
  },
  {
    name: 'VideoPlayerScreen.kt',
    description: 'Video player interface with server selection and playback controls',
    code: `package com.zapmovies.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.zapmovies.model.MediaItem
import com.zapmovies.model.Episode

@Composable
fun VideoPlayerScreen(
    media: MediaItem,
    episode: Episode?,
    onBack: () -> Unit,
    onNextEpisode: (() -> Unit)? = null
) {
    var selectedServer by remember { mutableStateOf("VidSrc Ultra (Recommended)") }

    // Resolve VidSrc URL with startAt parameter
    val embedUrl = remember(media, episode) {
        val targetId = episode?.imdbId ?: media.imdbId ?: media.tmdbId ?: media.id
        if (media.type == "movie") {
            "https://vidsrc.sh/embed/movie/$targetId"
        } else {
            val season = episode?.seasonNumber ?: 1
            val epNum = episode?.episodeNumber ?: 1
            "https://vidsrc.sh/embed/tv/$targetId/$season/$epNum?autonext=1"
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF050508))
    ) {
        // Android WebView-style embedded VidSrc player area
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(16f / 9f)
                .background(Color.Black)
        ) {
            AndroidView(
                factory = { context ->
                    WebView(context).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        settings.mediaPlaybackRequiresUserGesture = false
                        webViewClient = WebViewClient()
                        loadUrl(embedUrl)
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
        }

        // Movie / Episode Information & Server selection below player
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = media.title,
                style = MaterialTheme.typography.titleMedium,
                color = Color.White,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Server",
                style = MaterialTheme.typography.titleSmall,
                color = Color.White
            )

            Spacer(modifier = Modifier.height(8.dp))

            listOf("VidSrc Ultra (Recommended)", "VidSrc Mirror 2 (1080p)", "Zap Direct Stream")
                .forEach { serverName ->
                    ServerOptionRow(
                        name = serverName,
                        isSelected = selectedServer == serverName,
                        onSelect = { selectedServer = serverName }
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                }
        }
    }
}
`
  },
  {
    name: 'TmdbApiService.kt',
    description: 'Kotlin Retrofit network interface for fetching TMDB categories, cast & trailers',
    code: `package com.zapmovies.data.api

import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface TmdbApiService {
    companion object {
        const val BASE_URL = "https://api.themoviedb.org/3/"
        const val API_KEY = "87f56df86185e5f758dbbceba2c174e5"
        const val IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
        const val BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original"
    }

    @GET("trending/movie/week")
    suspend fun getTrendingMovies(
        @Query("api_key") apiKey: String = API_KEY
    ): TmdbMovieResponse

    @GET("trending/tv/week")
    suspend fun getTrendingSeries(
        @Query("api_key") apiKey: String = API_KEY
    ): TmdbTvResponse

    @GET("movie/popular")
    suspend fun getPopularMovies(
        @Query("api_key") apiKey: String = API_KEY
    ): TmdbMovieResponse

    @GET("tv/popular")
    suspend fun getPopularSeries(
        @Query("api_key") apiKey: String = API_KEY
    ): TmdbTvResponse

    @GET("movie/{movie_id}")
    suspend fun getMovieDetails(
        @Path("movie_id") movieId: Int,
        @Query("api_key") apiKey: String = API_KEY,
        @Query("append_to_response") append: String = "credits,videos,recommendations"
    ): TmdbMovieDetailDto

    @GET("tv/{tv_id}")
    suspend fun getTvDetails(
        @Path("tv_id") tvId: Int,
        @Query("api_key") apiKey: String = API_KEY,
        @Query("append_to_response") append: String = "credits,videos,recommendations"
    ): TmdbTvDetailDto

    @GET("tv/{tv_id}/season/{season_number}")
    suspend fun getSeasonEpisodes(
        @Path("tv_id") tvId: Int,
        @Path("season_number") seasonNumber: Int,
        @Query("api_key") apiKey: String = API_KEY
    ): TmdbSeasonResponse

    @GET("search/multi")
    suspend fun searchMulti(
        @Query("query") query: String,
        @Query("api_key") apiKey: String = API_KEY,
        @Query("include_adult") includeAdult: Boolean = false
    ): TmdbSearchResponse
}
`
  }
];

export const ComposeCodeModal: React.FC<ComposeCodeModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = COMPOSE_FILES[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0c14] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#12121e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F5B301] text-slate-950 flex items-center justify-center">
              <Smartphone size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Kotlin + Jetpack Compose Architecture</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[#F5B301] text-[10px] font-bold">
                  Android Native
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Production-ready Compose code files matching the ZapMovies UI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-amber-300 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-[#F5B301]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy File</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation for Files */}
        <div className="px-6 pt-3 pb-2 border-b border-white/5 bg-[#0e0e18] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {COMPOSE_FILES.map((file, idx) => (
            <button
              key={file.name}
              type="button"
              onClick={() => setActiveFileIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                activeFileIndex === idx
                  ? 'bg-[#F5B301] text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <FileCode size={13} />
              <span>{file.name}</span>
            </button>
          ))}
        </div>

        {/* File Description */}
        <div className="px-6 py-2 bg-black/40 border-b border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{currentFile.description}</span>
          <span className="font-mono text-amber-400/90 text-[10px]">
            {currentFile.code.split('\n').length} lines
          </span>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-6 bg-[#08080d] font-mono text-xs leading-relaxed text-slate-200">
          <pre className="whitespace-pre overflow-x-auto selection:bg-[#F5B301]/30">
            {currentFile.code}
          </pre>
        </div>

        {/* Bottom Status */}
        <div className="px-6 py-3 bg-[#10101a] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F5B301]" />
            <span>Ready to paste directly into your Android Studio Kotlin project</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
