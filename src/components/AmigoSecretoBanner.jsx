import React from 'react';
import './AmigoSecretoBanner.css';

const AmigoSecretoBanner = ({ onOpenSorteo }) => {
  return (
    <div className="amigo-banner">
      <div className="amigo-banner__glow"></div>
      <div className="amigo-banner__content">
        <div className="amigo-banner__badge">
          <span className="amigo-banner__sparkle">✨</span>
          <span>Especial Amor & Amistad • Innovación e-Learning</span>
        </div>
        <h2 className="amigo-banner__title">
          ¡Llegó el Sorteo de <span className="amigo-banner__highlight">Amigo Secreto</span>! 🎁
        </h2>
        <p className="amigo-banner__desc">
          Celebremos juntos esta fecha especial en equipo. Ingresa para descubrir a quién te tocó endulzar y sorprender. 
        </p>
        <div className="amigo-banner__rules">
          <span className="amigo-banner__rule-item">🍬 Endulzada diaria</span>
          <span className="amigo-banner__rule-item">🤫 100% Secreto</span>
          <span className="amigo-banner__rule-item">🎉 Entrega sorpresa</span>
        </div>
      </div>

      <div className="amigo-banner__action">
        <button className="amigo-banner__btn" onClick={onOpenSorteo}>
          <span className="amigo-banner__btn-icon">🎁</span>
          <div className="amigo-banner__btn-text">
            <strong>¡Descubrir Mi Amigo Secreto!</strong>
            <small>Abrir tómbola mágica ✨</small>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AmigoSecretoBanner;
