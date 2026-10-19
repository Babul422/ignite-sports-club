import React, { useEffect, useRef, useState } from 'react';
import './CinematicVideoScene.css';

export type SportsVideoSceneType = 'football' | 'cricket' | 'badminton' | 'basketball';

interface CinematicVideoSceneProps {
  currentScene: SportsVideoSceneType;
  sceneProgress: number; // 0 to 1
  reducedMotion?: boolean;
}

interface VideoConfig {
  src: string;
  type: string;
  label: string;
  tagline: string;
  number: string;
  playbackRate?: number;
  startTime?: number;
}

const VIDEO_CONFIGS: Record<SportsVideoSceneType, VideoConfig> = {
  football: {
    src: '/videos/football-goal.mp4',
    type: 'video/mp4',
    label: 'FOOTBALL ARENA',
    tagline: 'PRECISION STRIKE • GOAL FINISH',
    number: '01',
    playbackRate: 1.0,
    startTime: 0,
  },
  cricket: {
    src: '/videos/cricket-hit.webm',
    type: 'video/webm',
    label: 'CRICKET DIVISION',
    tagline: 'POWER DRIVE • WILLOW CONTACT',
    number: '02',
    playbackRate: 1.1,
    startTime: 2.0, // jump straight to the bowler delivery and cover drive
  },
  badminton: {
    src: '/videos/badminton-smash.mp4',
    type: 'video/mp4',
    label: 'RACQUET CLUB',
    tagline: 'HYPERSONIC SMASH • COURT RALLY',
    number: '03',
    playbackRate: 1.15,
    startTime: 1.0,
  },
  basketball: {
    src: '/videos/basketball-shot.mp4',
    type: 'video/mp4',
    label: 'HARDWOOD ARENA',
    tagline: 'ELEVATION SHOT • CLEAN SWISH',
    number: '04',
    playbackRate: 1.0,
    startTime: 0.5,
  },
};

export const CinematicVideoScene: React.FC<CinematicVideoSceneProps> = ({
  currentScene,
  sceneProgress,
  reducedMotion = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errorScenes, setErrorScenes] = useState<Record<string, boolean>>({});
  const config = VIDEO_CONFIGS[currentScene];
  const hasError = !!errorScenes[currentScene];

  // Handle video playback and time seeking on scene change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = config.startTime || 0;
    video.playbackRate = config.playbackRate || 1.0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy or seek handled gracefully
      });
    }
  }, [currentScene, config]);

  return (
    <div className={`cinematic-video-stage scene-${currentScene}`}>
      {/* Real Sports Cinematic Video Player */}
      {!hasError ? (
        <video
          ref={videoRef}
          key={config.src}
          className={`cinematic-sport-video ${reducedMotion ? 'reduced-motion' : ''}`}
          src={config.src}
          autoPlay
          muted
          playsInline
          loop
          onError={() => setErrorScenes((prev) => ({ ...prev, [currentScene]: true }))}
        />
      ) : (
        /* Graceful Fallback if video is unavailable */
        <div className="video-fallback-card">
          <div className="fallback-pulse" />
          <span className="fallback-text">IGNITE {config.label}</span>
        </div>
      )}

      {/* Cinematic Brand Grade Overlays (Midnight Vignette & Electric Blue/Cosmic Purple Tint) */}
      <div className="cinematic-color-grade" aria-hidden="true" />
      <div className="cinematic-vignette" aria-hidden="true" />
      <div className="cinematic-speed-lines" aria-hidden="true" />

      {/* Dynamic HUD Overlay for authentic sports broadcast aesthetic */}
      <div className="sports-broadcast-hud">
        <div className="hud-scene-counter">
          <span className="counter-num">{config.number}</span>
          <span className="counter-divider">/</span>
          <span className="counter-total">04</span>
        </div>

        <div className="hud-title-box">
          <div className="hud-badge">
            <span className="badge-live-dot" />
            <span>IGNITE CINEMATIC ACTION</span>
          </div>
          <h2 className="hud-sport-title">{config.label}</h2>
          <p className="hud-sport-tagline">{config.tagline}</p>
        </div>

        {/* Scene Progress Scrub Bar */}
        <div className="hud-progress-track">
          <div
            className="hud-progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, sceneProgress * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
