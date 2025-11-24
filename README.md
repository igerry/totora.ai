# Totora App Website

A performance-optimized, responsive one-page website for the Totora AI-powered bedtime story app. This multilingual website showcases the iOS/Android app that generates personalized bedtime stories using AI technology with voice cloning capabilities.

## Features

### 🌍 Multilingual Support
- English (en)
- 简体中文 (zh-CN)
- 繁體中文 (zh-TW)
- 日本語 (ja)

### 📱 Official Store Integration
- **Apple App Store** - Official iOS download badge with Apple branding
- **Google Play Store** - Official Android download badge with Google branding
- **Responsive Design** - Optimized store badges for all screen sizes
- **Smooth Interactions** - Custom hover effects and micro-animations

### ⭐ App Features Showcased
1. **AI-Powered Stories** - Advanced AI technology for unique story generation
2. **Voice Cloning** - Personalized voice narration for comforting storytelling
3. **Customizable Elements** - Characters, themes, and morals personalization
4. **Age-Appropriate Content** - Tailored stories for different age groups
5. **Magic Grass System** - Personal magic touch enhancement system
6. **Voice Input** - Real-time voice recognition and speech-to-text
7. **Story Library** - Personal collection management
8. **Word Highlighting** - Synchronized narration with real-time highlighting

### 📱 Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly navigation

### 🎯 Interactive Screenshot Gallery
- **Multi-Language Support**: Screenshots in 4 languages (English, 简体中文, 繁體中文, 日本語)
- **Interactive Carousel**: Smooth transitions with auto-play functionality
- **Language Tabs**: Switch between different language screenshots
- **Touch Gestures**: Swipe support on mobile devices
- **Keyboard Navigation**: Arrow key controls for accessibility
- **Auto-Play**: 4-second intervals with pause on hover

### ⚡ Performance Optimizations
- **Image Optimization**: Reduced total image size from 5.5MB to 232KB
- **Lazy Loading**: Images load only when needed
- **GPU Acceleration**: Smooth animations using CSS transforms
- **Throttled Scroll Handlers**: Better performance during scrolling
- **Intersection Observer**: Efficient viewport detection

### 🎨 App Color Scheme - Green to Teal Gradient Theme
- **Primary Green**: `rgba(52, 199, 89, 1)` (iOS green)
- **Primary Teal**: `rgba(90, 200, 250, 1)` (iOS teal/cyan)
- **Emerald**: `rgba(16, 185, 129, 1)` (Darker green variant)
- **Mint**: `rgba(132, 204, 22, 1)` (Light mint green)
- **Background Gradient**: `linear-gradient(135deg, green, teal)` (matching Swift LinearGradient)
- **Footer Gradient**: `linear-gradient(135deg, dark-emerald, dark-teal)`

### 📁 Project Structure
```
/
├── index.html              # Main HTML file with semantic structure
├── styles.css              # Complete CSS with animations and responsive design
├── script.js               # Multilingual JavaScript with performance monitoring
├── CLAUDE.md               # Project documentation for Claude Code
├── images/                 # Optimized image assets
│   ├── app-icon-*.png      # Logo variations for different sizes
│   ├── hero-main.png       # Main hero illustration
│   └── screenshots/        # Language-specific app screenshots
│       ├── en/             # English screenshots (6 images)
│       ├── zh-hans/        # Chinese Simplified screenshots (3 images)
│       ├── zh-hant/        # Chinese Traditional screenshots (3 images)
│       └── ja/             # Japanese screenshots (3 images)
└── README.md               # This file
```

## Performance Features

### Image Optimization
- Original images: 5.5MB total
- Optimized images: 232KB total
- 96% size reduction while maintaining quality

### Animation Performance
- GPU-accelerated transforms
- `will-change` property optimization
- RequestAnimationFrame for smooth scrolling
- Passive event listeners for better performance

### Loading Experience
- Lazy loading for all images
- Loading shimmer effects
- Smooth fade-in animations
- Error handling with fallback states

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ iOS Safari 12+
- ✅ Android Chrome 60+

## Technical Implementation

### Core Components

#### Language Management System
- **`LanguageManager` class** (script.js:423-582) handles detection, switching, and persistence
- **Browser language detection** with intelligent fallbacks
- **LocalStorage persistence** for user language preferences
- **Dynamic content updates** across all UI elements

#### Screenshot Carousel System
- **`ScreenshotCarousel` class** (script.js:585-912) manages multi-language screenshots
- **Language-aware display** with different screenshot counts per language
- **Auto-play functionality** with pause on hover (4-second intervals)
- **Touch gesture support** for mobile swipe navigation
- **Lazy loading** with comprehensive error handling and fallbacks
- **Performance tracking** with load state management

#### FAQ System
- **`FAQManager` class** (script.js:915-977) handles collapsible sections
- **Smooth animations** with CSS transitions
- **Single-item expansion** policy for better UX

