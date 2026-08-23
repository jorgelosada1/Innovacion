import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UniversidadesPage.css';
import andinaBanner from '../assets/images/andina.png';
import iberoBanner from '../assets/images/ibero.png';
import AsesoriaModal from '../components/AsesoriaModal';

/* ── SVG Icons (matching site's stroke style) ── */
const CheckShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
  </svg>
);
const Globe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
  </svg>
);
const Monitor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const Users = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const MapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const Cap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const Book = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const Headphones = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);
const FileCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/>
  </svg>
);

const UniversidadesPage = () => {
  const { uni } = useParams();
  const [activeTab, setActiveTab] = useState(uni === 'iberoamericana' ? 'iberoamericana' : 'areandina');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (uni === 'iberoamericana' || uni === 'areandina') setActiveTab(uni);
  }, [uni]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const isAreandina = activeTab === 'areandina';

  return (
    <div className="upage">
      {/* ─── HERO BANNER (same style as landing HeroBanner) ─── */}
      <section className="upage__hero">
        <div className="upage__hero-deco">
          <div className="upage__hero-circle upage__hero-circle--1"></div>
          <div className="upage__hero-circle upage__hero-circle--2"></div>
        </div>
        <div className="upage__hero-inner">
          <div className="upage__hero-badge">
            <span className="upage__hero-badge-dot"></span>
            UNIVERSIDADES ALIADAS
          </div>
          <h1 className="upage__hero-title">
            Nuestras{' '}
            <span className="upage__hero-accent">Universidades Aliadas</span>
          </h1>
          <p className="upage__hero-subtitle">
            Conoce en detalle la oferta institucional, calidad acreditada y beneficios
            de estudiar en nuestras universidades asociadas.
          </p>
          <div className="upage__tabs">
            <button
              className={`upage__tab ${isAreandina ? 'upage__tab--active' : ''}`}
              onClick={() => setActiveTab('areandina')}
            >
              <span className="upage__tab-dot upage__tab-dot--green"></span>
              Conoce Areandina →
            </button>
            <button
              className={`upage__tab ${!isAreandina ? 'upage__tab--active' : ''}`}
              onClick={() => setActiveTab('iberoamericana')}
            >
              <span className="upage__tab-dot upage__tab-dot--blue"></span>
              Conoce IBERO →
            </button>
          </div>
        </div>
        {/* Curved bottom just like HeroBanner */}
        <div className="upage__hero-curve">
          <svg viewBox="0 0 1440 140" fill="none" preserveAspectRatio="none">
            <path d="M0 140V100C240 20 480 0 720 20C960 40 1200 80 1440 100V140H0Z" fill="#f8f9fa"/>
          </svg>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <div className="upage__container">
        {/* ========= AREANDINA ========= */}
        {isAreandina && (
          <div className="upage__content" key="areandina">
            {/* Banner image — full, no crop */}
            <div className="upage__banner">
              <img src={andinaBanner} alt="Fundación Universitaria del Área Andina" />
            </div>

            {/* Quién es */}
            <section className="upage__section">
              <span className="upage__badge">Institución Aliada</span>
              <h2 className="upage__title">¿Quién es Areandina?</h2>
              <p className="upage__lead">Educación de calidad que llega a las regiones</p>
              <p className="upage__text">
                La Fundación Universitaria del Área Andina es una institución de educación superior con acreditación en alta calidad multicampus y más de 38 años de trayectoria. Su propuesta combina formación académica, inclusión, internacionalización y presencia regional.
              </p>
            </section>

            {/* Por qué estudiar */}
            <section className="upage__section">
              <span className="upage__badge">Ventajas</span>
              <h2 className="upage__title">¿Por qué estudiar en Areandina?</h2>
              <div className="upage__grid-3">
                <div className="upage__info-box">
                  <div className="upage__info-icon"><CheckShield /></div>
                  <h3>Alta Calidad</h3>
                  <p>Institución con acreditación en alta calidad multicampus.</p>
                </div>
                <div className="upage__info-box">
                  <div className="upage__info-icon"><Globe /></div>
                  <h3>Proyección Internacional</h3>
                  <p>Oportunidades de intercambio y relacionamiento con universidades del exterior.</p>
                </div>
                <div className="upage__info-box">
                  <div className="upage__info-icon"><Monitor /></div>
                  <h3>Educación Flexible</h3>
                  <p>Oferta académica virtual que permite estudiar desde diferentes lugares y compatibilizar la formación con otras responsabilidades.</p>
                </div>
              </div>
            </section>

            {/* Programas */}
            <section className="upage__section">
              <span className="upage__badge">Oferta Académica</span>
              <h2 className="upage__title">Programas Destacados</h2>
              <div className="upage__programs">
                <div className="upage__prog-card">
                  <div className="upage__prog-head upage__prog-head--areandina">
                    <Cap /> PREGRADOS
                  </div>
                  <div className="upage__prog-body">
                    Administración en Salud, Administración Pública, Licenciatura en Educación Infantil, Ingeniería de Sistemas, Ingeniería Industrial y Economía, entre otros.
                  </div>
                </div>
                <div className="upage__prog-card">
                  <div className="upage__prog-head upage__prog-head--areandina">
                    <Book /> POSGRADOS
                  </div>
                  <div className="upage__prog-body">
                    Pedagogía y Docencia, Auditoría en Salud, Alta Gerencia, Gerencia Financiera, Epidemiología e Innovación.
                  </div>
                </div>
              </div>
              <div className="upage__more-programs">
                <p>¿Te interesa conocer más programas? No son los únicos con los que contamos.</p>
                <a href="https://wa.link/rgw8yn" target="_blank" rel="noopener noreferrer" className="upage__btn upage__btn--areandina">
                  Escríbenos por WhatsApp <ChevronRight />
                </a>
              </div>
            </section>

            {/* Acompañamiento */}
            <section className="upage__section">
              <span className="upage__badge">Proceso</span>
              <h2 className="upage__title">¿Cómo te acompañamos?</h2>
              <p className="upage__lead">Tu proceso puede ser más sencillo</p>
              <div className="upage__steps">
                <div className="upage__step">
                  <div className="upage__step-icon"><Search /></div>
                  <span className="upage__step-num">01</span>
                  <h4>Encuentra tu programa</h4>
                  <p>Explora las opciones disponibles según tus intereses profesionales.</p>
                </div>
                <div className="upage__step">
                  <div className="upage__step-icon"><Headphones /></div>
                  <span className="upage__step-num">02</span>
                  <h4>Recibe asesoría personalizada</h4>
                  <p>Nuestro equipo te orienta sobre el programa, modalidad y proceso de ingreso.</p>
                </div>
                <div className="upage__step">
                  <div className="upage__step-icon"><FileCheck /></div>
                  <span className="upage__step-num">03</span>
                  <h4>Inicia tu proceso</h4>
                  <p>Te acompañamos durante la inscripción y matrícula.</p>
                </div>
              </div>
              <div className="upage__center">
                <button className="upage__btn upage__btn--areandina" onClick={() => setIsModalOpen(true)}>
                  Quiero recibir asesoría <ChevronRight />
                </button>
              </div>
            </section>

            {/* Centros */}
            <section className="upage__section">
              <span className="upage__badge">Cobertura</span>
              <h2 className="upage__title">Centros de Servicio Universitario</h2>
              <p className="upage__lead">Estamos más cerca de ti</p>
              <div className="upage__pills">
                {['Bogotá', 'Aguachica', 'Buenaventura', 'Leticia', 'San Gil'].map(c => (
                  <span key={c} className="upage__pill"><MapPin /> {c}</span>
                ))}
              </div>
              <div className="upage__center" style={{marginTop: '16px'}}>
                <a href="https://csu.com.co" target="_blank" rel="noopener noreferrer" className="upage__btn upage__btn--areandina">
                  Visitar CSU.com.co <ChevronRight />
                </a>
              </div>
            </section>

            {/* CTA Final */}
            <section className="upage__cta">
              <h2>¿Listo para dar el siguiente paso?</h2>
              <p>Conoce la oferta académica de Areandina, encuentra el programa que se adapta a tus objetivos y comienza tu proceso.</p>
              <div className="upage__cta-btns">
                <a href="https://wa.link/rgw8yn" target="_blank" rel="noopener noreferrer" className="upage__cta-btn upage__cta-btn--primary">
                  Hablar con un asesor
                </a>
                <a href="https://csu.com.co" target="_blank" rel="noopener noreferrer" className="upage__cta-btn upage__cta-btn--wa">
                  Visitar sitio web CSU
                </a>
              </div>
            </section>
          </div>
        )}

        {/* ========= IBERO ========= */}
        {!isAreandina && (
          <div className="upage__content" key="ibero">
            {/* Banner image — full, no crop */}
            <div className="upage__banner">
              <img src={iberoBanner} alt="Corporación Universitaria Iberoamericana" />
            </div>

            {/* Quién es */}
            <section className="upage__section">
              <span className="upage__badge upage__badge--ibero">Institución Aliada</span>
              <h2 className="upage__title">¿Quién es Iberoamericana?</h2>
              <p className="upage__lead">50 años transformando vidas a través de la educación</p>
              <p className="upage__text">
                La Corporación Universitaria Iberoamericana – IBERO es una institución de educación superior con Acreditación Institucional en Alta Calidad, otorgada por el Ministerio de Educación Nacional por seis años. Forma parte de Planeta Formación y Universidades, red internacional de educación superior de Grupo Planeta.
              </p>
            </section>

            {/* Por qué estudiar */}
            <section className="upage__section">
              <span className="upage__badge upage__badge--ibero">Pilares</span>
              <h2 className="upage__title">¿Por qué estudiar en IBERO?</h2>
              <div className="upage__grid-4">
                <div className="upage__info-box upage__info-box--ibero">
                  <div className="upage__info-icon upage__info-icon--ibero"><CheckShield /></div>
                  <h3>Alta Calidad</h3>
                  <p>Institución acreditada en Alta Calidad por el Ministerio de Educación Nacional.</p>
                </div>
                <div className="upage__info-box upage__info-box--ibero">
                  <div className="upage__info-icon upage__info-icon--ibero"><Monitor /></div>
                  <h3>Virtualidad</h3>
                  <p>Programas que permiten acceder a educación superior desde diferentes regiones del país.</p>
                </div>
                <div className="upage__info-box upage__info-box--ibero">
                  <div className="upage__info-icon upage__info-icon--ibero"><Globe /></div>
                  <h3>Internacionalización</h3>
                  <p>IBERO forma parte de Planeta Formación y Universidades, una red internacional de educación superior.</p>
                </div>
                <div className="upage__info-box upage__info-box--ibero">
                  <div className="upage__info-icon upage__info-icon--ibero"><Users /></div>
                  <h3>Inclusión</h3>
                  <p>La institución identifica inclusión, virtualidad e internacionalización como pilares de su modelo institucional.</p>
                </div>
              </div>
            </section>

            {/* Programas */}
            <section className="upage__section">
              <span className="upage__badge upage__badge--ibero">Oferta Académica</span>
              <h2 className="upage__title">Programas Destacados</h2>
              <div className="upage__programs">
                <div className="upage__prog-card">
                  <div className="upage__prog-head upage__prog-head--ibero">
                    <Cap /> PREGRADOS
                  </div>
                  <div className="upage__prog-body">
                    Administración de empresas, Administración Financiera, Licenciaturas, Ingenierías, Economía, entre otros.
                  </div>
                </div>
                <div className="upage__prog-card">
                  <div className="upage__prog-head upage__prog-head--ibero">
                    <Book /> POSGRADOS
                  </div>
                  <div className="upage__prog-body">
                    Pedagogía y Docencia, Auditoría en Salud, Alta Gerencia, Gerencia Financiera, Epidemiología e Innovación.
                  </div>
                </div>
              </div>
              <div className="upage__more-programs">
                <p>¿Te interesa conocer más programas? No son los únicos con los que contamos.</p>
                <a href="https://wa.link/rgw8yn" target="_blank" rel="noopener noreferrer" className="upage__btn upage__btn--ibero">
                  Escríbenos por WhatsApp <ChevronRight />
                </a>
              </div>
            </section>

            {/* Acompañamiento */}
            <section className="upage__section">
              <span className="upage__badge upage__badge--ibero">Proceso</span>
              <h2 className="upage__title">¿Cómo te acompañamos?</h2>
              <p className="upage__lead">Tu proceso puede ser más sencillo</p>
              <div className="upage__steps">
                <div className="upage__step upage__step--ibero">
                  <div className="upage__step-icon upage__step-icon--ibero"><Search /></div>
                  <span className="upage__step-num upage__step-num--ibero">01</span>
                  <h4>Encuentra tu programa</h4>
                  <p>Explora las opciones disponibles según tus intereses profesionales.</p>
                </div>
                <div className="upage__step upage__step--ibero">
                  <div className="upage__step-icon upage__step-icon--ibero"><Headphones /></div>
                  <span className="upage__step-num upage__step-num--ibero">02</span>
                  <h4>Recibe asesoría personalizada</h4>
                  <p>Nuestro equipo te orienta sobre el programa, modalidad y proceso de ingreso.</p>
                </div>
                <div className="upage__step upage__step--ibero">
                  <div className="upage__step-icon upage__step-icon--ibero"><FileCheck /></div>
                  <span className="upage__step-num upage__step-num--ibero">03</span>
                  <h4>Inicia tu proceso</h4>
                  <p>Te acompañamos durante la inscripción y matrícula.</p>
                </div>
              </div>
              <div className="upage__center">
                <button className="upage__btn upage__btn--ibero" onClick={() => setIsModalOpen(true)}>
                  Quiero recibir asesoría <ChevronRight />
                </button>
              </div>
            </section>

            {/* Centros */}
            <section className="upage__section">
              <span className="upage__badge upage__badge--ibero">Cobertura</span>
              <h2 className="upage__title">Centros de Experiencia Ibero</h2>
              <p className="upage__lead">Estamos más cerca de ti</p>
              <div className="upage__pills">
                {['Boyacá'].map(c => (
                  <span key={c} className="upage__pill upage__pill--ibero"><MapPin /> {c}</span>
                ))}
              </div>
              <div className="upage__map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.0!2d-73.3623!3d5.5353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzInMDcuMSJOIDczwrAyMSc0NC4zIlc!5e0!3m2!1ses!2sco"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '16px', marginTop: '20px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Centro Ibero Boyacá - Carrera 10 #14-66"
                />
              </div>
            </section>

            {/* CTA Final */}
            <section className="upage__cta upage__cta--ibero">
              <h2>¿Listo para dar el siguiente paso?</h2>
              <p>Conoce la oferta académica de la Iberoamericana, encuentra el programa que se adapta a tus objetivos y comienza tu proceso.</p>
              <div className="upage__cta-btns">
                <a href="https://wa.link/rgw8yn" target="_blank" rel="noopener noreferrer" className="upage__cta-btn upage__cta-btn--primary-ibero">
                  Hablar con un asesor
                </a>
              </div>
            </section>
          </div>
        )}
      </div>

      <AsesoriaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UniversidadesPage;
