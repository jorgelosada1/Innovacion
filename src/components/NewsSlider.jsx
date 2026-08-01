import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSlider, getNoticias } from '../utils/dataManager';
import './NewsSlider.css';
import defaultImg1 from '../assets/images/1.png';
import defaultImg2 from '../assets/images/2.png';

const NewsSlider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const rawSlider = getSlider();
    const noticias = getNoticias();
    const formatted = rawSlider.map((item) => {
      let image = item.imagen;
      if (image && image.includes('1.png')) {
        image = defaultImg1;
      } else if (image && image.includes('2.png')) {
        image = defaultImg2;
      }
      const noticia = noticias.find((n) => n.id === item.noticiaId);
      return {
        ...item,
        image,
        title: noticia ? noticia.titulo : 'Noticia',
      };
    });
    setSlides(formatted);
  }, []);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning, slides.length]);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    goToSlide(current === 0 ? slides.length - 1 : current - 1);
  }, [current, goToSlide, slides.length]);

  // Auto-play every 3 seconds
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="news-slider">
      <div className="news-slider__track">
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`news-slider__slide ${index === current ? 'news-slider__slide--active' : ''}`}
            onClick={() => slide.noticiaId && navigate(`/noticias/${slide.noticiaId}`)}
            style={{ cursor: 'pointer' }}
          >
            <img src={slide.image} alt="" className="news-slider__bg" aria-hidden="true" />
            <img src={slide.image} alt={slide.title} className="news-slider__image" />
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
