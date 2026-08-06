import portrait from '../assets/portrait/alina-portrait-final.png';

export default function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-name">
      <div className="hero__grid">
        <div className="hero__architecture" aria-hidden="true">
          <span className="hero-plane hero-plane--left" />
          <span className="hero-plane hero-plane--niche" />
          <span className="hero-plane hero-plane--right" />
          <span className="hero-light" />
        </div>

        <p className="hero__word hero__word--growth" aria-hidden="true" data-reveal>Growth</p>
        <p className="hero__word hero__word--needs" aria-hidden="true" data-reveal>
          <span>Needs</span>
          <span className="accent">Space.</span>
        </p>

        <div className="hero__stage" data-reveal>
          <figure className="hero__portrait">
            <img
              src={portrait}
              alt="Алина Васильева в чёрном образе сидит на высоком стуле в красных туфлях"
              width="595"
              height="1938"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        </div>

        <div className="hero__copy" data-reveal>
          <h1 id="hero-name">Алина Васильева</h1>
          <p className="hero__role">Коммерческий директор / CCO</p>
          <p className="hero__lead">Строю стратегии, коммерческие системы и команды, которые превращают развитие в измеримый рост.</p>
          <a className="text-link" href="#contact"><span>Обсудить задачу</span><span aria-hidden="true">→</span></a>
        </div>

        <ul className="hero__directions" aria-label="Ключевые направления" data-reveal>
          <li>Стратегия</li><li>Команды</li><li>Рост</li>
        </ul>
      </div>
    </section>
  );
}
