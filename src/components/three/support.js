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
    // Descarta los motores gráficos por software (sin tarjeta gráfica): el 3D sería muy lento.
    // Es el caso de los servidores de Google que miden la velocidad (PageSpeed / Lighthouse).
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) webglCache = false;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
};

/**
 * El 3D se usa solo en equipos capaces: con WebGL acelerado, sin modo de ahorro de
 * datos y con memoria/procesador suficientes. En los demás se muestra la versión estática.
 */
export const canUse3D = () => {
  if (typeof navigator === 'undefined' || !hasWebGL()) return false;
  const saveData = navigator.connection?.saveData;
  const lowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
  const lowCpu = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4;
  return !(saveData || lowMemory || lowCpu);
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
