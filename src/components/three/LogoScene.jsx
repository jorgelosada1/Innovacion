import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer, PerformanceMonitor, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion, useInView } from './support';

// ===== LOGO 3D DE INNOVACIÓN E-LEARNING =====
// Reconstrucción del isotipo (la "e", el arco y los cinco puntos dorados) con geometrías 3D
// brillantes, animadas y que siguen suavemente el puntero.

const BLUE = '#3a86cc';
const BLUE_DEEP = '#1b4f86';
const YELLOW = '#f5a623';

const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const clamp01 = (x) => Math.min(Math.max(x, 0), 1);

const useGlossy = (color, extra = {}) =>
  useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.16,
        metalness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        ...extra,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color]
  );

/* La "e": un anillo abierto + barra diagonal, con tapas redondeadas */
const LetterE = ({ material }) => {
  const R = 0.82;
  const tube = 0.21;
  const gap = 0.95;
  const arc = Math.PI * 2 - gap;
  return (
    <group rotation={[0, 0, 0.32]}>
      <mesh material={material} castShadow>
        <torusGeometry args={[R, tube, 40, 120, arc]} />
      </mesh>
      {/* Tapas redondeadas en los extremos del anillo */}
      <mesh material={material} position={[R, 0, 0]}>
        <sphereGeometry args={[tube, 32, 32]} />
      </mesh>
      <mesh material={material} position={[Math.cos(arc) * R, Math.sin(arc) * R, 0]}>
        <sphereGeometry args={[tube, 32, 32]} />
      </mesh>
      {/* Barra central */}
      <mesh material={material} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[tube * 0.92, R * 1.7, 12, 32]} />
      </mesh>
    </group>
  );
};

/* El arco inferior (la "sonrisa") */
const Smile = ({ material }) => {
  const R = 1.58;
  const tube = 0.2;
  return (
    <group rotation={[0, 0, Math.PI]}>
      <mesh material={material}>
        <torusGeometry args={[R, tube, 40, 140, Math.PI]} />
      </mesh>
      <mesh material={material} position={[R, 0, 0]}>
        <sphereGeometry args={[tube, 32, 32]} />
      </mesh>
      <mesh material={material} position={[-R, 0, 0]}>
        <sphereGeometry args={[tube, 32, 32]} />
      </mesh>
    </group>
  );
};

/* Los cinco puntos dorados que aparecen en secuencia y “respiran” */
const Orbs = ({ material, startRef, still }) => {
  const refs = useRef([]);
  const angles = [168, 132, 90, 48, 12].map((d) => THREE.MathUtils.degToRad(d));
  const R = 1.98;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() - startRef.current;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const appear = still ? 1 : easeOutBack(clamp01((t - 0.55 - i * 0.12) / 0.6));
      const bob = still ? 0 : Math.sin(t * 2.2 - i * 0.7) * 0.07;
      m.scale.setScalar(Math.max(appear, 0.0001));
      m.position.set(Math.cos(angles[i]) * R, Math.sin(angles[i]) * R + bob, 0);
    });
  });

  return angles.map((_, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)} material={material} castShadow>
      <sphereGeometry args={[0.2, 40, 40]} />
    </mesh>
  ));
};

/* Birrete de grado flotante */
const GradCap = (props) => {
  const dark = useGlossy(BLUE_DEEP, { roughness: 0.35 });
  const gold = useGlossy(YELLOW);
  return (
    <group {...props}>
      <mesh material={dark} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.95, 0.06, 0.95]} />
      </mesh>
      <mesh material={dark} position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.28, 32]} />
      </mesh>
      <mesh material={gold} position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>
      <mesh material={gold} position={[0.32, -0.12, 0.32]}>
        <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} />
      </mesh>
      <mesh material={gold} position={[0.32, -0.3, 0.32]}>
        <coneGeometry args={[0.06, 0.12, 12]} />
      </mesh>
    </group>
  );
};

