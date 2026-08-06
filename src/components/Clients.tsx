import { clients } from '../content';

export default function Clients() {
  return (
    <section className="clients editorial-section" id="clients" aria-labelledby="clients-title">
      <div className="section-shell">
        <header className="clients__header" data-reveal>
          <div><p className="section-kicker">Клиентский портфель</p><h2 id="clients-title">Компании и проекты</h2></div>
          <p>Компании и проекты, в которых стратегия становилась управляемым бизнес-результатом.</p>
        </header>
        <ul className="clients__grid" data-reveal>{clients.map((client) => <li key={client}>{client}</li>)}</ul>
      </div>
    </section>
  );
}
