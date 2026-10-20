import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Lightformer, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion, useInView } from './support';

// ===== FIGURAS 3D FLOTANTES =====
// Fondo decorativo para secciones: figuras brillantes que flotan y reaccionan al puntero.
// Se ubican hacia los bordes para no competir con el texto central.

const PALETTES = {
  light: ['#2f7fc4', '#f5a623', '#7db8ea', '#1b3a5c'],
  dark: ['#ffffff', '#f5a623', '#7db8ea', '#ffd27a'],
};

const GEOMETRIES = ['icosahedron', 'torus', 'sphere', 'octahedron', 'torusKnot', 'capsule'];

// Generador pseudoaleatorio con semilla para que la composición sea estable entre renders
const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const Shape = ({ type, color, wire, ...props }) => {
  const material = useMemo(
    () =>
      wire
        ? new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.45 })
        : new THREE.MeshPhysicalMaterial({
            color,
            roughness: 0.2,
            metalness: 0.1,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
          }),
    [color, wire]
  );

  return (
    <mesh material={material} {...props}>
      {type === 'icosahedron' && <icosahedronGeometry args={[0.55, 0]} />}
      {type === 'torus' && <torusGeometry args={[0.45, 0.16, 24, 64]} />}
      {type === 'sphere' && <sphereGeometry args={[0.38, 32, 32]} />}
      {type === 'octahedron' && <octahedronGeometry args={[0.5, 0]} />}
      {type === 'torusKnot' && <torusKnotGeometry args={[0.32, 0.11, 100, 16]} />}
      {type === 'capsule' && <capsuleGeometry args={[0.2, 0.5, 8, 24]} />}
    </mesh>
  );
};

// Ubica las figuras según el tamaño visible del canvas: siempre hacia los bordes,
// sin importar si la sección es alta o muy panorámica
const Shapes = ({ shapes, still }) => {
  const { width, height } = useThree((state) => state.viewport);
  const unit = Math.min(height / 7, width / 12);

  return shapes.map((s, i) => (
    <Float key={i} speed={still ? 0 : s.speed} rotationIntensity={1.4} floatIntensity={1.2 * unit}>
      <Shape
        type={s.type}
        color={s.color}
        wire={s.wire}
        position={[s.side * s.xFrac * (width / 2), s.yFrac * (height / 2), s.z]}
        rotation={s.rotation}
        scale={s.scale * unit}
      />
    </Float>
  ));
};

const Rig = ({ children, still }) => {
  const ref = useRef();
  useFrame(({ pointer }) => {
    if (!ref.current || still) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * 0.18, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.12, 0.04);
  });
  return <group ref={ref}>{children}</group>;
};

const FloatingShapes = ({ variant = 'light', count = 12, seed = 7, className = '' }) => {
  const wrap = useRef();
  const inView = useInView(wrap);
  const still = prefersReducedMotion();
  const palette = PALETTES[variant] || PALETTES.light;
  const [dpr, setDpr] = useState(1.5);

  const shapes = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, (_, i) => {
      // Repartidas a los lados (entre el 48 % y el 95 % del medio ancho) para dejar libre el centro
      const side = i % 2 === 0 ? -1 : 1;
      const xFrac = 0.48 + rand() * 0.47;
      const yFrac = (rand() - 0.5) * 1.6;
      const z = -rand() * 3;
      return {
        side,
        xFrac,
        yFrac,
        z,
        type: GEOMETRIES[Math.floor(rand() * GEOMETRIES.length)],
        color: palette[Math.floor(rand() * palette.length)],
        wire: rand() > 0.78,
        rotation: [rand() * Math.PI, rand() * Math.PI, 0],
        scale: 0.55 + rand() * 0.75,
        speed: 1 + rand() * 1.6,
      };
    });
  }, [count, seed, palette]);

  return (
    <div ref={wrap} className={`scene3d scene3d--shapes ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 9], fov: 45 }}
        frameloop={still ? 'demand' : inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 5]} intensity={1.4} />
        <Rig still={still}>
          <Shapes shapes={shapes} still={still} />
        </Rig>
        <Environment resolution={64}>
          <Lightformer intensity={2} position={[0, 4, -5]} scale={[10, 3, 1]} />
          <Lightformer intensity={1.2} position={[-5, 0, 3]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#cfe6ff" />
          <Lightformer intensity={1} position={[5, 0, 3]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#ffe2b0" />
        </Environment>
      </Canvas>
    </div>
  );
};

export default FloatingShapes;
