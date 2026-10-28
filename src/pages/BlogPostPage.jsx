import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts, formatDate, getBlogPost, readingTime } from '../data/blog';
import logoSolo from '../assets/images/LogoSolo.png';
import ShareButtons from '../components/ShareButtons';
import './BlogPostPage.css';

const WHATSAPP = 'https://wa.link/rgw8yn';

/* Ilustración animada del "puente": personas ↔ oportunidades */
const BridgeIllustration = () => (
  <figure className="bridge" data-reveal>
    <svg viewBox="0 0 640 220" className="bridge__svg" role="img" aria-label="Un puente que conecta personas con oportunidades">
      <defs>
        <linearGradient id="bridgeGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#2E86C1" />
          <stop offset="100%" stopColor="#F5A623" />
        </linearGradient>
        <radialGradient id="bridgeGlow">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Agua / horizonte */}
      <path d="M0 180 Q160 165 320 180 T640 180" className="bridge__wave" />
      <path d="M0 196 Q160 182 320 196 T640 196" className="bridge__wave bridge__wave--2" />

      {/* Pilares */}
      <rect x="62" y="110" width="76" height="80" rx="14" className="bridge__pillar" />
      <rect x="502" y="110" width="76" height="80" rx="14" className="bridge__pillar bridge__pillar--gold" />

      {/* Arco del puente */}
      <path id="bridgeArc" d="M100 112 Q320 -40 540 112" className="bridge__arc" />
      {[0.2, 0.35, 0.5, 0.65, 0.8].map((t) => {
        const x = 100 + (540 - 100) * t;
        const y = (1 - t) * (1 - t) * 112 + 2 * (1 - t) * t * -40 + t * t * 112;
        return <line key={t} x1={x} y1={y + 6} x2={x} y2={150} className="bridge__cable" />;
      })}
      <line x1="100" y1="150" x2="540" y2="150" className="bridge__deck" />

      {/* Puntos que cruzan el puente */}
      {[0, 1.3, 2.6].map((delay) => (
        <g key={delay}>
          <circle r="14" fill="url(#bridgeGlow)">
            <animateMotion dur="4s" begin={`${delay}s`} repeatCount="indefinite" rotate="auto">
              <mpath href="#bridgeArc" />
            </animateMotion>
          </circle>
          <circle r="6" fill="#F5A623">
            <animateMotion dur="4s" begin={`${delay}s`} repeatCount="indefinite">
              <mpath href="#bridgeArc" />
            </animateMotion>
          </circle>
        </g>
      ))}

      {/* Íconos de los extremos */}
      <g transform="translate(100 140)" className="bridge__icon">
        <circle cx="0" cy="-10" r="8" />
        <path d="M-14 14 a14 12 0 0 1 28 0" />
      </g>
      <g transform="translate(540 140)" className="bridge__icon">
        <path d="M-18 -8 L0 -17 L18 -8 L0 1 Z" />
        <path d="M-10 -4 v9 c6 5 14 5 20 0 v-9" />
      </g>
    </svg>
    <figcaption className="bridge__labels">
      <span>Personas</span>
      <span className="bridge__labels-mid">instituciones · territorios · sueños</span>
      <span>Oportunidades</span>
    </figcaption>
  </figure>
);

const Block = ({ block }) => {
  switch (block.type) {
    case 'lead':
      return <p className="blog-article__lead" data-reveal>{block.text}</p>;
    case 'h2':
      return <h2 id={block.id} className="blog-article__h2" data-reveal>{block.text}</h2>;
    case 'highlight':
      return (
        <blockquote className="blog-article__highlight" data-reveal>
          <span aria-hidden="true">“</span>
          <p>{block.text}</p>
        </blockquote>
      );
    case 'figure':
      return (
        <figure className="blog-article__figure" data-reveal>
          <img src={block.src} alt={block.alt} loading="lazy" />
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case 'bridge':
      return <BridgeIllustration />;
    case 'closing':
      return <p className="blog-article__closing" data-reveal>{block.text}</p>;
    default:
      return <p className="blog-article__p" data-reveal>{block.text}</p>;
  }
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getBlogPost(slug);
  const coverRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  // Parallax suave de la portada
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (coverRef.current) {
          coverRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0) scale(1.08)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Índice: resalta la sección visible
  useEffect(() => {
    if (!post) return;
    const headings = post.blocks.filter((b) => b.type === 'h2').map((b) => document.getElementById(b.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [post]);

  if (!post) {
    return (
      <div className="blog-missing">
        <h1>Artículo no encontrado</h1>
        <Link to="/noticias" className="blog-back">← Volver a noticias</Link>
      </div>
    );
  }

  const toc = post.blocks.filter((b) => b.type === 'h2');
  const others = blogPosts.filter((p) => p.slug !== post.slug);

  return (
    <article className="blog-post">
      <header className="blog-hero">
        <img ref={coverRef} src={post.cover} alt="" className="blog-hero__cover" aria-hidden="true" />
        <div className="blog-hero__overlay" />
        <div className="blog-hero__content">
          <Link to="/noticias" className="blog-back blog-back--light">← Noticias & Blog</Link>
          <span className="blog-hero__category">{post.category}</span>
          <h1 className="blog-hero__title">{post.title}</h1>
          <div className="blog-hero__meta">
            <img src={logoSolo} alt="" className="blog-hero__author-img" />
            <span>{post.author}</span>
            <span className="blog-hero__sep">•</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="blog-hero__sep">•</span>
            <span>{readingTime(post)} min de lectura</span>
          </div>
        </div>
        <div className="blog-hero__curve" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0 80V40C360 0 1080 0 1440 40V80Z" /></svg>
        </div>
      </header>

      <div className="blog-layout">
        <aside className="blog-toc" aria-label="Contenido del artículo">
          <p className="blog-toc__title">En este artículo</p>
          <ol>
            {toc.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className={activeId === h.id ? 'is-active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
          <ShareButtons title={post.title} />
        </aside>

        <div className="blog-article">
          {post.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}

          <div className="blog-article__tags">
            {post.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>

          <div className="blog-article__share-mobile">
            <ShareButtons title={post.title} />
          </div>

          <section className="blog-cta" data-reveal>
            <img src={post.closingImage} alt="" className="blog-cta__img" aria-hidden="true" />
            <div className="blog-cta__content">
              <span className="blog-cta__eyebrow">¿Y si estudias?</span>
              <h3>Tu historia también puede comenzar hoy</h3>
              <p>Te acompañamos de manera personalizada y gratuita en todo el proceso de inscripción.</p>
              <div className="blog-cta__actions">
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="blog-cta__btn blog-cta__btn--primary">
                  Hablar con un asesor
                </a>
                <Link to="/universidades" className="blog-cta__btn">Ver universidades</Link>
              </div>
            </div>
          </section>

          {others.length > 0 && (
            <div className="blog-more">
              <h3>Sigue leyendo</h3>
              {others.map((p) => (
                <Link key={p.slug} to={`/noticias/blog/${p.slug}`} className="blog-more__item">{p.title} →</Link>
              ))}
            </div>
          )}

          <Link to="/noticias" className="blog-back">← Volver a noticias</Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPostPage;
