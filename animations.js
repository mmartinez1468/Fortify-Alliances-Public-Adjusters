/**
 * Professional Animation System
 * Viewport-triggered animations with IntersectionObserver
 *
 * Threshold: 25% - Industry standard for smooth, professional animations
 * This means animations trigger when 25% of the element is visible
 */

class AnimationSystem {
    constructor() {
        // Professional threshold: 25% visibility triggers animation
        this.threshold = 0.25;

        // Configure intersection observer options
        this.observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: this.threshold
        };

        // Initialize observers
        this.initializeObservers();
    }

    /**
     * Initialize all animation observers
     */
    initializeObservers() {
        // Observer for one-time animations (.animate)
        this.animateObserver = new IntersectionObserver(
            (entries) => this.handleAnimateEntries(entries),
            this.observerOptions
        );

        // Observer for repeating animations (.animate-repeat)
        this.animateRepeatObserver = new IntersectionObserver(
            (entries) => this.handleAnimateRepeatEntries(entries),
            this.observerOptions
        );

        // Observer for line animations (one-time)
        this.lineObserver = new IntersectionObserver(
            (entries) => this.handleLineEntries(entries),
            this.observerOptions
        );

        // Observer for repeating line animations
        this.lineRepeatObserver = new IntersectionObserver(
            (entries) => this.handleLineRepeatEntries(entries),
            this.observerOptions
        );

        // Start observing elements
        this.observeElements();
    }

    /**
     * Find and observe all animation elements
     */
    observeElements() {
        // Observe .animate elements (one-time)
        const animateElements = document.querySelectorAll('.animate');
        animateElements.forEach(element => {
            this.animateObserver.observe(element);
        });

        // Observe .animate-repeat elements
        const animateRepeatElements = document.querySelectorAll('.animate-repeat');
        animateRepeatElements.forEach(element => {
            this.animateRepeatObserver.observe(element);
        });

        // Observe line animation elements (one-time)
        const lineElements = document.querySelectorAll('.line-animate, .line-horizontal, .line-vertical');
        lineElements.forEach(element => {
            this.lineObserver.observe(element);
        });

        // Observe repeating line animation elements
        const lineRepeatElements = document.querySelectorAll('.line-animate-repeat');
        lineRepeatElements.forEach(element => {
            this.lineRepeatObserver.observe(element);
        });
    }

    /**
     * Handle one-time animation entries (.animate)
     */
    handleAnimateEntries(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'in-view' class to trigger animation
                entry.target.classList.add('in-view');

                // Unobserve after animating (one-time only)
                this.animateObserver.unobserve(entry.target);
            }
        });
    }

    /**
     * Handle repeating animation entries (.animate-repeat)
     */
    handleAnimateRepeatEntries(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'in-view' class to trigger animation
                entry.target.classList.add('in-view');
            } else {
                // Remove 'in-view' class when out of viewport
                // This allows the animation to reset and replay
                entry.target.classList.remove('in-view');
            }
        });
    }

    /**
     * Handle line animation entries (one-time)
     */
    handleLineEntries(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'in-view' class to trigger line animation
                entry.target.classList.add('in-view');

                // Line animations are one-time, so unobserve
                this.lineObserver.unobserve(entry.target);
            }
        });
    }

    /**
     * Handle repeating line animation entries (.line-animate-repeat)
     */
    handleLineRepeatEntries(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'in-view' class to trigger line animation
                entry.target.classList.add('in-view');
            } else {
                // Remove 'in-view' class when out of viewport
                // This allows the animation to reset and replay
                entry.target.classList.remove('in-view');
            }
        });
    }

    /**
     * Refresh observers (useful when dynamically adding elements)
     */
    refresh() {
        // Disconnect existing observers
        this.animateObserver.disconnect();
        this.animateRepeatObserver.disconnect();
        this.lineObserver.disconnect();
        this.lineRepeatObserver.disconnect();

        // Re-observe all elements
        this.observeElements();
    }

    /**
     * Destroy all observers
     */
    destroy() {
        this.animateObserver.disconnect();
        this.animateRepeatObserver.disconnect();
        this.lineObserver.disconnect();
        this.lineRepeatObserver.disconnect();
    }
}

// Initialize animation system when DOM is ready
let animationSystem;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        animationSystem = new AnimationSystem();
    });
} else {
    // DOM already loaded
    animationSystem = new AnimationSystem();
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationSystem;
}
