import { clients } from '../content';

const line = clients.join(' · ');

export default function Clients() {
  return (
    <section className="client-line" id="clients" aria-label="Компании, с которыми работала Алина Васильева">
      <div className="client-line__viewport">
        <div className="client-line__track">
          <span className="client-line__group">
            <span className="client-line__label">РАБОТАЛА С</span>
            <span className="client-line__names">{line}</span>
          </span>
          <span className="client-line__group" aria-hidden="true">
            <span className="client-line__label">РАБОТАЛА С</span>
            <span className="client-line__names">{line}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
