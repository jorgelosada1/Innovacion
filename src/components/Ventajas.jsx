import { useState, useEffect, useRef } from 'react';
import './Ventajas.css';

const useCounter = (endValue, duration = 2000, startAnimation = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTimestamp = null;
    let animationFrameId = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * endValue));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [endValue, duration, startAnimation]);

  return count;
};

const Ventajas = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const countEstudiantes = useCounter(1000, 2200, isVisible);
  const countUniversidades = useCounter(2, 1200, isVisible);
  const countSatisfaccion = useCounter(98, 2000, isVisible);
  const countAnos = useCounter(8, 1500, isVisible);

  const stats = [
    {
      value: `+${countEstudiantes.toLocaleString()}`,
      label: 'Estudiantes Asesorados',
      icon: <path d="M22 10 12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5" />,
    },
    {
      value: countUniversidades,
      label: 'Universidades de Élite',
      icon: <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" />,
    },
    {
      value: `${countSatisfaccion}%`,
      label: 'Satisfacción Alumnos',
      icon: <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.7 3.3 5 6.8 5c2 0 3.4 1.1 5.2 3 1.8-1.9 3.2-3 5.2-3 3.5 0 5.6 3.7 4.3 6.8C19.5 16.4 12 21 12 21z" />,
    },
    {
      value: countAnos,
      label: 'Años de Experiencia',
      icon: <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6L12 2z" />,
    },
  ];

  return (
    <section className="ventajas-section" ref={sectionRef}>
      <div className="ventajas-container">
        <div className="ventajas-stats" data-reveal>
          <div className="ventajas-stats__orb ventajas-stats__orb--1" aria-hidden="true"></div>
          <div className="ventajas-stats__orb ventajas-stats__orb--2" aria-hidden="true"></div>
          {stats.map((stat, i) => (
            <div
              className="stat-item"
              key={stat.label}
              data-reveal
              style={{ '--reveal-delay': `${200 + i * 110}ms` }}
            >
              <span className="stat-item__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {stat.icon}
                </svg>
              </span>
              <h4>{stat.value}</h4>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ventajas;
