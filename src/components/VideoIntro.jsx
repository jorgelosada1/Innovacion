import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import logoSolo from '../assets/images/LogoSolo.png';
import './VideoIntro.css';

// ===== VIDEO DE PRESENTACIÓN =====
// Intro a pantalla completa con el video de YouTube antes de mostrar la página.
// Se ve una sola vez por visita y solo al entrar por la página de inicio.
// Para quitarla basta con dejar INTRO_VIDEO_ID en null.
export const INTRO_VIDEO_ID = 'S1iEdlDkZhM';

const SEEN_KEY = 'inne_video_intro_visto';
const READY_TIMEOUT = 12000;
const IDLE_HIDE_MS = 2500;

// YouTube a veces activa los subtítulos solos (sobre todo con el video en silencio)
const hideCaptions = (player) => {
  try {
    player.unloadModule('captions');
    player.unloadModule('cc');
    player.setOption('captions', 'track', {});
  } catch {
    /* el reproductor aún no tiene el módulo de subtítulos */
  }
};

const readSeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === 'true';
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, 'true');
    // Evita que la intro del logo aparezca justo después del video
    sessionStorage.setItem('intro_seen', 'true');
  } catch {
    /* almacenamiento no disponible */
  }
};

// Carga la API de YouTube una sola vez
let ytApiPromise = null;
const loadYouTubeApi = () => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return ytApiPromise;
};

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

const VideoIntro = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(() => !!INTRO_VIDEO_ID && location.pathname === '/' && !readSeen());
  const [leaving, setLeaving] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const [idle, setIdle] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const rootRef = useRef(null);
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const idleTimer = useRef(null);

  // Se marca antes de que la intro del logo revise si ya se mostró
  useLayoutEffect(() => {
    if (visible) markSeen();
  }, [visible]);

  const close = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      try {
        playerRef.current?.destroy();
      } catch {
        /* el reproductor ya no existe */
      }
    }, 900);
  }, []);

  // Bloquea el scroll y permite cerrar con Escape
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [visible, close]);

  // Crea el reproductor de YouTube
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    // Si YouTube no responde (bloqueado o sin conexión) no dejamos la página tapada
    const failSafe = setTimeout(() => {
      if (!cancelled && !playerRef.current?.getPlayerState) close();
    }, READY_TIMEOUT);

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !hostRef.current) return;
        playerRef.current = new YT.Player(hostRef.current, {
          videoId: INTRO_VIDEO_ID,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            rel: 0,
            cc_load_policy: 0,
            playsinline: 1,
            modestbranding: 1,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
          },
          events: {
            onReady: (e) => {
              e.target.mute();
              hideCaptions(e.target);
              e.target.playVideo();
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PAUSED) setPaused(true);
              if (e.data === YT.PlayerState.PLAYING) {
                setPaused(false);
                hideCaptions(e.target);
                setPlaying(true);
              }
              if (e.data === YT.PlayerState.ENDED) close();
            },
            onError: () => close(),
          },
        });
      })
      .catch(() => close());

    return () => {
      cancelled = true;
      clearTimeout(failSafe);
    };
  }, [visible, close]);

  // Barra de progreso
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      setProgress({ current: p.getCurrentTime(), duration: p.getDuration() || 0 });
    }, 250);
    return () => clearInterval(id);
  }, [playing]);

  // Los controles se ocultan solos tras unos segundos sin mover el mouse o tocar la pantalla
  const wake = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_HIDE_MS);
  }, []);

  // Al empezar el video arranca la cuenta para ocultar los controles
  useEffect(() => {
    if (!playing) return;
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_HIDE_MS);
    return () => clearTimeout(idleTimer.current);
  }, [playing]);

  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      rootRef.current?.requestFullscreen?.().catch(() => {});
    }
  };

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p?.getPlayerState) return;
    if (p.getPlayerState() === window.YT?.PlayerState?.PLAYING) {
      p.pauseVideo();
      setPaused(true);
    } else {
      p.playVideo();
      setPaused(false);
    }
  }, []);

  // Barra espaciadora o tecla K para pausar / reanudar
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => {
      if (e.code === 'Space' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, togglePlay]);

  const toggleSound = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      p.setVolume(100);
    } else {
      p.mute();
    }
    setMuted(!muted);
  };

  if (!visible) return null;

  const pct = progress.duration ? (progress.current / progress.duration) * 100 : 0;

  return createPortal(
    <div
      ref={rootRef}
      className={`video-intro ${leaving ? 'video-intro--leaving' : ''} ${playing ? 'video-intro--playing' : ''} ${idle && !paused ? 'video-intro--idle' : ''} ${paused ? 'video-intro--paused' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Video de presentación"
      onPointerMove={wake}
      onPointerDown={wake}
      onKeyDown={wake}
    >
      {/* Pantalla de carga con el logo mientras arranca el video */}
      <div className="video-intro__loader" aria-hidden={playing}>
        <div className="video-intro__logo">
          <span className="video-intro__ring" />
          <img src={logoSolo} alt="" />
        </div>
        <p>Innovación E-learning presenta</p>
      </div>

      <div className="video-intro__stage">
        <div className="video-intro__frame">
          <div ref={hostRef} />
        </div>
        {/* Capa que evita que aparezcan los menús de YouTube al pasar el mouse */}
        <div className="video-intro__shield" onClick={togglePlay} />
        {/* Indicador central cuando el video está en pausa */}
        <span className="video-intro__paused-icon" aria-hidden="true">
          <svg width="38" height="38" viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" /></svg>
        </span>
      </div>

      <div className="video-intro__vignette" aria-hidden="true" />

      <header className="video-intro__top">
        <span className="video-intro__brand">
          <img src={logoSolo} alt="" />
          Innovación E-learning
        </span>
        <button className="video-intro__skip" onClick={close}>
          Saltar intro
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
        </button>
      </header>

      <footer className="video-intro__bottom">
        <button
          className="video-intro__icon-btn video-intro__play"
          onClick={togglePlay}
          aria-label={paused ? 'Reproducir' : 'Pausar'}
          title={paused ? 'Reproducir (espacio)' : 'Pausar (espacio)'}
        >
          {paused ? (
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1.2" /><rect x="14" y="4.5" width="4" height="15" rx="1.2" /></svg>
          )}
        </button>
        <button className={`video-intro__sound ${muted ? 'video-intro__sound--muted' : ''}`} onClick={toggleSound}>
          {muted ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              Activar sonido
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>
              Silenciar
            </>
          )}
        </button>
        <div className="video-intro__progress" aria-hidden="true">
          <div style={{ width: `${pct}%` }} />
        </div>
        <span className="video-intro__time">
          {formatTime(progress.current)} / {formatTime(progress.duration)}
        </span>
        {document.fullscreenEnabled && (
          <button
            className="video-intro__icon-btn"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {fullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
            )}
          </button>
        )}
      </footer>
    </div>,
    document.body
  );
};

export default VideoIntro;
