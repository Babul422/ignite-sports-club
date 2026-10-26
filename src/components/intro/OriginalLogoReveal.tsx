import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import './OriginalLogoReveal.css';

interface OriginalLogoRevealProps {
  active: boolean;
  revealed: boolean;
  mode?: 'reveal' | 'final'; // 'reveal' for Scene 5, 'final' for Scene 7
  clubName?: string;
  tagline?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onEnterArena: () => void;
  onSkipIntro: () => void;
  reducedMotion?: boolean;
}

export const OriginalLogoReveal: React.FC<OriginalLogoRevealProps> = ({
  active,
  revealed,
  mode = 'final',
  clubName = 'IGNITE SPORTS CLUB',
  tagline = 'PLAY. COMPETE. GROW. TOGETHER.',
  isMuted,
  onToggleMute,
  onEnterArena,
  onSkipIntro,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // High-performance Particle Burst Canvas around the logo
  useEffect(() => {
    if (!active || !revealed) return;
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

    // Particle Burst Embers & Energy Rays
    const burstCount = reducedMotion ? 25 : 95;
    const particles = Array.from({ length: burstCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 5.5;
      const size = 1.5 + Math.random() * 3.0;
      const colorPick = Math.random();
      let color = '#287BFF';
      if (colorPick < 0.4) color = '#287BFF';
      else if (colorPick < 0.75) color = '#8B5CF6';
      else if (colorPick < 0.9) color = '#62C7FF';
      else color = '#FFFFFF';

      return {
        x: width * 0.5,
        y: height * 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color,
        alpha: 0.8 + Math.random() * 0.2,
        decay: 0.008 + Math.random() * 0.015,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.vx *= 0.985;
        p.vy *= 0.985;

        if (p.alpha > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [active, revealed, reducedMotion]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEnterArena();
    }
  };

  if (!active) return null;

  return (
    <div
      className={`original-logo-reveal-stage ${active ? 'is-active' : ''} ${
        revealed ? 'is-revealed' : ''
      } mode-${mode}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="IGNITE Sports Club Brand Reveal"
    >
      {/* Background Atmosphere */}
      <div className="logo-reveal-backdrop" aria-hidden="true" />

      {/* Particle Burst Canvas */}
      <canvas ref={canvasRef} className="logo-particle-burst-canvas" />

      {/* Central Content */}
      <div className="logo-reveal-content">
        {/* Logo Artwork Anchor with Surrounding Effects */}
        <div className="logo-artwork-anchor">
          {/* Outer Breathing Radial Glow Aura */}
          <div className="logo-glow-aura-outer" aria-hidden="true" />

          {/* Inner Core Pulse Glow Aura */}
          <div className="logo-glow-aura-inner" aria-hidden="true" />

          {/* Emblem Container Preserving Aspect Ratio */}
          <div className="logo-emblem-container">
            {/* THE EXACT ORIGINAL LOGO ASSET — UNTOUCHED */}
            <img
              src="/ignite-logo.jpg"
              alt="IGNITE SPORTS CLUB — EST. 2026 Original Official Logo"
              className="ignite-official-original-logo"
              loading="eager"
              decoding="async"
            />

            {/* Specular Light Sweep Gleam passing over emblem */}
            <div className="logo-light-sweep" aria-hidden="true" />
          </div>
        </div>

        {/* Club Brand Typography */}
        <div className="logo-brand-block">
          <div className="logo-badge-ticker">
            <span className="ticker-pulse-dot" />
            <span>OFFICIAL ATHLETIC CLUB • EST. 2026</span>
          </div>

          <h1 className="logo-club-title">{clubName}</h1>
          {mode === 'final' && (
            <p className="logo-club-tagline">{tagline}</p>
          )}
        </div>

        {/* Action Controls (Active in Final Mode) */}
        {mode === 'final' && (
          <>
            <div className="logo-reveal-actions">
              <button
                type="button"
                className="arena-enter-cta"
                onClick={onEnterArena}
                aria-label="Enter the sports club arena"
              >
                <span>ENTER ARENA</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="arena-skip-cta"
                onClick={onSkipIntro}
                aria-label="Skip to homepage"
              >
                <span>SKIP TO SITE</span>
              </button>
            </div>

            {/* Audio Mute/Unmute Control */}
            <div className="logo-sound-row">
              <button
                type="button"
                className="audio-toggle-pill"
                onClick={onToggleMute}
                aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span className={isMuted ? 'audio-muted-dot' : 'audio-live-dot'} />
                <span>{isMuted ? 'AUDIO: OFF' : 'AUDIO: LIVE'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
