# 🚀 Quick Start Guide

## Get the App on Your Phone in 2 Minutes!

### Step 1: Start the Server
```powershell
pnpm dev
```

### Step 2: Find Your Computer's IP Address
Run this command:
```powershell
ipconfig
```
Look for "IPv4 Address" - it looks like: `192.168.1.100`

### Step 3: Open on Your Phone
1. Make sure your phone is on the **same WiFi** as your computer
2. Open **Chrome** browser on your phone
3. Type in the address bar: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`
4. Press Enter

### Step 4: Install as App
1. Tap the **⋮** menu (three dots) in Chrome
2. Select **"Add to Home Screen"** or **"Install App"**
3. Tap **"Add"** or **"Install"**
4. Done! 🎉

The app icon will appear on your home screen like any other app!

---

## Want a Standalone APK Instead?

### If you don't want to keep your PC running:

**Option A: Use GitHub Actions (Easiest)**
1. Push your code to GitHub
2. GitHub automatically builds the APK
3. Download from Releases tab
4. Install on your phone

**Option B: Build Locally**
1. Install Java JDK 17: https://adoptium.net/temurin/releases/
2. Install Android Studio: https://developer.android.com/studio
3. Run: `.\build-apk.ps1`
4. Get APK from: `android\app\build\outputs\apk\debug\app-debug.apk`

See **[BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md)** for detailed instructions.

---

## Commands Cheat Sheet

```powershell
# Start development server
pnpm dev

# Start server and show IP for mobile
pnpm run serve:mobile

# Build production version
pnpm build

# Build Android APK (requires Java + Android Studio)
.\build-apk.ps1

# Open Android project in Android Studio
pnpm run open:android
```

---

## Troubleshooting

**Can't connect from phone?**
- ✅ Both devices on same WiFi?
- ✅ Server running on PC?
- ✅ Windows Firewall not blocking port 3000?
- Try: Settings → Windows Defender Firewall → Allow an app → Allow Node.js

**PWA won't install?**
- ✅ Using Chrome browser?
- ✅ Accessed via http:// (not file://)?
- Clear Chrome cache and try again

**Need help?**
- Check [INSTALL_ON_PHONE.md](INSTALL_ON_PHONE.md)
- Check [BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md)

---

## What's Next?

After installation:
1. **Add Workers** - Go to Workers tab
2. **Configure Services** - Go to Settings tab
3. **Schedule Appointments** - Go to Schedule tab
4. **Register Vehicles** - Add customer vehicles as needed

Enjoy your Maintenance Scheduler! 🚗✨
