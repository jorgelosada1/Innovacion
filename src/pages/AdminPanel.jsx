import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi, ApiUnavailableError, changePassword, getSession, logout } from '../utils/dataManager';
import { BUILT_IN_IMAGES, resolveImage } from '../utils/assets';
import { clearApiCache } from '../hooks/useApiData';
import './AdminPanel.css';

// ===== PANEL ADMINISTRATIVO =====
// Administra el contenido guardado en la base de datos a través de la API.

const TABS = [
  { id: 'noticias', label: 'Noticias' },
  { id: 'banners', label: 'Banners' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'faqs', label: 'Preguntas' },
  { id: 'ideas', label: 'Buzón de ideas' },
  { id: 'cuenta', label: 'Mi cuenta' },
];

const ESTADOS_IDEA = [
  { id: 'nueva', label: 'Nueva' },
  { id: 'en_revision', label: 'En revisión' },
  { id: 'aprobada', label: 'Aprobada' },
  { id: 'implementada', label: 'Implementada' },
  { id: 'descartada', label: 'Descartada' },
];

const TIPOS_IDEA = {
  procesos: 'Procesos', bienestar: 'Bienestar', estudiantes: 'Estudiantes',
  tecnologia: 'Tecnología', ahorro: 'Ahorro', otro: 'Otro',
};

const today = () => new Date().toISOString().slice(0, 10);

const formatFecha = (value) => {
  if (!value) return '';
  const d = new Date(value.length <= 10 ? `${value}T12:00:00` : value.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Acepta el ID o un enlace completo de YouTube
const youtubeId = (value) => {
  const v = value.trim();
  const match = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,20})/);
  return match ? match[1] : v;
};

/* ---------- Íconos ---------- */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const ICON = {
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z',
  trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  up: 'M18 15l-6-6-6 6',
  down: 'M6 9l6 6 6-6',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
};

/* ---------- Campo de imagen: subir, elegir incluida o pegar URL ---------- */
const ImageField = ({ value, onChange, builtIn = false, notify }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      onChange(url);
      notify('Imagen subida');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const preview = resolveImage(value);

  return (
    <div className="adm-image">
      <div className="adm-image__preview">
        {preview ? <img src={preview} alt="Vista previa" /> : <span>Sin imagen</span>}
      </div>
      <div className="adm-image__actions">
        <button type="button" className="adm-btn adm-btn--ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <Icon d={ICON.upload} size={16} />
          {uploading ? 'Subiendo…' : 'Subir imagen'}
        </button>
        {value && (
          <button type="button" className="adm-btn adm-btn--link" onClick={() => onChange('')}>Quitar</button>
        )}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={handleFile} />
      </div>
      {builtIn && (
        <div className="adm-image__builtin">
          <span>O elige un banner incluido:</span>
          <div>
            {BUILT_IN_IMAGES.map((img) => (
              <button
                type="button"
                key={img.value}
                className={`adm-image__thumb ${value === img.value ? 'is-active' : ''}`}
                onClick={() => onChange(img.value)}
              >
                <img src={img.src} alt="" />
              </button>
            ))}
          </div>
        </div>
      )}
      <small className="adm-hint">JPG, PNG, WEBP o GIF · máximo 5 MB</small>
    </div>
  );
};

