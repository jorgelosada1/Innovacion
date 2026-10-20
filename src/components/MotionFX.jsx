import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// ===== EFECTOS DE MOVIMIENTO GLOBALES =====
// - [data-reveal]: aparece con animación al entrar en pantalla (variantes: up, left, right, zoom, flip).
//   Retraso opcional con style={{ '--reveal-delay': '120ms' }}.
// - [data-tilt]: tarjeta con inclinación 3D y brillo que sigue al puntero.
// - Barra de progreso de lectura en la parte superior.

const REVEALED = 'is-revealed';

const MotionFX = () => {
  const location = useLocation();
  const progressRef = useRef(null);

  // Reveal on scroll
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.documentElement.classList.add('no-reveal');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(REVEALED);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const scan = (root) => {
      if (root.nodeType !== 1) return;
      if (root.matches('[data-reveal]') && !root.classList.contains(REVEALED)) io.observe(root);
      root.querySelectorAll(`[data-reveal]:not(.${REVEALED})`).forEach((el) => io.observe(el));
    };

    scan(document.body);

    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => m.addedNodes.forEach(scan));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [location.pathname]);

  // 3D tilt (solo con puntero fino, p. ej. mouse)
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduced) return;

    let active = null;
    let frame = 0;

    const reset = (el) => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.classList.remove('is-tilting');
    };

    const onMove = (e) => {
      const el = e.target.closest?.('[data-tilt]');
      if (active && active !== el) reset(active);
      active = el;
      if (!el) return;

      if (!el.querySelector(':scope > .tilt-glare')) {
        const glare = document.createElement('span');
        glare.className = 'tilt-glare';
        glare.setAttribute('aria-hidden', 'true');
        el.appendChild(glare);
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const strength = parseFloat(el.dataset.tilt) || 8;
        el.classList.add('is-tilting');
        el.style.setProperty('--ry', `${(px - 0.5) * strength * 2}deg`);
        el.style.setProperty('--rx', `${(0.5 - py) * strength * 2}deg`);
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
      });
    };

    const onLeave = () => {
      if (active) reset(active);
      active = null;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Barra de progreso de scroll
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [location.pathname]);

  return <div className="scroll-progress" ref={progressRef} aria-hidden="true" />;
};

export default MotionFX;
