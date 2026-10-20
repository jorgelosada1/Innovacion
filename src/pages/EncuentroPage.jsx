import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { agenda, amigoSecreto, encuentro, normas, recomendaciones } from '../data/encuentro2026';
import './EncuentroPage.css';

const CHECKLIST_KEY = 'inne_encuentro2026_maleta';

// Íconos (trazos de 24×24)
const ICONS = {
  clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>,
  ear: <path d="M6 9a6 6 0 1 1 12 0c0 3-2 4-3 5.5S14 18 12 19.5 8 21 8 18" />,
  team: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></>,
  phone: <><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M11 18h2" /></>,
  glass: <path d="M7 3h10l-1 7a4 4 0 0 1-8 0zM12 14v6M8.5 21h7" />,
  home: <path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6" />,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  shield: <path d="M12 21s8-4 8-10V5l-8-3-8 3v6c0 6 8 10 8 10zM9 12l2 2 4-4" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  camera: <><path d="M4 7h3l2-3h6l2 3h3v12H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  food: <path d="M7 2v8M5 2v5a2 2 0 0 0 4 0V2M7 10v12M17 2c-2 0-3 2-3 5v5h3v10" />,
  zap: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  wave: <path d="M7 11V5.5a1.5 1.5 0 0 1 3 0V10M10 9.5V4a1.5 1.5 0 0 1 3 0v6M13 9.5V5a1.5 1.5 0 0 1 3 0v6.5M16 10a1.5 1.5 0 0 1 3 0v3a8 8 0 0 1-8 8 7 7 0 0 1-6-3.5L3 14a1.5 1.5 0 0 1 2.5-1.5L7 14" />,
  flag: <path d="M5 21V4M5 4h11l-2 4 2 4H5" />,
  present: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M12 16v4M8 21h8M7 12l3-3 2 2 4-4" /></>,
  flask: <path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 15h10" />,
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />,
  heart: <path d="M12 20s-7-4.4-9-8.8C1.8 8.3 3.7 5 7 5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.3 0 5.2 3.3 4 6.2-2 4.4-9 8.8-9 8.8z" />,
  bridge: <path d="M2 18h20M4 18c0-5 3.5-9 8-9s8 4 8 9M8 18v-6M12 18V9M16 18v-6" />,
  work: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  pin: <><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  gift: <><rect x="3" y="8" width="18" height="5" rx="1" /><path d="M5 13v8h14v-8M12 8v13M12 8S10.5 3 8 3.5 7 8 12 8zM12 8s1.5-5 4-4.5S17 8 12 8z" /></>,
  bus: <><rect x="4" y="3" width="16" height="15" rx="3" /><path d="M4 11h16M8 18v3M16 18v3M8 14.5h.01M16 14.5h.01" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
};

