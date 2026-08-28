# Serve app locally for PWA installation
# This allows you to install the app on your phone without building an APK

Write-Host "🌐 Starting Maintenance Scheduler for mobile access" -ForegroundColor Cyan
Write-Host ""

# Get local IP address
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" }).IPAddress | Select-Object -First 1

if (-not $ipAddress) {
    $ipAddress = "localhost"
}

Write-Host "📱 Access the app from your phone at:" -ForegroundColor Green
Write-Host ""
Write-Host "   http://$ipAddress:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Instructions to install as PWA:" -ForegroundColor Cyan
Write-Host "1. Open the URL above on your phone's Chrome browser" -ForegroundColor White
Write-Host "2. Tap the menu (⋮) and select 'Add to Home Screen'" -ForegroundColor White
Write-Host "3. The app will install like a native app!" -ForegroundColor White
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host ""

# Start the dev server
pnpm dev
