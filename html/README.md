# Totora App Website

A performance-optimized, responsive one-page website for the Totora bedtime story app.

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

### 📁 File Structure
```
html/
├── index.html              # Main HTML file
├── styles.css              # Optimized CSS with animations
├── script.js               # Multilingual JavaScript with performance monitoring
├── images/                 # Optimized image assets
│   ├── app-icon-30.png     # Footer logo (1.9KB)
│   ├── app-icon-80.png     # Header logo (9.6KB)
│   ├── app-icon-120.png    # Large logo (19KB)
│   ├── feature-image-400.png # Hero image (140KB)
│   └── screenshots/        # Multi-language app screenshots (692KB total)
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

## Development

### Local Development
Open `index.html` in a web browser. No build process required.

### Performance Monitoring
The website includes built-in performance monitoring that logs page load times to the console.

### SEO Best Practices
- Semantic HTML5 structure
- Alt text for all images
- Meta tags for mobile responsiveness
- Structured data for search engines

## Deployment

The website is ready for deployment to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting

Simply upload the entire `html/` directory to your hosting provider.