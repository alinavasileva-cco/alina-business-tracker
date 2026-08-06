export default function Contact() {
  return (
    <footer className="contact" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <p className="eyebrow" data-reveal>Контакты</p>
        <div className="contact__main" data-reveal>
          <h2 id="contact-title">Обсудить задачу</h2>
          <p>Коммерческая стратегия, развитие направления, P&L, процессы и управленческие системы.</p>
        </div>

        <address className="contact__links" data-reveal>
          <a href="tel:+79818885389" aria-label="Позвонить Алине Васильевой по номеру плюс семь девятьсот восемьдесят один восемьсот восемьдесят восемь пятьдесят три восемьдесят девять">
            <span>Телефон</span>+7 981 888 53 89
          </a>
          <a href="mailto:alinavasileva.jour@mail.ru" aria-label="Написать Алине Васильевой на электронную почту">
            <span>Email</span>alinavasileva.jour@mail.ru
          </a>
          <a href="https://t.me/AlinaVasileva" target="_blank" rel="noreferrer" aria-label="Открыть Telegram Алины Васильевой в новой вкладке">
            <span>Telegram</span>@AlinaVasileva
          </a>
        </address>

        <div className="contact__bottom">
          <p>© {new Date().getFullYear()} Алина Васильева</p>
          <a href="#hero">Наверх <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
