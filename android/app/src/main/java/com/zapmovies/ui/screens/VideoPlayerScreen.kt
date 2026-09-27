package com.zapmovies.ui.screens

import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.ActivityInfo
import android.graphics.Bitmap
import android.os.Message
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Fullscreen
import androidx.compose.material.icons.filled.FullscreenExit
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.zapmovies.model.Episode
import com.zapmovies.model.MediaItem
import com.zapmovies.ui.components.AdBannerView
import com.zapmovies.ui.theme.ZapGold

/**
 * Android SDK VideoPlayerScreen:
 * Embeds the VidSrc movie and series player with NO sandbox restrictions,
 * while utilizing Android SDK WebViewClient and WebChromeClient to actively block
 * ALL outbound clicks, popups, and ad redirects.
 */
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun VideoPlayerScreen(
    media: MediaItem,
    episode: Episode? = null,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val activity = context as? ComponentActivity
    var isLandscape by remember { mutableStateOf(false) }
    var selectedServer by remember { mutableStateOf("VidSrc Ultra (Recommended)") }
    var isLoading by remember { mutableStateOf(true) }

    // Resolve VidSrc Stream URL
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
            .background(Color(0xFF08080A))
    ) {
        // Player Container: Video aspect ratio or Fullscreen in landscape
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .then(
                    if (isLandscape) Modifier.fillMaxSize()
                    else Modifier.aspectRatio(16f / 9f)
                )
                .background(Color.Black)
        ) {
            // Unsandboxed Android WebView with SDK-level outbound click & popup blocker
            AndroidView(
                factory = { ctx ->
                    WebView(ctx).apply {
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )

                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            mediaPlaybackRequiresUserGesture = false
                            loadsImagesAutomatically = true
                            cacheMode = WebSettings.LOAD_DEFAULT

                            // Disable multiple windows and auto-popup windows
                            setSupportMultipleWindows(false)
                            javaScriptCanOpenWindowsAutomatically = false
                            allowFileAccess = false
                            allowContentAccess = false
                        }

                        // Android SDK Outbound Click Blocker
                        webViewClient = object : WebViewClient() {
                            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                super.onPageStarted(view, url, favicon)
                                isLoading = false
                            }

                            /**
                             * Blocks ALL outbound ad clicks and external redirects.
                             * Only allows VidSrc embed and required streaming CDNs.
                             */
                            override fun shouldOverrideUrlLoading(
                                view: WebView?,
                                request: WebResourceRequest?
                            ): Boolean {
                                val url = request?.url?.toString() ?: return true
                                val host = request.url?.host ?: ""

                                val isAllowedStreamHost = host.contains("vidsrc") ||
                                        host.contains("2embed") ||
                                        host.contains("cloudflare") ||
                                        host.contains("akamai") ||
                                        host.contains("m3u8")

                                return if (isAllowedStreamHost) {
                                    // Allow internal streaming navigation
                                    false
                                } else {
                                    // Block outbound ad links, external popunders, and rogue app intents
                                    true
                                }
                            }

                            @Deprecated("Deprecated in Java")
                            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                                if (url == null) return true
                                val isAllowed = url.contains("vidsrc") || url.contains("2embed")
                                return !isAllowed
                            }
                        }

                        // WebChromeClient to kill window.open popups
                        webChromeClient = object : WebChromeClient() {
                            override fun onCreateWindow(
                                view: WebView?,
                                isDialog: Boolean,
                                isUserGesture: Boolean,
                                resultMsg: Message?
                            ): Boolean {
                                // Block popups requested by video player ads
                                return false
                            }
                        }

                        loadUrl(embedUrl)
                    }
                },
                modifier = Modifier.fillMaxSize()
            )

            // Top Floating Controls: Back & Fullscreen
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp)
                    .align(Alignment.TopCenter),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = CircleShape,
                    color = Color.Black.copy(alpha = 0.65f),
                    modifier = Modifier.size(36.dp)
                ) {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Back",
                            tint = Color.White,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Surface(
                        shape = CircleShape,
                        color = Color.Black.copy(alpha = 0.65f),
                        modifier = Modifier.size(36.dp)
                    ) {
                        IconButton(
                            onClick = {
                                val shareText = "Watch ${media.title} on ZapMovies!"
                                val sendIntent = Intent().apply {
                                    action = Intent.ACTION_SEND
                                    putExtra(Intent.EXTRA_TEXT, shareText)
                                    type = "text/plain"
                                }
                                val shareIntent = Intent.createChooser(sendIntent, "Share with")
                                context.startActivity(shareIntent)
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Share,
                                contentDescription = "Share",
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    Surface(
                        shape = CircleShape,
                        color = Color.Black.copy(alpha = 0.65f),
                        modifier = Modifier.size(36.dp)
                    ) {
                        IconButton(
                            onClick = {
                                isLandscape = !isLandscape
                                activity?.requestedOrientation = if (isLandscape) {
                                    ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
                                } else {
                                    ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                                }
                            }
                        ) {
                            Icon(
                                imageVector = if (isLandscape) Icons.Default.FullscreenExit else Icons.Default.Fullscreen,
                                contentDescription = "Fullscreen",
                                tint = ZapGold,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }
        }

        // Portrait Details & Controls
        if (!isLandscape) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                Text(
                    text = media.title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                if (episode != null) {
                    Text(
                        text = "Season ${episode.seasonNumber} · Episode ${episode.episodeNumber}: ${episode.title}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = ZapGold,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Server Selector
                Text(
                    text = "Streaming Server",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White
                )

                Spacer(modifier = Modifier.height(8.dp))

                listOf("VidSrc Ultra (Recommended)", "VidSrc Mirror 2 (1080p)", "Zap Direct Stream").forEach { server ->
                    val isSelected = selectedServer == server
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .clickable { selectedServer = server },
                        shape = RoundedCornerShape(10.dp),
                        color = if (isSelected) Color(0xFF1E1E2C) else Color(0xFF12121A),
                        border = if (isSelected) androidx.compose.foundation.BorderStroke(1.dp, ZapGold) else null
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = server,
                                color = if (isSelected) Color.White else Color.Gray,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                            if (isSelected) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = ZapGold,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Bottom Player Ad Placeholder (468x60 Ad Zone with exact dimensions)
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    AdBannerView(
                        zoneKey = "4b4e471c9bb70321a89ff1db782c427e",
                        widthDp = 468,
                        heightDp = 60
                    )
                }
            }
        }
    }
}
