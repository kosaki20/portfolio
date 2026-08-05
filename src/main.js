/* ========================================
   MAIN ENTRY POINT
   ======================================== */

// Import all styles
import './styles/index.css';

// Import all JS modules
import { copyEmail, initAchievements, initKonamiCode } from './js/utils.js';
import { initTerminal } from './js/terminal.js';
import { initCarousel } from './js/carousel.js';
import { initModals } from './js/modals.js';
import { initSpotlight, initParallax, initBootSequence, initCounters, initScrollReveal, initScrollGlow, initProgressBar } from './js/effects.js';
import { initNavigation } from './js/navigation.js';
import { initContactForm } from './js/contact.js';

// Expose copyEmail globally for onclick handlers in HTML
window.copyEmail = copyEmail;

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Visual effects
  initSpotlight();
  initParallax();
  initBootSequence();
  initProgressBar();

  // Interactive features
  initTerminal();
  initCarousel();
  initModals();
  initNavigation();
  initContactForm();

  // Scroll-driven features
  initCounters();
  initScrollReveal();
  initScrollGlow();

  // Easter eggs & achievements
  initAchievements();
  initKonamiCode();
});
