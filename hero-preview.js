(() => {
  'use strict';
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('.menu-toggle');
  const label = document.querySelector('.menu-toggle__label');
  const nav = document.querySelector('#site-nav');
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove('is-open');
    header?.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Меню';
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    header?.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Закрыть' : 'Меню';
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 767) close(); }, { passive: true });
})();
