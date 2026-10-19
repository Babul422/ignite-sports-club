import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './TapToEnter.css';

interface TapToEnterProps {
  onEnter: () => void;
  onSkip: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TapToEnter: React.FC<TapToEnterProps> = ({
  onEnter,
  onSkip,
  isMuted,
  onToggleMute,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Atmospheric Cosmic Smoke & Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.15,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? '#287BFF' : '#8B5CF6',
    }));

    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Atmospheric Smoky Waves
      const cx = width * 0.5;
      const cy = height * 0.5;

      const smokeGrad1 = ctx.createRadialGradient(
        cx + Math.sin(time * 0.7) * 40,
        cy + Math.cos(time * 0.5) * 30,
        10,
        cx,
        cy,
        Math.max(width, height) * 0.65
      );
      smokeGrad1.addColorStop(0, 'rgba(40, 123, 255, 0.12)');
      smokeGrad1.addColorStop(0.45, 'rgba(139, 92, 246, 0.08)');
      smokeGrad1.addColorStop(1, 'rgba(8, 11, 24, 0)');
      ctx.fillStyle = smokeGrad1;
      ctx.fillRect(0, 0, width, height);

      // 2. Cosmic Floating Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * (0.6 + Math.sin(time + p.x) * 0.4);
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div
      ref={containerRef}
      className="tap-to-enter-screen"
      role="button"
      tabIndex={0}
      aria-label="Tap to enter IGNITE Sports Club cinematic experience"
      onClick={onEnter}
      onKeyDown={handleKeyDown}
    >
      {/* Background Smoke & Particles Canvas */}
      <canvas ref={canvasRef} className="tap-smoke-canvas" />

      {/* Volumetric Blue & Purple Light Rays */}
      <div className="tap-light-ray ray-left" aria-hidden="true" />
      <div className="tap-light-ray ray-right" aria-hidden="true" />
      <div className="tap-light-ray ray-center" aria-hidden="true" />

      {/* Top HUD for Accessibility: Audio & Direct Skip */}
      <div className="tap-top-hud" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="tap-hud-btn"
          onClick={onToggleMute}
          title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
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

      {/* Central Interactive Indicator */}
      <div className="tap-center-target">
        {/* Glowing Concentric Circular Rings */}
        <div className="circular-pulse-outer" />
        <div className="circular-pulse-middle" />
        <div className="circular-pulse-core">
          <div className="core-dot" />
        </div>

        {/* Cinematic Typography */}
        <div className="tap-typography-wrap">
          <h1 className="tap-title">TAP TO ENTER</h1>
          <div className="tap-sub-brand">
            <span className="brand-dot" />
            <span>IGNITE SPORTS CLUB • EST. 2026</span>
            <span className="brand-dot" />
          </div>
        </div>

        {/* Subtle Interactive Instruction Pill */}
        <div className="tap-instruction-pill">
          <span>CLICK ANYWHERE OR PRESS SPACE</span>
        </div>
      </div>
    </div>
  );
};
