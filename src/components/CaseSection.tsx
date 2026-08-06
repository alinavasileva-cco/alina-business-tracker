import type { CaseStudy } from '../content';

type CaseImage = {
  png: string;
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
    <section className="case-panel" id={caseStudy.id} aria-labelledby={`${caseStudy.id}-title`}>
      <div className="case-panel__top">
        <div className="case-panel__intro" data-reveal>
          <p className="eyebrow">{caseStudy.eyebrow}</p>
          <h3 id={`${caseStudy.id}-title`}>{caseStudy.title}</h3>
          {caseStudy.company && <p className="case-panel__company">{caseStudy.company}</p>}
          <p className="case-panel__lead">{caseStudy.lead}</p>
        </div>

        <figure className="case-panel__visual" data-reveal>
          <picture>
            <source srcSet={image.webp} type="image/webp" />
            <img
              src={image.png}
              alt={caseStudy.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </figure>
      </div>

      <div className="case-panel__details" data-reveal>
        <div className="case-panel__problem">
          <p className="detail-label">Проблематика</p>
          <p>{caseStudy.problem}</p>
        </div>

        <div className="case-panel__outcome">
          <p className="detail-label">На выходе</p>
          <ul>
            {caseStudy.outcome.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <div className="case-panel__metrics" aria-label="Результаты">
          {caseStudy.metrics.map((metric) => (
            <div
              className={`case-metric${metric.accent ? ' case-metric--accent' : ''}${metric.long ? ' case-metric--long' : ''}`}
              key={`${metric.value}-${metric.label}`}
            >
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {caseStudy.note && (
        <p className="case-panel__note" data-reveal>
          <span>{caseStudy.note.label}</span>
          {caseStudy.note.value}
        </p>
      )}
    </section>
  );
}