/* Libro abierto flotante */
const Book = (props) => {
  const cover = useGlossy(YELLOW, { roughness: 0.3 });
  const pages = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6 }), []);
  return (
    <group {...props}>
      <mesh material={cover} position={[-0.27, 0, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.55, 0.05, 0.72]} />
      </mesh>
      <mesh material={cover} position={[0.27, 0, 0]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.55, 0.05, 0.72]} />
      </mesh>
      <mesh material={pages} position={[-0.25, 0.06, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.5, 0.06, 0.66]} />
      </mesh>
      <mesh material={pages} position={[0.25, 0.06, 0]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.5, 0.06, 0.66]} />
      </mesh>
    </group>
  );
};

/* Anillo orbital translúcido */
const OrbitRing = ({ radius, tilt, speed, color, opacity = 0.35 }) => {
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, 0.012, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
};

const Logo = ({ still }) => {
  const group = useRef();
  const startRef = useRef(0);
  const started = useRef(false);
  const follow = useRef(0);
  const blue = useGlossy(BLUE);
  const gold = useGlossy(YELLOW, { emissive: new THREE.Color('#f59e0b'), emissiveIntensity: 0.15 });

  useFrame(({ clock, pointer }) => {
    if (!started.current) {
      startRef.current = clock.getElapsedTime();
      started.current = true;
    }
    const g = group.current;
    if (!g) return;
    const t = clock.getElapsedTime() - startRef.current;
    if (still) {
      g.rotation.set(0, -0.25, 0);
      g.scale.setScalar(1);
      return;
    }
    const intro = easeOutCubic(clamp01(t / 1.6));
    const targetY = pointer.x * 0.45 + Math.sin(t * 0.6) * 0.12;
    const targetX = -pointer.y * 0.25;
    // Giro de entrada + seguimiento suave del puntero
    follow.current = THREE.MathUtils.lerp(follow.current, targetY, 0.05);
    g.rotation.y = THREE.MathUtils.lerp(-Math.PI * 1.1, 0, intro) + follow.current * intro;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.06);
    g.scale.setScalar(0.55 + 0.45 * easeOutBack(clamp01(t / 1.2)));
  });

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      <LetterE material={blue} />
      <Smile material={blue} />
      <Orbs material={gold} startRef={startRef} still={still} />
    </group>
  );
};

const LogoScene = () => {
  const wrap = useRef();
  const inView = useInView(wrap);
  const still = prefersReducedMotion();
  const [dpr, setDpr] = useState(1.75);

  return (
    <div ref={wrap} className="scene3d scene3d--logo" aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 8.6], fov: 35 }}
        frameloop={still ? 'demand' : inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Baja la resolución automáticamente en equipos con poco rendimiento */}
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <directionalLight position={[-4, -2, 2]} intensity={0.5} color="#9cc8ff" />

        <Float speed={still ? 0 : 1.6} rotationIntensity={0.15} floatIntensity={0.6}>
          <Logo still={still} />
        </Float>

        <OrbitRing radius={2.75} tilt={[1.2, 0.2, 0]} speed={0.25} color={BLUE} opacity={0.28} />
        <OrbitRing radius={3.05} tilt={[1.35, -0.35, 0.4]} speed={-0.18} color={YELLOW} opacity={0.3} />

        <Float speed={still ? 0 : 2.2} rotationIntensity={1.1} floatIntensity={1.4}>
          <GradCap position={[-2.65, 1.55, -0.6]} rotation={[0.35, 0.4, -0.25]} scale={0.78} />
        </Float>
        <Float speed={still ? 0 : 1.8} rotationIntensity={1} floatIntensity={1.2}>
          <Book position={[2.7, -1.25, -0.4]} rotation={[0.55, -0.5, 0.15]} scale={0.8} />
        </Float>

        {!still && <Sparkles count={36} scale={[7, 4.6, 2]} size={2.6} speed={0.35} color={YELLOW} opacity={0.8} />}

        {/* Entorno de reflejos generado en memoria (sin descargas) */}
        <Environment resolution={128}>
          <Lightformer intensity={2.2} position={[0, 4, -6]} scale={[12, 4, 1]} />
          <Lightformer intensity={1.4} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#cfe6ff" />
          <Lightformer intensity={1.2} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#ffe2b0" />
          <Lightformer form="ring" intensity={2} position={[0, 0, 6]} scale={3} />
        </Environment>
      </Canvas>
    </div>
  );
};

export default LogoScene;
