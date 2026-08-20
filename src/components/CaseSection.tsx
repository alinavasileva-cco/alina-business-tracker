import type { CSSProperties } from 'react';
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
  const sceneStyle = {
    '--case-scene': `url("${image.webp}")`,
  } as CSSProperties;

  return (
    <article
      className={`case-v9 case-v9--${caseStudy.imageKey}`}
      id={caseStudy.id}
      aria-labelledby={`${caseStudy.id}-title`}
    >
      <div className="case-v9__inner section-shell">
        <header className="case-v9__header" data-reveal>
          <p className="section-kicker">{caseStudy.eyebrow}</p>
          <h3 id={`${caseStudy.id}-title`}>{caseStudy.title}</h3>
          {caseStudy.company && <p className="case-v9__company">{caseStudy.company}</p>}
          <p className="case-v9__lead">{caseStudy.lead}</p>
        </header>

        <div
          className="case-v9__scene"
          style={sceneStyle}
          role="img"
          aria-label={caseStudy.alt}
          data-reveal
        />

        <div className="case-v9__metrics" aria-label="Ключевые результаты" data-reveal>
          {caseStudy.metrics.slice(0, 4).map((metric) => (
            <div className={`case-v9__metric${metric.accent ? ' is-accent' : ''}`} key={`${metric.value}-${metric.label}`}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
