import { useState, useEffect } from 'react';
import './HeroBanner.css';
import logoSolo from '../assets/images/LogoSolo.png';

const HeroBanner = () => {
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  useEffect(() => {
    // Total animation sequence duration: ~3.8 seconds
    const timer = setTimeout(() => {
      setIsAnimationFinished(true);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-banner" id="inicio">
      {/* Decorative background rings */}
      <div className="hero-banner__decorations">
        <div className="hero-banner__circle hero-banner__circle--1"></div>
        <div className="hero-banner__circle hero-banner__circle--2"></div>
      </div>

      {/* Center logo container */}
      <div className={`hero-banner__logo-wrapper ${isAnimationFinished ? 'hero-banner__logo-wrapper--finished' : ''}`}>
        {/* Animated Vector SVG Logo (Construction phase) */}
        {!isAnimationFinished && (
          <svg className="hero-banner__svg-anim" viewBox="0 0 240 240" width="340" height="340">
            {/* 1. Central "E" Icon */}
            <path
              className="logo-seq logo-seq--e"
              d="M 148 112 C 148 82, 92 82, 92 115 C 92 144, 142 144, 142 128 L 94 128"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 2. Lower Arc / Line */}
            <path
              className="logo-seq logo-seq--arc"
              d="M 48 132 A 72 72 0 0 0 192 132"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="15"
              strokeLinecap="round"
            />

            {/* 3. The 4 Original Dots (Sequenced 1 by 1) */}
            <circle cx="48" cy="94" r="9" fill="#FFFFFF" className="logo-seq logo-seq--dot1" />
            <circle cx="82" cy="56" r="9" fill="#FFFFFF" className="logo-seq logo-seq--dot2" />
            <circle cx="158" cy="56" r="9" fill="#FFFFFF" className="logo-seq logo-seq--dot3" />
            <circle cx="192" cy="94" r="9" fill="#FFFFFF" className="logo-seq logo-seq--dot4" />
          </svg>
        )}

        {/* Final complete logo image */}
        <img
          src={logoSolo}
          alt="Innovación e-Learning"
          className={`hero-banner__logo-img ${isAnimationFinished ? 'hero-banner__logo-img--show' : ''}`}
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
