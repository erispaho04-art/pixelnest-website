/**
 * MacBook3D — Premium 3D Apple MacBook Pro in React Three Fiber.
 *
 * Improvements over v1:
 *  • 28% larger (S = 1.60 vs 1.25)
 *  • Actual /logo.png rendered on screen with animated dark-purple gradient
 *  • Pulsing screen glow behind logo
 *  • Smoother, slower float (0.38 Hz vs 0.62 Hz)
 *  • Subtle idle Y/X drift when mouse is centred
 *  • Stronger under-glow disk with animated point-light pulse
 *  • Enhanced lighting: richer rim + screen bounce
 *  • Performance: adaptive DPR, canvas redraws throttled
 *  • Falls back to CSS MacBookMockup when WebGL unavailable
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
// Slide types
// ─────────────────────────────────────────────────────────────────────────────
interface SlideItem {
  title: string;
  category?: string;
  imageUrl?: string | null;
}

// Single placeholder — shows logo screen when no DB projects exist
const PLACEHOLDERS: SlideItem[] = [
  { title: 'pixelnest.al', category: 'Creative Digital Agency' },
];

// Dark-purple gradient palettes (for project placeholder slides)
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
// PixelNest logo — module-level singleton cache
// ─────────────────────────────────────────────────────────────────────────────
let _logoImg: HTMLImageElement | null = null;
let _logoStarted = false;

function ensureLogoLoaded(onReady: () => void): void {
  if (_logoImg) { onReady(); return; }
  if (_logoStarted) return;
  _logoStarted = true;
  const img = new Image();
  img.onload = () => { _logoImg = img; onReady(); };
  img.onerror = () => { /* silent — fallback PN text */ };
  img.src = '/logo.png';
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas helper — rounded rect path
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
  img: HTMLImageElement | null,    // real project image (or null)
  contentAlpha: number,            // 0–1 cross-fade alpha
  placeholderIdx: number,
  time: number,                    // clock.elapsedTime for animation
) {
  const W = SCR_W, H = SCR_H;

  // ── Background ────────────────────────────────────────────────────────────
  ctx.fillStyle = '#04040a';
  ctx.fillRect(0, 0, W, H);

  // ── Browser chrome ────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(16,16,24,0.97)';
  ctx.fillRect(0, 0, W, CHROME_H);

  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, CHROME_H); ctx.lineTo(W, CHROME_H); ctx.stroke();

  // Traffic lights
  ['#ff5f57', '#febc2e', '#28c840'].forEach((color, i) => {
    ctx.beginPath();
    ctx.arc(18 + i * 22, CHROME_H / 2, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // URL pill
  const pillX = 88, pillY = 9, pillW = W - 176, pillH = CHROME_H - 18;
  rrect(ctx, pillX, pillY, pillW, pillH, 5);
  ctx.fillStyle = 'rgba(255,255,255,0.055)'; ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('🔒', pillX + 8, pillY + pillH - 5);
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('pixelnest.al', W / 2, pillY + pillH - 4);

  // Toolbar buttons
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  rrect(ctx, W - 78, 10, 28, 24, 5); ctx.fill();
  rrect(ctx, W - 44, 10, 28, 24, 5); ctx.fill();

  // ── Content area ──────────────────────────────────────────────────────────
  const CY = CHROME_H, CH = H - CY;

  ctx.save();
  ctx.globalAlpha = contentAlpha;

  if (img && img.complete && img.naturalWidth > 0) {
    // ── Real project image (cover-fit) ────────────────────────────────────
    const scale = Math.max(W / img.naturalWidth, CH / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (W - dw) / 2, CY + (CH - dh) / 2, dw, dh);
  } else {
    // ── PixelNest branded logo screen ─────────────────────────────────────
    const gc = PH_GRADIENTS[placeholderIdx % PH_GRADIENTS.length];

    // Slow-moving animated radial gradient background
    const ang = time * 0.22;
    const bgCx = W / 2 + Math.cos(ang) * W * 0.13;
    const bgCy = CY + CH / 2 + Math.sin(ang * 0.71) * CH * 0.09;
    const bgGrad = ctx.createRadialGradient(bgCx, bgCy, 0, bgCx, bgCy, W * 0.75);
    bgGrad.addColorStop(0,    gc[1]);   // bright purple
    bgGrad.addColorStop(0.50, gc[0]);   // deep indigo
    bgGrad.addColorStop(1,    gc[2]);   // near-black edge
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, CY, W, CH);

    // Subtle grid
    ctx.strokeStyle = 'rgba(139,92,246,0.055)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx <= W; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, CY); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (let gy = CY; gy <= H; gy += 40) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    // Vertical scan-line shimmer
    const shimmerX = ((time * 60) % (W + 80)) - 40;
    const shimmer = ctx.createLinearGradient(shimmerX - 20, 0, shimmerX + 20, 0);
    shimmer.addColorStop(0,   'transparent');
    shimmer.addColorStop(0.5, 'rgba(196,167,255,0.035)');
    shimmer.addColorStop(1,   'transparent');
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, CY, W, CH);

    const logo = _logoImg;
    if (logo && logo.complete && logo.naturalWidth > 0) {
      // ── Official logo image ──────────────────────────────────────────────
      const logoDisplayW = 210;
      const logoDisplayH = logoDisplayW * (logo.naturalHeight / logo.naturalWidth);
      const logoX = (W - logoDisplayW) / 2;
      const logoCenterY = CY + CH / 2 - 14; // slightly above vertical centre
      const logoY = logoCenterY - logoDisplayH / 2;

      // Outer pulsing halo
      const pulse = 0.36 + Math.sin(time * 1.05) * 0.08;
      const halo = ctx.createRadialGradient(W / 2, logoCenterY, 0, W / 2, logoCenterY, 210);
      halo.addColorStop(0,   `rgba(139,92,246,${(pulse + 0.12).toFixed(2)})`);
      halo.addColorStop(0.35, `rgba(109,40,217,${(pulse * 0.45).toFixed(2)})`);
      halo.addColorStop(1,   'transparent');
      ctx.fillStyle = halo;
      ctx.fillRect(0, CY, W, CH);

      // Tight inner glow
      const inner = ctx.createRadialGradient(W / 2, logoCenterY, 0, W / 2, logoCenterY, 115);
      inner.addColorStop(0, 'rgba(214,188,255,0.16)');
      inner.addColorStop(1, 'transparent');
      ctx.fillStyle = inner;
      ctx.fillRect(W / 2 - 120, logoY - 30, 240, logoDisplayH + 60);

      // Draw logo with subtle drop shadow
      ctx.shadowColor = 'rgba(139,92,246,0.65)';
      ctx.shadowBlur  = 32;
      ctx.drawImage(logo, logoX, logoY, logoDisplayW, logoDisplayH);
      ctx.shadowBlur  = 0;
      ctx.shadowColor = 'transparent';

      // Tagline
      ctx.fillStyle = 'rgba(196,167,255,0.52)';
      ctx.font = '500 11px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GRAPHIC DESIGN  ·  SOCIAL MEDIA  ·  BRANDING', W / 2, logoY + logoDisplayH + 26);
    } else {
      // ── Text fallback (PN square) while logo loads ────────────────────
      const lx = W / 2 - 32, ly = CY + CH * 0.24, lw = 64, lh = 64;
      const logoGlow = ctx.createRadialGradient(W / 2, ly + lh / 2, 0, W / 2, ly + lh / 2, 72);
      logoGlow.addColorStop(0, 'rgba(139,92,246,0.48)');
      logoGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = logoGlow;
      ctx.fillRect(W / 2 - 72, ly - 12, 144, lh + 24);

      rrect(ctx, lx, ly, lw, lh, 14);
      const logoGrad = ctx.createLinearGradient(lx, ly, lx + lw, ly + lh);
      logoGrad.addColorStop(0, '#8b5cf6');
      logoGrad.addColorStop(1, '#a855f7');
      ctx.fillStyle = logoGrad; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.5;
      rrect(ctx, lx + 0.75, ly + 0.75, lw - 1.5, lh - 1.5, 14); ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 26px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PN', W / 2, ly + lh - 18);

      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '600 20px -apple-system, sans-serif';
      ctx.fillText('PIXEL NEST', W / 2, CY + CH * 0.66);
    }
  }

  ctx.restore();

  // ── Bottom gradient overlay (always above content) ────────────────────────
  const shadow = ctx.createLinearGradient(0, H - 110, 0, H);
  shadow.addColorStop(0, 'transparent');
  shadow.addColorStop(1, 'rgba(0,0,0,0.86)');
  ctx.fillStyle = shadow;
  ctx.fillRect(0, H - 110, W, 110);

  // Labels — only for real project images
  if (img && img.complete && img.naturalWidth > 0) {
    if (item.category) {
      ctx.fillStyle = 'rgba(167,139,250,0.95)';
      ctx.font = '600 11px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.category.toUpperCase(), 20, H - 30);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.title, 20, H - 10);
  } else {
    // Subtle domain hint at bottom for logo screen
    ctx.fillStyle = 'rgba(167,139,250,0.35)';
    ctx.font = '500 10px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('pixelnest.al', W / 2, H - 10);
  }
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
  alpha: number;
  transitioning: boolean;
  images: Map<string, HTMLImageElement>;
  needsDraw: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scale factor — 28% bigger than the previous 1.25 baseline
// ─────────────────────────────────────────────────────────────────────────────
const S = 1.60;

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
  const groupRef    = useRef<THREE.Group>(null!);
  const glowLightRef = useRef<THREE.PointLight>(null!);

  // ── Initialize screen state ──────────────────────────────────────────────
  const screenRef = useRef<ScreenState | null>(null);
  if (!screenRef.current) {
    const canvas = document.createElement('canvas');
    canvas.width  = SCR_W;
    canvas.height = SCR_H;
    const ctx = canvas.getContext('2d')!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace    = THREE.SRGBColorSpace;
    texture.minFilter     = THREE.LinearFilter;
    texture.magFilter     = THREE.LinearFilter;
    texture.generateMipmaps = false;

    screenRef.current = {
      canvas, ctx, texture,
      items: PLACEHOLDERS,
      currentIdx: 0, alpha: 1,
      transitioning: false,
      images: new Map(), needsDraw: true,
    };
    drawScreenFrame(ctx, PLACEHOLDERS[0], null, 1, 0, 0);
    texture.needsUpdate = true;

    // Kick off logo load — mark needsDraw once it arrives
    ensureLogoLoaded(() => {
      if (screenRef.current) screenRef.current.needsDraw = true;
    });
  }

  // ── Sync slides prop ─────────────────────────────────────────────────────
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
      img.onload  = () => { s.images.set(item.imageUrl!, img); s.needsDraw = true; };
      img.onerror = () => {};
      img.src = item.imageUrl;
    });
  }, [slides]);

  // ── Slide interval — skip if single item ─────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const s = screenRef.current!;
      if (s.items.length > 1 && !s.transitioning) s.transitioning = true;
    }, 4600);
    return () => clearInterval(id);
  }, []);

  // ── Glow disk texture ────────────────────────────────────────────────────
  const glowTexture = useMemo(() => {
    const gc = document.createElement('canvas');
    gc.width = 512; gc.height = 256;
    const gx = gc.getContext('2d')!;
    const g = gx.createRadialGradient(256, 128, 0, 256, 128, 230);
    g.addColorStop(0,    'rgba(124,58,237,1.0)');
    g.addColorStop(0.25, 'rgba(109,40,217,0.55)');
    g.addColorStop(0.6,  'rgba(91,33,182,0.18)');
    g.addColorStop(1,    'rgba(0,0,0,0)');
    gx.fillStyle = g;
    gx.fillRect(0, 0, 512, 256);
    const t = new THREE.CanvasTexture(gc);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  // ── useFrame: animation + texture update ─────────────────────────────────
  useFrame(({ clock }, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const t  = clock.elapsedTime;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Slower, smoother float (0.38 Hz)
    g.position.y = Math.sin(t * 0.38) * 0.14;

    // Subtle idle rotation + mouse parallax
    // When mouse is centred (mx≈0, my≈0), the idle drift provides life
    const idleY = Math.sin(t * 0.14) * 0.055 + Math.sin(t * 0.073) * 0.02;
    const idleX = Math.sin(t * 0.11) * 0.018;
    const targetX = idleX - 0.07 + my * 0.10;
    const targetY = idleY  + mx   * 0.18;
    g.rotation.x += (targetX - g.rotation.x) * 0.028; // softer lerp
    g.rotation.y += (targetY - g.rotation.y) * 0.028;

    // Pulse the under-glow light
    if (glowLightRef.current) {
      glowLightRef.current.intensity = 1.0 + Math.sin(t * 0.9) * 0.22;
    }

    // Screen texture animation
    const s = screenRef.current!;

    if (s.transitioning) {
      s.alpha = Math.max(s.alpha - delta * 3.0, 0);
      if (s.alpha <= 0) {
        s.currentIdx   = (s.currentIdx + 1) % s.items.length;
        s.transitioning = false;
      }
      s.needsDraw = true;
    } else if (s.alpha < 1) {
      s.alpha = Math.min(s.alpha + delta * 3.0, 1);
      s.needsDraw = true;
    }

    // Always redraw the logo screen (animated gradient + pulse)
    const curItem = s.items[s.currentIdx];
    const hasRealImg = !!(curItem.imageUrl && s.images.get(curItem.imageUrl)?.complete);
    if (!hasRealImg && s.alpha >= 1 && !s.transitioning) {
      s.needsDraw = true; // keep animating gradient behind logo
    }

    if (s.needsDraw) {
      const item = s.items[s.currentIdx];
      const img  = item.imageUrl ? (s.images.get(item.imageUrl) ?? null) : null;
      drawScreenFrame(s.ctx, item, img, s.alpha, s.currentIdx, t);
      s.texture.needsUpdate = true;
      if (s.alpha >= 1 && !s.transitioning && hasRealImg) s.needsDraw = false;
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
          color="#7a7a7e"
          metalness={0.90}
          roughness={0.14}
          envMapIntensity={1.6}
        />
      </RoundedBox>

      {/* Back-edge chamfer */}
      <mesh position={[0, 0.038 * S, -1.06 * S]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.1 * S, 0.07 * S]} />
        <meshStandardMaterial color="#95959b" metalness={0.80} roughness={0.20} />
      </mesh>

      {/* Keyboard plate */}
      <mesh position={[0, 0.062 * S, 0.02 * S]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.88 * S, 1.88 * S]} />
        <meshStandardMaterial color="#1e1e21" roughness={0.80} metalness={0.08} />
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
        <meshStandardMaterial color="#303034" metalness={0.68} roughness={0.22} />
      </RoundedBox>

      {/* Rubber feet × 4 */}
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
          LID GROUP
          ═══════════════════════════════════════════ */}
      <group position={[0, 1.043 * S, -0.736 * S]} rotation={[0.36, 0, 0]}>

        {/* Lid body — aluminum back */}
        <RoundedBox
          args={[LID_W, LID_H, LID_D]}
          radius={0.05 * S}
          smoothness={4}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#7a7a7e"
            metalness={0.90}
            roughness={0.14}
            envMapIntensity={1.6}
          />
        </RoundedBox>

        {/* Bezel */}
        <mesh position={[0, 0, LID_FRONT_Z + 0.001]}>
          <planeGeometry args={[LID_W - 0.08 * S, LID_H - 0.08 * S]} />
          <meshStandardMaterial color="#0c0c0f" roughness={0.50} metalness={0.12} />
        </mesh>

        {/* Camera notch */}
        <mesh position={[0, LID_H / 2 - 0.055 * S, LID_FRONT_Z + 0.002]}>
          <circleGeometry args={[0.026 * S, 20]} />
          <meshStandardMaterial color="#252527" metalness={0.55} roughness={0.38} />
        </mesh>
        <mesh position={[0, LID_H / 2 - 0.055 * S, LID_FRONT_Z + 0.0015]}>
          <ringGeometry args={[0.026 * S, 0.036 * S, 20]} />
          <meshStandardMaterial color="#1a1a1c" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Screen backing — true black */}
        <mesh position={[0, SCR_PLANE_Y, LID_FRONT_Z + 0.002]}>
          <planeGeometry args={[SCR_PLANE_W + 0.02, SCR_PLANE_H + 0.02]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* ── CanvasTexture screen content ── */}
        <mesh position={[0, SCR_PLANE_Y, LID_FRONT_Z + 0.003]}>
          <planeGeometry args={[SCR_PLANE_W, SCR_PLANE_H]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>

        {/* Screen glass — clearcoat reflection */}
        <mesh position={[0, SCR_PLANE_Y, LID_FRONT_Z + 0.004]}>
          <planeGeometry args={[SCR_PLANE_W, SCR_PLANE_H]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.048}
            roughness={0.0}
            metalness={0.0}
            envMapIntensity={2.2}
            clearcoat={1}
            clearcoatRoughness={0.0}
            reflectivity={0.55}
            depthWrite={false}
          />
        </mesh>

        {/* Top-left specular glint */}
        <mesh
          position={[-SCR_PLANE_W * 0.3, SCR_PLANE_H * 0.36, LID_FRONT_Z + 0.005]}
          rotation={[0, 0, -0.58]}
        >
          <planeGeometry args={[SCR_PLANE_W * 0.82, 0.016 * S]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.055} depthWrite={false} />
        </mesh>

        {/* Bottom-right secondary glint */}
        <mesh
          position={[SCR_PLANE_W * 0.28, -SCR_PLANE_H * 0.3, LID_FRONT_Z + 0.005]}
          rotation={[0, 0, -0.58]}
        >
          <planeGeometry args={[SCR_PLANE_W * 0.55, 0.010 * S]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.028} depthWrite={false} />
        </mesh>

        {/* Screen glow — illuminates front of lid */}
        <pointLight
          position={[0, SCR_PLANE_Y, 0.55]}
          color="#9d6fff"
          intensity={1.1}
          distance={4.5}
        />

        {/* Indirect screen bounce onto keyboard */}
        <pointLight
          position={[0, -LID_H * 0.55, 0.9]}
          color="#7c3aed"
          intensity={0.32}
          distance={3.2 * S}
        />
      </group>

      {/* ═══════════════════════════════════════════
          PURPLE GLOW DISK (under laptop) — animated via light ref
          ═══════════════════════════════════════════ */}
      <mesh
        position={[0, -0.24 * S, 0.18 * S]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[6.2 * S, 4.0 * S]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Shadow receiver */}
      <mesh position={[0, -0.25 * S, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        {/* @ts-ignore */}
        <shadowMaterial transparent opacity={0.32} />
      </mesh>

      {/* Animated under-glow point light */}
      <pointLight
        ref={glowLightRef}
        position={[0, -1.9 * S, 0.5]}
        color="#7c3aed"
        intensity={1.0}
        distance={6.0}
      />

      {/* Keyboard bounce */}
      <pointLight
        position={[0, 0.42 * S, 0.4 * S]}
        color="#6d28d9"
        intensity={0.22}
        distance={2.8 * S}
      />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas wrapper
// ─────────────────────────────────────────────────────────────────────────────
interface CanvasProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  slides: SlideItem[];
  isMobile: boolean;
}

function MacBook3DCanvas({ mouseRef, slides, isMobile }: CanvasProps) {
  return (
    <Canvas
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.5, 9.2], fov: 38 }}
      shadows={isMobile ? false : 'soft'}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>

        {/* ── Lighting ────────────────────────────────────────────────── */}

        {/* Ambient fill */}
        <ambientLight intensity={0.25} />

        {/* Key light — top-right, crisp shadows */}
        <directionalLight
          position={[5, 10, 7]}
          intensity={1.7}
          castShadow={!isMobile}
          shadow-mapSize-width={isMobile ? 512 : 1024}
          shadow-mapSize-height={isMobile ? 512 : 1024}
          shadow-bias={-0.0006}
          shadow-camera-near={0.5}
          shadow-camera-far={32}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Cool fill — left side */}
        <pointLight position={[-6, 4, 4]} color="#818cf8" intensity={0.9} distance={18} />

        {/* Warm rim — bottom front */}
        <pointLight position={[2, -3, 7]} color="#c4b5fd" intensity={0.35} distance={14} />

        {/* Back-accent — purple from above-rear */}
        <pointLight position={[-2.5, 7, -5]} color="#7c3aed" intensity={0.62} distance={16} />

        {/* Screen-spill side light — adds purple tint to right side */}
        <pointLight position={[5, 2, 2]} color="#9d6fff" intensity={0.28} distance={12} />

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
  const [webglOk, setWebglOk]   = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setWebglOk(supportsWebGL());
    setIsMobile(window.innerWidth < 768);
  }, []);

  const slides: SlideItem[] = (projectsData ?? []).slice(0, 8).map(p => ({
    title:    p.title,
    category: p.category ?? undefined,
    imageUrl: p.imageUrl ?? null,
  }));

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x =  ((e.clientX - r.left)  / r.width)  * 2 - 1;
    mouseRef.current.y = -(((e.clientY - r.top)   / r.height) * 2 - 1);
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
  }, []);

  if (webglOk === null) return null;
  if (!webglOk) return <MacBookMockup />;

  return (
    <div
      className="w-full select-none"
      style={{ aspectRatio: '4 / 3', maxWidth: 760 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-hidden="true"
    >
      <MacBookErrorBoundary>
        <MacBook3DCanvas mouseRef={mouseRef} slides={slides} isMobile={isMobile} />
      </MacBookErrorBoundary>
    </div>
  );
}
