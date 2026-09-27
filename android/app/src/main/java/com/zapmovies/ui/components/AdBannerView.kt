package com.zapmovies.ui.components

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
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            html, body {
              width: 100%;
              height: 100%;
              background: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '$zoneKey',
              'format' : 'iframe',
              'height' : $heightDp,
              'width' : $widthDp,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://avouchlawsrethink.com/$zoneKey/invoke.js"></script>
        </body>
        </html>
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
