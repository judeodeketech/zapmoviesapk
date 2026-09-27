# ZapMovies - Standalone Installable Android APK Guide

This directory contains the production-ready Android Studio project built with **Kotlin**, **Jetpack Compose (Material3)**, **Android SDK 35 (minSdk 24)**, and **Android WebKit SDK** with active outbound click blocking.

---

## 📱 How to Build the Standalone APK (Installable on Any Android Phone)

This project is pre-configured to output a **standalone universal APK** (`app-release.apk`) that is:
- **Universal compatibility**: Supports all Android phones running **Android 7.0+ (API 24 to API 35)**.
- **Signed**: Automatically signed with release signing credentials so phones install it without signature rejection.
- **Not test-only**: `testOnly=false` so Android Package Installer will install it normally without `adb -t`.

---

### Method 1: Using Android Studio (Recommended GUI Method - 2 Clicks)

1. **Extract & Open**:
   - Extract `ZapMovies-Android-Native.zip` to a folder on your computer.
   - Open **Android Studio** (Hedgehog or newer).
   - Click **Open** and select the extracted folder.
2. **Sync Project**:
   - Android Studio will automatically download dependencies (Kotlin, Jetpack Compose, Coil, Retrofit).
3. **Build APK**:
   - From the top menu bar, click:
     `Build` -> `Build Bundle(s) / APK(s)` -> **`Build APK(s)`**
4. **Locate & Install the APK**:
   - When the build finishes, a notification appears at bottom-right saying **"APK(s) generated successfully"**.
   - Click **locate** or open the folder:
     `app/build/outputs/apk/release/app-release.apk`
   - Send this `app-release.apk` to your Android phone via WhatsApp, Telegram, Google Drive, USB, or email.
   - Tap the file on your phone to install!

---

### Method 2: Using the Command Line (Terminal / PowerShell)

1. Open a terminal inside the project directory:
   - On **macOS / Linux**:
     ```bash
     chmod +x gradlew
     ./gradlew assembleRelease
     ```
   - On **Windows (Command Prompt / PowerShell)**:
     ```cmd
     gradlew.bat assembleRelease
     ```
2. The standalone release APK is generated at:
   ```
   app/build/outputs/apk/release/app-release.apk
   ```
3. Install directly to a connected phone with USB debugging:
   ```bash
   adb install -r app/build/outputs/apk/release/app-release.apk
   ```
   Or simply copy `app-release.apk` to phone storage and open with any File Manager app.

---

### Method 3: 100% Free Automated Cloud Build via GitHub Actions (No Android Studio Needed!)

If you do not have Android Studio installed on your computer:
1. Push this project to a free private or public GitHub repository.
2. The included `.github/workflows/build-apk.yml` will automatically run.
3. Go to the **Actions** tab in your GitHub repository.
4. Click on the completed workflow run and download the **`ZapMovies-Release-APK`** artifact.
5. Extract the downloaded artifact to get your ready-to-install `app-release.apk`!
