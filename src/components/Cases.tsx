import { cases } from '../content';
import CaseSection from './CaseSection';

import scalingWebp from '../assets/cases/case-01-scaling-bg.webp';
import profitWebp from '../assets/cases/case-02-profit-bg.webp';
import ecommerceWebp from '../assets/cases/case-03-ecommerce-bg.webp';
import productWebp from '../assets/cases/case-04-product-bg.webp';

const images = {
  scaling: { webp: scalingWebp, width: 2400, height: 1350 },
  profit: { webp: profitWebp, width: 2400, height: 1350 },
  ecommerce: { webp: ecommerceWebp, width: 2400, height: 1350 },
  product: { webp: productWebp, width: 2400, height: 1350 },
};

export default function Cases() {
  return (
    <section className="cases case-library" id="cases" aria-labelledby="cases-title">
      <header className="case-library__intro section-shell" data-reveal>
        <p className="section-kicker">Практика</p>
        <h2 id="cases-title">Кейсы</h2>
      </header>

      <div className="case-library__stack">
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
