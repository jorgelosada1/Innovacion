import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiUnavailableError, getSession, login } from '../utils/dataManager';
import './LoginPage.css';
import logoImg from '../assets/images/Logo.png';
import Seo from '../components/Seo';

const LoginPage = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  // Si ya hay una sesión activa, directo al panel
  useEffect(() => {
    getSession()
      .then((admin) => admin && navigate('/admin', { replace: true }))
      .catch(() => {});
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await login(user.trim(), pass);
      navigate('/admin');
    } catch (err) {
      setError(
        err instanceof ApiUnavailableError
          ? 'El panel necesita el servidor de datos. Verifica que la API esté publicada en el hosting.'
          : err.message
      );
      setPass('');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="login-page">
      <Seo path="/login" />
      <div className="login-page__card">
        <img src={logoImg} alt="Logo" className="login-page__logo" />
        <h1 className="login-page__title">Iniciar Sesión</h1>
        <p className="login-page__subtitle">Panel de Administración</p>
        <form onSubmit={handleSubmit} className="login-page__form">
          <div className="login-page__field">
            <label className="login-page__label" htmlFor="login-user">Usuario</label>
            <input id="login-user" type="text" value={user} onChange={(e) => setUser(e.target.value)} className="login-page__input" placeholder="Usuario" autoComplete="username" required />
          </div>
          <div className="login-page__field">
            <label className="login-page__label" htmlFor="login-pass">Contraseña</label>
            <input id="login-pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="login-page__input" placeholder="Contraseña" autoComplete="current-password" required />
          </div>
          {error && <p className="login-page__error" role="alert">{error}</p>}
          <button type="submit" className="login-page__btn" disabled={sending}>
            {sending ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
