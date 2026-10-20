import { useEffect, useState } from 'react';

// ===== 3D SUPPORT HELPERS =====
// Detecta WebGL y preferencia de movimiento reducido para decidir si montamos las escenas 3D.

let webglCache = null;

export const hasWebGL = () => {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement('canvas');
    // Si el navegador solo puede renderizar por software (muy lento), usamos el fallback estático
    const opts = { failIfMajorPerformanceCaveat: true };
    const gl = canvas.getContext('webgl2', opts) || canvas.getContext('webgl', opts);
    webglCache = !!(window.WebGLRenderingContext && gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pausa el render del canvas cuando sale de pantalla (ahorra batería y GPU)
export const useInView = (ref, rootMargin = '120px') => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
};
