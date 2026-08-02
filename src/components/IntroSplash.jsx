import { useState, useEffect } from 'react';
import './IntroSplash.css';
import logoImg from '../assets/images/LogoSolo.png';

const IntroSplash = () => {
  const [phase, setPhase] = useState('loading'); // 'loading' | 'fadeout' | 'done'
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem('intro_seen');
    if (seen) {
      setPhase('done');
      return;
    }

    // Lock scroll during intro
    document.body.style.overflow = 'hidden';

    const duration = 2200;
    const tick = 20;
    const step = 100 / (duration / tick);

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, tick);

    const fadeTimer = setTimeout(() => {
      setPhase('fadeout');
      document.body.style.overflow = '';
      sessionStorage.setItem('intro_seen', 'true');
    }, duration + 400);

    const doneTimer = setTimeout(() => {
      setPhase('done');
    }, duration + 1100);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = '';
    };
  }, []);

  const handleSkip = () => {
    setPhase('fadeout');
    document.body.style.overflow = '';
    sessionStorage.setItem('intro_seen', 'true');
    setTimeout(() => setPhase('done'), 600);
  };

  if (phase === 'done') return null;

  return (
    <div className={`intro-splash ${phase === 'fadeout' ? 'intro-splash--hidden' : ''}`}>
      {/* Skip button */}
      <button className="intro-splash__skip" onClick={handleSkip}>
        Saltar intro →
      </button>

      {/* Particles */}
      <div className="intro-splash__particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`intro-splash__particle intro-splash__particle--${i + 1}`} />
        ))}
      </div>

      {/* Center card */}
      <div className="intro-splash__card">
        {/* Logo with glow rings */}
        <div className="intro-splash__logo-wrap">
          <div className="intro-splash__ring intro-splash__ring--1" />
          <div className="intro-splash__ring intro-splash__ring--2" />
          <div className="intro-splash__ring intro-splash__ring--3" />
          <img src={logoImg} alt="Innovación E-Learning" className="intro-splash__logo" />
        </div>

        {/* Title */}
        <h1 className="intro-splash__title">
          INNOVACIÓN <span className="intro-splash__title--accent">E-LEARNING</span> S.A.S.
        </h1>

        {/* Subtitle */}
        <p className="intro-splash__subtitle">Educación Superior de Calidad</p>

        {/* Progress bar */}
        <div className="intro-splash__progress">
          <div
            className="intro-splash__progress-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="intro-splash__loading-text">Cargando experiencia...</p>
      </div>
    </div>
  );
};

export default IntroSplash;
