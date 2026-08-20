import { education } from '../content';

const selectedEducation = education.filter(([, title]) => ![
  'Яндекс.Директ',
  'Школа журналистики при СПбГУП',
  'Малый журфак при НовГУ им. Ярослава Мудрого',
].includes(title));

export default function Education() {
  return (
    <section className="education education--v9" aria-labelledby="education-title">
      <div className="section-shell education-v9__inner">
        <header className="education-v9__header" data-reveal>
          <p className="section-kicker">Знания и развитие</p>
          <h2 id="education-title">Образование</h2>
        </header>

        <div className="education-v9__degree" data-reveal>
          <span>Высшее образование</span>
          <strong>Журналист · СПбГУП</strong>
        </div>

        <div className="education-v9__grid">
          {selectedEducation.map(([year, title, source]) => (
            <article className="education-v9__item" key={`${year}-${title}`} data-reveal>
              <time>{year}</time>
              <h3>{title}</h3>
              <p>{source}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
