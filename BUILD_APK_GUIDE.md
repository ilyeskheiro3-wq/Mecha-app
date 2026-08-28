# Building APK for Android

Your app is configured with Capacitor for native Android. You have **2 easy options** - no Android Studio needed!

---

## Option 1: GitHub Actions Build (EASIEST - No Setup!)

Build your APK in the cloud - no Java, no Android Studio, nothing to install!

### Steps:
1. Push your code to GitHub
2. GitHub automatically builds the APK
3. Download from Releases tab
4. Install on your phone

**Time:** 5 minutes setup + 5-10 minutes build  
**Requirements:** GitHub account (free)

📖 **See: [GITHUB_BUILD_GUIDE.md](GITHUB_BUILD_GUIDE.md) for complete instructions**

---

## Option 2: Local Gradle Build (Fast, After Setup)

Build on your computer using Gradle. Android Studio NOT required!

### Quick Build:

```powershell
# Automatic Java install + build
.\install-java-and-build.ps1

# Or if Java already installed
.\build-apk.ps1
```

### Manual Setup:

1. **Install Java JDK 17** (one time setup)
   - Download: https://adoptium.net/temurin/releases/
   - Choose: JDK 17 (LTS) for Windows x64
   - Install and restart terminal

2. **Build the APK:**
   ```powershell
   pnpm build
   npx cap sync android
   cd android
   .\gradlew.bat assembleDebug
   ```

3. **Get your APK:**
   - Location: `android\app\build\outputs\apk\debug\app-debug.apk`
   - Copy to phone and install

**Time:** 15 min setup + 3-5 min builds  
**Requirements:** Java JDK 17 only

---

## Option 3: PWA Installation (Instant, No APK)

Install as Progressive Web App - no building needed!

**Steps:**
1. Run: `pnpm dev`
2. On phone: Open Chrome → `http://YOUR_PC_IP:3000`
3. Menu → "Add to Home Screen"
4. Done!

**Pros:** Instant (2 minutes), no compilation  
**Cons:** Requires PC to be running

📖 **See: [QUICK_START.md](QUICK_START.md)**

---

## Current Project Status ✅

- ✅ Next.js app configured for static export
- ✅ Capacitor initialized
- ✅ Android platform added  
- ✅ Web assets synced
- ✅ PWA manifest configured
- ✅ Gradle wrapper ready
- ✅ GitHub Actions workflow configured
- ⏳ Java JDK needed for local build (optional)
- ❌ Android Studio NOT required!

---

## Recommended Path

**For immediate testing:**
→ PWA method (2 minutes)

**For standalone APK (easiest):**
→ GitHub Actions (5 min setup, no local requirements)

**For standalone APK (fastest builds after setup):**
→ Local Gradle build (requires Java JDK 17 only)

---

## Quick Commands

```powershell
# Automatic Java install + build APK
.\install-java-and-build.ps1

# Build APK (if Java installed)
.\build-apk.ps1

# Serve for PWA installation
pnpm run serve:mobile

# Manual Gradle build
cd android
.\gradlew.bat assembleDebug
```

---

## Troubleshooting

### "JAVA_HOME not set" or "java command not found"
**Solution 1 (Automatic):**
```powershell
.\install-java-and-build.ps1
```

**Solution 2 (Manual):**
- Download Java JDK 17: https://adoptium.net/temurin/releases/
- Install with default settings
- Restart terminal
- Run: `java -version` to verify

### Gradle errors
- Make sure Java 17 is installed (not Java 8 or 21)
- Close and reopen terminal to refresh PATH
- Run: `cd android` then `.\gradlew.bat clean`
- Try again: `.\gradlew.bat assembleDebug`

### Build takes forever
- First build downloads dependencies (5-10 minutes normal)
- Subsequent builds are much faster (2-3 minutes)
- Use `--no-daemon` flag to avoid memory issues

### Don't want to deal with Java?
→ Use GitHub Actions! See [GITHUB_BUILD_GUIDE.md](GITHUB_BUILD_GUIDE.md)
→ Or use PWA: See [QUICK_START.md](QUICK_START.md)

---

## What's Next?

Let me know which option you'd like to pursue and I can help you:
- Set up GitHub Actions for automatic builds
- Configure release signing for Google Play
- Help with Java/Android Studio installation
- Deploy to a server for the PWA option
