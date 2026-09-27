package com.zapmovies

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.lifecycle.lifecycleScope
import com.zapmovies.data.api.TmdbApiService
import com.zapmovies.model.ContinueWatchingItem
import com.zapmovies.model.MediaItem
import com.zapmovies.ui.screens.HomeScreen
import com.zapmovies.ui.screens.VideoPlayerScreen
import com.zapmovies.ui.theme.ZapGold
import com.zapmovies.ui.theme.ZapMoviesTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    private val tmdbService = TmdbApiService.create()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ZapMoviesTheme {
                var currentScreen by remember { mutableStateOf("home") }
                var selectedMedia by remember { mutableStateOf<MediaItem?>(null) }
                var isPlaying by remember { mutableStateOf(false) }

                var mediaList by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
                var continueWatchingList by remember { mutableStateOf<List<ContinueWatchingItem>>(emptyList()) }

                // Fetch real TMDB feed on startup
                LaunchedEffect(Unit) {
                    try {
                        val response = tmdbService.getTrendingMovies()
                        mediaList = response.results.map { dto ->
                            MediaItem(
                                id = dto.id.toString(),
                                tmdbId = dto.id.toString(),
                                title = dto.title,
                                overview = dto.overview,
                                posterUrl = "https://image.tmdb.org/t/p/w500${dto.posterPath}",
                                backdropUrl = "https://image.tmdb.org/t/p/original${dto.backdropPath}",
                                rating = dto.voteAverage,
                                year = dto.releaseDate?.take(4)?.toIntOrNull() ?: 2024,
                                type = "movie",
                                isFeatured = true
                            )
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF08080A)
                ) {
                    if (isPlaying && selectedMedia != null) {
                        VideoPlayerScreen(
                            media = selectedMedia!!,
                            onBack = { isPlaying = false }
                        )
                    } else {
                        Scaffold(
                            bottomBar = {
                                NavigationBar(
                                    containerColor = Color(0xFF0C0C12),
                                    contentColor = Color.White
                                ) {
                                    val items = listOf(
                                        Triple("home", "Home", Icons.Default.Home),
                                        Triple("search", "Search", Icons.Default.Search),
                                        Triple("downloads", "Downloads", Icons.Default.Download),
                                        Triple("watchlist", "Watchlist", Icons.Default.Bookmark),
                                        Triple("profile", "Profile", Icons.Default.Person)
                                    )
                                    items.forEach { (route, label, icon) ->
                                        NavigationBarItem(
                                            selected = currentScreen == route,
                                            onClick = { currentScreen = route },
                                            icon = { Icon(icon, contentDescription = label) },
                                            label = { Text(label) },
                                            colors = NavigationBarItemDefaults.colors(
                                                selectedIconColor = ZapGold,
                                                selectedTextColor = ZapGold,
                                                unselectedIconColor = Color.Gray,
                                                unselectedTextColor = Color.Gray,
                                                indicatorColor = Color.Transparent
                                            )
                                        )
                                    }
                                }
                            }
                        ) { paddingValues ->
                            Box(modifier = Modifier.padding(paddingValues)) {
                                when (currentScreen) {
                                    "home" -> HomeScreen(
                                        mediaList = mediaList,
                                        continueWatchingList = continueWatchingList,
                                        onSelectMedia = {
                                            selectedMedia = it
                                            isPlaying = true
                                        },
                                        onPlayMedia = {
                                            selectedMedia = it
                                            isPlaying = true
                                        },
                                        onResumeWatching = { item ->
                                            val found = mediaList.find { it.id == item.mediaId }
                                            if (found != null) {
                                                selectedMedia = found
                                                isPlaying = true
                                            }
                                        }
                                    )
                                    else -> HomeScreen(
                                        mediaList = mediaList,
                                        continueWatchingList = continueWatchingList,
                                        onSelectMedia = {
                                            selectedMedia = it
                                            isPlaying = true
                                        },
                                        onPlayMedia = {
                                            selectedMedia = it
                                            isPlaying = true
                                        },
                                        onResumeWatching = {}
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
