import { services } from '../content';

export default function Services() {
  return (
    <section className="panel services" id="services" aria-labelledby="services-title">
      <div className="services__layout section-shell">
        <aside className="services__aside" data-reveal>
          <div className="services__aside-inner">
            <p className="section-kicker">Услуги</p>
            <h2 id="services-title">Где я могу<br />быть полезна</h2>
            <div className="services__intro">
              <p>Подключаюсь там, где нужно связать стратегию, цифры, процессы и людей в работающую систему управления.</p>
              <p>От диагностики отдельной задачи — до регулярного сопровождения собственника и топ-команды.</p>
            </div>
            <a className="text-link" href="#contact"><span>Обсудить задачу</span><span aria-hidden="true">→</span></a>
          </div>
        </aside>
        <div className="services__content">
          <div className="service-list">
            {services.map((service) => (
              <article className="service-item" data-reveal key={service.title}>
                <h3>{service.title}</h3>
                <div className="service-content">
                  {service.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  <p className="service-output"><span>На выходе</span>{service.output}</p>
                </div>
              </article>
            ))}
          </div>
          <footer className="services__footer" data-reveal>
            <p><span>Формат работы</span>Разовая консультация · Диагностика · Аудит · Проектное сопровождение · Регулярный трекинг</p>
            <a className="text-link" href="#contact"><span>Обсудить задачу</span><span aria-hidden="true">→</span></a>
          </footer>
        </div>
      </div>
    </section>
  );
}