### Recent Updates

#### Bug Fixes (Latest)
- **Fixed loading spinner persistence issue** - Resolved race condition in screenshot loading where spinners remained visible after images loaded successfully
- **Consolidated error handling** - Removed duplicate event listeners that caused conflicting spinner states
- **Enhanced fallback mechanisms** - Improved error handling for additional English screenshots

#### Performance Optimizations
- **96% image size reduction** (5.5MB → 232KB) while maintaining visual quality
- **GPU-accelerated animations** using CSS transforms and `will-change` properties
- **Intersection Observer API** for efficient scroll-triggered animations
- **Throttled event handlers** to improve performance during user interactions

## Development

### Local Development
Open `index.html` directly in a web browser - no build process or dependencies required. For the best experience during development, use a local HTTP server to avoid CORS issues.

```bash
# Option 1: Python 3
python -m http.server 8000

# Option 2: Node.js (if installed)
npx serve .

# Option 3: Live Server in VS Code
# Use the Live Server extension
```

### Adding New Languages

1. **Add language option** to `languageSelect` in `index.html`
2. **Add translations** to `translations` object in `script.js`
3. **Update detection logic** in `LanguageManager.detectLanguage()` and `ScreenshotCarousel`
4. **Add screenshot paths** in `ScreenshotCarousel.getLanguagePath()`
5. **Add screenshots** to `images/screenshots/[language-code]/`

### Performance Monitoring
The website includes built-in performance monitoring that logs:
- Page load times
- Image loading progress
- Screenshot carousel initialization
- Language switching performance

Access these metrics via the browser console during development.

### Code Architecture
- **Pure JavaScript** - No frameworks or build dependencies
- **ES6+ features** with modern browser support
- **Modular class structure** for maintainability
- **Event-driven architecture** for responsive interactions
- **CSS Custom Properties** for consistent theming

### SEO Best Practices
- **Semantic HTML5** structure for better search engine understanding
- **Comprehensive alt text** for all images
- **Meta tags** for mobile responsiveness and social sharing
- **Structured data** for enhanced search results
- **Multilingual SEO** with proper hreflang support

## Deployment

The website is ready for deployment to any static hosting service. No build process required.

### Recommended Hosting Platforms
- **Netlify** - Drag-and-drop deployment with HTTPS
- **Vercel** - Git integration with automatic deployments
- **GitHub Pages** - Free hosting for public repositories
- **AWS S3 + CloudFront** - Scalable hosting with CDN
- **Firebase Hosting** - Google's hosting platform with global CDN

### Deployment Steps
1. **Prepare files** - Ensure all files are in the root directory
2. **Configure hosting** - Set up your hosting provider
3. **Upload files** - Drag-and-drop or use Git integration
4. **Configure HTTPS** - Enable SSL certificate (usually automatic)
5. **Test deployment** - Verify all features work in production

### Production Checklist
- [ ] All images optimized and loading correctly
- [ ] Multilingual switching works in all languages
- [ ] Screenshot carousel loads without spinner issues
- [ ] Store download badges link to correct app stores
- [ ] Mobile responsiveness tested on actual devices
- [ ] Performance metrics meet expectations (< 3s load time)
- [ ] SEO meta tags properly configured
- [ ] HTTPS certificate properly installed

## Troubleshooting

### Common Issues

#### Loading Spinners Not Disappearing
**Issue**: Screenshot loading spinners remain visible after images load
**Solution**: The latest update (Nov 2025) fixed this issue by consolidating duplicate error event listeners that caused race conditions in image loading.

#### Images Not Loading
**Symptoms**: Broken images or endless loading states
**Solutions**:
1. Check screenshot paths in `/images/screenshots/[language]/`
2. Verify image files exist and are properly named
3. Check browser console for 404 errors
4. Ensure proper file permissions

#### Language Switching Issues
**Symptoms**: Content not updating or reverting to English
**Solutions**:
1. Check browser localStorage for language preference
2. Verify translation data exists in `translations` object
3. Clear browser cache and test again
4. Check for JavaScript errors in console

#### Performance Issues
**Symptoms**: Slow loading or animations stuttering
**Solutions**:
1. Check if lazy loading is working properly
2. Monitor network tab for large assets
3. Verify GPU acceleration is enabled
4. Test on different devices/browsers

### Debug Tools

The website includes built-in debugging features:
- **Performance monitoring** in browser console
- **Language detection logs** for troubleshooting
- **Screenshot loading progress** with detailed status
- **Event listener tracking** for interaction debugging

### Support

For technical issues:
1. Check the browser console for JavaScript errors
2. Verify all files are properly uploaded
3. Test in multiple browsers for compatibility
4. Refer to the technical implementation section above

## License

This project is the official website for the Totora bedtime story app. All rights reserved.