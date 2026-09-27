package com.zapmovies.model

import com.google.gson.annotations.SerializedName

data class MediaItem(
    val id: String,
    val tmdbId: String? = null,
    val imdbId: String? = null,
    val title: String,
    val overview: String? = null,
    val posterUrl: String,
    val backdropUrl: String? = null,
    val rating: Float = 4.5f,
    val year: Int = 2024,
    val duration: String? = null,
    val genres: List<String> = emptyList(),
    val type: String = "movie", // "movie" or "series"
    val isFeatured: Boolean = false,
    val isTrending: Boolean = false,
    val isPopular: Boolean = false,
    val videoUrl: String? = null,
    val seasonsCount: Int? = null
)

data class Episode(
    val id: String,
    val episodeNumber: Int,
    val seasonNumber: Int,
    val title: String,
    val overview: String? = null,
    val duration: String? = null,
    val stillUrl: String? = null,
    val imdbId: String? = null
)

data class Season(
    val seasonNumber: Int,
    val name: String,
    val episodeCount: Int,
    val episodes: List<Episode> = emptyList()
)

data class ContinueWatchingItem(
    val id: String,
    val mediaId: String,
    val title: String,
    val posterUrl: String,
    val backdropUrl: String?,
    val type: String,
    val progressPercent: Float,
    val currentPositionSeconds: Long,
    val totalDurationSeconds: Long,
    val seasonNumber: Int? = null,
    val episodeNumber: Int? = null
)
