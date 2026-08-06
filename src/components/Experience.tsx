import { experience } from '../content';

export default function Experience() {
  return (
    <section className="experience section shell" id="experience" aria-labelledby="experience-title">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">Профессиональный путь</p>
          <h2 id="experience-title">Опыт</h2>
        </div>
      </div>

      <ol className="experience__track">
        {experience.map(([period, role, company, scope]) => (
          <li key={`${period}-${company}`} data-reveal>
            <p className="experience__period">{period}</p>
            <div>
              <h3>{role}</h3>
              <p className="experience__company">{company}</p>
              <p className="experience__scope">{scope}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
