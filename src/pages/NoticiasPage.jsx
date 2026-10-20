import { useParams, Link } from 'react-router-dom';
import { getNoticias, getNoticiaById } from '../utils/dataManager';
import { blogPosts, formatDate, readingTime } from '../data/blog';
import { encuentro } from '../data/encuentro2026';
import Scene3D from '../components/three/Scene3D';
import logoSolo from '../assets/images/LogoSolo.png';
import './NoticiasPage.css';

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

    return (
      <div className="noticias-page">
        <div className="noticias-hero detail-hero">
          <span className="noticias-badge">Noticia</span>
          <h1>{noticia.titulo}</h1>
          <p className="noticia-fecha">{noticia.fecha}</p>
        </div>
        
        <div className="noticias-container detail-view">
          <div className="noticia-content">
            <p>{noticia.contenido}</p>
          </div>
          
          <Link to="/noticias" className="btn-back">
            <span>&larr;</span> Volver a noticias
          </Link>
        </div>
      </div>
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
        <div className="noticias-grid">
          {noticias.map((noticia, index) => (
            <div key={noticia.id} className="noticia-card" data-reveal style={{ '--reveal-delay': `${(index % 2) * 120}ms` }}>
              <div className="noticia-card-body">
                <span className="noticia-card-fecha">{noticia.fecha}</span>
                <h3 className="noticia-card-titulo">{noticia.titulo}</h3>
                <p className="noticia-card-resumen">{noticia.resumen}</p>
                <Link to={`/noticias/${noticia.id}`} className="noticia-card-link">
                  Leer más <span className="arrow">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticiasPage;
