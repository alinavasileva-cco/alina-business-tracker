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
  return (
    <section className="cases cases--v9" id="cases" aria-labelledby="cases-title">
      <header className="cases-v9__intro section-shell" data-reveal>
        <p className="section-kicker">Практика</p>
        <h2 id="cases-title">Кейсы</h2>
        <p>Четыре коммерческие задачи — коротко, через результат и цифры.</p>
      </header>

      <div className="cases-v9__stack">
        {cases.map((caseStudy) => (
          <CaseSection
            caseStudy={caseStudy}
            image={images[caseStudy.imageKey]}
            key={caseStudy.id}
          />
        ))}
      </div>
    </section>
  );
}
