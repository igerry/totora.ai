// Initialize language functionality
class LanguageManager {
    constructor() {
        this.translations = {};
        this.currentLang = this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        // Check for stored language preference first
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

        return langMap[langCode] || 'en';
    }

    async init() {
        // Load initial language translations
        await this.loadLanguage(this.currentLang);

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
    }

    getDirection(lang) {
        // All supported languages are left-to-right
        return 'ltr';
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
        this.screenshots = {
            en: 6,
            'zh-CN': 3,
            'zh-TW': 3,
            ja: 3,
            ko: 3,
            fr: 3,
            de: 3,
            es: 3,
            it: 3,
            ru: 3,
            ar: 3,
            hi: 3,
            th: 3,
            vi: 3,
            id: 3,
            pt: 3
        };
        this.currentLanguage = this.detectLanguage();
        this.isAutoPlaying = false;
        this.autoPlayInterval = null;
        this.init();
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
        this.loadScreenshots();

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
    }

    loadScreenshots() {
        const track = document.getElementById('screenshot-track');
        if (!track) {
            console.error('Screenshot track element not found!');
            return;
        }

        const count = this.screenshots[this.currentLanguage] || 3;
        const langPath = this.getLanguagePath(this.currentLanguage);
        const fallbackLangPath = 'en'; // Always fallback to English

        console.log(`Loading ${count} screenshots for language: ${this.currentLanguage} (${langPath})`);

        // Check if we're likely to use English fallbacks
        if (langPath !== 'en' && !this.screenshotDirectoryExists(langPath)) {
            console.log(`Screenshot directory for ${langPath} not found, will use English fallbacks`);
        }

        // Clear existing screenshots
        track.innerHTML = '';

        // Create screenshot elements
        for (let i = 1; i <= count; i++) {
            const slide = document.createElement('div');
            slide.className = 'screenshot-item';

            // Add loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'screenshot-loading';
            loadingIndicator.innerHTML = `<div style="padding: 20px; text-align: center; color: #666; background: #f8f9fa; border-radius: 12px;">Loading screenshot ${i}...</div>`;
            slide.appendChild(loadingIndicator);

            const img = document.createElement('img');
            const imageSrc = `images/screenshots/${langPath}/${langPath}-${i}-hq.png`;
            img.src = imageSrc;
            img.alt = `Totora App Screenshot ${i} - ${this.currentLanguage}`;
            img.className = 'screenshot-img';
            img.loading = i <= 2 ? 'eager' : 'lazy';
            img.style.display = 'none'; // Hide until loaded

            let fallbackAttempted = false;

            // Add comprehensive error handling with English fallback
            img.addEventListener('error', () => {
                if (!fallbackAttempted) {
                    fallbackAttempted = true;
                    console.warn(`Failed to load HQ screenshot: ${img.src}`);

                    // Try fallback to non-hq version first
                    const nonHqSrc = `images/screenshots/${langPath}/${langPath}-${i}.png`;
                    console.log(`Trying non-HQ fallback: ${nonHqSrc}`);
                    img.src = nonHqSrc;
                } else {
                    // If non-HQ fails, try English HQ version
                    console.warn(`Failed to load non-HQ screenshot, trying English fallback`);
                    const englishHqSrc = `images/screenshots/en/en-${i}-hq.png`;
                    console.log(`Trying English HQ fallback: ${englishHqSrc}`);
                    img.src = englishHqSrc;
                    img.alt = `Totora App Screenshot ${i} - English`;

                    // Add final error handler for English fallback
                    img.addEventListener('error', () => {
                        console.error(`Failed to load English HQ screenshot, trying English non-HQ`);
                        const englishSrc = `images/screenshots/en/en-${i}.png`;
                        console.log(`Trying English non-HQ fallback: ${englishSrc}`);
                        img.src = englishSrc;

                        // Final fallback - show placeholder if English also fails
                        img.addEventListener('error', () => {
                            console.error(`All screenshot attempts failed for screenshot ${i}`);
                            loadingIndicator.style.display = 'none';
                            img.style.display = 'none';
                            const placeholder = document.createElement('div');
                            placeholder.className = 'screenshot-placeholder';
                            placeholder.innerHTML = `<div style="padding: 30px; background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 12px; text-align: center; color: #6c757d;">
                                <div style="font-size: 2rem; margin-bottom: 10px;">📱</div>
                                <div style="font-weight: 600; margin-bottom: 5px;">Screenshot ${i}</div>
                                <div style="font-size: 0.9rem;">Not Available</div>
                                <div style="font-size: 0.8rem; margin-top: 10px; color: #adb5bd;">Showing English fallback</div>
                            </div>`;
                            img.parentNode.appendChild(placeholder);
                        });
                    });
                }
            });

            // Add load success handling
            img.addEventListener('load', () => {
                loadingIndicator.style.display = 'none';
                img.style.display = 'block';
                img.classList.add('img-loaded');

                // Log which version was loaded
                if (img.src.includes('/en/')) {
                    console.log(`Successfully loaded English fallback screenshot: ${img.src}`);

                    // If we loaded an English screenshot and the current language has fewer screenshots than English,
                    // we might need to add more English screenshots to match English's count
                    const englishCount = this.screenshots['en'];
                    const currentLanguageCount = this.screenshots[this.currentLanguage];

                    if (i === currentLanguageCount && currentLanguageCount < englishCount) {
                        // Load remaining English screenshots
                        this.loadAdditionalEnglishScreenshots(i + 1, englishCount, track);
                    }
                } else {
                    console.log(`Successfully loaded screenshot: ${img.src}`);
                }

                // Force carousel update after first image loads
                if (i === 1) {
                    setTimeout(() => {
                        this.updateCarousel();
                    }, 100);
                }
            });

            slide.appendChild(img);
            track.appendChild(slide);
        }

        this.updateCarousel();
        this.updateIndicators();
    }

