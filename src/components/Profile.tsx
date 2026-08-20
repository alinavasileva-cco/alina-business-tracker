const contours = [
  'Коммерческая стратегия',
  'Продажи и развитие',
  'Маркетинг и бренд',
  'Автоматизация и аналитика',
] as const;

export default function Profile() {
  return (
    <section className="profile editorial-section" id="profile" aria-labelledby="profile-title">
      <div className="section-shell">
        <header className="profile__header" data-reveal>
          <p className="section-kicker">Профессиональный профиль</p>
          <h2 id="profile-title">Коммерческий директор / CCO</h2>
          <p className="profile__intro">Управляю коммерческим результатом: стратегия, P&amp;L, продажи, маркетинг, процессы и команда.</p>
        </header>

        <dl className="profile__facts profile__facts--compact" data-reveal>
          <div><dt>12 лет</dt><dd>управленческого опыта</dd></div>
          <div><dt>P&amp;L</dt><dd>ответственность за результат</dd></div>
          <div><dt>600+</dt><dd>коммерческих проектов</dd></div>
          <div><dt>500+ млн</dt><dd>помогла заработать компаниям</dd></div>
        </dl>

        <div className="profile__contours" aria-label="Четыре управленческих контура" data-reveal>
          <p className="profile__contours-label">4 управленческих контура</p>
          <div className="profile__contours-grid">
            {contours.map((title, index) => (
              <article className="profile-contour" key={title}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
