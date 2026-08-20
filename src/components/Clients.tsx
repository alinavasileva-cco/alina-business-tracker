import { clients } from '../content';

export default function Clients() {
  return (
    <section className="client-line" id="clients" aria-label="Компании, с которыми работала Алина Васильева">
      <div className="client-line__inner">
        <span className="client-line__label">РАБОТАЛА С</span>
        <p className="client-line__names">{clients.join(' · ')}</p>
      </div>
    </section>
  );
}
