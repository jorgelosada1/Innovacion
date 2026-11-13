import { useState } from 'react';
import './VideoInstitucional.css';

// ===== VIDEO INSTITUCIONAL =====
// Muestra la portada del video y solo carga YouTube cuando la persona da clic en "play",
// para que la página de inicio siga cargando rápido.

const VIDEO_ID = 'S1iEdlDkZhM';

const VideoInstitucional = () => {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`);
  const fallback = `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`;

  return (
    <section className="video-inne" aria-labelledby="video-inne-title">
      <div className="video-inne__container">
        <div className="video-inne__head" data-reveal>
          <span className="video-inne__badge">
            <span className="video-inne__badge-dot" aria-hidden="true"></span>
            Conócenos
          </span>
          <h2 id="video-inne-title" className="video-inne__title">
            Esto es <span className="video-inne__accent">Innovación E-learning</span>
          </h2>
          <p className="video-inne__sub">Dale play y descubre quiénes somos y cómo te acompañamos a dar el siguiente paso.</p>
        </div>

        <div className="video-inne__frame" data-reveal style={{ '--reveal-delay': '120ms' }}>
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title="Video de Innovación E-learning"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <button type="button" className="video-inne__poster" onClick={() => setPlaying(true)} aria-label="Reproducir el video de Innovación E-learning">
              {thumb && <img
                src={thumb}
                alt=""
                loading="lazy"
                decoding="async"
                onLoad={(e) => {
                  // YouTube devuelve una imagen gris de 120 px cuando no existe la versión en alta
                  if (e.currentTarget.naturalWidth < 200 && thumb !== fallback) setThumb(fallback);
                }}
                // Si YouTube no responde, queda el fondo de color de la marca con el botón de play
                onError={() => setThumb(thumb === fallback ? '' : fallback)}
              />}
              <span className="video-inne__shade" aria-hidden="true"></span>
              <span className="video-inne__play" aria-hidden="true">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" /></svg>
              </span>
              <span className="video-inne__label" aria-hidden="true">Ver video</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoInstitucional;
