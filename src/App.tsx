import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Clients from './components/Clients';
import Services from './components/Services';
import Cases from './components/Cases';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';

export default function App() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const visualQa = new URLSearchParams(window.location.search).get('visual-qa') === '1';

    if (visualQa || reduceMotion.matches || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -7% 0px', threshold: 0.06 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">К основному содержанию</a>
      <Header />
      <main className="site-main" id="main-content">
        <Hero />
        <Clients />
        <Services />
        <Cases />
        <Experience />
        <Education />
      </main>
      <Contact />
    </>
  );
}
