package com.zapmovies.ui.screens

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.zapmovies.model.ContinueWatchingItem
import com.zapmovies.model.MediaItem
import com.zapmovies.ui.components.AdBannerView
import com.zapmovies.ui.components.ContinueWatchingCard
import com.zapmovies.ui.components.MovieCard
import com.zapmovies.ui.components.ZapPrimaryButton
import com.zapmovies.ui.theme.ZapGold

@Composable
fun HomeScreen(
    mediaList: List<MediaItem>,
    continueWatchingList: List<ContinueWatchingItem>,
    onSelectMedia: (MediaItem) -> Unit,
    onPlayMedia: (MediaItem) -> Unit,
    onResumeWatching: (ContinueWatchingItem) -> Unit
) {
    val context = LocalContext.current
    val featuredMovie = remember(mediaList) { mediaList.firstOrNull { it.isFeatured } ?: mediaList.firstOrNull() }
    val trendingSeries = remember(mediaList) { mediaList.filter { it.type == "series" } }
    val trendingMovies = remember(mediaList) { mediaList.filter { it.type == "movie" } }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF08080A)),
        contentPadding = PaddingValues(bottom = 80.dp)
    ) {
        // App Header
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "ZAPMOVIES",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                    Text(
                        text = "STREAM 4K · ANDROID VERSION",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = ZapGold
                    )
                }
                IconButton(onClick = {}) {
                    Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = "Notifications",
                        tint = Color.White
                    )
                }
            }
        }

        // Hero Spotlight Banner
        if (featuredMovie != null) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(380.dp)
                ) {
                    AsyncImage(
                        model = featuredMovie.backdropUrl ?: featuredMovie.posterUrl,
                        contentDescription = featuredMovie.title,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )

                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Transparent,
                                        Color(0xFF08080A).copy(alpha = 0.8f),
                                        Color(0xFF08080A)
                                    )
                                )
                            )
                    )

                    Column(
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .padding(16.dp)
                    ) {
                        Text(
                            text = featuredMovie.title,
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Text(
                            text = "${featuredMovie.year} · ${featuredMovie.genres.take(2).joinToString(" · ")}",
                            fontSize = 12.sp,
                            color = ZapGold,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            ZapPrimaryButton(
                                text = "Watch Now",
                                onClick = { onPlayMedia(featuredMovie) },
                                icon = {
                                    Icon(
                                        imageVector = Icons.Default.PlayArrow,
                                        contentDescription = null,
                                        tint = Color.Black
                                    )
                                }
                            )

                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Color.White.copy(alpha = 0.1f)
                            ) {
                                IconButton(
                                    onClick = {
                                        val sendIntent = Intent().apply {
                                            action = Intent.ACTION_SEND
                                            putExtra(Intent.EXTRA_TEXT, "Watch ${featuredMovie.title} on ZapMovies!")
                                            type = "text/plain"
                                        }
                                        context.startActivity(Intent.createChooser(sendIntent, "Share with"))
                                    }
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Share,
                                        contentDescription = "Share",
                                        tint = ZapGold,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Continue Watching Carousel
        if (continueWatchingList.isNotEmpty()) {
            item {
                Text(
                    text = "Continue Watching",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    modifier = Modifier.padding(start = 16.dp, top = 20.dp, bottom = 10.dp)
                )
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(continueWatchingList) { item ->
                        ContinueWatchingCard(item = item, onResume = onResumeWatching)
                    }
                }
            }
        }

        // High Visibility Ad Banner 1 (468x60)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp),
                contentAlignment = Alignment.Center
            ) {
                AdBannerView(
                    zoneKey = "4b4e471c9bb70321a89ff1db782c427e",
                    widthDp = 468,
                    heightDp = 60
                )
            }
        }

        // Trending Series Carousel
        if (trendingSeries.isNotEmpty()) {
            item {
                Text(
                    text = "Trending Series",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 10.dp)
                )
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(trendingSeries) { series ->
                        MovieCard(movie = series, onClick = onSelectMedia)
                    }
                }
            }
        }

        // High Visibility Ad Banner 2 (320x50)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                AdBannerView(
                    zoneKey = "383e5798db5ea984cad6739ec47ed810",
                    widthDp = 320,
                    heightDp = 50
                )
            }
        }

        // Trending Movies Carousel
        if (trendingMovies.isNotEmpty()) {
            item {
                Text(
                    text = "Trending Movies",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 10.dp)
                )
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(trendingMovies) { movie ->
                        MovieCard(movie = movie, onClick = onSelectMedia)
                    }
                }
            }
        }

        // Footer Credit
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 28.dp, bottom = 16.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "ZapMovies Android Version",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}
