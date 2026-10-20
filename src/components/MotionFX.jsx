import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// ===== EFECTOS DE MOVIMIENTO GLOBALES =====
// - [data-reveal]: aparece con animación al entrar en pantalla (variantes: up, left, right, zoom, flip).
//   Retraso opcional con style={{ '--reveal-delay': '120ms' }}.
// - Barra de progreso de lectura en la parte superior.

// Se marca con un atributo (no con una clase): si React cambia el className
// del elemento (p. ej. al abrir una pregunta frecuente) la marca se conserva
const REVEALED = 'data-revealed';

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
            entry.target.setAttribute(REVEALED, '');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const scan = (root) => {
      if (root.nodeType !== 1) return;
      if (root.matches('[data-reveal]') && !root.hasAttribute(REVEALED)) io.observe(root);
      root.querySelectorAll(`[data-reveal]:not([${REVEALED}])`).forEach((el) => io.observe(el));
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
