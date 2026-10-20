import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer, PerformanceMonitor, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion, useInView } from './support';
import logoSolo from '../../assets/images/LogoSolo.png';

// ===== LIBRO 3D =====
// Libro de tapa dura con portada generada en canvas. Flota, sigue el puntero y
// al abrirse gira la tapa y abanica las páginas.

const W = 3;
const H = 4.2;
const T = 0.5;
const BLUE = '#1f5f9e';
const GOLD = '#f5a623';

/* Portada dibujada en un canvas (marca, título y detalles dorados) */
const useCoverTexture = (title, subtitle) => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 1075;
    const ctx = canvas.getContext('2d');
    const { width: cw, height: ch } = canvas;

    const wrapText = (text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' ');
      let line = '';
      const lines = [];
      words.forEach((word) => {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
      lines.push(line);
      lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
      return lines.length;
    };

    const draw = (logo) => {
      if (cancelled) return;
      // Fondo degradado de marca
      const g = ctx.createLinearGradient(0, 0, cw, ch);
      g.addColorStop(0, '#163f63');
      g.addColorStop(0.55, '#2272a8');
      g.addColorStop(1, '#3498db');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cw, ch);

      // Círculos decorativos
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      for (let r = 120; r < 900; r += 70) {
        ctx.beginPath();
        ctx.arc(cw + 40, -40, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Puntos dorados como en el logo
      ctx.fillStyle = GOLD;
      [[90, 930, 26], [170, 990, 16], [660, 140, 20], [700, 230, 12]].forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Marco dorado
      ctx.strokeStyle = 'rgba(245, 166, 35, 0.9)';
      ctx.lineWidth = 4;
      ctx.strokeRect(46, 46, cw - 92, ch - 92);

      // Logo dentro de un círculo blanco
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cw / 2, 300, 120, 0, Math.PI * 2);
      ctx.fill();
      if (logo) ctx.drawImage(logo, cw / 2 - 95, 205, 190, 190);

      // Título
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 72px Outfit, sans-serif';
      const lines = wrapText(title.toUpperCase(), cw / 2, 540, cw - 160, 80);

      // Separador y subtítulo
      const y = 540 + lines * 80;
      ctx.fillStyle = GOLD;
      ctx.fillRect(cw / 2 - 60, y - 10, 120, 6);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '500 36px Inter, sans-serif';
      ctx.fillText(subtitle, cw / 2, y + 50);

      // Pie
      ctx.font = '700 26px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('INNOVACIÓN E-LEARNING S.A.S', cw / 2, ch - 90);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      setTexture(tex);
    };

    // Se dibuja cuando el logo y las fuentes están listos
    const img = new Image();
    const ready = document.fonts?.ready ?? Promise.resolve();
    img.onload = () => ready.then(() => draw(img));
    img.onerror = () => ready.then(() => draw(null));
    img.src = logoSolo;

    return () => {
      cancelled = true;
    };
  }, [title, subtitle]);

  return texture;
};

