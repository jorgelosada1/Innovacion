import React, { useState, useEffect } from 'react';
import './Testimonios.css';
import img10 from '../assets/images/10.png';
import img20 from '../assets/images/20.png';
import img30 from '../assets/images/30.png';
import { getComments } from '../utils/dataManager';

const Testimonios = () => {
  const [testimoniosData, setTestimoniosData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getComments('testimonio');
        const formattedData = data.map((t) => {
          let photo = t.photoUrl;
          if (photo && (photo.startsWith('http') || photo.startsWith('/uploads/'))) {
            if (photo.startsWith('/uploads/')) {
              photo = `http://localhost:5000${photo}`;
            }
          } else {
            // fallback
            if (t.name?.includes('Carolina')) photo = img10;
            else if (t.name?.includes('David')) photo = img20;
            else if (t.name?.includes('Mariana')) photo = img30;
          }

          let initials = '';
          if (t.name) {
            const parts = t.name.split(' ');
            if (parts.length >= 2) {
              initials = (parts[0][0] + parts[1][0]).toUpperCase();
            } else if (parts.length === 1) {
              initials = parts[0].substring(0, 2).toUpperCase();
            }
          }

          return {
            name: t.name,
            role: t.role,
            university: t.university,
            quote: t.text,
            rating: t.rating || 5,
            initials: initials,
            color: t.color || '#3b82f6',
            image: photo,
            _id: t._id || t.id
          };
        });
        setTestimoniosData(formattedData);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <section className="testimonios-section">
      <div className="testimonios-container">
        <h2 className="testimonios-title">Historias de Éxito de nuestros Estudiantes</h2>
        <p className="testimonios-subtitle">Descubre cómo hemos ayudado a miles de estudiantes a alcanzar sus metas profesionales.</p>
        
        <div className="testimonios-grid">
          {testimoniosData.map((t, index) => (
            <div className="testimonio-card" key={t._id || index}>
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
