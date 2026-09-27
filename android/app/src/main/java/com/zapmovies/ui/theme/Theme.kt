package com.zapmovies.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = ZapGold,
    secondary = ZapGoldLight,
    background = ZapDarkBg,
    surface = ZapSurface,
    onPrimary = Color.Black,
    onSecondary = Color.Black,
    onBackground = ZapTextWhite,
    onSurface = ZapTextWhite
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
