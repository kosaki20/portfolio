/* ========================================
   CAROUSEL  |  Screenshot Carousels
   ======================================== */

const carouselData = {
  hris: {
    current: 0,
    slides: [
      { src: 'hris-admin.png', label: 'Admin Dashboard' },
      { src: 'hris-approver.png', label: 'Approver Interface' },
      { src: 'hris-applicant.png', label: 'Applicant Form' }
    ]
  },
  gym: {
    current: 0,
    slides: [
      { src: 'gym-admin.png', label: 'Admin Dashboard' },
      { src: 'gym-trainer.png', label: 'Trainer Panel' },
      { src: 'gym-client.png', label: 'Client Portal' }
    ]
  }
};

function openScreenshotModal(src, caption) {
  document.getElementById('screenshotModalImg').src = src;
  document.getElementById('screenshotModalCaption').textContent = caption;
  document.getElementById('screenshotModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Exposed globally for onclick handlers in HTML
window.setCarouselSlide = function(projectId, idx) {
  const data = carouselData[projectId];
  if (!data) return;
  data.current = idx;
  const slide = data.slides[idx];

  const img = document.getElementById(`${projectId}-carousel-img`);
  if (img) {
    img.src = slide.src;
    img.onerror = () => { img.onerror = null; img.src = `${projectId}-mockup.png`; };
  }

  const lbl = document.getElementById(`${projectId}-carousel-label`);
  if (lbl) lbl.textContent = slide.label;

  document.querySelectorAll(`[data-project="${projectId}"] .carousel-tab`)
    .forEach((t, i) => t.classList.toggle('active', i === idx));
  document.querySelectorAll(`[data-project="${projectId}"] .carousel-dot`)
    .forEach((d, i) => d.classList.toggle('active', i === idx));
};

window.prevCarouselSlide = function(projectId) {
  const data = carouselData[projectId];
  window.setCarouselSlide(projectId, (data.current - 1 + data.slides.length) % data.slides.length);
};

window.nextCarouselSlide = function(projectId) {
  const data = carouselData[projectId];
  window.setCarouselSlide(projectId, (data.current + 1) % data.slides.length);
};

window.openCurrentCarouselScreenshot = function(projectId) {
  const data = carouselData[projectId];
  const slide = data.slides[data.current];
  openScreenshotModal(slide.src, slide.label + '  |  ' + (projectId === 'hris' ? 'DepEd HRIS' : "Boiyet's Gym"));
};

window.closeScreenshotModal = function() {
  document.getElementById('screenshotModal').classList.remove('active');
  document.body.style.overflow = '';
};

export function initCarousel() {
  // Close screenshot modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeScreenshotModal();
    }
  });
}
