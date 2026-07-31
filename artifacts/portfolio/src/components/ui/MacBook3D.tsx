/**
 * MacBook3D — Real 3D Apple MacBook Pro in React Three Fiber.
 *
 * Screen uses a CanvasTexture (reliable, no CSS3D layering issues).
 * Falls back to the CSS MacBookMockup when WebGL is unavailable.
 */
import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
  Component,
  Suspense,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useGetProjects } from '@workspace/api-client-react';
import { MacBookMockup } from '@/components/ui/MacBookMockup';

// ─────────────────────────────────────────────────────────────────────────────
// WebGL detection
// ─────────────────────────────────────────────────────────────────────────────
function supportsWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Error boundary — silent fallback to CSS mockup
// ─────────────────────────────────────────────────────────────────────────────
class MacBookErrorBoundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch(e: Error, i: ErrorInfo) {
    console.warn('[MacBook3D] falling back to CSS mockup:', e.message, i);
  }
  render() { return this.state.err ? <MacBookMockup /> : this.props.children; }
}

// ─────────────────────────────────────────────────────────────────────────────
// Slide types + placeholder data
// ─────────────────────────────────────────────────────────────────────────────
interface SlideItem {
  title: string;
  category?: string;
  imageUrl?: string | null;
}

const PLACEHOLDERS: SlideItem[] = [
  { title: 'Brand Identity Design', category: 'Branding' },
  { title: 'Social Media Pack', category: 'Social Media' },
  { title: 'Restaurant Menu', category: 'Print Design' },
  { title: 'Business Cards', category: 'Print Design' },
  { title: 'Marketing Campaign', category: 'Marketing' },
];

// Gradient stops for each placeholder
const PH_GRADIENTS: [string, string, string][] = [
  ['#1e0845', '#3d1080', '#0b0320'],
  ['#0a1840', '#173070', '#050e22'],
  ['#1a0640', '#380d7a', '#0c031c'],
  ['#0e1535', '#1e305e', '#060d1a'],
  ['#180545', '#341080', '#0a021e'],
];

// ─────────────────────────────────────────────────────────────────────────────
// Screen canvas dimensions
// ─────────────────────────────────────────────────────────────────────────────
const SCR_W = 820;
const SCR_H = 512;
const CHROME_H = 44;

