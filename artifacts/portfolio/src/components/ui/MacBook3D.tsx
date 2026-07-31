import React, {
  useRef,
  useEffect,
  useState,
  Suspense,
  useCallback,
  Component,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useGetProjects } from '@workspace/api-client-react';
import { MacBookMockup } from '@/components/ui/MacBookMockup';

// ─────────────────────────────────────────────────────────────────────────────
// WebGL support detection
// ─────────────────────────────────────────────────────────────────────────────
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Error boundary — falls back to CSS MacBook on any Three.js crash
// ─────────────────────────────────────────────────────────────────────────────
interface EBState { hasError: boolean }
class MacBookErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false };
  static getDerivedStateFromError(): EBState { return { hasError: true }; }
  componentDidCatch(err: Error, info: ErrorInfo) {
    console.warn('[MacBook3D] WebGL error, falling back to CSS mockup:', err.message, info);
  }
  render() {
    if (this.state.hasError) return <MacBookMockup />;
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared material
// ─────────────────────────────────────────────────────────────────────────────
const SPACE_GRAY = '#78787c';
const SPACE_GRAY_LIGHT = '#929297';

// ─────────────────────────────────────────────────────────────────────────────
// Screen carousel — pure DOM, rendered inside <Html>
// ─────────────────────────────────────────────────────────────────────────────
interface SlideItem {
  title: string;
  category?: string;
  imageUrl?: string | null;
  bg?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder slides shown when DB has no projects yet
// ─────────────────────────────────────────────────────────────────────────────
const PLACEHOLDERS: SlideItem[] = [
  {
    title: 'Brand Identity',
    category: 'Branding',
    bg: 'linear-gradient(135deg, #1e0845 0%, #2d1069 50%, #0d0520 100%)',
  },
  {
    title: 'Social Media Pack',
    category: 'Social Media',
    bg: 'linear-gradient(135deg, #0a1a40 0%, #0e2d6e 50%, #060e22 100%)',
  },
  {
    title: 'Menu & Print Design',
    category: 'Print Design',
    bg: 'linear-gradient(135deg, #200840 0%, #3d1080 50%, #0f041c 100%)',
  },
];

function ScreenCarousel({ slides }: { slides: SlideItem[] }) {
  const [idx, setIdx] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const items = slides.length > 0 ? slides : PLACEHOLDERS;

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setIdx(i => (i + 1) % items.length);
        setOpacity(1);
      }, 380);
    }, 3800);
    return () => clearInterval(timer);
  }, [items.length]);

  const item = items[idx % items.length];

  return (
    <div
      style={{
        width: '458px',
        height: '286px',
        background: '#040408',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* ── Browser chrome ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.025)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          {(['#ff5f57', '#febc2e', '#28c840'] as const).map((c, i) => (
            <div
              key={i}
              style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            height: 17,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 10px',
          }}
        >
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.03em' }}>
            pixelnest.al
          </span>
        </div>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.04)',
            flexShrink: 0,
          }}
        />
      </div>

      {/* ── Slide content ── */}
      <div
        style={{
          position: 'relative',
          height: 'calc(100% - 33px)',
          overflow: 'hidden',
          opacity,
          transition: 'opacity 0.38s ease',
        }}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            draggable={false}
          />
        ) : (
          /* Branded placeholder */
          <div
            style={{
              width: '100%',
              height: '100%',
              background: item.bg || PLACEHOLDERS[0].bg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {/* PN logo mark */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(139,92,246,0.5)',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>PN</span>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.02em',
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontSize: 9,
                color: 'rgba(139,92,246,0.85)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              {item.category}
            </div>
            {/* Decorative bars */}
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              {[48, 36, 56, 28].map((w, i) => (
                <div
                  key={i}
                  style={{
                    width: w,
                    height: 3,
                    borderRadius: 2,
                    background: `rgba(139,92,246,${0.15 + i * 0.08})`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Gradient overlay with title */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 14px 10px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        >
          {item.category && (
            <div
              style={{
                fontSize: 8,
                color: 'rgba(167,139,250,0.95)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 3,
                fontWeight: 500,
              }}
            >
              {item.category}
            </div>
          )}
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.92)',
              letterSpacing: '0.01em',
            }}
          >
            {item.title}
          </div>
        </div>
      </div>

      {/* ── Dot indicators ── */}
      {items.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 9,
            right: 12,
            display: 'flex',
            gap: 4,
            pointerEvents: 'none',
          }}
        >
          {items.slice(0, 8).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === idx % items.length ? 12 : 4,
                height: 4,
                borderRadius: 2,
                background:
                  i === idx % items.length
                    ? 'rgba(139,92,246,1)'
                    : 'rgba(255,255,255,0.22)',
                transition: 'all 0.35s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D MacBook mesh
// ─────────────────────────────────────────────────────────────────────────────
interface MacBookMeshProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  slides: SlideItem[];
}

function MacBookMesh({ mouseRef, slides }: MacBookMeshProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Smooth floating
    g.position.y = Math.sin(t * 0.65) * 0.09;

    // Mouse parallax — lerp toward target
    const targetRotX = -0.08 + my * 0.09;
    const targetRotY = 0.14 + mx * 0.18;
    g.rotation.x += (targetRotX - g.rotation.x) * 0.045;
    g.rotation.y += (targetRotY - g.rotation.y) * 0.045;
  });

  // ── Shared material props ──
  const aluminumArgs: [string, number, number] = [SPACE_GRAY, 0.86, 0.17];
  const aluminumLightArgs: [string, number, number] = [SPACE_GRAY_LIGHT, 0.82, 0.2];

  return (
    <group ref={groupRef}>
      {/* ════════════════════════════════════
          BASE (keyboard body)
          ════════════════════════════════════ */}
      <RoundedBox
        args={[3.22, 0.12, 2.22]}
        radius={0.055}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={aluminumArgs[0]} metalness={aluminumArgs[1]} roughness={aluminumArgs[2]} />
      </RoundedBox>

      {/* Back chamfer accent (lighter strip at back edge) */}
      <mesh position={[0, 0.038, -1.06]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.1, 0.08]} />
        <meshStandardMaterial color={aluminumLightArgs[0]} metalness={0.75} roughness={0.25} />
      </mesh>

      {/* Keyboard plate */}
      <mesh position={[0, 0.062, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.88, 1.88]} />
        <meshStandardMaterial color="#1f1f22" roughness={0.78} metalness={0.08} />
      </mesh>

      {/* Key rows (decorative) */}
      {[-0.55, -0.2, 0.15, 0.5].map((z, row) => (
        <mesh key={row} position={[0, 0.063, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4 - row * 0.05, 0.09]} />
          <meshStandardMaterial color="#2a2a2d" roughness={0.9} metalness={0.05} />
        </mesh>
      ))}

      {/* Trackpad */}
      <RoundedBox
        args={[0.88, 0.007, 0.58]}
        radius={0.025}
        smoothness={3}
        position={[0, 0.063, 0.76]}
        castShadow
      >
        <meshStandardMaterial color="#313135" metalness={0.62} roughness={0.27} />
      </RoundedBox>

      {/* Foot pads (4 corners) */}
      {(
        [
          [1.4, -1.0],
          [-1.4, -1.0],
          [1.4, 1.0],
          [-1.4, 1.0],
        ] as [number, number][]
      ).map(([x, z], i) => (
        <RoundedBox
          key={i}
          args={[0.18, 0.012, 0.18]}
          radius={0.03}
          position={[x, -0.062, z]}
        >
          <meshStandardMaterial color="#111113" roughness={0.95} metalness={0.05} />
        </RoundedBox>
      ))}

      {/* ════════════════════════════════════
          LID GROUP
          Position computed from hinge constraint:
            lid_bottom meets base_back_top at [0, 0.06, -1.1]
            lid rotation = 0.36 rad past vertical
          ════════════════════════════════════ */}
      <group position={[0, 1.043, -0.736]} rotation={[0.36, 0, 0]}>
        {/* Lid body */}
        <RoundedBox
          args={[3.22, 2.12, 0.1]}
          radius={0.05}
          smoothness={4}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={aluminumArgs[0]} metalness={aluminumArgs[1]} roughness={aluminumArgs[2]} />
        </RoundedBox>

        {/* Inner bezel (front face black surround) */}
        <mesh position={[0, 0, 0.052]}>
          <planeGeometry args={[3.12, 2.02]} />
          <meshStandardMaterial color="#0d0d10" roughness={0.55} metalness={0.05} />
        </mesh>

        {/* Camera dot */}
        <mesh position={[0, 0.975, 0.053]}>
          <circleGeometry args={[0.028, 20]} />
          <meshStandardMaterial color="#272729" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Camera ring */}
        <mesh position={[0, 0.975, 0.0525]}>
          <ringGeometry args={[0.028, 0.038, 20]} />
          <meshStandardMaterial color="#1a1a1c" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Screen glass (slightly larger than content, provides border) */}
        <mesh position={[0, -0.03, 0.0535]}>
          <planeGeometry args={[2.82, 1.82]} />
          <meshStandardMaterial
            color="#060609"
            roughness={0.08}
            metalness={0.15}
          />
        </mesh>

        {/* Screen content base */}
        <mesh position={[0, -0.03, 0.054]}>
          <planeGeometry args={[2.76, 1.75]} />
          <meshBasicMaterial color="#030307" />
        </mesh>

        {/* ── HTML carousel ── */}
        <Html
          transform
          occlude={false}
          position={[0, -0.03, 0.055]}
          scale={0.006}
          style={{
            width: '458px',
            height: '291px',
            overflow: 'hidden',
            pointerEvents: 'none',
            userSelect: 'none',
            borderRadius: '2px',
          }}
          zIndexRange={[1, 1]}
        >
          <ScreenCarousel slides={slides} />
        </Html>

        {/* Screen reflection film */}
        <mesh position={[0, -0.03, 0.0545]}>
          <planeGeometry args={[2.76, 1.75]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.018}
            roughness={0}
            metalness={0}
          />
        </mesh>

        {/* Subtle glow from screen illuminating lid bottom */}
        <pointLight
          position={[0, -1.0, 0.3]}
          color="#7c3aed"
          intensity={0.4}
          distance={3}
        />
      </group>

      {/* Screen glow bouncing off keyboard */}
      <pointLight
        position={[0, 0.5, 0.3]}
        color="#6d28d9"
        intensity={0.15}
        distance={2.5}
      />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner canvas — only mounted when WebGL is confirmed available
// ─────────────────────────────────────────────────────────────────────────────
function MacBook3DCanvas({
  mouseRef,
  slides,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  slides: SlideItem[];
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.25, 5.8], fov: 40 }}
      shadows="soft"
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[4, 9, 6]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.001}
        />
        <pointLight position={[-5, 3, 4]} color="#818cf8" intensity={0.7} distance={14} />
        <pointLight position={[2, -3, 6]} color="#c4b5fd" intensity={0.25} distance={10} />
        <pointLight position={[-2, 5, -3]} color="#7c3aed" intensity={0.5} distance={12} />
        <Environment preset="city" />
        <MacBookMesh mouseRef={mouseRef} slides={slides} />
      </Suspense>
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function MacBook3D() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const { data: projectsData } = useGetProjects();
  // null = not yet checked, true/false = result
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglOk(supportsWebGL());
  }, []);

  const slides: SlideItem[] = (projectsData || [])
    .slice(0, 8)
    .map(p => ({
      title: p.title,
      category: p.category ?? undefined,
      imageUrl: p.imageUrl ?? null,
    }));

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
  }, []);

  // Waiting for client-side check
  if (webglOk === null) return null;

  // No WebGL — graceful CSS fallback
  if (!webglOk) return <MacBookMockup />;

  return (
    <div
      className="w-full select-none"
      style={{ aspectRatio: '4 / 3', maxWidth: 560 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      <MacBookErrorBoundary>
        <MacBook3DCanvas mouseRef={mouseRef} slides={slides} />
      </MacBookErrorBoundary>
    </div>
  );
}
