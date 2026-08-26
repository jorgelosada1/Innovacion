import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UniversidadesPage.css';
import andinaBanner from '../assets/images/andina.png';
import iberoBanner from '../assets/images/ibero.png';
import AsesoriaModal from '../components/AsesoriaModal';

/* ─── Icons ─── */
const Shield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
  </svg>
);
const Globe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>
  </svg>
);
const Monitor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const Users = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const Award = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>
);
const BookOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const Phone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.91-1.17a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const WA = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* ─── Areandina Page Component ─── */
const AreandinaContent = ({ onOpenModal }) => {
  const wa = "https://wa.me/573144377691?text=Hola,%20quisiera%20recibir%20asesor%C3%ADa%20sobre%20Areandina";
  return (
    <div className="upage__content">

      {/* BANNER IMAGE */}
      <div className="upage__banner">
        <img src={andinaBanner} alt="Areandina" />
      </div>

      {/* INTRO — Split layout */}
      <section className="upage__split">
        <div className="upage__split-text">
          <span className="upage__tag">Sobre Areandina</span>
          <h2>Educación de calidad <span className="upage__accent--andina">que llega a las regiones</span></h2>
          <p>Más de 38 años formando profesionales con visión global. Areandina combina acreditación en alta calidad multicampus con una propuesta que incluye formación académica, inclusión e internacionalización.</p>
          <div className="upage__check-list">
            <div className="upage__check-item"><span className="upage__check-dot upage__check-dot--andina">✓</span> Acreditación Multicampus Alta Calidad</div>
            <div className="upage__check-item"><span className="upage__check-dot upage__check-dot--andina">✓</span> Modalidad 100% virtual disponible</div>
            <div className="upage__check-item"><span className="upage__check-dot upage__check-dot--andina">✓</span> Presencia en 5 ciudades del país</div>
          </div>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="upage__cta-inline upage__cta-inline--andina">
            <WA /> Consultar cupos disponibles
          </a>
        </div>
        <div className="upage__split-badges">
          <div className="upage__feature-badge">
            <div className="upage__feature-icon upage__feature-icon--andina"><Shield /></div>
            <div className="upage__feature-info">
              <h4>Alta Calidad</h4>
              <p>Certificación multicampus del MEN</p>
            </div>
          </div>
          <div className="upage__feature-badge">
            <div className="upage__feature-icon upage__feature-icon--andina"><Globe /></div>
            <div className="upage__feature-info">
              <h4>Internacional</h4>
              <p>Intercambios y alianzas globales</p>
            </div>
          </div>
          <div className="upage__feature-badge">
            <div className="upage__feature-icon upage__feature-icon--andina"><Monitor /></div>
            <div className="upage__feature-info">
              <h4>Flexible</h4>
              <p>Virtual • Presencial • Mixto</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMAS — Card grid */}
      <section className="upage__programs-section">
        <div className="upage__section-head">
          <span className="upage__tag">Oferta académica</span>
          <h2>Programas que transforman carreras</h2>
          <p>Selecciona la modalidad y nivel que se adapte a tu vida y objetivos.</p>
        </div>
        <div className="upage__prog-grid">
          <div className="upage__prog-block upage__prog-block--andina">
            <div className="upage__prog-block-header">
              <Cap />
              <span>PREGRADO</span>
            </div>
            <ul className="upage__prog-list">
              <li>Administración en Salud</li>
              <li>Administración Pública</li>
              <li>Licenciatura en Educación Infantil</li>
              <li>Ingeniería de Sistemas</li>
              <li>Ingeniería Industrial</li>
              <li>Economía</li>
            </ul>
          </div>
          <div className="upage__prog-block upage__prog-block--andina">
            <div className="upage__prog-block-header">
              <Award />
              <span>POSGRADO</span>
            </div>
            <ul className="upage__prog-list">
              <li>Pedagogía y Docencia</li>
              <li>Auditoría en Salud</li>
              <li>Alta Gerencia</li>
              <li>Gerencia Financiera</li>
              <li>Epidemiología</li>
              <li>Innovación Empresarial</li>
            </ul>
          </div>
          <div className="upage__prog-cta-card">
            <BookOpen />
            <h4>¿No encuentras tu programa?</h4>
            <p>Tenemos más opciones. Escríbenos y te asesoramos.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="upage__prog-cta-btn">
              <WA /> Ver más programas
            </a>
          </div>
        </div>
      </section>

      {/* SEDES — Pills con mapa visual */}
      <section className="upage__sedes-section upage__sedes-section--andina">
        <div className="upage__sedes-inner">
          <div className="upage__sedes-text">
            <span className="upage__tag upage__tag--light">Cobertura nacional</span>
            <h2>Centros de Servicio Universitario</h2>
            <p>Areandina llega a donde estás. Encuentra apoyo presencial en tu ciudad a través de sus CSU.</p>
            <div className="upage__sedes-pills">
              {['Bogotá', 'Aguachica', 'Buenaventura', 'Leticia', 'San Gil'].map(c => (
                <span key={c} className="upage__sede-pill"><MapPin />{c}</span>
              ))}
            </div>
            <a href="https://csu.com.co" target="_blank" rel="noopener noreferrer" className="upage__sede-link">
              Visitar CSU.com.co →
            </a>
          </div>
        </div>
      </section>

      {/* PROCESO — Timeline horizontal */}
      <section className="upage__proceso">
        <div className="upage__section-head">
          <span className="upage__tag">Cómo funciona</span>
          <h2>Tu camino en 3 pasos</h2>
        </div>
        <div className="upage__timeline">
          <div className="upage__timeline-step">
            <div className="upage__timeline-num upage__timeline-num--andina">01</div>
            <h4>Elige tu programa</h4>
            <p>Explora nuestra oferta y encuentra el que encaja con tu vida profesional.</p>
          </div>
          <div className="upage__timeline-connector"></div>
          <div className="upage__timeline-step">
            <div className="upage__timeline-num upage__timeline-num--andina">02</div>
            <h4>Recibe asesoría</h4>
            <p>Un experto te guía en modalidades, costos y proceso de ingreso.</p>
          </div>
          <div className="upage__timeline-connector"></div>
          <div className="upage__timeline-step">
            <div className="upage__timeline-num upage__timeline-num--andina">03</div>
            <h4>Inicia tu proceso</h4>
            <p>Te acompañamos en inscripción y matrícula hasta que estés listo.</p>
          </div>
        </div>
        <div className="upage__proceso-cta">
          <button className="upage__big-btn upage__big-btn--andina" onClick={onOpenModal}>
            Quiero asesoría personalizada <ChevronRight />
          </button>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="upage__final-cta upage__final-cta--andina">
        <div className="upage__final-cta-content">
          <h2>¿Todo listo para comenzar?</h2>
          <p>Habla hoy con uno de nuestros asesores especializados en Areandina. Respuesta inmediata.</p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="upage__final-btn">
            <WA /> Escribir al +57 314 437 7691
          </a>
        </div>
      </section>

    </div>
  );
};

