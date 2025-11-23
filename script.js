// Initialize language functionality
class LanguageManager {
    constructor() {
        this.translations = {};
        this.currentLang = this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        // Check for URL language parameter first (highest priority)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');

        if (urlLang) {
            // Validate and normalize URL language parameter
            const normalizedLang = this.normalizeLanguageCode(urlLang);

            if (normalizedLang) {
                console.log(`Language from URL parameter: ${urlLang} -> ${normalizedLang}`);
                // Store URL language preference for future visits
                localStorage.setItem('totora-language', normalizedLang);
                return normalizedLang;
            } else {
                console.warn(`Invalid language parameter in URL: ${urlLang}`);
            }
        }

        // Check for stored language preference
        const stored = localStorage.getItem('totora-language');
        if (stored) {
            return stored;
        }

        // Fall back to browser language detection
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];

        // Map language codes
        const langMap = {
            'zh': 'zh-CN',
            'ja': 'ja',
            'ko': 'ko',
            'fr': 'fr',
            'de': 'de',
            'es': 'es',
            'it': 'it',
            'ru': 'ru',
            'ar': 'ar',
            'hi': 'hi',
            'th': 'th',
            'vi': 'vi',
            'id': 'id',
            'pt': 'pt',
            'en': 'en'
        };

        const result = langMap[langCode] || 'en';
        console.log('🎯 Final detected language:', result);
        return result;
    }

    normalizeLanguageCode(langCode) {
        // Supported languages with their normalized forms
        const supportedLanguages = {
            'en': 'en',
            'english': 'en',
            'zh-cn': 'zh-CN',
            'zh-hans': 'zh-CN',
            'chinese-simplified': 'zh-CN',
            'zh-hant': 'zh-TW',
            'zh-tw': 'zh-TW',
            'chinese-traditional': 'zh-TW',
            'ja': 'ja',
            'japanese': 'ja',
            'ko': 'ko',
            'korean': 'ko',
            'fr': 'fr',
            'french': 'fr',
            'de': 'de',
            'german': 'de',
            'es': 'es',
            'spanish': 'es',
            'it': 'it',
            'italian': 'it',
            'ru': 'ru',
            'russian': 'ru',
            'ar': 'ar',
            'arabic': 'ar',
            'hi': 'hi',
            'hindi': 'hi',
            'th': 'th',
            'thai': 'th',
            'vi': 'vi',
            'vietnamese': 'vi',
            'id': 'id',
            'indonesian': 'id',
            'pt': 'pt',
            'portuguese': 'pt'
        };

        // Convert to lowercase for case-insensitive matching
        const normalizedInput = langCode.toLowerCase();
        return supportedLanguages[normalizedInput] || null;
    }

    async init() {
        // Log language detection info for debugging
        console.log(`Language initialization - Current URL: ${window.location.href}`);
        console.log(`Language initialization - Detected language: ${this.currentLang}`);

        // Load initial language translations and apply them
        await this.setLanguage(this.currentLang);

        // Add event listener for language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLang;
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }

        // Add event listeners for navigation links
        this.setupNavigation();

        // Add smooth scrolling and animations
        this.setupAnimations();
    }

    async loadLanguage(lang) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${lang}`);
            }
            this.translations[lang] = await response.json();
            console.log(`Successfully loaded translations for ${lang}`);
        } catch (error) {
            console.error(`Error loading language ${lang}:`, error);
            // Fallback to English if available
            if (lang !== 'en') {
                console.log('Falling back to English');
                await this.loadLanguage('en');
            }
        }
    }

    async setLanguage(lang) {
        // Load language if not already loaded
        if (!this.translations[lang]) {
            await this.loadLanguage(lang);
        }

        this.currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = this.getDirection(lang);

        // Update all translatable elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[lang] && this.translations[lang][key]) {
                element.textContent = this.translations[lang][key];
            }
        });

        // Also update elements with data-translate attribute (for privacy section)
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[lang] && this.translations[lang][key]) {
                element.textContent = this.translations[lang][key];
            }
        });

        // Update document title
        const titleKey = 'hero_title';
        if (this.translations[lang] && this.translations[lang][titleKey]) {
            document.title = this.translations[lang][titleKey];
        }

        // Save preference to localStorage
        localStorage.setItem('totora-language', lang);

        // Update ScreenshotCarousel language
        if (window.screenshotCarousel) {
            console.log(`Updating ScreenshotCarousel language to: ${lang}`);
            window.screenshotCarousel.setLanguage(lang);
        } else {
            console.warn(`ScreenshotCarousel not available yet`);
        }

        // Update URL parameter to reflect current language
        this.updateURLLanguageParameter(lang);
    }

    updateURLLanguageParameter(lang) {
        const url = new URL(window.location);
        const params = new URLSearchParams(url.search);

        // Update or add lang parameter
        params.set('lang', lang);
        url.search = params.toString();

        // Update browser history without creating a new history entry
        window.history.replaceState({}, '', url);

        console.log(`URL updated with language parameter: ${lang}`);
    }

    getDirection(lang) {
        // All supported languages are left-to-right
        return 'ltr';
    }

    // Utility method to generate language-specific URLs for sharing
    getLanguageURL(lang) {
        const url = new URL(window.location);
        const params = new URLSearchParams(url.search);
        params.set('lang', lang);
        url.search = params.toString();
        return url.toString();
    }

    // Utility method to get current language from URL (useful for debugging)
    getCurrentURLLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        return urlLang ? this.normalizeLanguageCode(urlLang) : null;
    }

    setupNavigation() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupAnimations() {
        // Throttled scroll handler for better performance
        let ticking = false;

        function updateAnimations() {
            // Parallax effect for hero section (optimized)
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.3}px) translateZ(0)`;
            }
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });

        // Optimized intersection observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    entry.target.classList.add('gpu-accelerated');

                    // Remove animation class after completion
                    setTimeout(() => {
                        entry.target.classList.add('animation-complete');
                        observer.unobserve(entry.target);
                    }, 600);
                }
            });
        }, observerOptions);

        // Observe elements with GPU acceleration
        document.querySelectorAll('.feature-card, .screenshot-item, .support-item, .privacy-section').forEach(el => {
            el.classList.add('gpu-accelerated');
            observer.observe(el);
        });
    }
}

