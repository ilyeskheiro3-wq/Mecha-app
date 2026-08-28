# 🌐 Build APK with GitHub Actions (No Local Setup!)

This is the easiest way to get an APK without installing Java or Android Studio on your computer. GitHub will build the APK for you in the cloud!

## ✅ Advantages

- ✅ No Java installation needed
- ✅ No Android Studio needed
- ✅ No Gradle configuration needed
- ✅ Builds in the cloud automatically
- ✅ Download ready-to-install APK
- ✅ Free for public repositories

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Name it: `maintenance-scheduler` (or anything you want)
3. Keep it **Public** (for free Actions) or **Private** (if you have GitHub Pro)
4. Don't initialize with README
5. Click **Create repository**

### Step 2: Push Your Code

Open a new terminal in your project folder and run:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Maintenance Scheduler"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/maintenance-scheduler.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:**
```powershell
git remote add origin https://github.com/john/maintenance-scheduler.git
git push -u origin main
```

### Step 3: Wait for Build

1. Go to your repository on GitHub
2. Click the **"Actions"** tab
3. You'll see "Build Android APK" running
4. Wait 5-10 minutes for the build to complete ⏳
5. Green checkmark ✅ = Success!

### Step 4: Download Your APK

**Option A: From Actions (Latest Build)**
1. Click on the latest workflow run
2. Scroll down to **"Artifacts"**
3. Download **"maintenance-scheduler-debug"**
4. Unzip the downloaded file
5. You'll get `app-debug.apk`

**Option B: From Releases (Recommended)**
1. Go to your repository
2. Click **"Releases"** on the right sidebar
3. Download the latest `app-debug.apk`
4. No need to unzip!

### Step 5: Install on Your Phone

1. Copy `app-debug.apk` to your phone (USB, email, Google Drive, etc.)
2. On your phone:
   - Go to **Settings** → **Security**
   - Enable **"Install from Unknown Sources"** or **"Install Unknown Apps"**
   - Allow for **Chrome** or **Files** app
3. Tap the APK file
4. Tap **"Install"**
5. Done! 🎉

---

## 🔄 Updating Your App

Whenever you want to update the app:

```powershell
# Make your changes, then:
git add .
git commit -m "Update: description of changes"
git push
```

GitHub will automatically build a new APK!

---

## 🛠️ Troubleshooting

### "git: command not found"

**Install Git:**
- Download: https://git-scm.com/download/win
- Install with default settings
- Restart your terminal

### "Permission denied (publickey)"

**Use HTTPS instead of SSH:**
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/maintenance-scheduler.git
```

### "Actions not running"

**Make sure GitHub Actions are enabled:**
1. Go to repository **Settings**
2. Click **Actions** → **General**
3. Enable **"Allow all actions"**
4. Save

### "Build failed in Actions"

**Check the logs:**
1. Click on the failed workflow
2. Click on the "build" job
3. Read the error message
4. Common issues:
   - Syntax error in code (fix and push again)
   - Missing dependencies (already configured, shouldn't happen)
   - GitHub Actions quota exceeded (wait or upgrade to Pro)

### Can't find Releases section

**Create a release manually:**
1. After successful Actions build
2. Go to **Releases** → **Create new release**
3. Choose tag: `v1.0.0`
4. Upload the APK from Actions artifacts
5. Publish

---

## 📱 Alternative: Direct GitHub Pages + PWA

You can also deploy as a web app:

### Deploy to GitHub Pages:

1. In your repository, go to **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Add this file: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - uses: pnpm/action-setup@v2
        with:
          version: 11
      - run: pnpm install
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - uses: actions/deploy-pages@v4
```

4. Push this file
5. Your app will be at: `https://YOUR_USERNAME.github.io/maintenance-scheduler/`
6. Install as PWA from your phone!

---

## 📊 Build Status Badge (Optional)

Add a build badge to your README:

```markdown
![Build APK](https://github.com/YOUR_USERNAME/maintenance-scheduler/workflows/Build%20Android%20APK/badge.svg)
```

---

## 🎯 Comparison: GitHub vs Local Build

| Feature | GitHub Actions | Local Build |
|---------|----------------|-------------|
| **Setup Time** | 5 min | 15-30 min |
| **Java Required** | ❌ No | ✅ Yes |
| **Android Studio** | ❌ No | ❌ No |
| **Build Time** | 5-10 min | 3-5 min |
| **Internet Required** | ✅ Yes | Only first time |
| **Automatic Updates** | ✅ Yes | ❌ No |
| **Best For** | Easy setup, sharing | Faster iteration |

---

## 🚀 Recommended Workflow

**For Development:**
1. Use PWA for instant testing (2 minutes)
2. Make changes and test quickly
3. When ready for production → GitHub Actions

**For Production:**
1. Push final code to GitHub
2. Let Actions build the APK
3. Download and distribute
4. Optionally sign for Play Store

**For Quick Sharing:**
1. GitHub Pages + PWA = shareable link
2. Anyone can install from their phone browser
3. No APK download needed

---

## 💡 Next Steps

After your first successful build:

1. **Sign the APK** for production (see below)
2. **Customize the icon** in `public/icon.svg`
3. **Update app name** in `capacitor.config.ts`
4. **Add version number** in `package.json`

### Signing APK for Google Play Store:

```powershell
# Generate keystore (one time)
keytool -genkey -v -keystore maintenance-scheduler.keystore -alias scheduler -keyalg RSA -keysize 2048 -validity 10000

# Add to GitHub Secrets:
# Settings → Secrets → Actions → New repository secret
# KEYSTORE_FILE (base64 encoded)
# KEYSTORE_PASSWORD
# KEY_ALIAS
# KEY_PASSWORD
```

Then update the GitHub Actions workflow to use release build and signing.

---

## 🆘 Still Having Issues?

1. **Check the Actions log** - detailed error messages
2. **Try local build** - `.\install-java-and-build.ps1`
3. **Use PWA** - instant, no build needed
4. **Open an issue** on GitHub with error details

---

## ✅ You're All Set!

Once you push to GitHub, you'll have:
- ✅ Automatic APK builds
- ✅ Version tracking
- ✅ Easy distribution
- ✅ Backup in the cloud

Happy coding! 🎉
