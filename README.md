# Automotive Maintenance Scheduler

A modern web application for managing automotive maintenance appointments, specifically designed for oil change (vidange) scheduling.

## Features

### 📅 Schedule Management
- View appointments in an interactive calendar/timeline
- Create, edit, and delete maintenance appointments
- Assign workers to specific time slots
- Color-coded appointment visualization
- Real-time scheduling with automatic time slot management

### 👨‍🔧 Worker Management
- Add and manage maintenance workers
- Track worker availability
- View worker schedules
- Color-coded worker identification

### 🚗 Vehicle Management
- Register customer vehicles
- Store vehicle information (make, model, year, VIN)
- Track customer contact details
- Maintain vehicle service history

### ⚙️ Service Settings
- Configure available maintenance services
- Set service durations
- Manage pricing
- Customize service offerings

## Tech Stack

- **Framework**: Next.js 16.3.3 (with Turbopack)
- **React**: 19.2.4
- **TypeScript**: 5.7.3
- **Styling**: Tailwind CSS 4.3.3
- **UI Components**: Custom components with Base UI
- **Icons**: Lucide React
- **Mobile**: Capacitor for native Android app
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v11.24.0 or higher)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### 📱 Install on Mobile Phone

**Want to use this app on your phone?** See **[INSTALL_ON_PHONE.md](INSTALL_ON_PHONE.md)** for:
- 🚀 PWA installation (2 minutes, no build needed)
- 📦 Building native Android APK
- 🌐 Automatic builds with GitHub Actions

**Quick start for PWA:**
```bash
pnpm run serve:mobile
# Then open http://YOUR_PC_IP:3000 on your phone
```

### Build for Production

```bash
pnpm build
pnpm start
```

### Build Android APK

**No Android Studio required!** Choose your method:

**Option 1: GitHub Actions (Easiest)**
```bash
# Push to GitHub and download APK from Releases
git push
# APK builds automatically in 5-10 minutes
```

**Option 2: Local Gradle Build**
```bash
# Auto-install Java + build APK
.\install-java-and-build.ps1

# Or if Java already installed
.\build-apk.ps1

# Or manually
pnpm build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

📖 **See [BUILD_OPTIONS.md](BUILD_OPTIONS.md) to compare all methods**

## Project Structure

```
automotive-maintenance-scheduler/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── schedule-tab.tsx   # Schedule management interface
│   ├── workers-tab.tsx    # Worker management interface
│   ├── settings-tab.tsx   # Service settings interface
│   ├── vehicle-sheet.tsx  # Vehicle registration form
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and types
│   ├── types.ts          # TypeScript type definitions
│   ├── scheduling.ts     # Scheduling logic
│   └── utils.ts          # Helper functions
├── android/              # Capacitor Android project
└── public/               # Static assets
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (static export)
- `pnpm start` - Start production server
- `pnpm build:android` - Build and sync Android project
- `pnpm open:android` - Open Android project in Android Studio
- `pnpm serve:mobile` - Start server for mobile PWA installation

## Mobile Installation Options

### Option 1: PWA (Recommended for Testing)
- Fastest method (2 minutes)
- No compilation required
- Full offline support
- See [INSTALL_ON_PHONE.md](INSTALL_ON_PHONE.md)

### Option 2: Native APK
- Standalone Android app
- No dependency on PC
- Requires Java JDK 17 + Android Studio
- Run `.\build-apk.ps1` after setup
- See [BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md)

### Option 3: GitHub Actions
- Automatic APK builds
- No local Java/Android Studio needed
- Push code to GitHub and download APK
- See `.github/workflows/build-apk.yml`

## Key Features

### Smart Scheduling
The app includes intelligent scheduling logic that:
- Prevents double-booking of workers
- Validates appointment time slots
- Ensures appointments fit within business hours
- Handles appointment conflicts

### Responsive Design
- Fully responsive layout
- Mobile-friendly interface
- Optimized for tablets and desktops
- PWA support for offline use

### Type Safety
- Full TypeScript implementation
- Comprehensive type definitions
- Enhanced IDE support

## Development

The app uses:
- **Turbopack** for fast builds and hot reload
- **PostCSS** for CSS processing
- **Tailwind CSS** for utility-first styling
- **Capacitor** for native mobile apps
- **ESLint** for code quality

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Android WebView (via Capacitor)

## Deployment

### Web Deployment
Deploy the static export to any hosting service:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting

### Mobile Distribution
- Direct APK installation
- Google Play Store (requires signing)
- Internal enterprise distribution

## Troubleshooting

See [BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md) for:
- Java/Android Studio setup
- Common build errors
- APK signing for production
- Google Play Store preparation

## License

MIT

## Author

Built with Kiro AI
