import { useState, useEffect } from 'react';
import { getCursos } from '../utils/dataManager';
import './CursosPage.css';

const CursosPage = () => {
  const [cursosData, setCursosData] = useState([]);

  useEffect(() => {
    setCursosData(getCursos());
  }, []);

  return (
    <section className="cursos-page">
      <div className="cursos-page__hero">
        <div className="cursos-page__hero-content">
          <span className="cursos-page__badge">Formación Empresarial</span>
          <h1 className="cursos-page__title">
            Nuestros <em className="cursos-page__title-accent">Cursos</em>
          </h1>
          <p className="cursos-page__subtitle">
            Fortalece tus habilidades profesionales con nuestra oferta de cursos de formación empresarial.
          </p>
        </div>
      </div>

      <div className="cursos-page__container">
        <div className="cursos-page__grid">
          {cursosData.map((curso) => (
            <div key={curso.id} className="curso-card">
              {/* Video */}
              <div className="curso-card__video">
                <iframe
                  src={`https://www.youtube.com/embed/${curso.videoId}`}
                  title={curso.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="curso-card__iframe"
                ></iframe>
              </div>

              {/* Content */}
              <div className="curso-card__body">
                <div className="curso-card__meta">
                  <span className={`curso-card__nivel curso-card__nivel--${curso.nivel.toLowerCase()}`}>
                    {curso.nivel}
                  </span>
                  <span className="curso-card__duracion">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {curso.duracion}
                  </span>
                </div>

                <h3 className="curso-card__titulo">{curso.titulo}</h3>
                <p className="curso-card__descripcion">{curso.descripcion}</p>

                {/* Topics */}
                {curso.temas && curso.temas.length > 0 && (
                  <div className="curso-card__temas">
                    <h4 className="curso-card__temas-title">Contenido del curso</h4>
                    <ul className="curso-card__temas-list">
                      {curso.temas.map((tema, i) => (
                        <li key={i} className="curso-card__tema">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          {tema}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action */}
                <div className="curso-card__actions">
                  <a href={`https://www.youtube.com/watch?v=${curso.videoId}`} target="_blank" rel="noopener noreferrer" className="curso-card__btn curso-card__btn--primary">
                    Iniciar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CursosPage;
