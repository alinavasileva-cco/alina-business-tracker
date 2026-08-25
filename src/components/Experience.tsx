import { experience } from '../content';

export default function Experience() {
  return (
    <section className="experience experience--v9" id="experience" aria-labelledby="experience-title">
      <div className="experience-v9__head section-shell" data-reveal>
        <p className="section-kicker">Профессиональный путь</p>
        <h2 id="experience-title">Опыт</h2>
      </div>

      <div className="experience-v9__rail section-shell" aria-label="Управленческий опыт">
        {experience.map(([period, role, company, scope]) => (
          <article className="experience-v9__card" key={`${period}-${company}`} data-reveal>
            <time className="experience-v9__period">{period}</time>
            <div className="experience-v9__role">
              <h3>{role}</h3>
              <p>{company}</p>
            </div>
            <p className="experience-v9__scope">{scope}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
