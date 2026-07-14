import { useState } from 'react';
import './MisionVision.css';

const tabs = [
  {
    key: 'mision',
    label: 'Misión',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    title: 'Nuestra Misión',
    text: 'Somos el puente entre personas con sueños educativos y las mejores universidades del país. Nuestra misión es hacer que el acceso a la educación superior sea simple, transparente y humano — acompañando a cada aspirante de manera personalizada, desde el primer contacto hasta su exitosa matrícula, sin costo alguno para él.',
  },
  {
    key: 'vision',
    label: 'Visión',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: 'Nuestra Visión',
    text: 'Ser reconocidos a nivel nacional como el principal aliado comercial en el sector educativo, liderando la innovación en procesos de captación y acompañamiento estudiantil, con presencia en todas las regiones de Colombia y un modelo replicable de impacto social.',
  },
  {
    key: 'valores',
    label: 'Valores',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Nuestros Valores',
    text: null,
    values: [
      'Compromiso con la educación',
      'Transparencia y ética profesional',
      'Innovación constante',
      'Trabajo en equipo',
      'Responsabilidad social',
      'Servicio al cliente excepcional',
    ],
  },
];

const MisionVision = () => {
  const [activeTab, setActiveTab] = useState('mision');
  const current = tabs.find(t => t.key === activeTab);

  return (
    <section id="nosotros" className="mv">
      {/* Decorative dots */}
      <div className="mv__dot mv__dot--1"></div>
      <div className="mv__dot mv__dot--2"></div>
      <div className="mv__dot mv__dot--3"></div>

      <div className="mv__container">
        {/* Badge */}
        <span className="mv__badge">Identidad Corporativa</span>

        {/* Title */}
        <h2 className="mv__title">
          Lo que nos <em className="mv__title-accent">mueve</em>
        </h2>

        {/* Tabs */}
        <div className="mv__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`mv__tab ${activeTab === tab.key ? 'mv__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mv__content" key={activeTab}>
          <div className="mv__icon">
            {current.icon}
          </div>
          <h3 className="mv__content-title">{current.title}</h3>
          {current.text && (
            <p className="mv__content-text">{current.text}</p>
          )}
          {current.values && (
            <ul className="mv__values-list">
              {current.values.map((val, i) => (
                <li key={i} className="mv__value-item">
                  <span className="mv__value-bullet"></span>
                  {val}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default MisionVision;
