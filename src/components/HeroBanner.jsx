import './HeroBanner.css';
import logoSolo from '../assets/images/LogoSolo.png';

const HeroBanner = () => {
  return (
    <section className="hero-banner" id="inicio">
      {/* Decorative background rings */}
      <div className="hero-banner__decorations">
        <div className="hero-banner__circle hero-banner__circle--1"></div>
        <div className="hero-banner__circle hero-banner__circle--2"></div>
      </div>

      {/* Center logo icon with organized arc dots */}
      <div className="hero-banner__logo-wrapper">
        <img
          src={logoSolo}
          alt="Innovación e-Learning"
          className="hero-banner__logo-img"
        />

        {/* 5 dots on the right side, ascending in size from bottom (small) to top (large) */}
        <div className="hero-banner__arc-dots" aria-hidden="true">
          <span className="hero-banner__arc-dot hero-banner__arc-dot--1"></span>
          <span className="hero-banner__arc-dot hero-banner__arc-dot--2"></span>
          <span className="hero-banner__arc-dot hero-banner__arc-dot--3"></span>
          <span className="hero-banner__arc-dot hero-banner__arc-dot--4"></span>
          <span className="hero-banner__arc-dot hero-banner__arc-dot--5"></span>
        </div>
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
