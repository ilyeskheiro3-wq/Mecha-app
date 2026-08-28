# 📱 Install on Your Phone - Quick Guide

## 🚀 FASTEST METHOD: Install as PWA (2 minutes)

This is the easiest way - no APK building required!

### Steps:

1. **Start the server:**
   ```powershell
   pnpm run serve:mobile
   ```
   Or simply: `pnpm dev`

2. **Note your PC's IP address** (shown in the terminal)
   - Example: `192.168.1.100`

3. **On your phone:**
   - Make sure you're on the same WiFi as your PC
   - Open **Chrome browser**
   - Go to: `http://YOUR_PC_IP:3000`
   - Example: `http://192.168.1.100:3000`

4. **Install the app:**
   - Tap the **⋮** (three dots) menu
   - Select **"Add to Home Screen"** or **"Install App"**
   - Done! The app icon appears on your home screen

**✅ Pros:**
- No compilation needed
- Instant setup (2 minutes)
- Easy to update (just refresh)
- Full features work

**❌ Cons:**
- Needs your PC to be running
- Requires same WiFi network

---

## 📦 Build Native APK (Requires Setup)

For a standalone app that works without your PC:

### Quick Build (if you have Java + Android Studio):

```powershell
# Run the build script
.\build-apk.ps1

# Your APK will be at:
# android\app\build\outputs\apk\debug\app-debug.apk
```

### First Time Setup:

1. **Install Java JDK 17:**
   - Download: https://adoptium.net/temurin/releases/
   - Choose: JDK 17 (LTS) for Windows x64
   - Install with default settings
   - Restart terminal

2. **Install Android Studio:**
   - Download: https://developer.android.com/studio
   - During installation, make sure to install Android SDK
   - Restart terminal

3. **Build the APK:**
   ```powershell
   .\build-apk.ps1
   ```

4. **Transfer to phone:**
   - Copy `app-debug.apk` to your phone
   - Enable "Install from Unknown Sources"
   - Tap the APK to install

---

## 🌐 Use GitHub Actions (No Local Setup)

If you push to GitHub, the APK builds automatically:

1. **Push your code:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Wait for build:**
   - Go to your GitHub repo
   - Click "Actions" tab
   - Wait for the build to complete (~5 minutes)

3. **Download APK:**
   - Go to "Releases" section
   - Download the latest `app-debug.apk`
   - Transfer to your phone and install

---

## 🎯 Recommended Path

**For immediate testing:**
→ Use PWA method (takes 2 minutes)

**For standalone app:**
→ Use GitHub Actions (easiest) or install Java/Android Studio (faster)

---

## 📱 Current Features

Your app includes:
- ✅ Schedule maintenance appointments
- ✅ Manage workers
- ✅ Track vehicles
- ✅ Service settings
- ✅ Offline-ready (PWA)
- ✅ Mobile-responsive design

---

## 🆘 Troubleshooting

### PWA Method:
**"Can't connect"**
- Make sure PC and phone are on same WiFi
- Check Windows Firewall isn't blocking port 3000
- Try: `http://localhost:3000` on PC first to verify server is running

### APK Build:
**"JAVA_HOME not set"**
- Install Java JDK 17
- Restart your terminal
- Run: `java -version` to verify

**"Android SDK not found"**
- Install Android Studio
- Open Android Studio once to complete setup
- Restart terminal

### Installation on Phone:
**"Can't install APK"**
- Enable "Install from Unknown Sources" in Settings
- Try "Install Unknown Apps" → Chrome → Allow

---

## 💡 Next Steps

After installation, you can:
1. Add your workers
2. Configure services
3. Start scheduling maintenance
4. Track your garage operations

Need help? Check `BUILD_APK_GUIDE.md` for detailed instructions!
