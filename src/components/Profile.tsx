export default function Profile() {
  return (
    <section className="profile profile--v9" id="profile" aria-labelledby="profile-title">
      <div className="section-shell profile-v9__inner">
        <header className="profile-v9__header" data-reveal>
          <p className="section-kicker">Профессиональный профиль</p>
          <h2 id="profile-title">Коммерческий директор / CCO</h2>
          <p>Управляю коммерческим результатом: стратегия, P&amp;L, продажи, маркетинг, процессы и команда.</p>
        </header>

        <dl className="profile-v9__facts" data-reveal>
          <div><dt>12 лет</dt><dd>управленческого опыта</dd></div>
          <div><dt>P&amp;L</dt><dd>ответственность за результат</dd></div>
          <div><dt>600+</dt><dd>коммерческих проектов</dd></div>
          <div><dt>500+ млн</dt><dd>помогла заработать компаниям</dd></div>
        </dl>
      </div>
    </section>
  );
}
