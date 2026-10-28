import { useParams, Link } from 'react-router-dom';
import { getNoticias, getNoticiaById } from '../utils/dataManager';
import { blogPosts, formatDate, readingTime } from '../data/blog';
import { encuentro } from '../data/encuentro2026';
import Scene3D from '../components/three/Scene3D';
import ShareButtons from '../components/ShareButtons';
import logoSolo from '../assets/images/LogoSolo.png';
import imgGrado from '../assets/images/blog-conecta-grado.jpg';
import imgVirtual from '../assets/images/blog-conecta-virtual.jpg';
import imgEstudiantes from '../assets/images/blog-conecta-tarjeta.jpg';
import './NoticiasPage.css';
import './BlogPostPage.css';

// Imagen por defecto para las noticias que no tienen una propia
const FALLBACK_IMAGES = [imgGrado, imgVirtual, imgEstudiantes];
const noticiaImage = (noticia, index) =>
  noticia.imagen || FALLBACK_IMAGES[Math.max(index, 0) % FALLBACK_IMAGES.length];

const fechaNoticia = (fecha) => (/^\d{4}-\d{2}-\d{2}$/.test(fecha || '') ? formatDate(fecha) : fecha);

const minutosLectura = (texto = '') => Math.max(1, Math.round(texto.split(/\s+/).filter(Boolean).length / 200));

/* Tarjeta de noticia con el mismo estilo del blog */
const NoticiaCard = ({ noticia, index }) => (
  <Link
    to={`/noticias/${noticia.id}`}
    className="news-card"
    data-reveal
    style={{ '--reveal-delay': `${(index % 2) * 120}ms` }}
  >
    <div className="news-card__media">
      <img src={noticiaImage(noticia, index)} alt="" loading="lazy" />
      <span className="news-card__category">Noticia</span>
    </div>
    <div className="news-card__body">
      <div className="blog-feature__meta">
        <time dateTime={noticia.fecha}>{fechaNoticia(noticia.fecha)}</time>
        <span>•</span>
        <span>{minutosLectura(noticia.contenido)} min de lectura</span>
      </div>
      <h3 className="news-card__title">{noticia.titulo}</h3>
      <p className="news-card__excerpt">{noticia.resumen}</p>
      <div className="blog-feature__footer">
        <span className="blog-feature__author">
          <img src={logoSolo} alt="" />
          Innovación E-learning
        </span>
        <span className="blog-feature__cta">
          Leer más
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </div>
    </div>
  </Link>
);

