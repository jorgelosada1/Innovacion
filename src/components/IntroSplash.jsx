import React, { useState, useEffect } from 'react';
import './IntroSplash.css';
import logoImg from '../assets/images/LogoSolo.png';

const IntroSplash = () => {
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('intro_seen');
    if (hasSeenIntro) {
      setVisible(false);
      setShouldRender(false);
      return;
    }

    const duration = 1800; // 1.8 seconds
    const interval = 30;
    const step = (100 / (duration / interval));

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    const hideTimer = setTimeout(() => {
      handleComplete();
    }, duration + 500);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleComplete = () => {
    setVisible(false);
    sessionStorage.setItem('intro_seen', 'true');
    setTimeout(() => setShouldRender(false), 600); // match CSS transition duration
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!shouldRender) return null;

  return (
    <div className={`intro-splash-overlay ${!visible ? 'splash-hidden' : ''}`}>
      <button className="skip-btn" onClick={handleSkip}>
        Saltar intro
      </button>
      <div className="intro-card">
        <div className="logo-container">
          <div className="glow-rings"></div>
          <img src={logoImg} alt="Logo" className="splash-logo" />
        </div>
        <h1 className="splash-title">INNOVACIÓN E-LEARNING S.A.S.</h1>
        <h2 className="splash-subtitle">Educación Superior de Calidad</h2>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default IntroSplash;
