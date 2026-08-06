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
      const open = !header?.classList.contains('is-open');
      header?.classList.toggle('is-open', open);
      nav?.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      if (menuLabel) menuLabel.textContent = open ? 'Закрыть' : 'Меню';
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    Array.from(nav?.querySelectorAll('a') || []).forEach((link) => {
      const text = link.textContent?.trim().toLowerCase();
      if (text === 'экспертиза' || text === 'подход') link.remove();
      if (text === 'обо мне') link.setAttribute('href', '#hero');
    });

    const hero = document.querySelector('.hero');
    const heroRole = document.querySelector('.hero__role');
    const heroLead = document.querySelector('.hero__lead');
    const heroCta = document.querySelector('.hero__copy .text-link');
    const directions = document.querySelector('.hero__directions');

    if (heroRole) heroRole.innerHTML = 'Бизнес-трекер · Коммерческий директор / CCO ·<br>Head of Business Development';

    if (heroLead) {
      heroLead.innerHTML = `
        <span>Строю коммерческие системы и точки роста: соединяю продажи, маркетинг, процессы, аналитику и команду в управляемую модель результата.</span>
        <span>Работаю с собственниками и C-level — от диагностики и стратегии до внедрения изменений и измеримого эффекта.</span>
      `;
    }

    if (heroCta) {
      heroCta.setAttribute('href', '#contact');
      heroCta.innerHTML = '<span>Решить бизнес-задачу</span>';
    }

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

    document.querySelector('.profile')?.remove();
    document.querySelector('.expertise')?.remove();
    document.querySelector('.approach')?.remove();
    document.querySelectorAll('.services .text-link').forEach((link) => link.remove());

    const clients = document.querySelector('.clients');
    const clientsHeader = clients?.querySelector('.clients__header h2');
    const clientsIntro = clients?.querySelector('.clients__header > p');
    const clientsGrid = clients?.querySelector('.clients__grid');
    if (clientsHeader) clientsHeader.textContent = 'Клиентский портфель';
    clientsIntro?.remove();

    if (clientsGrid) {
      const names = Array.from(clientsGrid.querySelectorAll('li')).map((item) => item.textContent?.trim()).filter(Boolean);
      const makeGroup = (hidden = false) => `
        <div class="clients-marquee__group"${hidden ? ' aria-hidden="true"' : ''}>
          ${names.map((name) => `<span class="clients-marquee__item">${name}</span>`).join('')}
        </div>`;
      const marquee = document.createElement('div');
      marquee.className = 'clients-marquee';
      marquee.tabIndex = 0;
      marquee.setAttribute('aria-label', 'Клиентский портфель');
      marquee.innerHTML = `<div class="clients-marquee__track">${makeGroup()}${makeGroup(true)}</div>`;
      clientsGrid.replaceWith(marquee);
    }

    const casesSection = document.querySelector('.cases-section');
    const casesHead = casesSection?.querySelector('.cases-section__head');
    const casesTitle = casesHead?.querySelector('h2');
    if (casesTitle) casesTitle.textContent = 'Кейсы';

    const caseSlides = Array.from(document.querySelectorAll('.case-slide'));
    if (casesHead && !document.querySelector('.case-index')) {
      const labels = caseSlides.map((slide) => slide.querySelector('h3')?.textContent?.replace(/\s+/g, ' ').trim()).filter(Boolean);
      const index = document.createElement('nav');
      index.className = 'case-index';
      index.setAttribute('aria-label', 'Список кейсов');
      index.innerHTML = labels.map((label, indexNumber) => `<a href="#case-0${indexNumber + 1}" data-case-index="${indexNumber}"><span>${label}</span></a>`).join('');
      casesHead.insertAdjacentElement('afterend', index);
    }

    document.querySelector('.cases-section__footer > p')?.remove();

    const imageSources = [
      { source: './v4/assets/cases/case-01/case-01-scaling-final.webp?v=6.1.0', fallback: './v4/assets/cases/case-01/case-01-scaling-final.png?v=6.1.0' },
      { source: './assets/cases/case-02-profit.webp?v=6.1.0', fallback: './assets/cases/case-02-profit.jpg?v=6.1.0' },
      { source: './assets/cases/case-03-ecommerce.webp?v=6.1.0', fallback: './assets/cases/case-03-ecommerce.jpg?v=6.1.0' },
      { source: './assets/cases/case-04-product.webp?v=6.1.0', fallback: './assets/cases/case-04-product.jpg?v=6.1.0' },
    ];

    caseSlides.forEach((slide, index) => {
      const source = slide.querySelector('picture source');
      const image = slide.querySelector('picture img');
      if (source && imageSources[index]) source.setAttribute('srcset', imageSources[index].source);
      if (image && imageSources[index]) image.setAttribute('src', imageSources[index].fallback);
    });

    const experience = document.querySelector('.experience');
    if (experience) {
      const rows = Array.from(experience.querySelectorAll('.experience__track article')).map((article) => ({
        year: article.querySelector('time')?.textContent?.trim() || '',
        role: article.querySelector('h3')?.textContent?.trim() || '',
        company: article.querySelector('.experience__company')?.textContent?.trim() || '',
        scope: Array.from(article.querySelectorAll('p')).find((item) => !item.classList.contains('experience__company'))?.textContent?.trim() || '',
      }));
      experience.innerHTML = `
        <div class="section-shell">
          <header class="section-heading" data-reveal>
            <div><p class="section-kicker">Опыт</p><h2 id="experience-title">Управленческий трек</h2></div>
          </header>
          <ul class="experience__track">
            ${rows.map((row) => `<li data-reveal><time class="experience__year">${row.year}</time><h3 class="experience__role">${row.role}</h3><p class="experience__company">${row.company}</p><p class="experience__scope">${row.scope}</p></li>`).join('')}
          </ul>
        </div>`;
    }

    const education = document.querySelector('.education');
    if (education) {
      const degree = education.querySelector('.education__degree')?.textContent?.replace(/\s+/g, ' ').replace('Высшее образование', '').trim() || 'Журналист — СПбГУП';
      const rows = Array.from(education.querySelectorAll('.education__list article')).map((article) => ({
        year: article.querySelector('time')?.textContent?.trim() || '',
        title: article.querySelector('h3')?.textContent?.trim() || '',
        source: article.querySelector('p')?.textContent?.trim() || '',
      }));
      education.innerHTML = `
        <div class="section-shell">
          <header class="section-heading" data-reveal>
            <div><p class="section-kicker">Образование</p><h2 id="education-title">Образование</h2></div>
          </header>
          <div class="education__degree" data-reveal><p>Высшее образование</p><h3>${degree}</h3></div>
          <div class="education__timeline">
            ${rows.map((row) => `<article data-reveal><time>${row.year}</time><div><h3>${row.title}</h3><p>${row.source}</p></div></article>`).join('')}
          </div>
        </div>`;
    }

    const contact = document.querySelector('.contact');
    if (contact) {
      contact.innerHTML = `
        <div class="section-shell">
          <p class="section-kicker" data-reveal>Контакты</p>
          <div class="contact__main" data-reveal>
            <h2 id="contact-title">Контакты</h2>
            <p>Коммерческая стратегия, развитие направления, P&amp;L, процессы и управленческие системы.</p>
          </div>
          <address class="contact__links" data-reveal>
            <a href="tel:+79818885389" aria-label="Позвонить Алине Васильевой"><span>Телефон</span>+7 981 888 53 89</a>
            <a href="mailto:alinavasileva.jour@mail.ru" aria-label="Написать Алине Васильевой по электронной почте"><span>Email</span>alinavasileva.jour@mail.ru</a>
            <a href="https://t.me/AlinaVasileva" target="_blank" rel="noopener noreferrer" aria-label="Открыть Telegram Алины Васильевой"><span>Telegram</span>@AlinaVasileva</a>
          </address>
          <div class="contact__bottom"><p>© 2026 Алина Васильева</p><a href="#hero">Наверх</a></div>
        </div>`;
    }

    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -7% 0px', threshold: 0.05 });
      revealItems.forEach((item) => observer.observe(item));
    }

    const track = document.querySelector('[data-cases-track]');
    const prev = document.querySelector('[data-case-prev]');
    const next = document.querySelector('[data-case-next]');
    const current = document.querySelector('[data-case-current]');
    const dots = Array.from(document.querySelectorAll('[data-case-dot]'));
    let activeIndex = 0;

    const setActive = (index) => {
      activeIndex = Math.max(0, Math.min(caseSlides.length - 1, index));
      if (current) current.textContent = String(activeIndex + 1);
      dots.forEach((dot, dotIndex) => dot.setAttribute('aria-current', String(dotIndex === activeIndex)));
      if (prev) prev.disabled = activeIndex === 0;
      if (next) next.disabled = activeIndex === caseSlides.length - 1;
    };

    const moveToCase = (index, behavior = 'smooth') => {
      setActive(index);
      if (window.innerWidth <= 1023) caseSlides[activeIndex]?.scrollIntoView({ behavior, block: 'start' });
      else if (track) track.scrollTo({ left: activeIndex * track.clientWidth, behavior });
    };

    prev?.addEventListener('click', () => moveToCase(activeIndex - 1));
    next?.addEventListener('click', () => moveToCase(activeIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => moveToCase(index)));
    document.querySelectorAll('[data-case-index]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const index = Number(link.getAttribute('data-case-index'));
        if (!Number.isFinite(index)) return;
        event.preventDefault();
        moveToCase(index);
      });
    });

    track?.addEventListener('scroll', () => {
      if (window.innerWidth <= 1023 || !track.clientWidth) return;
      setActive(Math.round(track.scrollLeft / track.clientWidth));
    }, { passive: true });

    track?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') moveToCase(activeIndex - 1);
      if (event.key === 'ArrowRight') moveToCase(activeIndex + 1);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1023) closeMenu();
      setActive(activeIndex);
    }, { passive: true });

    setActive(0);
  });
})();
