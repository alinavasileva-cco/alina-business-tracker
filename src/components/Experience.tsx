import { experience } from '../content';

export default function Experience() {
  return (
    <section className="experience section" id="experience" aria-labelledby="experience-title">
      <div className="shell">
        <div className="experience__intro" data-reveal>
          <p className="eyebrow">Профессиональный путь</p>
          <h2 id="experience-title">Опыт</h2>
        </div>

        <ol className="experience__track">
          {experience.map(([period, role, company, scope], index) => (
            <li className={`experience__item experience__item--${(index % 3) + 1}`} key={`${period}-${company}`} data-reveal>
              <p className="experience__period">{period}</p>
              <div className="experience__role-wrap">
                <h3>{role}</h3>
                <p className="experience__company">{company}</p>
                <p className="experience__scope">{scope}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