/* ─── Ibero Page Component ─── */
const IberoContent = ({ onOpenModal }) => {
  const wa = "https://wa.me/573150686423?text=Hola,%20quisiera%20recibir%20asesor%C3%ADa%20sobre%20la%20Iberoamericana";
  return (
    <div className="upage__content">

      {/* VIDEO + HERO */}
      <div className="upage__ibero-hero">
        <div className="upage__ibero-hero-visual">
          <div className="upage__video-frame">
            <iframe
              src="https://www.youtube.com/embed/4-onqfpfk2Q"
              title="Conoce IBERO"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="upage__ibero-hero-text">
          <span className="upage__tag upage__tag--ibero">Corporación Universitaria Iberoamericana</span>
          <h2>50 años <span className="upage__accent--ibero">transformando vidas</span></h2>
          <p>Institución con Acreditación en Alta Calidad otorgada por el Ministerio de Educación. Parte de la red internacional <strong>Planeta Formación y Universidades.</strong></p>
          <div className="upage__ibero-stats">
            <div className="upage__ibero-stat">
              <strong>50+</strong><span>Años</span>
            </div>
            <div className="upage__ibero-stat">
              <strong>Alta</strong><span>Calidad MEN</span>
            </div>
            <div className="upage__ibero-stat">
              <strong>Global</strong><span>Red Planeta</span>
            </div>
          </div>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="upage__cta-inline upage__cta-inline--ibero">
            <WA /> Consultar cupos IBERO
          </a>
        </div>
      </div>

      {/* BANNER */}
      <div className="upage__banner">
        <img src={iberoBanner} alt="Corporación Universitaria Iberoamericana" />
      </div>

      {/* PILARES — Horizontal strip */}
      <section className="upage__pilares">
        <div className="upage__pilares-inner">
          <div className="upage__pilar">
            <div className="upage__pilar-icon upage__pilar-icon--ibero"><Shield /></div>
            <h4>Alta Calidad</h4>
            <p>Acreditada por el MEN por 6 años consecutivos</p>
          </div>
          <div className="upage__pilar-div"></div>
          <div className="upage__pilar">
            <div className="upage__pilar-icon upage__pilar-icon--ibero"><Monitor /></div>
            <h4>100% Virtual</h4>
            <p>Accede desde cualquier ciudad del país</p>
          </div>
          <div className="upage__pilar-div"></div>
          <div className="upage__pilar">
            <div className="upage__pilar-icon upage__pilar-icon--ibero"><Globe /></div>
            <h4>Internacional</h4>
            <p>Red Planeta con presencia en 15 países</p>
          </div>
          <div className="upage__pilar-div"></div>
          <div className="upage__pilar">
            <div className="upage__pilar-icon upage__pilar-icon--ibero"><Users /></div>
            <h4>Inclusión</h4>
            <p>Educación accesible para todos los perfiles</p>
          </div>
        </div>
      </section>

      {/* PROGRAMAS */}
      <section className="upage__programs-section">
        <div className="upage__section-head">
          <span className="upage__tag upage__tag--ibero">Oferta académica</span>
          <h2>Programas IBERO</h2>
          <p>Formación de calidad en modalidad virtual con acompañamiento permanente.</p>
        </div>
        <div className="upage__prog-grid">
          <div className="upage__prog-block upage__prog-block--ibero">
            <div className="upage__prog-block-header">
              <Cap />
              <span>PREGRADO</span>
            </div>
            <ul className="upage__prog-list">
              <li>Administración de Empresas</li>
              <li>Administración Financiera</li>
              <li>Licenciaturas en Educación</li>
              <li>Ingenierías</li>
              <li>Economía</li>
              <li>Psicología</li>
            </ul>
          </div>
          <div className="upage__prog-block upage__prog-block--ibero">
            <div className="upage__prog-block-header">
              <Award />
              <span>POSGRADO</span>
            </div>
            <ul className="upage__prog-list">
              <li>Pedagogía y Docencia</li>
              <li>Auditoría en Salud</li>
              <li>Alta Gerencia</li>
              <li>Gerencia Financiera</li>
              <li>Epidemiología</li>
              <li>Innovación y Emprendimiento</li>
            </ul>
          </div>
          <div className="upage__prog-cta-card upage__prog-cta-card--ibero">
            <BookOpen />
            <h4>¿Buscas otro programa?</h4>
            <p>Tenemos mucho más. Escríbenos para orientarte.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="upage__prog-cta-btn upage__prog-cta-btn--ibero">
              <WA /> Consultar disponibilidad
            </a>
          </div>
        </div>
      </section>

      {/* SEDE — Boyacá spotlight */}
      <section className="upage__sedes-section upage__sedes-section--ibero">
        <div className="upage__sedes-inner">
          <div className="upage__sedes-text">
            <span className="upage__tag upage__tag--light">Centro de Experiencia</span>
            <h2>Presencia en Boyacá</h2>
            <p>El Centro de Experiencia IBERO en Boyacá te ofrece acompañamiento presencial con todos los servicios académicos y administrativos.</p>
            <div className="upage__sedes-pills">
              <span className="upage__sede-pill"><MapPin />Tunja, Boyacá</span>
            </div>
          </div>
          <div className="upage__map-box">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15845.04741048649!2d-73.37012751055789!3d5.546972899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6a1701c99ca003%3A0x79c0c0e21c3d8131!2sTunja%2C%20Boyac%C3%A1!5e0!3m2!1ses!2sco!4v1692000000000"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tunja Boyacá - Centro IBERO"
            />
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="upage__proceso">
        <div className="upage__section-head">
          <span className="upage__tag upage__tag--ibero">Cómo funciona</span>
          <h2>Tu ruta hacia IBERO</h2>
        </div>
        <div className="upage__timeline">
          <div className="upage__timeline-step">
            <div className="upage__timeline-num upage__timeline-num--ibero">01</div>
            <h4>Elige tu programa</h4>
            <p>Revisa la oferta académica y encuentra tu carrera ideal.</p>
          </div>
          <div className="upage__timeline-connector upage__timeline-connector--ibero"></div>
          <div className="upage__timeline-step">
            <div className="upage__timeline-num upage__timeline-num--ibero">02</div>
            <h4>Habla con un asesor</h4>
            <p>Te orientamos en proceso, costos y fechas de inicio.</p>
          </div>
          <div className="upage__timeline-connector upage__timeline-connector--ibero"></div>
          <div className="upage__timeline-step">
            <div className="upage__timeline-num upage__timeline-num--ibero">03</div>
            <h4>Inicia tu carrera</h4>
            <p>Te acompañamos en cada etapa del proceso de matrícula.</p>
          </div>
        </div>
        <div className="upage__proceso-cta">
          <button className="upage__big-btn upage__big-btn--ibero" onClick={onOpenModal}>
            Solicitar asesoría gratuita <ChevronRight />
          </button>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="upage__final-cta upage__final-cta--ibero">
        <div className="upage__final-cta-content">
          <h2>¿Listo para estudiar en IBERO?</h2>
          <p>Nuestros asesores especializados en Iberoamericana están disponibles ahora mismo.</p>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="upage__final-btn upage__final-btn--ibero">
            <WA /> Escribir al +57 315 068 6423
          </a>
        </div>
      </section>

    </div>
  );
};

