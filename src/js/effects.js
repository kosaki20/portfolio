/* ========================================
   EFFECTS — Spotlight, Parallax, Boot, Counters, Observers
   ======================================== */

// Spotlight cursor tracking
export function initSpotlight() {
  document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
  });
}

// 3D Parallax tilt effect for hero showcase card
export function initParallax() {
  const showcaseContainer = document.getElementById('heroShowcase');
  const showcaseCard = document.getElementById('showcaseCard');
  if (!showcaseContainer || !showcaseCard) return;

  showcaseContainer.addEventListener('mousemove', (e) => {
    const rect = showcaseCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 16;
    const rotateY = (x / rect.width) * 16;
    showcaseCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  showcaseContainer.addEventListener('mouseleave', () => {
    showcaseCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
}

// Boot sequence animation
export function initBootSequence() {
  const bootLines = [
    "> initializing kurt.dev",
    "> loading profile: Kurt Fariñas — BS Computer Science",
    "> checking status... <span class=\"ok\">OPEN_TO_WORK</span>",
    "> ready."
  ];
  const bootLog = document.getElementById('bootLog');
  let delay = 0;

  if (bootLog) {
    bootLines.forEach((line) => {
      const el = document.createElement('span');
      el.className = 'line';
      el.innerHTML = line;
      bootLog.appendChild(el);
      delay += 180;
      setTimeout(() => el.classList.add('show'), delay);
    });
  }

  setTimeout(() => {
    ['heroH1', 'heroSub', 'heroStatus', 'heroCta', 'heroShowcase', 'heroStats', 'terminal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('reveal');
    });
  }, delay + 150);
}

// Animated number counters on scroll
export function initCounters() {
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    const statCards = document.querySelectorAll('.stat-number');
    statCards.forEach(el => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      let count = 0;
      const step = Math.max(1, Math.floor(target / 35));
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        el.textContent = count + (target === 342 ? '+' : '');
      }, 30);
    });
    statsAnimated = true;
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
      }
    });
  }, { threshold: 0.2 });

  const statsEl = document.getElementById('heroStats');
  if (statsEl) statsObserver.observe(statsEl);
}

// Ticket reveal on scroll
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.ticket').forEach(t => observer.observe(t));
}

// Scroll-triggered glow observer
export function initScrollGlow() {
  const glowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view-glow');
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('in-view-glow');
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: "-20px 0px -20px 0px"
  });

  const glowTargets = document.querySelectorAll('.section-title, .ticket, .skill-group, .award-card, .stat-card, .contact-box, .fact-card, .timeline-item');
  glowTargets.forEach(el => {
    el.classList.add('scroll-glow-target');
    glowObserver.observe(el);
  });
}

// Scroll progress bar
export function initProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:var(--violet-light);z-index:200;transition:width 0.1s linear;width:0%;pointer-events:none;box-shadow:0 0 8px var(--violet-light);';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100).toFixed(1) + '%';
  });
}
