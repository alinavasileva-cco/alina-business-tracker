import { education } from '../content';

export default function Education() {
  return (
    <section className="education section shell" aria-labelledby="education-title">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">Знания и развитие</p>
          <h2 id="education-title">Образование</h2>
        </div>
      </div>

      <div className="education__degree" data-reveal>
        <p>Высшее образование</p>
        <h3>Журналист — СПбГУП</h3>
      </div>

      <div className="education__timeline">
        {education.map(([year, title, source]) => (
          <article key={`${year}-${title}`} data-reveal>
            <time>{year}</time>
            <div>
              <h3>{title}</h3>
              <p>{source}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
