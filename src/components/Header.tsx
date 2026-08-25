import { useEffect, useRef, useState } from 'react';

const navigation = [
  ['Обо мне', '#hero'],
  ['Услуги', '#services'],
  ['Кейсы', '#cases'],
  ['Опыт', '#experience'],
  ['Контакты', '#contact'],
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !open) return;
      setOpen(false);
      window.requestAnimationFrame(() => toggleRef.current?.focus({ preventScroll: true }));
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = (event: MediaQueryListEvent) => event.matches && setOpen(false);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    desktop.addEventListener('change', onDesktop);
    return () => {
      window.removeEventListener('scroll', onScroll);
      desktop.removeEventListener('change', onDesktop);
    };
  }, []);

  return (
    <header className={`site-header${open ? ' is-open' : ''}${scrolled ? ' is-scrolled' : ''}`}>
      <a className="brand" href="#hero" aria-label="Алина Васильева — наверх">AV</a>
      <button
        ref={toggleRef}
        className="menu-toggle"
        type="button"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="menu-toggle__icon" aria-hidden="true"><i /><i /></span>
      </button>
      <nav ref={navRef} className={`site-nav${open ? ' is-open' : ''}`} id="site-nav" aria-label="Основная навигация">
        {navigation.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>
    </header>
  );
}
