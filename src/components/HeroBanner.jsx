import { useRef, useState, useEffect } from 'react';
import './HeroBanner.css';
import logoVideo from '../assets/Animacion_Logo.mp4';

const HeroBanner = () => {
  const videoRef = useRef(null);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented or interrupted:', err);
        });
      }
    }
  }, []);

  const handleEnded = () => {
    setHasEnded(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <section className="hero-banner" id="inicio">
      {/* Decorative background rings */}
      <div className="hero-banner__decorations">
        <div className="hero-banner__circle hero-banner__circle--1"></div>
        <div className="hero-banner__circle hero-banner__circle--2"></div>
      </div>

      {/* Center logo animation wrapper */}
      <div className="hero-banner__logo-wrapper">
        <video
          ref={videoRef}
          src={logoVideo}
          className={`hero-banner__logo-video ${hasEnded ? 'hero-banner__logo-video--ended' : ''}`}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onEnded={handleEnded}
          aria-label="Animación de logo Innovación e-Learning"
        />
      </div>

      {/* Curved bottom */}
      <div className="hero-banner__curve">
        <svg viewBox="0 0 1440 140" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 140V100C240 20 480 0 720 20C960 40 1200 80 1440 100V140H0Z" fill="#FFFFFF"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;
