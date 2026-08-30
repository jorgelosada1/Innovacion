import { useState, useEffect } from 'react';
import './ColaboradoresPage.css';
import fernanImg from '../assets/images/Fernan.png';
import wilsonImg from '../assets/images/wilson.png';
import johannaImg from '../assets/images/Johanna.JPG';
import mariaImg from '../assets/images/Maria.png';
import img10 from '../assets/images/10.png';
import img20 from '../assets/images/20.png';
import img30 from '../assets/images/30.png';
import PasswordModal from '../components/PasswordModal';

const ColaboradoresPage = () => {
  const [commentIndex, setCommentIndex] = useState(0);

  const comments = [
    { 
      text: 'Trabajar en Innovación e-Learning me ha permitido crecer profesionalmente en un ambiente de constante aprendizaje y colaboración.', 
      name: 'Colaborador', 
      role: 'Equipo Comercial',
      photo: img10
    },
    { 
      text: 'Me encanta la cultura de equipo que tenemos. Cada día es una oportunidad para innovar y aportar al cambio educativo en Colombia.', 
      name: 'Colaboradora', 
      role: 'Área de Gestión',
      photo: img20
    },
    { 
      text: 'Aquí valoran nuestras ideas y nos dan las herramientas para hacer la diferencia en la educación superior del país.', 
      name: 'Colaborador', 
      role: 'Liderazgo Comercial',
      photo: img30
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCommentIndex((prev) => (prev + 1) % comments.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [comments.length]);

  const [showDocModal, setShowDocModal] = useState(false);
  const [pendingDoc, setPendingDoc] = useState(null);

  const documents = [
    { id: 1, name: 'Reglamento Interno', icon: 'file' },
    { id: 2, name: 'Manual de Convivencia', icon: 'file' },
    { id: 3, name: 'Políticas de Empresa', icon: 'file' },
    { id: 4, name: 'Código de Ética', icon: 'file' },
  ];

  const handleDocClick = (doc) => {
    setPendingDoc(doc);
    setShowDocModal(true);
  };

  const handleDocAccess = () => {
    alert(`Documento "${pendingDoc?.name}" - Próximamente disponible`);
    setShowDocModal(false);
  };

  return (
    <section className="colaboradores">
      <div className="colaboradores__hero">
        <div className="colaboradores__hero-content">
          <span className="colaboradores__badge">Nuestro equipo</span>
          <h1 className="colaboradores__title">
            Nuestros <em className="colaboradores__title-accent">Colaboradores</em>
          </h1>
          <p className="colaboradores__subtitle">
            Conoce la estructura organizacional que hace posible tu acceso a la educación superior de calidad.
          </p>
        </div>
      </div>

      <div className="colaboradores__container">
        <div className="org">
          {/* === NIVEL 1: CEO (CENTRO) === */}
          <div className="org__level org__level--ceo">
            <div className="org__card org__card--ceo">
              <span className="org__badge org__badge--blue">Gerente General</span>
              <div className="org__avatar">
                <img src={fernanImg} alt="Fernan" className="org__avatar-img" />
              </div>
              <h3 className="org__name">Fernan</h3>
              <p className="org__role">Gerente General</p>
            </div>
          </div>

          <div className="org__line-v org__line-v--short"></div>

          {/* === NIVEL 2: EQUIPO DIRECTIVO Y OPERATIVO === */}
          <div className="org__level org__level--execs">
            {/* Wilson */}
            <div className="org__exec-group">
              <div className="org__line-v org__line-v--tiny"></div>
              <div className="org__card org__card--coo">
                <span className="org__badge org__badge--blue">Gestión Humana</span>
                <div className="org__avatar">
                  <img src={wilsonImg} alt="Wilson" className="org__avatar-img" />
                </div>
                <h3 className="org__name">Wilson</h3>
                <p className="org__role">Gestión Humana</p>
              </div>
            </div>

            {/* Johanna */}
            <div className="org__exec-group">
              <div className="org__line-v org__line-v--tiny"></div>
              <div className="org__card org__card--coo">
                <span className="org__badge org__badge--blue">Gerente Comercial</span>
                <div className="org__avatar">
                  <img src={johannaImg} alt="Johanna" className="org__avatar-img" />
                </div>
                <h3 className="org__name">Johanna</h3>
                <p className="org__role">Gerente Comercial</p>
              </div>
            </div>

            {/* María del Socorro */}
            <div className="org__exec-group">
              <div className="org__line-v org__line-v--tiny"></div>
              <div className="org__card org__card--coo">
                <span className="org__badge org__badge--blue">Nuevos Proyectos</span>
                <div className="org__avatar">
                  <img src={mariaImg} alt="María del Socorro" className="org__avatar-img" />
                </div>
                <h3 className="org__name">María del Socorro</h3>
                <p className="org__role">Nuevos Proyectos</p>
              </div>
            </div>
          </div>

          <div className="org__line-v org__line-v--medium"></div>

          {/* === NIVEL 3: Areas & Comentarios === */}
          <div className="org__level org__level--areas">
            {/* 1. Área Comercial Branch */}
            <div className="org__area-group org__area-group--comercial">
              <div className="org__line-v org__line-v--tiny"></div>
              <div className="org__card org__card--area">
                <div className="org__area-icon org__area-icon--neutral">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="org__area-name">Área Comercial</h3>
                </div>
              </div>

              <div className="org__line-v org__line-v--tiny"></div>

              {/* Sub-grid for Universities */}
              <div className="org__sub-grid">
                {/* Iberoamericana */}
                <div className="org__sub-group">
                  <div className="org__line-v org__line-v--tiny"></div>
                  <div className="org__card org__card--uni org__card--ibero">
                    <div className="org__uni-header org__uni-header--blue">
                      <h3 className="org__uni-title">Iberoamericana</h3>
                      <span className="org__uni-sub">Comercial</span>
                    </div>
                    <div className="org__uni-body">
                      <div className="org__uni-row">
                        <div className="org__uni-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                        </div>
                        <div>
                          <p className="org__uni-role-name">Líder Comercial</p>
                          <p className="org__uni-role-desc">Supervisión de equipos</p>
                        </div>
                        <div className="org__uni-check">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                      </div>
                      <div className="org__uni-row">
                        <div className="org__uni-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <div>
                          <p className="org__uni-role-name">Equipo Comercial</p>
                          <p className="org__uni-role-desc">Asesores y ejecutivos</p>
                        </div>
                      </div>
                      <div className="org__uni-row">
                        <div className="org__uni-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div>
                          <p className="org__uni-role-name">Depuradoras</p>
                          <p className="org__uni-role-desc">Verificación y calidad de datos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Areandina */}
                <div className="org__sub-group">
                  <div className="org__line-v org__line-v--tiny"></div>
                  <div className="org__card org__card--uni org__card--areandina">
                    <div className="org__uni-header org__uni-header--blue">
                      <h3 className="org__uni-title">Areandina</h3>
                      <span className="org__uni-sub">Comercial</span>
                    </div>
                    <div className="org__uni-body">
                      <div className="org__uni-row">
                        <div className="org__uni-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                        </div>
                        <div>
                          <p className="org__uni-role-name">Coordinadora</p>
                          <p className="org__uni-role-desc">Estrategia y gestión</p>
                        </div>
                        <div className="org__uni-check org__uni-check--yellow">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                      </div>
                      <div className="org__uni-row">
                        <div className="org__uni-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                        </div>
                        <div>
                          <p className="org__uni-role-name">Líderes Comerciales</p>
                          <p className="org__uni-role-desc">Supervisión de equipos</p>
                        </div>
                      </div>
                      <div className="org__uni-row">
                        <div className="org__uni-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <div>
                          <p className="org__uni-role-name">Equipo Comercial</p>
                          <p className="org__uni-role-desc">Asesores y ejecutivos</p>
                        </div>
                      </div>
                      <div className="org__uni-row">
                        <div className="org__uni-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div>
                          <p className="org__uni-role-name">Depuradoras</p>
                          <p className="org__uni-role-desc">Verificación y calidad de datos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Support Container (Support Cards Row + Employee Comments in Empty Space) */}
            <div className="org__support-container">
              <div className="org__support-cards-row">
                {/* Talento Humano */}
                <div className="org__area-group">
                  <div className="org__line-v org__line-v--tiny"></div>
                  <div className="org__card org__card--support">
                    <div className="org__support-icon org__support-icon--blue">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                    </div>
                    <div>
                      <p className="org__support-name">Talento Humano</p>
                      <p className="org__support-desc">Área de soporte</p>
                    </div>
                  </div>
                </div>

                {/* Mercadeo */}
                <div className="org__area-group">
                  <div className="org__line-v org__line-v--tiny"></div>
                  <div className="org__card org__card--support">
                    <div className="org__support-icon org__support-icon--yellow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    </div>
                    <div>
                      <p className="org__support-name">Mercadeo</p>
                      <p className="org__support-desc">Área de soporte</p>
                    </div>
                  </div>
                </div>

                {/* Contabilidad */}
                <div className="org__area-group">
                  <div className="org__line-v org__line-v--tiny"></div>
                  <div className="org__card org__card--support">
                    <div className="org__support-icon org__support-icon--green">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    </div>
                    <div>
                      <p className="org__support-name">Contabilidad</p>
                      <p className="org__support-desc">Área de soporte</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* === SLEEK EMPLOYEE COMMENTS CARD IN ORGANIGRAMA EMPTY SPACE === */}
              <div className="emp-comments-card">
                <div className="emp-comments-card__header">
                  <div className="emp-comments-card__badge">
                    <span className="emp-comments-card__dot"></span>
                    Nuestra Cultura
                  </div>
                  <h3 className="emp-comments-card__title">Voces del Equipo</h3>
                </div>

                <div className="emp-comments-card__slider">
                  {comments.map((comment, i) => (
                    <div
                      key={i}
                      className={`emp-comments-card__slide ${i === commentIndex ? 'emp-comments-card__slide--active' : ''}`}
                    >
                      <div className="emp-comments-card__user">
                        <div className="emp-comments-card__avatar">
                          {comment.photo ? (
                            <img src={comment.photo} alt={comment.name} className="emp-comments-card__avatar-img" />
                          ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                              <circle cx="12" cy="7" r="4"/>
                            </svg>
                          )}
                        </div>
                        <div className="emp-comments-card__info">
                          <h4 className="emp-comments-card__name">{comment.name}</h4>
                          <span className="emp-comments-card__role">{comment.role}</span>
                        </div>
                      </div>

                      <div className="emp-comments-card__body">
                        <svg className="emp-comments-card__quote-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609L9.978 5.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z"/>
                        </svg>
                        <p className="emp-comments-card__text">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="emp-comments-card__footer">
                  <div className="emp-comments-card__dots">
                    {comments.map((_, i) => (
                      <button
                        key={i}
                        className={`emp-comments-card__dot ${i === commentIndex ? 'emp-comments-card__dot--active' : ''}`}
                        onClick={() => setCommentIndex(i)}
                        aria-label={`Ver comentario ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* === DOCUMENTOS IMPORTANTES === */}
        <div className="docs-section">
          <div className="docs-section__header">
            <span className="colaboradores__badge">Recursos Internos</span>
            <h2 className="colaboradores__section-title">Documentos Importantes</h2>
            <p className="docs-section__desc">Accede a los documentos corporativos de la organización.</p>
          </div>
          <div className="docs-section__grid">
            {documents.map((doc) => (
              <button key={doc.id} className="docs-section__card" onClick={() => handleDocClick(doc)}>
                <div className="docs-section__card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <span className="docs-section__card-name">{doc.name}</span>
                <span className="docs-section__card-lock">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>

        <PasswordModal
          isOpen={showDocModal}
          onClose={() => setShowDocModal(false)}
          onSuccess={handleDocAccess}
          title="Documentos Importantes"
          message="Ingresa la contraseña para acceder a los documentos"
        />
      </div>
    </section>
  );
};

export default ColaboradoresPage;
