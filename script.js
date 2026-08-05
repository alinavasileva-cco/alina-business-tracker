document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const toggle = document.querySelector('.menu-toggle');
const toggleLabel = document.querySelector('.menu-toggle__label');
const nav = document.querySelector('.site-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const setMenu = (open, returnFocus = false) => {
  if (!toggle || !nav) return;

  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  header?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);

  if (toggleLabel) {
    toggleLabel.textContent = open ? 'Закрыть' : 'Меню';
  }

  if (open) {
    nav.querySelector('a')?.focus({ preventScroll: true });
  } else if (returnFocus) {
    toggle.focus({ preventScroll: true });
  }
};

toggle?.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  setMenu(!isOpen, isOpen);
});

nav?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false, true);
  }
});

const desktop = window.matchMedia('(min-width: 1024px)');
const closeDesktopMenu = (event) => {
  if (event.matches) setMenu(false);
};

if (desktop.addEventListener) {
  desktop.addEventListener('change', closeDesktopMenu);
} else {
  desktop.addListener(closeDesktopMenu);
}

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 20);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = [...document.querySelectorAll('[data-reveal]')];

if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -7% 0px',
    threshold: 0.06,
  });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const track = document.querySelector('[data-cases-track]');
const slides = track ? [...track.querySelectorAll('.case-slide')] : [];
const previous = document.querySelector('[data-case-prev]');
const next = document.querySelector('[data-case-next]');
const current = document.querySelector('[data-case-current]');
const dots = [...document.querySelectorAll('[data-case-dot]')];
let activeCase = 0;
let scrollFrame = 0;

const clampCase = (index) => Math.max(0, Math.min(slides.length - 1, index));

const updateCaseNavigation = (index) => {
  activeCase = clampCase(index);

  if (current) current.textContent = String(activeCase + 1);
  if (previous) previous.disabled = activeCase === 0;
  if (next) next.disabled = activeCase === slides.length - 1;

  dots.forEach((dot, dotIndex) => {
    if (dotIndex === activeCase) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }
  });
};

const goToCase = (index, smooth = true) => {
  if (!track || !slides.length) return;

  const destination = clampCase(index);
  track.scrollTo({
    left: destination * track.clientWidth,
    behavior: smooth && !reduceMotion.matches ? 'smooth' : 'auto',
  });
  updateCaseNavigation(destination);
};

previous?.addEventListener('click', () => goToCase(activeCase - 1));
next?.addEventListener('click', () => goToCase(activeCase + 1));

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    goToCase(Number(dot.dataset.caseDot));
  });
});

track?.addEventListener('scroll', () => {
  window.cancelAnimationFrame(scrollFrame);
  scrollFrame = window.requestAnimationFrame(() => {
    const width = track.clientWidth || 1;
    updateCaseNavigation(Math.round(track.scrollLeft / width));
  });
}, { passive: true });

track?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    goToCase(activeCase - 1);
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    goToCase(activeCase + 1);
  }

  if (event.key === 'Home') {
    event.preventDefault();
    goToCase(0);
  }

  if (event.key === 'End') {
    event.preventDefault();
    goToCase(slides.length - 1);
  }
});

let resizeFrame = 0;
window.addEventListener('resize', () => {
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(() => goToCase(activeCase, false));
}, { passive: true });

const hashCaseIndex = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
if (hashCaseIndex >= 0) {
  window.requestAnimationFrame(() => goToCase(hashCaseIndex, false));
} else {
  updateCaseNavigation(0);
}
