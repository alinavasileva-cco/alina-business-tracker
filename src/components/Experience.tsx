import { experience } from '../content';

export default function Experience() {
  return (
    <section className="experience experience--v9" id="experience" aria-labelledby="experience-title">
      <div className="experience-v9__head section-shell" data-reveal>
        <p className="section-kicker">Профессиональный путь</p>
        <h2 className="sr-only" id="experience-title">Профессиональный путь</h2>
      </div>

      <div className="experience-v9__rail" aria-label="Управленческий опыт">
        {experience.map(([period, role, company, scope]) => (
          <article className="experience-v9__card" key={`${period}-${company}`} data-reveal>
            <h3>{role}</h3>
            <p>{scope}</p>
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
