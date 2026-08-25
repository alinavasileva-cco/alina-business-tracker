import { clients } from '../content';

const line = `РАБОТАЛА С · ${clients.join(' · ')}`;

export default function Clients() {
  return (
    <section className="client-line" id="clients" aria-label="Компании, с которыми работала Алина Васильева">
      <div className="client-line__viewport">
        <div className="client-line__track">
          <span className="client-line__group">{line}</span>
          <span className="client-line__group" aria-hidden="true">{line}</span>
        </div>
      </div>
    </section>
  );
}
