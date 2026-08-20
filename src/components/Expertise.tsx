import { expertise } from '../content';

export default function Expertise() {
  return (
    <section className="expertise editorial-section" id="expertise" aria-labelledby="expertise-title">
      <div className="section-shell">
        <header className="expertise__heading" data-reveal>
          <p className="section-kicker">Экспертиза</p>
          <h2 id="expertise-title">Четыре управленческих контура</h2>
        </header>
        <div className="expertise__grid">
          {expertise.map(([title, text], index) => (
            <article className={`expertise-item expertise-item--${index + 1}`} data-reveal key={title}>
              <span className="expertise-item__index" aria-hidden="true">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
