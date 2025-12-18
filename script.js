/**
 * ============================================================================
 * FORTIFY ALLIANCES - MAIN JAVASCRIPT
 * ============================================================================
 *
 * TABLE OF CONTENTS:
 * 1. Navigation Menu System
 * 2. Navbar Scroll Effects
 * 3. Services Tabs Functionality
 * 4. Preload Overlay
 * 5. Viewport Section Observer
 *
 * NOTE: All animation logic is handled by animations.js
 * ============================================================================
 */





/* ============================================================================
   1. NAVIGATION MENU SYSTEM
   ============================================================================ */

/**
 * Navigation Menu Module
 * Handles hamburger menu toggle, overlay, and related interactions
 */
(function() {
    'use strict';

    // Cache DOM elements
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const navOverlay = document.getElementById('nav-overlay');
    const nav = document.querySelector('nav');
    const body = document.body;
    const menuLinks = document.querySelectorAll('.nav-overlay-menu a');

    /**
     * Toggle menu open/close state
     */
    function toggleMenu() {
        hamburgerIcon.classList.toggle('active');
        navOverlay.classList.toggle('active');
        nav.classList.toggle('nav-active');
        body.classList.toggle('menu-open');
    }

    /**
     * Close menu (used for programmatic closing)
     */
    function closeMenu() {
        if (navOverlay.classList.contains('active')) {
            toggleMenu();
        }
    }

    // Event Listeners
    hamburgerBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking on a menu link
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Close menu when clicking overlay background
    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) {
            closeMenu();
        }
    });

})();





/* ============================================================================
   2. NAVBAR SCROLL EFFECTS
   ============================================================================ */

/**
 * Navbar Scroll Module
 * Applies shrink effect to navbar after scrolling past 50% of hero section
 */
(function() {
    'use strict';

    const nav = document.querySelector('nav');
    const heroLandingSection = document.getElementById('heroLanding');

    /**
     * Handle navbar state based on scroll position
     */
    function handleNavbarScroll() {
        if (!heroLandingSection) {
            console.warn('heroLanding section not found');
            return;
        }

        // Calculate 50% point of hero section
        const heroHalfway = heroLandingSection.offsetTop +
                           (heroLandingSection.offsetHeight * 0.5);

        // Get current scroll position
        const scrollPosition = window.scrollY || window.pageYOffset;

        // Toggle shrink class
        if (scrollPosition >= heroHalfway) {
            nav.classList.add('nav-shrink');
        } else {
            nav.classList.remove('nav-shrink');
        }
    }

    // Event Listeners
    window.addEventListener('scroll', handleNavbarScroll);
    window.addEventListener('DOMContentLoaded', handleNavbarScroll);
    window.addEventListener('resize', handleNavbarScroll);

})();





/* ============================================================================
   3. SERVICES TABS FUNCTIONALITY
   ============================================================================ */

/**
 * Services Tabs Module
 * Handles responsive tab behavior for services section
 * Mobile: Accordion-style dropdowns
 * Desktop (768px+): Content displayed in separate area
 */
