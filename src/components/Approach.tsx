import { approach } from '../content';

export default function Approach() {
  return (
    <section className="approach section" id="approach" aria-labelledby="approach-title">
      <div className="shell">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">Рабочая логика</p>
            <h2 id="approach-title">Подход</h2>
          </div>
          <p>От фактической картины бизнеса — к модели, внедрению и регулярному контролю результата.</p>
        </div>

        <ol className="approach__steps">
          {approach.map(([title, description]) => (
            <li key={title} data-reveal>
              <span className="approach__mark" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