// Language-aware Screenshot Carousel functionality
class ScreenshotCarousel {
    constructor() {
        this.currentIndex = 0;
        this.screenshots = {};
        this.screenshotCountsLoaded = false;
        this.currentLanguage = 'en'; // Will be updated by LanguageManager
        this.isAutoPlaying = false;
        this.autoPlayInterval = null;
        this.totalImagesToLoad = 0;
        this.imagesLoaded = 0;
        this.allImagesLoaded = false;
        this.init();
    }

    // Dynamically count JPEG files in screenshot directories
    // Track image loading progress
    trackImageLoad() {
        this.imagesLoaded++;
        console.log(`Image loaded: ${this.imagesLoaded}/${this.totalImagesToLoad}`);

        if (this.imagesLoaded === this.totalImagesToLoad && this.totalImagesToLoad > 0) {
            this.allImagesLoaded = true;
            console.log('All images loaded! Enabling autoscroll.');
            this.enableAutoScroll();
        }
    }

    resetImageTracking() {
        this.imagesLoaded = 0;
        this.totalImagesToLoad = 0;
        this.allImagesLoaded = false;
        this.disableAutoScroll();
    }

    enableAutoScroll() {
        // Only start autoscroll if all images are loaded
        if (this.allImagesLoaded) {
            // Remove any existing hover listeners to prevent duplicates
            const carousel = document.querySelector('.hero-screenshots-carousel');
            if (carousel) {
                const newCarousel = carousel.cloneNode(true);
                carousel.parentNode.replaceChild(newCarousel, carousel);
            }

            setTimeout(() => this.startAutoPlay(), 2000);

            // Pause on hover - add to fresh carousel element
            const freshCarousel = document.querySelector('.hero-screenshots-carousel');
            if (freshCarousel) {
                freshCarousel.addEventListener('mouseenter', () => this.stopAutoPlay());
                freshCarousel.addEventListener('mouseleave', () => this.startAutoPlay());
            }
        }
    }

