import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Scene3D from './three/Scene3D';
import portada from '../assets/images/libro-sistema-reticular-hibrido.jpg';
import './BookShowcase.css';

// ===== BIBLIOTECA DIGITAL =====
// Libro 3D que se abre y muestra la publicación alojada en Adobe InDesign (Publish Online).

const BOOK = {
  title: 'Sistema reticular híbrido',
  subtitle: 'Retos de la docencia desde la mirada del pensamiento complejo',
  author: 'Una obra de la Dra. María del Socorro Guzmán Serna',
  description:
    'Una invitación a repensar la docencia, conectar saberes y abrir nuevas preguntas sobre la educación desde el pensamiento complejo.',
  cover: portada,
  viewUrl: 'https://indd.adobe.com/view/4553412d-83e2-4342-adb7-7d24730a8e65',
  embedUrl: 'https://indd.adobe.com/embed/4553412d-83e2-4342-adb7-7d24730a8e65?startpage=1&allowFullscreen=true',
};


/* Libro con CSS 3D para navegadores sin WebGL */
const CssBook = ({ onSelect }) => (
  <button className="css-book" onClick={onSelect} aria-label={`Abrir ${BOOK.title}`}>
    <span className="css-book__pages" />
    <span className="css-book__cover">
      <img src={BOOK.cover} alt={`Portada del libro ${BOOK.title}`} />
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
            <img src={BOOK.cover} alt="" />
            <div>
              <strong>{BOOK.title}</strong>
              <span>Dra. María del Socorro Guzmán Serna</span>
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
          coverImage={BOOK.cover}
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
          Sistema reticular <span className="text-shimmer">híbrido</span>
        </h2>
        <p className="book-showcase__subtitle" data-reveal style={{ '--reveal-delay': '160ms' }}>{BOOK.subtitle}</p>
        <p className="book-showcase__author" data-reveal style={{ '--reveal-delay': '220ms' }}>
          <span className="book-showcase__author-line" aria-hidden="true" />
          {BOOK.author}
        </p>
        <p className="book-showcase__desc" data-reveal style={{ '--reveal-delay': '280ms' }}>{BOOK.description}</p>

        <div className="book-showcase__actions" data-reveal style={{ '--reveal-delay': '340ms' }}>
          <button className="book-showcase__btn book-showcase__btn--primary" onClick={startReading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Leer el libro
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