const Icon = ({ name, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

// Clasifica cada actividad de la agenda para darle ícono y estilo
const kindOf = (title) => {
  const t = title.toLowerCase();
  if (t.includes('almuerzo')) return { icon: 'food', kind: 'break' };
  if (t.includes('energizer') || t.includes('rompe hielo')) return { icon: 'zap', kind: 'energy' };
  if (t.includes('bienvenida')) return { icon: 'wave', kind: 'main' };
  if (t.includes('puente')) return { icon: 'bridge', kind: 'main' };
  if (t.includes('shark')) return { icon: 'bulb', kind: 'highlight' };
  if (t.includes('reconozco')) return { icon: 'heart', kind: 'highlight' };
  if (t.includes('laboratorio')) return { icon: 'flask', kind: 'main' };
  if (t.includes('presentaci')) return { icon: 'present', kind: 'main' };
  if (t.includes('cierre')) return { icon: 'flag', kind: 'close' };
  if (t.startsWith('trabajo')) return { icon: 'work', kind: 'work' };
  return { icon: 'team', kind: 'main' };
};

/* Cuenta regresiva hasta el inicio del encuentro */
const useCountdown = (startIso, endIso) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (now >= end) return { status: 'ended' };
  if (now >= start) return { status: 'live' };
  const diff = start - now;
  return {
    status: 'soon',
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const Countdown = () => {
  const c = useCountdown(encuentro.start, encuentro.end);
  if (c.status === 'live') return <p className="ev-countdown__live"><span /> ¡El encuentro está en curso!</p>;
  if (c.status === 'ended') return <p className="ev-countdown__live ev-countdown__live--ended">¡Gracias por vivir el Encuentro 2026!</p>;
  const units = [
    ['días', c.days],
    ['horas', c.hours],
    ['min', c.minutes],
    ['seg', c.seconds],
  ];
  return (
    <div className="ev-countdown" aria-label="Tiempo restante para el encuentro">
      {units.map(([label, value]) => (
        <div key={label} className="ev-countdown__unit">
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

/* Lista de chequeo de la maleta (se guarda en este navegador) */
const PackingList = () => {
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CHECKLIST_KEY)) || [];
    } catch {
      return [];
    }
  });

  const toggle = (i) => {
    setChecked((prev) => {
      const next = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i];
      try {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      } catch {
        /* almacenamiento no disponible */
      }
      return next;
    });
  };

  const done = checked.length;
  const total = recomendaciones.length;

  return (
    <div className="ev-pack">
      <div className="ev-pack__progress">
        <span>{done === total ? '¡Todo listo para el viaje! 🎒' : `${done} de ${total} listos`}</span>
        <div className="ev-pack__bar"><div style={{ width: `${(done / total) * 100}%` }} /></div>
      </div>
      <ul>
        {recomendaciones.map((r, i) => (
          <li key={i}>
            <label className={`ev-pack__item ${checked.includes(i) ? 'is-checked' : ''}`}>
              <input type="checkbox" checked={checked.includes(i)} onChange={() => toggle(i)} />
              <span className="ev-pack__box" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <span className="ev-pack__text">{r}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

const EncuentroPage = () => {
  const [activeDay, setActiveDay] = useState(agenda[0].id);
  const day = agenda.find((d) => d.id === activeDay);

  return (
    <article className="ev">
      {/* === HERO === */}
      <header className="ev-hero">
        <div className="ev-hero__dots" aria-hidden="true" />
        <Link to="/noticias" className="ev-back ev-back--top">← Noticias</Link>
        <figure className="ev-hero__banner">
          <img src={encuentro.banner} alt="Encuentro Nacional 2026: conferencias, talleres, networking y planeación estratégica" />
        </figure>
        <div className="ev-hero__inner">
          <span className="ev-hero__badge">Evento interno · Equipo INNE</span>
          <h1 className="ev-hero__title">
            Encuentro Nacional <span className="text-shimmer">INNE 2026</span>
          </h1>
          <p className="ev-hero__subtitle">{encuentro.subtitle}</p>
          <div className="ev-hero__meta">
            <span><Icon name="calendar" size={18} /> {encuentro.dates}</span>
            <span><Icon name="pin" size={18} /> {encuentro.places}</span>
          </div>
          <Countdown />
        </div>
        <div className="ev-hero__curve" aria-hidden="true">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none"><path d="M0 70V30C360 -10 1080 -10 1440 30V70Z" /></svg>
        </div>
      </header>

      <div className="ev-container">
        {/* === OBJETIVO === */}
        <section className="ev-objective" data-reveal>
          <span className="ev-objective__icon"><Icon name="target" size={28} /></span>
          <div>
            <h2>Objetivo del encuentro</h2>
            <p>{encuentro.objective}</p>
          </div>
        </section>

        {/* === AGENDA === */}
        <section className="ev-section" id="agenda">
          <div className="ev-section__head" data-reveal>
            <span className="ev-chip">Itinerario</span>
            <h2>Agenda del encuentro</h2>
          </div>

          <div className="ev-days" role="tablist" aria-label="Días del encuentro">
            {agenda.map((d) => (
              <button
                key={d.id}
                role="tab"
                aria-selected={activeDay === d.id}
                className={`ev-days__tab ${activeDay === d.id ? 'is-active' : ''}`}
                onClick={() => setActiveDay(d.id)}
              >
                <strong>{d.label}</strong>
                <span>{d.day}</span>
              </button>
            ))}
          </div>

          <div className="ev-day" key={day.id} role="tabpanel">
            <div className="ev-day__header">
              <h3>{day.day} de octubre</h3>
              <p>{day.theme}</p>
            </div>

            {day.items && (
              <ol className="ev-timeline">
                {day.items.map((item, i) => {
                  const { icon, kind } = kindOf(item.title);
                  return (
                    <li key={i} className={`ev-timeline__item ev-timeline__item--${kind}`} style={{ '--i': i }}>
                      <span className="ev-timeline__time">{item.time}</span>
                      <span className="ev-timeline__dot"><Icon name={icon} size={16} /></span>
                      <span className="ev-timeline__title">{item.title}</span>
                    </li>
                  );
                })}
              </ol>
            )}

            {day.trip && (
              <div className="ev-trip">
                {day.trip.map((t) => (
                  <div key={t.day} className="ev-trip__card">
                    <span className="ev-trip__icon"><Icon name={t.note ? 'bus' : 'calendar'} size={22} /></span>
                    <h4>{t.day}</h4>
                    <p>{t.text}</p>
                    {t.note && (
                      <p className="ev-trip__note"><Icon name="gift" size={16} /> {t.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* === AMIGO SECRETO === */}
        <section className="ev-gift" data-reveal>
          <div className="ev-gift__intro">
            <span className="ev-gift__icon"><Icon name="gift" size={34} /></span>
            <h2>Entrega de regalos de amigo secreto</h2>
            <p className="ev-gift__when"><Icon name="calendar" size={16} /> {amigoSecreto.when}</p>
          </div>
          <ul className="ev-gift__rules">
            {amigoSecreto.rules.map((r, i) => (
              <li key={i}><span>{i + 1}</span>{r}</li>
            ))}
          </ul>
        </section>

        {/* === NORMAS === */}
        <section className="ev-section">
          <div className="ev-section__head" data-reveal>
            <span className="ev-chip">Convivencia</span>
            <h2>Normas de comportamiento</h2>
          </div>
          <div className="ev-rules">
            {normas.map((n, i) => (
              <div key={n.title} className="ev-rule" data-reveal style={{ '--reveal-delay': `${(i % 2) * 80}ms` }}>
                <span className="ev-rule__icon"><Icon name={n.icon} size={22} /></span>
                <div>
                  <h3>{n.title}</h3>
                  <p>{n.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === RECOMENDACIONES === */}
        <section className="ev-section ev-section--split">
          <div className="ev-section__head ev-section__head--left" data-reveal>
            <span className="ev-chip">Antes de salir</span>
            <h2>Recomendaciones para preparar el viaje</h2>
            <p>Marca cada punto a medida que lo tengas listo. Tu lista se guarda en este dispositivo.</p>
          </div>
          <div data-reveal>
            <PackingList />
          </div>
        </section>

        {/* === CIERRE === */}
        <section className="ev-closing" data-reveal>
          <p>{encuentro.closing}</p>
        </section>

        <Link to="/noticias" className="ev-back ev-back--dark">← Volver a noticias</Link>
      </div>
    </article>
  );
};

export default EncuentroPage;
