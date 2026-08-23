import { useState, useEffect } from 'react';
import { getCursos } from '../utils/dataManager';
import PasswordModal from '../components/PasswordModal';
import './CursosPage.css';

const CursosPage = () => {
  const [cursosData, setCursosData] = useState([]);
  const [activeTab, setActiveTab] = useState('cursos');
  const [showPwModal, setShowPwModal] = useState(false);
  const [pendingVideoUrl, setPendingVideoUrl] = useState('');

  useEffect(() => {
    setCursosData(getCursos());
  }, []);

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
      <div className="cursos-page__hero">
        <div className="cursos-page__hero-content">
          <span className="cursos-page__badge">Formación y Desarrollo</span>
          <h1 className="cursos-page__title">
            <em className="cursos-page__title-accent">Aprende Aquí</em>
          </h1>
          <p className="cursos-page__subtitle">
            Fortalece tus habilidades profesionales con nuestra oferta de cursos y capacitaciones.
          </p>

          {/* Tabs */}
          <div className="cursos-page__tabs">
            <button
              className={`cursos-page__tab ${activeTab === 'cursos' ? 'cursos-page__tab--active' : ''}`}
              onClick={() => setActiveTab('cursos')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              Cursos
            </button>
            <button
              className={`cursos-page__tab ${activeTab === 'capacitaciones' ? 'cursos-page__tab--active' : ''}`}
              onClick={() => setActiveTab('capacitaciones')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Capacitaciones
            </button>
          </div>
        </div>
      </div>

      <div className="cursos-page__container">
        {/* Cursos Tab */}
        {activeTab === 'cursos' && (
          <div className="cursos-page__grid" key="cursos">
            {cursosData.map((curso) => (
              <div key={curso.id} className="curso-card">
                {/* Video preview */}
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

                  {/* Action - Password protected */}
                  <div className="curso-card__actions">
                    <button onClick={() => handleCursoClick(curso.videoId)} className="curso-card__btn curso-card__btn--primary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Iniciar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Capacitaciones Tab */}
        {activeTab === 'capacitaciones' && (
          <div className="cursos-page__empty" key="capacitaciones">
            <div className="cursos-page__empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Capacitaciones</h3>
            <p>Próximamente estarán disponibles nuestras capacitaciones internas.</p>
            <span className="cursos-page__empty-tag">En construcción</span>
          </div>
        )}
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
