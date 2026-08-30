import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSlider, getNoticias } from '../utils/dataManager';
import './NewsSlider.css';
import defaultImg1 from '../assets/images/1.png';
import defaultImg2 from '../assets/images/2.png';
import andinaBanner from '../assets/images/andina.png';
import iberoBanner from '../assets/images/ibero.png';

const NewsSlider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let rawSlider = getSlider();
    const noticias = getNoticias();

    // Asegurar que los banners de Andina e Ibero estén presentes en el slider
    const hasAndina = rawSlider.some(s => s.imagen && s.imagen.includes('andina.png'));
    const hasIbero = rawSlider.some(s => s.imagen && s.imagen.includes('ibero.png'));

    let sliderItems = [...rawSlider];
    if (!hasAndina) {
      sliderItems.push({
        id: 's3',
        imagen: '/src/assets/images/andina.png',
        link: '/universidades/areandina',
        title: 'Fundación Universitaria del Área Andina'
      });
    }
    if (!hasIbero) {
      sliderItems.push({
        id: 's4',
        imagen: '/src/assets/images/ibero.png',
        link: '/universidades/iberoamericana',
        title: 'Corporación Universitaria Iberoamericana'
      });
    }

    const formatted = sliderItems.map((item) => {
      let image = item.imagen;
      let link = item.link;

      if (image && image.includes('1.png')) {
        image = defaultImg1;
      } else if (image && image.includes('2.png')) {
        image = defaultImg2;
      } else if (image && image.includes('andina.png')) {
        image = andinaBanner;
        link = '/universidades/areandina';
      } else if (image && image.includes('ibero.png')) {
        image = iberoBanner;
        link = '/universidades/iberoamericana';
      }

      const noticia = noticias.find((n) => n.id === item.noticiaId);
      return {
        ...item,
        image,
        link,
        title: item.title || (noticia ? noticia.titulo : 'Innovación e-Learning'),
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

  // Auto-play every 6 seconds, pauses on manual pause toggle
  useEffect(() => {
    if (slides.length === 0 || isPaused) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length, isPaused]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleSlideClick = (slide) => {
    if (slide.link) {
      navigate(slide.link);
    } else if (slide.noticiaId) {
      navigate(`/noticias/${slide.noticiaId}`);
    }
  };

  if (slides.length === 0) return null;

  const isAutoPlaying = !isPaused;

  return (
    <section className="news-slider">
      <div className="news-slider__track">
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`news-slider__slide ${index === current ? 'news-slider__slide--active' : ''}`}
            onClick={() => handleSlideClick(slide)}
            style={{ cursor: 'pointer' }}
            title={`Ir a ${slide.title}`}
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

      {/* Controls bar (Pause/Play + Dots) */}
      <div className="news-slider__controls">
        <button 
          className={`news-slider__pause-btn ${isPaused ? 'news-slider__pause-btn--paused' : ''}`} 
          onClick={togglePause}
          title={isPaused ? 'Reanudar diapositivas' : 'Pausar diapositivas'}
          aria-label={isPaused ? 'Reanudar diapositivas' : 'Pausar diapositivas'}
        >
          {isPaused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          )}
        </button>

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
      </div>

      {/* Progress bar */}
      <div className="news-slider__progress">
        <div
          className="news-slider__progress-bar"
          style={{
            animationDuration: '6000ms',
            animationPlayState: isAutoPlaying ? 'running' : 'paused'
          }}
          key={current}
        />
      </div>
    </section>
  );
};

export default NewsSlider;
