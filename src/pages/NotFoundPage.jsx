import { Link } from 'react-router-dom';
import './NotFoundPage.css';
import Seo from '../components/Seo';

const NotFoundPage = () => (
  <section className="not-found">
    <Seo notFound />
    <div className="not-found__card">
      <span className="not-found__code">404</span>
      <h1>Esta página no existe</h1>
      <p>Es posible que el enlace haya cambiado o que la dirección esté mal escrita.</p>
      <div className="not-found__actions">
        <Link to="/" className="not-found__btn not-found__btn--primary">Ir al inicio</Link>
        <Link to="/noticias" className="not-found__btn">Ver noticias</Link>
      </div>
    </div>
  </section>
);

export default NotFoundPage;
