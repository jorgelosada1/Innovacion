import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Scene3D from './three/Scene3D';
import logoSolo from '../assets/images/LogoSolo.png';
import './BookShowcase.css';

// ===== BIBLIOTECA DIGITAL =====
// Libro 3D que se abre y muestra la publicación alojada en Adobe InDesign (Publish Online).

const BOOK = {
  title: 'Libro digital',
  subtitle: 'Biblioteca INNE',
  description:
    'Explora nuestro libro digital interactivo: pasa las páginas, amplía el contenido y léelo desde cualquier dispositivo, sin descargas.',
  viewUrl: 'https://indd.adobe.com/view/4553412d-83e2-4342-adb7-7d24730a8e65',
  embedUrl: 'https://indd.adobe.com/embed/4553412d-83e2-4342-adb7-7d24730a8e65?startpage=1&allowFullscreen=true',
};

const features = [
  {
    label: 'Lectura interactiva',
    icon: <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
  },
  {
    label: 'Desde cualquier dispositivo',
    icon: <path d="M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01" />,
  },
  {
    label: 'Acceso libre y gratuito',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" />,
  },
];

/* Libro con CSS 3D para navegadores sin WebGL */
const CssBook = ({ onSelect }) => (
  <button className="css-book" onClick={onSelect} aria-label={`Abrir ${BOOK.title}`}>
    <span className="css-book__pages" />
    <span className="css-book__cover">
      <img src={logoSolo} alt="" />
      <strong>{BOOK.title}</strong>
      <em>{BOOK.subtitle}</em>
    </span>
  </button>
);

const BookReader = ({ onClose }) => {
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="book-reader" role="dialog" aria-modal="true" aria-label={BOOK.title} onClick={onClose}>
      <div className="book-reader__panel" onClick={(e) => e.stopPropagation()}>
        <header className="book-reader__bar">
          <div className="book-reader__title">
            <img src={logoSolo} alt="" />
            <div>
              <strong>{BOOK.title}</strong>
              <span>{BOOK.subtitle}</span>
            </div>
          </div>
          <div className="book-reader__actions">
            <a href={BOOK.viewUrl} target="_blank" rel="noopener noreferrer" className="book-reader__btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Abrir en pestaña nueva</span>
            </a>
            <button ref={closeRef} className="book-reader__close" onClick={onClose} aria-label="Cerrar lector">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </header>
        <div className="book-reader__frame">
          {!loaded && (
            <div className="book-reader__loading">
              <span className="book-reader__spinner" />
              Abriendo el libro...
            </div>
          )}
          <iframe
            src={BOOK.embedUrl}
            title={BOOK.title}
            allowFullScreen
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

const BookShowcase = () => {
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Primero se abre el libro 3D y luego aparece el lector
  const startReading = () => {
    setOpen(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setReading(true), 900);
  };

  const closeReader = () => {
    setReading(false);
    timer.current = setTimeout(() => setOpen(false), 400);
  };

  return (
    <section className="book-showcase" aria-labelledby="book-showcase-title">
      <div className="book-showcase__glow book-showcase__glow--1" aria-hidden="true" />
      <div className="book-showcase__glow book-showcase__glow--2" aria-hidden="true" />

      <div className="book-showcase__stage" data-reveal="zoom">
        <div className="book-showcase__pedestal" aria-hidden="true" />
        <Scene3D
          type="book"
          open={open}
          title={BOOK.title}
          subtitle={BOOK.subtitle}
          onSelect={startReading}
          fallback={<CssBook onSelect={startReading} />}
        />
        <span className="book-showcase__hint">{open ? 'Abriendo…' : 'Haz clic en el libro para abrirlo'}</span>
      </div>

      <div className="book-showcase__info">
        <span className="book-showcase__chip" data-reveal>
          <span className="book-showcase__chip-dot" />
          Biblioteca digital · Nuevo
        </span>
        <h2 id="book-showcase-title" className="book-showcase__title" data-reveal style={{ '--reveal-delay': '100ms' }}>
          Aprende con nuestro <span className="text-shimmer">libro digital</span>
        </h2>
        <p className="book-showcase__desc" data-reveal style={{ '--reveal-delay': '180ms' }}>{BOOK.description}</p>

        <ul className="book-showcase__features" data-reveal style={{ '--reveal-delay': '260ms' }}>
          {features.map((f) => (
            <li key={f.label}>
              <span className="book-showcase__feature-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
              </span>
              {f.label}
            </li>
          ))}
        </ul>

        <div className="book-showcase__actions" data-reveal style={{ '--reveal-delay': '340ms' }}>
          <button className="book-showcase__btn book-showcase__btn--primary" onClick={startReading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Leer ahora
          </button>
          <a className="book-showcase__btn" href={BOOK.viewUrl} target="_blank" rel="noopener noreferrer">
            Abrir en pestaña nueva
          </a>
        </div>
      </div>

      {reading && <BookReader onClose={closeReader} />}
    </section>
  );
};

export default BookShowcase;
