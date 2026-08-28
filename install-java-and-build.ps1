# Automated Java Installation and APK Build
# This script installs Java JDK 17 and builds your APK without Android Studio

Write-Host "`n🚀 Automated APK Builder" -ForegroundColor Cyan
Write-Host "This will install Java JDK 17 and build your APK`n" -ForegroundColor Yellow

# Check if Java is already installed
Write-Host "Checking for Java..." -ForegroundColor Cyan
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java already installed: $javaVersion`n" -ForegroundColor Green
    $javaInstalled = $true
} catch {
    Write-Host "❌ Java not found. Will install Java JDK 17...`n" -ForegroundColor Yellow
    $javaInstalled = $false
}

if (-not $javaInstalled) {
    Write-Host "📥 Downloading Java JDK 17..." -ForegroundColor Cyan
    
    # Download Eclipse Temurin JDK 17 (OpenJDK)
    $jdkUrl = "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.13%2B11/OpenJDK17U-jdk_x64_windows_hotspot_17.0.13_11.msi"
    $jdkInstaller = "$env:TEMP\openjdk17.msi"
    
    try {
        Write-Host "Downloading from: $jdkUrl" -ForegroundColor Gray
        Invoke-WebRequest -Uri $jdkUrl -OutFile $jdkInstaller -UseBasicParsing
        Write-Host "✅ Download complete`n" -ForegroundColor Green
        
        Write-Host "📦 Installing Java JDK 17..." -ForegroundColor Cyan
        Write-Host "⏳ This may take a minute...`n" -ForegroundColor Yellow
        
        # Install silently
        Start-Process msiexec.exe -ArgumentList "/i `"$jdkInstaller`" /quiet /norestart ADDLOCAL=FeatureMain,FeatureEnvironment,FeatureJarFileRunWith,FeatureJavaHome" -Wait -NoNewWindow
        
        Write-Host "✅ Java JDK 17 installed!`n" -ForegroundColor Green
        
        # Refresh environment
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Verify installation
        Start-Sleep -Seconds 2
        $javaVersion = java -version 2>&1
        Write-Host "Installed: $javaVersion`n" -ForegroundColor Green
        
        # Clean up
        Remove-Item $jdkInstaller -ErrorAction SilentlyContinue
        
    } catch {
        Write-Host "❌ Failed to install Java automatically" -ForegroundColor Red
        Write-Host "`nPlease install manually from:" -ForegroundColor Yellow
        Write-Host "https://adoptium.net/temurin/releases/?version=17`n" -ForegroundColor Cyan
        Write-Host "After installing, re-run this script or use: .\build-apk.ps1`n" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔨 Building APK..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

# Step 1: Build Next.js
Write-Host "Step 1/3: Building Next.js app..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Next.js build failed!`n" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Next.js build complete`n" -ForegroundColor Green

# Step 2: Sync Capacitor
Write-Host "Step 2/3: Syncing Capacitor..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Capacitor sync failed!`n" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Capacitor sync complete`n" -ForegroundColor Green

# Step 3: Build APK with Gradle
Write-Host "Step 3/3: Building Android APK with Gradle..." -ForegroundColor Yellow
Write-Host "⏳ This will take a few minutes (downloading dependencies)...`n" -ForegroundColor Gray

Set-Location android
$env:JAVA_HOME = [System.Environment]::GetEnvironmentVariable("JAVA_HOME","Machine")

# Build using Gradle wrapper
.\gradlew.bat assembleDebug --no-daemon --warning-mode all

$buildResult = $LASTEXITCODE
Set-Location ..

if ($buildResult -eq 0) {
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "🎉 SUCCESS! APK Built!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray
    
    $apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
    
    if (Test-Path $apkPath) {
        $apkSize = (Get-Item $apkPath).Length / 1MB
        Write-Host "📱 Your APK is ready!" -ForegroundColor Cyan
        Write-Host "   Location: $apkPath" -ForegroundColor Yellow
        Write-Host "   Size: $([math]::Round($apkSize, 2)) MB`n" -ForegroundColor Gray
        
        Write-Host "📲 Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Copy the APK to your phone (USB, email, cloud)" -ForegroundColor White
        Write-Host "2. On your phone, enable 'Install from Unknown Sources'" -ForegroundColor White
        Write-Host "3. Tap the APK file to install" -ForegroundColor White
        Write-Host "4. Enjoy your app! 🚀`n" -ForegroundColor White
        
        # Offer to open folder
        $response = Read-Host "Open APK folder now? (Y/n)"
        if ($response -ne "n" -and $response -ne "N") {
            explorer "android\app\build\outputs\apk\debug"
        }
    } else {
        Write-Host "⚠️  APK built but file not found at expected location`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "❌ Build Failed!" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray
    
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Close this terminal and open a NEW one (to refresh Java PATH)" -ForegroundColor White
    Write-Host "2. Verify Java: run 'java -version'" -ForegroundColor White
    Write-Host "3. Try the GitHub Actions method (see below)`n" -ForegroundColor White
    
    Write-Host "🌐 Alternative: Use GitHub Actions (no local setup needed)" -ForegroundColor Cyan
    Write-Host "See: GITHUB_BUILD_GUIDE.md`n" -ForegroundColor Yellow
    
    exit 1
}
