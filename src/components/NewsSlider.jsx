import { useState, useEffect, useCallback } from 'react';
import './NewsSlider.css';
import slider1 from '../assets/images/slider-1.png';
import slider2 from '../assets/images/slider-2.png';
import slider3 from '../assets/images/slider-3.png';

const slides = [
  {
    image: slider1,
    title: 'Inscripciones Abiertas 2025-2',
    description: 'Inicia tu camino universitario con nuestras alianzas académicas. Programas presenciales y virtuales disponibles.',
  },
  {
    image: slider2,
    title: 'Educación Virtual de Calidad',
    description: 'Accede a programas acreditados desde cualquier lugar. Plataformas modernas y acompañamiento permanente.',
  },
  {
    image: slider3,
    title: 'Tu Futuro Comienza Aquí',
    description: 'Miles de graduados respaldan nuestra experiencia. Formamos profesionales con impacto en la sociedad.',
  },
];

const NewsSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(current === 0 ? slides.length - 1 : current - 1);
  }, [current, goToSlide]);

  // Auto-play every 3 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="news-slider">
      <div className="news-slider__track">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`news-slider__slide ${index === current ? 'news-slider__slide--active' : ''}`}
          >
            <img src={slide.image} alt={slide.title} className="news-slider__image" />
            <div className="news-slider__overlay"></div>
            <div className="news-slider__content">
              <h2 className="news-slider__title">{slide.title}</h2>
              <p className="news-slider__description">{slide.description}</p>
              <a href="#cursos" className="news-slider__cta">
                Conocer más
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button className="news-slider__arrow news-slider__arrow--prev" onClick={prevSlide} aria-label="Anterior">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button className="news-slider__arrow news-slider__arrow--next" onClick={nextSlide} aria-label="Siguiente">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className="news-slider__dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`news-slider__dot ${index === current ? 'news-slider__dot--active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="news-slider__progress">
        <div
          className="news-slider__progress-bar"
          key={current}
        />
      </div>
    </section>
  );
};

export default NewsSlider;
