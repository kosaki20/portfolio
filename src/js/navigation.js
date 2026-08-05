/* ========================================
   NAVIGATION — Hamburger, Active Links, Themes, Skill Filter
   ======================================== */

import { spawnToast } from './utils.js';

// Hamburger mobile menu
window.toggleMenu = function() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  const isOpen = menu.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', isOpen);
};

window.closeMenu = function() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamburger');
  menu.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
};

// Theme switcher
window.setThemeAccent = function(themeName) {
  document.body.setAttribute('data-theme', themeName);
  document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
  const activeDot = document.querySelector(`.theme-dot.${themeName}`);
  if (activeDot) activeDot.classList.add('active');
  spawnToast('THEME UPDATED', `Switched theme accent to ${themeName.toUpperCase()}`);
};

// Skill cross-highlighting
window.highlightSkill = function(skillName) {
  const tickets = document.querySelectorAll('.ticket');
  let foundCount = 0;
  tickets.forEach(ticket => {
    const skills = (ticket.getAttribute('data-skills') || '').toLowerCase();
    if (skills.includes(skillName.toLowerCase())) {
      ticket.classList.add('highlight-pulse');
      foundCount++;
      setTimeout(() => ticket.classList.remove('highlight-pulse'), 3600);
    } else {
      ticket.classList.remove('highlight-pulse');
    }
  });
  if (foundCount > 0) {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    spawnToast('SKILL FILTER', `Highlighted ${foundCount} project(s) using ${skillName.toUpperCase()}`);
  }
};

export function initNavigation() {
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav');
    if (nav && !nav.contains(e.target)) window.closeMenu();
  });

  // Active nav link scroll tracker
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      if (window.scrollY >= secTop) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active-glow');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active-glow');
      }
    });
  });
}
