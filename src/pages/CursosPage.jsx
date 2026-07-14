import { useState } from 'react';
import './CursosPage.css';

const cursosData = [
  {
    id: 1,
    titulo: 'Liderazgo Efectivo',
    descripcion: 'Desarrolla habilidades de liderazgo para gestionar equipos de alto rendimiento y tomar decisiones estratégicas.',
    videoId: 'dQw4w9WgXcQ',
    duracion: '4 semanas',
    nivel: 'Intermedio',
    temas: ['Comunicación asertiva', 'Toma de decisiones', 'Gestión de conflictos', 'Motivación de equipos'],
    evaluacion: true,
  },
  {
    id: 2,
    titulo: 'Inducción Comercial y Ventas',
    descripcion: 'Aprende las técnicas de venta consultiva, manejo de objeciones y cierre de negocios en el sector educativo.',
    videoId: 'dQw4w9WgXcQ',
    duracion: '3 semanas',
    nivel: 'Básico',
    temas: ['Técnicas de venta', 'Manejo de objeciones', 'Cierre de ventas', 'Servicio al cliente'],
    evaluacion: true,
  },
  {
    id: 3,
    titulo: 'Comunicación Corporativa',
    descripcion: 'Domina las estrategias de comunicación interna y externa para representar la marca con profesionalismo.',
    videoId: 'dQw4w9WgXcQ',
    duracion: '2 semanas',
    nivel: 'Básico',
    temas: ['Comunicación verbal', 'Presentaciones efectivas', 'Redacción profesional', 'Manejo de redes'],
    evaluacion: false,
  },
  {
    id: 4,
    titulo: 'Gestión del Tiempo y Productividad',
    descripcion: 'Optimiza tu jornada laboral con metodologías probadas de gestión del tiempo y productividad personal.',
    videoId: 'dQw4w9WgXcQ',
    duracion: '2 semanas',
    nivel: 'Básico',
    temas: ['Método Pomodoro', 'Matriz de Eisenhower', 'Planificación semanal', 'Eliminación de distractores'],
    evaluacion: true,
  },
];

const CursosPage = () => {
  const [activeCurso, setActiveCurso] = useState(null);

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
              {/* Video thumbnail */}
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

                {/* Actions */}
                <div className="curso-card__actions">
                  <a href="#contacto-form" className="curso-card__btn curso-card__btn--primary">
                    Iniciar
                  </a>
                  {curso.evaluacion && (
                    <button
                      className="curso-card__btn curso-card__btn--outline"
                      onClick={() => setActiveCurso(activeCurso === curso.id ? null : curso.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      Evaluación
                    </button>
                  )}
                </div>
              </div>

              {/* Evaluation panel */}
              {activeCurso === curso.id && (
                <div className="curso-card__eval">
                  <div className="curso-card__eval-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <h4>Evaluación - {curso.titulo}</h4>
                  </div>
                  <p className="curso-card__eval-info">
                    La evaluación estará disponible una vez completes el contenido del curso. Deberás aprobar con un mínimo del 70%.
                  </p>
                  <div className="curso-card__eval-status">
                    <span className="curso-card__eval-tag">Pendiente</span>
                    <span className="curso-card__eval-req">Mínimo: 70%</span>
                  </div>
                  <button className="curso-card__btn curso-card__btn--disabled" disabled>
                    Iniciar evaluación
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CursosPage;
