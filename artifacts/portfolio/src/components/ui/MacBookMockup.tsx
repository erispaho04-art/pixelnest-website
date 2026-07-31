import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export function MacBookMockup() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = ((e.clientX - cx) / (rect.width / 2)) * 9;
    const y = ((e.clientY - cy) / (rect.height / 2)) * -7;
    setTilt({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center select-none w-full max-w-[520px]"
      style={{ perspective: '1400px' }}
    >
      {/* Ambient glow behind */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(139,92,246,0.22) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transform: `perspective(1400px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 0.12s ease',
          filter:
            'drop-shadow(0 50px 80px rgba(0,0,0,0.65)) drop-shadow(0 20px 30px rgba(139,92,246,0.25))',
          width: '100%',
        }}
      >
        {/* Screen lid */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16/10',
            borderRadius: '12px 12px 2px 2px',
            background: 'linear-gradient(160deg, #2c2c2e 0%, #1c1c1e 50%, #111113 100%)',
            padding: '10px 10px 8px',
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.12)',
            position: 'relative',
          }}
        >
          {/* Camera */}
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#2a2a2c',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
            }}
          />

          {/* Screen */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 6,
              overflow: 'hidden',
              background: 'linear-gradient(145deg, #09090f 0%, #0d0818 40%, #080810 100%)',
              position: 'relative',
            }}
          >
            {/* Browser chrome */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 10px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
              <div
                style={{
                  flex: 1,
                  height: 14,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.05)',
                  margin: '0 16px',
                }}
              />
            </div>

            {/* Nav bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(168,85,247,0.6) 100%)',
                  }}
                />
                <div style={{ width: 40, height: 5, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[28, 22, 32, 20].map((w, i) => (
                  <div key={i} style={{ width: w, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }} />
                ))}
              </div>
              <div
                style={{
                  width: 52,
                  height: 16,
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, rgba(139,92,246,0.7) 0%, rgba(168,85,247,0.5) 100%)',
                  boxShadow: '0 0 8px rgba(139,92,246,0.35)',
                }}
              />
            </div>

            {/* Hero area */}
            <div
              style={{
                padding: '14px 14px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div style={{ width: 50, height: 3, borderRadius: 2, background: 'rgba(139,92,246,0.6)', marginBottom: 6 }} />
              <div style={{ width: 110, height: 8, borderRadius: 3, background: 'rgba(255,255,255,0.55)', marginBottom: 5 }} />
              <div style={{ width: 80, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)', marginBottom: 10 }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <div
                  style={{
                    width: 56,
                    height: 16,
                    borderRadius: 3,
                    background: 'rgba(139,92,246,0.8)',
                    boxShadow: '0 0 10px rgba(139,92,246,0.5)',
                  }}
                />
                <div
                  style={{
                    width: 56,
                    height: 16,
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'transparent',
                  }}
                />
              </div>
            </div>

            {/* Project cards row */}
            <div style={{ padding: '10px 10px', display: 'flex', gap: 6 }}>
              {[
                { from: 'rgba(88,28,135,0.5)', to: 'rgba(76,29,149,0.3)' },
                { from: 'rgba(109,40,217,0.4)', to: 'rgba(67,20,179,0.3)' },
                { from: 'rgba(126,34,206,0.45)', to: 'rgba(88,28,135,0.25)' },
              ].map((grad, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    aspectRatio: '4/3',
                    borderRadius: 5,
                    background: `linear-gradient(135deg, ${grad.from} 0%, ${grad.to} 100%)`,
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      left: 4,
                      right: 4,
                      height: 3,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.2)',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Glass reflection */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 45%, rgba(139,92,246,0.04) 100%)',
                pointerEvents: 'none',
                borderRadius: 6,
              }}
            />
          </div>
        </div>

        {/* Hinge */}
        <div
          style={{
            height: 5,
            background: 'linear-gradient(180deg, #1a1a1c 0%, #222224 100%)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
          }}
        />

        {/* Base */}
        <div
          style={{
            height: 20,
            background: 'linear-gradient(180deg, #2a2a2c 0%, #1e1e20 35%, #161618 100%)',
            borderRadius: '0 0 10px 10px',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 40px rgba(0,0,0,0.7)',
            position: 'relative',
          }}
        >
          {/* Trackpad hint */}
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 90,
              height: 7,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
