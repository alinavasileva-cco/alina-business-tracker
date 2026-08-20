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
  index: number;
};

export default function CaseSection({ caseStudy, image, index }: CaseSectionProps) {
  return (
    <article
      className={`case-story case-story--${caseStudy.imageKey}`}
      id={caseStudy.id}
      aria-labelledby={`${caseStudy.id}-title`}
    >
      <picture className="case-story__art" aria-hidden="true">
        <source srcSet={image.webp} type="image/webp" />
        <img
          src={image.png}
          alt=""
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className="case-story__wash" aria-hidden="true" />

      <div className="case-story__content shell">
        <div className="case-story__index" aria-hidden="true">0{index + 1}</div>

        <header className="case-story__header" data-reveal>
          <p className="eyebrow">{caseStudy.eyebrow}</p>
          <h3 id={`${caseStudy.id}-title`}>{caseStudy.title}</h3>
          {caseStudy.company && <p className="case-story__company">{caseStudy.company}</p>}
          <p className="case-story__lead">{caseStudy.lead}</p>
        </header>

        <div className="case-story__metrics" aria-label="Результаты" data-reveal>
          {caseStudy.metrics.map((metric) => (
            <div
              className={`case-story__metric${metric.accent ? ' is-accent' : ''}${metric.long ? ' is-long' : ''}`}
              key={`${metric.value}-${metric.label}`}
            >
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>

        <div className="case-story__details" data-reveal>
          <div>
            <p className="detail-label">Проблематика</p>
            <p>{caseStudy.problem}</p>
          </div>
          <div>
            <p className="detail-label">На выходе</p>
            <ul>{caseStudy.outcome.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          {caseStudy.note && (
            <div className="case-story__note">
              <p className="detail-label">{caseStudy.note.label}</p>
              <p>{caseStudy.note.value}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
