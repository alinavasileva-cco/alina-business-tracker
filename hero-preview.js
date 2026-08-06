(() => {
  'use strict';

  const ready = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = document.querySelector('[data-header]');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuLabel = document.querySelector('.menu-toggle__label');
    const nav = document.querySelector('#site-nav');

    const closeMenu = () => {
      header?.classList.remove('is-open');
      nav?.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      if (menuLabel) menuLabel.textContent = 'Меню';
    };

    menuToggle?.addEventListener('click', () => {
      const willOpen = !header?.classList.contains('is-open');
      header?.classList.toggle('is-open', willOpen);
      nav?.classList.toggle('is-open', willOpen);
      document.body.classList.toggle('menu-open', willOpen);
      menuToggle.setAttribute('aria-expanded', String(willOpen));
      if (menuLabel) menuLabel.textContent = willOpen ? 'Закрыть' : 'Меню';
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    const revealItems = [...document.querySelectorAll('[data-reveal]')];
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08 });

      revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
        observer.observe(item);
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1023) closeMenu();
    }, { passive: true });
  });
})();
