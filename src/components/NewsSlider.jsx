import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSlider } from '../utils/dataManager';
import { resolveImage } from '../utils/assets';
import { useApiData } from '../hooks/useApiData';
import './NewsSlider.css';

// Toma la primera y la última fila de píxeles del banner para prolongar sus
// colores arriba y abajo cuando el banner ocupa toda la pantalla
const extractEdges = (img) => {
  try {
    const w = Math.min(img.naturalWidth, 800);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 1, img.naturalWidth, 1, 0, 0, w, 1);
    const top = canvas.toDataURL();
    ctx.drawImage(img, 0, img.naturalHeight - 2, img.naturalWidth, 1, 0, 0, w, 1);
    const bottom = canvas.toDataURL();
    return { top, bottom };
  } catch {
    return null;
  }
};

const NewsSlider = () => {
  const { data: rawSlides, loading } = useApiData('slider', fetchSlider);
  const slides = useMemo(
    () =>
      (rawSlides || [])
        .map((item) => ({
          ...item,
          image: resolveImage(item.imagen),
          title: item.title || 'Innovación E-learning',
        }))
        .filter((item) => item.image),
    [rawSlides]
  );
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const touchStartX = useRef(null);
  const [edges, setEdges] = useState({});

  const handleImageLoad = (key, e) => {
    if (edges[key]) return;
    const result = extractEdges(e.currentTarget);
    if (result) setEdges((prev) => ({ ...prev, [key]: result }));
  };

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

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 45) return;
    if (delta < 0) nextSlide();
    else prevSlide();
  };

  const handleSlideClick = (slide) => {
    if (/^https?:\/\//.test(slide.link || '')) {
      window.open(slide.link, '_blank', 'noopener');
    } else if (slide.link) {
      navigate(slide.link);
    } else if (slide.noticiaId) {
      navigate(`/noticias/${slide.noticiaId}`);
    }
  };

  // Mientras llegan los banners se reserva el espacio para que la página no salte
  if (loading) return <section className="news-slider news-slider--loading" aria-hidden="true" />;
  if (slides.length === 0) return null;

  const isAutoPlaying = !isPaused;

  return (
    <section className="news-slider" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="news-slider__track">
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`news-slider__slide ${
              index === current
                ? 'news-slider__slide--active'
                : index < current
                  ? 'news-slider__slide--before'
                  : 'news-slider__slide--after'
            }`}
            onClick={() => handleSlideClick(slide)}
            style={{ cursor: 'pointer' }}
            title={`Ir a ${slide.title}`}
          >
            <img src={slide.image} alt="" className="news-slider__bg" aria-hidden="true" />
            {edges[slide.image] && (
              <>
                <div className="news-slider__edge news-slider__edge--top" style={{ backgroundImage: `url(${edges[slide.image].top})` }} aria-hidden="true" />
                <div className="news-slider__edge news-slider__edge--bottom" style={{ backgroundImage: `url(${edges[slide.image].bottom})` }} aria-hidden="true" />
              </>
            )}
            <img
              src={slide.image}
              alt={slide.title}
              className="news-slider__image"
              onLoad={(e) => handleImageLoad(slide.image, e)}
            />
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

        <span className="news-slider__counter">
          {String(current + 1).padStart(2, '0')}
          <span>/ {String(slides.length).padStart(2, '0')}</span>
        </span>

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

      {/* Indicador para bajar */}
      <button
        className="news-slider__scroll"
        onClick={() => window.scrollTo({ top: window.innerHeight - 70, behavior: 'smooth' })}
        aria-label="Bajar al contenido"
      >
        <span className="news-slider__scroll-mouse" />
      </button>

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
