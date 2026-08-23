import { useState, useEffect } from 'react';
import './HeroBanner.css';
import logoSolo from '../assets/images/LogoSolo.png';

const HeroBanner = () => {
  const [isAssembled, setIsAssembled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAssembled(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-banner" id="inicio">
      {/* Decorative background rings */}
      <div className="hero-banner__decorations">
        <div className="hero-banner__circle hero-banner__circle--1"></div>
        <div className="hero-banner__circle hero-banner__circle--2"></div>
      </div>

      {/* Center logo icon with assembly dots animation */}
      <div className={`hero-banner__logo-wrapper ${isAssembled ? 'hero-banner__logo-wrapper--assembled' : ''}`}>
        {/* Converging dots animation */}
        <div className="hero-banner__dots-assembly">
          <span className="hero-banner__dot-p hero-banner__dot-p--1"></span>
          <span className="hero-banner__dot-p hero-banner__dot-p--2"></span>
          <span className="hero-banner__dot-p hero-banner__dot-p--3"></span>
          <span className="hero-banner__dot-p hero-banner__dot-p--4"></span>
          <span className="hero-banner__dot-p hero-banner__dot-p--5"></span>
          <span className="hero-banner__dot-p hero-banner__dot-p--6"></span>
        </div>

        <img
          src={logoSolo}
          alt="Innovación e-Learning"
          className="hero-banner__logo-img"
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
