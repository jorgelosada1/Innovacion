import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { canUse3D } from './support';

// ===== CARGADOR DE ESCENAS 3D =====
// Las escenas (three.js) se cargan bajo demanda en un chunk aparte para no
// penalizar la carga inicial. Si el navegador no tiene WebGL se muestra el fallback.

const scenes = {
  logo: lazy(() => import('./LogoScene')),
  shapes: lazy(() => import('./FloatingShapes')),
  book: lazy(() => import('./BookScene')),
};

class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const Scene3D = ({ type, fallback = null, ...props }) => {
  const Scene = scenes[type];
  const sentinel = useRef(null);
  const [ready, setReady] = useState(false);
  const enabled = !!Scene && canUse3D();

  // three.js (~250 KB) solo se descarga cuando la sección está por aparecer
  // y el navegador está libre, para no retrasar la carga inicial de la página.
  useEffect(() => {
    if (!enabled || !sentinel.current) return;
    let idle = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const go = () => setReady(true);
        idle = 'requestIdleCallback' in window ? window.requestIdleCallback(go, { timeout: 1500 }) : window.setTimeout(go, 200);
      },
      { rootMargin: '300px' }
    );
    io.observe(sentinel.current);
    return () => {
      io.disconnect();
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [enabled]);

  if (!enabled) return fallback;
  if (!ready) {
    return (
      <>
        <span ref={sentinel} className="scene3d scene3d--sentinel" aria-hidden="true" />
        {fallback}
      </>
    );
  }

  return (
    <SceneBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Scene {...props} />
      </Suspense>
    </SceneBoundary>
  );
};

export default Scene3D;
