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