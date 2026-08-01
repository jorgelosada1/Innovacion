import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/dataManager';
import './LoginPage.css';
import logoImg from '../assets/images/Logo.png';

const LoginPage = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(user, pass)) {
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <section className="login-page">
      <div className="login-page__card">
        <img src={logoImg} alt="Logo" className="login-page__logo" />
        <h1 className="login-page__title">Iniciar Sesión</h1>
        <p className="login-page__subtitle">Panel de Administración</p>
        <form onSubmit={handleSubmit} className="login-page__form">
          <div className="login-page__field">
            <label className="login-page__label">Usuario</label>
            <input type="text" value={user} onChange={e => setUser(e.target.value)} className="login-page__input" placeholder="Usuario" required />
          </div>
          <div className="login-page__field">
            <label className="login-page__label">Contraseña</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="login-page__input" placeholder="Contraseña" required />
          </div>
          {error && <p className="login-page__error">{error}</p>}
          <button type="submit" className="login-page__btn">Ingresar</button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
