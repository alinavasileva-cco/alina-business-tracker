import { cases } from '../content';
import CaseSection from './CaseSection';

import scalingWebp from '../assets/cases/case-01-scaling-v2.webp';
import profitWebp from '../assets/cases/case-02-profit.webp';
import ecommerceWebp from '../assets/cases/case-03-ecommerce.webp';
import productWebp from '../assets/cases/case-04-product.webp';

const images = {
  scaling: { webp: scalingWebp, width: 2400, height: 1350 },
  profit: { webp: profitWebp, width: 832, height: 467 },
  ecommerce: { webp: ecommerceWebp, width: 442, height: 496 },
  product: { webp: productWebp, width: 1672, height: 941 },
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
