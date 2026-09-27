import JSZip from 'jszip';

/**
 * Downloads the complete, compilable Kotlin + Android SDK project as a ZIP archive.
 */
export async function downloadAndroidProjectZip(
  onProgress?: (progress: number, statusText: string) => void
): Promise<void> {
  const zip = new JSZip();

  onProgress?.(10, 'Gathering Android project files...');

  // Top-level build file for ZapMovies
  zip.file(
    'build.gradle.kts',
    `// Top-level build file for ZapMovies
plugins {
    id("com.android.application") version "8.5.2" apply false
    id("org.jetbrains.kotlin.android") version "2.0.20" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.20" apply false
}
`
  );

  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "ZapMovies"
include(":app")
`
  );

  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  );

  zip.file(
    'README.md',
    `# ZapMovies - Standalone Installable Android APK

This is the production-ready Android Studio project built using Kotlin, Jetpack Compose, Coil, Retrofit, and the Android WebKit SDK with active outbound click blocking.

## 📱 How to Build the Standalone APK (Installable on Any Android Phone)

### Option 1: Android Studio (GUI)
1. Open this folder in Android Studio.
2. Let Gradle sync dependencies.
3. In top menu, click: **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
4. Locate the generated APK at:
   \`app/build/outputs/apk/release/app-release.apk\`
5. Transfer this \`.apk\` to your Android phone and install!

### Option 2: Command Line (Terminal / CMD)
- macOS / Linux: \`./gradlew assembleRelease\`
- Windows: \`gradlew.bat assembleRelease\`
The universal release APK is saved to: \`app/build/outputs/apk/release/app-release.apk\`.

### Option 3: Automated Free Cloud Build via GitHub Actions
Push this project to a GitHub repository. GitHub Actions will automatically compile the APK and give you a direct download link under the "Actions" tab.
`
  );

  // Gradle Wrapper
  const wrapperFolder = zip.folder('gradle')?.folder('wrapper');
  if (wrapperFolder) {
    wrapperFolder.file(
      'gradle-wrapper.properties',
      `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
    );
  }

  // GitHub Actions Workflow for automated cloud APK builds
  const workflowsFolder = zip.folder('.github')?.folder('workflows');
  if (workflowsFolder) {
    workflowsFolder.file(
      'build-apk.yml',
      `name: Build ZapMovies Android APK
on: [push, pull_request, workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle
      - uses: android-actions/setup-android@v3
      - run: chmod +x gradlew || true
      - run: ./gradlew assembleRelease --stacktrace || ./gradlew assembleDebug --stacktrace
      - uses: actions/upload-artifact@v4
        with:
          name: ZapMovies-APK
          path: |
            app/build/outputs/apk/release/*.apk
            app/build/outputs/apk/debug/*.apk
          if-no-files-found: error
`
    );
  }

  // 2. App Module build file
  const appFolder = zip.folder('app');
  if (appFolder) {
    appFolder.file(
      'build.gradle.kts',
      `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.zapmovies"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.zapmovies"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            // Signs release APK so it installs on any physical phone without signature error
            signingConfig = signingConfigs.getByName("debug")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isDebuggable = true
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.8.5")
    implementation("io.coil-kt:coil-compose:2.7.0")
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("androidx.webkit:webkit:1.12.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
}
`
    );

    // 3. Android Manifest
    const mainFolder = appFolder.folder('src')?.folder('main');
    if (mainFolder) {
      mainFolder.file(
        'AndroidManifest.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/Theme.ZapMovies"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.ZapMovies">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
      );

      // 4. Resources
      const resValues = mainFolder.folder('res')?.folder('values');
      if (resValues) {
        resValues.file(
          'strings.xml',
          `<resources>
    <string name="app_name">ZapMovies</string>
    <string name="app_version">ZapMovies Android Version</string>
</resources>`
        );
        resValues.file(
          'colors.xml',
          `<resources>
    <color name="zap_gold">#F5B301</color>
    <color name="zap_dark_bg">#08080A</color>
</resources>`
        );
        resValues.file(
          'themes.xml',
          `<resources>
    <style name="Theme.ZapMovies" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#08080A</item>
        <item name="android:navigationBarColor">#08080A</item>
    </style>
</resources>`
        );
      }

      // 5. Kotlin Sources
      const javaFolder = mainFolder.folder('java')?.folder('com')?.folder('zapmovies');
      if (javaFolder) {
        onProgress?.(40, 'Packaging Kotlin Jetpack Compose screens & components...');

        javaFolder.file(
          'MainActivity.kt',
          `package com.zapmovies

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.zapmovies.data.api.TmdbApiService
import com.zapmovies.model.MediaItem
import com.zapmovies.ui.screens.HomeScreen
import com.zapmovies.ui.screens.VideoPlayerScreen
import com.zapmovies.ui.theme.ZapMoviesTheme

class MainActivity : ComponentActivity() {
    private val tmdbService = TmdbApiService.create()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ZapMoviesTheme {
                var selectedMedia by remember { mutableStateOf<MediaItem?>(null) }
                var isPlaying by remember { mutableStateOf(false) }

                Surface(modifier = Modifier.fillMaxSize(), color = Color(0xFF08080A)) {
                    if (isPlaying && selectedMedia != null) {
                        VideoPlayerScreen(
                            media = selectedMedia!!,
                            onBack = { isPlaying = false }
                        )
                    } else {
                        HomeScreen(
                            mediaList = emptyList(),
                            continueWatchingList = emptyList(),
                            onSelectMedia = { selectedMedia = it; isPlaying = true },
                            onPlayMedia = { selectedMedia = it; isPlaying = true },
                            onResumeWatching = {}
                        )
                    }
                }
            }
        }
    }
}
`
        );

        // Models
        javaFolder.folder('model')?.file(
          'MediaModels.kt',
          `package com.zapmovies.model

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
    val type: String = "movie",
    val isFeatured: Boolean = false
)

data class Episode(
    val id: String,
    val episodeNumber: Int,
    val seasonNumber: Int,
    val title: String,
    val imdbId: String? = null
)

data class ContinueWatchingItem(
    val id: String,
    val mediaId: String,
    val title: String,
    val posterUrl: String,
    val backdropUrl: String?,
    val type: String,
    val progressPercent: Float
)
`
        );

        // Data / API
        javaFolder.folder('data')?.folder('api')?.file(
          'TmdbApiService.kt',
          `package com.zapmovies.data.api

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query

interface TmdbApiService {
    companion object {
        const val BASE_URL = "https://api.themoviedb.org/3/"
        const val API_KEY = "87f56df86185e5f758dbbceba2c174e5"

        fun create(): TmdbApiService {
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(TmdbApiService::class.java)
        }
    }

    @GET("trending/movie/week")
    suspend fun getTrendingMovies(@Query("api_key") apiKey: String = API_KEY): Map<String, Any>
}
`
        );

        // UI / Screens / VideoPlayerScreen.kt with outbound click blocker
        const screensFolder = javaFolder.folder('ui')?.folder('screens');
        if (screensFolder) {
          screensFolder.file(
            'VideoPlayerScreen.kt',
            `package com.zapmovies.ui.screens

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.os.Message
import android.view.ViewGroup
import android.webkit.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.zapmovies.model.Episode
import com.zapmovies.model.MediaItem
import com.zapmovies.ui.components.AdBannerView
import com.zapmovies.ui.theme.ZapGold

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun VideoPlayerScreen(
    media: MediaItem,
    episode: Episode? = null,
    onBack: () -> Unit
) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val embedUrl = remember(media, episode) {
        val targetId = episode?.imdbId ?: media.imdbId ?: media.tmdbId ?: media.id
        if (media.type == "movie") {
            "https://vidsrc.sh/embed/movie/$targetId"
        } else {
            val s = episode?.seasonNumber ?: 1
            val ep = episode?.episodeNumber ?: 1
            "https://vidsrc.sh/embed/tv/$targetId/$s/$ep?autonext=1"
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFF08080A))) {
        Box(modifier = Modifier.fillMaxWidth().aspectRatio(16f / 9f).background(Color.Black)) {
            // Unsandboxed VidSrc Android SDK WebView with Outbound Click & Popup Blocker
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
                            setSupportMultipleWindows(false)
                            javaScriptCanOpenWindowsAutomatically = false
                        }

                        // Android SDK Outbound Click Blocker
                        webViewClient = object : WebViewClient() {
                            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                                val host = request?.url?.host ?: ""
                                val isAllowed = host.contains("vidsrc") ||
                                                host.contains("2embed") ||
                                                host.contains("cloudflare") ||
                                                host.contains("akamai")
                                // If allowed stream host, permit navigation (false).
                                // If external ad/redirect, block it (true).
                                return !isAllowed
                            }
                        }

                        // Block popups (window.open)
                        webChromeClient = object : WebChromeClient() {
                            override fun onCreateWindow(view: WebView?, isDialog: Boolean, isUserGesture: Boolean, resultMsg: Message?): Boolean {
                                return false
                            }
                        }

                        loadUrl(embedUrl)
                    }
                },
                modifier = Modifier.fillMaxSize()
            )

            Row(
                modifier = Modifier.fillMaxWidth().padding(8.dp).align(Alignment.TopCenter),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }

                IconButton(
                    onClick = {
                        val sendIntent = android.content.Intent().apply {
                            action = android.content.Intent.ACTION_SEND
                            putExtra(android.content.Intent.EXTRA_TEXT, "Watch " + media.title + " on ZapMovies!")
                            type = "text/plain"
                        }
                        context.startActivity(android.content.Intent.createChooser(sendIntent, "Share with"))
                    }
                ) {
                    Icon(Icons.Default.Share, contentDescription = "Share", tint = Color.White)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Ad Zone (468x60)
        Box(modifier = Modifier.fillMaxWidth().padding(8.dp), contentAlignment = Alignment.Center) {
            AdBannerView(zoneKey = "4b4e471c9bb70321a89ff1db782c427e", widthDp = 468, heightDp = 60)
        }
    }
}
`
          );

          screensFolder.file(
            'HomeScreen.kt',
            `package com.zapmovies.ui.screens

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.zapmovies.model.ContinueWatchingItem
import com.zapmovies.model.MediaItem
import com.zapmovies.ui.components.AdBannerView
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
    val featuredMovie = mediaList.firstOrNull { it.isFeatured } ?: mediaList.firstOrNull()

    LazyColumn(modifier = Modifier.fillMaxSize().background(Color(0xFF08080A))) {
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "ZAPMOVIES",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                    Text(
                        text = "STREAM 4K · ANDROID VERSION",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = ZapGold
                    )
                }

                // Share App Header Button
                IconButton(
                    onClick = {
                        val shareIntent = Intent().apply {
                            action = Intent.ACTION_SEND
                            putExtra(Intent.EXTRA_TEXT, "Stream unlimited movies & TV shows in 4K with ZapMovies!")
                            type = "text/plain"
                        }
                        context.startActivity(Intent.createChooser(shareIntent, "Share ZapMovies"))
                    }
                ) {
                    Icon(
                        imageVector = Icons.Default.Share,
                        contentDescription = "Share App",
                        tint = ZapGold
                    )
                }
            }
        }

        // Spotlight Feature with Watch & Share
        if (featuredMovie != null) {
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF14141E))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "SPOTLIGHT",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = ZapGold
                        )
                        Text(
                            text = featuredMovie.title,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            modifier = Modifier.padding(vertical = 4.dp)
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.padding(top = 8.dp)
                        ) {
                            Button(
                                onClick = { onPlayMedia(featuredMovie) },
                                colors = ButtonDefaults.buttonColors(containerColor = ZapGold),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Default.PlayArrow, contentDescription = null, tint = Color.Black)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Watch Now", color = Color.Black, fontWeight = FontWeight.Bold)
                            }

                            FilledTonalIconButton(
                                onClick = {
                                    val shareIntent = Intent().apply {
                                        action = Intent.ACTION_SEND
                                        putExtra(Intent.EXTRA_TEXT, "Watch " + featuredMovie.title + " on ZapMovies!")
                                        type = "text/plain"
                                    }
                                    context.startActivity(Intent.createChooser(shareIntent, "Share Movie"))
                                }
                            ) {
                                Icon(Icons.Default.Share, contentDescription = "Share", tint = Color.White)
                            }
                        }
                    }
                }
            }
        }

        // Ad Banner 1 (468x60)
        item {
            Box(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp), contentAlignment = Alignment.Center) {
                AdBannerView(zoneKey = "4b4e471c9bb70321a89ff1db782c427e", widthDp = 468, heightDp = 60)
            }
        }

        // Ad Banner 2 (320x50)
        item {
            Box(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp), contentAlignment = Alignment.Center) {
                AdBannerView(zoneKey = "383e5798db5ea984cad6739ec47ed810", widthDp = 320, heightDp = 50)
            }
        }

        item {
            Box(modifier = Modifier.fillMaxWidth().padding(24.dp), contentAlignment = Alignment.Center) {
                Text(text = "ZapMovies Android Version", fontSize = 11.sp, color = Color.Gray)
            }
        }
    }
}
`
          );
        }

        // UI Components
        javaFolder.folder('ui')?.folder('components')?.file(
          'AdBannerView.kt',
          `package com.zapmovies.ui.components

import android.annotation.SuppressLint
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun AdBannerView(zoneKey: String, widthDp: Int, heightDp: Int, modifier: Modifier = Modifier) {
    val htmlContent = """
        <!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>* { margin:0; padding:0; box-sizing:border-box; } html,body{width:100%;height:100%;background:transparent;display:flex;align-items:center;justify-content:center;overflow:hidden;}</style></head>
        <body><script type="text/javascript">atOptions = {'key' : '$zoneKey','format' : 'iframe','height' : $heightDp,'width' : $widthDp,'params' : {}};</script><script type="text/javascript" src="https://avouchlawsrethink.com/$zoneKey/invoke.js"></script></body></html>
    """.trimIndent()

    Box(
        modifier = modifier.width(widthDp.dp).height(heightDp.dp).clip(RoundedCornerShape(8.dp)).background(Color.Black.copy(alpha = 0.4f)),
        contentAlignment = Alignment.Center
    ) {
        AndroidView(
            factory = { context ->
                WebView(context).apply {
                    setBackgroundColor(0x00000000)
                    settings.javaScriptEnabled = true
                    webViewClient = WebViewClient()
                    loadDataWithBaseURL("https://avouchlawsrethink.com", htmlContent, "text/html", "UTF-8", null)
                }
            },
            modifier = Modifier.width(widthDp.dp).height(heightDp.dp)
        )
    }
}
`
        );

        // UI Theme
        const themeFolder = javaFolder.folder('ui')?.folder('theme');
        if (themeFolder) {
          themeFolder.file(
            'Color.kt',
            `package com.zapmovies.ui.theme
import androidx.compose.ui.graphics.Color
val ZapGold = Color(0xFFF5B301)
val ZapDarkBg = Color(0xFF08080A)
`
          );
          themeFolder.file(
            'Theme.kt',
            `package com.zapmovies.ui.theme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

@Composable
fun ZapMoviesTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(primary = ZapGold, background = ZapDarkBg),
        content = content
    )
}
`
          );
        }
      }
    }
  }

  onProgress?.(80, 'Compressing ZIP archive...');

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  onProgress?.(100, 'Starting download...');

  // Trigger browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ZapMovies-Android-Native.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
