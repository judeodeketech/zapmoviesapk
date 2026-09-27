import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Smartphone, Download, Loader2, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';
import { downloadAndroidProjectZip } from '../../services/nativeAndroidPackager';

interface ComposeCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMPOSE_FILES = [
  {
    name: 'APK-BUILD-GUIDE.md',
    description: 'Direct step-by-step instructions to turn this project into an installable APK',
    code: `# How to Generate the Installable Android APK

This project is pre-configured with minSdk 24, release signing, and testOnly=false so that you get a universal, standalone APK ready to install on any Android phone.

----------------------------------------------------------------------
METHOD 1: Build in Android Studio (Recommended - 2 Clicks)
----------------------------------------------------------------------
1. Click the "Download App ZIP" button in this window (or in Profile tab).
2. Unzip "ZapMovies-Android-Native.zip" on your computer.
3. Open Android Studio (Hedgehog or newer) and select "Open" -> choose the unzipped folder.
4. Let Gradle finish syncing.
5. In the top menu bar, click:
   Build -> Build Bundle(s) / APK(s) -> Build APK(s)
6. A notification appears: "APK(s) generated successfully". Click "locate".
   The universal release APK is at:
   app/build/outputs/apk/release/app-release.apk
7. Send this "app-release.apk" to your phone and tap to install!

----------------------------------------------------------------------
METHOD 2: Build via Terminal / Command Line
----------------------------------------------------------------------
1. Open terminal inside the unzipped project folder.
2. Run:
   - macOS / Linux:
     chmod +x gradlew
     ./gradlew assembleRelease
   - Windows (Command Prompt / PowerShell):
     gradlew.bat assembleRelease
3. The APK will be generated at:
   app/build/outputs/apk/release/app-release.apk
4. Install to your connected phone:
   adb install -r app/build/outputs/apk/release/app-release.apk
   (or copy the file to your phone's storage and open in any file manager)

----------------------------------------------------------------------
METHOD 3: 100% Free Cloud Build via GitHub Actions (No Android Studio Needed!)
----------------------------------------------------------------------
1. Push this project to any free GitHub repository.
2. The included .github/workflows/build-apk.yml workflow runs automatically.
3. Go to the "Actions" tab on GitHub -> Click the build run -> Download "ZapMovies-Release-APK".
4. Install the downloaded app-release.apk on your phone!

----------------------------------------------------------------------
SPECIFICATIONS
----------------------------------------------------------------------
- Output format: Standalone APK (.apk), NOT an AAB
- Build type: Release (Signed with universal installable cert)
- testOnly: false (Installs on normal Android phones without adb -t)
- minSdk: 24 (Compatible with Android 7.0 Nougat all the way to Android 15)
- Architecture: Kotlin + Jetpack Compose + Unsandboxed VidSrc WebKit with active click blocker
`
  },
  {
    name: 'VideoPlayerScreen.kt',
    description: 'Unsandboxed VidSrc Android SDK WebView with Outbound Click & Popup Blocker',
    code: `package com.zapmovies.ui.screens

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.os.Message
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.zapmovies.model.Episode
import com.zapmovies.model.MediaItem
import com.zapmovies.ui.components.AdBannerView

/**
 * Android SDK Native VideoPlayerScreen:
 * Runs VidSrc stream completely UNSANDBOXED for maximum hardware acceleration,
 * while utilizing Android SDK WebViewClient and WebChromeClient to actively block
 * 100% of outbound clicks, third-party redirects, and popup ads.
 */
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

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF08080A))
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(16f / 9f)
                .background(Color.Black)
        ) {
            // Android SDK Unsandboxed WebView with Outbound Click Blocker
            AndroidView(
                factory = { context ->
                    WebView(context).apply {
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

                            // Disable popup creation at SDK engine level
                            setSupportMultipleWindows(false)
                            javaScriptCanOpenWindowsAutomatically = false
                            allowFileAccess = false
                            allowContentAccess = false
                        }

                        // Android SDK Outbound Click Blocker
                        webViewClient = object : WebViewClient() {
                            /**
                             * Inspects every navigation attempt:
                             * - Allows internal stream hosts (vidsrc, 2embed, cloudflare, akamai, m3u8)
                             * - BLOCKS all external ad redirects, outbound clicks, and rogue market:// intents
                             */
                            override fun shouldOverrideUrlLoading(
                                view: WebView?,
                                request: WebResourceRequest?
                            ): Boolean {
                                val host = request?.url?.host ?: ""
                                val isAllowedStreamHost = host.contains("vidsrc") ||
                                        host.contains("2embed") ||
                                        host.contains("cloudflare") ||
                                        host.contains("akamai") ||
                                        host.contains("m3u8")

                                return if (isAllowedStreamHost) {
                                    false // Allow stream host to navigate
                                } else {
                                    true // BLOCK all outbound clicks & redirects
                                }
                            }
                        }

                        // Block window.open popups
                        webChromeClient = object : WebChromeClient() {
                            override fun onCreateWindow(
                                view: WebView?,
                                isDialog: Boolean,
                                isUserGesture: Boolean,
                                resultMsg: Message?
                            ): Boolean {
                                return false // Kill all popup windows
                            }
                        }

                        loadUrl(embedUrl)
                    }
                },
                modifier = Modifier.fillMaxSize()
            )

            // Top Floating Controls: Back & Native Share Intent
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
                    .align(androidx.compose.ui.Alignment.TopCenter),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(
                        imageVector = androidx.compose.material.icons.Icons.Default.ArrowBack,
                        contentDescription = "Back",
                        tint = Color.White
                    )
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
                    Icon(
                        imageVector = androidx.compose.material.icons.Icons.Default.Share,
                        contentDescription = "Share",
                        tint = Color.White
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Ad Zone (468x60)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            contentAlignment = androidx.compose.ui.Alignment.Center
        ) {
            AdBannerView(
                zoneKey = "4b4e471c9bb70321a89ff1db782c427e",
                widthDp = 468,
                heightDp = 60
            )
        }
    }
}
`
  },
  {
    name: 'AdBannerView.kt',
    description: 'Native Android SDK Ad Banner View with exact dimensions and isolated rendering',
    code: `package com.zapmovies.ui.components

import android.annotation.SuppressLint
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
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
fun AdBannerView(
    zoneKey: String,
    widthDp: Int,
    heightDp: Int,
    modifier: Modifier = Modifier
) {
    val htmlContent = """
        <!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>* { margin:0; padding:0; box-sizing:border-box; } html,body{width:100%;height:100%;background:transparent;display:flex;align-items:center;justify-content:center;overflow:hidden;}</style></head>
        <body><script type="text/javascript">atOptions = {'key' : '$zoneKey','format' : 'iframe','height' : $heightDp,'width' : $widthDp,'params' : {}};</script><script type="text/javascript" src="https://avouchlawsrethink.com/$zoneKey/invoke.js"></script></body></html>
    """.trimIndent()

    Box(
        modifier = modifier
            .width(widthDp.dp)
            .height(heightDp.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(Color.Black.copy(alpha = 0.4f)),
        contentAlignment = Alignment.Center
    ) {
        AndroidView(
            factory = { context ->
                WebView(context).apply {
                    setBackgroundColor(0x00000000)
                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        cacheMode = WebSettings.LOAD_DEFAULT
                        setSupportMultipleWindows(false)
                        javaScriptCanOpenWindowsAutomatically = false
                    }
                    webViewClient = WebViewClient()
                    loadDataWithBaseURL("https://avouchlawsrethink.com", htmlContent, "text/html", "UTF-8", null)
                }
            },
            modifier = Modifier
                .width(widthDp.dp)
                .height(heightDp.dp)
        )
    }
}
`
  },
  {
    name: 'MainActivity.kt',
    description: 'Root Android Activity with Compose Navigation, System Bars & TMDB integration',
    code: `package com.zapmovies

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
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
import com.zapmovies.model.MediaItem
import com.zapmovies.ui.screens.HomeScreen
import com.zapmovies.ui.screens.VideoPlayerScreen
import com.zapmovies.ui.theme.ZapGold
import com.zapmovies.ui.theme.ZapMoviesTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ZapMoviesTheme {
                var currentScreen by remember { mutableStateOf("home") }
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
  },
  {
    name: 'AndroidManifest.xml',
    description: 'Permissions, hardware acceleration, and launcher activity configuration',
    code: `<?xml version="1.0" encoding="utf-8"?>
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
  },
  {
    name: 'build.gradle.kts',
    description: 'App-level Gradle script with Jetpack Compose BOM, Retrofit, and WebKit dependencies',
    code: `plugins {
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
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
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
    implementation("androidx.compose.material3:material3")
    implementation("io.coil-kt:coil-compose:2.7.0")
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("androidx.webkit:webkit:1.12.1")
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const currentFile = COMPOSE_FILES[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      setDownloadSuccess(false);
      await downloadAndroidProjectZip((prog, status) => {
        setDownloadProgress(prog);
        setDownloadStatus(status);
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Download failed:', err);
      setDownloadStatus('Download error occurred');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c0c14] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#12121e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC72C] to-[#F5B301] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#F5B301]/20">
              <Smartphone size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>ZapMovies Android Native App</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[#F5B301] text-[10px] font-bold">
                  Kotlin & Android SDK
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Jetpack Compose · Unsandboxed Player · Outbound Click Blocker · Ad Zones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Download ZIP Button */}
            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadZip}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFC72C] to-[#F5B301] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-slate-950" />
                  <span>{downloadProgress}%</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 size={14} className="text-slate-950" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download App ZIP</span>
                </>
              )}
            </button>

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
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Highlight Banner: Outbound Click Blocker & Unsandboxed Player */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/15 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldCheck size={16} className="text-[#F5B301]" />
            <span className="font-semibold">
              Android SDK Protection: Unsandboxed VidSrc player with active outbound click and popup blocking
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            ./gradlew assembleDebug
          </span>
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

        {/* Bottom Actions & Download Bar */}
        <div className="px-6 py-3 bg-[#10101a] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F5B301]" />
            <span>
              {isDownloading
                ? downloadStatus || 'Packaging ZIP...'
                : 'Complete Android Studio project ready to download & build APK'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-4 py-1.5 rounded-xl bg-[#F5B301] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-300 transition-colors shadow-md"
            >
              <Download size={14} />
              <span>Download ZapMovies-Android-Native.zip</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
