import desktopScene from '../assets/hero/hero-desktop.avif';
import mobileScene from '../assets/hero/hero-mobile.avif';
import portrait from '../assets/hero/alina-portrait.png';

export default function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-name">
      <div className="hero__scene" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet={mobileScene} />
          <img src={desktopScene} width="3840" height="2160" alt="" loading="eager" fetchPriority="high" decoding="async" />
        </picture>
      </div>

      <div className="hero__headline hero__headline--growth" aria-hidden="true">GROWTH</div>
      <div className="hero__headline hero__headline--needs" aria-hidden="true">
        <span>NEEDS</span>
        <span className="accent">SPACE</span>
      </div>

      <div className="hero__stage" data-reveal>
        <img
          className="hero__portrait"
          src={portrait}
          alt="Алина Васильева в чёрном костюме сидит на высоком стуле в красных туфлях"
          width="1190"
          height="3876"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className="hero__copy" data-reveal>
        <h1 id="hero-name">Алина Васильева</h1>
        <p className="hero__role">Бизнес-трекер · Коммерческий директор / CCO · Head of Business Development</p>

        <dl className="hero__profile" aria-label="Коммерческий профиль">
          <div><dt>12 ЛЕТ</dt><dd>Управленческого опыта</dd></div>
          <div><dt>P&amp;L</dt><dd>Ответственность за результат</dd></div>
          <div><dt>600+</dt><dd>Коммерческих проектов</dd></div>
          <div><dt>500+ МЛН</dt><dd>Помогла заработать компаниям</dd></div>
        </dl>

        <a className="text-link" href="#contact"><span>Решить бизнес-задачу</span><span aria-hidden="true">→</span></a>
      </div>

      <a className="hero__telegram" href="https://t.me/AlinaVasileva" target="_blank" rel="noopener">@AlinaVasileva ↗</a>
    </section>
  );
}