// ─────────────────────────────────────────────────────────────────────────────
// Canvas 2D helpers
// ─────────────────────────────────────────────────────────────────────────────
function rrect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ─────────────────────────────────────────────────────────────────────────────
// Draw one complete screen frame onto a 2D canvas context
// ─────────────────────────────────────────────────────────────────────────────
function drawScreenFrame(
  ctx: CanvasRenderingContext2D,
  item: SlideItem,
  img: HTMLImageElement | null,
  contentAlpha: number,   // 0–1  (cross-fade alpha for content + image)
  placeholderIdx: number,
) {
  const W = SCR_W, H = SCR_H;

  // ── Background ────────────────────────────────────────────────────────────
  ctx.fillStyle = '#04040a';
  ctx.fillRect(0, 0, W, H);

  // ── Browser chrome bar ────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(16,16,24,0.97)';
  ctx.fillRect(0, 0, W, CHROME_H);

  // Separator line
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, CHROME_H);
  ctx.lineTo(W, CHROME_H);
  ctx.stroke();

  // Traffic lights
  const TLC = ['#ff5f57', '#febc2e', '#28c840'];
  TLC.forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(18 + i * 22, CHROME_H / 2, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // URL pill
  const pillX = 88, pillY = 9, pillW = W - 176, pillH = CHROME_H - 18;
  rrect(ctx, pillX, pillY, pillW, pillH, 5);
  ctx.fillStyle = 'rgba(255,255,255,0.055)';
  ctx.fill();
  // Lock icon (simple)
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🔒', pillX + 8, pillY + pillH - 5);
  // URL text
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('pixelnest.al', W / 2, pillY + pillH - 4);

  // Reload / share buttons
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  rrect(ctx, W - 78, 10, 28, 24, 5);
  ctx.fill();
  rrect(ctx, W - 44, 10, 28, 24, 5);
  ctx.fill();

  // ── Content area ─────────────────────────────────────────────────────────
  const CY = CHROME_H, CH = H - CY;

  ctx.save();
  ctx.globalAlpha = contentAlpha;

  if (img && img.complete && img.naturalWidth > 0) {
    // ── Project image (cover-fit) ─────────────────────────────────────────
    const scale = Math.max(W / img.naturalWidth, CH / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (W - dw) / 2;
    const dy = CY + (CH - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  } else {
    // ── Branded placeholder ───────────────────────────────────────────────
    const gc = PH_GRADIENTS[placeholderIdx % PH_GRADIENTS.length];
    const bgGrad = ctx.createLinearGradient(0, CY, W, CY + CH);
    bgGrad.addColorStop(0, gc[0]);
    bgGrad.addColorStop(0.55, gc[1]);
    bgGrad.addColorStop(1, gc[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, CY, W, CH);

    // Glow halo
    const mx = W / 2, my = CY + CH * 0.44;
    const halo = ctx.createRadialGradient(mx, my, 0, mx, my, CH * 0.45);
    halo.addColorStop(0, 'rgba(139,92,246,0.28)');
    halo.addColorStop(0.5, 'rgba(109,40,217,0.12)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.fillRect(0, CY, W, CH);

    // Grid pattern
    ctx.strokeStyle = 'rgba(139,92,246,0.07)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= W; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, CY); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (let gy = CY; gy <= H; gy += 40) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    // PN logo square
    const lx = W / 2 - 32, ly = CY + CH * 0.24, lw = 64, lh = 64;
    // Glow behind logo
    const logoGlow = ctx.createRadialGradient(W / 2, ly + lh / 2, 0, W / 2, ly + lh / 2, 70);
    logoGlow.addColorStop(0, 'rgba(139,92,246,0.45)');
    logoGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = logoGlow;
    ctx.fillRect(W / 2 - 70, ly - 10, 140, lh + 20);

    rrect(ctx, lx, ly, lw, lh, 14);
    const logoGrad = ctx.createLinearGradient(lx, ly, lx + lw, ly + lh);
    logoGrad.addColorStop(0, '#8b5cf6');
    logoGrad.addColorStop(1, '#a855f7');
    ctx.fillStyle = logoGrad;
    ctx.fill();
    // Inner shadow
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    rrect(ctx, lx + 0.75, ly + 0.75, lw - 1.5, lh - 1.5, 14);
    ctx.stroke();
    // PN text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PN', W / 2, ly + lh - 18);

    // Title text
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '600 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.title, W / 2, CY + CH * 0.66);

    // Category badge
    if (item.category) {
      const bText = item.category.toUpperCase();
      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif';
      const bMetrics = ctx.measureText(bText);
      const bw2 = bMetrics.width + 20;
      const bh2 = 22;
      rrect(ctx, W / 2 - bw2 / 2, CY + CH * 0.75, bw2, bh2, 11);
      ctx.fillStyle = 'rgba(139,92,246,0.28)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(139,92,246,0.5)';
      ctx.lineWidth = 1;
      rrect(ctx, W / 2 - bw2 / 2, CY + CH * 0.75, bw2, bh2, 11);
      ctx.stroke();
      ctx.fillStyle = 'rgba(196,167,255,0.95)';
      ctx.textAlign = 'center';
      ctx.fillText(bText, W / 2, CY + CH * 0.75 + bh2 - 7);
    }

    // Decorative bars at bottom
    const bars = [88, 64, 110, 52, 76];
    const barTotal = bars.reduce((a, b) => a + b + 10, -10);
    let bx = (W - barTotal) / 2;
    bars.forEach((bLen, bi) => {
      rrect(ctx, bx, CY + CH * 0.92, bLen, 4, 2);
      ctx.fillStyle = `rgba(139,92,246,${0.15 + bi * 0.07})`;
      ctx.fill();
      bx += bLen + 10;
    });
  }

  ctx.restore();

  // ── Bottom gradient overlay (always visible over content) ────────────────
  const shadow = ctx.createLinearGradient(0, H - 120, 0, H);
  shadow.addColorStop(0, 'transparent');
  shadow.addColorStop(1, 'rgba(0,0,0,0.88)');
  ctx.fillStyle = shadow;
  ctx.fillRect(0, H - 120, W, 120);

  // Category label
  if (item.category) {
    ctx.fillStyle = 'rgba(167,139,250,0.95)';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.letterSpacing = '0.08em';
    ctx.fillText(item.category.toUpperCase(), 20, H - 30);
    ctx.letterSpacing = '0';
  }
  // Title label
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(item.title, 20, H - 10);

  // ── Dot indicators ────────────────────────────────────────────────────────
  // Drawn by caller, skip here
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen state (lives in a ref, updated each frame)
// ─────────────────────────────────────────────────────────────────────────────
interface ScreenState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  items: SlideItem[];
  currentIdx: number;
  alpha: number;          // content alpha (1 = fully shown, 0 = fading out)
  transitioning: boolean; // true while fading out to next slide
  images: Map<string, HTMLImageElement>;
  needsDraw: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MacBook 3D mesh + animation
// ─────────────────────────────────────────────────────────────────────────────
const S = 1.25; // 25% bigger than baseline

// Pre-computed lid geometry
const LID_W = 3.22 * S;
const LID_H = 2.12 * S;
const LID_D = 0.10 * S;
const LID_FRONT_Z = LID_D / 2;
const SCR_PLANE_W = LID_W * 0.863;
const SCR_PLANE_H = LID_H * 0.82;
const SCR_PLANE_Y = -0.02 * S;

interface MacBookMeshProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  slides: SlideItem[];
}

function MacBookMesh({ mouseRef, slides }: MacBookMeshProps) {
  const groupRef = useRef<THREE.Group>(null!);

  // ── Initialize screen state synchronously (always client-side here) ──────
  const screenRef = useRef<ScreenState | null>(null);
  if (!screenRef.current) {
    const canvas = document.createElement('canvas');
    canvas.width = SCR_W;
    canvas.height = SCR_H;
    const ctx = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const items = PLACEHOLDERS;
    screenRef.current = {
      canvas, ctx, texture, items,
      currentIdx: 0, alpha: 1,
      transitioning: false,
      images: new Map(), needsDraw: true,
    };
    drawScreenFrame(ctx, items[0], null, 1, 0);
    texture.needsUpdate = true;
  }

  // ── Update items when slides prop changes ────────────────────────────────
  useEffect(() => {
    const s = screenRef.current!;
    const items = slides.length > 0 ? slides : PLACEHOLDERS;
    s.items = items;
    s.currentIdx = Math.min(s.currentIdx, items.length - 1);
    s.needsDraw = true;
    items.forEach(item => {
      if (!item.imageUrl || s.images.has(item.imageUrl)) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        s.images.set(item.imageUrl!, img);
        s.needsDraw = true;
      };
      img.onerror = () => {}; // silent
      img.src = item.imageUrl;
    });
  }, [slides]);

  // ── Slide interval ───────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const s = screenRef.current!;
      if (s.items.length > 1 && !s.transitioning) {
        s.transitioning = true;
      }
    }, 4200);
    return () => clearInterval(id);
  }, []);

  // ── Glow disk texture ────────────────────────────────────────────────────
  const glowTexture = useMemo(() => {
    const gc = document.createElement('canvas');
    gc.width = 256; gc.height = 128;
    const gx = gc.getContext('2d')!;
    const g = gx.createRadialGradient(128, 64, 0, 128, 64, 115);
    g.addColorStop(0, 'rgba(124,58,237,0.95)');
    g.addColorStop(0.3, 'rgba(109,40,217,0.5)');
    g.addColorStop(0.65, 'rgba(91,33,182,0.18)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    gx.fillStyle = g;
    gx.fillRect(0, 0, 256, 128);
    const t = new THREE.CanvasTexture(gc);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  // ── useFrame: animation + texture update ─────────────────────────────────
  useFrame(({ clock }, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const t = clock.elapsedTime;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Float (sine wave)
    g.position.y = Math.sin(t * 0.62) * 0.13;

    // Slow auto-rotation + mouse parallax
    const autoY = Math.sin(t * 0.18) * 0.10;  // ±5.7° slow drift
    const targetX = -0.09 + my * 0.11;
    const targetY = autoY + mx * 0.20;
    g.rotation.x += (targetX - g.rotation.x) * 0.04;
    g.rotation.y += (targetY - g.rotation.y) * 0.04;

    // Screen texture animation
    const s = screenRef.current!;

    if (s.transitioning) {
      s.alpha = Math.max(s.alpha - delta * 3.2, 0);
      if (s.alpha <= 0) {
        s.currentIdx = (s.currentIdx + 1) % s.items.length;
        s.transitioning = false;
        // alpha stays 0 → will be faded in on next frames
      }
      s.needsDraw = true;
    } else if (s.alpha < 1) {
      s.alpha = Math.min(s.alpha + delta * 3.2, 1);
      s.needsDraw = true;
    }

    if (s.needsDraw) {
      const item = s.items[s.currentIdx];
      const img = item.imageUrl ? (s.images.get(item.imageUrl) ?? null) : null;
      drawScreenFrame(s.ctx, item, img, s.alpha, s.currentIdx);
      s.texture.needsUpdate = true;
      // Stop redrawing once fully visible (unless transitioning)
      if (s.alpha >= 1 && !s.transitioning) s.needsDraw = false;
    }
  });

  const tex = screenRef.current.texture;

  return (
    <group ref={groupRef}>

      {/* ═══════════════════════════════════════════
          BASE (keyboard body)
          ═══════════════════════════════════════════ */}
      <RoundedBox
        args={[3.22 * S, 0.12 * S, 2.22 * S]}
        radius={0.055 * S}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#79797d"
          metalness={0.88}
          roughness={0.16}
          envMapIntensity={1.4}
        />
      </RoundedBox>

      {/* Back-edge chamfer accent */}
      <mesh position={[0, 0.038 * S, -1.06 * S]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.1 * S, 0.07 * S]} />
        <meshStandardMaterial color="#94949a" metalness={0.78} roughness={0.22} />
      </mesh>

      {/* Keyboard plate (dark inset) */}
      <mesh position={[0, 0.062 * S, 0.02 * S]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.88 * S, 1.88 * S]} />
        <meshStandardMaterial color="#1e1e21" roughness={0.8} metalness={0.08} />
      </mesh>

      {/* Key-row hints */}
      {([-0.58, -0.22, 0.14, 0.50] as number[]).map((z, row) => (
        <mesh key={row} position={[0, 0.063 * S, z * S]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[(2.38 - row * 0.04) * S, 0.088 * S]} />
          <meshStandardMaterial color="#272729" roughness={0.92} metalness={0.04} />
        </mesh>
      ))}

      {/* Trackpad */}
      <RoundedBox
        args={[0.88 * S, 0.007 * S, 0.58 * S]}
        radius={0.024 * S}
        smoothness={3}
        position={[0, 0.063 * S, 0.77 * S]}
        castShadow
      >
        <meshStandardMaterial color="#303034" metalness={0.65} roughness={0.25} />
      </RoundedBox>

      {/* Rubber foot pads × 4 */}
      {([[1.42, -1.02], [-1.42, -1.02], [1.42, 1.02], [-1.42, 1.02]] as [number, number][]).map(
        ([x, z], i) => (
          <RoundedBox
            key={i}
            args={[0.18 * S, 0.011 * S, 0.18 * S]}
            radius={0.03 * S}
            position={[x * S, -0.062 * S, z * S]}
          >
            <meshStandardMaterial color="#101012" roughness={0.97} metalness={0.02} />
          </RoundedBox>
        ),
      )}

      {/* ═══════════════════════════════════════════
          LID GROUP (hinge at back of base)
          lid_bottom = [0, 0.06, -1.1] in world
          lid centre = [0, 1.043S, -0.736S]
          rotation  = 0.36 rad (≈20° past vertical)
          ═══════════════════════════════════════════ */}
      <group position={[0, 1.043 * S, -0.736 * S]} rotation={[0.36, 0, 0]}>

        {/* Lid body (aluminum back) */}
        <RoundedBox
          args={[LID_W, LID_H, LID_D]}
          radius={0.05 * S}
          smoothness={4}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#79797d"
            metalness={0.88}
            roughness={0.16}
            envMapIntensity={1.4}
          />
        </RoundedBox>

        {/* Bezel (front face, black surround) */}
        <mesh position={[0, 0, LID_FRONT_Z + 0.001]}>
          <planeGeometry args={[LID_W - 0.08 * S, LID_H - 0.08 * S]} />
          <meshStandardMaterial color="#0c0c0f" roughness={0.52} metalness={0.12} />
        </mesh>

        {/* Camera notch */}
        <mesh position={[0, LID_H / 2 - 0.055 * S, LID_FRONT_Z + 0.002]}>
          <circleGeometry args={[0.026 * S, 20]} />
          <meshStandardMaterial color="#252527" metalness={0.55} roughness={0.38} />
        </mesh>
        {/* Camera ring */}
        <mesh position={[0, LID_H / 2 - 0.055 * S, LID_FRONT_Z + 0.0015]}>
          <ringGeometry args={[0.026 * S, 0.036 * S, 20]} />
          <meshStandardMaterial color="#1a1a1c" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Screen backing (true black) */}
        <mesh position={[0, SCR_PLANE_Y, LID_FRONT_Z + 0.002]}>
          <planeGeometry args={[SCR_PLANE_W + 0.02, SCR_PLANE_H + 0.02]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* ── CanvasTexture screen content ── */}
        <mesh position={[0, SCR_PLANE_Y, LID_FRONT_Z + 0.003]}>
          <planeGeometry args={[SCR_PLANE_W, SCR_PLANE_H]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>

        {/* Screen glass + clearcoat reflection */}
        <mesh position={[0, SCR_PLANE_Y, LID_FRONT_Z + 0.004]}>
          <planeGeometry args={[SCR_PLANE_W, SCR_PLANE_H]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.055}
            roughness={0.0}
            metalness={0.0}
            envMapIntensity={1.8}
            clearcoat={1}
            clearcoatRoughness={0.0}
            reflectivity={0.5}
            depthWrite={false}
          />
        </mesh>

        {/* Thin specular highlight strip (top-left corner glint) */}
        <mesh position={[-SCR_PLANE_W * 0.3, SCR_PLANE_H * 0.35, LID_FRONT_Z + 0.005]}
          rotation={[0, 0, -0.6]}>
          <planeGeometry args={[SCR_PLANE_W * 0.8, 0.018 * S]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.06}
            depthWrite={false}
          />
        </mesh>

        {/* Screen glow (illuminates front of lid) */}
        <pointLight
          position={[0, SCR_PLANE_Y, 0.4]}
          color="#8b5cf6"
          intensity={0.65}
          distance={3.5}
        />
      </group>

      {/* ═══════════════════════════════════════════
          PURPLE GLOW DISK (under laptop)
          ═══════════════════════════════════════════ */}
      <mesh
        position={[0, -0.22 * S, 0.15 * S]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[5.5 * S, 3.5 * S]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Shadow receiver plane */}
      <mesh
        position={[0, -0.23 * S, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        {/* @ts-ignore – THREE.ShadowMaterial exposed as JSX */}
        <shadowMaterial transparent opacity={0.35} />
      </mesh>

      {/* Screen bounce onto keyboard */}
      <pointLight
        position={[0, 0.4 * S, 0.35 * S]}
        color="#6d28d9"
        intensity={0.18}
        distance={2.5 * S}
      />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas wrapper (only mounted after WebGL confirmed)
// ─────────────────────────────────────────────────────────────────────────────
interface CanvasProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  slides: SlideItem[];
}

function MacBook3DCanvas({ mouseRef, slides }: CanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.4, 7.2], fov: 38 }}
      shadows="soft"
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>

        {/* ── Lighting ────────────────────────────────── */}
        {/* Ambient — base fill */}
        <ambientLight intensity={0.28} />

        {/* Key light — top-right, warm, sharp shadows */}
        <directionalLight
          position={[4.5, 9, 6]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0008}
          shadow-camera-near={0.5}
          shadow-camera-far={30}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />

        {/* Fill light — left, cool blue/indigo */}
        <pointLight position={[-5.5, 3.5, 4]} color="#818cf8" intensity={0.8} distance={16} />

        {/* Rim light — bottom-front, soft warm */}
        <pointLight position={[1.5, -3, 6.5]} color="#c4b5fd" intensity={0.3} distance={12} />

        {/* Back accent — purple from above-rear */}
        <pointLight position={[-2, 6, -4]} color="#7c3aed" intensity={0.55} distance={14} />

        {/* Under-glow contribution — matches disk */}
        <pointLight position={[0, -1.8 * S, 0.5]} color="#6d28d9" intensity={0.8} distance={5} />

        <Environment preset="city" />

        <MacBookMesh mouseRef={mouseRef} slides={slides} />

      </Suspense>
    </Canvas>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────────────────
export function MacBook3D() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const { data: projectsData } = useGetProjects();
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => { setWebglOk(supportsWebGL()); }, []);

  const slides: SlideItem[] = (projectsData ?? []).slice(0, 8).map(p => ({
    title: p.title,
    category: p.category ?? undefined,
    imageUrl: p.imageUrl ?? null,
  }));

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouseRef.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
  }, []);

  if (webglOk === null) return null;
  if (!webglOk) return <MacBookMockup />;

  return (
    <div
      className="w-full select-none"
      style={{ aspectRatio: '4 / 3', maxWidth: 620 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-hidden="true"
    >
      <MacBookErrorBoundary>
        <MacBook3DCanvas mouseRef={mouseRef} slides={slides} />
      </MacBookErrorBoundary>
    </div>
  );
}
