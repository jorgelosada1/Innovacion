import { useState, useEffect } from 'react';
import './ColaboradoresPage.css';
import fernanImg from '../assets/images/Fernan.png';
import wilsonImg from '../assets/images/wilson.png';
import johannaImg from '../assets/images/Johanna.JPG';
import mariaImg from '../assets/images/Maria.png';
import erikaImg from '../assets/images/erika.JPG';
import paulaImg from '../assets/images/paula.JPG';
import johanImg from '../assets/images/johan.JPG';
import PasswordModal from '../components/PasswordModal';
import IdeaBox from '../components/IdeaBox';
import Scene3D from '../components/three/Scene3D';

// Voces del equipo: lo que significa Innovación E-learning para cada colaborador
const comments = [
  {
    text: 'Innovación E-learning no es solo una empresa, es mi casa, es mi familia, y ver crecer a cada uno de los que trabajamos acá no tiene precio.',
    name: 'Johanna',
    role: 'Gerente Comercial',
    photo: johannaImg,
  },
  {
    text: 'Para mí significa una búsqueda constante de mejoras, de avanzar y aportar crecimiento a los colaboradores y a la empresa por medio de la innovación en cada uno de los procesos que se llevan a cabo.',
    name: 'Paula',
    role: 'Área de Gestión',
    photo: paulaImg,
  },
  {
    text: 'Para personas como yo, que no había estado involucrada más a fondo en el sector educativo, significa crear expectativas y experiencias en las personas para avivar el entusiasmo de continuar con un propósito y proyecto de vida.',
    name: 'Lina',
    role: 'Equipo INNE',
  },
  {
    text: 'Para mí es estabilidad, oportunidad y mi refugio. Es una empresa con grandes logros, y aporta al 100 % todo lo necesario para que su equipo de trabajo funcione bien 🫶🏼',
    name: 'Gladys',
    role: 'Equipo INNE',
  },
  {
    text: 'Para mí, es crecimiento continuo, es aprender y compartir experiencias.',
    name: 'Andrea',
    role: 'Equipo INNE',
  },
  {
    text: 'Crecimiento, aprendizajes, un lugar de retos que nos ayuda a sacar habilidades ocultas, jejeje. La empresa es el lugar que me ha retado a descubrir mi potencial.',
    name: 'Diana',
    role: 'Equipo INNE',
  },
  {
    text: 'INNOVACIÓN E-LEARNING significa para mí una empresa que me brindó la oportunidad de poner en práctica los conocimientos adquiridos a lo largo de mi experiencia laboral en el área de Talento Humano, pero que también me retó a asumir nuevos desafíos y a desarrollar tareas y procesos que no eran mi fortaleza ni estaban entre mis principales preferencias profesionales.\n\nMi experiencia ha sido muy enriquecedora y fortalecedora, tanto a nivel profesional como personal. Me ha permitido aprender constantemente, desarrollar mayor paciencia, manejar la frustración y fortalecer la empatía frente a las diferentes situaciones y necesidades de cada colaborador.\n\nHoy considero que esta experiencia me ha ayudado a salir de mi zona de confort, reconocer oportunidades de mejora y comprender que trabajar en Talento Humano no solo implica gestionar procesos, sino también escuchar, comprender, acompañar y aportar al crecimiento de las personas y de la organización.',
    name: 'Saira',
    role: 'Talento Humano',
  },
  {
    text: 'Ser parte de un equipo que abre puertas y transforma vidas a través de la educación.',
    name: 'Diego',
    role: 'Mercadeo',
    featured: true,
  },
  {
    text: 'Trabajar en Innovación e-Learning me ha permitido crecer profesionalmente en un ambiente de constante aprendizaje y colaboración.',
    name: 'Johan',
    role: 'Equipo Comercial',
    photo: erikaImg,
  },
  {
    text: 'Aquí valoran nuestras ideas y nos dan las herramientas para hacer la diferencia en la educación superior del país.',
    name: 'Erika',
    role: 'Liderazgo Comercial',
    photo: johanImg,
  },
];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #2E86C1, #1B3A5C)',
  'linear-gradient(135deg, #F7B731, #E8961E)',
  'linear-gradient(135deg, #10b981, #047857)',
  'linear-gradient(135deg, #8b5cf6, #5b21b6)',
  'linear-gradient(135deg, #ec4899, #be185d)',
];

const LONG_TEXT = 260;