    loadAdditionalEnglishScreenshots(startIndex, endIndex, track) {
        console.log(`Loading additional English screenshots from ${startIndex} to ${endIndex}`);

        for (let i = startIndex; i <= endIndex; i++) {
            const slide = document.createElement('div');
            slide.className = 'screenshot-item';

            // Add loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'screenshot-loading';
            loadingIndicator.innerHTML = `<div style="padding: 20px; text-align: center; color: #666; background: #f8f9fa; border-radius: 12px;">Loading English screenshot ${i}...</div>`;
            slide.appendChild(loadingIndicator);

            const img = document.createElement('img');
            const englishHqSrc = `images/screenshots/en/en-${i}-hq.png`;
            img.src = englishHqSrc;
            img.alt = `Totora App Screenshot ${i} - English`;
            img.className = 'screenshot-img';
            img.loading = 'lazy';
            img.style.display = 'none'; // Hide until loaded

            // Add error handling for English screenshots
            img.addEventListener('error', () => {
                console.warn(`Failed to load English HQ screenshot: ${englishHqSrc}`);
                const englishSrc = `images/screenshots/en/en-${i}.png`;
                console.log(`Trying English non-HQ fallback: ${englishSrc}`);
                img.src = englishSrc;

                img.addEventListener('error', () => {
                    console.error(`Failed to load English screenshot ${i}`);
                    loadingIndicator.style.display = 'none';
                    img.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'screenshot-placeholder';
                    placeholder.innerHTML = `<div style="padding: 30px; background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 12px; text-align: center; color: #6c757d;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">📱</div>
                        <div style="font-weight: 600; margin-bottom: 5px;">English Screenshot ${i}</div>
                        <div style="font-size: 0.9rem;">Not Available</div>
                    </div>`;
                    img.parentNode.appendChild(placeholder);
                });
            });

            // Add load success handling
            img.addEventListener('load', () => {
                loadingIndicator.style.display = 'none';
                img.style.display = 'block';
                img.classList.add('img-loaded');
                console.log(`Successfully loaded additional English screenshot: ${img.src}`);

                // Update carousel when all images are loaded
                if (i === endIndex) {
                    setTimeout(() => {
                        this.updateCarousel();
                        this.updateIndicators();
                    }, 100);
                }
            });

            slide.appendChild(img);
            track.appendChild(slide);
        }
    }

    getLanguagePath(language) {
        const pathMap = {
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
        const track = document.getElementById('screenshot-track');
        if (!track) return this.screenshots[this.currentLanguage] || 3;

        const screenshotItems = track.querySelectorAll('.screenshot-item');
        return screenshotItems.length;
    }

    isUsingEnglishFallback() {
        const track = document.getElementById('screenshot-track');
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
        this.resetAutoPlay();
    }

    nextSlide() {
        const count = this.getCurrentScreenshotCount();
        this.currentIndex = (this.currentIndex + 1) % count;
        this.updateCarousel();
        this.updateIndicators();
        this.resetAutoPlay();
    }

    updateCarousel() {
        const track = document.getElementById('screenshot-track');
        if (!track) return;

        const slideWidth = 100; // percentage
        const offset = -this.currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}%)`;
    }

    setupIndicators() {
        this.updateIndicators();

        // Add click handlers to indicators
        const indicatorsContainer = document.getElementById('carousel-indicators');
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
        const track = document.getElementById('screenshot-track');
        const indicatorsContainer = document.getElementById('carousel-indicators');

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
        this.startAutoPlay();

        // Pause on hover
        const carousel = document.querySelector('.screenshot-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    startAutoPlay() {
        if (this.isAutoPlaying) return;
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 4000);
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
        const carousel = document.querySelector('.screenshot-carousel');
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
        const faqManager = new FAQManager();

        // Add store button functionality
        const appStoreButton = document.querySelector('.app-store-button');
        if (appStoreButton) {
            appStoreButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Redirect to App Store (placeholder)
                window.open('https://apps.apple.com/app/totora', '_blank');
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