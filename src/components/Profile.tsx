export default function Profile() {
  return (
    <section className="profile editorial-section" id="profile" aria-labelledby="profile-title">
      <div className="section-shell">
        <header className="profile__header" data-reveal>
          <p className="section-kicker">Профессиональный профиль</p>
          <h2 id="profile-title">Коммерческий директор / CCO</h2>
        </header>
        <div className="profile__body">
          <div className="profile__copy" data-reveal>
            <p>Отвечаю за коммерческий результат, P&amp;L, развитие направлений, продажи, маркетинг, процессы, аналитику и работу кросс-функциональных команд.</p>
            <p>Работаю с собственниками и C-level: от диагностики модели и определения точек роста до внедрения изменений и контроля результата.</p>
          </div>
          <dl className="profile__facts" data-reveal>
            <div><dt>12 лет</dt><dd>управленческого опыта</dd></div>
            <div><dt>600+</dt><dd>коммерческих проектов</dd></div>
            <div><dt>P&amp;L</dt><dd>ответственность за результат</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
