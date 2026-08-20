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
    <section className="cases" id="cases" aria-labelledby="cases-title">
      <header className="cases__intro shell" data-reveal>
        <div>
          <p className="eyebrow">Практика</p>
          <h2 id="cases-title">Кейсы</h2>
        </div>
        <p>Коммерческие системы, в которых стратегия связана с процессами, цифрами и ответственностью за результат.</p>
      </header>

      <div className="cases__stack">
        {cases.map((caseStudy, index) => (
          <CaseSection
            caseStudy={caseStudy}
            image={images[caseStudy.imageKey]}
            index={index}
            key={caseStudy.id}
          />
        ))}
      </div>
    </section>
  );
}
