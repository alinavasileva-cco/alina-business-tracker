import { experience } from '../content';

export default function Experience() {
  return (
    <section className="experience experience--horizontal" id="experience" aria-labelledby="experience-title">
      <div className="experience__head shell" data-reveal>
        <p className="eyebrow">Профессиональный путь</p>
        <h2 id="experience-title">Опыт</h2>
      </div>

      <div className="experience__rail" aria-label="Управленческий опыт">
        {experience.map(([period, role, company, scope], index) => (
          <article className="experience-card" key={`${period}-${company}`} data-reveal>
            <span className="experience-card__index" aria-hidden="true">0{index + 1}</span>
            <h3>{role}</h3>
            <p className="experience-card__scope">{scope}</p>
            <footer>
              <strong>{period}</strong>
              <span>{company}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
