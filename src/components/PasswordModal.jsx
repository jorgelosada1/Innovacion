import { useState, useEffect, useRef } from 'react';
import './PasswordModal.css';

const PasswordModal = ({ isOpen, onClose, onSuccess, title = 'Acceso Restringido', message = 'Ingresa la contraseña para continuar' }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef(null);
  const CORRECT_PASSWORD = '0228';

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('Contraseña incorrecta');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="pw-modal-overlay" onClick={onClose}>
      <div className={`pw-modal ${isShaking ? 'pw-modal--shake' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="pw-modal__close" onClick={onClose} aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="pw-modal__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h3 className="pw-modal__title">{title}</h3>
        <p className="pw-modal__message">{message}</p>

        <form onSubmit={handleSubmit} className="pw-modal__form">
          <div className="pw-modal__input-wrapper">
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Contraseña"
              className={`pw-modal__input ${error ? 'pw-modal__input--error' : ''}`}
              autoComplete="off"
            />
            {error && <span className="pw-modal__error">{error}</span>}
          </div>
          <button type="submit" className="pw-modal__submit">
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
