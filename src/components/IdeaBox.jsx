import { useState } from 'react';
import { addIdea } from '../utils/dataManager';
import './IdeaBox.css';

// ===== BUZÓN DE IDEAS =====
// Los colaboradores proponen mejoras para cualquier área. La idea se guarda con
// addIdea (dataManager); al conectar el backend basta con que esa función llame a la API.

const AREAS = ['Cualquier área / General', 'Área Comercial', 'Talento Humano', 'Mercadeo', 'Contabilidad', 'Gerencia', 'Nuevos Proyectos'];

const TIPOS = [
  { id: 'procesos', label: 'Procesos', icon: <path d="M4 6h10M4 12h16M4 18h7M17 3l3 3-3 3" /> },
  { id: 'bienestar', label: 'Bienestar', icon: <path d="M12 20s-7-4.4-9-8.8C1.8 8.3 3.7 5 7 5c2 0 3.3 1.1 5 3 1.7-1.9 3-3 5-3 3.3 0 5.2 3.3 4 6.2-2 4.4-9 8.8-9 8.8z" /> },
  { id: 'estudiantes', label: 'Estudiantes', icon: <path d="M22 10 12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5" /> },
  { id: 'tecnologia', label: 'Tecnología', icon: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></> },
  { id: 'ahorro', label: 'Ahorro', icon: <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> },
  { id: 'otro', label: 'Otro', icon: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" /> },
];

const EMPTY = { nombre: '', area: AREAS[0], tipo: 'procesos', titulo: '', idea: '', beneficio: '' };
const MAX_IDEA = 600;

const Icon = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const IdeaBox = () => {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      titulo: form.titulo.trim(),
      idea: form.idea.trim(),
      nombre: form.nombre.trim(),
      beneficio: form.beneficio.trim(),
    };
    setSaving(true);
    setError(false);
    try {
      // Promise.resolve permite que addIdea pase a ser asíncrona (API) sin tocar este componente
      await Promise.resolve(addIdea(data));
      setSent(data);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setSent(null);
  };

  return (
    <section className="ideas" id="buzon-de-ideas" aria-labelledby="ideas-title">
      <div className="ideas__intro" data-reveal>
        <div className="ideas__bulb" aria-hidden="true">
          <span className="ideas__bulb-glow" />
          <Icon size={44}>
            <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
          </Icon>
        </div>
        <span className="ideas__chip">Buzón de ideas</span>
        <h2 id="ideas-title" className="ideas__title">
          Tu idea puede <span className="text-shimmer">mejorar INNE</span>
        </h2>
        <p className="ideas__desc">
          ¿Viste algo que podríamos hacer mejor? Cualquier propuesta cuenta: procesos, bienestar del equipo, atención a estudiantes, tecnología o ahorro. Para cualquier área.
        </p>
        <ul className="ideas__steps">
          <li><span>1</span>Cuéntanos tu idea</li>
          <li><span>2</span>Talento Humano la recibe</li>
          <li><span>3</span>La revisamos con el área</li>
        </ul>
      </div>

      <div className="ideas__card" data-reveal style={{ '--reveal-delay': '120ms' }}>
        {sent ? (
          <div className="ideas__done" role="status">
            <span className="ideas__done-check">
              <Icon size={34}><polyline points="20 6 9 17 4 12" /></Icon>
            </span>
            <h3>¡Gracias por tu idea{sent.nombre ? `, ${sent.nombre.split(' ')[0]}` : ''}!</h3>
            <p>
              Tu idea <strong>“{sent.titulo}”</strong> quedó registrada en el buzón. Talento Humano la revisará junto con el área correspondiente.
            </p>
            <div className="ideas__done-actions">
              <button type="button" className="ideas__btn" onClick={reset}>
                Proponer otra idea
              </button>
            </div>
          </div>
        ) : (
          <form className="ideas__form" onSubmit={submit}>
            <fieldset className="ideas__types">
              <legend>¿Qué quieres mejorar?</legend>
              <div className="ideas__types-grid">
                {TIPOS.map((t) => (
                  <label key={t.id} className={`ideas__type ${form.tipo === t.id ? 'is-active' : ''}`}>
                    <input type="radio" name="tipo" value={t.id} checked={form.tipo === t.id} onChange={set('tipo')} />
                    <Icon>{t.icon}</Icon>
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="ideas__row">
              <label className="ideas__field">
                <span>Área a la que aplica</span>
                <select value={form.area} onChange={set('area')}>
                  {AREAS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </label>
              <label className="ideas__field">
                <span>Tu nombre <em>(opcional)</em></span>
                <input type="text" value={form.nombre} onChange={set('nombre')} placeholder="Ej. Andrea" maxLength={60} />
              </label>
            </div>

            <label className="ideas__field">
              <span>Ponle un nombre a tu idea</span>
              <input type="text" value={form.titulo} onChange={set('titulo')} placeholder="Ej. Agenda compartida para asesores" required maxLength={90} />
            </label>

            <label className="ideas__field">
              <span>Cuéntanos la idea</span>
              <textarea
                value={form.idea}
                onChange={set('idea')}
                placeholder="¿Qué propones y cómo funcionaría?"
                required
                rows={4}
                maxLength={MAX_IDEA}
              />
              <small className="ideas__count">{form.idea.length}/{MAX_IDEA}</small>
            </label>

            <label className="ideas__field">
              <span>¿Cómo ayudaría? <em>(opcional)</em></span>
              <input type="text" value={form.beneficio} onChange={set('beneficio')} placeholder="Ej. Ahorraría tiempo al equipo comercial" maxLength={160} />
            </label>

            {error && (
              <p className="ideas__error" role="alert">No pudimos guardar tu idea. Inténtalo de nuevo en un momento.</p>
            )}
            <button type="submit" className="ideas__btn ideas__btn--submit" disabled={saving}>
              {saving ? 'Enviando…' : 'Enviar mi idea'}
              <Icon><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></Icon>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default IdeaBox;
