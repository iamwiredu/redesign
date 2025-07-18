// Parallax and Animation Controller
class LuxuryAnimations {
    constructor() {
        this.heroImage = document.getElementById('heroImage');
        this.newsletterBg = document.getElementById('newsletterBg');
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.setupParallax();
        this.setupSmoothScrolling();
        this.setupMobileCarousel();
    }

    setupScrollAnimations() {
        // Throttle scroll events for better performance
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Hero parallax effect
        if (this.heroImage) {
            this.heroImage.style.transform = `translateY(${rate}px) scale(1.1)`;
        }

        // Newsletter background parallax
        if (this.newsletterBg) {
            const newsletterSection = document.querySelector('.newsletter');
            const newsletterTop = newsletterSection.offsetTop;
            const newsletterRate = (scrolled - newsletterTop + window.innerHeight) * -0.3;
            this.newsletterBg.style.transform = `translateY(${newsletterRate}px) scale(1.1)`;
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add staggered animation for grid items
                    if (entry.target.classList.contains('grid-item')) {
                        this.animateGridItem(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.fade-in, .grid-item, .slide-in-left, .slide-in-right'
        );
        
        animatedElements.forEach(el => observer.observe(el));
    }

    animateGridItem(element) {
        // Add a slight delay based on the element's position in the grid
        const gridItems = Array.from(element.parentElement.children);
        const index = gridItems.indexOf(element);
        const delay = index * 100;
        
        setTimeout(() => {
            element.style.transitionDelay = '0ms';
        }, delay);
    }

    setupParallax() {
        // Initialize parallax positions
        this.updateParallax();
    }

    setupSmoothScrolling() {
        // Add smooth scrolling to anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileCarousel() {
        const carousel = document.querySelector('.mobile-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.dot');
        let currentSlide = 0;
        let isAutoPlaying = true;
        let autoPlayInterval;

        // Auto-play functionality
        const startAutoPlay = () => {
            if (isAutoPlaying) {
                autoPlayInterval = setInterval(() => {
                    nextSlide();
                }, 4000);
            }
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        const goToSlide = (index) => {
            // Remove active classes
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            // Add prev class for smooth transition
            if (index < currentSlide) {
                slides[currentSlide].classList.add('prev');
                setTimeout(() => {
                    slides[currentSlide].classList.remove('prev');
                }, 600);
            }

            currentSlide = index;

            // Add active classes
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        };

        const prevSlide = () => {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prev);
        };

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoPlay();
                goToSlide(index);
                // Restart autoplay after user interaction
                setTimeout(() => {
                    isAutoPlaying = true;
                    startAutoPlay();
                }, 3000);
            });
        });

        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            stopAutoPlay();
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
            endY = e.touches[0].clientY;
        }, { passive: true });

        carousel.addEventListener('touchend', () => {
            const deltaX = startX - endX;
            const deltaY = startY - endY;

            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }

            // Restart autoplay after swipe
            setTimeout(() => {
                isAutoPlaying = true;
                startAutoPlay();
            }, 3000);
        }, { passive: true });

        // Pause autoplay when carousel is not visible
        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isAutoPlaying = true;
                    startAutoPlay();
                } else {
                    isAutoPlaying = false;
                    stopAutoPlay();
                }
            });
        });

        carouselObserver.observe(carousel);

        // Start autoplay
        startAutoPlay();
    }
}

// Image Loading and Optimization
class ImageLoader {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalImages();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalImages() {
        // Preload hero image for better performance
        const heroImg = document.querySelector('.hero-image img');
        if (heroImg) {
            const img = new Image();
            img.src = heroImg.src;
        }
    }
}

// Interactive Elements
class InteractiveElements {
    constructor() {
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupFormInteractions();
        this.setupMenuInteractions();
        this.setupTouchOptimizations();
    }

    setupHoverEffects() {
        // Enhanced hover effects for collection items
        const collectionItems = document.querySelectorAll('.collection-item');
        
        collectionItems.forEach(item => {
            const overlay = item.querySelector('.item-overlay');
            const info = item.querySelector('.item-info');
            
            item.addEventListener('mouseenter', () => {
                if (overlay) overlay.style.opacity = '1';
                if (info) info.style.transform = 'translateY(0)';
            });
            
            item.addEventListener('mouseleave', () => {
                if (overlay) overlay.style.opacity = '0';
                if (info) info.style.transform = 'translateY(16px)';
            });
        });

        // Gallery item hover effects
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            
            item.addEventListener('mouseenter', () => {
                if (img) img.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                if (img) img.style.transform = 'scale(1)';
            });
        });
    }

    setupTouchOptimizations() {
        // For touch devices, show overlays by default
        if ('ontouchstart' in window) {
            const collectionItems = document.querySelectorAll('.collection-item');
            collectionItems.forEach(item => {
                const overlay = item.querySelector('.item-overlay');
                const info = item.querySelector('.item-info');
                
                if (overlay) overlay.style.opacity = '1';
                if (info) info.style.transform = 'translateY(0)';
            });
        }
    }

    setupFormInteractions() {
        const emailInput = document.querySelector('.email-input');
        const subscribeBtn = document.querySelector('.subscribe-btn');
        
        if (emailInput && subscribeBtn) {
            // Enhanced focus states
            emailInput.addEventListener('focus', () => {
                emailInput.style.borderColor = 'rgba(255,255,255,0.5)';
                emailInput.style.background = 'rgba(255,255,255,0.2)';
            });
            
            emailInput.addEventListener('blur', () => {
                emailInput.style.borderColor = 'rgba(255,255,255,0.3)';
                emailInput.style.background = 'rgba(255,255,255,0.1)';
            });

            // Form submission
            subscribeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmission(emailInput.value);
            });
        }
    }

    setupMenuInteractions() {
        const menuBtn = document.querySelector('.menu-btn');
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                // Add menu toggle functionality here
                console.log('Menu clicked');
            });
        }
    }

    handleNewsletterSubmission(email) {
        if (this.validateEmail(email)) {
            // Simulate form submission
            const subscribeBtn = document.querySelector('.subscribe-btn');
            const originalText = subscribeBtn.textContent;
            
            subscribeBtn.textContent = 'Subscribing...';
            subscribeBtn.disabled = true;
            
            setTimeout(() => {
                subscribeBtn.textContent = 'Subscribed!';
                setTimeout(() => {
                    subscribeBtn.textContent = originalText;
                    subscribeBtn.disabled = false;
                    document.querySelector('.email-input').value = '';
                }, 2000);
            }, 1000);
        } else {
            alert('Please enter a valid email address');
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeScrollPerformance();
        this.setupResizeHandler();
        this.setupReducedMotion();
    }

    optimizeScrollPerformance() {
        // Debounce scroll events
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                // Additional scroll-based optimizations can go here
            }, 10);
        }, { passive: true });
    }

    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            
            resizeTimeout = setTimeout(() => {
                // Recalculate positions and animations on resize
                window.dispatchEvent(new Event('scroll'));
            }, 250);
        });
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduced-motion');
            // Disable animations for users who prefer reduced motion
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new LuxuryAnimations();
    new ImageLoader();
    new InteractiveElements();
    new PerformanceOptimizer();
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    // Trigger initial scroll event for parallax
    window.dispatchEvent(new Event('scroll'));
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('paused');
        window.dispatchEvent(new Event('scroll'));
    }
});
