import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './TapToEnter.css';

interface TapToEnterProps {
  onEnter: () => void;
  onSkip: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

// Procedural Offscreen Smoke Puff Texture Generator
// Creates realistic, multi-lobed organic cloud puffs with soft falloff
function createSmokeTexture(
  type: 'blue' | 'purple' | 'navy' | 'cyan',
  size = 384
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const center = size / 2;
  const maxR = size * 0.46;

  // Colors based on cinematic reference:
  // Midnight-blue, cosmic-purple, subtle cyan highlight, and deep dark navy vapor
  let r: number, g: number, b: number;
  if (type === 'blue') {
    r = 22; g = 70; b = 172; // Royal midnight-blue
  } else if (type === 'purple') {
    r = 92; g = 32; b = 168; // Cosmic-purple
  } else if (type === 'cyan') {
    r = 32; g = 112; b = 215; // Subtle cyan highlight wisp
  } else {
    r = 9; g = 22; b = 62; // Deep dark navy vapor
  }

  // Base central soft gradient
  const baseGrad = ctx.createRadialGradient(center, center, 0, center, center, maxR);
  baseGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.35)`);
  baseGrad.addColorStop(0.38, `rgba(${r}, ${g}, ${b}, 0.22)`);
  baseGrad.addColorStop(0.72, `rgba(${r}, ${g}, ${b}, 0.06)`);
  baseGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.arc(center, center, maxR, 0, Math.PI * 2);
  ctx.fill();

  // Multi-frequency organic lobes simulating smoke tendrils and cloud billows
  const lobes = [
    { a: 0.25, d: 0.28, r: 0.52, op: 0.24 },
    { a: 0.85, d: 0.36, r: 0.44, op: 0.18 },
    { a: 1.55, d: 0.22, r: 0.60, op: 0.26 },
    { a: 2.35, d: 0.32, r: 0.50, op: 0.22 },
    { a: 3.10, d: 0.38, r: 0.42, op: 0.16 },
    { a: 3.85, d: 0.24, r: 0.56, op: 0.24 },
    { a: 4.60, d: 0.34, r: 0.46, op: 0.20 },
    { a: 5.40, d: 0.28, r: 0.48, op: 0.19 },
    // Inner swirling lobes for volumetric density
    { a: 1.05, d: 0.14, r: 0.65, op: 0.28 },
    { a: 3.55, d: 0.15, r: 0.62, op: 0.26 },
    { a: 5.15, d: 0.12, r: 0.58, op: 0.22 },
  ];

  lobes.forEach((l) => {
    const lx = center + Math.cos(l.a) * (size * l.d);
    const ly = center + Math.sin(l.a) * (size * l.d);
    const lr = maxR * l.r;

    const lobeR = type === 'purple' ? Math.min(255, r + 24) : r;
    const lobeG = type === 'cyan' || type === 'blue' ? Math.min(255, g + 22) : g;
    const lobeB = Math.min(255, b + 28);

    const lobeGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
    lobeGrad.addColorStop(0, `rgba(${lobeR}, ${lobeG}, ${lobeB}, ${l.op})`);
    lobeGrad.addColorStop(0.48, `rgba(${r}, ${g}, ${b}, ${l.op * 0.45})`);
    lobeGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = lobeGrad;
    ctx.beginPath();
    ctx.arc(lx, ly, lr, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas;
}

export const TapToEnter: React.FC<TapToEnterProps> = ({
  onEnter,
  onSkip,
  isMuted,
  onToggleMute,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  // Realistic Atmospheric Smoke along Left, Right, & Bottom (Center kept dark & clear)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate reusable procedural smoke puff sprites offscreen for maximum performance
    const texBlue = createSmokeTexture('blue', 384);
    const texPurple = createSmokeTexture('purple', 384);
    const texNavy = createSmokeTexture('navy', 384);
    const texCyan = createSmokeTexture('cyan', 384);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Left Edge Volumetric Midnight-Blue Smoke Plumes
    const leftCount = 18;
    const leftPuffs = Array.from({ length: leftCount }, () => {
      const roll = Math.random();
      const texture = roll < 0.5 ? texBlue : roll < 0.75 ? texNavy : texCyan;
      return {
        xBase: Math.random() * 0.24 - 0.05,
        y: Math.random() * height * 1.2 - height * 0.1,
        radius: 210 + Math.random() * 210,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -Math.random() * 0.22 - 0.08,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0022,
        opacity: 0.55 + Math.random() * 0.35,
        texture,
        phase: Math.random() * Math.PI * 2,
      };
    });

    // 2. Right Edge Volumetric Smoke Plumes with Cosmic-Purple Highlights
    const rightCount = 18;
    const rightPuffs = Array.from({ length: rightCount }, () => {
      const roll = Math.random();
      const texture = roll < 0.42 ? texPurple : roll < 0.75 ? texBlue : texNavy;
      return {
        xBase: 0.76 + Math.random() * 0.26,
        y: Math.random() * height * 1.2 - height * 0.1,
        radius: 210 + Math.random() * 210,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -Math.random() * 0.22 - 0.08,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0022,
        opacity: 0.55 + Math.random() * 0.35,
        texture,
        phase: Math.random() * Math.PI * 2,
      };
    });

    // 3. Bottom Atmospheric Fog Layer (Drifting across lower region)
    const bottomCount = 14;
    const bottomPuffs = Array.from({ length: bottomCount }, () => {
      const xRatio = 0.04 + Math.random() * 0.92;
      // More cosmic-purple towards the right, blue/navy in center/left
      const roll = Math.random();
      const texture =
        xRatio > 0.62 && roll > 0.3
          ? texPurple
          : roll > 0.45
          ? texBlue
          : texNavy;

      return {
        xBase: xRatio,
        y: height * 0.70 + Math.random() * (height * 0.34),
        radius: 250 + Math.random() * 230,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -Math.random() * 0.12 - 0.04,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0016,
        opacity: 0.48 + Math.random() * 0.32,
        texture,
        phase: Math.random() * Math.PI * 2,
      };
    });

    // 4. Subtle Drifting Cosmic Particles (Electric Blue & Purple Stardust)
    const particleCount = 38;
    const particles = Array.from({ length: particleCount }, () => {
      const colorRoll = Math.random();
      const color =
        colorRoll < 0.45
          ? '#38BDF8'
          : colorRoll < 0.8
          ? '#C084FC'
          : '#60A5FA';

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.28 - 0.08,
        color,
        opacity: Math.random() * 0.5 + 0.25,
        pulseSpeed: 1.5 + Math.random() * 2,
        seed: Math.random() * Math.PI * 2,
      };
    });

    let time = 0;
    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Safe clearance radius around center portal
      const centerX = width / 2;
      const centerY = height / 2;
      const minClearRadius = width < 640 ? 140 : 210;
      const transitionZone = 110;

      // Draw all smoke puff layers: Left, Right, Bottom
      const allPuffs = [...leftPuffs, ...rightPuffs, ...bottomPuffs];

      allPuffs.forEach((puff) => {
        puff.y += puff.vy;
        puff.angle += puff.rotSpeed;

        // Reset if drifted past top
        if (puff.y < -puff.radius) {
          puff.y = height + puff.radius * 0.7;
        }

        const puffX =
          puff.xBase * width + Math.sin(time + puff.phase + puff.y * 0.005) * 25;

        // Calculate distance to center portal to guarantee center void remains clean
        const dx = puffX - centerX;
        const dy = puff.y - centerY;
        const distToCenter = Math.sqrt(dx * dx + dy * dy);

        let clearFactor = 1;
        if (distToCenter < minClearRadius + transitionZone) {
          clearFactor = Math.max(0, (distToCenter - minClearRadius) / transitionZone);
        }

        if (clearFactor <= 0.02) return;

        // Subtle scale breathing for natural organic billowing
        const scale = 1 + Math.sin(time * 0.6 + puff.phase) * 0.06;
        const drawRadius = puff.radius * scale;

        ctx.save();
        ctx.translate(puffX, puff.y);
        ctx.rotate(puff.angle);
        ctx.globalAlpha = puff.opacity * clearFactor;
        ctx.drawImage(
          puff.texture,
          -drawRadius,
          -drawRadius,
          drawRadius * 2,
          drawRadius * 2
        );
        ctx.restore();
      });

      // Soft blue-purple bottom atmospheric mist wash
      const bottomHazeHeight = Math.min(height * 0.38, 360);
      const bottomHaze = ctx.createLinearGradient(
        0,
        height,
        0,
        height - bottomHazeHeight
      );
      bottomHaze.addColorStop(0, 'rgba(22, 60, 145, 0.24)');
      bottomHaze.addColorStop(0.45, 'rgba(65, 25, 125, 0.12)');
      bottomHaze.addColorStop(1, 'rgba(2, 4, 10, 0)');
      ctx.fillStyle = bottomHaze;
      ctx.fillRect(0, height - bottomHazeHeight, width, bottomHazeHeight);

      // Render Subtle Glowing Cosmic Dust Particles
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.seed) * 0.15;
        p.y += p.vy;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        const alphaPulse =
          p.opacity * (0.65 + Math.sin(time * p.pulseSpeed + p.seed) * 0.35);
        ctx.globalAlpha = Math.max(0.1, Math.min(1, alphaPulse));
        ctx.shadowBlur = 7;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Handle Smooth Expanding Ring Trigger
  const handleTriggerEnter = useCallback(() => {
    if (isExpanding) return;
    setIsExpanding(true);

    // Expand ring smoothly then trigger cinematic start
    setTimeout(() => {
      onEnter();
    }, 450);
  }, [isExpanding, onEnter]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTriggerEnter();
    }
  };

  return (
    <div
      ref={containerRef}
      className="tap-to-enter-screen"
      role="button"
      tabIndex={0}
      aria-label="Tap to enter IGNITE Sports Club"
      onClick={handleTriggerEnter}
      onKeyDown={handleKeyDown}
    >
      {/* Cinematic Atmospheric Lighting Layers */}
      <div className="tap-bg-ambient tap-ambient-left" aria-hidden="true" />
      <div className="tap-bg-ambient tap-ambient-right" aria-hidden="true" />
      <div className="tap-bg-ambient tap-ambient-bottom" aria-hidden="true" />
      <div className="tap-ambient-fog" aria-hidden="true" />

      {/* Volumetric Smoke & Dust Canvas */}
      <canvas ref={canvasRef} className="tap-smoke-canvas" />

      {/* Deep Center Vignette ensuring the glowing circular portal has pristine focus */}
      <div className="tap-center-vignette" aria-hidden="true" />

      {/* Top HUD Controls */}
      <div className="tap-top-hud" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="tap-hud-btn"
          onClick={onToggleMute}
          title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>{isMuted ? 'SOUND: OFF' : 'SOUND: ON'}</span>
        </button>

        <button
          type="button"
          className="tap-hud-btn skip-link"
          onClick={onSkip}
          title="Directly enter homepage"
          aria-label="Directly enter homepage"
        >
          <span>SKIP TO SITE</span>
        </button>
      </div>

      {/* Centered Glowing Circular Portal */}
      <div
        id="tap-to-enter-button"
        data-testid="tap-to-enter-portal"
        className="portal-container"
        onClick={handleTriggerEnter}
      >
        <div className="portal-circle" onClick={handleTriggerEnter}>
          {/* Two Thin Glowing Concentric Rings: Electric Blue (left) to Cosmic Purple (right) */}
          <svg
            className="portal-rings-svg"
            viewBox="0 0 280 280"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              {/* Left-to-Right Gradient: Electric Blue -> Cosmic Purple */}
              <linearGradient
                id="portalRingGrad"
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
              >
                <stop offset="0%" stopColor="#287BFF" />
                <stop offset="30%" stopColor="#38BDF8" />
                <stop offset="70%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>

              {/* Glowing Filter */}
              <filter id="ringGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer Thin Ring */}
            <circle
              className="portal-outer-ring"
              cx="140"
              cy="140"
              r="126"
              stroke="url(#portalRingGrad)"
              strokeWidth="2.2"
              filter="url(#ringGlowFilter)"
            />

            {/* Inner Thin Ring */}
            <circle
              className="portal-inner-ring"
              cx="140"
              cy="140"
              r="110"
              stroke="url(#portalRingGrad)"
              strokeWidth="1.8"
              filter="url(#ringGlowFilter)"
            />
          </svg>

          {/* Centered Text: TAP TO ENTER in Uppercase White Futuristic Typography */}
          <div className="portal-text-wrap">
            <span className="portal-line-tap">TAP TO</span>
            <span className="portal-line-enter">ENTER</span>
          </div>
        </div>

        {/* Two Small Glowing Upward Chevrons Below Portal */}
        <div className="portal-chevrons" aria-hidden="true">
          <svg
            className="portal-chevron-svg"
            width="26"
            height="22"
            viewBox="0 0 26 22"
            fill="none"
          >
            <path
              d="M5 10L13 3L21 10"
              stroke="#38BDF8"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 18L13 11L21 18"
              stroke="#38BDF8"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Expanding Ring Transition Effect when Tapped */}
      {isExpanding && <div className="expanding-transition-ring" aria-hidden="true" />}
    </div>
  );
};
