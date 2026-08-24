import type { CaseStudy } from '../content';

type CaseImage = {
  webp: string;
  width: number;
  height: number;
};

type CaseSectionProps = {
  caseStudy: CaseStudy;
  image: CaseImage;
};

export default function CaseSection({ caseStudy, image }: CaseSectionProps) {
  return (
    <article
      className={`case-study case-study--${caseStudy.imageKey}`}
      id={caseStudy.id}
      aria-labelledby={`${caseStudy.id}-title`}
    >
      <div className="case-study__inner section-shell">
        <header className="case-study__header" data-reveal>
          <p className="section-kicker">{caseStudy.eyebrow}</p>
          <h3 id={`${caseStudy.id}-title`}>{caseStudy.title}</h3>
          {caseStudy.company && <p className="case-study__company">{caseStudy.company}</p>}
          <p className="case-study__lead">{caseStudy.lead}</p>
        </header>

        <figure className="case-study__visual" data-reveal>
          <img
            className="case-study__visual-image"
            src={image.webp}
            width={image.width}
            height={image.height}
            alt={caseStudy.alt}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <section className="case-study__metrics" aria-label="Метрики" data-reveal>
          <p className="case-study__label">Метрики</p>
          <div className="case-study__metrics-grid">
            {caseStudy.metrics.map((metric) => (
              <div
                className={`case-study__metric${metric.accent ? ' is-accent' : ''}${metric.long ? ' is-long' : ''}`}
                key={`${metric.value}-${metric.label}`}
              >
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="case-study__details" data-reveal>
          <div className="case-study__detail case-study__problem">
            <p className="case-study__label">Проблематика</p>
            <p>{caseStudy.problem}</p>
          </div>

          <div className="case-study__detail case-study__outcome">
            <p className="case-study__label">На выходе</p>
            <ul>
              {caseStudy.outcome.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          {caseStudy.note && (
            <div className="case-study__detail case-study__note">
              <p className="case-study__label">{caseStudy.note.label}</p>
              <p>{caseStudy.note.value}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
