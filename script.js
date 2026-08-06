(() => {
  'use strict';

  const ready = (callback) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
    else callback();
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
      const isOpen = !header?.classList.contains('is-open');
      header?.classList.toggle('is-open', isOpen);
      nav?.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      if (menuLabel) menuLabel.textContent = isOpen ? 'Закрыть' : 'Меню';
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    Array.from(nav?.querySelectorAll('a') || []).forEach((link) => {
      const label = link.textContent?.trim().toLowerCase();
      if (label === 'экспертиза' || label === 'подход') link.remove();
      if (label === 'обо мне') link.setAttribute('href', '#hero');
      link.addEventListener('click', closeMenu);
    });

    const portrait = document.querySelector('.hero__portrait img');
    if (portrait) {
      portrait.src = './v4/assets/portrait/alina-portrait-rgba-final.png?v=7.0.0';
      portrait.alt = 'Алина Васильева в чёрном образе сидит на высоком стуле в красных туфлях';
      portrait.width = 595;
      portrait.height = 1938;
    }

    const role = document.querySelector('.hero__role');
    if (role) role.innerHTML = 'Бизнес-трекер · Коммерческий директор / CCO ·<br>Head of Business Development';

    const lead = document.querySelector('.hero__lead');
    if (lead) {
      lead.innerHTML = `
        <span>Строю коммерческие системы и точки роста: соединяю продажи, маркетинг, процессы, аналитику и команду в управляемую модель результата.</span>
        <span>Работаю с собственниками и C-level — от диагностики и стратегии до внедрения изменений и измеримого эффекта.</span>
      `;
    }

    const cta = document.querySelector('.hero__copy .text-link');
    if (cta) {
      cta.href = '#contact';
      cta.innerHTML = '<span>Решить бизнес-задачу</span>';
    }

    const directions = document.querySelector('.hero__directions');
    if (directions) {
      const telegram = document.createElement('a');
      telegram.className = 'hero__telegram';
      telegram.href = 'https://t.me/AlinaVasileva';
      telegram.target = '_blank';
      telegram.rel = 'noopener noreferrer';
      telegram.setAttribute('aria-label', 'Открыть Telegram Алины Васильевой');
      telegram.setAttribute('data-reveal', '');
      telegram.innerHTML = '<small>Telegram</small><strong>@AlinaVasileva</strong>';
      directions.replaceWith(telegram);
    }

    const hero = document.querySelector('.hero');
    if (hero && !document.querySelector('.hero-facts')) {
      const facts = document.createElement('section');
      facts.className = 'hero-facts';
      facts.setAttribute('aria-label', 'Ключевые факты');
      facts.innerHTML = `
        <div class="hero-facts__grid" data-reveal>
          <div class="hero-fact"><strong>12 лет</strong><span>управленческого опыта</span></div>
          <div class="hero-fact"><strong>600+</strong><span>коммерческих проектов</span></div>
          <div class="hero-fact"><strong>Более 500 млн</strong><span>помогла заработать компаниям</span></div>
        </div>
      `;
      hero.insertAdjacentElement('afterend', facts);
    }

    const revealItems = Array.from(document.querySelectorAll('.hero [data-reveal], .hero-facts [data-reveal]'));
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
        item.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
        observer.observe(item);
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1023) closeMenu();
    }, { passive: true });
  });
})();
