# Build APK Script for Maintenance Scheduler
# Requires: Java JDK 17 (Android Studio NOT required!)
# To auto-install Java and build: run .\install-java-and-build.ps1

Write-Host "🚀 Building Android APK for Maintenance Scheduler" -ForegroundColor Cyan
Write-Host ""

# Check Java
Write-Host "Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Option 1: Auto-install Java and build" -ForegroundColor Cyan
    Write-Host "  Run: .\install-java-and-build.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 2: Manual install" -ForegroundColor Cyan
    Write-Host "  Download: https://adoptium.net/temurin/releases/" -ForegroundColor Yellow
    Write-Host "  Choose: JDK 17 (LTS) for Windows x64" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host ""

# Check if android folder exists
if (-not (Test-Path "android")) {
    Write-Host "❌ Android folder not found!" -ForegroundColor Red
    Write-Host "Run: npx cap add android" -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Building Next.js static export..." -ForegroundColor Cyan
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Next.js build complete" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Syncing Capacitor..." -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Sync failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Capacitor sync complete" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Building Android APK..." -ForegroundColor Cyan
Write-Host "⏳ First build may take 5-10 minutes (downloading Gradle dependencies)..." -ForegroundColor Yellow
Set-Location android
.\gradlew.bat assembleDebug --no-daemon
$buildResult = $LASTEXITCODE
Set-Location ..

if ($buildResult -eq 0) {
    Write-Host ""
    Write-Host "🎉 APK built successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Your APK is located at:" -ForegroundColor Cyan
    Write-Host "   android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Copy the APK to your phone" -ForegroundColor White
    Write-Host "2. Enable 'Install from Unknown Sources' on your phone" -ForegroundColor White
    Write-Host "3. Tap the APK file to install" -ForegroundColor White
    Write-Host ""
    
    # Open folder
    $openFolder = Read-Host "Open APK folder? (Y/n)"
    if ($openFolder -ne "n") {
        explorer "android\app\build\outputs\apk\debug"
    }
} else {
    Write-Host ""
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Make sure Java JDK 17 is installed" -ForegroundColor White
    Write-Host "2. Make sure JAVA_HOME is set correctly" -ForegroundColor White
    Write-Host "3. Make sure Android SDK is installed (via Android Studio)" -ForegroundColor White
    Write-Host ""
    Write-Host "See BUILD_APK_GUIDE.md for detailed instructions" -ForegroundColor Cyan
    exit 1
}
