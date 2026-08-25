import { useRef, useState, useEffect } from 'react';
import './HeroBanner.css';
import logoVideo from '../assets/Animacion_Logo.mp4';

const HeroBanner = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Reproduce únicamente cuando el usuario se desplaza/llega a la sección
        if (entry.isIntersecting && !hasPlayed) {
          setHasPlayed(true);
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('Autoplay on scroll prevented:', err);
            });
          }
        }
      },
      {
        threshold: 0.35, // Se activa cuando el 35% de la sección es visible
      }
    );

    observer.observe(section);

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
    <section className="hero-banner" id="inicio" ref={sectionRef}>
      {/* Decorative background elements */}
      <div className="hero-banner__decorations">
        <div className="hero-banner__circle hero-banner__circle--1"></div>
        <div className="hero-banner__circle hero-banner__circle--2"></div>
        <div className="hero-banner__circle hero-banner__circle--3"></div>
      </div>

      {/* Center logo animation wrapper with seamless white integration */}
      <div className="hero-banner__logo-wrapper">
        <video
          ref={videoRef}
          src={logoVideo}
          className={`hero-banner__logo-video ${hasEnded ? 'hero-banner__logo-video--ended' : ''}`}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onEnded={handleEnded}
          aria-label="Animación de logo Innovación e-Learning"
        />
      </div>

      {/* Curved bottom - elegante curva en degradado suave de transición */}
      <div className="hero-banner__curve">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 50C320 110 720 10 1100 65C1280 95 1380 85 1440 75V120H0V50Z" fill="rgba(46, 134, 193, 0.06)"/>
          <path d="M0 120V75C240 25 480 15 720 35C960 55 1200 85 1440 95V120H0Z" fill="#F8FAFC"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;
