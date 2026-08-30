import React from 'react';
import './Testimonios.css';
import img10 from '../assets/images/10.png';
import img20 from '../assets/images/20.png';
import img30 from '../assets/images/30.png';

const testimoniosData = [
  {
    name: 'Carolina Mendoza',
    role: 'Estudiante de Psicología',
    university: 'Iberoamericana',
    quote: 'Gracias al acompañamiento de Innovación E-Learning pude matricularme sin complicaciones. El proceso fue rápido y transparente.',
    rating: 5,
    initials: 'CM',
    color: '#3b82f6',
    image: img10
  },
  {
    name: 'David Salamanca',
    role: 'Especialista en Gestión de Proyectos',
    university: 'Areandina',
    quote: 'Pude estudiar mi especialización mientras trabajaba a tiempo completo. La flexibilidad virtual y la asesoría fueron claves.',
    rating: 5,
    initials: 'DS',
    color: '#10b981',
    image: img20
  },
  {
    name: 'Mariana Ríos',
    role: 'Estudiante de Licenciatura',
    university: 'Iberoamericana',
    quote: 'Excelente atención personalizada. Siempre me resolvieron todas las dudas sobre pagos y plataformas.',
    rating: 5,
    initials: 'MR',
    color: '#f59e0b',
    image: img30
  }
];

const Testimonios = () => {
  return (
    <section className="testimonios-section">
      <div className="testimonios-container">
        <h2 className="testimonios-title">Historias de Éxito de nuestros Estudiantes</h2>
        <p className="testimonios-subtitle">Descubre cómo hemos ayudado a miles de estudiantes a alcanzar sus metas profesionales.</p>
        
        <div className="testimonios-grid">
          {testimoniosData.map((t, index) => (
            <div className="testimonio-card" key={index}>
              <div className="testimonio-quote-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity="0.1"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              </div>
              
              <div className="testimonio-stars">
                {[...Array(t.rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              
              <p className="testimonio-text">"{t.quote}"</p>
              
              <div className="testimonio-author">
                <div className="testimonio-avatar" style={{ backgroundColor: t.color }}>
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="testimonio-avatar-img" />
                  ) : (
                    t.initials
                  )}
                </div>
                <div className="testimonio-info">
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                  <span className="testimonio-tag">{t.university}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonios;
