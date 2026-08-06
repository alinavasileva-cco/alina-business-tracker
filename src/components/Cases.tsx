import { useRef, useState } from 'react';
import { cases } from '../content';
import CaseSection from './CaseSection';

import scalingPng from '../assets/cases/case-01-scaling.png';
import scalingWebp from '../assets/cases/case-01-scaling.webp';
import profitPng from '../assets/cases/case-02-profit.png';
import profitWebp from '../assets/cases/case-02-profit.webp';
import ecommercePng from '../assets/cases/case-03-ecommerce.png';
import ecommerceWebp from '../assets/cases/case-03-ecommerce.webp';
import productPng from '../assets/cases/case-04-product.png';
import productWebp from '../assets/cases/case-04-product.webp';

const images = {
  scaling: { png: scalingPng, webp: scalingWebp, width: 2400, height: 480 },
  profit: { png: profitPng, webp: profitWebp, width: 832, height: 467 },
  ecommerce: { png: ecommercePng, webp: ecommerceWebp, width: 442, height: 496 },
  product: { png: productPng, webp: productWebp, width: 1672, height: 941 },
};

export default function Cases() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const move = (direction: -1 | 1) => {
    const next = Math.min(Math.max(activeIndex + direction, 0), cases.length - 1);
    const rail = railRef.current;
    rail?.scrollTo({ left: next * rail.clientWidth, behavior: 'smooth' });
    setActiveIndex(next);
  };

  return (
    <section className="cases section" id="cases" aria-labelledby="cases-title">
      <div className="section-heading shell" data-reveal>
        <div>
          <p className="eyebrow">Практика</p>
          <h2 id="cases-title">Кейсы</h2>
        </div>
        <p>Коммерческие системы, в которых стратегия связана с процессами, цифрами и ответственностью за результат.</p>
      </div>

      <div className="cases__controls shell" aria-label="Навигация по кейсам">
        <button type="button" onClick={() => move(-1)} disabled={activeIndex === 0} aria-label="Предыдущий кейс">←</button>
        <p aria-live="polite"><span>{activeIndex + 1}</span> / {cases.length}</p>
        <button type="button" onClick={() => move(1)} disabled={activeIndex === cases.length - 1} aria-label="Следующий кейс">→</button>
      </div>

      <div
        className="cases__rail"
        ref={railRef}
        tabIndex={0}
        aria-label="Четыре кейса. На больших экранах список прокручивается по горизонтали"
        onScroll={(event) => {
          const rail = event.currentTarget;
          if (rail.clientWidth > 0) setActiveIndex(Math.round(rail.scrollLeft / rail.clientWidth));
        }}
      >
        {cases.map((caseStudy) => (
          <CaseSection caseStudy={caseStudy} image={images[caseStudy.imageKey]} key={caseStudy.id} />
        ))}
      </div>
    </section>
  );
}
