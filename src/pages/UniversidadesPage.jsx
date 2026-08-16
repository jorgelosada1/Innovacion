import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './UniversidadesPage.css';

const UniversidadesPage = () => {
  const { uni } = useParams();
  const [activeTab, setActiveTab] = useState(uni === 'iberoamericana' ? 'iberoamericana' : 'areandina');

  useEffect(() => {
    if (uni === 'iberoamericana' || uni === 'areandina') {
      setActiveTab(uni);
    }
  }, [uni]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="universidades-page">
      <section className="universidades-hero">
        <div className="universidades-hero__content">
          <span className="universidades-hero__badge">Alianzas de Excelencia</span>
          <h1 className="universidades-hero__title">
            Nuestras <em className="universidades-hero__title-accent">Universidades Aliadas</em>
          </h1>
          <p className="universidades-hero__subtitle">
            Conoce en detalle la oferta institucional, calidad acreditada y beneficios de estudiar en nuestras universidades asociadas.
          </p>

          <div className="universidades-tabs">
            <button
              className={`universidades-tab ${activeTab === 'areandina' ? 'universidades-tab--active' : ''}`}
              onClick={() => setActiveTab('areandina')}
            >
              <span className="universidades-tab__dot universidades-tab__dot--areandina"></span>
              Fundación Universitaria del Área Andina
            </button>
            <button
              className={`universidades-tab ${activeTab === 'iberoamericana' ? 'universidades-tab--active' : ''}`}
              onClick={() => setActiveTab('iberoamericana')}
            >
              <span className="universidades-tab__dot universidades-tab__dot--ibero"></span>
              Corporación Universitaria Iberoamericana
            </button>
          </div>
        </div>
      </section>

      <div className="universidades-container">
        {activeTab === 'areandina' && (
          <div className="uni-detail-card uni-detail-card--areandina">
            <div className="uni-detail-header">
              <div className="uni-badge-tag uni-badge-tag--areandina">Acreditada en Alta Calidad</div>
              <h2 className="uni-detail-title">Fundación Universitaria del Área Andina</h2>
              <p className="uni-detail-tagline">
                Educación superior inclusiva, moderna y con presencia en todo el territorio colombiano.
              </p>
            </div>

            <div className="uni-detail-grid">
              <div className="uni-info-box">
                <div className="uni-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3>Modalidades de Estudio</h3>
                <p>Virtual y Presencial con flexibilidad de horarios para estudiantes y trabajadores.</p>
              </div>

              <div className="uni-info-box">
                <div className="uni-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <h3>Acompañamiento 1 a 1</h3>
                <p>Tutoría personalizada, seguimiento constante y apoyo en tu proceso de adaptación.</p>
              </div>

              <div className="uni-info-box">
                <div className="uni-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>Acreditación y Prestigio</h3>
                <p>Reacreditación Institucional de Alta Calidad otorgada por el Ministerio de Educación Nacional.</p>
              </div>

              <div className="uni-info-box">
                <div className="uni-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3>Centros CSU</h3>
                <p>Sedes y Centros de Servicio Universitario en Galán, Aguachica, Buenaventura, Leticia, Sangil y más.</p>
              </div>
            </div>

            <div className="uni-features-list">
              <h3>Principales Beneficios</h3>
              <ul>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Plataformas tecnológicas de última generación para clases en vivo y grabadas.
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Amplia oferta en carreras profesionales, tecnológicas y posgrados en diversas áreas.
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Múltiples opciones de becas, homologación y facilidades de pago directo.
                </li>
              </ul>
            </div>

            <div className="uni-actions">
              <Link to="/cursos" className="uni-btn uni-btn--primary">
                Ver Programas de Areandina
              </Link>
              <a href="https://wa.link/rgw8yn" target="_blank" rel="noopener noreferrer" className="uni-btn uni-btn--whatsapp">
                Solicitar Asesoría Personalizada
              </a>
            </div>
          </div>
        )}

        {activeTab === 'iberoamericana' && (
          <div className="uni-detail-card uni-detail-card--ibero">
            <div className="uni-detail-header">
              <div className="uni-badge-tag uni-badge-tag--ibero">Más de 40 Años de Excelencia</div>
              <h2 className="uni-detail-title">Corporación Universitaria Iberoamericana</h2>
              <p className="uni-detail-tagline">
                Innovación educativa, inclusión social y alta flexibilidad para formar los líderes del futuro.
              </p>
            </div>

            <div className="uni-detail-grid">
              <div className="uni-info-box">
                <div className="uni-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="14" x="2" y="3" rx="2"/>
                    <line x1="8" x2="16" y1="21" y2="21"/>
                    <line x1="12" x2="12" y1="17" y2="21"/>
                  </svg>
                </div>
                <h3>Educación 100% Virtual</h3>
                <p>Plataforma intuitiva diseñada para estudiar a tu ritmo desde cualquier lugar del país.</p>
              </div>

              <div className="uni-info-box">
                <div className="uni-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>Líderes en Inclusión</h3>
                <p>Especialistas en pedagogía, psicología, educación especial y programas empresariales de alto impacto.</p>
              </div>

              <div className="uni-info-box">
                <div className="uni-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                    <line x1="2" x2="22" y1="10" y2="10"/>
                  </svg>
                </div>
                <h3>Facilidades de Financiación</h3>
                <p>Opciones de pago accesibles, convenios y valores de matrícula altamente competitivos.</p>
              </div>

              <div className="uni-info-box">
                <div className="uni-info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3>Centros CEI</h3>
                <p>Presencia con Centros de Educación Iberoamericana en Bogotá y Boyacá.</p>
              </div>
            </div>

            <div className="uni-features-list">
              <h3>Principales Beneficios</h3>
              <ul>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Modelo pedagógico centrado en el desarrollo humano, habilidades prácticas y la empleabilidad.
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Planta docente calificada con amplia experiencia laboral y académica.
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Acompañamiento personalizado desde la asesoría vocacional hasta la homologación.
                </li>
              </ul>
            </div>

            <div className="uni-actions">
              <Link to="/cursos" className="uni-btn uni-btn--ibero-primary">
                Ver Programas de Iberoamericana
              </Link>
              <a href="https://wa.link/rgw8yn" target="_blank" rel="noopener noreferrer" className="uni-btn uni-btn--whatsapp">
                Solicitar Asesoría Personalizada
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversidadesPage;
