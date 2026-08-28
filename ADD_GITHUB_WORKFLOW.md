# 🔧 Add GitHub Actions Workflow for Automatic APK Builds

Your code is now on GitHub at: **https://github.com/ilyeskheiro3-wq/Mecha-app**

The automatic build workflow couldn't be added due to token permissions. Here's how to add it manually:

---

## Option 1: Add via GitHub Web Interface (Easiest)

### Steps:

1. **Go to your repository:**
   https://github.com/ilyeskheiro3-wq/Mecha-app

2. **Create the workflow directory:**
   - Click **"Add file"** → **"Create new file"**
   - In the filename box, type: `.github/workflows/build-apk.yml`
   - This will automatically create the folders

3. **Paste this content:**

```yaml
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        
    - name: Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 11
        
    - name: Setup Java JDK
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '17'
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build Next.js app
      run: pnpm build
      
    - name: Sync Capacitor
      run: npx cap sync android
      
    - name: Build Android Debug APK
      run: |
        cd android
        chmod +x gradlew
        ./gradlew assembleDebug --no-daemon
        
    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: maintenance-scheduler-debug
        path: android/app/build/outputs/apk/debug/app-debug.apk
        
    - name: Create Release
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      uses: softprops/action-gh-release@v1
      with:
        files: android/app/build/outputs/apk/debug/app-debug.apk
        tag_name: v1.0.${{ github.run_number }}
        name: Release v1.0.${{ github.run_number }}
        draft: false
        prerelease: false
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

4. **Commit the file:**
   - Scroll down
   - Add commit message: "Add APK build workflow"
   - Click **"Commit changes"**

5. **Wait for build:**
   - Go to **"Actions"** tab
   - Watch the build progress (5-10 minutes)
   - Download APK from **"Releases"** tab when done!

---

## Option 2: Add via Git Locally

### Steps:

1. **Create the file locally:**

```powershell
# In your project folder
New-Item -ItemType Directory -Path ".github\workflows" -Force
```

2. **Copy the workflow file:**
   - The file is already created at: `.github/workflows/build-apk.yml`
   - Content is in the repository

3. **Create a new token with workflow permissions:**
   - Go to: https://github.com/settings/tokens
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - Select scopes:
     - ✅ `repo` (all)
     - ✅ `workflow`
   - Generate and copy the new token

4. **Push with new token:**

```powershell
# Update remote with new token
git remote set-url origin https://NEW_TOKEN@github.com/ilyeskheiro3-wq/Mecha-app.git

# Create and add workflow file
Copy-Item "C:\path\to\build-apk.yml" ".github\workflows\build-apk.yml"

# Commit and push
git add .github/workflows/build-apk.yml
git commit -m "Add APK build workflow"
git push
```

---

## What Happens After Adding the Workflow?

1. **Automatic Build** triggers immediately
2. **Build takes 5-10 minutes** (first time)
3. **APK appears in two places:**
   - **Actions** → Latest run → **Artifacts** section
   - **Releases** → Latest release (automatic)

---

## How to Download Your APK

### From Actions (Every Build):
1. Go to **"Actions"** tab
2. Click latest **"Build Android APK"** workflow
3. Scroll to **"Artifacts"**
4. Download **"maintenance-scheduler-debug"**
5. Unzip to get `app-debug.apk`

### From Releases (Production):
1. Go to **"Releases"** (right sidebar)
2. Click latest release
3. Download `app-debug.apk` (no unzipping needed!)

---

## Alternative: Local Build (No GitHub Actions)

If you don't want to use GitHub Actions, you can build locally:

```powershell
# Auto-install Java and build
.\install-java-and-build.ps1

# Your APK will be at:
# android\app\build\outputs\apk\debug\app-debug.apk
```

See: **BUILD_APK_GUIDE.md** for details

---

## Next Steps

After adding the workflow:

1. ✅ **Push any changes** → Automatic build starts
2. ✅ **Download APK** from Releases
3. ✅ **Install on phone** and enjoy!

For manual builds:
1. Run `.\install-java-and-build.ps1`
2. Get APK from `android\app\build\outputs\apk\debug\`
3. Install on phone

---

## Repository Info

- **URL:** https://github.com/ilyeskheiro3-wq/Mecha-app
- **Actions:** https://github.com/ilyeskheiro3-wq/Mecha-app/actions
- **Releases:** https://github.com/ilyeskheiro3-wq/Mecha-app/releases

---

## 🎉 Summary

Your code is on GitHub! To get APK builds:

**Easiest:** Add workflow via web interface (steps above)
**Alternative:** Use local Gradle build with `.\install-java-and-build.ps1`

Both methods work great - choose what's easier for you! 🚀
