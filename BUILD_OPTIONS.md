# 📱 How to Get Your App on Your Phone

## Choose Your Method:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Option 1: GitHub Actions (EASIEST!)                        │
│  ═══════════════════════════════                            │
│                                                             │
│  Setup Time:  5 minutes                                     │
│  Build Time:  5-10 minutes                                  │
│  Requirements: GitHub account (free)                        │
│                                                             │
│  ✅ No Java needed                                          │
│  ✅ No Android Studio needed                                │
│  ✅ Automatic builds on every push                          │
│  ✅ Easy to share with others                               │
│                                                             │
│  📖 Guide: GITHUB_BUILD_GUIDE.md                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Option 2: Local Gradle Build                               │
│  ══════════════════════════                                 │
│                                                             │
│  Setup Time:  10-15 minutes (one time)                      │
│  Build Time:  3-5 minutes                                   │
│  Requirements: Java JDK 17 only                             │
│                                                             │
│  ✅ Faster builds after setup                               │
│  ✅ No internet needed (after first build)                  │
│  ✅ Full control over build process                         │
│  ❌ Requires Java installation                              │
│                                                             │
│  🚀 Quick: .\install-java-and-build.ps1                     │
│  📖 Guide: BUILD_APK_GUIDE.md                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Option 3: PWA (Instant!)                                   │
│  ═════════════════════                                      │
│                                                             │
│  Setup Time:  2 minutes                                     │
│  Build Time:  0 minutes (no build!)                         │
│  Requirements: Phone + WiFi                                 │
│                                                             │
│  ✅ Fastest method                                          │
│  ✅ No building needed                                      │
│  ✅ Works offline after first load                          │
│  ❌ Requires PC to be running                               │
│                                                             │
│  🚀 Quick: pnpm dev → Open on phone                         │
│  📖 Guide: QUICK_START.md                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Which Should You Choose?

### Choose **GitHub Actions** if:
- You don't want to install anything
- You want automatic builds
- You plan to share the app
- You're okay waiting 5-10 minutes per build

### Choose **Local Gradle** if:
- You're making frequent changes
- You want faster iteration
- You don't mind installing Java
- You need offline builds

### Choose **PWA** if:
- You want to test immediately
- You're still developing
- You don't need a standalone app yet
- Your PC will be running when you use it

---

## 🚀 Quick Start Commands

### GitHub Actions:
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/maintenance-scheduler.git
git push -u origin main

# Wait 5-10 minutes, download APK from Releases
```

### Local Gradle Build:
```powershell
# Automatic Java install + build
.\install-java-and-build.ps1

# Or if Java already installed
.\build-apk.ps1
```

### PWA:
```powershell
pnpm dev
# Open http://YOUR_PC_IP:3000 on phone
# Add to Home Screen
```

---

## 📊 Comparison Table

| Feature | GitHub | Gradle | PWA |
|---------|--------|--------|-----|
| **Setup** | 5 min | 15 min | 0 min |
| **Build** | 5-10 min | 3-5 min | 0 min |
| **Java needed** | ❌ | ✅ | ❌ |
| **Internet** | ✅ | First time | ✅ |
| **Standalone** | ✅ | ✅ | ❌ |
| **Auto-update** | ✅ | ❌ | ✅ |
| **Best for** | Production | Development | Testing |

---

## 💡 Recommended Workflow

**For first-time setup:**
1. Start with **PWA** (test in 2 minutes)
2. If you like it, set up **GitHub Actions** for APK
3. Or install Java and use **Local Gradle** for faster iteration

**For active development:**
1. Use **PWA** for instant testing
2. When ready, build APK with **Gradle** or **GitHub**
3. Distribute the APK to users

**For production:**
1. Use **GitHub Actions** for releases
2. Sign the APK for Play Store
3. Keep PWA version for web users

---

## 📚 Documentation

- **QUICK_START.md** - PWA installation (2 minutes)
- **BUILD_APK_GUIDE.md** - Local Gradle build overview
- **GITHUB_BUILD_GUIDE.md** - GitHub Actions setup
- **INSTALL_ON_PHONE.md** - Complete installation guide

---

## 🆘 Need Help?

**Can't decide?** → Start with PWA, then GitHub Actions

**Having issues?** → Check the specific guide for your method

**Want the easiest path?** → GitHub Actions (no setup!)

**Want the fastest builds?** → Local Gradle (after setup)

---

Choose your method and get started! 🚀
