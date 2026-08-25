import { useRef, useState, useEffect } from 'react';
import './HeroBanner.css';
import logoVideo from '../assets/Animacion_Logo.mp4';
import logoColor from '../assets/images/Logo.png';

const HeroBanner = () => {
  const logoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const target = logoContainerRef.current;
    if (!target || !video) return;

    video.muted = true;
    video.playsInline = true;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Se reproduce cuando el usuario hace scroll y entra a la sección
        if (entry.isIntersecting && !hasPlayed) {
          setHasPlayed(true);
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch((err) => {
                console.warn('Scroll play error:', err);
                setIsPlaying(true);
              });
          }
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasPlayed]);

  const handleEnded = () => {
    setHasEnded(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <section className="hero-banner" id="inicio">
      {/* Decorative background grid and glowing circles */}
      <div className="hero-banner__decorations">
        <div className="hero-banner__circle hero-banner__circle--1"></div>
        <div className="hero-banner__circle hero-banner__circle--2"></div>
        <div className="hero-banner__circle hero-banner__circle--3"></div>
        <div className="hero-banner__grid-bg"></div>
      </div>

      <div className="hero-banner__container">
        {/* Top Header Tag */}
        <div className="hero-banner__header">
          <div className="hero-banner__badge">
            <span className="hero-banner__badge-dot"></span>
            INNOVACIÓN E-LEARNING
          </div>
          <h2 className="hero-banner__title">
            Tu futuro profesional <span className="hero-banner__title-highlight">comienza aquí</span>
          </h2>
        </div>

        {/* Main interactive area with logo & floating cards */}
        <div className="hero-banner__main-stage">
          {/* Left Floating Cards */}
          <div className="hero-banner__side-cards hero-banner__side-cards--left">
            <div className="hero-banner__feature-card hero-banner__feature-card--1">
              <div className="hero-banner__feature-icon hero-banner__feature-icon--blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div className="hero-banner__feature-content">
                <h4 className="hero-banner__feature-title">100% Virtual</h4>
                <p className="hero-banner__feature-text">Flexibilidad para estudiar desde cualquier lugar</p>
              </div>
            </div>

            <div className="hero-banner__feature-card hero-banner__feature-card--2">
              <div className="hero-banner__feature-icon hero-banner__feature-icon--yellow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="hero-banner__feature-content">
                <h4 className="hero-banner__feature-title">Asesoría 1 a 1</h4>
                <p className="hero-banner__feature-text">Acompañamiento personalizado en tu matrícula</p>
              </div>
            </div>
          </div>

          {/* Center Logo Video Wrapper */}
          <div className="hero-banner__logo-wrapper" ref={logoContainerRef}>
            <div className="hero-banner__logo-glow"></div>
            
            {/* Fallback de logo estático mientras el usuario llega para que NUNCA se vea un recuadro negro */}
            {!isPlaying && !hasPlayed && (
              <img
                src={logoColor}
                alt="Innovación e-Learning"
                className="hero-banner__logo-placeholder"
              />
            )}

            <video
              ref={videoRef}
              src={logoVideo}
              className={`hero-banner__logo-video ${isPlaying || hasEnded ? 'hero-banner__logo-video--visible' : ''}`}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              onPlay={() => setIsPlaying(true)}
              onPlaying={() => setIsPlaying(true)}
              onEnded={handleEnded}
              aria-label="Animación de logo Innovación e-Learning"
            />
          </div>

          {/* Right Floating Cards */}
          <div className="hero-banner__side-cards hero-banner__side-cards--right">
            <div className="hero-banner__feature-card hero-banner__feature-card--3">
              <div className="hero-banner__feature-icon hero-banner__feature-icon--green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className="hero-banner__feature-content">
                <h4 className="hero-banner__feature-title">Alta Calidad</h4>
                <p className="hero-banner__feature-text">Universidades líderes con programas acreditados</p>
              </div>
            </div>

            <div className="hero-banner__feature-card hero-banner__feature-card--4">
              <div className="hero-banner__feature-icon hero-banner__feature-icon--blue-dark">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <div className="hero-banner__feature-content">
                <h4 className="hero-banner__feature-title">Proceso Ágil</h4>
                <p className="hero-banner__feature-text">Inscripción rápida sin complicaciones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Pills / Chips at bottom */}
        <div className="hero-banner__pills">
          <span className="hero-banner__pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            +8 Años Transformando Vidas
          </span>
          <span className="hero-banner__pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Convenios Oficiales
          </span>
          <span className="hero-banner__pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Cobertura Nacional
          </span>
        </div>
      </div>

      {/* Curved bottom transition layers */}
      <div className="hero-banner__curve">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 45C320 105 720 10 1100 60C1280 85 1380 75 1440 65V120H0V45Z" fill="rgba(46, 134, 193, 0.04)"/>
          <path d="M0 120V70C240 20 480 15 720 35C960 55 1200 80 1440 90V120H0Z" fill="#FFFFFF"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;
