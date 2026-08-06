import { expertise } from '../content';

export default function Expertise() {
  return (
    <section className="expertise editorial-section" id="expertise" aria-labelledby="expertise-title">
      <div className="section-shell">
        <header className="section-heading" data-reveal>
          <p className="section-kicker">Экспертиза</p>
          <h2 id="expertise-title">Четыре управленческих контура</h2>
        </header>
        <div className="expertise__grid">
          {expertise.map(([title, text]) => <article className="expertise-item" data-reveal key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>
  );
}
