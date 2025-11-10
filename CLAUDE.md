# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multilingual, responsive one-page website for the Totora bedtime story app. The website showcases an iOS/Android app that uses AI to generate personalized bedtime stories with voice cloning capabilities.

## Architecture

### Static Website Structure
- **Single-page application** with smooth scrolling navigation
- **Pure HTML/CSS/JavaScript** - no build process or framework dependencies
- **Multilingual support** for English, Simplified Chinese, Traditional Chinese, and Japanese
- **Mobile-first responsive design** with performance optimizations

### Key Components

#### Language System (`script.js:423-582`)
- `LanguageManager` class handles detection, switching, and persistence of language preferences
- Translations stored in `translations` object across all supported languages
- Language detection uses browser preferences with fallbacks
- Language state saved to localStorage

#### Screenshot Carousel (`script.js:585-912`)
- `ScreenshotCarousel` class manages language-aware screenshot display
- Different screenshot counts per language (en: 6, zh-CN: 3, zh-TW: 3, ja: 3)
- Auto-play functionality with pause on hover
- Touch gesture support for mobile devices
- Lazy loading with fallback image handling

#### FAQ System (`script.js:915-977`)
- `FAQManager` class handles collapsible FAQ sections
- Click-to-expand functionality with smooth animations
- Only one FAQ item open at a time

#### Performance Features
- **GPU-accelerated animations** using CSS transforms
- **Intersection Observer** for efficient scroll-triggered animations
- **Throttled scroll handlers** to improve performance
- **Image lazy loading** with loading states and error handling
- **Image optimization** - reduced from 5.5MB to 232KB total

## File Organization

```
/
├── index.html          # Main HTML structure with semantic sections
├── styles.css          # Complete styling with CSS custom properties
├── script.js           # All JavaScript functionality
├── images/            # Optimized image assets
│   ├── app-icon-*.png # Logo variations
│   ├── hero-main.png  # Main hero image
│   └── screenshots/   # Language-specific app screenshots
│       ├── en/        # English screenshots (6 images)
│       ├── zh-hans/   # Chinese Simplified (3 images)
│       ├── zh-hant/   # Chinese Traditional (3 images)
│       └── ja/        # Japanese (3 images)
└── CLAUDE.md          # This file
```

## Color Scheme

The website uses a green-to-teal gradient theme matching the iOS app:
- Primary Green: `rgba(52, 199, 89, 1)` (iOS green)
- Primary Teal: `rgba(90, 200, 250, 1)` (iOS teal)
- Emerald: `rgba(16, 185, 129, 1)`
- Mint: `rgba(132, 204, 22, 1)`

CSS custom properties defined in `:root` ensure consistency throughout.

## Development Workflow

### Local Development
- Open `index.html` directly in a web browser - no build process required
- All assets are relative paths - works immediately from file system
- For best results, use a local HTTP server to avoid CORS issues

### Adding New Languages
1. Add language code to `languageSelect` in `index.html`
2. Add translations object to `translations` in `script.js`
3. Update `detectLanguage()` method in both `LanguageManager` and `ScreenshotCarousel`
4. Add screenshot path mapping in `ScreenshotCarousel.getLanguagePath()`
5. Add language-specific screenshots to `images/screenshots/[language-code]/`

### Modifying Screenshots
- Screenshot images follow naming pattern: `[language-code]-[number]-hq.png`
- Fallback to non-hq versions if hq versions fail to load
- Update screenshot counts in `ScreenshotCarousel.screenshots` object

### Browser Compatibility
- Optimized for modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Uses CSS custom properties, modern JavaScript features, and CSS Grid
- Graceful degradation for older browsers

## Key Features

### Multilingual Support
- Complete translation system for all UI text
- Language-specific screenshot carousels
- RTL language support ready (all current languages are LTR)
- Language preference persistence

### Interactive Elements
- Smooth scroll navigation with active state indicators
- Mobile hamburger menu with touch gestures
- Screenshot carousel with auto-play, keyboard navigation, and touch gestures
- Collapsible FAQ sections
- Store download buttons with hover effects

### Performance Optimizations
- Image lazy loading with loading states
- GPU-accelerated animations
- Throttled event handlers
- Intersection Observer for viewport detection
- Optimized image assets (96% size reduction)

### Accessibility
- Semantic HTML5 structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- High contrast support

## Deployment

The website is ready for static hosting:
- No build process required
- All assets are self-contained
- Compatible with GitHub Pages, Netlify, Vercel, AWS S3, Firebase Hosting
- Simply upload the entire directory structure