const VoiceAvatar = ({ comment, index, className }) => (
  <div className={className} style={comment.photo ? undefined : { background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}>
    {comment.photo ? (
      <img src={comment.photo} alt={comment.name} className={`${className}-img`} />
    ) : (
      <span className={`${className}-initial`}>{comment.name.charAt(0)}</span>
    )}
  </div>
);

const VoiceCard = ({ comment, index }) => {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = comment.text.split('\n\n');
  const isLong = comment.text.length > LONG_TEXT;

  return (
    <article
      className={`voice-card voice-card--v${index % 4} ${isLong && !expanded ? 'voice-card--clamped' : ''}`}
      data-reveal
      style={{ '--reveal-delay': `${(index % 3) * 120}ms` }}
    >
      <svg className="voice-card__quote" width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609L9.978 5.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z"/>
      </svg>
      <div className="voice-card__text">
        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {isLong && (
        <button className="voice-card__more" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
          {expanded ? 'Ver menos' : 'Leer completo'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      )}
      <footer className="voice-card__author">
        <VoiceAvatar comment={comment} index={index} className="voice-card__avatar" />
        <div>
          <h4 className="voice-card__name">{comment.name}</h4>
          <span className="voice-card__role">{comment.role}</span>
        </div>
      </footer>
    </article>
  );
};

const ColaboradoresPage = () => {
  const [commentIndex, setCommentIndex] = useState(0);

  const [commentsPaused, setCommentsPaused] = useState(false);

  useEffect(() => {
    if (commentsPaused) return;
    const timer = setInterval(() => {
      setCommentIndex((prev) => (prev + 1) % comments.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [commentsPaused]);

  const featuredVoice = comments.find((c) => c.featured);
  const wallVoices = comments.filter((c) => !c.featured);

  const scrollToVoices = () => {
    document.getElementById('voces')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
        <Scene3D type="shapes" variant="light" count={10} seed={23} />
        <div className="colaboradores__hero-content" data-reveal>
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
              <div className="org__avatar org__avatar--ceo">
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
                <div className="org__avatar org__avatar--exec-1">
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
                <div className="org__avatar org__avatar--exec-2">
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
                <div className="org__avatar org__avatar--exec-3">
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
              <div
                className="emp-comments-card"
                onMouseEnter={() => setCommentsPaused(true)}
                onMouseLeave={() => setCommentsPaused(false)}
              >
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
                        <VoiceAvatar comment={comment} index={i} className="emp-comments-card__avatar" />
                        <div className="emp-comments-card__info">
                          <h4 className="emp-comments-card__name">{comment.name}</h4>
                          <span className="emp-comments-card__role">{comment.role}</span>
                        </div>
                      </div>

                      <div className="emp-comments-card__body">
                        <svg className="emp-comments-card__quote-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609L9.978 5.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z"/>
                        </svg>
                        <p className="emp-comments-card__text">{comment.text.split('\n\n')[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="emp-comments-card__footer">
                  <button
                    className="emp-comments-card__nav"
                    onClick={() => setCommentIndex((commentIndex - 1 + comments.length) % comments.length)}
                    aria-label="Comentario anterior"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
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
                  <button
                    className="emp-comments-card__nav"
                    onClick={() => setCommentIndex((commentIndex + 1) % comments.length)}
                    aria-label="Comentario siguiente"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
                <button className="emp-comments-card__all" onClick={scrollToVoices}>
                  Ver todas las voces ({comments.length})
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* === MURO DE VOCES DEL EQUIPO === */}
        <section className="voices" id="voces">
          <div className="voices__header" data-reveal>
            <span className="colaboradores__badge">8 años · Nuestra gente</span>
            <h2 className="colaboradores__section-title">
              Lo que significa <span className="text-shimmer">INNE</span> para nosotros
            </h2>
            <p className="voices__desc">
              Detrás de cada estudiante que acompañamos hay un equipo que cree en lo que hace. Estas son sus palabras.
            </p>
          </div>

          {featuredVoice && (
            <blockquote className="voices__featured" data-reveal>
              <span className="voices__featured-mark" aria-hidden="true">“</span>
              <p>{featuredVoice.text}</p>
              <footer>
                <VoiceAvatar comment={featuredVoice} index={comments.indexOf(featuredVoice)} className="voice-card__avatar" />
                <div>
                  <strong>{featuredVoice.name}</strong>
                  <span>{featuredVoice.role}</span>
                </div>
              </footer>
            </blockquote>
          )}

          <div className="voices__wall">
            {wallVoices.map((comment, i) => (
              <VoiceCard key={comment.name} comment={comment} index={i} />
            ))}
          </div>
        </section>

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

        {/* === BUZÓN DE IDEAS === */}
        <IdeaBox />

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
