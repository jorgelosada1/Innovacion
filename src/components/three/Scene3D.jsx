import { Component, lazy, Suspense } from 'react';
import { hasWebGL } from './support';

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
  if (!Scene || !hasWebGL()) return fallback;

  return (
    <SceneBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Scene {...props} />
      </Suspense>
    </SceneBoundary>
  );
};

export default Scene3D;
