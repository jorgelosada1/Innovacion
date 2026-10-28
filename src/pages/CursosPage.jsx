import { useState } from 'react';
import { getCursos } from '../utils/dataManager';
import PasswordModal from '../components/PasswordModal';
import BookShowcase from '../components/BookShowcase';
import campusLogo from '../assets/images/campus-innovacion-blanco.png';
import campusEmblema from '../assets/images/campus-emblema.png';
import './CursosPage.css';

const Icon = ({ children, size = 18, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const HIGHLIGHTS = [
  { label: 'Cursos en video', icon: <><rect x="2" y="5" width="15" height="14" rx="2" /><path d="m17 10 5-3v10l-5-3z" /></> },
  { label: 'Aprende a tu ritmo', icon: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></> },
  { label: 'Biblioteca digital', icon: <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" /> },
];

/* Video del curso: muestra la portada y carga YouTube solo al darle play */
const CourseVideo = ({ videoId, title }) => {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="course-card__iframe"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button className="course-card__poster" onClick={() => setPlaying(true)} aria-label={`Ver la presentación de ${title}`}>
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <span className="course-card__play">
        <Icon size={30} strokeWidth={0}><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" /></Icon>
      </span>
      <span className="course-card__poster-label">Ver presentación</span>
    </button>
  );
};

const CourseCard = ({ curso, index, onStart }) => (
  <article className={`course-card ${index % 2 ? 'course-card--reverse' : ''}`} data-reveal>
    <div className="course-card__media">
      <CourseVideo videoId={curso.videoId} title={curso.titulo} />
    </div>

    <div className="course-card__body">
      <div className="course-card__meta">
        <span className={`course-card__level course-card__level--${(curso.nivel || '').toLowerCase()}`}>{curso.nivel}</span>
        {curso.duracion && (
          <span className="course-card__chip">
            <Icon size={14}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></Icon>
            {curso.duracion}
          </span>
        )}
        {curso.temas?.length > 0 && (
          <span className="course-card__chip">
            <Icon size={14}><path d="M4 6h16M4 12h16M4 18h10" /></Icon>
            {curso.temas.length} módulos
          </span>
        )}
        {curso.evaluacion && (
          <span className="course-card__chip">
            <Icon size={14}><path d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9" /></Icon>
            Con evaluación
          </span>
        )}
      </div>

      <h3 className="course-card__title">{curso.titulo}</h3>
      <p className="course-card__desc">{curso.descripcion}</p>

      {curso.temas?.length > 0 && (
        <div className="course-card__modules">
          <p className="course-card__modules-title">Contenido del curso</p>
          <ol>
            {curso.temas.map((tema, i) => (
              <li key={tema}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {tema}
              </li>
            ))}
          </ol>
        </div>
      )}

      <button className="course-card__cta" onClick={() => onStart(curso.videoId)}>
        <Icon size={16}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>
        Iniciar curso
        <Icon size={16} strokeWidth={2.5}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>
      </button>
    </div>
  </article>
);

const CursosPage = () => {
  const [cursosData] = useState(() => getCursos());
  const [activeTab, setActiveTab] = useState('cursos');
  const [showPwModal, setShowPwModal] = useState(false);
  const [pendingVideoUrl, setPendingVideoUrl] = useState('');

  const handleCursoClick = (videoId) => {
    setPendingVideoUrl(`https://www.youtube.com/watch?v=${videoId}`);
    setShowPwModal(true);
  };

  const handlePasswordSuccess = () => {
    window.open(pendingVideoUrl, '_blank');
    setShowPwModal(false);
  };

  return (
    <section className="cursos-page">
      {/* === PORTADA CAMPUS INNOVACIÓN === */}
      <header className="campus-hero">
        <div className="campus-hero__grid" aria-hidden="true" />
        <div className="campus-hero__orb campus-hero__orb--1" aria-hidden="true" />
        <div className="campus-hero__orb campus-hero__orb--2" aria-hidden="true" />

        <div className="campus-hero__inner">
          <span className="campus-hero__badge">
            <span className="campus-hero__badge-dot" />
            Aprende Aquí · Formación y desarrollo
          </span>
          <h1 className="campus-hero__logo">
            <img src={campusLogo} alt="Campus Innovación — Escuela de Formación Comercial. Formamos talento, transformamos resultados." />
          </h1>
          <p className="campus-hero__subtitle">
            Fortalece tus habilidades profesionales con nuestros cursos, capacitaciones y material de estudio.
          </p>
          <ul className="campus-hero__highlights">
            {HIGHLIGHTS.map((h) => (
              <li key={h.label}>
                <Icon>{h.icon}</Icon>
                {h.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="campus-hero__curve" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0 80V40C360 0 1080 0 1440 40V80Z" /></svg>
        </div>
      </header>

      <div className="cursos-page__container">
        {/* Biblioteca digital: libro 3D */}
        <BookShowcase />

        {/* === RUTA DE APRENDIZAJE === */}
        <section className="learn" aria-labelledby="learn-title">
          <div className="learn__head" data-reveal>
            <img src={campusEmblema} alt="" className="learn__emblem" />
            <div>
              <span className="learn__chip">Campus Innovación</span>
              <h2 id="learn-title" className="learn__title">
                Tu ruta de <span className="text-shimmer">aprendizaje</span>
              </h2>
              <p className="learn__desc">Elige un curso, mira su presentación y comienza cuando quieras.</p>
            </div>
          </div>

          <div className="learn__tabs" role="tablist" aria-label="Tipo de formación" data-reveal>
            <button
              role="tab"
              aria-selected={activeTab === 'cursos'}
              className={`learn__tab ${activeTab === 'cursos' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('cursos')}
            >
              <Icon><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></Icon>
              Cursos disponibles
              <span className="learn__tab-count">{cursosData.length}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'capacitaciones'}
              className={`learn__tab ${activeTab === 'capacitaciones' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('capacitaciones')}
            >
              <Icon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></Icon>
              Capacitaciones
              <span className="learn__tab-pill">Pronto</span>
            </button>
          </div>

          {activeTab === 'cursos' && (
            <div className="learn__panel" key="cursos" role="tabpanel">
              {cursosData.length > 0 ? (
                <div className="learn__courses">
                  {cursosData.map((curso, i) => (
                    <CourseCard key={curso.id} curso={curso} index={i} onStart={handleCursoClick} />
                  ))}
                </div>
              ) : (
                <p className="learn__empty-text">Muy pronto publicaremos nuevos cursos.</p>
              )}
            </div>
          )}

          {activeTab === 'capacitaciones' && (
            <div className="learn__panel" key="capacitaciones" role="tabpanel">
              <div className="soon">
                <div className="soon__emblem">
                  <span className="soon__ring" />
                  <img src={campusEmblema} alt="" />
                </div>
                <span className="soon__chip">En construcción</span>
                <h3>Capacitaciones internas</h3>
                <p>Estamos preparando las capacitaciones de la Escuela de Formación Comercial para el equipo INNE. Muy pronto las encontrarás aquí.</p>
                <div className="soon__progress" aria-hidden="true"><span /></div>
              </div>
            </div>
          )}
        </section>
      </div>

      <PasswordModal
        isOpen={showPwModal}
        onClose={() => setShowPwModal(false)}
        onSuccess={handlePasswordSuccess}
        title="Acceso a Cursos"
        message="Ingresa la contraseña para acceder al contenido"
      />
    </section>
  );
};

export default CursosPage;
