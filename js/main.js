/* ============================================================
   VARSHA SHEKHAWAT — PORTFOLIO JAVASCRIPT
   Vanilla ES6+ — No dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  init3DTilt();
  initLiveStats();
  initHeroDashboardSlider();
  initResumeModal();
  initTypingAnimation();
  initTimelineAnimation();
  initContactForm();
  initSmoothScroll();
});

/* ============================================================
   NAVBAR — Scroll effects & active section highlighting
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  // Add scrolled class on scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Active section highlighting
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });

        // Also update mobile links
        document.querySelectorAll('.navbar__mobile-link').forEach((mlink) => {
          mlink.classList.remove('active');
          if (mlink.getAttribute('href') === `#${id}`) {
            mlink.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.navbar__mobile-link');

  if (!toggle || !mobileMenu || !overlay) return;

  const openMenu = () => {
    toggle.classList.add('open');
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ============================================================
   SCROLL REVEAL — Fade-in sections on scroll
   ============================================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ============================================================
   TYPING ANIMATION — Hero role cycling
   ============================================================ */
function initTypingAnimation() {
  const typedTextEl = document.getElementById('typed-text');
  if (!typedTextEl) return;

  const words = ['a CSE Student.', 'a Web Developer.', 'a Problem Solver.'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex--;
      typedTextEl.textContent = currentWord.substring(0, charIndex);
    } else {
      charIndex++;
      typedTextEl.textContent = currentWord.substring(0, charIndex);
    }

    let delay = isDeleting ? 60 : 120;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400; // Pause before typing next
    }

    setTimeout(type, delay);
  }

  type();
}

/* ============================================================
   TIMELINE ANIMATION — Animate dots on scroll
   ============================================================ */
function initTimelineAnimation() {
  const items = document.querySelectorAll('.timeline__item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  items.forEach((item) => observer.observe(item));
}

/* ============================================================
   CONTACT FORM — Formspree submission
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.form__submit');
    const successEl = document.getElementById('form-success');
    const existingError = form.querySelector('.form__error');

    // Clear previous messages
    if (successEl) successEl.style.display = 'none';
    if (existingError) existingError.remove();

    const name = form.querySelector('#form-name').value.trim();
    const email = form.querySelector('#form-email').value.trim();
    const message = form.querySelector('#form-message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showFormError(form, submitBtn, 'Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormError(form, submitBtn, 'Please enter a valid email address.');
      return;
    }

    // Show loading state
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
      Sending...
    `;
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        // Show success message
        if (successEl) successEl.style.display = 'flex';
        form.reset();

        // Hide success after 6 seconds
        setTimeout(() => {
          if (successEl) successEl.style.display = 'none';
        }, 6000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      showFormError(form, submitBtn, 'Something went wrong. Please try emailing me directly.');
    } finally {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  });
}

function showFormError(form, submitBtn, message) {
  const existingError = form.querySelector('.form__error');
  if (existingError) existingError.remove();

  const errorDiv = document.createElement('div');
  errorDiv.className = 'form__error';
  errorDiv.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
    <span>${message}</span>
  `;
  submitBtn.parentNode.insertBefore(errorDiv, submitBtn);

  setTimeout(() => {
    if (errorDiv.parentNode) errorDiv.remove();
  }, 5000);
}

/* ============================================================
   SMOOTH SCROLL — For anchor links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/* ============================================================
   3D TILT ENGINE — Mouse-position perspective rotation
   ============================================================ */
function init3DTilt() {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice || prefersReducedMotion) return;

  const tiltElements = document.querySelectorAll(
    '.project-card, .project-featured, .cert-card, .achievement-card, .timeline__card, .stat-card, .profile-card, .contact__info-card, .contact__form-card, .btn--primary, .btn--secondary'
  );

  tiltElements.forEach((el) => {
    el.classList.add('tilt-card');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const mouseX = (e.clientX - rect.left) / width - 0.5;
      const mouseY = (e.clientY - rect.top) / height - 0.5;

      const maxRotateX = 6;
      const maxRotateY = 6;

      const rotateX = (-mouseY * maxRotateX).toFixed(2);
      const rotateY = (mouseX * maxRotateY).toFixed(2);

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ============================================================
   LIVE DASHBOARD FETCHER — GitHub & LeetCode APIs with fallbacks
   ============================================================ */
function initLiveStats() {
  fetchGitHubStats();
  fetchLeetCodeStats();
}

async function fetchGitHubStats() {
  const reposVal = document.getElementById('gh-repos-val');
  const followersVal = document.getElementById('gh-followers-val');

  try {
    const res = await fetch('https://api.github.com/users/Varsha-shekhawat');
    if (!res.ok) throw new Error('GitHub API response error');
    const data = await res.json();

    if (data.public_repos !== undefined && reposVal) {
      reposVal.textContent = data.public_repos;
    }
    if (data.followers !== undefined && followersVal) {
      followersVal.textContent = data.followers;
    }
  } catch (err) {
    console.warn('GitHub API fetch failed, keeping static fallback values.', err);
  }
}

async function fetchLeetCodeStats() {
  const totalVal = document.getElementById('lc-total-solved');
  const easyVal = document.getElementById('lc-easy-val');
  const medVal = document.getElementById('lc-medium-val');
  const hardVal = document.getElementById('lc-hard-val');
  const ring = document.getElementById('leetcode-ring');

  const maxSolved = 400; // Benchmark for progress ring
  let totalSolved = 107;

  try {
    const res = await fetch('https://leetcode-api-faisalshohag.vercel.app/VarshaShekhawat');
    if (!res.ok) throw new Error('LeetCode proxy response error');
    const data = await res.json();

    if (data.totalSolved !== undefined) {
      totalSolved = data.totalSolved;
      if (totalVal) totalVal.textContent = totalSolved;
      if (easyVal) easyVal.textContent = data.easySolved ?? 52;
      if (medVal) medVal.textContent = data.mediumSolved ?? 45;
      if (hardVal) hardVal.textContent = data.hardSolved ?? 10;
    }
  } catch (err) {
    console.warn('LeetCode API fetch failed, keeping static fallback values.', err);
  } finally {
    if (ring) {
      const circumference = 251.2;
      const ratio = Math.min(totalSolved / maxSolved, 1);
      const offset = circumference - (ratio * circumference);
      ring.style.strokeDashoffset = offset;
    }
  }
}

/* ============================================================
   HERO DASHBOARD SLIDER / TAB SWITCHER
   ============================================================ */
function initHeroDashboardSlider() {
  const tabs = document.querySelectorAll('.hero-dash__tab');
  const slideGithub = document.getElementById('slide-github');
  const slideLeetcode = document.getElementById('slide-leetcode');

  if (!tabs.length || !slideGithub || !slideLeetcode) return;

  function switchTab(targetTab) {
    tabs.forEach(t => t.classList.remove('active'));
    if (targetTab === 'github') {
      document.getElementById('tab-btn-github')?.classList.add('active');
      slideLeetcode.classList.remove('active');
      setTimeout(() => {
        slideGithub.classList.add('active');
      }, 50);
    } else {
      document.getElementById('tab-btn-leetcode')?.classList.add('active');
      slideGithub.classList.remove('active');
      setTimeout(() => {
        slideLeetcode.classList.add('active');
      }, 50);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchTab(target);
    });
  });
}

/* ============================================================
   RESUME PREVIEW & DOWNLOAD MODAL
   ============================================================ */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-modal-close');
  const backdrop = document.getElementById('resume-modal-backdrop');
  const openBtns = document.querySelectorAll('.open-resume-modal-btn');

  if (!modal) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
