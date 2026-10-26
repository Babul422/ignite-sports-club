import React, { useEffect, useRef } from 'react';
import './FireTransitionOverlay.css';

interface FireTransitionOverlayProps {
  active: boolean;
  progress: number; // 0 to 1
  logoRevealed: boolean;
  onEnterArena: () => void;
  onSkipIntro: () => void;
}

export const FireTransitionOverlay: React.FC<FireTransitionOverlayProps> = ({
  active,
  progress,
  logoRevealed,
  onEnterArena,
  onSkipIntro,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stylized Cosmic Blue & Purple Flame Vortex Canvas
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Cosmic Fire Ember Particles
    const emberCount = 120;
    const embers = Array.from({ length: emberCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 50 + Math.random() * Math.max(width, height) * 0.45,
      speed: 1.5 + Math.random() * 3.5,
      radius: 1.5 + Math.random() * 3.0,
      color: Math.random() > 0.5 ? '#287BFF' : Math.random() > 0.3 ? '#8B5CF6' : '#62C7FF',
      alpha: 0.2 + Math.random() * 0.7,
      spiralDir: Math.random() > 0.5 ? 1 : -1,
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;

      // 1. Swirling Blue-Purple Radial Flame Core
      const flameRadius = Math.max(width, height) * (0.15 + progress * 0.65);
      const grad = ctx.createRadialGradient(
        cx + Math.sin(frame * 0.05) * 20,
        cy + Math.cos(frame * 0.05) * 20,
        20,
        cx,
        cy,
        flameRadius
      );
      grad.addColorStop(0, 'rgba(98, 199, 255, 0.45)');
      grad.addColorStop(0.3, 'rgba(40, 123, 255, 0.35)');
      grad.addColorStop(0.65, 'rgba(139, 92, 246, 0.25)');
      grad.addColorStop(1, 'rgba(8, 11, 24, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Swirling Embers Vortex
      embers.forEach((e) => {
        e.angle += 0.035 * e.spiralDir;
        e.dist += Math.sin(frame * 0.02 + e.angle) * 1.5;

        const x = cx + Math.cos(e.angle) * e.dist;
        const y = cy + Math.sin(e.angle) * e.dist;

        ctx.beginPath();
        ctx.arc(x, y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.globalAlpha = e.alpha * Math.min(1, progress * 1.6);
        ctx.shadowBlur = 12;
        ctx.shadowColor = e.color;
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
  }, [active, progress]);

  if (!active) return null;

  return (
    <div className={`fire-transition-overlay ${logoRevealed ? 'logo-active' : ''}`}>
      {/* Dynamic Cosmic Fire Vortex Canvas */}
      <canvas ref={canvasRef} className="fire-vortex-canvas" />

      {/* Official IGNITE Sports Club Logo Reveal */}
      <div className={`fire-logo-reveal-container ${logoRevealed ? 'revealed' : ''}`}>
        <div className="fire-logo-glow-aura" aria-hidden="true" />
        <div className="fire-logo-artwork-wrap">
          <img
            src="/ignite-logo.jpg"
            alt="IGNITE SPORTS CLUB — EST. 2026"
            className="fire-official-logo-img"
          />
        </div>

        <div className="fire-brand-text">
          <div className="fire-brand-ticker">
            <span className="ticker-pulse-dot" />
            OFFICIAL ATHLETIC CLUB • EST. 2026
          </div>
          <h1 className="fire-brand-title">IGNITE SPORTS CLUB</h1>
          <p className="fire-brand-tagline">PLAY. COMPETE. GROW. TOGETHER.</p>
        </div>

        {/* Enter Arena & Skip CTAs */}
        <div className="fire-action-buttons">
          <button
            type="button"
            className="sports-cut-button primary fire-enter-btn"
            onClick={onEnterArena}
          >
            <span>ENTER ARENA</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <button
            type="button"
            className="sports-cut-button secondary fire-skip-btn"
            onClick={onSkipIntro}
          >
            <span>GO TO HOMEPAGE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