/* ---------- Hook de cada sección: carga la lista y avisa de errores ---------- */
const useList = (loader, notify) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const loaderRef = useRef(loader);

  const reload = useCallback(async () => {
    try {
      setItems(await loaderRef.current());
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, reload };
};

/* Ejecuta una acción del panel, muestra el resultado y refresca la web pública */
const useAction = (notify, reload) =>
  useCallback(
    async (fn, okMessage) => {
      try {
        await fn();
        clearApiCache();
        if (okMessage) notify(okMessage);
        await reload();
        return true;
      } catch (err) {
        notify(err.message, 'error');
        return false;
      }
    },
    [notify, reload]
  );

/* ======================= NOTICIAS ======================= */
const EMPTY_NOTICIA = { id: null, titulo: '', resumen: '', contenido: '', imagen: '', fecha: today(), publicado: true };

const NoticiasTab = ({ notify }) => {
  const { items, loading, reload } = useList(adminApi.noticias.list, notify);
  const run = useAction(notify, reload);
  const [form, setForm] = useState(EMPTY_NOTICIA);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const ok = await run(
      () => (form.id ? adminApi.noticias.update(form.id, form) : adminApi.noticias.create(form)),
      form.id ? 'Noticia actualizada' : 'Noticia creada'
    );
    if (ok) setForm(EMPTY_NOTICIA);
  };

  return (
    <div className="adm-grid">
      <form className="adm-card adm-form" onSubmit={submit}>
        <h2>{form.id ? 'Editar noticia' : 'Nueva noticia'}</h2>
        <label>Título<input value={form.titulo} onChange={set('titulo')} maxLength={200} required /></label>
        <label>Resumen<textarea value={form.resumen} onChange={set('resumen')} rows={2} maxLength={500} required /></label>
        <label>
          Contenido
          <textarea value={form.contenido} onChange={set('contenido')} rows={7} required />
          <small className="adm-hint">Deja una línea en blanco para separar párrafos.</small>
        </label>
        <div className="adm-row">
          <label>Fecha<input type="date" value={form.fecha} onChange={set('fecha')} required /></label>
          <label className="adm-check"><input type="checkbox" checked={form.publicado} onChange={set('publicado')} /> Publicada</label>
        </div>
        <span className="adm-label">Imagen de portada (opcional)</span>
        <ImageField value={form.imagen} onChange={(imagen) => setForm((f) => ({ ...f, imagen }))} notify={notify} />
        <div className="adm-form__actions">
          <button type="submit" className="adm-btn adm-btn--primary">{form.id ? 'Guardar cambios' : 'Crear noticia'}</button>
          {form.id && <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setForm(EMPTY_NOTICIA)}>Cancelar</button>}
        </div>
      </form>

      <div className="adm-list">
        {loading && <p className="adm-empty">Cargando…</p>}
        {!loading && items.length === 0 && <p className="adm-empty">Aún no hay noticias.</p>}
        {items.map((n) => (
          <article key={n.id} className={`adm-item ${form.id === n.id ? 'is-editing' : ''}`}>
            {n.imagen && <img className="adm-item__thumb" src={resolveImage(n.imagen)} alt="" />}
            <div className="adm-item__info">
              <h3>{n.titulo}</h3>
              <p>{formatFecha(n.fecha)} · <span className={`adm-badge ${n.publicado ? 'adm-badge--ok' : ''}`}>{n.publicado ? 'Publicada' : 'Borrador'}</span></p>
            </div>
            <div className="adm-item__actions">
              <button className="adm-icon-btn" title="Editar" onClick={() => setForm({ ...EMPTY_NOTICIA, ...n })}><Icon d={ICON.edit} /></button>
              <button className="adm-icon-btn adm-icon-btn--danger" title="Eliminar" onClick={() => window.confirm(`¿Eliminar "${n.titulo}"?`) && run(() => adminApi.noticias.remove(n.id), 'Noticia eliminada')}><Icon d={ICON.trash} /></button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

/* ======================= BANNERS ======================= */
const EMPTY_BANNER = { id: null, imagen: '', title: '', link: '', noticiaId: '', activo: true };

const BannersTab = ({ notify }) => {
  const { items, loading, reload } = useList(adminApi.slider.list, notify);
  const noticias = useList(adminApi.noticias.list, notify);
  const run = useAction(notify, reload);
  const [form, setForm] = useState(EMPTY_BANNER);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.imagen) return notify('Sube o elige una imagen para el banner', 'error');
    const data = { ...form, noticiaId: form.noticiaId || null };
    const ok = await run(
      () => (form.id ? adminApi.slider.update(form.id, data) : adminApi.slider.create(data)),
      form.id ? 'Banner actualizado' : 'Banner agregado'
    );
    if (ok) setForm(EMPTY_BANNER);
  };

  const move = (index, dir) => {
    const ids = items.map((s) => s.id);
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    run(() => adminApi.slider.reorder(ids), 'Orden actualizado');
  };

  return (
    <div className="adm-grid">
      <form className="adm-card adm-form" onSubmit={submit}>
        <h2>{form.id ? 'Editar banner' : 'Nuevo banner'}</h2>
        <span className="adm-label">Imagen del banner (recomendado 1600 × 458 px)</span>
        <ImageField value={form.imagen} onChange={(imagen) => setForm((f) => ({ ...f, imagen }))} builtIn notify={notify} />
        <label>Título (texto alternativo)<input value={form.title} onChange={set('title')} maxLength={200} /></label>
        <label>
          Enlace al hacer clic
          <input value={form.link} onChange={set('link')} placeholder="/noticias o https://..." maxLength={500} />
        </label>
        <label>
          O vincular a una noticia
          <select value={form.noticiaId || ''} onChange={set('noticiaId')}>
            <option value="">Ninguna</option>
            {noticias.items.map((n) => <option key={n.id} value={n.id}>{n.titulo}</option>)}
          </select>
        </label>
        <label className="adm-check"><input type="checkbox" checked={form.activo} onChange={set('activo')} /> Visible en la página de inicio</label>
        <div className="adm-form__actions">
          <button type="submit" className="adm-btn adm-btn--primary">{form.id ? 'Guardar cambios' : 'Agregar banner'}</button>
          {form.id && <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setForm(EMPTY_BANNER)}>Cancelar</button>}
        </div>
      </form>

      <div className="adm-list">
        {loading && <p className="adm-empty">Cargando…</p>}
        {!loading && items.length === 0 && <p className="adm-empty">No hay banners.</p>}
        {items.map((s, i) => (
          <article key={s.id} className={`adm-item adm-item--banner ${form.id === s.id ? 'is-editing' : ''} ${s.activo ? '' : 'is-off'}`}>
            <img className="adm-item__banner" src={resolveImage(s.imagen)} alt="" />
            <div className="adm-item__info">
              <h3>{s.title || 'Sin título'}</h3>
              <p>
                {s.link || (s.noticiaId ? `Noticia #${s.noticiaId}` : 'Sin enlace')} ·{' '}
                <span className={`adm-badge ${s.activo ? 'adm-badge--ok' : ''}`}>{s.activo ? 'Visible' : 'Oculto'}</span>
              </p>
            </div>
            <div className="adm-item__actions">
              <button className="adm-icon-btn" title="Subir" disabled={i === 0} onClick={() => move(i, -1)}><Icon d={ICON.up} /></button>
              <button className="adm-icon-btn" title="Bajar" disabled={i === items.length - 1} onClick={() => move(i, 1)}><Icon d={ICON.down} /></button>
              <button className="adm-icon-btn" title="Editar" onClick={() => setForm({ ...EMPTY_BANNER, ...s, noticiaId: s.noticiaId || '' })}><Icon d={ICON.edit} /></button>
              <button className="adm-icon-btn adm-icon-btn--danger" title="Eliminar" onClick={() => window.confirm('¿Eliminar este banner?') && run(() => adminApi.slider.remove(s.id), 'Banner eliminado')}><Icon d={ICON.trash} /></button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

/* ======================= CURSOS ======================= */
const EMPTY_CURSO = { id: null, titulo: '', descripcion: '', videoId: '', duracion: '', nivel: 'Básico', temas: '', evaluacion: false, activo: true, orden: 0 };

const CursosTab = ({ notify }) => {
  const { items, loading, reload } = useList(adminApi.cursos.list, notify);
  const run = useAction(notify, reload);
  const [form, setForm] = useState(EMPTY_CURSO);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      videoId: youtubeId(form.videoId),
      temas: form.temas.split(',').map((t) => t.trim()).filter(Boolean),
    };
    const ok = await run(
      () => (form.id ? adminApi.cursos.update(form.id, data) : adminApi.cursos.create(data)),
      form.id ? 'Curso actualizado' : 'Curso creado'
    );
    if (ok) setForm(EMPTY_CURSO);
  };

  return (
    <div className="adm-grid">
      <form className="adm-card adm-form" onSubmit={submit}>
        <h2>{form.id ? 'Editar curso' : 'Nuevo curso'}</h2>
        <label>Título<input value={form.titulo} onChange={set('titulo')} maxLength={200} required /></label>
        <label>Descripción<textarea value={form.descripcion} onChange={set('descripcion')} rows={3} maxLength={2000} required /></label>
        <label>
          Video de YouTube
          <input value={form.videoId} onChange={set('videoId')} placeholder="Enlace o ID del video" required />
        </label>
        <div className="adm-row">
          <label>Duración<input value={form.duracion} onChange={set('duracion')} placeholder="Ej. 4 semanas" maxLength={60} /></label>
          <label>
            Nivel
            <select value={form.nivel} onChange={set('nivel')}>
              <option>Básico</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
          </label>
        </div>
        <label>
          Temas o módulos
          <input value={form.temas} onChange={set('temas')} placeholder="Separados por coma" />
        </label>
        <div className="adm-row">
          <label className="adm-check"><input type="checkbox" checked={form.evaluacion} onChange={set('evaluacion')} /> Con evaluación</label>
          <label className="adm-check"><input type="checkbox" checked={form.activo} onChange={set('activo')} /> Visible</label>
        </div>
        <div className="adm-form__actions">
          <button type="submit" className="adm-btn adm-btn--primary">{form.id ? 'Guardar cambios' : 'Crear curso'}</button>
          {form.id && <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setForm(EMPTY_CURSO)}>Cancelar</button>}
        </div>
      </form>

      <div className="adm-list">
        {loading && <p className="adm-empty">Cargando…</p>}
        {!loading && items.length === 0 && <p className="adm-empty">Aún no hay cursos.</p>}
        {items.map((c) => (
          <article key={c.id} className={`adm-item ${form.id === c.id ? 'is-editing' : ''} ${c.activo ? '' : 'is-off'}`}>
            <img className="adm-item__thumb" src={`https://i.ytimg.com/vi/${c.videoId}/default.jpg`} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
            <div className="adm-item__info">
              <h3>{c.titulo}</h3>
              <p>{c.nivel} · {c.duracion || 'Sin duración'} · {c.temas.length} módulos · <span className={`adm-badge ${c.activo ? 'adm-badge--ok' : ''}`}>{c.activo ? 'Visible' : 'Oculto'}</span></p>
            </div>
            <div className="adm-item__actions">
              <button className="adm-icon-btn" title="Editar" onClick={() => setForm({ ...EMPTY_CURSO, ...c, temas: c.temas.join(', ') })}><Icon d={ICON.edit} /></button>
              <button className="adm-icon-btn adm-icon-btn--danger" title="Eliminar" onClick={() => window.confirm(`¿Eliminar "${c.titulo}"?`) && run(() => adminApi.cursos.remove(c.id), 'Curso eliminado')}><Icon d={ICON.trash} /></button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

/* ======================= PREGUNTAS FRECUENTES ======================= */
const EMPTY_FAQ = { id: null, question: '', answer: '' };

const FaqsTab = ({ notify }) => {
  const { items, loading, reload } = useList(adminApi.faqs.list, notify);
  const run = useAction(notify, reload);
  const [form, setForm] = useState(EMPTY_FAQ);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const ok = await run(
      () => (form.id ? adminApi.faqs.update(form.id, form) : adminApi.faqs.create(form)),
      form.id ? 'Pregunta actualizada' : 'Pregunta agregada'
    );
    if (ok) setForm(EMPTY_FAQ);
  };

  return (
    <div className="adm-grid">
      <form className="adm-card adm-form" onSubmit={submit}>
        <h2>{form.id ? 'Editar pregunta' : 'Nueva pregunta'}</h2>
        <label>Pregunta<input value={form.question} onChange={set('question')} maxLength={300} required /></label>
        <label>Respuesta<textarea value={form.answer} onChange={set('answer')} rows={5} maxLength={3000} required /></label>
        <div className="adm-form__actions">
          <button type="submit" className="adm-btn adm-btn--primary">{form.id ? 'Guardar cambios' : 'Agregar pregunta'}</button>
          {form.id && <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setForm(EMPTY_FAQ)}>Cancelar</button>}
        </div>
      </form>

      <div className="adm-list">
        {loading && <p className="adm-empty">Cargando…</p>}
        {!loading && items.length === 0 && <p className="adm-empty">Aún no hay preguntas.</p>}
        {items.map((f) => (
          <article key={f.id} className={`adm-item ${form.id === f.id ? 'is-editing' : ''}`}>
            <div className="adm-item__info">
              <h3>{f.question}</h3>
              <p className="adm-item__clamp">{f.answer}</p>
            </div>
            <div className="adm-item__actions">
              <button className="adm-icon-btn" title="Editar" onClick={() => setForm({ id: f.id, question: f.question, answer: f.answer })}><Icon d={ICON.edit} /></button>
              <button className="adm-icon-btn adm-icon-btn--danger" title="Eliminar" onClick={() => window.confirm('¿Eliminar esta pregunta?') && run(() => adminApi.faqs.remove(f.id), 'Pregunta eliminada')}><Icon d={ICON.trash} /></button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

/* ======================= BUZÓN DE IDEAS ======================= */
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

const IdeaCard = ({ idea, run }) => {
  const [nota, setNota] = useState(idea.nota);
  const estado = ESTADOS_IDEA.find((e) => e.id === idea.estado);

  return (
    <article className={`adm-idea adm-idea--${idea.estado}`}>
      <header className="adm-idea__head">
        <div>
          <h3>{idea.titulo}</h3>
          <p>
            {TIPOS_IDEA[idea.tipo] || idea.tipo} · {idea.area || 'Sin área'} · {idea.nombre || 'Anónimo'} · {formatFecha(idea.fecha)}
          </p>
        </div>
        <span className={`adm-badge adm-badge--${idea.estado}`}>{estado?.label || idea.estado}</span>
      </header>
      <p className="adm-idea__text">{idea.idea}</p>
      {idea.beneficio && <p className="adm-idea__benefit"><strong>¿Cómo ayudaría?</strong> {idea.beneficio}</p>}
      <div className="adm-idea__manage">
        <select value={idea.estado} onChange={(e) => run(() => adminApi.ideas.update(idea.id, { estado: e.target.value }), 'Estado actualizado')}>
          {ESTADOS_IDEA.map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}
        </select>
        <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Nota interna (opcional)" maxLength={500} />
        <button className="adm-btn adm-btn--ghost" disabled={nota === idea.nota} onClick={() => run(() => adminApi.ideas.update(idea.id, { nota }), 'Nota guardada')}>Guardar nota</button>
        <button className="adm-icon-btn adm-icon-btn--danger" title="Eliminar" onClick={() => window.confirm('¿Eliminar esta idea?') && run(() => adminApi.ideas.remove(idea.id), 'Idea eliminada')}><Icon d={ICON.trash} /></button>
      </div>
    </article>
  );
};

const IdeasTab = ({ notify }) => {
  const { items, loading, reload } = useList(() => adminApi.ideas.list(), notify);
  const run = useAction(notify, reload);
  const [filtro, setFiltro] = useState('');

  const visibles = filtro ? items.filter((i) => i.estado === filtro) : items;
  const count = (estado) => items.filter((i) => i.estado === estado).length;

  const exportCsv = () => {
    const header = ['Fecha', 'Título', 'Idea', 'Cómo ayudaría', 'Tipo', 'Área', 'Nombre', 'Estado', 'Nota'];
    const rows = visibles.map((i) => [i.fecha, i.titulo, i.idea, i.beneficio, TIPOS_IDEA[i.tipo] || i.tipo, i.area, i.nombre, i.estado, i.nota]);
    const csv = '﻿' + [header, ...rows].map((r) => r.map(csvCell).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `buzon-de-ideas-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="adm-toolbar">
        <div className="adm-filters">
          <button className={`adm-chip ${filtro === '' ? 'is-active' : ''}`} onClick={() => setFiltro('')}>Todas <span>{items.length}</span></button>
          {ESTADOS_IDEA.map((e) => (
            <button key={e.id} className={`adm-chip ${filtro === e.id ? 'is-active' : ''}`} onClick={() => setFiltro(e.id)}>
              {e.label} <span>{count(e.id)}</span>
            </button>
          ))}
        </div>
        <button className="adm-btn adm-btn--ghost" onClick={exportCsv} disabled={visibles.length === 0}>
          <Icon d={ICON.download} size={16} /> Exportar a Excel (CSV)
        </button>
      </div>
      {loading && <p className="adm-empty">Cargando…</p>}
      {!loading && visibles.length === 0 && <p className="adm-empty">No hay ideas {filtro ? 'con este estado' : 'todavía'}.</p>}
      <div className="adm-ideas">
        {visibles.map((idea) => <IdeaCard key={`${idea.id}-${idea.nota}`} idea={idea} run={run} />)}
      </div>
    </div>
  );
};

/* ======================= MI CUENTA ======================= */
const CuentaTab = ({ admin, notify }) => {
  const [form, setForm] = useState({ actual: '', nueva: '', repetir: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.nueva !== form.repetir) return notify('Las contraseñas nuevas no coinciden', 'error');
    try {
      await changePassword(form.actual, form.nueva);
      notify('Contraseña actualizada');
      setForm({ actual: '', nueva: '', repetir: '' });
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="adm-grid adm-grid--single">
      <form className="adm-card adm-form" onSubmit={submit}>
        <h2>Cambiar contraseña</h2>
        <p className="adm-hint">Sesión iniciada como <strong>{admin.usuario}</strong>.</p>
        <label>Contraseña actual<input type="password" value={form.actual} onChange={set('actual')} autoComplete="current-password" required /></label>
        <label>Nueva contraseña<input type="password" value={form.nueva} onChange={set('nueva')} minLength={10} autoComplete="new-password" required /></label>
        <label>Repetir nueva contraseña<input type="password" value={form.repetir} onChange={set('repetir')} minLength={10} autoComplete="new-password" required /></label>
        <small className="adm-hint">Mínimo 10 caracteres.</small>
        <div className="adm-form__actions">
          <button type="submit" className="adm-btn adm-btn--primary">Actualizar contraseña</button>
        </div>
      </form>
    </div>
  );
};

/* ======================= PANEL ======================= */
const AdminPanel = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState('checking');
  const [tab, setTab] = useState('noticias');
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((text, type = 'ok') => {
    clearTimeout(toastTimer.current);
    setToast({ text, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    getSession()
      .then((session) => {
        if (!session) {
          navigate('/login', { replace: true });
          return;
        }
        setAdmin(session);
        setStatus('ready');
      })
      .catch((err) => setStatus(err instanceof ApiUnavailableError ? 'unavailable' : 'error'));
    return () => clearTimeout(toastTimer.current);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/');
    }
  };

  if (status !== 'ready') {
    return (
      <div className="adm adm--center">
        <div className="adm-card adm-state">
          {status === 'checking' ? (
            <p>Verificando sesión…</p>
          ) : (
            <>
              <h2>No se pudo conectar con el servidor</h2>
              <p>El panel necesita la API publicada en el hosting (carpeta <code>/api</code>).</p>
              <Link className="adm-btn adm-btn--primary" to="/">Volver al inicio</Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="adm">
      <header className="adm-header">
        <div>
          <span className="adm-header__eyebrow">Panel administrativo</span>
          <h1>Hola, {admin.nombre || admin.usuario}</h1>
        </div>
        <div className="adm-header__actions">
          <Link to="/" className="adm-btn adm-btn--ghost">Ver sitio</Link>
          <button className="adm-btn adm-btn--dark" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <nav className="adm-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`adm-tab ${tab === t.id ? 'is-active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <main className="adm-content">
        {tab === 'noticias' && <NoticiasTab notify={notify} />}
        {tab === 'banners' && <BannersTab notify={notify} />}
        {tab === 'cursos' && <CursosTab notify={notify} />}
        {tab === 'faqs' && <FaqsTab notify={notify} />}
        {tab === 'ideas' && <IdeasTab notify={notify} />}
        {tab === 'cuenta' && <CuentaTab admin={admin} notify={notify} />}
      </main>

      {toast && (
        <div className={`adm-toast adm-toast--${toast.type}`} role="status">
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
