const directions = [
  ['Бизнес-трекинг', 'Фокус, решения и управленческий ритм для собственника и C-level.'],
  ['Коммерческая эффективность', 'P&L, маржинальность, воронка и точки роста.'],
  ['Продажи + маркетинг', 'Позиционирование, лидогенерация, пресейл и коммерческая система.'],
  ['Процессы + аналитика', 'CRM, отчётность, автоматизация и управляемая операционная модель.'],
] as const;

export default function Services() {
  return (
    <section className="services services--v9" id="services" aria-labelledby="services-title">
      <div className="section-shell services-v9__inner">
        <header className="services-v9__header" data-reveal>
          <p className="section-kicker">Услуги</p>
          <h2 id="services-title">Где я могу быть полезна</h2>
          <p>Подключаюсь к задачам, где нужно связать стратегию, цифры и исполнение.</p>
        </header>

        <div className="services-v9__grid">
          {directions.map(([title, text]) => (
            <article className="services-v9__item" key={title} data-reveal>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <a className="text-link services-v9__cta" href="#contact" data-reveal>
          <span>Обсудить бизнес-задачу</span><span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