const Book = ({ open, title, subtitle, still }) => {
  const group = useRef();
  const cover = useRef();
  const pages = useRef([]);
  const coverTex = useCoverTexture(title, subtitle);

  const blue = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: BLUE, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
    []
  );
  const coverFront = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: coverTex ? '#ffffff' : BLUE,
        map: coverTex,
        roughness: 0.4,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
      }),
    [coverTex]
  );
  const paper = useMemo(() => new THREE.MeshStandardMaterial({ color: '#fbf7ee', roughness: 0.85 }), []);
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.3, metalness: 0.4 }), []);
  const pageMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#f6f1e7', roughness: 0.9, side: THREE.DoubleSide }),
    []
  );

  // Materiales por cara de la caja: +x, -x, +y, -y, +z (portada), -z (interior)
  const coverMaterials = useMemo(() => [blue, blue, blue, blue, coverFront, paper], [blue, coverFront, paper]);
  const pageAngles = [-2.5, -2.25, -1.95, -1.6, -1.2];

  useFrame(({ pointer, clock }, dt) => {
    const k = 1 - Math.pow(0.002, dt);
    const g = group.current;
    if (g) {
      const t = clock.getElapsedTime();
      const targetY = open ? 0.12 : -0.5 + pointer.x * 0.35 + (still ? 0 : Math.sin(t * 0.5) * 0.08);
      const targetX = open ? 0.05 : -pointer.y * 0.2 + 0.08;
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, k * 0.6);
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, k * 0.6);
      // Al abrirse se aleja un poco y se centra para que quepan ambas tapas
      g.position.x = THREE.MathUtils.lerp(g.position.x, open ? 0.95 : 0, k * 0.5);
      g.position.y = THREE.MathUtils.lerp(g.position.y, open ? -0.25 : 0, k * 0.5);
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, open ? 0.6 : 1, k * 0.5));
    }
    if (cover.current) {
      cover.current.rotation.y = THREE.MathUtils.lerp(cover.current.rotation.y, open ? -2.75 : 0, k * 0.55);
    }
    pages.current.forEach((p, i) => {
      if (!p) return;
      // Las páginas se abren en abanico con un pequeño retraso cada una
      const target = open ? pageAngles[i] : 0;
      p.rotation.y = THREE.MathUtils.lerp(p.rotation.y, target, k * (0.22 + i * 0.05));
    });
  });

  return (
    <group ref={group} rotation={[0.08, -0.5, 0]}>
      {/* Tapa trasera */}
      <mesh material={blue} position={[0, 0, -T / 2]}>
        <boxGeometry args={[W + 0.1, H + 0.1, 0.06]} />
      </mesh>
      {/* Lomo */}
      <mesh material={blue} position={[-W / 2 - 0.02, 0, 0]}>
        <boxGeometry args={[0.08, H + 0.1, T + 0.06]} />
      </mesh>
      {/* Bloque de páginas */}
      <mesh material={paper} position={[0.02, 0, -0.01]}>
        <boxGeometry args={[W - 0.08, H - 0.08, T - 0.1]} />
      </mesh>
      {/* Líneas doradas del lomo */}
      {[-1.5, 1.5].map((y) => (
        <mesh key={y} material={gold} position={[-W / 2 - 0.065, y, 0]}>
          <boxGeometry args={[0.01, 0.06, T]} />
        </mesh>
      ))}

      {/* Páginas sueltas que se abren en abanico */}
      {pageAngles.map((_, i) => (
        <group key={i} ref={(el) => (pages.current[i] = el)} position={[-W / 2 + 0.04, 0, T / 2 - 0.06 - i * 0.012]}>
          <mesh material={pageMat} position={[(W - 0.12) / 2, 0, 0]}>
            <planeGeometry args={[W - 0.12, H - 0.14]} />
          </mesh>
        </group>
      ))}

      {/* Tapa frontal con bisagra en el lomo */}
      <group ref={cover} position={[-W / 2, 0, T / 2]}>
        <mesh material={coverMaterials} position={[W / 2 + 0.05, 0, 0]}>
          <boxGeometry args={[W + 0.1, H + 0.1, 0.06]} />
        </mesh>
      </group>

      {/* Cinta marcapáginas */}
      <mesh material={gold} position={[0.6, -H / 2 - 0.25, 0.05]}>
        <boxGeometry args={[0.16, 0.6, 0.01]} />
      </mesh>
    </group>
  );
};

const BookScene = ({ open = false, title = 'Libro digital', subtitle = 'Biblioteca INNE', onSelect }) => {
  const wrap = useRef();
  const inView = useInView(wrap);
  const still = prefersReducedMotion();
  const [dpr, setDpr] = useState(1.75);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hover && !open ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hover, open]);

  return (
    <div ref={wrap} className="scene3d scene3d--book" aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 9.2], fov: 35 }}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 6]} intensity={1.8} />
        <directionalLight position={[-5, -2, 3]} intensity={0.5} color="#9cc8ff" />

        <Float speed={still || open ? 0 : 1.5} rotationIntensity={0.25} floatIntensity={0.7}>
          <group
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            scale={hover && !open ? 1.04 : 1}
          >
            <Book open={open} title={title} subtitle={subtitle} still={still} />
          </group>
        </Float>

        {!still && <Sparkles count={40} scale={[9, 6, 3]} size={3} speed={0.4} color={GOLD} opacity={0.9} />}

        <Environment resolution={128}>
          <Lightformer intensity={2.2} position={[0, 4, -6]} scale={[12, 4, 1]} />
          <Lightformer intensity={1.4} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#cfe6ff" />
          <Lightformer intensity={1.2} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#ffe2b0" />
        </Environment>
      </Canvas>
    </div>
  );
};

export default BookScene;