/* ─── Main Page ─── */
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
      {/* ─── HERO ─── */}
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
            Encuentra tu{' '}
            <span className="upage__hero-accent">universidad ideal</span>
          </h1>
          <p className="upage__hero-subtitle">
            Acreditación en alta calidad, formación flexible y acompañamiento real para que alcances tus metas.
          </p>
          <div className="upage__tabs">
            <button
              className={`upage__tab ${isAreandina ? 'upage__tab--active' : ''}`}
              onClick={() => setActiveTab('areandina')}
            >
              <span className="upage__tab-dot upage__tab-dot--green"></span>
              Areandina
            </button>
            <button
              className={`upage__tab ${!isAreandina ? 'upage__tab--active' : ''}`}
              onClick={() => setActiveTab('iberoamericana')}
            >
              <span className="upage__tab-dot upage__tab-dot--blue"></span>
              IBERO
            </button>
          </div>
        </div>
        <div className="upage__hero-curve">
          <svg viewBox="0 0 1440 140" fill="none" preserveAspectRatio="none">
            <path d="M0 140V100C240 20 480 0 720 20C960 40 1200 80 1440 100V140H0Z" fill="#f8f9fa"/>
          </svg>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <div className="upage__container">
        {isAreandina
          ? <AreandinaContent onOpenModal={() => setIsModalOpen(true)} />
          : <IberoContent onOpenModal={() => setIsModalOpen(true)} />
        }
      </div>

      <AsesoriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        whatsappPhone={isAreandina ? '573144377691' : '573150686423'}
      />
    </div>
  );
};

export default UniversidadesPage;