const NoticiasPage = () => {
  const { id } = useParams();

  if (id) {
    const noticia = getNoticiaById(id);
    if (!noticia) {
      return (
        <div className="noticias-page">
          <div className="noticias-hero">
            <span className="noticias-badge">Error</span>
            <h1>Noticia no encontrada</h1>
          </div>
          <div className="noticias-container detail-view">
            <Link to="/noticias" className="btn-back">
              <span>&larr;</span> Volver a noticias
            </Link>
          </div>
        </div>
      );
    }

    const index = getNoticias().findIndex((n) => n.id === noticia.id);
    const parrafos = (noticia.contenido || '').split(/\n\s*\n/).filter((t) => t.trim());

    return (
      <article className="blog-post blog-post--simple">
        <header className="blog-hero">
          <img src={noticiaImage(noticia, index)} alt="" className="blog-hero__cover" aria-hidden="true" />
          <div className="blog-hero__overlay" />
          <div className="blog-hero__content">
            <Link to="/noticias" className="blog-back blog-back--light">← Noticias & Blog</Link>
            <span className="blog-hero__category">Noticia</span>
            <h1 className="blog-hero__title">{noticia.titulo}</h1>
            <div className="blog-hero__meta">
              <img src={logoSolo} alt="" className="blog-hero__author-img" />
              <span>Innovación E-learning</span>
              <span className="blog-hero__sep">•</span>
              <time dateTime={noticia.fecha}>{fechaNoticia(noticia.fecha)}</time>
              <span className="blog-hero__sep">•</span>
              <span>{minutosLectura(noticia.contenido)} min de lectura</span>
            </div>
          </div>
          <div className="blog-hero__curve" aria-hidden="true">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0 80V40C360 0 1080 0 1440 40V80Z" /></svg>
          </div>
        </header>

        <div className="blog-layout">
          <div className="blog-article">
            {noticia.resumen && <p className="blog-article__lead">{noticia.resumen}</p>}
            {parrafos.map((t, i) => (
              <p key={i} className="blog-article__p">{t}</p>
            ))}
            <ShareButtons title={noticia.titulo} />
            <Link to="/noticias" className="blog-back news-detail__back">← Volver a noticias</Link>
          </div>
        </div>
      </article>
    );
  }

  const noticias = getNoticias();
  const [featured, ...restPosts] = blogPosts;

  return (
    <div className="noticias-page">
      <div className="noticias-hero">
        <Scene3D type="shapes" variant="light" count={10} seed={5} />
        <div className="noticias-hero__inner" data-reveal>
          <span className="noticias-badge">Últimas Novedades</span>
          <h1>Nuestras <span className="accent">Noticias</span></h1>
          <p className="noticias-hero__sub">Novedades, historias y reflexiones del equipo de Innovación E-learning.</p>
        </div>
      </div>

      <div className="noticias-container list-view">
        {/* === PRÓXIMO EVENTO === */}
        <Link to={`/noticias/${encuentro.slug}`} className="event-feature" data-reveal>
          <img src={encuentro.banner} alt={encuentro.title} className="event-feature__banner" />
          <div className="event-feature__body">
            <div>
              <span className="event-feature__chip">Próximo evento</span>
              <h2 className="event-feature__title">{encuentro.title}</h2>
              <p className="event-feature__meta">{encuentro.dates} · {encuentro.places}</p>
            </div>
            <span className="event-feature__cta">
              Ver agenda y recomendaciones
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </Link>

        {/* === MINI BLOG === */}
        {featured && (
          <section className="blog-feature" aria-labelledby="blog-inne-title">
            <div className="blog-feature__head" data-reveal>
              <span className="blog-feature__chip">
                <span className="blog-feature__chip-dot"></span>
                Blog INNE
              </span>
              <h2 id="blog-inne-title">Historias que <span className="text-shimmer">conectan</span></h2>
            </div>

            <Link to={`/noticias/blog/${featured.slug}`} className="blog-feature__card" data-reveal>
              <div className="blog-feature__media">
                <img src={featured.thumb || featured.cover} alt="Estudiantes compartiendo y aprendiendo juntos" loading="lazy" />
                <span className="blog-feature__category">{featured.category}</span>
              </div>
              <div className="blog-feature__body">
                <div className="blog-feature__meta">
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                  <span>•</span>
                  <span>{readingTime(featured)} min de lectura</span>
                </div>
                <h3 className="blog-feature__title">{featured.title}</h3>
                <p className="blog-feature__excerpt">{featured.excerpt}</p>
                <div className="blog-feature__footer">
                  <span className="blog-feature__author">
                    <img src={logoSolo} alt="" />
                    {featured.author}
                  </span>
                  <span className="blog-feature__cta">
                    Leer artículo
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </div>
              </div>
            </Link>

            {restPosts.length > 0 && (
              <div className="blog-feature__list">
                {restPosts.map((post) => (
                  <Link key={post.slug} to={`/noticias/blog/${post.slug}`} className="blog-feature__mini" data-reveal>
                    <img src={post.thumb || post.cover} alt="" loading="lazy" />
                    <span>{post.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        <h2 className="noticias-section-title" data-reveal>Últimas noticias</h2>
        <div className="news-grid">
          {noticias.map((noticia, index) => (
            <NoticiaCard key={noticia.id} noticia={noticia} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticiasPage;