    disableAutoScroll() {
        this.stopAutoPlay();
    }

    async loadScreenshotCounts() {
        console.log('Loading screenshot counts (hardcoded for reliability)...');

        // Hardcoded screenshot counts based on actual files in directories
        this.screenshots = {
            'en': 5,      // English has 5 screenshots (1-5.jpeg)
            'zh-CN': 5,  // Chinese Simplified has 5 screenshots (1-5.jpeg)
            'zh-TW': 5,  // Chinese Traditional has 5 screenshots (1-5.jpeg)
            'ja': 5,     // Japanese has 5 screenshots (1-5.jpeg)
            'ko': 5,     // Korean has 5 screenshots (1-5.jpeg)
            'fr': 0,     // Other languages not implemented yet
            'de': 0,
            'es': 0,
            'it': 0,
            'ru': 0,
            'ar': 0,
            'hi': 0,
            'th': 0,
            'vi': 0,
            'id': 0,
            'pt': 0
        };

        this.screenshotCountsLoaded = true;
        console.log('✅ Screenshot counts loaded:', this.screenshots);

        // Trigger initial load after counts are available
        this.loadScreenshots();
    }

    // Count JPEG files in a directory
    async countScreenshotsInDirectory(dirPath) {
        const testImages = [];
        const maxCount = 6; // Reduced to 6 since we know max is 5

        console.log(`Counting screenshots in directory: ${dirPath}`);

        for (let i = 1; i <= maxCount; i++) {
            const imageUrl = `images/screenshots/${dirPath}/${i}.jpeg`;

            try {
                const exists = await this.checkImageExists(imageUrl);
                console.log(`Checking ${imageUrl}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);

                if (exists) {
                    testImages.push(imageUrl);
                } else {
                    // If we find a gap, assume the count is the previous number
                    console.log(`Screenshot ${i} not found, stopping count at ${testImages.length}`);
                    break;
                }
            } catch (error) {
                console.log(`Error checking ${imageUrl}: ${error.message}`);
                break;
            }
        }

        console.log(`Final count for ${dirPath}: ${testImages.length} screenshots`);
        return testImages.length;
    }

    // Check if an image exists by trying to load it
    checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();

            const cleanup = () => {
                img.onload = null;
                img.onerror = null;
            };

            img.onload = () => {
                cleanup();
                resolve(true);
            };

            img.onerror = () => {
                cleanup();
                resolve(false);
            };

            img.src = url;

            // Timeout after 2 seconds (reduced from 3)
            setTimeout(() => {
                cleanup();
                resolve(false);
            }, 2000);
        });
    }

    // Get language path mapping
    getLanguagePathMap() {
        return {
            'en': 'en',
            'zh-CN': 'zh-hans',
            'zh-TW': 'zh-hant',
            'ja': 'ja',
            'ko': 'ko',
            'fr': 'fr',
            'de': 'de',
            'es': 'es',
            'it': 'it',
            'ru': 'ru',
            'ar': 'ar',
            'hi': 'hi',
            'th': 'th',
            'vi': 'vi',
            'id': 'id',
            'pt': 'pt'
        };
    }

    detectLanguage() {
        // Check for stored language preference first (matching LanguageManager)
        const stored = localStorage.getItem('totora-language');
        if (stored && this.screenshots[stored]) {
            console.log(`Using stored language: ${stored}`);
            return stored;
        }

        // Fall back to browser language detection
        const browserLang = navigator.language || navigator.userLanguage;
        const langMap = {
            'en': 'en',
            'en-US': 'en',
            'en-GB': 'en',
            'zh': 'zh-CN',
            'zh-CN': 'zh-CN',
            'zh-Hans': 'zh-CN',
            'zh-TW': 'zh-TW',
            'zh-HK': 'zh-TW',
            'zh-Hant': 'zh-TW',
            'ja': 'ja',
            'ja-JP': 'ja'
        };

        const detectedLang = langMap[browserLang] || 'en';
        const finalLang = this.screenshots[detectedLang] ? detectedLang : 'en';
        console.log(`Detected browser language: ${browserLang} -> ${detectedLang} -> ${finalLang}`);
        return finalLang;
    }

    init() {
        this.setupNavigation();
        this.setupIndicators();
        this.setupAutoPlay();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.loadScreenshotCounts(); // This will call loadScreenshots() when done

        // Listen for language changes from LanguageManager
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                const newLanguage = e.target.value;
                console.log(`Language changed from ${this.currentLanguage} to ${newLanguage}`);
                this.currentLanguage = newLanguage;
                this.currentIndex = 0;

                // Wait a moment for any potential language processing
                setTimeout(() => {
                    this.loadScreenshots();
                }, 100);
            });
        }

        // Add debug method to window for manual testing
        window.debugScreenshots = () => {
            console.log('Current language:', this.currentLanguage);
            console.log('Language path:', this.getLanguagePath(this.currentLanguage));
            console.log('Screenshot count:', this.screenshots[this.currentLanguage]);
            this.loadScreenshots();
        };

        // Show debug info on page
        this.showDebugInfo();
    }

    // Method to update language from LanguageManager
    setLanguage(language) {
        console.log(`ScreenshotCarousel language updated to: ${language} (was: ${this.currentLanguage})`);
        this.currentLanguage = language;
        this.currentIndex = 0; // Reset to first screenshot

        // Reset image tracking
        this.resetImageTracking();

        // Reload screenshots with new language
        this.loadScreenshotCounts();
    }

    showDebugInfo() {
        const debugDiv = document.createElement('div');
        debugDiv.id = 'screenshot-debug';
        debugDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 9999;
            max-width: 300px;
        `;

        let debugHTML = `<strong>Screenshot Debug Info:</strong><br>`;
        debugHTML += `Current Lang: ${this.currentLanguage}<br>`;
        debugHTML += `Counts: ${JSON.stringify(this.screenshots)}<br>`;

        debugDiv.innerHTML = debugHTML;
        document.body.appendChild(debugDiv);

        // Remove after 10 seconds
        setTimeout(() => {
            if (debugDiv.parentNode) {
                debugDiv.parentNode.removeChild(debugDiv);
            }
        }, 10000);
    }

    loadScreenshots() {
        const track = document.getElementById('hero-screenshot-track');
        if (!track) {
            console.error('Hero screenshot track element not found!');
            return;
        }

        // Wait for screenshot counts to be loaded
        if (!this.screenshotCountsLoaded) {
            console.log('Screenshot counts not loaded yet, skipping loadScreenshots');
            return;
        }

        let count = this.screenshots[this.currentLanguage] || 0;
        let langPath = this.getLanguagePath(this.currentLanguage);
        let useFallback = false;

        console.log(`loadScreenshots - Language: ${this.currentLanguage}, Path: ${langPath}, Count: ${count}`);

        // If current language has 0 screenshots, fallback to English
        if (count === 0) {
            console.log(`No screenshots found for ${this.currentLanguage}, falling back to English`);
            count = this.screenshots['en'] || 0;
            langPath = 'en';
            useFallback = true;
            console.log(`Using fallback - English count: ${count}`);
        }

        if (count === 0) {
            console.error('No English screenshots available either!');
            track.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">No screenshots available</div>';
            return;
        }

        console.log(`Loading ${count} screenshots for language: ${this.currentLanguage} (${useFallback ? 'using English fallback' : langPath})`);

        // Reset image tracking and set expected count
        this.resetImageTracking();
        this.totalImagesToLoad = count;

        // Clear existing screenshots
        track.innerHTML = '';

        // Create screenshot elements
        for (let i = 1; i <= count; i++) {
            const slide = document.createElement('div');
            slide.className = 'screenshot-item';
            slide.style.position = 'relative'; // Needed for absolute positioning of spinner overlay

            // Create the image first
            const img = document.createElement('img');
            img.alt = `Totora App Screenshot ${i} - ${this.currentLanguage}`;
            img.className = 'screenshot-img';

            // Use lazy loading for all screenshots, including the first one
            img.loading = 'lazy';
            img.setAttribute('data-src', `images/screenshots/${langPath}/${i}.jpeg`);
            img.src = `images/screenshots/${langPath}/${i}.jpeg`; // Also set src directly for immediate loading

            // img.style.display = 'none'; // Show immediately for debugging

            // Create spinner overlay
            const spinnerOverlay = document.createElement('div');
            spinnerOverlay.className = 'screenshot-spinner-overlay';
            spinnerOverlay.innerHTML = `
                <div class="screenshot-spinner"></div>
                <div class="screenshot-spinner-text">Loading screenshot ${i}...</div>
            `;

            let fallbackAttempted = false;

            // Add error handling with fallbacks
            img.addEventListener('error', () => {
                if (!fallbackAttempted) {
                    fallbackAttempted = true;
                    const currentSrc = img.src || img.getAttribute('data-src');
                    console.warn(`Failed to load screenshot: ${currentSrc}`);

                    // Try fallback to English version
                    const englishSrc = `images/screenshots/en/${i}.jpeg`;
                    console.log(`Trying English fallback: ${englishSrc}`);

                    // For lazy loaded images, set the src directly
                    if (img.hasAttribute('data-src')) {
                        img.removeAttribute('data-src');
                    }
                    img.src = englishSrc;
                } else {
                    // If first fallback fails, try different error handling
                    console.warn(`Failed to load English fallback screenshot`);
                    // Show error message in spinner overlay
                    spinnerOverlay.innerHTML = `<div style="padding: 20px; text-align: center; color: #999; background: transparent; border-radius: 12px;">Screenshot ${i} not available</div>`;
                    spinnerOverlay.style.display = 'flex';
                }
            });

            // Add load success handling
            img.addEventListener('load', () => {
                console.log(`Image ${i} loaded successfully`);
                // Hide spinner overlay and show image
                spinnerOverlay.style.display = 'none';
                img.style.display = 'block';
                img.classList.add('img-loaded');
                console.log(`Image ${i} - Display: ${img.style.display}, Visibility: ${window.getComputedStyle(img).display}`);

                // Log which version was loaded
                if (img.src.includes('/en/')) {
                    console.log(`Successfully loaded English fallback screenshot: ${img.src}`);

                    // If we loaded an English screenshot and the current language has fewer screenshots than English,
                    // we might need to add more English screenshots to match English's count
                    const englishCount = this.screenshots['en'];
                    const currentLanguageCount = this.screenshots[this.currentLanguage];

                    if (i === currentLanguageCount && currentLanguageCount < englishCount) {
                        // Update total images count to include additional English screenshots
                        const additionalImages = englishCount - currentLanguageCount;
                        this.totalImagesToLoad += additionalImages;
                        console.log(`Adding ${additionalImages} additional English screenshots. Total to load: ${this.totalImagesToLoad}`);

                        // Load remaining English screenshots
                        this.loadAdditionalEnglishScreenshots(i + 1, englishCount, track);
                    }
                } else {
                    console.log(`Successfully loaded screenshot: ${img.src}`);
                }

                // Track image loading progress
                this.trackImageLoad();

                // Force carousel update after first image loads
                if (i === 1) {
                    setTimeout(() => {
                        this.updateCarousel();
                    }, 100);
                }
            });

            // Add error handling to hide spinner on error too
            img.addEventListener('error', () => {
                spinnerOverlay.style.display = 'none';
            });

            // Append elements in correct order
            slide.appendChild(spinnerOverlay);
            slide.appendChild(img);
            track.appendChild(slide);
        }

        // Setup lazy loading for the newly created images
        this.setupLazyLoading();

        this.updateCarousel();
        this.updateIndicators();
    }

    loadAdditionalEnglishScreenshots(startIndex, endIndex, track) {
        console.log(`Loading additional English screenshots from ${startIndex} to ${endIndex}`);

        for (let i = startIndex; i <= endIndex; i++) {
            const slide = document.createElement('div');
            slide.className = 'screenshot-item';
            slide.style.position = 'relative'; // Needed for absolute positioning of spinner overlay

            const img = document.createElement('img');
            img.alt = `Totora App Screenshot ${i} - English`;
            img.className = 'screenshot-img';
            img.loading = 'lazy';
            img.setAttribute('data-src', `images/screenshots/en/${i}.jpeg`);
            img.style.display = 'none'; // Hide until loaded

            // Create spinner overlay
            const spinnerOverlay = document.createElement('div');
            spinnerOverlay.className = 'screenshot-spinner-overlay';
            spinnerOverlay.innerHTML = `
                <div class="screenshot-spinner"></div>
                <div class="screenshot-spinner-text">Loading English screenshot ${i}...</div>
            `;

            // Add error handling for English screenshots
            img.addEventListener('error', () => {
                const englishSrc = `images/screenshots/en/${i}.jpeg`;
                console.warn(`Failed to load English screenshot: ${englishSrc}`);

                // If lazy loading failed, try direct loading
                if (img.hasAttribute('data-src')) {
                    img.removeAttribute('data-src');
                    img.src = englishSrc;
                } else {
                    // Show error message in spinner overlay if direct loading also fails
                    spinnerOverlay.innerHTML = `<div style="padding: 30px; background: transparent; border: 2px dashed #dee2e6; border-radius: 12px; text-align: center; color: #6c757d;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">📱</div>
                        <div style="font-weight: 600; margin-bottom: 5px;">Screenshot ${i}</div>
                        <div style="font-size: 0.9rem;">Not Available</div>
                    </div>`;
                    spinnerOverlay.style.display = 'flex';
                }
            });

            // Add load success handling
            img.addEventListener('load', () => {
                // Hide spinner overlay and show image
                spinnerOverlay.style.display = 'none';
                img.style.display = 'block';
                img.classList.add('img-loaded');
                console.log(`Successfully loaded additional English screenshot: ${img.src}`);

                // Track image loading progress
                this.trackImageLoad();

                // Update carousel when all images are loaded
                if (i === endIndex) {
                    setTimeout(() => {
                        this.updateCarousel();
                        this.updateIndicators();
                    }, 100);
                }
            });

            // Add error handling to hide spinner on error too
            img.addEventListener('error', () => {
                spinnerOverlay.style.display = 'none';
            });

            // Append elements in correct order
            slide.appendChild(spinnerOverlay);
            slide.appendChild(img);
            track.appendChild(slide);
        }

        // Setup lazy loading for the additional English images
        this.setupLazyLoading();
    }

    getLanguagePath(language) {
        const pathMap = this.getLanguagePathMap();
        return pathMap[language] || 'en';
    }

    setupNavigation() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
    }

    getCurrentScreenshotCount() {
        const track = document.getElementById('hero-screenshot-track');
        if (!track) return this.screenshots[this.currentLanguage] || 3;

        const screenshotItems = track.querySelectorAll('.screenshot-item');
        return screenshotItems.length;
    }

    isUsingEnglishFallback() {
        const track = document.getElementById('hero-screenshot-track');
        if (!track) return false;

        const firstImg = track.querySelector('.screenshot-item img');
        return firstImg && firstImg.src && firstImg.src.includes('/en/');
    }

    screenshotDirectoryExists(langPath) {
        // Check if the directory exists by trying to load the first screenshot
        // This is a simple client-side check since we can't access the filesystem directly
        const knownDirectories = ['en', 'zh-hans', 'zh-hant', 'ja'];
        return knownDirectories.includes(langPath);
    }

    prevSlide() {
        const count = this.getCurrentScreenshotCount();
        this.currentIndex = (this.currentIndex - 1 + count) % count;
        this.updateCarousel();
        this.updateIndicators();

        // Only reset autoplay if all images are loaded
        if (this.allImagesLoaded) {
            this.resetAutoPlay();
        }
    }

    nextSlide() {
        const count = this.getCurrentScreenshotCount();
        this.currentIndex = (this.currentIndex + 1) % count;
        this.updateCarousel();
        this.updateIndicators();

        // Only reset autoplay if all images are loaded
        if (this.allImagesLoaded) {
            this.resetAutoPlay();
        }
    }

    updateCarousel() {
        const track = document.getElementById('hero-screenshot-track');
        if (!track) return;

        const slideWidth = 100; // percentage
        const offset = -this.currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}%)`;
    }

    setupIndicators() {
        this.updateIndicators();

        // Add click handlers to indicators
        const indicatorsContainer = document.getElementById('hero-carousel-indicators');
        if (indicatorsContainer) {
            indicatorsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('indicator')) {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    if (!isNaN(index)) {
                        this.currentIndex = index;
                        this.updateCarousel();
                        this.updateIndicators();
                        this.resetAutoPlay();
                    }
                }
            });
        }
    }

    updateIndicators() {
        const track = document.getElementById('hero-screenshot-track');
        const indicatorsContainer = document.getElementById('hero-carousel-indicators');

        if (!track || !indicatorsContainer) return;

        const count = this.getCurrentScreenshotCount();

        // Clear existing indicators
        indicatorsContainer.innerHTML = '';

        // Create new indicators
        for (let i = 0; i < count; i++) {
            const indicator = document.createElement('button');
            indicator.className = `indicator ${i === this.currentIndex ? 'active' : ''}`;
            indicator.setAttribute('data-index', i);
            indicator.setAttribute('aria-label', `Go to screenshot ${i + 1}`);
            indicatorsContainer.appendChild(indicator);
        }
    }

    setupAutoPlay() {
        // Don't start autoplay immediately - wait for all images to load
        // AutoScroll will be enabled when all images are loaded via enableAutoScroll()
        console.log('AutoPlay setup complete - waiting for all images to load before starting...');
    }

    startAutoPlay() {
        // Only start autoplay if all images are loaded
        if (!this.allImagesLoaded) {
            console.log('Cannot start autoplay - images not fully loaded yet');
            return;
        }

        if (this.isAutoPlaying) return;
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 3000);
        console.log('Autoplay started - all images loaded');
    }

    stopAutoPlay() {
        this.isAutoPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    setupTouchGestures() {
        const carousel = document.querySelector('.hero-screenshots-carousel');
        if (!carousel) return;

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let isDragging = false;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
        });

        carousel.addEventListener('touchend', () => {
            if (!isDragging) return;

            const diffX = endX - startX;
            const diffY = endY - startY;
            const threshold = 50;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }

            isDragging = false;
        });
    }

    // Setup custom lazy loading for screenshot images
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');

                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('lazy-loaded');
                        }

                        observer.unobserve(img);
                    }
                });
            }, {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            lazyImages.forEach(img => {
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
            });
        }
    }
}

// FAQ functionality
class FAQManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupFAQToggle();
    }

    setupFAQToggle() {
        const faqQuestions = document.querySelectorAll('.faq-question');

        // Check if FAQ elements exist
        if (faqQuestions.length === 0) {
            console.warn('No FAQ questions found');
            return;
        }

        console.log(`Found ${faqQuestions.length} FAQ questions`);

        faqQuestions.forEach((question, index) => {
            console.log(`Setting up FAQ question ${index + 1}`);

            question.addEventListener('click', (e) => {
                e.preventDefault();
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');

                console.log(`FAQ ${index + 1} clicked. Was active: ${isActive}`);

                // Close all other FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    if (item !== faqItem) {
                        item.classList.remove('active');
                    }
                });

                // Toggle current item
                if (!isActive) {
                    faqItem.classList.add('active');
                    console.log(`FAQ ${index + 1} activated`);
                } else {
                    faqItem.classList.remove('active');
                    console.log(`FAQ ${index + 1} deactivated`);
                }

                // Log final state
                setTimeout(() => {
                    console.log(`FAQ ${index + 1} final state: ${faqItem.classList.contains('active')}`);
                }, 50);
            });

            // Add hover effect for better UX
            question.style.cursor = 'pointer';
            question.addEventListener('mouseenter', () => {
                question.style.backgroundColor = 'rgba(52, 199, 89, 0.05)';
            });
            question.addEventListener('mouseleave', () => {
                question.style.backgroundColor = '';
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const languageManager = new LanguageManager();
        const screenshotCarousel = new ScreenshotCarousel();

        // Make instances available globally
        window.languageManager = languageManager;
        window.screenshotCarousel = screenshotCarousel;

        const faqManager = new FAQManager();

        // Add store button functionality
        const appStoreButton = document.querySelector('.app-store-button');
        if (appStoreButton) {
            appStoreButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Redirect to App Store (placeholder)
                window.open('https://apps.apple.com/app/totora-family-story-creator/id6753327480', '_blank');
            });
        }

        const playStoreButton = document.querySelector('.play-store-button');
        if (playStoreButton) {
            playStoreButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Redirect to Google Play (placeholder)
                window.open('https://play.google.com/store/apps/details?id=com.totora.app', '_blank');
            });
        }

        // Add learn more button functionality
        const learnMoreBtn = document.querySelector('.btn-secondary');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                document.querySelector('#features').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

        // Add loading state removal
        document.body.classList.add('loaded');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// Optimized image lazy loading with loading states
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Add loading state
                img.classList.add('img-loading');

                // Create new image to preload
                const newImg = new Image();
                newImg.onload = () => {
                    img.src = newImg.src;
                    img.classList.remove('img-loading');
                    img.classList.add('img-loaded');
                    observer.unobserve(img);
                };

                newImg.onerror = () => {
                    img.classList.remove('img-loading');
                    img.classList.add('img-error');
                    console.warn(`Failed to load image: ${img.src}`);
                    observer.unobserve(img);
                };

                newImg.src = img.src;
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    images.forEach(img => {
        // Add GPU acceleration
        img.classList.add('gpu-accelerated');
        imageObserver.observe(img);
    });
});

// Enhanced error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', () => {
            img.classList.add('img-error');
            // Try to reload once after a delay
            setTimeout(() => {
                const originalSrc = img.src;
                img.src = '';
                setTimeout(() => {
                    img.src = originalSrc;
                }, 100);
            }, 2000);
        });

        // Add complete event handler
        img.addEventListener('load', () => {
            img.classList.add('img-loaded');
        });
    });
});

// Performance monitoring
if (window.performance && window.performance.mark) {
    window.addEventListener('load', () => {
        // Mark page fully loaded
        performance.mark('page-fully-loaded');

        // Measure load performance
        if (performance.measure) {
            performance.measure('page-load-time', 'navigationStart', 'page-fully-loaded');
            const measure = performance.getEntriesByName('page-load-time')[0];
            console.log(`Page load time: ${measure.duration.toFixed(2)}ms`);
        }
    });
}