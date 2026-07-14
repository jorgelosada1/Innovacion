import { useState } from 'react';
import './Cursos.css';

const programas = {
  areandina: {
    nombre: 'Fundación Universitaria del Área Andina',
    short: 'Areandina',
    color: '#2680b2',
    categorias: [
      {
        tipo: 'Pregrado',
        carreras: [
          {
            nombre: 'Administración de Empresas',
            modalidad: 'Virtual',
            duracion: '9 semestres',
            icono: 'briefcase',
          },
          {
            nombre: 'Contaduría Pública',
            modalidad: 'Virtual',
            duracion: '9 semestres',
            icono: 'calculator',
          },
          {
            nombre: 'Ingeniería de Sistemas',
            modalidad: 'Virtual',
            duracion: '10 semestres',
            icono: 'code',
          },
          {
            nombre: 'Psicología',
            modalidad: 'Virtual',
            duracion: '10 semestres',
            icono: 'brain',
          },
          {
            nombre: 'Derecho',
            modalidad: 'Presencial',
            duracion: '10 semestres',
            icono: 'scale',
          },
          {
            nombre: 'Enfermería',
            modalidad: 'Presencial',
            duracion: '9 semestres',
            icono: 'heart',
          },
        ],
      },
      {
        tipo: 'Posgrado',
        carreras: [
          {
            nombre: 'Especialización en Gerencia Financiera',
            modalidad: 'Virtual',
            duracion: '2 semestres',
            icono: 'trending',
          },
          {
            nombre: 'Especialización en Alta Gerencia',
            modalidad: 'Virtual',
            duracion: '2 semestres',
            icono: 'award',
          },
          {
            nombre: 'Maestría en Educación',
            modalidad: 'Virtual',
            duracion: '4 semestres',
            icono: 'book',
          },
        ],
      },
    ],
  },
  iberoamericana: {
    nombre: 'Corporación Universitaria Iberoamericana',
    short: 'Iberoamericana',
    color: '#1e6a9e',
    categorias: [
      {
        tipo: 'Pregrado',
        carreras: [
          {
            nombre: 'Licenciatura en Pedagogía Infantil',
            modalidad: 'Virtual',
            duracion: '9 semestres',
            icono: 'users',
          },
          {
            nombre: 'Licenciatura en Educación Especial',
            modalidad: 'Virtual',
            duracion: '9 semestres',
            icono: 'heart',
          },
          {
            nombre: 'Fonoaudiología',
            modalidad: 'Presencial',
            duracion: '9 semestres',
            icono: 'mic',
          },
          {
            nombre: 'Fisioterapia',
            modalidad: 'Presencial',
            duracion: '9 semestres',
            icono: 'activity',
          },
        ],
      },
      {
        tipo: 'Posgrado',
        carreras: [
          {
            nombre: 'Especialización en Neuropsicopedagogía',
            modalidad: 'Virtual',
            duracion: '2 semestres',
            icono: 'brain',
          },
          {
            nombre: 'Especialización en Desarrollo Infantil',
            modalidad: 'Virtual',
            duracion: '2 semestres',
            icono: 'users',
          },
        ],
      },
    ],
  },
};

const iconPaths = {
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
  calculator: <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></>,
  code: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
  brain: <><path d="M9.5 2A6.5 6.5 0 003 8.5c0 2.5 1.5 4.5 3.5 5.5V22h6V14c2-1 3.5-3 3.5-5.5A6.5 6.5 0 009.5 2z"/></>,
  scale: <><line x1="12" y1="3" x2="12" y2="21"/><polyline points="4 7 12 3 20 7"/><path d="M4 7v5c0 2.2 3.6 4 8 4s8-1.8 8-4V7"/></>,
  heart: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></>,
  trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  award: <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
  book: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>,
  users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
  mic: <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>,
  activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
};

const Cursos = () => {
  const [activeTab, setActiveTab] = useState('areandina');
  const [activeCategoria, setActiveCategoria] = useState('Pregrado');
  const universidad = programas[activeTab];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveCategoria('Pregrado');
  };

  const categoriaActual = universidad.categorias.find(c => c.tipo === activeCategoria);

  return (
    <section id="cursos" className="cursos">
      <div className="cursos__container">
        {/* Header */}
        <div className="cursos__header">
          <span className="cursos__badge">Oferta Académica</span>
          <h2 className="cursos__title">
            Programas <span className="cursos__title-accent">Universitarios</span>
          </h2>
          <p className="cursos__subtitle">
            Explora nuestra oferta académica en convenio con universidades acreditadas de alta calidad.
          </p>
        </div>

        {/* University tabs */}
        <div className="cursos__tabs">
          <button
            className={`cursos__tab ${activeTab === 'areandina' ? 'cursos__tab--active' : ''}`}
            onClick={() => handleTabChange('areandina')}
          >
            <span className="cursos__tab-indicator"></span>
            Areandina
          </button>
          <button
            className={`cursos__tab ${activeTab === 'iberoamericana' ? 'cursos__tab--active' : ''}`}
            onClick={() => handleTabChange('iberoamericana')}
          >
            <span className="cursos__tab-indicator"></span>
            Iberoamericana
          </button>
        </div>

        {/* Category pills */}
        <div className="cursos__categories">
          {universidad.categorias.map((cat) => (
            <button
              key={cat.tipo}
              className={`cursos__category ${activeCategoria === cat.tipo ? 'cursos__category--active' : ''}`}
              onClick={() => setActiveCategoria(cat.tipo)}
            >
              {cat.tipo}
              <span className="cursos__category-count">{cat.carreras.length}</span>
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="cursos__grid">
          {categoriaActual?.carreras.map((carrera, index) => (
            <div key={`${activeTab}-${carrera.nombre}`} className="cursos__card" style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="cursos__card-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {iconPaths[carrera.icono]}
                </svg>
              </div>
              <div className="cursos__card-body">
                <h3 className="cursos__card-name">{carrera.nombre}</h3>
                <div className="cursos__card-meta">
                  <span className={`cursos__card-tag ${carrera.modalidad === 'Virtual' ? 'cursos__card-tag--virtual' : 'cursos__card-tag--presencial'}`}>
                    {carrera.modalidad}
                  </span>
                  <span className="cursos__card-duration">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {carrera.duracion}
                  </span>
                </div>
              </div>
              <a href="#contacto-form" className="cursos__card-cta">
                Inscribirme
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cursos;
