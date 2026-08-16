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

  return (
    <section className="ventajas-section" ref={sectionRef}>
      <div className="ventajas-container">
        <div className="ventajas-stats">
          <div className="stat-item">
            <h4>+{countEstudiantes.toLocaleString()}</h4>
            <p>Estudiantes Asesorados</p>
          </div>
          <div className="stat-item">
            <h4>{countUniversidades}</h4>
            <p>Universidades de Élite</p>
          </div>
          <div className="stat-item">
            <h4>{countSatisfaccion}%</h4>
            <p>Satisfacción Alumnos</p>
          </div>
          <div className="stat-item">
            <h4>{countAnos}</h4>
            <p>Años de Experiencia</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ventajas;