(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Cache DOM elements
        const serviceTabs = document.querySelectorAll('.services-tab');
        const desktopContentArea = document.querySelector('.services-content-desktop');
        let isDesktop = window.innerWidth >= 768;

        /**
         * Handle responsive layout changes
         * Moves active content to desktop area on larger screens
         */
        function handleLayout() {
            isDesktop = window.innerWidth >= 768;

            if (isDesktop) {
                const activeContent = document.querySelector('.services-tab-content.active');
                if (activeContent) {
                    const clone = activeContent.cloneNode(true);
                    desktopContentArea.innerHTML = '';
                    desktopContentArea.appendChild(clone);
                }
            }
        }

        /**
         * Trigger animations on cloned content
         * @param {Element} content - The content element to animate
         */
        function triggerAnimations(content) {
            setTimeout(() => {
                const animateElements = content.querySelectorAll('.animate-repeat');
                animateElements.forEach(el => {
                    el.classList.remove('in-view');
                    void el.offsetWidth; // Force reflow
                    el.classList.add('in-view');
                });
            }, 50);
        }

        /**
         * Handle desktop tab behavior
         * @param {Element} tab - The clicked tab element
         * @param {string} targetTab - The target tab identifier
         */
        function handleDesktopTab(tab, targetTab) {
            // Remove active from all tabs
            serviceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Find and clone matching content
            const matchingContent = document.querySelector(`[data-content="${targetTab}"]`);
            if (matchingContent) {
                const clone = matchingContent.cloneNode(true);
                clone.classList.add('active');
                desktopContentArea.innerHTML = '';
                desktopContentArea.appendChild(clone);
                triggerAnimations(clone);
            }
        }

        /**
         * Handle mobile tab behavior (accordion)
         * @param {Element} tab - The clicked tab element
         * @param {Element} content - The content element to show/hide
         */
        function handleMobileTab(tab, content) {
            const isOpening = !tab.classList.contains('active');

            // Close all other tabs
            serviceTabs.forEach(otherTab => {
                if (otherTab !== tab) {
                    const otherContainer = otherTab.closest('.services-tab-container');
                    const otherContent = otherContainer.querySelector('.services-tab-content');
                    otherTab.classList.remove('active');
                    otherContent.classList.remove('active');
                }
            });

            // Toggle current tab
            if (isOpening) {
                tab.classList.add('active');
                content.classList.add('active');
                triggerAnimations(content);
            } else {
                tab.classList.remove('active');
                content.classList.remove('active');
            }
        }

        /**
         * Main tab click handler
         */
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const container = this.closest('.services-tab-container');
                const content = container.querySelector('.services-tab-content');
                const targetTab = this.getAttribute('data-tab');

                if (isDesktop) {
                    handleDesktopTab(this, targetTab);
                } else {
                    handleMobileTab(this, content);
                }
            });
        });

        /**
         * Handle window resize with debouncing
         */
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const wasDesktop = isDesktop;
                isDesktop = window.innerWidth >= 768;

                if (wasDesktop !== isDesktop) {
                    handleLayout();
                }
            }, 250);
        });

        // Initialize
        handleLayout();

        // Trigger initial animations
        setTimeout(() => {
            const mobileContent = document.querySelector('.services-tab-content.active');
            const desktopContent = document.querySelector('.services-content-desktop .services-tab-content');

            if (mobileContent && !isDesktop) {
                const animateElements = mobileContent.querySelectorAll('.animate-repeat');
                animateElements.forEach(el => el.classList.add('in-view'));
            }

            if (desktopContent && isDesktop) {
                const animateElements = desktopContent.querySelectorAll('.animate-repeat');
                animateElements.forEach(el => el.classList.add('in-view'));
            }
        }, 200);
    });

})();





/* ============================================================================
   4. PRELOAD OVERLAY
   ============================================================================ */

/**
 * Preload Overlay Module
 * Handles the initial page load overlay animation
 */
(function() {
    'use strict';

    window.addEventListener('load', function() {
        const preloadOverlay = document.querySelector('.preload-overlay');

        if (!preloadOverlay) return;

        // Fade out logo
        setTimeout(() => {
            preloadOverlay.classList.add('fade-out');
        }, 500);

        // Slide up overlay
        setTimeout(() => {
            preloadOverlay.classList.add('hidden');
        }, 800);

        // Remove from DOM
        setTimeout(() => {
            preloadOverlay.remove();
        }, 1800);
    });

})();





/* ============================================================================
   5. VIEWPORT SECTION OBSERVER
   ============================================================================ */

/**
 * Viewport Section Module
 * Handles color transitions for viewport sections (.vsect-block)
 * Activates section styling when 70% of the section is visible
 */
(function() {
    'use strict';

    const blocks = document.querySelectorAll('.vsect-block');

    if (blocks.length === 0) return;

    /**
     * Intersection Observer callback
     * @param {IntersectionObserverEntry[]} entries - Observer entries
     */
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
                // Remove active class from all blocks
                blocks.forEach(b => b.classList.remove('vsect-active'));
                // Add active class to current block
                entry.target.classList.add('vsect-active');
            } else {
                // Reset when out of viewport
                entry.target.classList.remove('vsect-active');
            }
        });
    }

    // Create observer
    const observer = new IntersectionObserver(handleIntersection, {
        threshold: [0, 0.7]
    });

    // Observe all blocks
    blocks.forEach(block => observer.observe(block));

})();
